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
    const [results, setResults] = useState({
        green: [],
        orange: [],
        red: [],
        explanations: "",
        score: "",
        sentiment: "",
    });

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
            setWeeklyReport(response.data.weeklyReport);
            alert("Selected snippets submitted successfully!");
        } catch (error) {
            console.error("Error submitting snippets:", error);
            alert("Failed to submit snippets.");
        }
    };

    const handleAnalyzeSubmit = async () => {
        try {
            // First POST request to analyze
            const response1 = await axios.post("https://extension-360407.lm.r.appspot.com/api/analyze", { text: weeklyReport });
            const data1 = response1.data;

            // Second POST request to sentimentAnalysis
            const response2 = await axios.post("https://extension-360407.lm.r.appspot.com/api/sentimentAnalysis", { text: weeklyReport });
            const data2 = response2.data;

            // Clean up HTML tags from explanations and extract only numbers from the score
            const cleanedExplanations = data2.explanations ? data2.explanations.replace(/<\/?[^>]+(>|$)/g, "") : "";

            // Update results state
            setResults({
                green: data1.green || [],
                orange: data1.orange || [],
                red: data1.red || [],
                explanations: cleanedExplanations || "",
                score: data2.score || "",
                sentiment: data2.sentiment || "",
            });
        } catch (error) {
            console.error("Error analyzing text:", error);
            alert("Failed to analyze the report.");
        }
    };

    const handleInputChange = (category, index, value) => {
        setResults((prevResults) => ({
            ...prevResults,
            [category]: prevResults[category].map((item, idx) =>
                idx === index ? value : item
            ),
        }));
    };

    const handleSentimentDataChange = (field, value) => {
        setResults((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    const handleApprove = async () => {
        const payload = {
            snipx_user_id: user.id, // Assuming user.id is the correct user ID
            type: "weekly",
            inputText: weeklyReport,
            green: results.green,
            orange: results.orange,
            red: results.red,
            explanations: results.explanations,
            score: results.score,
            sentiment: results.sentiment,
        };
        try {
            const response = await fetch(`https://extension-360407.lm.r.appspot.com/api/snipx_snippets`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Failed to send data to the API");
            }

            const result = await response.json();
            console.log("API response:", result);
            alert("Weekly report approved and submitted successfully!");
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to approve and submit the report.");
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
                onChange={setWeeklyReport}
                placeholder="Weekly report"
                className="w-full p-2 border border-gray-300 rounded"
            />
            <button onClick={handleAnalyzeSubmit} className="mt-4 p-2 bg-yellow-500 text-white rounded">
                Analyze Report
            </button>

            <div className="flex flex-col items-center w-full max-w-lg mt-8 space-y-4">
                {/* Fields for results */}
                {results.green.length > 0 && (
                    <div className="w-full">
                        <h2 className="text-green-500 text-center mb-2">Green:</h2>
                        {results.green.map((item, index) => (
                            <input
                                key={`green-${index}`}
                                type="text"
                                value={item}
                                onChange={(e) => handleInputChange('green', index, e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded text-black"
                            />
                        ))}
                    </div>
                )}

                {results.orange.length > 0 && (
                    <div className="w-full">
                        <h2 className="text-orange-500 text-center mb-2">Orange:</h2>
                        {results.orange.map((item, index) => (
                            <input
                                key={`orange-${index}`}
                                type="text"
                                value={item}
                                onChange={(e) => handleInputChange('orange', index, e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded text-black"
                            />
                        ))}
                    </div>
                )}

                {results.red.length > 0 && (
                    <div className="w-full">
                        <h2 className="text-red-500 text-center mb-2">Red:</h2>
                        {results.red.map((item, index) => (
                            <input
                                key={`red-${index}`}
                                type="text"
                                value={item}
                                onChange={(e) => handleInputChange('red', index, e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded text-black"
                            />
                        ))}
                    </div>
                )}

                {/* Additional input fields for sentiment analysis data */}
                <div className="w-full">
                    <h2 className="text-gray-500 text-center mb-2">Sentiment Analysis Data:</h2>
                    <input
                        type="text"
                        value={results.explanations}
                        onChange={(e) => handleSentimentDataChange('explanations', e.target.value)}
                        placeholder="Explanations"
                        className="w-full p-2 border border-gray-300 rounded text-black mb-2"
                    />
                    <input
                        type="text"
                        value={results.score}
                        onChange={(e) => handleSentimentDataChange('score', e.target.value)}
                        placeholder="Score"
                        className="w-full p-2 border border-gray-300 rounded text-black mb-2"
                    />
                    <input
                        type="text"
                        value={results.sentiment}
                        onChange={(e) => handleSentimentDataChange('sentiment', e.target.value)}
                        placeholder="Sentiment"
                        className="w-full p-2 border border-gray-300 rounded text-black mb-2"
                    />
                </div>

                <button onClick={handleApprove} className="mt-4 p-2 bg-green-500 text-white rounded">
                    Approve
                </button>
            </div>
        </main>
    );
}

export default Users;
