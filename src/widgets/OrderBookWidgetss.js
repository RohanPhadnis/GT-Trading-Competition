import React, { useEffect, useState, useCallback } from "react";
import PriceLevelWidget from "./PriceLevelWidgets";
import "./OrderBookWidgets.css";
import orderBookInstance from "../HelperClasses/OrderBook"; // Import the OrderBook singleton

const OrderBookWidget = ({ selectedStock }) => {
    // Initialize state for order book data
    const [stockData, setStockData] = useState({ bidVolumes: {}, askVolumes: {} });

    // Memoize the update function to prevent unnecessary re-renders
    const updateStockData = useCallback((orderBooks) => {
        console.log("OrderBookWidget RECEIVED UPDATE!", orderBooks);
        console.log(selectedStock);
        setStockData({
            bidVolumes: {...orderBookInstance.orderBooks[selectedStock].bidVolumes },
            askVolumes: {...orderBookInstance.orderBooks[selectedStock].askVolumes },
        });
    }, [selectedStock]);

    useEffect(() => {
        // Subscribe to order book updates
        orderBookInstance.subscribe(updateStockData);

        // Initialize with current data
        if (orderBookInstance[selectedStock]) {
            setStockData(orderBookInstance[selectedStock]);
        }

        // Cleanup: Unsubscribe on unmount
        return () => {
            orderBookInstance.unsubscribe(updateStockData);
        };
    }, [selectedStock, updateStockData]); // Rerun when selectedStock changes

    // Destructure bids and asks with fallbacks
    const { bidVolumes = {}, askVolumes = {} } = stockData;

    // Convert bids and asks from objects to arrays and sort
    const sortedBids = Object.entries(bidVolumes)
        .map(([price, quantity]) => ({ P: parseFloat(price), Q: quantity }))
        .sort((a, b) => b.P - a.P); // Sort bids high-to-low

    const sortedAsks = Object.entries(askVolumes)
        .map(([price, quantity]) => ({ P: parseFloat(price), Q: quantity }))
        .sort((a, b) => a.P - b.P); // Sort asks low-to-high

    return ( <
        div className = "order-book-widget" >
        <
        h4 > Order Book
        for { selectedStock } < /h4>

        { /* Column Headers */ } <
        div className = "column-headers" >
        <
        span className = "header price-header" > Price < /span> <
        span className = "header quantity-header" > Quantity < /span> <
        span className = "header orders-header" > Orders < /span> < /
        div >

        { /* Render Bids */ } {
            sortedBids.map((bid, index) => ( <
                PriceLevelWidget key = { `bid-${index}` }
                price = { bid.P }
                quantity = { bid.Q }
                orders = "-" / >
            ))
        }

        { /* Render Asks */ } {
            sortedAsks.map((ask, index) => ( <
                PriceLevelWidget key = { `ask-${index}` }
                price = { ask.P }
                quantity = { ask.Q }
                orders = "-" / >
            ))
        } <
        /div>
    );
};

export default OrderBookWidget;