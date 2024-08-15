import React, { useState, useEffect } from "react";
import './Users.css';
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

    // Fetch users from the API on component mount
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
      }, [user]);

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
        <div className="users-container">
            <h1 className="page-title">Users</h1>

            {/* New User Form */}
            <div className="new-user-form">
                <h2 className="form-title">Add New User</h2>
                <div className="form-inputs">
                    <input
                        type="text"
                        placeholder="Email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="input-field"
                    />
                    <input
                        type="text"
                        placeholder="Role"
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        className="input-field"
                    />
                    <select
                        value={newManagerId}
                        onChange={(e) => setNewManagerId(e.target.value)}
                        className="input-field"
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
                    <button onClick={handleCreateUser} className="create-button">Create</button>
                </div>
            </div>

            {/* Users Table */}
            <div className="users-table">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Managed by</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>
                                    {editingUserId === user.id ? (
                                        <input
                                            type="text"
                                            value={editingEmail}
                                            onChange={(e) => setEditingEmail(e.target.value)}
                                            className="input-field"
                                        />
                                    ) : (
                                        user.email
                                    )}
                                </td>
                                <td>
                                    {editingUserId === user.id ? (
                                        <input
                                            type="text"
                                            value={editingRole}
                                            onChange={(e) => setEditingRole(e.target.value)}
                                            className="input-field"
                                        />
                                    ) : (
                                        user.role
                                    )}
                                </td>
                                <td>
                                    {editingUserId === user.id ? (
                                        <select
                                            value={editingManagerId}
                                            onChange={(e) => setEditingManagerId(e.target.value)}
                                            className="input-field"
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
                                <td>
                                    {editingUserId === user.id ? (
                                        <>
                                            <button
                                                onClick={() => handleSave(user.id)}
                                                className="save-button"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={handleCancel}
                                                className="cancel-button"
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => handleEditClick(user)}
                                                className="edit-button"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="delete-button"
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
