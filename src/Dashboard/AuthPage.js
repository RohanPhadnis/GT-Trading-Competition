import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { buildupHandler, getBuildupData } from "../HelperClasses/api.js";

const AuthPage = () => {
        const [username, setUsername] = useState("");
        const [apiKey, setApiKey] = useState("");
        const [subscribeVar, setSubscribeVar] = useState(0);
        const [auth, setAuth] = useState(false);
        const [error, setError] = useState(null);
        const navigate = useNavigate();

        useEffect(() => {
            if (subscribeVar > 0) {
                let data = getBuildupData();
                console.log("📦 Retrieved buildupData:", data);

                if (data && data.message === "Success!") {
                    setAuth(true);
                    console.log("✅ Authentication successful for:", data.username);
                    navigate("/dashboard");
                } else {
                    setAuth(false);
                    setError("Authentication failed. Please try again.");
                }
            }
        }, [subscribeVar, navigate]);

        const handleApiKeyChange = (e) => {
            setApiKey(e.target.value);
        };

        const handleUsernameChange = (e) => {
            setUsername(e.target.value);
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            console.log("🚀 Starting buildup request with:", { username, apiKey });

            buildupHandler({ username, apiKey }, setSubscribeVar);
        };

        return ( <
            div className = "auth-page" >
            <
            h2 > Authentication Required < /h2> <
            p > Please enter your credentials to proceed. < /p>

            <
            input type = "text"
            value = { username }
            onChange = { handleUsernameChange }
            placeholder = "Your username" /
            >
            <
            input type = "password"
            value = { apiKey }
            onChange = { handleApiKeyChange }
            placeholder = "Your API Authentication Key" /
            >
            <
            button onClick = { handleSubmit } > Submit < /button>

            {
                auth && < p > ✅Authentication Succeeded!Redirecting... < /p>} {!auth && subscribeVar > 0 && < p > ❌Authentication Failed < /p >
            } {
                error && < p className = "error" > { error } < /p>} < /
                div >
            );
        };

        export default AuthPage;