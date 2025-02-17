import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { LimitOrdersWidget, OrderType, SelectedStockWidget } from "../widgets/PlaceOrders.js";
import MarketOrdersWidget from "../widgets/MarketOrderWidget.js";
import TradeTable from "../widgets/NewTradeTable.js";
import samplePnlData from "../SampleData/samplePnlData.json";
import OrderBookWidget from "../widgets/OrderBookWidgetss.js";
import ChartWidget from "../widgets/ChartWidget.js";
import AuctionWidget from "../widgets/AuctionWidget.js";
import EquitiesDashboard from "../widgets/EquityDashboard.js"
import {getBuildupData, getTickers, HTTPStatusCodes} from "../HelperClasses/api.js"; // Import getTickers()
import MessageViewer from "../widgets/MessageViewer"
import PnLWidget from "../widgets/PnLWidget.js";
import RealizedPnLWidget from "../widgets/realisedPnLWidget.js";
import Profile from "../widgets/Profile";
import {useNavigate} from "react-router-dom";
let initialized = false;

const NewDashboard = () => {
    const [selectedStock, setSelectedStock] = useState(getTickers()[0]);
    const [orders, setOrders] = useState([]);
    const [orderType, setOrderType] = useState("market"); // State to track selected order type

    const [initializedState, setInitializedState] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        console.log('hello');
        if (!initialized) {
            console.log('pedro');
            initialized = true;
            setInitializedState(() => true);
            const data = getBuildupData();
            if (data === null || data.status !== HTTPStatusCodes.OK) {
                console.log('guillermo');
                navigate("/");
            }
        }
    }, [initializedState]);

    useEffect(() => {
        const filteredOrders = samplePnlData.filter(
            (order) => typeof order.ticker === "string" && order.ticker === selectedStock
        );
        setOrders(filteredOrders);
    }, [selectedStock]);

    return (
        <div className="dashboard">
            {/* COLUMN 1 */}
            <div className="column-1">
                {/* PNL WIDGET */}
                <div className="widget pnl-Widget-wrapper">
                    <PnLWidget />
                </div>

                {/* REALISED PNL WIDGET */}
                <div className="widget pnl-Widget-wrapper">
                    <RealizedPnLWidget />
                </div>

                {/* LIST OF EQUITIES */}
                <div className="widget equities">
                    <EquitiesDashboard selectedStock={selectedStock} setSelectedStock={setSelectedStock} />
                </div>

                <div className="Profile-Features">
                    <div className="widget auctionWidget">
                        <AuctionWidget />
                    </div>

                    <div className="widget profileWidget">
                        <Profile/>
                    </div>
                </div>
                {/* AUCTION WIDGET */}

                <div className="widget messageViewer">
                    <MessageViewer/>
                </div>

            </div>

            {/* COLUMN 2 */}
            <div className="column-2">
                {/* CURRENT POSITION WIDGET */}
                <div className="widget position-info">
                    <div className="widget-container">
                        <div className="widget-item selected-stock">
                            <SelectedStockWidget selectedStock={selectedStock} />
                        </div>
                        <div className="widget-item order-type">
                            <OrderType orderType={orderType} setOrderType={setOrderType} />
                        </div>
                        <div className="widget-item place-orders">
                            {orderType === "limit" ? (
                                <LimitOrdersWidget selectedStock={selectedStock} />
                            ) : (
                                <MarketOrdersWidget selectedStock={selectedStock} />
                            )}
                        </div>
                    </div>
                </div>

                {/* Chart Widget */}
                <div className="widget chart">
                    <ChartWidget selectedStock={selectedStock}/>
                </div>

                {/* TRADE TABLE */}
                <div className="widget trade-table">
                    <TradeTable />
                </div>
            </div>

            {/* COLUMN 3 */}
            <div className="column-3">
                <div className="widget order-book">
                    <OrderBookWidget selectedStock={selectedStock} />
                </div>
            </div>
        </div>
    );
};

export default NewDashboard;
