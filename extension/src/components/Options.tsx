import React, { useEffect, useState } from 'react';
import PopupTemplate from './template/PopupTemplate';
import Button from './atoms/Button';

interface OptionsProps {
  onScanUrlClick?: () => void;
  onUploadFilesClick?: () => void;
}


const Options: React.FC<OptionsProps> = ({
  onScanUrlClick,
  onUploadFilesClick
}) => {

  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    async function fetchEmail() {
      try {
        const sessData = await chrome.storage.session.get('email');
        setUserEmail(sessData.email ?? null);
        console.log("user email var: " + sessData.email);
      } catch (err) {
        console.log("accessed as guest user");
      }
    }

    fetchEmail();
  }, []);

  return (
    <PopupTemplate>
      <img src="img/logo.png" alt="Phishtank Logo" className="w-10 m-1" />
      <h2 className="text-lg font-semibold text-[#12364A] mb-6">phishtank</h2>

      <div className="w-full space-y-4 mb-8">
        <Button onClickCallback={onScanUrlClick} title='Scan URL' />
        <Button onClickCallback={onUploadFilesClick} title='Upload Files' />
      </div>

    </PopupTemplate>
  );
};

export default Options;