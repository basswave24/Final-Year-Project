import {Modal, Button, Group, TextInput, Image} from '@mantine/core';
import {useState} from "react";
import {getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword,sendPasswordResetEmail} from "firebase/auth";
import {DASHBOARD} from "../constants/Routes";
import React, { useEffect } from 'react'
import logo from "../images/logos/lifeEnhanceLogo.png"
import {useNavigate} from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import background from "../images/backgrounds/homepageBackground.png"
import { app } from '../firebase';



export default function Homepage(){

    //Modals
    const [login, setLogin] = useState(false);
    const [register, setRegister] = useState(false);

    //Login+Register fields
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    let navigate = useNavigate();

    //Giving the user the auth token and navigating them to the dashboard
    useEffect(()=>{
        let authToken = sessionStorage.getItem('Auth Token');

        if (authToken){
            navigate(DASHBOARD);
        }
    })

    //Registration
    function handleRegistration(){
        createUserWithEmailAndPassword(getAuth(),email,password)
            .then((response) => {
                sessionStorage.setItem('Auth Token', response._tokenResponse.refreshToken)
                setRegister(false);//Closing the modal upon registering
            })
            .catch((error)=>{
                if(error.code === 'auth/email-already-in-use'){
                    toast.error('An user with this email has already been created! Select "Forget Password" to reset your password')
                }
                if(error.code === 'auth/invalid-email'){
                    toast.error('Please enter a valid email!')
                }
                if(password===""){
                    toast.error("Please enter a password value!")
                }
                if(error.code === 'auth/weak-password'){
                    toast.error("Passwords should be at least 6 characters")
                }
            })
    }

    //Handling login
    function handleLogin(){
        signInWithEmailAndPassword(getAuth(),email,password)
            .then((response) => {
                navigate(DASHBOARD)
                sessionStorage.setItem('Auth Token',response._tokenResponse.refreshToken) //setting the token for the loggedin user
            })
            .catch((error)=>{
                console.log(error.code);
                if(error.code === 'auth/wrong-password'){
                    toast.error('The password you have entered is wrong!')
                }
                if(error.code === 'auth/invalid-email'){
                    toast.error('Please enter a valid email!')
                }
                if(password===""){
                    toast.error("Please enter a password value!")
                }
                if(error.code === 'auth/user-not-found'){
                    toast.error("User not found!")
                }
            })
    }

    //Handling forget password
    function handleForgetPassword() {
        sendPasswordResetEmail(getAuth(), email).then(()=> {
            toast.success("Password has been reset. Please check your email! ");
            setRegister(false);
        })
            .catch((error)=>{
                if(error.code === "auth/user-not-found") {
                    toast.error("No user found with that email");
                }
                if(error.code === "auth/invalid-email") {
                    toast.error("Please enter a valid email!");
                }
                if(email===""){
                    toast.error("Please enter an email in order to reset your passwsord!");
                }
            })
    }

    return (
        <div style={{backgroundImage:`url(${background})`,height:"100vh"}}>
            <Image src={logo} style={{marginLeft: "auto", marginRight: "auto", width: "38%", padding: "5%"}}/>
            <ToastContainer/>
            <Modal transition="slide-right" transitionDuration={500}
                opened={login}
                onClose={() => setLogin(false)}
                size="30%"
            >
                <h1 className="text-2xl mb-6 ml-2">Login</h1>
                <TextInput className = "mt-2 border-black border-4" value={email} onChange={(event)=>setEmail(event.currentTarget.value)}
                           placeholder="Enter your email!" />
                <TextInput className = "mt-2 border-black border-4" value={password} onChange={(event)=>setPassword(event.currentTarget.value)} type="password"
                           placeholder="Enter your password!"/>
                <Button className="text-base text-white h-12 w-42 border-black border-4 mt-6 rounded-full bg-gradient-to-r from-teal-500 to-blue-500" onClick={() => handleLogin()}>Submit!</Button>
                <Button className="text-base text-white h-12 w-42 border-black border-4 mt-6 ml-40 rounded-full bg-gradient-to-r from-teal-500 to-blue-500" onClick={() => handleForgetPassword()}>Forgot Password?!</Button>
            </Modal>
            <Modal transition="slide-left" transitionDuration={500}
                opened={register}
                onClose={() =>
                setRegister(false)}
                size="30%"
            >
                <h1 className="text-2xl mb-6 ml-2">Register</h1>
                <TextInput className = "mt-2 border-black border-4" value={email} onChange={(event)=>setEmail(event.currentTarget.value)}
                    placeholder="Enter your email!" />
                <TextInput className = "mt-2 border-black border-4" value={password} onChange={(event)=>setPassword(event.currentTarget.value)} type="password"
                    placeholder="Enter your password!"/>
                <Button className="border-black border-4 text-base text-white h-12 w-42 mt-6 rounded-full bg-gradient-to-r from-teal-500 to-blue-500" onClick={() => handleRegistration()}>Submit!</Button>
                <Button className="border-black border-4 text-base text-white h-12 w-42 mt-6 ml-40 rounded-full bg-gradient-to-r from-teal-500 to-blue-500" onClick={() => handleForgetPassword()}>Forgot Password?!</Button>
            </Modal>

            <Group position="center">
                <Button className="border-black border-4 text-2xl mb-6 mr-4 text-white h-16 w-64 rounded-full bg-gradient-to-r from-teal-500 to-blue-500" onClick={() => setLogin(true)}>Login!</Button>
                <Button className="border-black border-4 text-2xl mb-6 text-white h-16 w-64 rounded-full bg-gradient-to-r from-teal-500 to-blue-500" onClick={() => setRegister(true)}>Register!</Button>
            </Group>
        </div>
    );
}