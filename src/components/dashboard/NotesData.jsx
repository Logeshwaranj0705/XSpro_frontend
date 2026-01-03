import React, { useContext } from "react";
import { FaTrash } from "react-icons/fa";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATH } from "../../utils/apiPaths";
import { toast } from "react-toastify";
import { UserContext } from "../../context/userContext";

const NotesData = ({ notes = [], onDeleted }) => {
  const { selectedUserId } = useContext(UserContext);

  const handleDelete = async (noteId) => {
    if (!window.confirm("Delete this note?")) return;

    try {
      await axiosInstance.delete(
        API_PATH.DASHBOARD.DELETE_NOTE(noteId),
        {
          params: { userId: selectedUserId || undefined }
        }
      );

      toast.success("Note successfully deleted");
      onDeleted?.();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete note");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 min-h-[240px] flex flex-col h-full">
      <h2 className="text-lg font-semibold mb-4">Notes</h2>

      {notes.length === 0 ? (
        <p className="text-gray-500">No notes available.</p>
      ) : (
        <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
          {notes.map((note) => {
            const createdAt = new Date(note.createdAt);
            const date = createdAt.toLocaleDateString();
            const time = createdAt.toLocaleTimeString();

            return (
              <div
                key={note._id}
                className="group p-4 bg-gray-50 rounded-lg border border-gray-200 flex flex-col relative hover:bg-gray-100 transition"
              >
                <button
                  onClick={() => handleDelete(note._id)}
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition"
                >
                  <FaTrash size={14} />
                </button>

                <p className="text-gray-800 mb-2 pr-6">{note.note}</p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{date}</span>
                  <span>{time}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotesData;
