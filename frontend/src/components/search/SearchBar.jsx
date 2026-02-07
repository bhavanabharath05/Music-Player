import React, { useEffect, useState } from "react";
import axios from "axios";

import { CiSearch } from "react-icons/ci";
import "../../css/search/SearchBar.css";

const SearchBar = ({ setSearchSongs }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // ✅ FIX: Check for empty query FIRST
    if (!query.trim()) {
      setSearchSongs([]);
      return;
    }

    setLoading(true);

    // ✅ FIX: Debounce with 800ms
    const debounceId = setTimeout(async () => {
      try {
        // ✅ FIX: Use correct endpoint - /tag/ instead of /playlist/
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/songs/tag/${encodeURIComponent(query)}`
        );

        // ✅ FIX: Handle response correctly - it's an array, not an object with results
        setSearchSongs(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Search failed:", error);
        
        // ✅ FIX: Handle 404 error specifically
        if (error.response?.status === 404) {
          console.warn("No songs found for query:", query);
        } else if (error.response?.status === 429) {
          console.warn("Rate limited. Please wait before searching again.");
        }
        
        setSearchSongs([]);
      } finally {
        setLoading(false);
      }
    }, 800); // Increased debounce time

    // ✅ Cleanup on unmount or when query changes
    return () => clearTimeout(debounceId);
  }, [query, setSearchSongs]); // ✅ Added setSearchSongs to dependencies

  return (
    <div className="searchbar-root">
      <div className="searchbar-input-wrapper">
        <input
          className="searchbar-input"
          type="text"
          placeholder="Search songs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        <CiSearch className="searchbar-icon" size={18} />
      </div>

      {query && !loading && (
        <p className="searchbar-empty">Search songs to display</p>
      )}

      {loading && <p className="searchbar-loading">Searching...</p>}
    </div>
  );
};

export default SearchBar;
