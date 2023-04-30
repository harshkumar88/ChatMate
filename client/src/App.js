import React,{useState,useEffect, createContext} from "react";
import { Routes,Route } from "react-router-dom";
import Chat from "./Components/Chats/Chat.jsx";
import Chatting from "./Components/Chats/Main/Chatting.jsx";
import Form from "./Components/Authentication/Form.js";
import Forget from "./Components/Authentication/Forget.js";
import Adduser from "./Components/Chats/AddCreate/Adduser.js";
import Home from "./Components/HomePage/Home.jsx";
import Notifications from "./Components/NotificationPage/Notifications.jsx";
import io from 'socket.io-client'
//Given All Routes here"
export const UserID=createContext();
export const SocketIO=createContext();
//'https://chatmate-backend.onrender.com'

function App() {
  const [userId,setId]=useState();
  const [socket,setSocket]=useState(io('http://localhost:5000',{transports: ['websocket']}))
  const getID = async () => {
    const res = await fetch("/getID", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })

    const data = await res.json();
    setId(data.cookies.uniqueId);
  }

  useEffect(() => {
    getID();
    const newSocket = io('http://localhost:5000',{autoConnect: false,transports: ['websocket']});
    newSocket.connect();
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(()=>{
    console.log(socket)
    socket.on("connected",()=>{
      console.log("chatting")
    })
    socket.on("getuserDetails",(data)=>{
      console.log("chatting",data)
    })
},[socket])


  return (
    <UserID.Provider value={userId}>
    <SocketIO.Provider value={socket}>
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
    </SocketIO.Provider>
    </UserID.Provider>
  );
}

export default App;
