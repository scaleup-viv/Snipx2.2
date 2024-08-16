import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthProvider";
import axios from "axios";
import './MySnippets.css';  // Ensure you import the CSS file

function Snippets() {
  const { user } = useAuth();
  const [snippets, setSnippets] = useState([]);

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        console.log("userid", user.id);
        const response = await axios.post("https://extension-360407.lm.r.appspot.com/api/snipx_snippets/user", { id: user.id });
        console.log("response", response.data);
        setSnippets(response.data);
      } catch (error) {
        console.error("Error fetching snippets:", error);
      }
    };
    fetchSnippets();
  }, [user.id]);

  return (
    <div className="container mx-auto p-4 scaleup-container">
      <h1 className="text-3xl font-bold text-white mb-6 text-center">My Snippets</h1>

      <div className="overflow-x-auto">
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
            </tr>
          </thead>
          <tbody>
            {snippets.map((snippet) => (
              <tr key={snippet.id} className="bg-white bg-opacity-60 border-t border-gray-300">
                <td className="py-2 px-4">{snippet.id}</td>
                <td className="py-2 px-4">{snippet.type || ""}</td>
                <td className="py-2 px-4">{snippet.date || ""}</td>
                <td className="py-2 px-4">{snippet.text || ""}</td>
                <td className="py-2 px-4">{JSON.stringify(snippet.green) || ""}</td>
                <td className="py-2 px-4">{JSON.stringify(snippet.orange) || ""}</td>
                <td className="py-2 px-4">{JSON.stringify(snippet.red) || ""}</td>
                <td className="py-2 px-4">{JSON.stringify(snippet.explanations) || ""}</td>
                <td className="py-2 px-4">{snippet.score || ""}</td>
                <td className="py-2 px-4">{snippet.sentiment || ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Snippets;
