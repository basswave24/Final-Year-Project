import PageHeader from "../components/PageHeader";
import {useNavigate} from "react-router-dom";
import {GOALS, HOMEPAGE} from "../constants/Routes";
import React, {useEffect, useState} from "react";
import {Button, Modal, TextInput} from "@mantine/core";
import {getDatabase, ref, push, onValue} from "firebase/database";
import {getAuth} from "firebase/auth";
import Goal from "../components/Goal";
import background from "../images/backgrounds/objectivesBackground.png"
import {toast} from "react-toastify";


export default function Goals() {
    require("firebase/database");
    let navigate = useNavigate();

    useEffect(()=>{
        let authToken = sessionStorage.getItem('Auth Token')

        if (authToken){
            navigate(GOALS)
        }

        if (!authToken){
            navigate(HOMEPAGE)
        }

    },[])




    const [goalSetting, setGoal] = useState(false); //this is the modal
    const [goalName, setGoalName] = useState(null);
    const [goalDescription,setGoalDescription] = useState(null);


    const db = getDatabase();
    const goalsRef = ref(db,'users/' + getAuth().currentUser.uid + '/goals'); //reference to goals in the database


    let data;
    let goals = []; //this will store all the goals

    //This function gets the goals from the database
    function getGoals(){
        onValue(goalsRef,(snapshot => {
            snapshot.forEach((childSnapshot)=>{
               data = {
                   ref : childSnapshot.key,
                   name : childSnapshot.val().GoalName,
                   description: childSnapshot.val().GoalDescription
               }
               goals.push(data);
           })
       }))
    }
    getGoals();


    //This function pushes a new goal to the database
    function handleGoal() {
        if(goalName==null){
            toast.error("You need to enter an objective name!")
        }else if(goalDescription==null){
            toast.error("You need to enter an objective description!")
        }else {
            push(ref(db, '/users/' + getAuth().currentUser.uid+'/goals/'), {
                GoalName: goalName,
                GoalDescription : goalDescription
            }).then(() => {
                setGoal(false);//this closes the modal
                setGoalName(null);
                setGoalDescription(null);
                navigate(GOALS);
            })
        }
    }

    return(
        <>
            <div style={{backgroundImage:`url(${background})`,height:"100vh"}}>

                <PageHeader/>
                <Button className="text-base text-white h-12 w-42 border-black border-4 mt-2 ml-2 rounded-full bg-gradient-to-r from-teal-500 to-blue-500" onClick={() => setGoal(true)}>Set an objective</Button>


                <Modal transition="slide-right" transitionDuration={500}
                       opened={goalSetting}
                       onClose={() => setGoal(false)}
                       size="30%"
                >
                    <h1 className="text-2xl mb-2  ml-2">Set an objective!</h1>
                    <label className=" text-2xl ml-2">Objective Name:</label>
                    <TextInput placeholder="Objective name.." className="mb-2 border-black border-4 w-72 ml-2" onChange={(event) => setGoalName(event.currentTarget.value)}/>
                    <label className="text-2xl ml-2">Objective Description</label>
                    <textarea placeholder="Objective description.." className="w-full h-40 ml-2 border-4 border-black" onChange={(event) => setGoalDescription(event.currentTarget.value)}/>
                    <div className="flex flex-row justify-end">
                        <Button className="text-base text-white h-12 w-42 border-black border-4 mt-2 justify-end rounded-full bg-gradient-to-r from-teal-500 to-blue-500" onClick={() => handleGoal()}>Submit!</Button>
                    </div>
                </Modal>

                <div className="grid grid-cols-3 overflow-y-auto">
                    {   (goals.length!==0) ?
                        goals.map((goal)=>{
                            return (<Goal goalKey={goal.ref} GoalTitle={goal.name} GoalDescription={goal.description}/>)
                        }) : <p className="text-2xl text-red-500 ml-2">You need to add some objectives!</p>
                    }
                </div>
            </div>
        </>
    );
}