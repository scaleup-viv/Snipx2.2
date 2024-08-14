import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthProvider";

function Users() {
  const [users, setUsers] = useState([]);
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newManagerId, setNewManagerId] = useState("");
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingEmail, setEditingEmail] = useState("");
  const [editingRole, setEditingRole] = useState("");
  const [editingManagerId, setEditingManagerId] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://extension-360407.lm.r.appspot.com/api/company_users", {
            method: "POST", 
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        });
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://extension-360407.lm.r.appspot.com/api/snipx_users/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setUsers(users.filter((user) => user.id !== id));
      } else {
        console.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEditClick = (user) => {
    setEditingUserId(user.id);
    setEditingEmail(user.email);
    setEditingRole(user.role);
    setEditingManagerId(user.managedBy || "");
  };

  const handleSave = async (id) => {
    try {
      const response = await fetch(`https://extension-360407.lm.r.appspot.com/api/snipx_users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: editingEmail,
          role: editingRole,
          managedBy: editingManagerId ? parseInt(editingManagerId) : null,
        }),
      });
      if (response.ok) {
        const updatedUser = await response.json();
        setUsers(
          users.map((user) =>
            user.id === id ? updatedUser : user
          )
        );
        setEditingUserId(null);
      } else {
        console.error("Failed to save user");
      }
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const handleCancel = () => {
    setEditingUserId(null);
  };

  const handleCreateUser = async () => {
    try {
      const response = await fetch("https://extension-360407.lm.r.appspot.com/api/snipx_users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentUserID: user.id, //sending the managers id to check which company he is from, so we can add the new created user to that company too
          email: newEmail,
          role: newRole,
          managedBy: newManagerId ? parseInt(newManagerId) : null,
        }),
      });
      if (response.ok) {
        const newUser = await response.json();
        setUsers([newUser, ...users]);
        setNewEmail("");
        setNewRole("");
        setNewManagerId("");
      } else {
        console.error("Failed to create user");
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Users</h1>

      {/* New User Form */}
      <div className="mb-4">
        <h2 className="text-xl font-medium text-gray-700 mb-2">Add New User</h2>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="border rounded px-2 py-1 mr-2"
          />
          <input
            type="text"
            placeholder="Role"
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            className="border rounded px-2 py-1 mr-2"
          />
          <select
            value={newManagerId}
            onChange={(e) => setNewManagerId(e.target.value)}
            className="border rounded px-2 py-1 mr-2"
          >
            <option value="">Select Manager</option>
            {users
              .filter((user) => user.role === "admin")
              .map((user) => (
                <option key={user.id} value={user.id}>
                  {user.email}
                </option>
              ))}
          </select>
          <button
            onClick={handleCreateUser}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Create
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-3 px-4 text-left font-medium text-gray-700">ID</th>
              <th className="py-3 px-4 text-left font-medium text-gray-700">Email</th>
              <th className="py-3 px-4 text-left font-medium text-gray-700">Role</th>
              <th className="py-3 px-4 text-left font-medium text-gray-700">Managed by</th>
              <th className="py-3 px-4 text-left font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-gray-300">
                <td className="py-2 px-4">{user.id}</td>
                <td className="py-2 px-4">
                  {editingUserId === user.id ? (
                    <input
                      type="text"
                      value={editingEmail}
                      onChange={(e) => setEditingEmail(e.target.value)}
                      className="border rounded px-2 py-1"
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td className="py-2 px-4">
                  {editingUserId === user.id ? (
                    <input
                      type="text"
                      value={editingRole}
                      onChange={(e) => setEditingRole(e.target.value)}
                      className="border rounded px-2 py-1"
                    />
                  ) : (
                    user.role
                  )}
                </td>
                <td className="py-2 px-4">
                  {editingUserId === user.id ? (
                    <select
                      value={editingManagerId}
                      onChange={(e) => setEditingManagerId(e.target.value)}
                      className="border rounded px-2 py-1"
                    >
                      <option value="">Select Manager</option>
                      {users
                        .filter((user) => user.role === "admin")
                        .map((manager) => (
                          <option key={manager.id} value={manager.id}>
                            {manager.email}
                          </option>
                        ))}
                    </select>
                  ) : (
                    user.manager ? user.manager.email : "None"
                  )}
                </td>
                <td className="py-2 px-4">
                  {editingUserId === user.id ? (
                    <>
                      <button
                        onClick={() => handleSave(user.id)}
                        className="text-green-600 hover:text-green-800 font-medium mr-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="text-gray-600 hover:text-gray-800 font-medium"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditClick(user)}
                        className="text-blue-600 hover:text-blue-800 font-medium mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-800 font-medium"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Users;
