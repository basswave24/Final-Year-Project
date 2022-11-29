import React, { useEffect } from 'react'
import {DASHBOARD, GOALS, HOMEPAGE, MENTALHEALTH, PHYSICALHEALTH, PROFILE} from "../constants/Routes";
import {useNavigate, Link} from "react-router-dom";
import background from "../images/backgrounds/dashboardBackground.png";
import {Image} from "@mantine/core";
import PageHeader from "../components/PageHeader";
import campfireLogo from "../images/logos/campfireLogo.png"
import objectivesLogo from "../images/logos/objectivesLogo.png"
import yourStatsLogo from "../images/logos/yourStatsLogo.png"
import profileLogo from "../images/logos/profileLogo.png"
export default function Dashboard(){

    let navigate = useNavigate();

    //This useEffect ensures the user is logged in
    useEffect(()=>{
        let authToken = sessionStorage.getItem('Auth Token')

        if (authToken){
            navigate(DASHBOARD)
        }

        if (!authToken){
            navigate(HOMEPAGE)
        }
    },[])

    return(
        <div style={{backgroundImage:`url(${background})`,height:"100vh"}}>
            <PageHeader/>
            <div className="grid grid-cols-2 w-auto h-auto border-dashed border-black border-4" >
                    <div>
                        <Link to={GOALS}>
                            <Image className="w-[25%]  mt-6 ml-96 object-contain" src={objectivesLogo}/>
                        </Link>
                    </div>
                    <div>
                        <Link to={PHYSICALHEALTH}>
                            <Image className="w-[25%] mt-6 ml-36 object-contain " src={yourStatsLogo}/>
                        </Link>
                    </div>
                    <div>
                        <Link to={MENTALHEALTH}>
                            <Image className="w-[25%] ml-96 mt-36 mb-4 object-contain " src={campfireLogo}/>
                        </Link>
                    </div>
                    <div>
                        <Link to={PROFILE}>
                            <Image className=" w-[23%] mt-36 ml-36 mb-4 object-contain" src={profileLogo}/>
                        </Link>
                    </div>
            </div>
        </div>
    )
}