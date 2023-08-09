"use client";

import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";

const DropdownForm = () => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Function to fetch data from the API
    const fetchItems = async () => {
      try {
        const response = await fetch("http://localhost:5000/command"); // Replace with your API endpoint
        const data = await response.json();
        setItems(data); // Assuming the response is an array of items
        setLoading(false);
      } catch (error) {
        console.error("Error fetching items:", error);
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleChange = (e) => {
    setSelectedItem(e.target.value);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <form>
      <label htmlFor="dropdown">Select an item:</label>
      <select id="dropdown" value={selectedItem} onChange={handleChange}>
        <option value="">-- Select an option --</option>
        {items.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
    </form>
  );
};

export default DropdownForm;