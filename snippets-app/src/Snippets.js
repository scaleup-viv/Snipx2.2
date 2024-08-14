import React, { useState, Suspense } from "react";
import 'react-quill/dist/quill.snow.css';
import './Snippets.css';
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
    const [outputText, setOutputText] = useState("");
    // State to control the visibility of the graphic
    const [showGraphic, setShowGraphic] = useState(false);
    // State to store the numbers entered by the user
    const [numbers, setNumbers] = useState([]);
    // State to store the dates corresponding to the numbers
    const [dates, setDates] = useState([]);
    // State to handle the current number input
    const [currentNumber, setCurrentNumber] = useState("");
    // State to handle the current date input
    const [currentDate, setCurrentDate] = useState("");

    // Function to modigy so that the Output isn't the same as the input
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior
        setOutputText(inputText); // Set the outputText state to the current inputText
    };

    // Function to toggle the visibility of the graphic
    const toggleGraphic = () => {
        setShowGraphic(!showGraphic); // Toggle the showGraphic state between true and false
    };

    // Function to handle changes in the number input field (Unnecessary with ChatGPT generated Sentiment score)
    const handleNumberChange = (event) => {
        setCurrentNumber(event.target.value); // Update the currentNumber state with the input value
    };

    // Function to handle changes in the date input field
    const handleDateChange = (event) => {
        setCurrentDate(event.target.value); // Update the currentDate state with the selected date
    };

    // Function to add the current number and date to their respective arrays (Will be fused with the "Submit button")
    const addDataPoint = () => {
        // Ensure both number and date inputs are not empty
        if (currentNumber !== "" && currentDate !== "") {
            // Add the current number to the numbers array
            setNumbers([...numbers, parseInt(currentNumber)]);
            // Add the current date to the dates array
            setDates([...dates, currentDate]);
            // Clear the number input field after adding the number
            setCurrentNumber("");
            // Clear the date input field after adding the date
            setCurrentDate("");
        }
    };

    // Data object for the line chart, using dates as labels and numbers as data points
    const data = {
        labels: dates, // Use the dates as labels on the chart's x-axis
        datasets: [
            {
                label: 'Sentiment Score', // The label for the dataset
                data: numbers, // The data points corresponding to each date
                borderColor: '#E4277D', // Line color
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Area fill color below the line
                fill: true, // Enable filling the area under the line
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
            <h2>Snippets Generator</h2>
            
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
    
            {/* Display the output text only if outputText is set */}
            {outputText && (
                <div className="mt-4">
                    {/* Title for the output section */}
                    <h3>Output:</h3>
                    {/* Render the submitted rich text as HTML */}
                    <div
                        className="p-2 border border-gray-300 rounded"
                        dangerouslySetInnerHTML={{ __html: outputText }} // This allows rendering HTML directly from the outputText state
                    />
                </div>
            )}
    
            {/* Group containing the date and number input fields */}
            <div className="input-group">
                {/* Date input field container */}
                <div className="input-container mr-2">
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
    
                {/* Number input field container (Unnecessary with ChatGPT generated Sentiment score)*/}
                <div className="input-container">
                    <label htmlFor="number-input" className="block mb-2 text-gray-700">Enter a number:</label>
                    {/* Number input field */}
                    <input
                        id="number-input"
                        type="number" // Input type for entering numbers
                        value={currentNumber} // Controlled component, bound to currentNumber state
                        onChange={handleNumberChange} // Updates currentNumber state with entered value
                        className="p-2 border border-gray-300 rounded w-full" // Styling for the input field
                    />
                </div>
            </div>
    
            {/* Button group containing the add data point button and the toggle graphic button */}
            <div className="button-group mt-4">
                {/* Button to add the current date and number to the chart (Will be fused with the "Submit button") */}
                <button onClick={addDataPoint} className="mt-2 p-2 bg-green-500 text-white rounded">
                    Add Data Point
                </button>
    
                {/* Button to toggle the visibility of the chart */}
                <button onClick={toggleGraphic} className="mt-4 p-2 bg-gray-500 text-white rounded">
                    {showGraphic ? "Hide Graphic" : "Show Graphic"} {/* Conditional text based on showGraphic state */}
                </button>
            </div>
    
            {/* Conditionally render the line chart if showGraphic is true and there are data points */}
            {showGraphic && numbers.length > 0 && (
                <div className="graphic-placeholder mt-4">
                    {/* Line chart displaying the numbers and corresponding dates */}
                    <Line data={data} options={options} />
                </div>
            )}
        </div>
    );
    
};

export default Snippets;
