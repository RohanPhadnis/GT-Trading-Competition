import React, { useState } from 'react';
import "./CurrentPositionWidget.css";

const CurrentPositionWidget = ({ selectedStock }) => {
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState(10);

  const handleBuy = () => {
    const orderType = (!price || Number(price) === 0) ? "Market" : `Limit (Price: ${price})`;
    console.log(`Buy order placed for ${amount} shares of ${selectedStock} at ${price} (${orderType}).`);
  };

  const handleSell = () => {
    const orderType = (!price || Number(price) === 0) ? "Market" : `Limit (Price: ${price})`;
    console.log(`Sell order placed for ${amount} shares of ${selectedStock} at ${price} (${orderType}).`);
  };

  return (
    <div className="widget-container">
      <div className="buy-sell-row">
        <input
          type="number"
          className={`quantity-input ${amount === 0 ? 'placeholder-visible' : ''}`}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Quantity"
        />
        <button className="buy-button" onClick={handleBuy}>Buy</button>
        <button className="sell-button" onClick={handleSell}>Sell</button>
        <input
          type="number"
          className={`price-input ${!price || Number(price) === 0 ? 'placeholder-visible' : ''}`}
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          placeholder="For Limit Orders Only"
        />
      </div>
    </div>
  );
};

export default CurrentPositionWidget;



