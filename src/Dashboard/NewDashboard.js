import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import PlaceOrdersWidget from "../widgets/PlaceOrders.js";
import NewTradeTable from "../widgets/NewTradeTable.js";
import samplePnlData from "../SampleData/samplePnlData.json";
import OrderBookWidget from "../widgets/OrderBookWidgetss.js";
import ImageDisplayWidget from "../widgets/ImageDisplayWidget.js";
import AuctionWidget from "../widgets/AuctionWidget.js";
import EquitiesDashboard from "../widgets/EquityDashboard.js"
import { getTickers } from "../HelperClasses/api.js";
import MessageViewer from "../widgets/MessageViewer"
const NewDashboard = () => {
    const [selectedStock, setSelectedStock] = useState(getTickers()[0]);

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const filteredOrders = samplePnlData.filter(
            (order) => typeof order.ticker === "string" && order.ticker === selectedStock
        );
        setOrders(filteredOrders);
    }, [selectedStock]);

    return (
        <div className = "dashboard"> 

            { /* COLUMN 1 */ }

            <div className = "column-1"> 

                { /* LIST OF EQUITIES */ }
                <div className = "Equities Dashboard" > <EquitiesDashboard selectedStock = { selectedStock }
                    setSelectedStock = { setSelectedStock }/>
                </div>

                { /* AUCTION WIDGET */ }
                <div className = "widget auctionWidget">
                    <AuctionWidget/>
                </div>

        { /* TRADE TABLE */ } <
        div className = "New Trade Table" >
        <
        NewTradeTable / >
            <MessageViewer />
        <
        /div> < /
        div >

            </div>

            { /* COLUMN 2 */ }

        { /* CONTEST DASHBOARD (COMMENTED OUT, UNCOMMENT IF NEEDED) */ } {
            /* 
                            <div className="widget contest-info">
                                Contest Information
                                <Contestdash />
                            </div>
                        */
        }
        <
        /div>
    );
};

export default NewDashboard;