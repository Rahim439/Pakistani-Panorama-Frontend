import React, { useState } from "react";

// Define types for Geoapify response
interface HotelProperties {
  name: string;
  address_line2: string | null;
  icon: string; // Geoapify provides an icon URL for the place
}

interface Hotel {
  properties: HotelProperties;
}

interface GeoapifyResponse {
  features: {
    properties: HotelProperties;
  }[];
}

const HotelSearch: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /*https://myprojects.geoapify.com/api/zSfZJsxrq0Zwg2c7UlqR/keys*/

  const GEOAPIFY_API_KEY = "4edf5f75939845488f9c252247d72b62"; // Replace with your Geoapify API key

  // Function to get user location and fetch hotels
  const fetchHotels = async () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        try {
          // Fetch hotels from Geoapify, including images
          const response = await fetch(
            `https://api.geoapify.com/v2/places?categories=accommodation.hotel&filter=circle:${lon},${lat},5000&limit=10&apiKey=${GEOAPIFY_API_KEY}`
          );

          if (!response.ok) {
            throw new Error("Failed to fetch hotel data.");
          }


          const data: GeoapifyResponse = await response.json();
          const hotelsData = data.features.map((hotel) => ({
            properties: {
              name: hotel.properties.name,
              address_line2: hotel.properties.address_line2,
              icon: hotel.properties.icon, // Geoapify icon
            },
          }));
          await setHotels(hotelsData);
        } catch (_) {
          setError("Failed to fetch data. Please try again.");
        } finally {
          setLoading(false);
        }
      },
      (_) => {
        setError("Failed to get location. Please enable GPS.");
        setLoading(false);
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-200 flex justify-center items-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full md:w-9/12 lg:w-8/12 max-w-3xl">
        <h1 className="text-3xl font-semibold text-gray-800 text-center mb-6">
          Nearby Hotels
        </h1>

        <button
          onClick={fetchHotels}
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold text-lg transition duration-300 hover:bg-indigo-700 disabled:bg-gray-400 mb-4"
        >
          {loading ? "Fetching..." : "Show Hotels"}
        </button>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {hotels.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((hotel, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {hotel.properties.name || "Unnamed Hotel"}
                </h3>
                <p className="text-gray-600">
                  {hotel.properties.address_line2 || "Address not available"}
                </p>

                {/* Display hotel image or fallback image */}
                {/* Display hotel icon or fallback image */}
{hotel.properties.icon ? (
  <div className="mt-4 w-full h-48 flex justify-center items-center">
    <img
      src={hotel.properties.icon} // This is a small icon, not a full hotel photo.
      alt={hotel.properties.name}
      className="w-12 h-12 object-contain"
    />
  </div>
) : (
  <div className="mt-4 w-full h-48 flex justify-center items-center">
    <img
      src="https://via.placeholder.com/300x200.png?text=Hotel+Image" // Placeholder image
      alt="Hotel"
      className="w-full h-48 object-cover rounded-lg"
    />
  </div>
)}

              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 mt-4">
            No hotels found. Try clicking the button.
          </p>
        )}
      </div>
    </div>
  );
};

export default HotelSearch;
