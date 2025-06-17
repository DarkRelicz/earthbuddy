import React, { useState, useEffect, use } from 'react';
import { colourOf } from './atoms/Functions';
import { ChevronDown, ChevronUp } from "lucide-react";

import ESGRiskBar from './more-information-component/ESGRiskBar';
import PopupTemplate from './template/PopupTemplate';
import Rating from './atoms/Rating';

const Home: React.FC = () => {
    const [showDetails, setShowDetails] = useState(false);
    const [moreInformation, setMoreInformation] = useState(false);
    const [brandName, setBrandName] = useState<string>(''); // Input for brand name
    const [ticker, setTicker] = useState<string | null>(null); // Ticker result
    const [error, setError] = useState<string | null>(null); // Error message
    const [esgScore, setEsgScore] = useState<number | null>(null);
    const [alternatives, setAlternatives] = useState<any[]>([]);

    // Retrieve current URL and infer brand name
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

    // fetch ESG scores and ratings from backend
    const fetchESGScores = async () => {
        try {
            if (!brandName) {
                throw new Error("No brandname");
            }

            const response = await fetch(`https://earthbuddy.onrender.com/get_ticker?brand_name=${encodeURIComponent(brandName)}`);
            if (!response.ok) {
                throw new Error("Failed to fetch response");
            }

            const data = await response.json();
            setEsgScore(data.esg_scores);
        } catch (err) {
            console.error(err);
            setEsgScore(-1);
        }
    };

    const fetchAlternatives = async () => {
    if (!brandName || esgScore == null) return;

    try {
        const response = await fetch(`https://gemini-connect.onrender.com/get_ticker?brand_name=${encodeURIComponent(brandName)}&esg_score=${esgScore}`);
        if (!response.ok) throw new Error("Failed to fetch alternatives");

        const data = await response.json();
        setAlternatives(data.alternatives || []);
        console.log(alternatives)
    } catch (error) {
        console.error("Error fetching Gemini alternatives:", error);
        setAlternatives([])
    }
};


    useEffect(() => {
        getBrandName();
    }, []);

    useEffect(() => {
        if (brandName) {
            fetchESGScores();
        }
    }, [brandName]);

    useEffect(() => {
    if (typeof esgScore === "number" && esgScore >= 0) {
        fetchAlternatives();
    }
    }, [esgScore]);

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


    return (
        <PopupTemplate>
            <div className="flex justify-between mb-3">
                <img src='/img/EarthBuddyLogo.png' alt="earthbuddy logo" className="w-20 h-20" />
                {esgScore == null ? (
                    <div className='m-4 text-4xl font-semibold text-[#8B959B]'>Loading...</div>
                ) : 
                (<div className='m-4 text-4xl font-bold' style={{ color: colourOf(esgScore) }} >{esgScore}</div>)}
                
            </div>

            <button
                onClick={() => setMoreInformation(!moreInformation)}
                className="text-[#486BF3] font-semibold text-sm flex items-center"
            >
                {moreInformation ? <ChevronUp size={16} className="mr-1" /> : <ChevronDown size={16} className="mr-1" />}
                More information
            </button>

            {moreInformation && (
                <div>
                    <ESGRiskBar score={esgScore} />
                    These scores measure a company's exposure to ESG risks and how well it's managing them. The lower the score, the better the sustainability risk profile.
                </div>
            )}

            <h2 className="text-lg font-semibold text-[#8B959B] mb-2 mt-4">How other brands' doing...</h2>

            <div className="flex space-x-10 mb-4 mt-4">
                {alternatives.length > 0 ? (
                    alternatives.map((brand, index) => {
                    // Convert ESG score (lower is better) to 1–5 star scale (invert scale)
                    // const rating = 5 - Math.min(Math.max(brand.esg_score / 10, 0), 5); // Normalize to 0–5, then invert

                    return (
                        <div key={index} className="flex flex-col items-center">
                        <Rating rating={brand.esg_score} size={10} />
                        </div>
                    );
                    })
                ) : (
                    // Optional fallback while waiting
                    [1, 2, 3].map((_, index) => (
                    <div key={index} className="flex flex-col items-center text-gray-300">
                        <Rating rating={-1} size={10} />
                    </div>
                    ))
                )}
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
                    {alternatives.length > 0 ? (
                        alternatives.map((brand, index) => (
                            <div key={index} className="flex items-start space-x-4">
                                <div className='flex flex-col items-center'>
                                    <Rating rating={brand.esg_score} size={6} />
                                </div>
                                <div className="text-left text-sm">
                                    <p className="text-[#8B959B]">
                                        <strong>{brand.brand_name}</strong> – ESG: {brand.esg_score}
                                    </p>
                                    <a href={brand.homepage} target="_blank" rel="noreferrer" className="text-[#486BF3] font-semibold text-sm block mt-1">
                                        Visit Homepage →
                                    </a>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">No alternatives found yet.</p>
                    )}
                </div>
            )}
        </PopupTemplate>
    );
};

export default Home;