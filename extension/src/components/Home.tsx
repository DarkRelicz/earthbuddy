import React, { useState, useEffect } from 'react';
import PopupTemplate from './template/PopupTemplate';
import Button from './atoms/Button';
import { scanURL } from '../services/phish'; 

type ScanStatus = 'idle' | 'scanning' | 'completed' | 'error' ;

const Home: React.FC = () => {
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [scanStatus, setScanStatus] = useState<ScanStatus>('idle');
  const [scanResult, setScanResult] = useState<any>(null);

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

  const handleUrlScan = async () => {
    setScanStatus('scanning');

    try {
      const result = await scanURL(currentUrl);
      setScanResult(result);
      setScanStatus('completed');
    } catch (err) {
      setScanStatus('error');
      console.error(err);
    }
  };

  const resetScanner = () => {
    setScanStatus('idle');
    setScanResult(null);
  };

  return (
    <PopupTemplate>
      <img src='' alt="Phishtank logo" className="w-10 mb-1"/>
      <h2 className="text-lg font-semibold text-[#12364A] mb-6">Scan URL</h2>

      {scanStatus === 'idle' && (
        <div className="flex-1 flex flex-col justify-center">
          <div className="bg-gray-100 p-3 rounded-lg mb-6">
            <p className="text-sm font-medium mb-1">Current URL:</p>
            <p className="text-xs break-all">{currentUrl || 'Loading URL...'}</p>
          </div>
          <Button onClickCallback={handleUrlScan} disabled={!currentUrl} title='Scan' />
        </div>
      )}

      {scanStatus === 'scanning' && (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4F7BFF] mb-4 font-sans"></div>
          <p>Scanning URL...</p>
          <p className="text-sm text-gray-500 mt-2">This may take 10-30 seconds</p>
        </div>
      )}

      {scanStatus === 'completed' && scanResult && (
        <div className="flex-1 flex flex-col">
          <div className={`p-4 rounded-lg mb-6 ${scanResult.verdicts.overall.malicious ?
              'bg-red-100 border border-red-400 text-red-700' :
              'bg-green-100 border border-green-400 text-green-700'
            }`}>
            <h2 className="font-bold text-xl mb-2">
              {scanResult.verdicts.overall.malicious ? 'MALICIOUS DETECTED' : 'SAFE TO PROCEED'}
            </h2>
            <div className="space-y-2">
              <p>Score: {scanResult.verdicts.overall.score}/100</p>
              {scanResult.verdicts.overall.malicious && (
                <p>Threats: {scanResult.verdicts.overall.tags.join(', ')}</p>
              )}
              <a
                href={`https://urlscan.io/result/${scanResult.task.uuid}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline text-sm"
              >
                View full report on <a className='font-semibold'>urlscan.io</a>
              </a>
            </div>
          </div>

          <div className="mt-auto space-y-3">
            <Button onClickCallback={resetScanner} title='Scan another URL' />
            {scanResult.verdicts.overall.malicious && (
              <Button 
                onClickCallback={() => chrome.tabs.update({ url: 'about:blank' })}
                title='Close this tab'
              />
            )}
          </div>
        </div>
      )}

      {scanStatus === 'error' && (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 p-4 rounded-lg mb-6">
            <p>Scan failed. Please try again later.</p>
          </div>
          <button
            onClick={resetScanner}
            className="w-full py-2 bg-[#4F7BFF] text-white rounded-lg"
          >
            Retry Scan
          </button>
        </div>
      )}
    </PopupTemplate>
  );
};

export default Home;