import React, { useEffect, useState } from "react";
import "./TradeTable.css";
import userPortfolio from "../HelperClasses/UserPortfolio";

const NewTradeTable = () => {
    const [positions, setPositions] = useState({});

    useEffect(() => {
        // Subscribe to updates from userPortfolio
        const handlePortfolioUpdate = (portfolioData) => {
            //console.log("📊 Updated Portfolio Data:", portfolioData);
            setPositions(portfolioData.positions || {});
        };

        userPortfolio.subscribe(handlePortfolioUpdate);

        // Initialize with the current portfolio state
        setPositions(userPortfolio.getPortfolio().positions || {});

        return () => {
            userPortfolio.unsubscribe(handlePortfolioUpdate);
        };
    }, []);

    return ( <
        div className = "pnl-dashboard" >
        <
        div className = "pnl-table-container" >
        <
        table className = "pnl-table" > { /* Table Header */ } <
        thead >
        <
        tr className = "header" >
        <
        th colSpan = { 3 }
        className = "header-section" >
        Current Positions <
        /th> < /
        tr > <
        tr >
        <
        th > Ticker < /th> <
        th > Quantity Owned < /th> < /
        tr > <
        /thead>

        { /* Table Body */ } <
        tbody > {
            Object.entries(positions).length > 0 ? (
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
                } > No positions available < /td> < /
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