import React, { useState, useEffect } from "react";
import { useAuth } from "../AuthProvider";
import axios from "axios";
import './MySnippets.css';
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight } from "react-icons/fa";

function Snippets() {
    const { user } = useAuth();

  const [snippets, setSnippets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const snippetsPerPage = 3;

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
  }, [user]);

  // Calculate pagination details
  const indexOfLastSnippet = currentPage * snippetsPerPage;
  const indexOfFirstSnippet = indexOfLastSnippet - snippetsPerPage;
  const currentSnippets = snippets.slice(indexOfFirstSnippet, indexOfLastSnippet);

  const totalPages = Math.ceil(snippets.length / snippetsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber < 1) {
      setCurrentPage(1);
    } else if (pageNumber > totalPages) {
      setCurrentPage(totalPages);
    } else {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="snippets-page">
        <h1 className="snippets-title">My Snippets</h1>
        <div className="table-container">
            <table className="snippets-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Type</th>
                        <th>Date</th>
                        <th>Snippet Text</th>
                        <th>Green</th>
                        <th>Orange</th>
                        <th>Red</th>
                        <th>Explanations</th>
                    </tr>
                </thead>
                <tbody>
                    {currentSnippets.map((snippet) => (
                        <tr key={snippet.id}>
                            <td>{snippet.id}</td>
                            <td>{snippet.type || ""}</td>
                            <td>{snippet.date || ""}</td>
                            <td>{snippet.text || ""}</td>
                            <td>{JSON.stringify(snippet.green) || ""}</td>
                            <td>{JSON.stringify(snippet.orange) || ""}</td>
                            <td>{JSON.stringify(snippet.red) || ""}</td>
                            <td>{JSON.stringify(snippet.explanations) || ""}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        <div className="pagination">
            {/* First Page Button */}
            <button onClick={() => paginate(1)} disabled={currentPage === 1} className="pagination-button">
            <FaAngleDoubleLeft  />
            </button>

            {/* Previous Page Button */}
            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="pagination-button">
            <FaAngleLeft  />
            </button>

            {/* Previous Two Pages */}
            {currentPage > 2 && (
                <button onClick={() => paginate(currentPage - 2)} className="pagination-button">
                    {currentPage - 2}
                </button>
            )}
            {currentPage > 1 && (
                <button onClick={() => paginate(currentPage - 1)} className="pagination-button">
                    {currentPage - 1}
                </button>
            )}

            {/* Current Page */}
            <button className="pagination-button active">{currentPage}</button>

            {/* Next Two Pages */}
            {currentPage < totalPages && (
                <button onClick={() => paginate(currentPage + 1)} className="pagination-button">
                    {currentPage + 1}
                </button>
            )}
            {currentPage < totalPages - 1 && (
                <button onClick={() => paginate(currentPage + 2)} className="pagination-button">
                    {currentPage + 2}
                </button>
            )}

            {/* Next Page Button */}
            <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="pagination-button">
            <FaAngleRight />
            </button>

            {/* Last Page Button */}
            <button onClick={() => paginate(totalPages)} disabled={currentPage === totalPages} className="pagination-button">
            <FaAngleDoubleRight />
            </button>
        </div>
    </div>
  );
}

export default Snippets;
