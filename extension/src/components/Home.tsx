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
    const [esgScore, setEsgScore] = useState<number | null>(null);
    const [brandLogo, setBrandLogo] = useState<string>("");
    const [alternatives, setAlternatives] = useState<any[]>([]);

    // Retrieve current URL and infer brand name
    const getBrandName = async () => {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tab?.url) {
                console.log(tab.url);
                const url = new URL(tab.url);
                const domain = url.hostname;
                console.log(domain);

                // Extract the domain and infer the brand name
                const domainRegex = /(?:www\.)?(?:([a-z]{2}\.))?(?:shop|corporate\.)?([^.\/]+)\.[^.\/]+\.*/;
                const match = domain.match(domainRegex);
                console.log(match);
                if (match && match[2]) {
                    const brand = match[2];
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
            setBrandLogo(data.image_url);
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
            fetchTicker();
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
        setTicker(null); // Reset ticker

        try {
            if (!brandName) {
                throw new Error("No brandname");
            }
            // Use the Render backend URL
            const response = await fetch(`https://earthbuddy.onrender.com/get_ticker?brand_name=${encodeURIComponent(brandName)}`);
            if (!response.ok) {
                throw new Error('Failed to fetch ticker symbol.');
            }

            const data = await response.json();
            if (data.ticker) {
                setTicker(data.ticker);
            } else {
                throw new Error('No ticker symbol found.');
            }
        } catch (err) {
            if (err instanceof Error) {
                console.error(`Error: ${err.message}`);
            } else {
                console.error('An unknown error occurred.');
            }
        }
    };

    return (
        <PopupTemplate>
            <div className='flex flex-row items-center justify-center inline-flex mb-6'>
                <img src='img/EarthBuddyLogo.png' alt="earthbuddy logo" className="w-11 mr-4" />
                <h2 className="text-lg font-semibold text-[#12364A]">Sustainability Report</h2>
            </div>

            <div className="flex justify-between mb-1 items-center">
                {esgScore == null ? (
                    <>
                        <img src='img/EarthBuddyLogo.png' alt="earthbuddy logo" className="w-20 h-20" />
                        <div className='m-4 text-4xl font-semibold text-[#8B959B]'>Loading...</div>
                    </>
                ) :
                    (<>
                        <img src={brandLogo} alt="brand logo" className="w-20 h-20 object-contain" />
                        <div className='m-4 text-4xl font-bold' style={{ color: colourOf(esgScore) }} >{esgScore}</div>
                    </>
                    )}
            </div>

            <button
                disabled={!ticker}
                onClick={() =>
                    ticker && window.open(`https://www.responsibilityreports.com/Companies?search=${ticker}`, '_blank')
                }
                className={`text-[#486BF3] text-s font-semibold px-3 py-1 rounded m-2 ${ticker ? 'text-blue-600 hover:underline' : 'text-gray-400 cursor-not-allowed'
                    }`}
            >
                View detailed Sustainability Report
            </button>

            <button
                onClick={() => setMoreInformation(!moreInformation)}
                className="text-[#486BF3] font-semibold text-sm flex items-center"
            >
                {moreInformation ? <ChevronUp size={16} className="mr-1" /> : <ChevronDown size={16} className="mr-1" />}
                About the score
            </button>

            {moreInformation && (
                <div>
                    <ESGRiskBar score={esgScore} />
                    These scores measure a company's exposure to ESG risks and how well it's managing them. The lower the score, the better the sustainability risk profile.
                    <button
                        onClick={() => window.open('https://www.home.saxo/en-sg/content/articles/esg/how-to-read-an-esg-rating-25042024', '_blank')}
                        className="text-[#486BF3] font-semibold text-sm block w-fit mx-auto mt-1"
                    >
                        Find out more about ESG risk rating!
                    </button>
                </div>
            )}

            {alternatives.length == 0 ? (
                <div className='m-4 text-2xl font-semibold text-[#8B959B]'>Loading alternatives...</div>
            ) : (
                <>
                    <h2 className="text-lg font-semibold text-[#8B959B] mb-2 mt-4">How other brands' doing...</h2>

                    <div className="flex space-x-10 mb-4 mt-4">
                        {alternatives.length > 0 && (
                            alternatives.map((brand, index) => {
                                return (
                                    <div key={index} className="flex flex-col items-center">
                                        <Rating rating={brand.esg_score} imageUrl={brand.image_url} size={60}/>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="text-[#486BF3] font-semibold text-sm flex items-center"
                    >
                        {showDetails ? <ChevronUp size={16} className="mr-1" /> : <ChevronDown size={16} className="mr-1" />}
                        Additional details
                    </button>

                    {showDetails && (
                        <div className="mt-4">
                            {alternatives.length > 0 ? (
                                <div className='space-y-4'>
                                    {alternatives.map((brand, index) => (
                                        <div key={index} className="flex items-start">
                                            <div className='w-1/4 pr-4 flex flex-col items-center justify-center'>
                                                <Rating rating={brand.esg_score} imageUrl={brand.image_url} size={44} />
                                            </div>
                                            <div className="w-3/4 text-left text-sm">
                                                <p className="text-[#8B959B] mb-1">
                                                    <strong>{brand.brand_name}</strong> - ESG: {brand.esg_score}
                                                </p>
                                                <a href={brand.homepage} target="_blank" rel="noreferrer" className="text-[#486BF3] font-semibold text-sm block mt-1">
                                                    Visit Homepage →
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">No alternatives found yet.</p>
                            )}
                        </div>
                    )}
                </>
            )}
        </PopupTemplate>
    );
};

export default Home;