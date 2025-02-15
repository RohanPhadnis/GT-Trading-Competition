import React, { useState } from 'react';
import { marketOrderHandler, limitOrderHandler } from '../HelperClasses/api';
import "./PlaceOrders.css";

export const LimitOrdersWidget = ({ selectedStock }) => {
    const [price, setPrice] = useState("");
    const [amount, setAmount] = useState(10);
    const [subscribeVar, setSubscribeVar] = useState(0);

    const handleBuy = () => {
        if (!selectedStock) {
            console.error("❌ No stock selected for buying.");
            return;
        }

        limitOrderHandler(
            { ticker: selectedStock, volume: amount, isBid: true, price: Number(price) },
            setSubscribeVar
        );

        console.log(`🟢 Buy order placed for ${amount} shares of ${selectedStock} at ${price || "market price"}.`);
    };

    const handleSell = () => {
        if (!selectedStock) {
            console.error("❌ No stock selected for selling.");
            return;
        }

        limitOrderHandler(
            { ticker: selectedStock, volume: amount, isBid: false, price: Number(price) },
            setSubscribeVar
        );

        console.log(`🔴 Sell order placed for ${amount} shares of ${selectedStock} at ${price || "market price"}.`);
    };

    return (
        <div className="widget-container">
            <div className="buy-sell-flex">

                <div className = "buy-sell-column-1">

                    <button className="buy-button" onClick={handleBuy}> Buy </button>
                    <button className="sell-button" onClick={handleSell}> Sell </button>

                </div>

                <div className="buy-sell-column-2">

                    <label htmlFor="volume"> Volume: </label>
                    <label htmlFor="price"> Price: </label>
                    
                </div>

                <div className = "buy-sell-column-3">

                    <div className="input-group">
                        <input
                            id="volume"
                            type="number"
                            className={`quantity-input ${amount === 0 || amount === "" ? "placeholder-visible" : ""}`}
                            value={amount === "" ? "" : amount}
                            onChange={(e) => {
                                const value = e.target.value;
                                setAmount(value === "" ? "" : Number(value));
                            }}
                            placeholder="Enter Quantity"
                        />
                    </div>

                    <div className="input-group">
                        
                        <input
                            id="price"
                            type="number"
                            className={`price-input ${!price && price !== 0 ? "placeholder-visible" : ""}`}
                            value={price}
                            onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
                            placeholder="For Limit Orders Only"
                        />

                    </div>

                </div>
            </div>
        </div>
    );
};

export const SelectedStockWidget = ({ selectedStock }) => {
    return (
        <div className='SelectedStockWidget'>
            <h3> Trade {selectedStock || "Stock"} </h3>
        </div>
    );
};

export const OrderType = ({ orderType, setOrderType }) => {
    return (
        <div className="OrderType">
            <span className="choose-title">Choose</span>
            <button
                className={`market-button ${orderType === "market" ? "selected" : ""}`}
                onClick={() => setOrderType("market")}
            >
                Market
            </button>
            <button
                className={`limit-button ${orderType === "limit" ? "selected" : ""}`}
                onClick={() => setOrderType("limit")}
            >
                Limit
            </button>
        </div>
    );
};


