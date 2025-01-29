class OrderBook {
    constructor(rawOrderBook = {}) {
        if (typeof rawOrderBook !== 'object' || Array.isArray(rawOrderBook)) {
            throw new TypeError("Input data must be an object.");
        }

        this.orderBooks = {};
        this.subscribers = [];

        // Initialize order books
        for (const [ticker, volumes] of Object.entries(rawOrderBook)) {
            this.orderBooks[ticker] = {
                bidVolumes: this._createSortedMap(volumes.bidVolumes || {}, true),
                askVolumes: this._createSortedMap(volumes.askVolumes || {}, false),
            };
        }
    }

    // Subscribe to changes
    subscribe(callback) {
        if (typeof callback === "function") {
            this.subscribers.push(callback);
            console.log("✅ Subscribed a new callback. Total subscribers:", this.subscribers.length);
        }
    }

    // Unsubscribe from changes
    unsubscribe(callback) {
        this.subscribers = this.subscribers.filter((sub) => sub !== callback);
    }

    // Notify all subscribers
    _notifySubscribers() {
        this.subscribers.forEach((callback) => callback(this.orderBooks));
    }

    // Helper to create a sorted map (object) from volumes
    _createSortedMap(volumes, reverse) {
        const entries = Object.entries(volumes)
            .map(([price, qty]) => [parseFloat(price), parseFloat(qty)])
            .sort(([priceA], [priceB]) => reverse ? priceB - priceA : priceA - priceB);

        return Object.fromEntries(entries);
    }

    // Update volumes with a list of updates
    updateVolumes(updates) {
        updates.forEach(({ ticker, price, side, volume }) => {
            const sideKey = side.toLowerCase() === 'bid' ? 'bidVolumes' : 'askVolumes';

            if (!this.orderBooks[ticker]) {
                this.orderBooks[ticker] = { bidVolumes: {}, askVolumes: {} };
            }

            if (volume === 0) {
                delete this.orderBooks[ticker][sideKey][price.toFixed(2)];
            } else {
                this.orderBooks[ticker][sideKey][price.toFixed(2)] = volume;
            }

            this.orderBooks[ticker][sideKey] = this._createSortedMap(
                this.orderBooks[ticker][sideKey],
                sideKey === 'bidVolumes'
            );
        });

        // Notify all subscribers after updating the volumes
        this._notifySubscribers();
        console.log("Notified React")
        console.log(orderBookInstance)
    }

    // Convert the object to a string representation
    toString() {
        const output = [];
        for (const [ticker, data] of Object.entries(this.orderBooks)) {
            output.push(`Ticker: ${ticker}`);
            output.push("  Bid Volumes:");
            for (const [price, volume] of Object.entries(data.bidVolumes)) {
                output.push(`    ${parseFloat(price).toFixed(2)}: ${volume.toFixed(2)}`);
            }
            output.push("  Ask Volumes:");
            for (const [price, volume] of Object.entries(data.askVolumes)) {
                output.push(`    ${parseFloat(price).toFixed(2)}: ${volume.toFixed(2)}`);
            }
        }
        return output.join('\n');
    }
}

// Singleton instance
const orderBookInstance = new OrderBook();

export default orderBookInstance;