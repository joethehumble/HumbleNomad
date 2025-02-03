import React, { useState } from "react";
import '../styles/App.css';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");  // Clears input
  };

  return (
    <div className="SearchBar">
      <input
        type="text"
        className="SearchBar-Input"
        placeholder="Search Here..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      {searchTerm && (  // Show 'X' only when there's text
        <button className="clear-btn" onClick={clearSearch}>❌</button>
      )}
    </div>
  );
};

export default SearchBar;
