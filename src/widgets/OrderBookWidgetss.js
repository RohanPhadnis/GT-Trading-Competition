import React, { useEffect, useState, useCallback, useRef } from "react";
import PriceLevelWidget from "./PriceLevelWidgets";
import "./OrderBookWidgets.css";
import orderBookInstance from "../HelperClasses/OrderBook"; // Import the OrderBook singleton

const OrderBookWidget = ({ selectedStock }) => {
    const [stockData, setStockData] = useState({ bidVolumes: {}, askVolumes: {} });
    const [hasOrderBook, setHasOrderBook] = useState(false);

    // Debugging: Log when the component renders or updates
    console.log(`🔄 Component rendered for selectedStock: ${selectedStock}`);

    const updateStockData = useCallback(
        (orderBooks) => {
            // Debugging: Log the data being received
            console.log("📈 updateStockData called with:", orderBooks);

            if (orderBooks[selectedStock]) {
                console.log(`✅ Found data for selectedStock: ${selectedStock}`);
                console.log("🔹 Updated bidVolumes:", orderBooks[selectedStock].bidVolumes);
                console.log("🔹 Updated askVolumes:", orderBooks[selectedStock].askVolumes);

                setStockData({
                    bidVolumes: { ...orderBooks[selectedStock].bidVolumes },
                    askVolumes: { ...orderBooks[selectedStock].askVolumes },
                });
                setHasOrderBook(true);
            } else {
                console.log(`⚠️ No data found for selectedStock: ${selectedStock}`);
                setStockData({ bidVolumes: {}, askVolumes: {} });
                setHasOrderBook(false);
            }
        },
        [selectedStock]
    );

    useEffect(() => {
        // Subscribe to order book updates
        console.log(`🟢 Subscribing to updates for selectedStock: ${selectedStock}`);
        orderBookInstance.subscribe(updateStockData);

        // Initialize with current data
        if (orderBookInstance.orderBooks[selectedStock]) {
            console.log(`📊 Initial data found for selectedStock: ${selectedStock}`);
            console.log("🔹 Initial bidVolumes:", orderBookInstance.orderBooks[selectedStock].bidVolumes);
            console.log("🔹 Initial askVolumes:", orderBookInstance.orderBooks[selectedStock].askVolumes);

            setStockData({
                bidVolumes: { ...orderBookInstance.orderBooks[selectedStock].bidVolumes },
                askVolumes: { ...orderBookInstance.orderBooks[selectedStock].askVolumes },
            });
            setHasOrderBook(true);
        } else {
            console.log(`⚠️ No initial data for selectedStock: ${selectedStock}`);
            setStockData({ bidVolumes: {}, askVolumes: {} });
            setHasOrderBook(false);
        }

        // Cleanup: Unsubscribe on unmount or stock change
        return () => {
            console.log(`🔴 Unsubscribing OrderBookWidget for ${selectedStock}`);
            orderBookInstance.unsubscribe(updateStockData); // Avoid memory leaks
        };
    }, [selectedStock, updateStockData]);

    useEffect(() => {
        // Periodically log the current stock data for debugging
        const logInterval = setInterval(() => {
            console.log(`📊 Periodic log for selectedStock: ${selectedStock}`);
            console.log("🔹 Current bidVolumes:", stockData.bidVolumes);
            console.log("🔹 Current askVolumes:", stockData.askVolumes);
        }, 5000);

        return () => clearInterval(logInterval);
    }, [selectedStock, stockData]);

    const { bidVolumes = {}, askVolumes = {} } = stockData;

    const sortedBids = Object.entries(bidVolumes)
        .map(([price, quantity]) => ({ P: parseFloat(price), Q: quantity }))
        .sort((a, b) => b.P - a.P); // Sorted from highest to lowest

    const sortedAsks = Object.entries(askVolumes)
        .map(([price, quantity]) => ({ P: parseFloat(price), Q: quantity }))
        .sort((a, b) => b.P - a.P); // Sorted from highest to lowest

    const [autoCenter, setAutoCenter] = useState(true);

    const asksRef = useRef(null);

    useEffect(() => {
        if (asksRef.current && autoCenter) {
            asksRef.current.scrollTop = asksRef.current.scrollHeight - asksRef.current.clientHeight;
        }
    }, [sortedAsks, autoCenter]);

    const bidsRef = useRef(null);

    useEffect(() => {
        if (bidsRef.current && autoCenter) {
            bidsRef.current.scrollTop = 0;
        }
    }, [sortedBids, autoCenter]);

    useEffect(() => {
        const handleBidsScroll = () => {
            if (bidsRef.current && bidsRef.current.scrollTop != 0) {
                setAutoCenter(prev => prev ? !prev : prev);
            }
        };

        const handleAsksScroll = () => {
            if (asksRef.current && asksRef.current.scrollTop != asksRef.current.scrollHeight - asksRef.current.clientHeight) {
                setAutoCenter(prev => prev ? !prev : prev);
            }
        };
    
        const bidsDivElement = bidsRef.current;
        if (bidsDivElement) {
            bidsDivElement.addEventListener("scroll", handleBidsScroll);
        }

        const asksDivElement = asksRef.current;
        if (asksDivElement) {
            asksDivElement.addEventListener("scroll", handleAsksScroll);
        }
    
        return () => {
            if (bidsDivElement) {
                bidsDivElement.removeEventListener("scroll", handleBidsScroll);
            }

            if (asksDivElement) {
                asksDivElement.removeEventListener("scroll", handleAsksScroll);
            }
        };
    }, [asksRef.current, bidsRef.current, autoCenter]);

    const handleReCenter = () => {
        setAutoCenter(prev => prev ? prev : !prev);
    };
    

    return (
        <div className="order-book-widget">
            <h4>Order Book for {selectedStock}</h4>
            {!hasOrderBook || (sortedBids.length === 0 && sortedAsks.length === 0) ? (
                <p className="empty-order-book">Empty Order Book</p>
            ) : (
                <>
                    <div className="column-headers">
                        <span className="header price-header"> Price </span>
                        <span className="header quantity-header"> Quantity </span>
                        <span className="header orders-header"> Amount </span>
                    </div>
                    <div ref={asksRef} className="order-book-scrollable">
                        {/* Asks */}
                        {sortedAsks.length > 0 ? (
                            sortedAsks.map((ask, index) => (
                                <PriceLevelWidget
                                    key={`ask-${index}`}
                                    price={ask.P}
                                    quantity={ask.Q}
                                    amount={ask.P * ask.Q}
                                    className="ask-row"
                                />
                            ))
                        ) : (
                            <p className="empty-section">No asks available</p>
                        )}
                    </div>

                    <div className="center-button">
                        <p className="spread">
                            Spread: {sortedAsks.length > 0 && sortedBids.length > 0 ? 
                                `${sortedAsks[sortedAsks.length - 1].P - sortedBids[0].P} (${100 * (sortedAsks[sortedAsks.length - 1].P - sortedBids[0].P) / ((sortedAsks[sortedAsks.length - 1].P + sortedBids[0].P) / 2)}%)` : `N/A`}
                        </p>
                        <button 
                            onClick={handleReCenter}
                                style={{
                                backgroundColor: autoCenter ? "grey" : "red",
                                color: "white",
                                padding: "5px 10px",
                                border: "none",
                                cursor: "pointer",
                            }}
                        >
                            Re-Center
                        </button>
                    </div>

                    <div ref={bidsRef} className="order-book-scrollable">
                        {/* Bids */}
                        {sortedBids.length > 0 ? (
                            sortedBids.map((bid, index) => (
                                <PriceLevelWidget
                                    key={`bid-${index}`}
                                    price={bid.P}
                                    quantity={bid.Q}
                                    amount={bid.Q * bid.P}
                                    className="bid-row"
                                />
                            ))
                        ) : (
                            <p className="empty-section">No bids available</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default OrderBookWidget;

