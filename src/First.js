import React, {useEffect, useState, Component, useRef} from "react";
import {useNavigate} from 'react-router-dom'

const First = () => {
    const navigate = useNavigate();
    const gotoCounselor = () => {
        navigate('/counselor')
    };
    const gotoClient = () => {
        navigate('/client')
    };
    return (
        <>
        <button onClick={gotoCounselor}>
            Counselor
        </button>
        <button onClick={gotoClient}>
            Client
        </button>
        </>
    )
}

export default First