import React, { useEffect, useState, useCallback } from "react";
import PriceLevelWidget from "./PriceLevelWidgets";
import "./OrderBookWidgets.css";
import orderBookInstance from "../HelperClasses/OrderBook"; // Import the OrderBook singleton

const OrderBookWidget = ({ selectedStock }) => {
        // Initialize state for order book data
        const [stockData, setStockData] = useState({ bidVolumes: {}, askVolumes: {} });
        const [hasOrderBook, setHasOrderBook] = useState(false);

        // Memoized function to update stock data
        const updateStockData = useCallback((orderBooks) => {
            //console.log("📈 OrderBookWidget RECEIVED UPDATE!", orderBooks);
            if (orderBooks[selectedStock]) {
                setStockData({
                    bidVolumes: {...orderBooks[selectedStock].bidVolumes },
                    askVolumes: {...orderBooks[selectedStock].askVolumes },
                });
                setHasOrderBook(true);
            } else {
                setStockData({ bidVolumes: {}, askVolumes: {} });
                setHasOrderBook(false);
            }
        }, [selectedStock]);

        useEffect(() => {
            // Subscribe to order book updates
            orderBookInstance.subscribe(updateStockData);

            // Initialize with current data
            if (orderBookInstance.orderBooks[selectedStock]) {
                setStockData({
                    bidVolumes: {...orderBookInstance.orderBooks[selectedStock].bidVolumes },
                    askVolumes: {...orderBookInstance.orderBooks[selectedStock].askVolumes },
                });
                setHasOrderBook(true);
            } else {
                setStockData({ bidVolumes: {}, askVolumes: {} });
                setHasOrderBook(false);
            }

            // Cleanup: Unsubscribe on unmount or stock change
            return () => {
                console.log(`🔴 Unsubscribing OrderBookWidget for ${selectedStock}`);
                orderBookInstance.unsubscribe(updateStockData);
            };
        }, [selectedStock, updateStockData]);

        // Periodic logging of the order book (every 5 seconds)
        useEffect(() => {
            const logInterval = setInterval(() => {
                console.log(`📊 Order Book for ${selectedStock}:`, stockData);
            }, 5000);

            return () => clearInterval(logInterval); // Cleanup interval on unmount
        }, [selectedStock, stockData]);

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

            { /* If no order book is available, display "Empty Order Book" */ } {
                !hasOrderBook || (sortedBids.length === 0 && sortedAsks.length === 0) ? ( <
                    p className = "empty-order-book" > Empty Order Book < /p>
                ) : ( <
                    >
                    { /* Column Headers */ } <
                    div className = "column-headers" >
                    <
                    span className = "header price-header" > Price < /span> <
                    span className = "header quantity-header" > Quantity < /span> <
                    span className = "header orders-header" > Orders < /span> < /
                    div >

                    { /* Bids Section */ } <
                    h5 className = "bids-label" > Bids < /h5> {
                    sortedBids.length > 0 ? (
                        sortedBids.map((bid, index) => ( <
                            PriceLevelWidget key = { `bid-${index}` }
                            price = { bid.P }
                            quantity = { bid.Q }
                            orders = "-" / >
                        ))
                    ) : ( <
                        p className = "empty-section" > No bids available < /p>
                    )
                }

                { /* Asks Section */ } <
                h5 className = "asks-label" > Asks < /h5> {
                sortedAsks.length > 0 ? (
                    sortedAsks.map((ask, index) => ( <
                        PriceLevelWidget key = { `ask-${index}` }
                        price = { ask.P }
                        quantity = { ask.Q }
                        orders = "-" / >
                    ))
                ) : ( <
                    p className = "empty-section" > No asks available < /p>
                )
            } <
            />
        )
    } <
    /div>
);
};

export default OrderBookWidget;