import React from "react";
import "./LogoWidget.css"; 

const LogoWidget = () => {
    return (
        <div>
            <img 
                src={src} 
                alt={alt} 
                width={width} 
                height={height} 
            />
        </div>
    );
}