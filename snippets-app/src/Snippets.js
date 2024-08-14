import React, { useState } from "react";
import './Snippets.css'; // Assuming you have a CSS file for styles

function Snippets() {
  const [snippets] = useState([
    // Sample data for demonstration
    {
      id: 1,
      text: "Sample Snippet 1",
      green: "Green text",
      orange: "Orange text",
      red: "Red text",
      explanations: "Explanations text",
      score: "8",
      sentiment: "Positive",
      user_id: 1,
    },
    {
      id: 2,
      text: "Sample Snippet 2",
      green: "Green text",
      orange: "Orange text",
      red: "Red text",
      explanations: "Explanations text",
      score: "6",
      sentiment: "Neutral",
      user_id: 2,
    },
  ]);

  const [users] = useState([
    // Sample users for demonstration
    { id: 1, email: "user1@example.com" },
    { id: 2, email: "user2@example.com" },
  ]);

  const getUserEmail = (userId) => {
    const user = users.find((user) => user.id === userId);
    return user ? user.email : "None";
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-white mb-6 text-center">Snippets</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-gradient-to-r from-ffb300 to-e4277d border border-gray-300 rounded-lg">
          <thead>
            <tr className="bg-opacity-80 bg-white">
              <th className="py-3 px-4 text-left font-bold text-gray-800">ID</th>
              <th className="py-3 px-4 text-left font-bold text-gray-800">Snippet Text</th>
              <th className="py-3 px-4 text-left font-bold text-gray-800">Green</th>
              <th className="py-3 px-4 text-left font-bold text-gray-800">Orange</th>
              <th className="py-3 px-4 text-left font-bold text-gray-800">Red</th>
              <th className="py-3 px-4 text-left font-bold text-gray-800">Explanations</th>
              <th className="py-3 px-4 text-left font-bold text-gray-800">Score</th>
              <th className="py-3 px-4 text-left font-bold text-gray-800">Sentiment</th>
              <th className="py-3 px-4 text-left font-bold text-gray-800">Assigned User</th>
              <th className="py-3 px-4 text-left font-bold text-gray-800">Actions</th> {/* Action Column */}
            </tr>
          </thead>
          <tbody>
            {snippets.map((snippet) => (
              <tr key={snippet.id} className="bg-white bg-opacity-60 border-t border-gray-300">
                <td className="py-2 px-4">{snippet.id}</td>
                <td className="py-2 px-4">{snippet.text}</td>
                <td className="py-2 px-4">{snippet.green}</td>
                <td className="py-2 px-4">{snippet.orange}</td>
                <td className="py-2 px-4">{snippet.red}</td>
                <td className="py-2 px-4">{snippet.explanations}</td>
                <td className="py-2 px-4">{snippet.score}</td>
                <td className="py-2 px-4">{snippet.sentiment}</td>
                <td className="py-2 px-4">{getUserEmail(snippet.user_id)}</td>
                <td className="py-2 px-4 flex space-x-2">
                  {/* Action Buttons */}
                  <button>
                    Edit
                  </button>
                  <button>
                    Delete
                  </button>
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
