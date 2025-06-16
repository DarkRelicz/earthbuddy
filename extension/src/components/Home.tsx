import React, { useState, useEffect } from 'react'
import { colourOf } from './atoms/Functions';
import { ChevronDown, ChevronUp } from "lucide-react";

import PopupTemplate from './template/PopupTemplate';
import Rating from './atoms/Rating';


const Home: React.FC = () => {
    const [currentUrl, setCurrentUrl] = useState<string>('');
    const [showDetails, setShowDetails] = useState(false);

    // retrieve current url
    useEffect(() => {
        const getCurrentUrl = async () => {
            try {
                const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
                if (tab?.url) {
                    setCurrentUrl(tab.url);
                }
            } catch (err) {
                console.error('Error getting URL:', err);
            }
        };
        getCurrentUrl();
    }, []);

    console.log(currentUrl);

    // mock data
    const mockCurrData = { rating: 4 };
    const brands = [
        { rating: 3, description: 'brand1' },
        { rating: 4, description: 'brand2' },
        { rating: 4.5, description: 'brand3' }
    ];

    return (
        <PopupTemplate>
            <div className="flex justify-between mb-4">
                <img src='' alt="earthbuddy logo" className="w-10 mb-1 m-4" />
                <div className='m-4 text-4xl font-bold' style={{ color: colourOf(mockCurrData.rating) }} >{mockCurrData.rating} / 5</div>
            </div>

            <h2 className="text-lg font-semibold text-[#8B959B] mb-2">How other brands' doing...</h2>

            <div className="flex space-x-10 mb-4 mt-4">
                {brands.map((brand, index) => (
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
                    {brands.map((brand, index) => (
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
        </PopupTemplate>
    )
}

export default Home