import React, { useEffect, useState } from "react";
import "./TradeTable.css";
import userPortfolio from "../HelperClasses/UserPortfolio";
import { removeHandler } from "../HelperClasses/api.js"
const NewTradeTable = () => {
    const [balance, setBalance] = useState(0);
    const [positions, setPositions] = useState({});
    const [openOrders, setOpenOrders] = useState([]);
    const [pnl, setPnl] = useState(0);
    useEffect(() => {
        // Subscribe to updates from userPortfolio
        const handlePortfolioUpdate = (portfolioData) => {
            setBalance(portfolioData.balance || 0);
            setPositions(portfolioData.positions || {});
            setOpenOrders(portfolioData.Orders || []);
            setPnl(portfolioData.pnl || 0);
        };

        userPortfolio.subscribe(handlePortfolioUpdate);

        // Initialize with the current portfolio state
        const currentPortfolio = userPortfolio.getPortfolio();
        setBalance(currentPortfolio.balance || 0);
        setPositions(currentPortfolio.positions || {});
        setOpenOrders(currentPortfolio.Orders || []);

        return () => {
            userPortfolio.unsubscribe(handlePortfolioUpdate);
        };
    }, []);
    const handleRemoveOrder = (orderId) => {
        console.log(`Removing order with ID: ${orderId}`);
        removeHandler({ orderId: orderId }); // Call the removeHandler function from api.js

    };
    return ( <
        div className = "pnl-dashboard" > { /* PNL Display */ } <
        div className = "pnl-section" >
        <
        h2 > PNL: $ { pnl.toFixed(2) } < /h2> < /
        div >

        { /* Balance Display */ } <
        div className = "balance-section" >
        <
        h2 > Balance: $ { balance.toFixed(2) } < /h2> < /
        div >

        { /* Current Positions Table */ } <
        div className = "pnl-table-container" >
        <
        h3 > Current Positions < /h3> <
        table className = "pnl-table" >
        <
        thead >
        <
        tr >
        <
        th > Ticker < /th> <
        th > Quantity Owned < /th> < /
        tr > <
        /thead> <
        tbody > {
            Object.keys(positions).length > 0 ? (
                Object.entries(positions).map(([ticker, quantity], index) => ( <
                    tr key = { `position-${index}` } >
                    <
                    td > { ticker } < /td> <
                    td > { quantity } < /td> < /
                    tr >
                ))
            ) : ( <
                tr >
                <
                td colSpan = { 2 }
                style = {
                    { textAlign: "center" }
                } >
                No positions available <
                /td> < /
                tr >
            )
        } <
        /tbody> < /
        table > <
        /div>

        { /* Open Orders Table */ } <
        div className = "pnl-table-container" >
        <
        h3 > Open Orders < /h3> <
        table className = "pnl-table" >
        <
        thead >
        <
        tr >
        <
        th > Order ID < /th> <
        th > Ticker < /th> <
        th > Side < /th> <
        th > Price < /th> <
        th > Volume < /th> <
        th > Action < /th> < /
        tr > <
        /thead> <
        tbody > {
            openOrders.length > 0 ? (
                openOrders.map((order, index) => ( <
                    tr key = { `order-${index}` } >
                    <
                    td > { order.orderId } < /td> <
                    td > { order.ticker } < /td> <
                    td > { order.side } < /td> <
                    td > { order.price } < /td> <
                    td > { order.volume } < /td> <
                    td >
                    <
                    button className = "remove-order-btn"
                    onClick = {
                        () => handleRemoveOrder(order.orderId)
                    } >
                    Remove <
                    /button> < /
                    td > <
                    /tr>
                ))
            ) : ( <
                tr >
                <
                td colSpan = { 6 }
                style = {
                    { textAlign: "center" }
                } >
                No open orders <
                /td> < /
                tr >
            )
        } <
        /tbody> < /
        table > <
        /div> < /
        div >
    );

};

export default NewTradeTable;