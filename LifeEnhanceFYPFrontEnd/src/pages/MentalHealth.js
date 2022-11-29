import PageHeader from "../components/PageHeader";
import {Button, Modal} from "@mantine/core";
import React, {useEffect, useState} from "react";
import {getDatabase, onValue, push, ref,query, limitToLast} from "firebase/database";
import {getAuth} from "firebase/auth";
import {useNavigate} from "react-router-dom";
import {HOMEPAGE, MENTALHEALTH} from "../constants/Routes";
import Post from "../components/Post";
import background from "../images/backgrounds/campfireBackground.png";
import {toast} from "react-toastify";

export default function MentalHealth() {

    require("firebase/database");
    let navigate = useNavigate();

    //this useEffect ensures the user is logged in
    useEffect(()=>{
        let authToken = sessionStorage.getItem('Auth Token')

        if (authToken){
            navigate(MENTALHEALTH)
        }

        if (!authToken){
            navigate(HOMEPAGE)
        }

    },[])

    const [postSetting, setPostSetting] = useState(false); //this is the modal
    const [post, setPost] = useState(null);
    const db = getDatabase();

    const postsRef = query(ref(db,'posts/'),limitToLast(6)); //this is a reference to the posts in the database


    let data;
    let posts = [];
    getPosts();

    //this function gets all the posts from the database
    function getPosts(){
        onValue(postsRef,(snapshot => {
            snapshot.forEach((childSnapshot)=>{
                data = {
                    ref : childSnapshot.key,
                    post : childSnapshot.val().Post,
                    author : childSnapshot.val().Author
                }
                posts.push(data);
            })
        }))
    }

    //this function pushes a new post to the database
    function handlePost() {
        const auth = getAuth();
        const user = auth.currentUser;

        if(post==null){
            toast.error("You must enter a gratefulness post!")
        }else{
            push(ref(db, '/posts/'), {
                Post: post,
                Author : user.displayName
            }).then(() => {
                setPostSetting(false);
                setPost(null)
                navigate(MENTALHEALTH);
            })
        }

    }

    return(
        <>
            <div style={{backgroundImage:`url(${background})`,height:"100vh"}}>
                <PageHeader/>
                <h1 className="text-2xl ml-2">Welcome! Relax your mind by the campfire and reflect upon your day!</h1>
                <h1 className="text-2xl ml-2">What are you grateful for today?</h1>
                <Button className="text-base text-white h-12 w-42 border-black border-4 mt-2 ml-2 rounded-full bg-gradient-to-r from-teal-500 to-blue-500" onClick={() => setPostSetting(true)}>Share!</Button>

                <div className="grid grid-cols-3">
                    {
                        posts.map((post)=>{
                            return (<Post postKey={post.ref} post={post.post} author={post.author}/>)
                        })
                    }
                </div>

                <Modal transition="slide-right" transitionDuration={500}
                       opened={postSetting}
                       onClose={() => setPostSetting(false)}
                       size="30%"
                >
                    <div>
                        <h1 className="text-2xl ml-2">What are you grateful for today?</h1>
                        <textarea placeholder="Enter anything at all! :)" className="w-full h-40 ml-2 border-4 border-black" onChange={(event) => setPost(event.currentTarget.value)}/>
                    </div>
                    <div className="flex flex-row justify-end">
                        <Button className="text-base text-white h-12 w-42 border-black border-4 mt-2 justify-end rounded-full bg-gradient-to-r from-teal-500 to-blue-500" onClick={() => handlePost()}>Submit!</Button>
                    </div>
                </Modal>
            </div>
        </>
    );
}