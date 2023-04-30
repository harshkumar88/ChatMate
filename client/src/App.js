import React,{useState,useEffect, createContext} from "react";
import { Routes,Route } from "react-router-dom";
import Chat from "./Components/Chats/Chat.jsx";
import Chatting from "./Components/Chats/Main/Chatting.jsx";
import Form from "./Components/Authentication/Form.js";
import Forget from "./Components/Authentication/Forget.js";
import Adduser from "./Components/Chats/AddCreate/Adduser.js";
import Home from "./Components/HomePage/Home.jsx";
import Notifications from "./Components/NotificationPage/Notifications.jsx";
//Given All Routes here"
export const PortNo=createContext();
function App() {
  const [port,setport]=useState();
  const getPort=async()=>{
    const res = await fetch("/getPort", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    });
    const data=await res.json();
    setport(data.port);
  }
    useEffect(()=>{
         getPort();
    },[])
  return (
    <PortNo.Provider value={port}>
    <div>
    <Routes>
      <Route exact path="/" element={<Home/>}/>
      <Route exact path="/Form" element={<Form/>}/>
      <Route exact path='/Chat' element={<Chat/>}/>
      <Route exact path='/Chatting' element={<Chatting/>}/>
      <Route exact path='/forget' element={<Forget/>}/>
      <Route exact path='/Adduser' element={<Adduser/>}/>
      <Route exact path='/Notifications' element={<Notifications/>}/>
    </Routes>
    </div>
    </PortNo.Provider>
  );
}

export default App;
