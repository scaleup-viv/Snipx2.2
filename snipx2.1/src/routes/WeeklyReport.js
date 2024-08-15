import React, { useState } from "react";
import 'react-quill/dist/quill.snow.css'; 

// Dynamically import React Quill
const ReactQuill = React.lazy(() => import('react-quill'));

function Users() {
    const [day1Text, setDay1Text] = useState("");
    const [day2Text, setDay2Text] = useState("");
    const [day3Text, setDay3Text] = useState("");
    const [day4Text, setDay4Text] = useState("");
    const [day5Text, setDay5Text] = useState("");
    const [results, setResults] = useState({ green: [], orange: [], red: [], explanations: "", score: "", sentiment: "" });

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        // First POST request to the initial API
        const response1 = await fetch(`https://extension-360407.lm.r.appspot.com/api/analyze`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: day1Text }),
        });
        const data1 = await response1.json();
        console.log("data from first API", data1);

    
        // // Existing state update
        // setResults({
        //     green: data1["green"] || [],
        //     orange: data1["orange"] || [],
        //     red: data1["red"] || [],
        //     explanations: cleanedExplanations || "",
        //     score: data2["score"] || "",
        //     sentiment: data2["sentiment"] || "",
        // });
    };


    const handleSentimentDataChange = (field, value) => {
        setResults((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    // const handleApprove = async () => {
    //     const payload = {
    //         snipx_user_id: 1,
    //         inputText,
    //         green: results.green,
    //         orange: results.orange,
    //         red: results.red,
    //         explanations: results.explanations,
    //         score: results.score,
    //         sentiment: results.sentiment,
    //     };

    //     try {
    //         const response = await fetch(`https://extension-360407.lm.r.appspot.com/api/snipx_snippets`, {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify(payload),
    //         });

    //         if (!response.ok) {
    //             throw new Error("Failed to send data to the API");
    //         }

    //         const result = await response.json();
    //         console.log("API response:", result);
    //     } catch (error) {
    //         console.error("Error:", error);
    //     }
    // };

    return (
        <main className="flex min-h-screen flex-col items-center p-24">
            <h1>Generaate Weekly Report</h1>
            <form onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-lg">
                <ReactQuill
                    value={day1Text}
                    onChange={setDay1Text}
                    placeholder="Enter text here"
                    className="w-full p-2 border border-gray-300 rounded"
                />

                <ReactQuill
                    value={day2Text}
                    onChange={setDay2Text}
                    placeholder="Enter text here"
                    className="w-full p-2 border border-gray-300 rounded"
                />

                <ReactQuill
                    value={day3Text}
                    onChange={setDay3Text}
                    placeholder="Enter text here"
                    className="w-full p-2 border border-gray-300 rounded"
                />

                <ReactQuill
                    value={day4Text}
                    onChange={setDay4Text}
                    placeholder="Enter text here"
                    className="w-full p-2 border border-gray-300 rounded"
                />

                <ReactQuill
                    value={day5Text}
                    onChange={setDay5Text}
                    placeholder="Enter text here"
                    className="w-full p-2 border border-gray-300 rounded"
                />

                <button type="submit" className="mt-4 p-2 bg-blue-500 text-white rounded">
                    Submit
                </button>
            </form>

            <div className="flex flex-col items-center w-full max-w-lg mt-8 space-y-4">

                 {/* Additional input fields for the sentiment analysis data */}
                 <div className="w-full">
                    <h2 className="text-gray-500 text-center mb-2">Result:</h2>
                    <input
                        type="text"
                        value={results.explanations}
                        onChange={(e) => handleSentimentDataChange('explanations', e.target.value)}
                        placeholder="Explanations"
                        className="w-full p-2 border border-gray-300 rounded text-black mb-2"
                    />
                  
                    </div>
    
                    {/* <button
                        onClick={handleApprove}
                        className="mt-4 p-2 bg-green-500 text-white rounded"
                    >
                        Approve
                    </button> */}
                </div>
            </main>
        );
    }
    
    export default Users;
    
