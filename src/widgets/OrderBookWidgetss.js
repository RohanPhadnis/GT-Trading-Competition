import React, { useEffect, useState, useCallback } from "react";
import PriceLevelWidget from "./PriceLevelWidgets";
import "./OrderBookWidgets.css";
import orderBookInstance from "../HelperClasses/OrderBook"; // Import the OrderBook singleton

const OrderBookWidget = ({ selectedStock }) => {
    const [stockData, setStockData] = useState({ bidVolumes: {}, askVolumes: {} });
    const [hasOrderBook, setHasOrderBook] = useState(false);

    const updateStockData = useCallback((orderBooks) => {
        if (orderBooks[selectedStock]) {
            setStockData({
                bidVolumes: { ...orderBooks[selectedStock].bidVolumes },
                askVolumes: { ...orderBooks[selectedStock].askVolumes },
            });
            setHasOrderBook(true);
        } else {
            setStockData({ bidVolumes: {}, askVolumes: {} });
            setHasOrderBook(false);
        }
    }, [selectedStock]);

    useEffect(() => {
        orderBookInstance.subscribe(updateStockData);

        if (orderBookInstance.orderBooks[selectedStock]) {
            setStockData({
                bidVolumes: { ...orderBookInstance.orderBooks[selectedStock].bidVolumes },
                askVolumes: { ...orderBookInstance.orderBooks[selectedStock].askVolumes },
            });
            setHasOrderBook(true);
        } else {
            setStockData({ bidVolumes: {}, askVolumes: {} });
            setHasOrderBook(false);
        }

        return () => {
            console.log(`🔴 Unsubscribing OrderBookWidget for ${selectedStock}`);
            orderBookInstance.unsubscribe(updateStockData);
        };
    }, [selectedStock, updateStockData]);

    useEffect(() => {
        const logInterval = setInterval(() => {
            console.log(`📊 Order Book for ${selectedStock}:`, stockData);
        }, 5000);

        return () => clearInterval(logInterval);
    }, [selectedStock, stockData]);

    const { bidVolumes = {}, askVolumes = {} } = stockData;

    const sortedBids = Object.entries(bidVolumes)
        .map(([price, quantity]) => ({ P: parseFloat(price), Q: quantity }))
        .sort((a, b) => b.P - a.P);

    const sortedAsks = Object.entries(askVolumes)
        .map(([price, quantity]) => ({ P: parseFloat(price), Q: quantity }))
        .sort((a, b) => a.P - b.P);

    return (
        <div className="order-book-widget">
            <h4>Order Book for {selectedStock}</h4>
            {!hasOrderBook || (sortedBids.length === 0 && sortedAsks.length === 0) ? (
                <p className="empty-order-book">Empty Order Book</p>
            ) : (
                <>
                    <div className="column-headers">
                        <span className="header price-header">Price</span>
                        <span className="header quantity-header">Quantity</span>
                        <span className="header orders-header">Orders</span>
                    </div>
                    <div className="order-book-scrollable">
                        <h5 className="bids-label">Bids</h5>
                        {sortedBids.slice(0, 5).length > 0 ? (
                            sortedBids.slice(0, 5).map((bid, index) => (
                                <PriceLevelWidget
                                    key={`bid-${index}`}
                                    price={bid.P}
                                    quantity={bid.Q}
                                    orders="-"
                                />
                            ))
                        ) : (
                            <p className="empty-section">No bids available</p>
                        )}

                        <h5 className="asks-label">Asks</h5>
                        {sortedAsks.slice(0, 5).length > 0 ? (
                            sortedAsks.slice(0, 5).map((ask, index) => (
                                <PriceLevelWidget
                                    key={`ask-${index}`}
                                    price={ask.P}
                                    quantity={ask.Q}
                                    orders="-"
                                />
                            ))
                        ) : (
                            <p className="empty-section">No asks available</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default OrderBookWidget;
