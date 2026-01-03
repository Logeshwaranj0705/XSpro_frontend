import React from "react";

const AdminUserSelector = ({ users, selectedUserId, onChange }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow mb-6">
      <label className="block text-sm font-medium text-gray-600 mb-2">
        Select User
      </label>

      <select
        value={selectedUserId || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="">-- Select a user --</option>

        {users.map((user) => (
          <option key={user._id} value={user._id}>
            {user.fullname}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AdminUserSelector;
