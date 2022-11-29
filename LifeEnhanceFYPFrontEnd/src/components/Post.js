import React from "react";
import {ToastContainer,toast} from "react-toastify";



export default function Post({postKey,post,author}){


    return (
        <div className>
            <ToastContainer></ToastContainer>
            <div className="overflow-y-auto pl-2 border-[5px] border-amber-900 w-[56vh] ml-2 mt-2 h-36 rounded-lg  border-4 bg-amber-100">
                <p key={postKey} className="text-2xl font-bold">{author} is grateful for: </p><label className=" break-words text-[18px] ">{post}</label>
            </div>
        </div>)

}