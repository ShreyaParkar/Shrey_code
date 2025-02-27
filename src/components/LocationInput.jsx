import { useState } from "react";

const LocationInput = ({ label, onLocationSelect }) => {
  const [location, setLocation] = useState("");

  return (
    <div>
      <label>{label}</label>
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Enter location"
        className="border p-2 w-full"
      />
      <button
        onClick={() => onLocationSelect(location)}
        className="mt-2 bg-blue-500 text-white p-2 rounded"
      >
        Set {label}
      </button>
    </div>
  );
};

export default LocationInput;
