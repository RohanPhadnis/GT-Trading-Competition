import React, { useEffect, useState } from "react";
import PriceLevelWidget from "./PriceLevelWidgets";
import "./OrderBookWidgets.css";
import SampleOrderBookData from "../SampleData/SampleOrderBookDatas.json";
import orderBook from "../HelperClasses/OrderBook"; // Import the OrderBook singleton

const OrderBookWidget = ({ selectedStock }) => {
    // Find the matching data for the selected ticker
    const [stockData, setStockData] = useState(orderBook.orderBooks[selectedStock] || {});

    useEffect(() => {
        // Subscriber callback to update stock data
        const updateStockData = (orderBooks) => {
            setStockData(orderBooks[selectedStock] || {});
        };

        // Subscribe to OrderBook updates
        orderBook.subscribe(updateStockData);

        // Cleanup: Unsubscribe on unmount
        return () => {
            orderBook.unsubscribe(updateStockData);
        };
    }, [selectedStock]); // Re-run effect if selectedStock changes

    // Destructure Bids/Asks, default to empty arrays if undefined
    const { bidVolumes = {}, askVolumes = {} } = stockData || {};

    // Convert bids/asks from objects to arrays and sort them
    const sortedBids = Object.entries(bidVolumes).map(([price, quantity]) => ({
        P: parseFloat(price), // Price
        Q: quantity, // Quantity
    })).sort((a, b) => b.P - a.P); // Sort bids high-to-low

    const sortedAsks = Object.entries(askVolumes).map(([price, quantity]) => ({
        P: parseFloat(price), // Price
        Q: quantity, // Quantity
    })).sort((a, b) => a.P - b.P); // Sort asks low-to-highconst { Bids = [], Asks = [] } = stockData || {};



    return ( <
        div className = "order-book-widget" >
        <
        h4 > Order Book
        for { selectedStock } < /h4>

        { /* Column Headers: Price, Quantity, Orders */ } <
        div className = "column-headers" >
        <
        span className = "header price-header" > Price < /span> <
        span className = "header quantity-header" > Quantity < /span> <
        span className = "header orders-header" > Orders < /span> < /
        div >

        { /* Bids first (top of the list) */ } {
            sortedBids.map((bid, index) => ( <
                PriceLevelWidget key = { index }
                price = { bid.P }
                quantity = { bid.Q }
                orders = "-" // Filler for now
                /
                >
            ))
        }

        { /* Asks next (bottom of the list) */ } {
            sortedAsks.map((ask, index) => ( <
                PriceLevelWidget key = { index }
                price = { ask.P }
                quantity = { ask.Q }
                orders = "-" // Filler for now
                /
                >
            ))
        } <
        /div>
    );
};

export default OrderBookWidget;