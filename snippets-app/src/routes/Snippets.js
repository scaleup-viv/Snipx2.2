import React, { useRef, useState, useEffect } from "react";
import './Snippets.css';

function Snippets() {
  const [snippets, setSnippets] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingSnippetId, setEditingSnippetId] = useState(null);
  const [editingSnippet, setEditingSnippet] = useState({
    type: "",
    date: "",
    text: "",
    user_id: "",
    green: "",
    orange: "",
    red: "",
    explanations: "",
    score: "",
    sentiment: "",
  });

  // Separate refs for each textarea
  const textRef = useRef([]);
  const greenRef = useRef([]);
  const orangeRef = useRef([]);
  const redRef = useRef([]);
  const explanationsRef = useRef([]);
  const scoreRef = useRef([]);
  const sentimentRef = useRef([]);

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


  useEffect(() => {
    // Trigger resize whenever editingSnippetId is set
    if (editingSnippetId !== null) {
      resizeAllTextAreas();
    }
  }, [editingSnippetId]); // Re-run whenever editingSnippetId changes


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
      type: snippet.type || "",
      date: snippet.date || "",
      text: snippet.text || "",
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

  const resizeAllTextAreas = () => {
    [textRef, greenRef, orangeRef, redRef, explanationsRef, scoreRef, sentimentRef].forEach(refGroup => {
      refGroup.current.forEach(textarea => {
        if (textarea) {
          textarea.style.height = "auto"; // Reset height
          textarea.style.height = `${textarea.scrollHeight}px`; // Set height to content
        }
      });
    });
  };

  return (
    <div className="container mx-auto p-4"> {/* Updated container class */}
    <h1 className="text-3xl font-bold text-white mb-6 text-center">Snippets</h1>

    <div className="table-wrapper overflow-x-auto">
      <table className="min-w-full bg-gradient-to-r from-ffb300 to-e4277d border border-gray-300 rounded-lg">
        <thead>
          <tr className="bg-opacity-80 bg-white">
            <th className="py-3 px-4 text-left font-bold text-gray-800">ID</th>
            <th className="py-3 px-4 text-left font-bold text-gray-800">Type</th>
            <th className="py-3 px-4 text-left font-bold text-gray-800">Date</th>
            <th className="py-3 px-4 text-left font-bold text-gray-800">Snippet Text</th>
            <th className="py-3 px-4 text-left font-bold text-gray-800">Green</th>
            <th className="py-3 px-4 text-left font-bold text-gray-800">Orange</th>
            <th className="py-3 px-4 text-left font-bold text-gray-800">Red</th>
            <th className="py-3 px-4 text-left font-bold text-gray-800">Explanations</th>
            <th className="py-3 px-4 text-left font-bold text-gray-800">Score</th>
            <th className="py-3 px-4 text-left font-bold text-gray-800">Sentiment</th>
            <th className="py-3 px-4 text-left font-bold text-gray-800">Assigned User</th>
            <th className="py-3 px-4 text-left font-bold text-gray-800">Actions</th>
          </tr>
          </thead>
          <tbody>
          {snippets.map((snippet,index) => (
              <tr key={snippet.id} className="bg-white bg-opacity-60 border-t border-gray-300">
                <td className="py-2 px-4">{snippet.id}</td>
                <td className="py-2 px-4">{editingSnippetId === snippet.id ? (
                    <input
                      type="text"
                      value={editingSnippet.type}
                      onChange={(e) => {
                        setEditingSnippet({ ...editingSnippet, type: e.target.value });
                      }}
                      className="auto-resize border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    snippet.type || ""
                  )}</td>
                <td className="py-2 px-4">{editingSnippetId === snippet.id ? (
                    <input
                      type="text"
                      value={editingSnippet.date}
                      onChange={(e) => {
                        setEditingSnippet({ ...editingSnippet, date: e.target.value });
                      }}
                      className="auto-resize border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    snippet.date || ""
                  )}</td>
                <td className="py-2 px-4">{editingSnippetId === snippet.id ? (
                    <textarea
                      ref={el => (textRef.current[index] = el)} // Store the ref in textRef
                      value={editingSnippet.text}
                      onChange={(e) => {
                        setEditingSnippet({ ...editingSnippet, text: e.target.value });
                      }}
                      className="auto-resize border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    snippet.text || ""
                  )}
                </td>
                <td className="py-2 px-4">
                  {editingSnippetId === snippet.id ? (
                    <textarea
                      ref={el => (greenRef.current[index] = el)} // Store the ref in greenRef
                      value={editingSnippet.green}
                      onChange={(e) => {
                        setEditingSnippet({ ...editingSnippet, green: e.target.value });
                      }}
                      className="auto-resize border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    snippet.green || ""
                  )}
                </td>
                <td className="py-2 px-4">
                  {editingSnippetId === snippet.id ? (
                    <textarea
                      ref={el => (orangeRef.current[index] = el)} // Store the ref in orangeRef
                      value={editingSnippet.orange}
                      onChange={(e) => {
                        setEditingSnippet({ ...editingSnippet, orange: e.target.value });
                      }}
                      className="auto-resize border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    snippet.orange || ""
                  )}
                </td>
                <td className="py-2 px-4">
                  {editingSnippetId === snippet.id ? (
                    <textarea
                      ref={el => (redRef.current[index] = el)} // Store the ref in redRef
                      value={editingSnippet.red}
                      onChange={(e) => {
                        setEditingSnippet({ ...editingSnippet, red: e.target.value });
                      }}
                      className="auto-resize border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    snippet.red || ""
                  )}
                </td>
                <td className="py-2 px-4">
                  {editingSnippetId === snippet.id ? (
                    <textarea
                      ref={el => (explanationsRef.current[index] = el)} // Store the ref in explanationsRef
                      value={editingSnippet.explanations}
                      onChange={(e) => {
                        setEditingSnippet({ ...editingSnippet, explanations: e.target.value });
                      }}
                      className="auto-resize border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    snippet.explanations || ""
                  )}
                </td>
                <td className="py-2 px-4">
                  {editingSnippetId === snippet.id ? (
                    <textarea
                      ref={el => (scoreRef.current[index] = el)} // Store the ref in scoreRef
                      value={editingSnippet.score}
                      onChange={(e) => {
                        setEditingSnippet({ ...editingSnippet, score: e.target.value });
                      }}
                      className="auto-resize border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    snippet.score || ""
                  )}
                </td>
                <td className="py-2 px-4">
                  {editingSnippetId === snippet.id ? (
                    <textarea
                      ref={el => (sentimentRef.current[index] = el)} // Store the ref in sentimentRef
                      value={editingSnippet.sentiment}
                      onChange={(e) => {
                        setEditingSnippet({ ...editingSnippet, sentiment: e.target.value });
                      }}
                      className="auto-resize border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    snippet.sentiment || ""
                  )}
                </td>
                <td className="py-2 px-4">
                  {editingSnippetId === snippet.id ? (
                    <select
                      value={editingSnippet.user_id}
                      onChange={(e) => {
                        setEditingSnippet({ ...editingSnippet, user_id: e.target.value });
                      }}
                      className="auto-resize border rounded px-2 py-1"
                    >
                      <option value="">Assign to User</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.email}
                        </option>
                      ))}
                    </select>
                  ) : (
                    getUserEmail(snippet.user_id)
                  )}
                </td>
                <td className="py-2 px-4 flex space-x-2">
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
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(snippet.id)}
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
        {/* Transparent spacer */}
        <div className="spacer"><p>111</p></div>
      </div>
    </div>
  );
}

export default Snippets;
