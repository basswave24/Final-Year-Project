import {Link, useNavigate} from "react-router-dom";
import {DASHBOARD, GOALS, PROFILE} from "../constants/Routes";
import {Avatar, Button} from "@mantine/core";
import React, {useState} from "react";
import {remove,database, getDatabase, ref, set, push, get, child, onValue,onChildAdded,runTransaction} from "firebase/database";
import {getAuth} from "firebase/auth";
import {ToastContainer,toast} from "react-toastify";



export default function Goal({goalKey,GoalTitle,GoalDescription}){


    const navigate = useNavigate();
    const db = getDatabase();
    const levelRef = ref(db,'users/' + getAuth().currentUser.uid + '/Level');
    const goalsRef = ref(db,'users/' + getAuth().currentUser.uid + '/goals/'+goalKey);
    const [level,setLevel] = useState(0);

    function removeGoal() {

    /*
        get(child(levelRef, '/users/' + getAuth().currentUser.uid + '/Level')).then((snapshot) => {
            if (snapshot.exists()) {
                let newLevel = snapshot.val() + 1;
                setLevel(newLevel)
            } else {
                setLevel(0);
                console.log("no data")
            }
        })
        console.log(level)
        */
        remove(goalsRef).then(()=>{
            toast("You have gained 1 level");
            navigate(GOALS);
            /*
            runTransaction(levelRef,(level)=>{
                if(level){
                    console.log("is it?")
                    level++
                }else{
                    console.log("please no")
                    set(ref(db, '/users/' + getAuth().currentUser.uid), {
                        Level: 1,
                    }).then(r => {
                    })
                }
            }) */
            /*
            let levelToBeIncremented = level + 1;
            console.log(levelToBeIncremented+"level to be incremented")
            set(ref(db, '/users/' + getAuth().currentUser.uid), {
                Level: levelToBeIncremented,
            }).then(r => {

            })
 */
        })
    }

    return (
        <div className>
            <ToastContainer></ToastContainer>
            <div className="overflow-y-auto pl-2 border-[5px] border-amber-900 w-[56vh] ml-2 mt-2 h-48 rounded-lg  border-4 bg-amber-100">
                <p className="text-2xl font-bold">Objective Name:</p><label className=" break-words text-[18px] ">{GoalTitle}</label>
                <p className="text-2xl font-bold">Objective Description:</p><label className="break-words text-[18px]">{GoalDescription}</label>
            </div>
            <Button className="ml-2 text-2xl mb-6 mr-4 h-10 w-42 rounded-full border-4 border-amber-900 bg-green-400 text-black" onClick={() => removeGoal()}>Complete</Button>

        </div>)

}