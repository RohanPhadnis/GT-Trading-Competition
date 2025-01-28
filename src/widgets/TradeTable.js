import React from "react";
import "./TradeTable.css";
import DataHelper from "../HelperClasses/DataFinder";

const TradeTable = () => {
  // Function to fetch and process PnL data
  const calculatePnL = () => {
    const currentPositions = DataHelper.getPositionData("12345");
    return currentPositions.map((trade) => ({
      ...trade,
      result: trade.is_buy ? "Buy" : "Sell",
    }));
  };

  const fetchOpenOrders = () => {
    const openOrders = DataHelper.getOpenOrders("12345");
    return openOrders.map((order) => ({
      ...order,
      result: order.is_buy ? "Buy" : "Sell",
    }));
  };

  const pnlData = calculatePnL();
  const openOrderData = fetchOpenOrders();

  return (
    <div className="pnl-dashboard">
      <div className="pnl-table-container">
        <table className="pnl-table">
          {/* Table Header */}
          <thead>
              <tr className="header">
                <th colSpan={4} className="header-section">
                  Current Position
                </th>
                <td className="divider"></td>
                <th colSpan={4} className="header-section">
                  Open Orders
                </th>
              </tr>
              <tr>
                <th>Ticker</th>
                <th>Action</th>
                <th>Trade Price</th>
                <th>Quantity</th>
                <td className="divider"></td>
                <th>Ticker</th>
                <th>Action</th>
                <th>Trade Price</th>
                <th>Quantity</th>
              </tr>
          </thead>


          {/* Table Body */}
          <tbody>
            {pnlData.map((trade, index) => (
              <tr key={`current-${index}`}>
                <td>{trade.ticker}</td>
                <td>{trade.result}</td>
                <td>${trade.price.toFixed(2)}</td>
                <td>{trade.quantity}</td>
                <td className="divider"></td>
                <td>{openOrderData[index]?.ticker || "-"}</td>
                <td>{openOrderData[index]?.result || "-"}</td>
                <td>
                  {openOrderData[index]
                    ? `$${openOrderData[index].price.toFixed(2)}`
                    : "-"}
                </td>
                <td>{openOrderData[index]?.quantity || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TradeTable;


