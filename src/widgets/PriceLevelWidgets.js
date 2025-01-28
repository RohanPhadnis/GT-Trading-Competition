import React from "react";
import "./PriceLevelWidgets.css";

const PriceLevelWidget = ({ price, quantity, orders }) => {
  return (
    <div className="price-level-widget">
      <span className="price">{price}</span>
      <span className="quantity">{quantity}</span>
      <span className="orders">{orders}</span>
    </div>
  );
};

export default PriceLevelWidget;
