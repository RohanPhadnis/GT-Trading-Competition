import React, { useState, useRef, useEffect } from "react";
import { getMessageList } from "../HelperClasses/api";
import {controls} from "../HelperClasses/controls";
import "./MessageViewer.css";

const MessageViewer = () => {
    const [messages, setMessages] = useState([]);
    const [initialized, setInitialized] = useState(false);
    const [subscribeVar, setSubscribeVar] = useState(0);

    useEffect(() => {
        if (!initialized) {
            controls.messageSubscriber = setSubscribeVar;
            setInitialized(true);
        }
    }, [initialized]);

    useEffect(() => {
        var messages = getMessageList();
        var reversedMessages = [...messages].reverse();

        setMessages(reversedMessages);
    }, [subscribeVar]);

    return (
        <div className="message-viewer">
            <h4>Messages</h4>
            <div className="message-widget"> 
                {messages.map((msg, index) => {return (
                    <div key={index} style={{ color: msg.status === 200 ? "green" : "red" }}>
                        {msg.text}
                    </div>
                );})}
            </div>
        </div>
    );
};

export default MessageViewer;
