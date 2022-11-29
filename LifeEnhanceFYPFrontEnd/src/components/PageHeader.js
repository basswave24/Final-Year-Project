import React, {useEffect} from 'react'
import '../index.css'
import {Avatar, Button, Container, Image, Title} from "@mantine/core";
import logo from "../images/logos/lifeEnhanceLogo.png";
import { getAuth } from "firebase/auth";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {DASHBOARD, HOMEPAGE, MENTALHEALTH, PROFILE} from "../constants/Routes";
import wallpaper from "../images/backgrounds/homepageBackground.png";
import {Howl, Howler} from "howler";
import campfireSound from "../sounds/sound.mp4";
import BackButton from "./BackButton";


export default function PageHeader(){

    const urlLocation = useLocation();
    console.log(urlLocation.pathname);

    let sound = new Howl({
        src: [campfireSound]
    })

    useEffect(()=>{
        if(urlLocation.pathname==MENTALHEALTH ){
             sound.play();
        }else{
            Howler.stop();
        }
    },[])


    const auth = getAuth();
    const user = auth.currentUser;

    let displayName;

    if (user !== null) {
        user.providerData.forEach((profile) => {
           /* console.log("Sign-in provider: " + profile.providerId);
            console.log("  Provider-specific UID: " + profile.uid);
            console.log("  Name: " + profile.displayName);
            console.log("  Email: " + profile.email);
            console.log("  Photo URL: " + profile.photoURL); */
            displayName = profile.displayName;
            if(!displayName){
                displayName = "Newbie"
            }
        });
    }

    let navigate = useNavigate();
    function handleLogOut() {
        sessionStorage.removeItem('Auth Token');
        navigate(HOMEPAGE);
    }



    return (
        <div className="flex flex-row-3 gap-0 ">
            <div>
                {
                    (urlLocation.pathname!==DASHBOARD)?<BackButton></BackButton> : null
                }
            </div>
            <div className=" justify-center h-64 mt-2 ml-[48rem]">
               <Link to={DASHBOARD}><img src={logo}></img></Link>
            </div>

            <div className="border ml-[40rem] h-40 rounded-lg border-black border-8 flex flex-row mt-4 mr-4">
                <Link className="break-words" to={PROFILE}>
                     <Avatar className="w-28 h-32 mt-1 ml-2" src={user.photoURL}></Avatar>
                </Link>
                <div className="break-words h-28">
                    <p className="break-words text-2xl ml-2">Hello {displayName}!</p>
                    <Button className="mt-10 border-black border-4 break-words text-base text-white h-8 w-26 ml-2 rounded-full bg-gradient-to-r from-teal-500 to-blue-500" onClick={() => handleLogOut()}>Logout!</Button>
                </div>
            </div>
        </div>

    )
}