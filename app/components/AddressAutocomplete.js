import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddressAutocomplete = ({ onAddressSelect }) => {
  const [address, setAddress] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(true); // New state to control visibility of suggestions

  useEffect(() => {
    if (address.length < 3 || !showSuggestions) {
      setSuggestions([]);
      return;
    }

    const loadSuggestions = async () => {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${address}`);
      setSuggestions(response.data);
    };

    loadSuggestions();
  }, [address, showSuggestions]);

  const handleSelect = (suggestion) => {
    setAddress(suggestion.display_name); // Update the input field with the selected address
    setSuggestions([]); // Clear suggestions
    setShowSuggestions(false); // Hide suggestions list
    onAddressSelect(suggestion); // Propagate the selection back to the form
  };

  // When the user starts editing the address field after a selection,
  // show suggestions again.
  const handleAddressChange = (e) => {
    setAddress(e.target.value);
    setShowSuggestions(true);
  };

  return (
    <div>
      <input
        type="text"
        value={address}
        onChange={handleAddressChange}
        placeholder="Start typing an address..."
        onFocus={() => setShowSuggestions(true)} // Show suggestions when the field is focused
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul>
          {suggestions.map(suggestion => (
            <li key={suggestion.place_id} onClick={() => handleSelect(suggestion)}>
              {suggestion.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default AddressAutocomplete;
