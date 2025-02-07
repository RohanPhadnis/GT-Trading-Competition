import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import PlaceOrdersWidget from "../widgets/PlaceOrders.js";
import NewTradeTable from "../widgets/NewTradeTable.js";
import samplePnlData from "../SampleData/samplePnlData.json";
import OrderBookWidget from "../widgets/OrderBookWidgetss.js";
import ImageDisplayWidget from "../widgets/ImageDisplayWidget.js";
import AuctionWidget from "../widgets/AuctionWidget.js";
import EquitiesDashboard from "../widgets/EquityDashboard.js"
import ChartWidget from "../widgets/ChartWidget.js";

const NewDashboard = () => {
    const [selectedStock, setSelectedStock] = useState("AAPL");
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

                { /* LOGO WIDGET */ }
                <div className = "widget team-logo">
                    <ImageDisplayWidget/>
                </div> 

            </div>

            { /* COLUMN 2 */ }

            <div className = "column-2"> 

                { /* CURRENT POSITION WIDGET */ } 
                <div className = "widget position-info"> 
                <PlaceOrdersWidget selectedStock = { selectedStock }/> 
                </div>

                {/** Chart Widget */}
                <div className = "">
                    <ChartWidget/>
                </div>

                { /* TRADE TABLE */ }
                <div className = "widget trade-table" >
                    <NewTradeTable/>
                </div>

            </div>

            {/* COLUMN 3*/}
            <div className = "column-3">
                <div className="widget order-book">
                    <OrderBookWidget/>
                </div>
            </div>
        </div>
    );
};

export default NewDashboard;