class UserPortfolio {
    constructor() {
        this.data = {
            balance: 0,
            positions: {},
            username: null,
        };
        this.subscribers = [];
    }

    // Subscribe to changes
    subscribe(callback) {
        if (typeof callback === "function") {
            this.subscribers.push(callback);
        }
    }

    // Unsubscribe from changes
    unsubscribe(callback) {
        this.subscribers = this.subscribers.filter((sub) => sub !== callback);
    }

    // Notify all subscribers
    _notifySubscribers() {
        this.subscribers.forEach((callback) => callback(this.data));
    }

    // Update portfolio and notify subscribers
    updatePortfolio(message) {
        if (!message || typeof message !== "object") {
            console.error("Invalid message format:", message);
            return;
        }

        const { balance, positions, username } = message;

        if (balance !== undefined) {
            this.data.balance = balance;
        }

        if (positions && typeof positions === "object") {
            this.data.positions = {...this.data.positions, ...positions };
        }

        if (username) {
            this.data.username = username;
        }

        this._notifySubscribers(); // Notify on updates
        //console.log("Portfolio updated:", this.data);
    }

    getPortfolio() {
        return {...this.data };
    }
}

const userPortfolio = new UserPortfolio();
export default userPortfolio;