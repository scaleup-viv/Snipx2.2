import React, { useState, useEffect } from "react";
import axios from "axios";
import 'react-quill/dist/quill.snow.css'; 
import { useAuth } from "../AuthProvider";

const ReactQuill = React.lazy(() => import('react-quill'));

function Users() {
    const { user } = useAuth();
    const [snippets, setSnippets] = useState([]);
    const [selectedSnippetIds, setSelectedSnippetIds] = useState([]);
    const [weeklyReport, setWeeklyReport] = useState(''); // State for the weekly report

    useEffect(() => {
        const fetchSnippets = async () => {
            try {
                const response = await axios.post("https://extension-360407.lm.r.appspot.com/api/snipx_snippets/user", { id: user.id });
                setSnippets(response.data);
            } catch (error) {
                console.error("Error fetching snippets:", error);
            }
        };

        if (user && user.id) {
            fetchSnippets();
        }
    }, [user]);

    const handleSnippetChange = (event) => {
        const { options } = event.target;
        const selectedValues = Array.from(options)
            .filter(option => option.selected)
            .map(option => option.value);
        
        if (selectedValues.length > 5) {
            alert("You can only select up to 5 snippets.");
            return; // Prevent exceeding the limit
        }

        setSelectedSnippetIds(selectedValues);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post("https://extension-360407.lm.r.appspot.com/api/weeklySnippet", { snippetIds: selectedSnippetIds });
            // Set the weekly report in the state
            setWeeklyReport(response.data.weeklyReport);
            alert("Selected snippets submitted successfully!");
        } catch (error) {
            console.error("Error submitting snippets:", error);
            alert("Failed to submit snippets.");
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center p-24">
            <h1>User ID: {user.id}</h1>

            {snippets.length > 0 && (
                <form onSubmit={handleSubmit}>
                    <label htmlFor="snippet-select">Select Snippets:</label>
                    <select 
                        id="snippet-select" 
                        multiple 
                        value={selectedSnippetIds} 
                        onChange={handleSnippetChange} 
                        className="mt-2 p-2 border border-gray-300 rounded"
                    >
                        {snippets.map(snippet => (
                            <option key={snippet.id} value={snippet.id}>
                                {new Date(snippet.date).toLocaleDateString()} - Snippet ID: {snippet.id}
                            </option>
                        ))}
                    </select>
                    <button type="submit" className="mt-4 p-2 bg-blue-500 text-white rounded">
                        Submit
                    </button>
                </form>
            )}

            <h1>Weekly Report:</h1>
            <ReactQuill
                value={weeklyReport}
                onChange={setWeeklyReport} // Manage the value with state
                placeholder="Weekly report"
                className="w-full p-2 border border-gray-300 rounded"
            />
        </main>
    );
}

export default Users;
