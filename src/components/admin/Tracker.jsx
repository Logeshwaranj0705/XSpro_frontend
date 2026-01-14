import React, { useEffect, useMemo, useState, useContext } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Tooltip
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import DashBoardLayout from "../layouts/DashBoardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATH } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";

const defaultCenter = [13.0827, 80.2707];

const formatTime = (ts) => {
  if (!ts) return "-";
  const d = new Date(ts.replace(" ", "T"));
  if (isNaN(d)) return "-";
  return d.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const greenIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
  iconSize: [32, 32],
});

const redIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  iconSize: [32, 32],
});

const fetchDistance = async (from, to) => {
  try {
    const res = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=false`
    );
    const data = await res.json();
    if (data.routes?.length) {
      return (data.routes[0].distance / 1000).toFixed(2) + " km";
    }
    return "-";
  } catch {
    return "-";
  }
};

const Tracker = () => {
  useUserAuth();

  const { user, selectedUserId } = useContext(UserContext);

  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeKey, setSelectedEmployeeKey] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [segmentDistances, setSegmentDistances] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    const query = selectedUserId ? `?userId=${selectedUserId}` : "";
    axiosInstance
      .get(`${API_PATH.ANALYSIS.GET_EMPLOYEE_USAGE_COUNT}${query}`)
      .then(res => setEmployees(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError("Failed to load executives"));
  }, [user, selectedUserId]);

  useEffect(() => {
    setAssignments([]);
    setSegmentDistances({});
    if (!selectedEmployeeKey) return;

    axiosInstance
      .get(`/api/tracker/assignments/${selectedEmployeeKey}`)
      .then(res =>
        setAssignments(Array.isArray(res.data?.points) ? res.data.points : [])
      )
      .catch(() => setError("Failed to load assignments"));
  }, [selectedEmployeeKey]);

  const visitedPath = useMemo(() => {
    return assignments
      .filter(
        p =>
          p.visited &&
          p.lat &&
          p.lng &&
          p.timestamp &&
          !isNaN(new Date(p.timestamp.replace(" ", "T")))
      )
      .sort(
        (a, b) =>
          new Date(a.timestamp.replace(" ", "T")) -
          new Date(b.timestamp.replace(" ", "T"))
      );
  }, [assignments]);

  useEffect(() => {
    const loadDistances = async () => {
      const distances = {};
      for (let i = 0; i < visitedPath.length - 1; i++) {
        distances[i] = await fetchDistance(
          visitedPath[i],
          visitedPath[i + 1]
        );
      }
      setSegmentDistances(distances);
    };

    if (visitedPath.length > 1) loadDistances();
  }, [visitedPath]);

  return (
    <DashBoardLayout activeMenu="Tracker">
      <div className="h-[87dvh] flex flex-col px-2 sm:px-4 overflow-hidden">
        <div className="shrink-0 mt-3 flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center p-3 sm:p-4 rounded-xl shadow-sm bg-white">
          <h1 className="text-xl sm:text-2xl font-bold">📍 Tracker</h1>

          <select
            value={selectedEmployeeKey}
            onChange={(e) => setSelectedEmployeeKey(e.target.value)}
            className="w-full sm:w-64 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="">Choose Executive</option>
            {employees.map((emp, idx) => (
              <option
                key={idx}
                value={emp.employeeName.toLowerCase().replace(/\s+/g, "_")}
              >
                {emp.employeeName}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="absolute top-20 right-6 bg-red-100 text-red-700 px-4 py-2 rounded-lg shadow">
            {error}
          </div>
        )}

        <div className="flex-1 mt-3 sm:mt-4 rounded-xl overflow-hidden shadow">
          <MapContainer
            center={defaultCenter}
            zoom={11}
            style={{ width: "100%", height: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {assignments.map(point => (
              <Marker
                key={point.id}
                position={[point.lat, point.lng]}
                icon={point.visited ? greenIcon : redIcon}
              >
                <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                  <div className="text-xs min-w-[140px]">
                    <b>{point.name}</b>
                    <div>
                      Status:{" "}
                      <span
                        className={
                          point.visited
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {point.visited ? "Visited" : "Not Visited"}
                      </span>
                    </div>
                    <div>Time: {formatTime(point.timestamp)}</div>
                  </div>
                </Tooltip>
              </Marker>
            ))}

            {visitedPath.map((p, i) => {
              if (i === visitedPath.length - 1) return null;
              return (
                <Polyline
                  key={i}
                  positions={[
                    [p.lat, p.lng],
                    [visitedPath[i + 1].lat, visitedPath[i + 1].lng]
                  ]}
                  pathOptions={{ color: "#22c55e", weight: 4 }}
                >
                  <Tooltip sticky>
                    Distance: {segmentDistances[i] || "..."}
                  </Tooltip>
                </Polyline>
              );
            })}
          </MapContainer>
        </div>
      </div>
    </DashBoardLayout>
  );
};

export default Tracker;
