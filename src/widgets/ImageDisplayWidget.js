import React from "react";
import "./ImageDisplayWidget.css";

const ImageDisplayWidget = () => {
  return (
    <div className="image-widget">
      <img
        src="https://static.wikia.nocookie.net/collegefootballmania/images/1/11/Georgia-Tech-Yellow-Jackets-Logo.png/revision/latest/scale-to-width-down/2000?cb=20210531114615"
        alt="Georgia Tech Yellow Jackets Logo"
        className="team-logo"
      />
    </div>
  );
};

export default ImageDisplayWidget;