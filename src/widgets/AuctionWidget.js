import React, { useState } from "react";
import DataFinder from "../HelperClasses/DataFinder";
import './AuctionWidget.css';

const calculatePnL = () => { // Function to calculate PnL for each trade
    // Iterate over user trades
    const pnlResults = DataFinder.getPositionData("12345").map(trade => {
      // Find the matching market price for the trade's ticker
      const marketData = DataFinder.getStockInfo(trade.ticker);

      if (!marketData) {
        console.warn(`Market data not found for ticker: ${trade.ticker}`);
        return { ...trade, pnl: 0 }; // No market data, no PnL
      }

      const marketPrice = marketData.price; // Current market price
      let pnl = 0;

      // Calculate PnL based on whether the trade is a buy or sell
      if (trade.is_buy) { // For buy trades
        pnl = (marketPrice - trade.price) * trade.quantity;
      } else if (trade.is_sell) { // For sell trades
        pnl = (trade.price - marketPrice) * trade.quantity;
      }

      // Return trade details with calculated PnL and profit/loss status
      return { ...trade, pnl: pnl.toFixed(2), result: (pnl > 0 ? "Profit" : "Loss") };
    });

    return pnlResults;
};

const pnlData = calculatePnL(); // gets row of pnls
const realizedPnL = pnlData.reduce((total, trade) => total + parseFloat(trade.pnl), 0); // forms into one num

const AuctionWidget = () => {
    const [inputValue, setInputValue] = useState(""); // blank base for inputs
    const [isButtonDisabled, setIsButtonDisabled] = useState(true); // button disabled by default

    const handleInputChange = (e) => {
        const value = parseFloat(e.target.value);
        setInputValue(e.target.value);
        if (!isNaN(value) && value >= 1 && value <= realizedPnL) { // if button is not null, greater than one and less than or equal to total pnl
            setIsButtonDisabled(false);
        } else {
            setIsButtonDisabled(true);
        }
    };

    const handleSubmit = () => {
        alert(`Submitted value: ${inputValue}`);
        // Add your submission logic here
        console.log(`Auctioned value: ${inputValue}`);
    };

    return (
        <div className="auction-widget">
            <div className="auction-widget-header">Auction</div>
            <div className="auction-widget-content">
                <input
                    type="number"
                    min="1"
                    placeholder="Realized PnL Risked"
                    value={inputValue}
                    onChange={handleInputChange}
                />
                <button
                    className="auction-widget-button"
                    onClick={handleSubmit}
                    disabled={isButtonDisabled}
                >
                    Submit
                </button>
            </div>
        </div>
    );
    
};

export default AuctionWidget;