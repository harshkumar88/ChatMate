import React,{useState,useEffect} from "react";
import { Routes,Route } from "react-router-dom";

import Chat from "./Components/Chats/Chat.jsx";
import Chatting from "./Components/Chats/Main/Chatting.jsx";
import Form from "./Components/Authentication/Form.js";
import Forget from "./Components/Authentication/Forget.js";

function App() {
  return (
    <div>
    <Routes>
      <Route exact path="/" element={<Form/>}/>
      <Route exact path='/form' element={<Chat/>}/>
      <Route exact path='/Chatting' element={<Chatting/>}/>
      <Route exact path='/forget' element={<Forget/>}/>
    </Routes>
    </div>
  );
}

export default App;
