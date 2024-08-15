import React, { useState, useEffect } from "react";

function Snippets() {
  const [snippets, setSnippets] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingSnippetId, setEditingSnippetId] = useState(null);
  const [editingSnippet, setEditingSnippet] = useState({
    text: "",
    user_id: "",
    green: "",
    orange: "",
    red: "",
    explanations: "",
    score: "",
    sentiment: "",
  });

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        const response = await fetch("https://extension-360407.lm.r.appspot.com/api/snipx_snippets");
        const data = await response.json();
        setSnippets(data);
      } catch (error) {
        console.error("Error fetching snippets:", error);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch("https://extension-360407.lm.r.appspot.com/api/snipx_users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchSnippets();
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://extension-360407.lm.r.appspot.com/api/snipx_snippets/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setSnippets(snippets.filter((snippet) => snippet.id !== id));
      } else {
        console.error("Failed to delete snippet");
      }
    } catch (error) {
      console.error("Error deleting snippet:", error);
    }
  };

  const handleEditClick = (snippet) => {
    setEditingSnippetId(snippet.id);
    setEditingSnippet({
      text: snippet.text,
      user_id: snippet.user_id || "",
      green: snippet.green || "",
      orange: snippet.orange || "",
      red: snippet.red || "",
      explanations: snippet.explanations || "",
      score: snippet.score || "",
      sentiment: snippet.sentiment || "",
    });
  };

  const handleSave = async (id) => {
    try {
      const response = await fetch(`https://extension-360407.lm.r.appspot.com/api/snipx_snippets/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingSnippet),
      });
      if (response.ok) {
        const updatedSnippet = await response.json();
        setSnippets(
          snippets.map((snippet) =>
            snippet.id === id ? updatedSnippet : snippet
          )
        );
        setEditingSnippetId(null);
      } else {
        console.error("Failed to save snippet");
      }
    } catch (error) {
      console.error("Error saving snippet:", error);
    }
  };

  const handleCancel = () => {
    setEditingSnippetId(null);
  };

  const getUserEmail = (userId) => {
    const user = users.find((user) => user.id === userId);
    return user ? user.email : "None";
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Snippets</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-3 px-4 text-left font-medium text-gray-700">ID</th>
              <th className="py-3 px-4 text-left font-medium text-gray-700">Type</th>
              <th className="py-3 px-4 text-left font-medium text-gray-700">Date</th>
              <th className="py-3 px-4 text-left font-medium text-gray-700">Snippet Text</th>
              <th className="py-3 px-4 text-left font-medium text-gray-700">Green</th>
              <th className="py-3 px-4 text-left font-medium text-gray-700">Orange</th>
              <th className="py-3 px-4 text-left font-medium text-gray-700">Red</th>
              <th className="py-3 px-4 text-left font-medium text-gray-700">Explanations</th>
              <th className="py-3 px-4 text-left font-medium text-gray-700">Score</th>
              <th className="py-3 px-4 text-left font-medium text-gray-700">Sentiment</th>
              <th className="py-3 px-4 text-left font-medium text-gray-700">Assigned User</th>
              <th className="py-3 px-4 text-left font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {snippets.map((snippet) => (
              <tr key={snippet.id} className="border-t border-gray-300">
                <td className="py-2 px-4">{snippet.id}</td>

                <td className="py-2 px-4">
                  {editingSnippetId === snippet.id ? (
                    
                    <textarea
                      value={editingSnippet.type}
                      onChange={(e) =>
                        setEditingSnippet({ ...editingSnippet, type: e.target.value })
                      }
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    snippet.type || ""
                  )}
                </td>

                <td className="py-2 px-4">
                  {editingSnippetId === snippet.id ? (
                    
                    <textarea
                      value={editingSnippet.date}
                      onChange={(e) =>
                        setEditingSnippet({ ...editingSnippet, date: e.target.value })
                      }
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    snippet.date || ""
                  )}
                </td>

                <td className="py-2 px-4">
                  {editingSnippetId === snippet.id ? (
                    <textarea
                      value={editingSnippet.text}
                      onChange={(e) =>
                        setEditingSnippet({ ...editingSnippet, text: e.target.value })
                      }
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    snippet.text || ""
                  )}
                </td>
                <td className="py-2 px-4">
                  {editingSnippetId === snippet.id ? (
                    <input
                      type="text"
                      value={editingSnippet.green}
                      onChange={(e) =>
                        setEditingSnippet({ ...editingSnippet, green: e.target.value })
                      }
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    JSON.stringify(snippet.green) || ""  // Ensure it's a string
                  )}
                </td>
                <td className="py-2 px-4">
                  {editingSnippetId === snippet.id ? (
                    <input
                      type="text"
                      value={editingSnippet.orange}
                      onChange={(e) =>
                        setEditingSnippet({ ...editingSnippet, orange: e.target.value })
                      }
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    JSON.stringify(snippet.orange) || ""  // Ensure it's a string
                  )}
                </td>
                <td className="py-2 px-4">
                  {editingSnippetId === snippet.id ? (
                    <input
                      type="text"
                      value={editingSnippet.red}
                      onChange={(e) =>
                        setEditingSnippet({ ...editingSnippet, red: e.target.value })
                      }
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    JSON.stringify(snippet.red) || ""  // Ensure it's a string
                  )}
                </td>
                <td className="py-2 px-4">
                  {editingSnippetId === snippet.id ? (
                    <input
                      type="text"
                      value={editingSnippet.explanations}
                      onChange={(e) =>
                        setEditingSnippet({ ...editingSnippet, explanations: e.target.value })
                      }
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    JSON.stringify(snippet.explanations) || ""  // Ensure it's a string
                  )}
                </td>
                <td className="py-2 px-4">
                  {editingSnippetId === snippet.id ? (
                    <input
                      type="text"
                      value={editingSnippet.score}
                      onChange={(e) =>
                        setEditingSnippet({ ...editingSnippet, score: e.target.value })
                      }
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    snippet.score || ""
                  )}
                </td>
                <td className="py-2 px-4">
                  {editingSnippetId === snippet.id ? (
                    <input
                      type="text"
                      value={editingSnippet.sentiment}
                      onChange={(e) =>
                        setEditingSnippet({ ...editingSnippet, sentiment: e.target.value })
                      }
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    snippet.sentiment || ""
                  )}
                </td>
                <td className="py-2 px-4">
                  {editingSnippetId === snippet.id ? (
                    <select
                      value={editingSnippet.user_id}
                      onChange={(e) =>
                        setEditingSnippet({ ...editingSnippet, user_id: e.target.value })
                      }
                      className="border rounded px-2 py-1"
                    >
                      <option value="">Assign to User</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.email}
                        </option>
                      ))}
                    </select>
                  ) : (
                    getUserEmail(snippet.user_id) // Get user's email by user_id
                  )}
                </td>
                <td className="py-2 px-4">
                  {editingSnippetId === snippet.id ? (
                    <>
                      <button
                        onClick={() => handleSave(snippet.id)}
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
                        onClick={() => handleEditClick(snippet)}
                        className="text-blue-600 hover:text-blue-800 font-medium mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(snippet.id)}
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

export default Snippets;
