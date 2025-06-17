import React, { useState, useEffect } from 'react';
import { colourOf } from './atoms/Functions';
import { ChevronDown, ChevronUp } from "lucide-react";
import PopupTemplate from './template/PopupTemplate';
import Rating from './atoms/Rating';

const Home: React.FC = () => {
  const [currentUrl, setCurrentUrl] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [brandName, setBrandName] = useState('');
  const [ticker, setTicker] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Extract brand name from URL on load
  useEffect(() => {
    const getCurrentUrl = async () => {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab?.url) {
          const url = new URL(tab.url);
          const domain = url.hostname.replace('www.', '');
          const brand = domain.split('.')[0];
          const capitalized = brand.charAt(0).toUpperCase() + brand.slice(1);
          setBrandName(capitalized);
        }
      } catch (err) {
        console.error('Error getting URL:', err);
      }
    };
    getCurrentUrl();
  }, []);

  // Automatically fetch ticker when brand name changes
  useEffect(() => {
    if (!brandName) return;
    const fetchTicker = async () => {
      setError(null);
      setTicker(null);
      try {
        const response = await fetch(`https://earthbuddy.onrender.com/get_ticker?brand_name=${encodeURIComponent(brandName)}`);
        if (!response.ok) throw new Error('Failed to fetch ticker symbol.');
        const data = await response.json();
        if (data.ticker) {
          setTicker(data.ticker);
        } else {
          setError('No ticker symbol found.');
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(`Error: ${err.message}`);
        } else {
          setError('An unknown error occurred.');
        }
      }
    };
    fetchTicker();
  }, [brandName]);

  return (
    <PopupTemplate>
      <div className="flex items-center justify-between mb-4 w-full">
        {/* Left: Logo */}
        <img src="" alt="earthbuddy logo" className="w-10 h-10 m-2" />

        {/* Center: Rating */}
        <div className="text-4xl font-bold ml-12" style={{ color: colourOf(4) }}>
          4 / 5
        </div>

        {/* Right: Button */}
        <button
          disabled={!ticker}
          onClick={() =>
            ticker && window.open(`https://www.responsibilityreports.com/Companies?search=${ticker}`, '_blank')
          }
          className={`text-xs font-semibold px-3 py-1 rounded m-2 ${
            ticker ? 'text-blue-600 hover:underline' : 'text-gray-400 cursor-not-allowed'
          }`}
        >
          Find Out More
        </button>
      </div>

      {/* Input for brand name override */}
      <div className="mb-4">
        <input
          type="text"
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
          placeholder="Enter brand name"
          className="border border-gray-300 rounded p-2 w-full"
        />
        <button
          onClick={() => setBrandName(brandName)} // triggers re-fetch via useEffect
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded mt-2 w-full"
        >
          Find Ticker
        </button>
      </div>

      {/* Display ticker or error */}
      {ticker && <div className="text-green-600 font-semibold">Ticker Symbol: {ticker}</div>}
      {error && <div className="text-red-600 font-semibold">{error}</div>}

      <h2 className="text-lg font-semibold text-[#8B959B] mb-2">How other brands' doing...</h2>

      <div className="flex space-x-10 mb-4 mt-4">
        {[{ rating: 3 }, { rating: 4 }, { rating: 4.5 }].map((brand, index) => (
          <div key={index} className="flex flex-col items-center">
            <Rating rating={brand.rating} size={10} />
          </div>
        ))}
      </div>

      <button
        onClick={() => setShowDetails(!showDetails)}
        className="text-[#486BF3] font-semibold text-sm flex items-center"
      >
        {showDetails ? <ChevronUp size={16} className="mr-1" /> : <ChevronDown size={16} className="mr-1" />}
        Additional details
      </button>

      {showDetails && (
        <div className="mt-4 space-y-4">
          {[{ rating: 3, description: 'brand1' }, { rating: 4, description: 'brand2' }, { rating: 4, description: 'brand3' }].map((brand, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className='flex flex-col items-center'>
                <Rating rating={brand.rating} size={6} />
              </div>
              <div className="text-left text-sm">
                <p className="text-[#8B959B]">{brand.description} {brand.description}</p>
                <a href="#" className="text-[#486BF3] font-semibold text-sm block mt-1">Find out more!</a>
              </div>
            </div>
          ))}
        </div>
      )}
    </PopupTemplate>
  );
};

export default Home;