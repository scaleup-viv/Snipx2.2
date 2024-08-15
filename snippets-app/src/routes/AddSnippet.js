import React, { useState, useEffect, Suspense } from "react";
import 'react-quill/dist/quill.snow.css';
import './AddSnippet.css';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Dynamically import React Quill for rich text editing
const ReactQuill = React.lazy(() => import('react-quill'));

const Snippets = () => {
    // State to manage the rich text input
    const [inputText, setInputText] = useState("");
    // State to manage the output of the submitted text
    const [results, setResults] = useState({ green: [], orange: [], red: [], explanations: "", score: "", sentiment: "" });
    // State to handle the Display of outputs
    const [showOutputs, setShowOutputs] = useState(false);
    // State to control the visibility of the graphic
    const [showGraphic, setShowGraphic] = useState(false);
    // State to store the scores entered by the user
    const [scores, setScores] = useState([]);
    // State to store the dates corresponding to the scores
    const [dates, setDates] = useState([]);
    // State to handle the current score input
    const [currentScore, setCurrentScore] = useState("");
    // State to handle the current date input
    const [currentDate, setCurrentDate] = useState("");

    // Set the current date when the component mounts
    useEffect(() => {
        const now = new Date();
        const formattedDate = now.toISOString().slice(0, 10); // YYYY-MM-DD format
        setCurrentDate(formattedDate);
    }, []);

    // Function to handle form submission and fetch data from APIs
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior

        try {
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

            // Update the results state with data from the APIs
            setResults({
                green: data1["green"] || [],
                orange: data1["orange"] || [],
                red: data1["red"] || [],
                explanations: cleanedExplanations || "",
                score: data2["score"] || "",
                sentiment: data2["sentiment"] || "",
            });
            setCurrentScore(data2["score"] || "");

            setShowOutputs(true); // Show the outputs once data is fetched
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    // Function to toggle the visibility of the graphic
    const toggleGraphic = () => {
        setShowGraphic(!showGraphic); // Toggle the showGraphic state between true and false
    };

    // Function to handle changes in the date input field
    const handleDateChange = (event) => {
        setCurrentDate(event.target.value); // Update the currentDate state with the selected date
    };

    // Function to approve the snippet and save it
    const handleApprove = async () => {
        const payload = {
            snipx_user_id: 1, // Replace with the actual user ID if needed
            type: "daily",
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

            // Add the current score to the chart if not empty
            if (currentScore !== "" && currentDate !== "") {
                setScores([...scores, parseInt(currentScore)]);
                setDates([...dates, currentDate]);
                setCurrentScore(""); // Clear the score input field after adding the score
                setCurrentDate(""); // Clear the date input field after adding the date
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // Data object for the line chart, using dates as labels and scores as data points
    const data = {
        labels: dates, // Use the dates as labels on the chart's x-axis
        datasets: [
            {
                label: 'Sentiment Score', // The label for the dataset
                data: scores, // The data points corresponding to each date
                borderColor: '#E4277D', // Line color
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Area fill color below the line
                fill: false, // Enable filling the area under the line
                tension: 0.1, // Set the tension of the line for slight curves
            },
        ],
    };

    // Configuration options for the chart, ensuring the y-axis begins at zero
    const options = {
        scales: {
            y: {
                beginAtZero: true, // Start the y-axis at 0 for better readability
            },
        },
    };

    function autoResizeTextarea(textarea) {
        textarea.style.height = 'auto'; // Reset height to auto
        textarea.style.height = `${textarea.scrollHeight}px`; // Adjust height to fit content
    }
    
    useEffect(() => {
        const textareas = document.querySelectorAll('.auto-resize');
        textareas.forEach((textarea) => {
            autoResizeTextarea(textarea);
        });
    }, [results]); // Adjust whenever the results change
    

    return (
        <div className="snippets-container">
            {/* Page title */}
            <h1>Add Snippet</h1>
            <div className="form-container">
                {/* Date input field container */}
                <div className="input-container">
                    <label htmlFor="date-input" className="block mb-2 text-gray-700">Enter a date:</label>
                    {/* Date input field */}
                    <input
                        id="date-input"
                        type="date" // Input type for selecting dates
                        value={currentDate} // Controlled component, bound to currentDate state
                        onChange={handleDateChange} // Updates currentDate state with selected date
                        className="p-2 border border-gray-300 rounded w-full" // Styling for the input field
                    />
                </div>
                
                {/* Form for submitting rich text snippets */}
                <form onSubmit={handleSubmit}>
                    <Suspense fallback={<div>Loading editor...</div>}>
                        {/* Rich text editor using ReactQuill */}
                        <ReactQuill
                            value={inputText} // Controlled component, bound to inputText state
                            onChange={setInputText} // Updates inputText state with editor content
                            placeholder="Enter your text here..." // Placeholder text for the editor
                            className="w-full p-2 border border-gray-300 rounded" // Styling for the editor
                        />
                    </Suspense>
                    {/* Submit button for the snippets */}
                    <button type="submit" className="mt-4 p-2 bg-blue-500 text-white rounded">
                        Submit
                    </button>
                </form>
            </div>
    
            {/* Display the output text */}
            <div className="flex flex-col items-center w-full max-w-lg mt-8 space-y-4">
                {showOutputs && (
                    <div className="w-full">
                    <h2 className="green-title mb-2">Green:</h2>
                    {results.green.map((item, index) => (
                        <textarea
                            key={`green-${index}`}
                            value={item}
                            className="auto-resize mb-2"
                            onChange={(e) => setResults((prevResults) => ({
                                ...prevResults,
                                green: prevResults.green.map((el, idx) => idx === index ? e.target.value : el)
                            }))} // Allow editing of the green text
                        />
                    ))}
                </div>
                )}

                {showOutputs && (
                    <div className="w-full">
                        <h2 className="orange-title mb-2">Orange:</h2>
                        {results.orange.map((item, index) => (
                            <textarea
                                key={`orange-${index}`}
                                value={item}
                                className="auto-resize mb-2"
                                onChange={(e) => setResults((prevResults) => ({
                                    ...prevResults,
                                    orange: prevResults.orange.map((el, idx) => idx === index ? e.target.value : el)
                                }))} // Allow editing of the orange text
                            />
                        ))}
                    </div>
                )}

                {showOutputs && (
                    <div className="w-full">
                        <h2 className="red-title mb-2">Red:</h2>
                        {results.red.map((item, index) => (
                            <textarea
                                key={`red-${index}`}
                                value={item}
                                className="auto-resize mb-2"
                                onChange={(e) => setResults((prevResults) => ({
                                    ...prevResults,
                                    red: prevResults.red.map((el, idx) => idx === index ? e.target.value : el)
                                }))} // Allow editing of the red text
                            />
                        ))}
                    </div>
                )}

                {showOutputs && (
                    <div className="w-full">
                        <h2 className="text-gray-500 text-center mb-2">Explanations:</h2>
                        <textarea
                            value={results.explanations}
                            className="auto-resize mb-2"
                            placeholder="Explanations"
                            onChange={(e) => setResults((prevResults) => ({
                                ...prevResults,
                                explanations: e.target.value
                            }))} // Allow editing of the explanations
                        />
                    </div>
                )}

                {showOutputs && (
                    <div className="w-full">
                        <h2 className="text-gray-500 text-center mb-2">Score:</h2>
                        <textarea
                            value={results.score}
                            className="auto-resize mb-2"
                            placeholder="Score"
                            onChange={(e) => {
                                const newScore = e.target.value;
                                setResults((prevResults) => ({
                                    ...prevResults,
                                    score: newScore
                                }));
                                setCurrentScore(newScore); // Update the currentScore state
                            }} // Allow editing of the score
                        />
                    </div>
                )}

                {showOutputs && (
                    <div className="w-full">
                        <h2 className="text-gray-500 text-center mb-2">Sentiment:</h2>
                        <textarea
                            value={results.sentiment}
                            className="auto-resize mb-2"
                            placeholder="Sentiment"
                            onChange={(e) => setResults((prevResults) => ({
                                ...prevResults,
                                sentiment: e.target.value
                            }))} // Allow editing of the sentiment
                        />
                    </div>
                )}

            </div>
    
            {/* Button group containing the add data point button and the toggle graphic button */}
            <div className="button-group mt-4">
                {/* Button to add the current date and score to the chart */}
                <button
                    onClick={handleApprove}
                    className="mt-4 p-2 bg-green-500 text-white rounded"
                >
                    Approve
                </button>
    
                {/* Button to toggle the visibility of the chart */}
                <button onClick={toggleGraphic} className="mt-4 p-2 bg-gray-500 text-white rounded">
                    {showGraphic ? "Hide Graphic" : "Show Graphic"} {/* Conditional text based on showGraphic state */}
                </button>
            </div>
    
            {/* Conditionally render the line chart if showGraphic is true and there are data points */}
            {showGraphic && scores.length > 0 && (
                <div className="graphic-placeholder mt-4">
                    {/* Line chart displaying the scores and corresponding dates */}
                    <Line data={data} options={options} />
                </div>
            )}
        </div>
    );
};

export default Snippets;
