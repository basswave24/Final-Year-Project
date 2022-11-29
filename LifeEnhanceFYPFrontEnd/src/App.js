import './App.css';
import {Routes, Route, BrowserRouter} from "react-router-dom";
// Import the functions you need from the SDKs you need
import Homepage from './pages/Homepage'
import * as ROUTES from "./constants/Routes";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import Dashboard from "./pages/Dashboard";
import Goals from "./pages/Goals"
import Profile from "./pages/Profile";
import PhysicalHealth from "./pages/PhysicalHealth";
import MentalHealth from "./pages/MentalHealth";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries



function App() {
    return (
        <>
            <Routes>
                <Route path={ROUTES.HOMEPAGE} element = {<Homepage></Homepage>}></Route>
                <Route path={ROUTES.DASHBOARD} element = {<Dashboard></Dashboard>}></Route>
                <Route path={ROUTES.GOALS} element = {<Goals></Goals>}></Route>
                <Route path={ROUTES.MENTALHEALTH} element = {<MentalHealth></MentalHealth>}></Route>
                <Route path={ROUTES.PHYSICALHEALTH} element = {<PhysicalHealth></PhysicalHealth>}></Route>
                <Route path={ROUTES.PROFILE} element = {<Profile></Profile>}></Route>
            </Routes>
        </>
    );
}

export default App;
