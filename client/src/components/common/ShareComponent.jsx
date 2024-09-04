import React from 'react';
import {
    FacebookShareButton,
    TwitterShareButton,
    WhatsappShareButton,
    FacebookIcon,
    TwitterIcon,
    WhatsappIcon
  } from 'react-share';

const ShareComponent = ({ question }) => {
  const textToShare = `Votes on poll\n${question}\nhttps://discoveryindianews.com/#pollsvote\n\nVisit the latest news:\n`;
  const urlToShare = "https://discoveryindianews.com/";

  return (
    <div>
      <div className="flex gap-3 justify-end">
        <FacebookShareButton url={urlToShare} quote={textToShare}>
          <FacebookIcon className="transition-transform transform hover:scale-110" size={32} round={true} />
        </FacebookShareButton>

        <TwitterShareButton url={urlToShare} title={textToShare}>
          <TwitterIcon className="transition-transform transform hover:scale-110" size={32} round={true} />
        </TwitterShareButton>

        <WhatsappShareButton url={urlToShare} title={textToShare}>
          <WhatsappIcon className="transition-transform transform hover:scale-110" size={32} round={true} />
        </WhatsappShareButton>
      </div>
    </div>
  );
};

export default ShareComponent;
