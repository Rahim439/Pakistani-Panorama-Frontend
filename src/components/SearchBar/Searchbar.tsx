const SearchBar = () => {
    return (
      <div
        className="flex flex-col my-10 items-center justify-center p-6 bg-cover bg-center min-h-[600px] text-white"
        style={{
          backgroundImage: "url('/assets/images/LahoreBadshaiMosque.jpg')",
        }}
      >
        {/* Title and Subtitle */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold">Lahore Hotels and Places to Stay</h1>
          <p className="text-lg">Enter dates to find the best prices</p>
        </div>
  
        {/* Search Bar */}
        <div className="flex flex-wrap justify-center items-center bg-white text-black bg-opacity-90 p-4 rounded-lg shadow-md space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex flex-col w-full sm:w-auto">
            <label className="mb-2 text-gray-700 font-medium">Check-In</label>
            <input
              type="date"
              className="p-2 border border-gray-300 rounded-lg w-full sm:w-auto"
            />
          </div>
          <div className="flex flex-col w-full sm:w-auto">
            <label className="mb-2 text-gray-700 font-medium">Check-Out</label>
            <input
              type="date"
              className="p-2 border border-gray-300 rounded-lg w-full sm:w-auto"
            />
          </div>
          <div className="flex flex-col w-full sm:w-auto">
            <label className="mb-2 text-gray-700 font-medium">Guests</label>
            <select className="p-2 border border-gray-300 rounded-lg w-full sm:w-auto">
              <option>1 room, 2 adults, 0 children</option>
            </select>
          </div>
        </div>
      </div>
    );
  };
  
  export default SearchBar;
  