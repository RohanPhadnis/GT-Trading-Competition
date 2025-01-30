import React, { useState } from 'react';
import { marketOrderHandler, limitOrderHandler } from '../HelperClasses/api';
import "./PlaceOrders.css";

const PlaceOrdersWidget = ({ selectedStock }) => {
    const [price, setPrice] = useState("");
    const [amount, setAmount] = useState(10);
    const [subscribeVar, setSubscribeVar] = useState(0);

    const handleBuy = () => {
        if (!selectedStock) {
            console.error("❌ No stock selected for buying.");
            return;
        }

        const isMarket = !price || Number(price) === 0;
        if (isMarket) {
            marketOrderHandler({
                    ticker: selectedStock,
                    volume: amount,
                    isBid: true,
                },
                setSubscribeVar
            );
        } else {
            limitOrderHandler({
                    ticker: selectedStock,
                    volume: amount,
                    isBid: true,
                    price: price,
                },
                setSubscribeVar
            );
        }

        console.log(`🟢 Buy order placed for ${amount} shares of ${selectedStock} at ${price || "market price"}.`);
    };

    const handleSell = () => {
        if (!selectedStock) {
            console.error("❌ No stock selected for selling.");
            return;
        }

        const isMarket = !price || Number(price) === 0;
        if (isMarket) {
            marketOrderHandler({
                    ticker: selectedStock,
                    volume: amount,
                    isBid: false,
                },
                setSubscribeVar
            );
        } else {
            limitOrderHandler({
                    ticker: selectedStock,
                    volume: amount,
                    isBid: false,
                    price: price,
                },
                setSubscribeVar
            );
        }

        console.log(`🔴 Sell order placed for ${amount} shares of ${selectedStock} at ${price || "market price"}.`);
    };

    return ( <
        div className = "widget-container" >
        <
        h3 > Trade { selectedStock || "Stock" } < /h3> <
        div className = "buy-sell-row" >
        <
        div className = "input-group" >
        <
        label htmlFor = "volume" > Volume: < /label> <
        input id = "volume"
        type = "number"
        className = { `quantity-input ${amount === 0 ? "placeholder-visible" : ""}` }
        value = { amount }
        onChange = {
            (e) => setAmount(Number(e.target.value))
        }
        placeholder = "Enter Quantity" /
        >
        <
        /div>

        <
        button className = "buy-button"
        onClick = { handleBuy } >
        Buy <
        /button> <
        button className = "sell-button"
        onClick = { handleSell } >
        Sell <
        /button>

        <
        div className = "input-group" >
        <
        label htmlFor = "price" > Price: < /label> <
        input id = "price"
        type = "number"
        className = { `price-input ${!price || Number(price) === 0 ? "placeholder-visible" : ""}` }
        value = { price }
        onChange = {
            (e) => setPrice(Number(e.target.value))
        }
        placeholder = "For Limit Orders Only" /
        >
        <
        /div> < /
        div > <
        /div>
    );
};

export default PlaceOrdersWidget;