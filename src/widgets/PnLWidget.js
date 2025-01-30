import React, { useState } from 'react'
import "./PnLWidget.css";
import samplePnLData from "../SampleData/samplePnlData.json";
import sampleStockWidgetData from "../SampleData/sampleStockWidgetData.json";
import DataFinder from "../HelperClasses/DataFinder";

const PnLWidget = () => {


    const calculatePnL = () => { // Function to calculate PnL for each trade
        // Iterate over user trades
        const pnlResults = DataFinder.getPositionData("12345").map(trade => {
            // Find the matching market price for the trade's ticker compare those to
            const marketData = DataFinder.getStockInfo(trade.ticker);

            if (!marketData) {
                console.warn(`Market data not found for ticker: ${trade.ticker}`);
                return {...trade, pnl: 0 }; // No market data, no PnL
            }

            const marketPrice = marketData.price; // Current market price
            let pnl = 0;

            // Calculate PnL based on whether the trade is a buy or sell
            if (trade.is_buy) { // checks if trqde is a buy , the pnl is calculated by subracting trade price from market price
                pnl = (marketPrice - trade.price) * trade.quantity;
            } else if (trade.is_sell) { // checks if trade is a sell, the pnl is calculated by subracting market price from trade price
                pnl = (trade.price - marketPrice) * trade.quantity;
            }


            // Return trade details with calculated PnL and if loss or buy
            return {...trade, pnl: pnl.toFixed(2), result: (pnl > 0 ? "Profit" : "Loss") };
        });

        return pnlResults;
    };
    // Calculate all PnL results
    const pnlData = calculatePnL();
    const totalPnl = pnlData.reduce((total, trade) => total + parseFloat(trade.pnl), 0);
    return ( <
        div className = "pnl-widget" > { /* Display Total PnL */ } <
        div className = "total-pnl" >
        <
        strong > Total Realized PnL: < /strong> <
        br > < /br> <
        span className = { totalPnl >= 0 ? "positive" : "negative" } >
        $ { totalPnl.toFixed(2) } <
        /span> <
        /div>

        { /* PnL Table */ } <
        /div>
    );


};

export default PnLWidget;