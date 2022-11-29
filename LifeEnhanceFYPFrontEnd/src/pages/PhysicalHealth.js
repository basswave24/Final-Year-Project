import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {HOMEPAGE} from "../constants/Routes";
import Axios from "axios";
import PageHeader from "../components/PageHeader";
import wallpaper from "../images/backgrounds/homepageBackground.png";
import {Cell,PieChart, Pie, Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis} from "recharts";
import {getDatabase, ref,child,get} from "firebase/database";
import {getAuth} from "firebase/auth";


export default function PhysicalHealth() {

    let navigate = useNavigate();

    //This useEffect ensures the user is logged in
    useEffect(async () => {
        let authToken = sessionStorage.getItem('Auth Token')

        if (authToken) {
            navigate(PhysicalHealth)
        }

        if (!authToken) {
            navigate(HOMEPAGE)
        }



    },[])

    //This function gets the current date
    function getCurrentDate(separator='-'){
        let newDate = new Date()
        let date = newDate.getDate();
        let month = newDate.getMonth() + 1;
        let year = newDate.getFullYear();

        if(date<10){
            return `${year}${separator}${month<10?`0${month}`:`${month}`}${separator}0${date}`
        }else{
            return `${year}${separator}${month<10?`0${month}`:`${month}`}${separator}${date}`
        }
        //The reason for this if statement is because the backend needs the date in the following format: YYYY-MM-DD
        //But if the day is below 10, eg: 1st of April, it will be displayed as YYYY-MM-D (2022-04-1)
        //Thus we are adding 0 in front of it
    }


    const [date,setDate] = useState(getCurrentDate());

    //Hooks set with values pulled from the database
    const [calories,setCalories] = useState("0");
    const [usermfp,setUserMFP] = useState(null);

    //Hooks set with values from MFP API
    const [targetCalories,setTargetCalories] = useState(null);
    const [carbs,setCarbs] = useState("0");
    const [fat,setFat] = useState("0");
    const [protein,setProtein] = useState("0");

    const dbRef = ref(getDatabase());


    //This function gets all the data
    async function getMFPUser() {
        //This function gets the user's MyFitnessPal's username from the database
        await get(child(dbRef, '/users/' + getAuth().currentUser.uid + '/MFPUsername')).then((snapshot) => {
            if (snapshot.exists()) {
                setUserMFP(snapshot.val());
            }
        })

        //This function gets the user's target calories from the database
        await get(child(dbRef, '/users/' + getAuth().currentUser.uid + '/TargetCalories')).then((snapshot) => {
            if (snapshot.exists()) {
                setTargetCalories(snapshot.val());
            }
        })

        //This function sends the date and username to the MFP API and gets all the diary data returned
        await Axios.get("http://localhost:3001/fitnessDiary", {
            params: {
                username: usermfp,
                date: date
            }
        }).then((response) => {
            //The diary data returned is then set onto the hooks
            setCalories(response.data.calories);
            setCarbs(response.data.carbs);
            setFat(response.data.fat);
            setProtein(response.data.protein);
        })
    }

     getMFPUser();

    //This is the data needed to construct the bar chart
    const barChartData=[{
        name: 'Calories Consumed',
        consumedCalories: calories,
    },
    {
        name: 'Target Calories',
        targetCalories: targetCalories,
    }];

    //This is the data needed to construct the pie chart
    const pieChartData=[{
        name: "Carbs",
        consumed: carbs
    },{
        name: "Fat",
        consumed: fat
    },{
        name: "Protein",
        consumed: protein
    }]


    //These will be used as the pie chart colours
    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

    return(
        <>
            <div style={{backgroundImage:`url(${wallpaper})`,height:"100vh"}}>
                <PageHeader/>
                {
                        calories==null?
                            <p className="text-2xl ml-2 text-red-700">No food added for {date}, add food using MyFitnessPal!</p> : null
                    }
                    {
                        usermfp==null?
                            <p className="text-2xl ml-2 text-red-700">Link your MyFitnessPal user in your profile!</p> : null
                    }
                    <h1 className="mt-4 text-2xl ml-2">What date would you like to see?</h1>
                    <input className="w-56 h-10 mt-4 rounded-lg border-4 ml-4" type="date" onChange={(event)=>setDate(event.currentTarget.value)} required/>
                <div className="grid grid-cols-2">
                    <div className="ml-2 mt-40">
                        {
                            calories!=null?<BarChart width={730} height={250} data={barChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip/>
                                <Bar barSize={100} dataKey="consumedCalories" fill="orange" />
                                <Bar barSize={100} dataKey="targetCalories" fill="green"/>
                            </BarChart> : null
                        }
                    </div>
                    <div>
                        {
                            calories!=null? <p className="text-2xl ml-2">Here are the nutrients consumed on {date}</p> :  null
                        }
                        <PieChart width={1000} height={400}>
                            <Pie
                                dataKey="consumed"
                                isAnimationActive={false}
                                data={pieChartData}
                                cx={200}
                                cy={200}
                                fill="#8884d8"
                            >
                                {pieChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}</Pie>
                            <Tooltip/></PieChart>
                    </div>
                </div>


            </div>
        </>
    );
}


