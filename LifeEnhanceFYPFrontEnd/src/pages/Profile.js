import PageHeader from "../components/PageHeader";
import {useEffect, useState} from "react";
import {HOMEPAGE, PROFILE} from "../constants/Routes";
import {useNavigate} from "react-router-dom";
import {getAuth, updateProfile} from "firebase/auth";
import { Button,TextInput} from "@mantine/core";
import {getStorage,uploadBytes, getDownloadURL} from "firebase/storage"
import {ref as sRef} from "firebase/storage"
import {toast, ToastContainer} from "react-toastify";
import {getDatabase,set,ref} from "firebase/database";
import "@fontsource/press-start-2p";
import background from "../images/backgrounds/profileBackground.png";


export default function Profile() {
    let navigate = useNavigate();

    //This ensure the user is logged in
    useEffect(()=>{
        let authToken = sessionStorage.getItem('Auth Token')

        if (authToken){
            navigate(PROFILE)
        }

        if (!authToken){
            navigate(HOMEPAGE)
        }
    },[])


    const auth = getAuth();
    const user = auth.currentUser;
    const storage = getStorage();


    let [displayName, setDisplayName] = useState("Newbie");
    let [photo,setPhoto] = useState(null);
    let [photoURL,setPhotoURL] = useState(user.photoURL);
    let [targetCalories,setTargetCalories] = useState(0);

    //This handles the update of the display name and profile picture
    async function handleUpdate() {
        if(displayName==="Newbie"){
            toast("You need to insert a display name");
        }else if(displayName.length>20){
            toast("Display name cannot be longer than 20 characters!")
        }else{
            toast("Profile Updated!")
            const fileRef = sRef(storage, user.uid + '.png');

            await uploadBytes(fileRef, photo)
            photoURL = await getDownloadURL(fileRef);
            setPhotoURL(photoURL);
            updateProfile(auth.currentUser, {
                displayName: displayName, photoURL: photoURL
            }).then(() => {
                navigate(PROFILE);
            })
        }

    }

    //This handles updating the profile picture ( it only takes in 1 photo)
    function handleProfilePictureUpdate(e) {
        if(e.target.files[0]){
            setPhoto(e.target.files[0])
        }
    }

    const [MFPUsername,setMFPUsername] = useState(null);
    const db = getDatabase();


    //This function handles the MPF username and target calories
    function handleMFP() {
        if(MFPUsername==null) {
            toast("MFPUsername cannot be empty")
        }else if(targetCalories===0){
            toast("Calories cannot be empty!")
        }else if(isNaN(targetCalories)){
            toast("Target calories must be a valid number!")
        }else{
            toast("Profile Updated!")
            set(ref(db, '/users/' + getAuth().currentUser.uid), {
                MFPUsername: MFPUsername,
                TargetCalories : targetCalories
            }).then(() => {
                navigate(PROFILE);
            })
        }
    }

    return(
        <>
            <div style={{backgroundImage:`url(${background})`,height:"100vh"}}>
            <PageHeader/>
                <ToastContainer/>
                <h1 className="text-2xl ml-2">Welcome to your profile {user.displayName}</h1>
                <div className="flex flex-row justify-start">
                    <div className="mt-6 ml-6 rounded-lg border-black border-4 w-auto h-full flex flex-col">
                        <label className="text-2xl ml-2">Player name:</label>
                        <TextInput className="w-72 ml-2 border-black border-4" onChange={(event) => setDisplayName(event.currentTarget.value)}/>
                        <label className="text-2xl ml-2">Avatar:</label>
                        <input className="ml-2" type="file" onChange={handleProfilePictureUpdate}/>
                        <Button className="text-base text-white h-12 w-42 mt-2 border-black border-4 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 w-36 mb-2 ml-2" onClick={() => handleUpdate()}>Submit!</Button>
                    </div>

                    <div className="mt-2 ml-auto mr-96 rounded-lg border-black border-4 w-auto flex flex-col justify-end">
                        <h1 className="text-2xl ml-2">Configure your account</h1>
                        <label className="text-2xl ml-2 mt-6">MyFitnessPal Username(Must be Public):</label>
                        <TextInput className="w-72 ml-2" onChange={(event) => setMFPUsername(event.currentTarget.value)}/>
                        <label className="text-2xl ml-2">Target Calories:</label>
                        <TextInput className="w-72 ml-2" onChange={(event) => setTargetCalories(event.currentTarget.value)}/>
                        <Button className="text-base text-white border-black border-4 h-12 w-42 mt-2 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 w-36 mb-2 ml-2" onClick={() => handleMFP()}>Submit!</Button>
                    </div>
                </div>
            </div>

        </>
    );
}