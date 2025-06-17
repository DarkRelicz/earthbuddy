import React, { useState, useEffect } from 'react';
import { colourOf } from './atoms/Functions';
import { ChevronDown, ChevronUp } from "lucide-react";
import { getResponseForGivenPrompt } from "../services/AI-prompt";

import PopupTemplate from './template/PopupTemplate';
import Rating from './atoms/Rating';

const Home: React.FC = () => {
    const [showDetails, setShowDetails] = useState(false);
    const [brandName, setBrandName] = useState<string>(''); // Input for brand name
    const [ticker, setTicker] = useState<string | null>(null); // Ticker result
    const [error, setError] = useState<string | null>(null); // Error message
    const [response, setResponse] = useState<string | null>(null);

    // Retrieve current URL and infer brand name
    useEffect(() => {
        const getBrandName = async () => {
            try {
                const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
                if (tab?.url) {
                    console.log(tab.url);
                    // Extract the domain and infer the brand name
                    const domainRegex = /(?:https?:\/\/)?(?:.*\.)?([^.\/]+)\.[^.\/]+(?:\/|$)/;
                    const match = tab.url.match(domainRegex);
                    if (match && match[1]) {
                        const brand = match[1];
                        console.log(match);
                        console.log(brand);
                        setBrandName(brand.charAt(0).toUpperCase() + brand.slice(1)); // Capitalize the first letter
                    }      
                }
            } catch (err) {
                console.error('Error getting URL:', err);
            }
        };
        getBrandName();
    }, []);

    // Fetch ticker from backend
    const fetchTicker = async () => {
        setError(null); // Reset error
        setTicker(null); // Reset ticker

        if (!brandName) {
            setError('Please enter a brand name.');
            return;
        }

        try {
            // Use the Render backend URL
            const response = await fetch(`https://earthbuddy.onrender.com/get_ticker?brand_name=${encodeURIComponent(brandName)}`);
            if (!response.ok) {
                throw new Error('Failed to fetch ticker symbol.');
            }

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

    const handleClick = async () => {
        const result = await getResponseForGivenPrompt();
        // setResponse(result);
        // console.log(result);
    }

    return (
        <PopupTemplate>
            <div className="flex justify-between mb-4">
                <img src='' alt="earthbuddy logo" className="w-10 mb-1 m-4" />
                <div className='m-4 text-4xl font-bold' style={{ color: colourOf(4) }} >4 / 5</div>
            </div>

            <h2 className="text-lg font-semibold text-[#8B959B] mb-2">How other brands' doing...</h2>

            <div className="flex space-x-10 mb-4 mt-4">
                {/* Mock data */}
                {[{ rating: 3 }, { rating: 4 }, { rating: 4.5 }].map((brand, index) => (
                    <div key={index} className="flex flex-col items-center">
                        <Rating rating={brand.rating} size={10} />
                    </div>
                ))}
            </div>

            {/* Input for brand name */}
            <div className="mb-4">
                <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="Enter brand name"
                    className="border border-gray-300 rounded p-2 w-full"
                />
                <button
                    onClick={fetchTicker}
                    className="bg-blue-500 text-white font-semibold py-2 px-4 rounded mt-2 w-full"
                >
                    Find Ticker
                </button>
            </div>

            {/* Display ticker or error */}
            {ticker && <div className="text-green-600 font-semibold">Ticker Symbol: {ticker}</div>}
            {error && <div className="text-red-600 font-semibold">{error}</div>}

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
                                <p className="text-[#8B959B]">
                                    {brand.description} {brand.description}
                                </p>
                                <a href="#" className="text-[#486BF3] font-semibold text-sm block mt-1">Find out more!</a>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="">
                <button
                    onClick={handleClick}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                    Ask Gemini
                </button>
                {response && (
                    <div className="mt-4 p-2 bg-gray-100 rounded text-sm">{response}</div>
                )}
            </div>
        </PopupTemplate>
    );
};

export default Home;