import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import StockWidget from "../widgets/StockWidget.js";
import AuthenticationInput from "../widgets/AuthenticationInput.js";
import EquitiesDashboard from "../widgets/EquityDashboard.js";
import ChartWidget from "../widgets/ChartWidget.js";
import PlaceOrdersWidget from "../widgets/PlaceOrders.js";
import Contestdash from "../widgets/Contestdash.js";
import TradeTable from "../widgets/TradeTable.js";
import RecentOrdersWidget from "../widgets/RecentOrdersWidget.js";
import samplePnlData from "../SampleData/samplePnlData.json";
import BuyButton from "../widgets/BuySellWidget.js";
import OrderBookWidget from "../widgets/OrderBookWidgetss.js";
import ImageDisplayWidget from "../widgets/ImageDisplayWidget.js";
import PnLDashBoard from "../widgets/PnLWidget.js";
import AuctionWidget from "../widgets/AuctionWidget.js";
import { getTickers } from "../HelperClasses/api.js"; // Import getTickers()
import ErrorBoundary from "./ErrorBoundary"

const Dashboard = () => {
    const [selectedStock, setSelectedStock] = useState("AAPL");
    const [text, setText] = useState(""); // Store input value
    const [tickers, setTickers] = useState([]);
    const [message, setMessage] = useState(""); // Store message to display
    const predefinedNumber = "12345"; // The number to match with
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [orders, setOrders] = useState([]);
    useEffect(() => {
        let interval;
        const fetchTickers = async() => {
            try {
                const fetchedTickers = await getTickers();
                console.log("Raw fetched tickers:", fetchedTickers);

                // Ensure tickers is always an array of strings
                if (!Array.isArray(fetchedTickers)) {
                    console.error("getTickers() did not return an array:", fetchedTickers);
                    setTickers([]); // Default to empty array
                    return;
                }

                // Filter out any non-string values
                const validTickers = fetchedTickers.filter(ticker => typeof ticker === "string");

                if (validTickers.length > 0) {
                    setTickers(validTickers);
                    clearInterval(interval); // Stop polling once valid data is received
                } else {
                    console.warn("No valid tickers found.");
                }
            } catch (error) {
                console.error("Error fetching tickers:", error);
                setTickers([]); // Default to empty array on error
            }
        };
        interval = setInterval(fetchTickers, 3000);
        return () => clearInterval(interval);
    }, []);
    const handleStockClick = (stock) => {
        setSelectedStock(stock);
    };
    // Filter orders for the selected stock
    useEffect(() => {
        const filteredOrders = samplePnlData.filter(
            (order) => typeof order.ticker === "string" && order.ticker === selectedStock
        );
        setOrders(filteredOrders);
    }, []);

    const handleInputSubmit = (data) => {
        setText(data);
        if (data === predefinedNumber) {
            setMessage("John Doe | GATech | #001");
        } else {
            setMessage("Sorry, that's not the correct number.");
        }
        setIsSubmitted(true);
    };

    return ( <
        div className = "dashboard" >
        <
        div className = "column-1" > { /* USER AUTHENTICATION AND USER INFO */ } <
        div className = "widget user-info" >
        User Authentication {!isSubmitted && < AuthenticationInput / > } <
        p > { message } < /p> < /
        div >


        { /* AUCTION WIDGET */ } <
        div className = "widget auctionWidget" >
        <
        AuctionWidget / >
        <
        /div>  { / * LOGO WIDGET * / } <
        div className = "widget team-logo" >
        <
        ImageDisplayWidget / >
        <
        /div> </div >

        <
        div className = "column-2" > { /* CURRENT POSITION WIDGET */ } <
        div className = "widget position-info" >
        <
        PlaceOrdersWidget selectedStock = { selectedStock }
        /> < /
        div >

        { /* CANDLESTICK CHART OF SELECTED STOCK */ } <
        div className = "widget chart" >
        <
        ChartWidget selectedStock = { selectedStock }
        /> < /
        div > { /* TRADE TABLE */ } <
        div className = "widget trade-table" >
        <
        TradeTable / >
        <
        /div> < /
        div >

        <
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

export default Dashboard;