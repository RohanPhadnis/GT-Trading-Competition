import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import ChartWidget from "../widgets/ChartWidget.js";
import CurrentPositionWidget from "../widgets/PlaceOrders.js";
import Contestdash from "../widgets/Contestdash.js";
import TradeTable from "../widgets/TradeTable.js";
import RecentOrdersWidget from "../widgets/RecentOrdersWidget.js";
import samplePnlData from "../SampleData/samplePnlData.json";
import BuyButton from "../widgets/BuySellWidget.js";
import OrderBookWidget from "../widgets/OrderBookWidgetss.js";
import ImageDisplayWidget from "../widgets/ImageDisplayWidget.js";
import PnLDashBoard from "../widgets/PnLWidget.js";
import AuctionWidget from "../widgets/AuctionWidget.js";
import EquitiesDashboard from "../widgets/EquityDashboard.js"
const NewDashboard = () => {
    const [selectedStock, setSelectedStock] = useState("AAPL");
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const filteredOrders = samplePnlData.filter(
            (order) => typeof order.ticker === "string" && order.ticker === selectedStock
        );
        setOrders(filteredOrders);
    }, [selectedStock]);

    return ( <
        div className = "dashboard" > { /* COLUMN 1 */ } <
        div className = "column-1" > { /* AUCTION WIDGET */ } <
        div className = "Equities Dashboard" > < EquitiesDashboard selectedStock = { selectedStock }
        setSelectedStock = { setSelectedStock }
        />< /div >

        <
        div className = "widget auctionWidget" >
        <
        AuctionWidget / >
        <
        /div>

        { /* LOGO WIDGET */ } <
        div className = "widget team-logo" >
        <
        ImageDisplayWidget / >
        <
        /div> < /
        div >

        { /* COLUMN 2 */ } <
        div className = "column-2" > { /* CURRENT POSITION WIDGET */ } <
        div className = "widget position-info" >
        <
        CurrentPositionWidget selectedStock = { selectedStock }
        /> < /
        div >

        { /* CANDLESTICK CHART OF SELECTED STOCK */ } <
        div className = "widget chart" >
        <
        ChartWidget selectedStock = { selectedStock }
        /> < /
        div >

        { /* TRADE TABLE */ } <
        div className = "widget trade-table" >
        <
        TradeTable / >
        <
        /div> < /
        div >

        { /* COLUMN 3 */ } <
        div className = "column-3" > { /* ORDER BOOK WIDGET */ } <
        div className = "widget order-book" >
        <
        OrderBookWidget selectedStock = { selectedStock }
        orders = { orders }
        /> < /
        div > <
        /div>

        { /* RECENT ORDERS WIDGET (COMMENTED OUT, UNCOMMENT IF NEEDED) */ } {
            /* 
                            <div className="widget recent-orders">
                                Open Orders
                                <RecentOrdersWidget orders={orders} />
                            </div>
                        */
        }

        { /* CONTEST DASHBOARD (COMMENTED OUT, UNCOMMENT IF NEEDED) */ } {
            /* 
                            <div className="widget contest-info">
                                Contest Information
                                <Contestdash />
                            </div>
                        */
        } <
        /div>
    );
};

export default NewDashboard;