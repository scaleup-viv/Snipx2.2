import React, { useState, useEffect } from "react";
import 'react-quill/dist/quill.snow.css'; 

// Dynamically import React Quill
const ReactQuill = React.lazy(() => import('react-quill'));

function Users() {
    const [inputText, setInputText] = useState("");
    const [currentDate, setCurrentDate] = useState("");
    const [results, setResults] = useState({ green: [], orange: [], red: [], explanations: "", score: "", sentiment: "" });

    useEffect(() => {
        // Set the current date (without time) when the component mounts
        const now = new Date();
        const formattedDate = now.toISOString().slice(0, 10); // YYYY-MM-DD format
        setCurrentDate(formattedDate);
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        // First POST request to the initial API
        const response1 = await fetch(`https://extension-360407.lm.r.appspot.com/api/analyze`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: inputText }),
        });
        const data1 = await response1.json();
        console.log("data from first API", data1);
    
        // Second POST request to the sentimentAnalysis API
        const response2 = await fetch(`https://extension-360407.lm.r.appspot.com/api/sentimentAnalysis`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: inputText }),
        });
        const data2 = await response2.json();
        console.log("data from sentimentAnalysis API", data2);
    
        // Clean up HTML tags from explanations and extract only numbers from the score
        const cleanedExplanations = data2.explanations ? data2.explanations.replace(/<\/?[^>]+(>|$)/g, "") : "";
        
        // Existing state update
        setResults({
            green: data1["green"] || [],
            orange: data1["orange"] || [],
            red: data1["red"] || [],
            explanations: cleanedExplanations || "",
            score: data2["score"] || "",
            sentiment: data2["sentiment"] || "",
        });
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
            snipx_user_id: 1,
            inputText,
            date: currentDate,  // Include the date here
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
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center p-24">
            <h1>Snippet AI Analysis</h1>
            <form onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-lg">
                <ReactQuill
                    value={inputText}
                    onChange={setInputText}
                    placeholder="Enter text here"
                    className="w-full p-2 border border-gray-300 rounded"
                />
                <button type="submit" className="mt-4 p-2 bg-blue-500 text-white rounded">
                    Submit
                </button>
            </form>

            <div className="flex flex-col items-center w-full max-w-lg mt-8 space-y-4">
                {/* Date Field */}
                <div className="w-full">
                    <h2 className="text-gray-500 text-center mb-2">Date:</h2>
                    <input
                        type="text"
                        value={currentDate}
                        readOnly
                        className="w-full p-2 border border-gray-300 rounded text-black mb-2"
                    />
                </div>

                {Array.isArray(results.green) && results.green.length > 0 && (
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

                {Array.isArray(results.orange) && results.orange.length > 0 && (
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

                {Array.isArray(results.red) && results.red.length > 0 && (
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

                {/* Additional input fields for the sentiment analysis data */}
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

                <button
                    onClick={handleApprove}
                    className="mt-4 p-2 bg-green-500 text-white rounded"
                >
                    Approve
                </button>
            </div>
        </main>
    );
}

export default Users;
