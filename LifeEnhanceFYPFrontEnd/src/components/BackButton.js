import {ToastContainer} from "react-toastify";
import React from "react";
import {Button} from "@mantine/core";
import {useNavigate} from "react-router-dom";
import {DASHBOARD} from "../constants/Routes";

export default function BackButton(){

    let navigate = useNavigate();

    function handleBack() {
        navigate(DASHBOARD)

    }

    return (
        <>
            <Button className="text-base text-white h-12 w-42 border-black border-4 mt-2 ml-2 rounded-full bg-gradient-to-r from-teal-500 to-blue-500" onClick={() => handleBack()}>{`<- Back`}</Button>
        </>
    )}
