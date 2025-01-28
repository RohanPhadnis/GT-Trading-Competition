import React, { useState } from 'react';
import { marketOrderHandler, getMarketOrderData, limitOrderHandler, getLimitOrderData } from '../HelperClasses/api';
import "./CurrentPositionWidget.css";


/*
todo:
  - add error message queue
  - add way to limit requests while another request is ongoing
  - track tickertus

 */
const CurrentPositionWidget = ({ selectedStock }) => {
  const [price, setPrice] = useState('');
  const [amount, setAmount] = useState(10);
  const [subscribeVar, setSubscribeVar] = useState(0);

  const handleBuy = () => {
    const isMarket = (!price || Number(price) === 0);
    if (isMarket) {
      marketOrderHandler({
        ticker: 'TSLA', // todo fix this,
        volume: amount,
        isBid: true
      }, setSubscribeVar);
    } else {
      limitOrderHandler({
        ticker: 'TSLA',
        volume: amount,
        isBid: true,
        price: price
      }, setSubscribeVar);
    }
    // const orderType = (!price || Number(price) === 0) ? "Market" : `Limit (Price: ${price})`;
    // console.log(`Buy order placed for ${amount} shares of ${selectedStock} at ${price} (${orderType}).`);
  };

  const handleSell = () => {
    const isMarket = (!price || Number(price) === 0);
    if (isMarket) {
      marketOrderHandler({
        ticker: 'TSLA', // todo fix this,
        volume: amount,
        isBid: false
      }, setSubscribeVar);
    } else {
      limitOrderHandler({
        ticker: 'TSLA',
        volume: amount,
        isBid: false,
        price: price
      }, setSubscribeVar);
    }
    // const orderType = (!price || Number(price) === 0) ? "Market" : `Limit (Price: ${price})`;
    // console.log(`Sell order placed for ${amount} shares of ${selectedStock} at ${price} (${orderType}).`);
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



