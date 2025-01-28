import React from "react";
import PriceLevelWidget from "./PriceLevelWidgets";
import "./OrderBookWidgets.css";
import SampleOrderBookData from "../SampleData/SampleOrderBookDatas.json";
import DataFinder from "../HelperClasses/DataFinder";

const OrderBookWidget = ({ selectedStock }) => {
  // Find the matching data for the selected ticker
  const stockData = DataFinder.getStockOrders(selectedStock);

  // Destructure Bids/Asks, default to empty arrays if undefined
  const { Bids = [], Asks = [] } = stockData || {};

  // Sort bids high->low, asks low->high
  const sortedBids = [...Bids].sort((a, b) => b.P - a.P);
  const sortedAsks = [...Asks].sort((a, b) => a.P - b.P);

  return (
    <div className="order-book-widget">
      <h4>Order Book for {selectedStock}</h4>

      {/* Column Headers: Price, Quantity, Orders */}
      <div className="column-headers">
        <span className="header price-header">Price</span>
        <span className="header quantity-header">Quantity</span>
        <span className="header orders-header">Orders</span>
      </div>

      {/* Bids first (top of the list) */}
      {sortedBids.map((bid, index) => (
        <PriceLevelWidget
          key={index}
          price={bid.P}
          quantity={bid.Q}
          orders="-" // Filler for now
        />
      ))}

      {/* Asks next (bottom of the list) */}
      {sortedAsks.map((ask, index) => (
        <PriceLevelWidget
          key={index}
          price={ask.P}
          quantity={ask.Q}
          orders="-" // Filler for now
        />
      ))}
    </div>
  );
};

export default OrderBookWidget;
