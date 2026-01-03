import React, { useEffect, useMemo, useState } from "react";
import {
  GoogleMap,
  Marker,
  Polyline,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";
import DashBoardLayout from "../layouts/DashBoardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = { lat: 13.0827, lng: 80.2707 };

const formatTime = (ts) => {
  if (!ts) return "-";
  const d = new Date(ts.replace(" ", "T"));
  if (isNaN(d)) return "-";
  return d.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const spreadPosition = (lat, lng, index) => {
  const spread = (index % 6) * 0.00002;
  return { lat: lat + spread, lng: lng - spread };
};

const getMidPoint = (p1, p2) => ({
  lat: (p1.lat + p2.lat) / 2,
  lng: (p1.lng + p2.lng) / 2,
});

const Tracker = () => {
  useUserAuth();

  const [workers, setWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [hoverMarker, setHoverMarker] = useState(null);
  const [hoverSegment, setHoverSegment] = useState(null);
  const [segmentDistances, setSegmentDistances] = useState({});
  const [error, setError] = useState(null);
  const [icons, setIcons] = useState(null);
  const [mapKey, setMapKey] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const GOOGLE_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_KEY,
    libraries: ["geometry"],
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "");
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/api/tracker/workers`)
      .then((r) => r.json())
      .then(setWorkers)
      .catch(() => setError("Failed to load workers"));
  }, []);

  useEffect(() => {
    setAssignments([]);
    setHoverMarker(null);
    setHoverSegment(null);
    setSegmentDistances({});
    setMapKey(Date.now());

    if (!selectedWorker) return;

    fetch(`${API_URL}/api/tracker/assignments/${selectedWorker}`)
      .then((r) => r.json())
      .then((d) => setAssignments(d?.points || []))
      .catch(() => setError("Failed to load assignments"));
  }, [selectedWorker]);

  const visitedPath = useMemo(() => {
    return assignments
      .filter(
        (p) =>
          p.visited &&
          p.timestamp &&
          !isNaN(new Date(p.timestamp.replace(" ", "T")))
      )
      .sort(
        (a, b) =>
          new Date(a.timestamp.replace(" ", "T")) -
          new Date(b.timestamp.replace(" ", "T"))
      )
      .map((p) => ({ lat: p.lat, lng: p.lng }));
  }, [assignments]);

  /** 🔥 FETCH REAL ROAD DISTANCES USING GOOGLE DIRECTIONS */
  useEffect(() => {
    if (!window.google || visitedPath.length < 2) return;

    const service = new window.google.maps.DirectionsService();
    const distances = {};

    const fetchDistances = async () => {
      for (let i = 0; i < visitedPath.length - 1; i++) {
        const origin = visitedPath[i];
        const destination = visitedPath[i + 1];

        await new Promise((resolve) => {
          service.route(
            {
              origin,
              destination,
              travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
              if (
                status === "OK" &&
                result.routes[0]?.legs[0]?.distance
              ) {
                distances[i] =
                  result.routes[0].legs[0].distance.text; // eg: "5.3 km"
              } else {
                distances[i] = "-";
              }
              resolve();
            }
          );
        });
      }

      setSegmentDistances(distances);
    };

    fetchDistances();
  }, [visitedPath]);

  const handleMapLoad = () => {
    if (window.google) {
      setIcons({
        green: {
          url: "https://maps.google.com/mapfiles/kml/paddle/grn-circle.png",
          scaledSize: new window.google.maps.Size(36, 36),
        },
        red: {
          url: "https://maps.google.com/mapfiles/kml/paddle/red-circle.png",
          scaledSize: new window.google.maps.Size(36, 36),
        },
      });
    }
  };

  return (
    <DashBoardLayout activeMenu="Tracker">
      <div className="h-screen flex flex-col px-4 overflow-hidden">
        <div className="shrink-0 mt-4 flex justify-between items-center p-4 rounded-xl shadow-sm bg-white">
          <h1 className="text-2xl font-bold">📍 Tracker</h1>

          <select
            value={selectedWorker}
            onChange={(e) => setSelectedWorker(e.target.value)}
            className="w-64 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Choose Executive</option>
            {workers.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="absolute top-20 right-6 bg-red-100 text-red-700 px-4 py-2 rounded-lg shadow">
            {error}
          </div>
        )}

        <div className="h-[73%] mt-4 rounded-xl overflow-hidden shadow">
          {isLoaded && (
            <GoogleMap
              key={mapKey}
              mapContainerStyle={containerStyle}
              center={defaultCenter}
              zoom={11}
              onLoad={handleMapLoad}
            >
              {icons &&
                assignments.map((point, index) => {
                  const pos = spreadPosition(point.lat, point.lng, index);

                  return (
                    <Marker
                      key={point.id}
                      position={pos}
                      icon={point.visited ? icons.green : icons.red}
                      onMouseOver={() => setHoverMarker(point.id)}
                      onMouseOut={() => setHoverMarker(null)}
                    >
                      {hoverMarker === point.id && (
                        <InfoWindow
                          options={{
                            disableAutoPan: true,
                            headerDisabled: true,
                          }}
                        >
                          <div className="text-xs min-w-[140px]">
                            <div className="font-semibold mb-1">
                              {point.name}
                            </div>
                            <div>
                              Status:{" "}
                              <b
                                style={{
                                  color: point.visited
                                    ? "#16a34a"
                                    : "#dc2626",
                                }}
                              >
                                {point.visited ? "Visited" : "Not Visited"}
                              </b>
                            </div>
                            <div>
                              Time:{" "}
                              {point.visited
                                ? formatTime(point.timestamp)
                                : "-"}
                            </div>
                          </div>
                        </InfoWindow>
                      )}
                    </Marker>
                  );
                })}

              {visitedPath.length > 1 &&
                visitedPath.map((p, i) =>
                  i === visitedPath.length - 1 ? null : (
                    <Polyline
                      key={`seg-${i}`}
                      path={[p, visitedPath[i + 1]]}
                      options={{
                        strokeColor: "#22c55e",
                        strokeWeight: 4,
                      }}
                      onMouseOver={() => setHoverSegment(i)}
                      onMouseOut={() => setHoverSegment(null)}
                    />
                  )
                )}

              {hoverSegment !== null && (() => {
                const p1 = visitedPath[hoverSegment];
                const p2 = visitedPath[hoverSegment + 1];
                const mid = getMidPoint(p1, p2);
                const dist = segmentDistances[hoverSegment];

                return (
                  <InfoWindow
                    position={mid}
                    options={{
                      disableAutoPan: true,
                      headerDisabled: true,
                    }}
                  >
                    <div className="flex items-center justify-between gap-2 min-w-[170px]">
                      <span className="text-xs font-semibold text-gray-700">
                        Distance: {dist || "Calculating..."}
                      </span>
                      <button
                        onClick={() => setHoverSegment(null)}
                        className="text-gray-500 hover:text-black font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  </InfoWindow>
                );
              })()}
            </GoogleMap>
          )}
        </div>
      </div>
    </DashBoardLayout>
  );
};

export default Tracker;
