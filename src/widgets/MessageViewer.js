import React, { useState, useRef, useEffect } from "react";
import { getMessageList } from "../HelperClasses/api";
import {controls} from "../HelperClasses/controls";

const MessageViewer = () => {
    const [messages, setMessages] = useState([]);
    const [initialized, setInitialized] = useState(false);
    const [subscribeVar, setSubscribeVar] = useState(0);
    const messageEndRef = useRef(null);

    useEffect(() => {
        if (!initialized) {
            controls.messageSubscriber = setSubscribeVar;
            setInitialized(true);
        }
    }, [initialized]);

    useEffect(() => {
        setMessages(getMessageList());
    }, [subscribeVar]);

    // Auto-scroll to the bottom when new messages arrive
    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <div style={{
            width: "100%",
            maxHeight: "300px",
            overflowY: "auto",
            maxWidth: "400px",
        }}>
                <h4>Messages</h4>
            {messages.map((msg, index) => {return (
                <div key={index} style={{ color: msg.status === 200 ? "green" : "red" }}>
                    {msg.text}
                </div>
            );})}
            <div ref={messageEndRef} />
        </div>
    );
};

export default MessageViewer;
