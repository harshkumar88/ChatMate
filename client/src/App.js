import React,{useState,useEffect} from "react";
import { Routes,Route } from "react-router-dom";
import Form from "./Components/Authentication/Form.js";
import Chat from "./Components/Chats/Chat.jsx";
import Chatting from "./Components/Chats/Main/Chatting.jsx";

function App() {
  return (
    <div>
    <Routes>
     <Route exact path='/' element={<Form/>}/>
     <Route exact path='/Chatting' element={<Chatting/>}/>
    </Routes>
    </div>
  );
}

export default App;
