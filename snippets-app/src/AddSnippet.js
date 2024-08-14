import React, { useState,useEffect, Suspense } from "react";
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
    const [showOutputs,setShowOutputs] = useState(false);
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
    

    // Function to modify to put actual results
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        setResults({
            green: ["Sample Green Text"], // Replace with actual logic
            orange: ["Sample Orange Text"], // Replace with actual logic
            red: ["Sample Red Text"], // Replace with actual logic
            explanations: "Explanation", // Simply using inputText for all outputs
            score: "10", // Example score value
            sentiment: "Sentiment", // Simply using inputText for all outputs
        });
        setShowOutputs(true);
    };

    // Function to toggle the visibility of the graphic
    const toggleGraphic = () => {
        setShowGraphic(!showGraphic); // Toggle the showGraphic state between true and false
    };

    // Function to handle changes in the date input field
    const handleDateChange = (event) => {
        setCurrentDate(event.target.value); // Update the currentDate state with the selected date
    };

    // Update currentScore when results.score changes
    useEffect(() => {
        setCurrentScore(results.score);
    }, [results.score]);

    const handleApprove = () => {
        // Logic to handle approve button click
        console.log("Approved:", results);
        // Ensure both score and date inputs are not empty
        if (currentScore !== "" && currentDate !== "") {
            // Add the current score to the scores array
            setScores([...scores, parseInt(currentScore)]);
            // Add the current date to the dates array
            setDates([...dates, currentDate]);
            // Clear the score input field after adding the score
            setCurrentScore("");
            // Clear the date input field after adding the date
            setCurrentDate("");
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
    
            {/* Display the output text*/}
            <div className="flex flex-col items-center w-full max-w-lg mt-8 space-y-4">
                {showOutputs && (
                    <div className="w-full">
                        <h2 className="green-title mb-2">Green:</h2>
                        {results.green.map((item, index) => (
                            <input
                                key={`green-${index}`}
                                type="text"
                                value={item}
                                className="w-full p-2 border border-gray-300 rounded text-black"
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
                            <input
                                key={`orange-${index}`}
                                type="text"
                                value={item}
                                className="w-full p-2 border border-gray-300 rounded text-black"
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
                            <input
                                key={`red-${index}`}
                                type="text"
                                value={item}
                                className="w-full p-2 border border-gray-300 rounded text-black"
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
                        <input
                            type="text"
                            value={results.explanations}
                            placeholder="Explanations"
                            className="w-full p-2 border border-gray-300 rounded text-black mb-2"
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
                        <input
                            type="number"
                            value={results.score}
                            placeholder="Score"
                            className="w-full p-2 border border-gray-300 rounded text-black mb-2"
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
                        <input
                            type="text"
                            value={results.sentiment}
                            placeholder="Sentiment"
                            className="w-full p-2 border border-gray-300 rounded text-black mb-2"
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
                {/* Button to add the current date and score to the chart (Will be fused with the "Submit button") */}
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
