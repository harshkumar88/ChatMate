import React,{useState,useEffect, createContext} from "react";
import { Routes,Route,useNavigate } from "react-router-dom";
import Chat from "./Components/Chats/Chat.jsx";
import Chatting from "./Components/Chats/Main/Chatting.jsx";
import Form from "./Components/Authentication/Form.js";
import Forget from "./Components/Authentication/Forget.js";
import Adduser from "./Components/Chats/AddCreate/Adduser.js";
import Home from "./Components/HomePage/Home.jsx";
import Notifications from "./Components/NotificationPage/Notifications.jsx";
//Given All Routes here"
export const UserID=createContext();
function App() {
  return (
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
  );
}

export default App;
