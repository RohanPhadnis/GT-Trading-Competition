import socketManager from "../HelperClasses/SocketManager";
import orderBookInstance from "./OrderBook";
//const URI = "http://ec2-13-59-143-196.us-east-2.compute.amazonaws.com:8080";
//const URI = "http://localhost:8080"
const URI = "http://ec2-3-16-107-184.us-east-2.compute.amazonaws.com:8080"
class AsyncAPICall {
    path;
    dependency;
    data;
    promise;
    subscriber;
    counter;

    constructor(path, dependency) {
        this.path = path;
        this.data = null;
        this.promise = new Promise((resolve, reject) => { resolve(); });
        this.subscriber = (val) => {};
        this.dependency = dependency;
        this.counter = 0;
    }

    setSubscriber(callbackFunction) {
        this.subscriber = callbackFunction;
    }

    async requestHelper(form) {
        if (this.dependency !== null) {
            await this.dependency.promise;
            for (const key in this.dependency.data) {
                form[key] = this.dependency.data[key];
            }
        }
        let promise = fetch(URI + this.path, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form)
            })
            .then(async(data) => {
                console.log(`Request to ${this.path} - Status:`, data.status); // Log response status
                const jsonResponse = await data.json();
                console.log(`Response from ${this.path}:`, jsonResponse); // Log full API response
                return jsonResponse;
            });

        this.data = await promise;
        this.data = {...this.data, ...form };
        this.counter++;
        this.subscriber(this.counter);
    }

    request(form) {
        this.promise = this.requestHelper(form);
    }
}


let buildupObject = new AsyncAPICall("/buildup", null);
let teardownObject = new AsyncAPICall("/teardown", buildupObject);
let limitOrderObject = new AsyncAPICall("/limit_order", buildupObject);
let marketOrderObject = new AsyncAPICall("/market_order", buildupObject);
let removeObject = new AsyncAPICall("/remove", buildupObject);
let tickers = [];
const setTickers = (newTickers) => {
    if (Array.isArray(newTickers)) {
        // ✅ Ensure only valid strings get added
        const filteredTickers = newTickers.filter(ticker => typeof ticker === "string");
        tickers.splice(0, tickers.length, ...filteredTickers);
        console.log("Tickers updated:", tickers);
    }
};
export function buildupHandler(data, subscriber) {
    // Set a subscriber that gets triggered when the API call completes
    buildupObject.setSubscriber((counter) => {
        subscriber(counter);

        // After the build-up is successful (counter > 0), connect to WebSocket
        if (counter > 0) {
            const buildupData = getBuildupData();
            console.log(buildupData)
            console.log(buildupObject)
            console.log(data)
            if (buildupData && buildupData.username && buildupData.sessionToken && buildupData.orderBookData) {
                console.log("Build-up complete. Initiating WebSocket connection...");
                buildupData.orderBookData = JSON.parse(buildupData.orderBookData);
                setTickers(Object.keys(buildupData.orderBookData));
                socketManager.connect(); // Initiates WebSocket connection
                orderBookInstance._createSortedMap(buildupData.orderBookData)
            } else {
                console.error("Buildup data is incomplete. Cannot connect to WebSocket.");
            }
        }
    });

    // Initiate the API call
    buildupObject.request(data);
}

export function teardownHandler(data, subscriber) {
    teardownObject.setSubscriber(subscriber);
    teardownObject.request(data);
}

export function limitOrderHandler(data, subscriber) {
    limitOrderObject.setSubscriber(subscriber);
    limitOrderObject.request(data);
}

export function marketOrderHandler(data, subscriber) {
    marketOrderObject.setSubscriber(subscriber);
    marketOrderObject.request(data);
}
export function removeHandler(data) {
    console.log(data);
    removeObject.request(data);
}

export function getBuildupData() {
    return buildupObject.data;
}

export function getTeardownData() {
    return teardownObject.data;
}

export function getLimitOrderData() {
    return limitOrderObject.data;
}

export function getMarketOrderData() {
    return marketOrderObject.data;
}
export function getTickers() {
    return Array.isArray(tickers) && tickers.length > 0 ? [...tickers] : [];
}