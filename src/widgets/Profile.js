import React, {useState, useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {getBuildupData} from "../HelperClasses/api";
import './profile.css'; 

const Profile =  () => {
    const [username, setUsername] = useState(localStorage.getItem("username"));
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("username");
        localStorage.removeItem("apiKey");
        navigate("/");
    };

    return (
        <div>
            <p><strong>Username: </strong>{username}</p>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default Profile;
