import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthProvider";
import axios from "axios";

function Snippets() {
    const { user } = useAuth();

  const [snippets, setSnippets] = useState([]);

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        const response = await axios.post("https://extension-360407.lm.r.appspot.com/api/snipx_snippets/user", { id: user.id });
                setSnippets(response.data);
      } catch (error) {
        console.error("Error fetching snippets:", error);
      }
    };
    fetchSnippets();

  }, []);


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">My Snippets</h1>

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
            </tr>
          </thead>
          <tbody>
            {snippets.map((snippet) => (
              <tr key={snippet.id} className="border-t border-gray-300">
                <td className="py-2 px-4">{snippet.id}</td>

                <td className="py-2 px-4">
                    {snippet.type || ""}
                </td>

                <td className="py-2 px-4">
                {snippet.date || ""}
                </td>

                <td className="py-2 px-4">
                {snippet.text || ""}
                </td>

                <td className="py-2 px-4">
                    {JSON.stringify(snippet.green) || ""}
                </td>

                <td className="py-2 px-4">
                    {JSON.stringify(snippet.orange) || ""}
                </td>

                <td className="py-2 px-4">
                    {JSON.stringify(snippet.red) || ""}
                </td>

                <td className="py-2 px-4">
                    {JSON.stringify(snippet.explanations) || ""}
                </td>

                <td className="py-2 px-4">
                {snippet.score || ""}
                </td>

                <td className="py-2 px-4">
                {snippet.sentiment || ""}
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
