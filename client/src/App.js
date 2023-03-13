import React,{useState,useEffect} from "react";
import { Routes,Route } from "react-router-dom";

import Chat from "./Components/Chats/Chat.jsx";
import Chatting from "./Components/Chats/Main/Chatting.jsx";
import Form from "./Components/Authentication/Form.js";

function App() {
  return (
    <div>
    <Routes>
      <Route exact path="/Form" element={<Form/>}/>
      <Route exact path='/' element={<Chat/>}/>
      <Route exact path='/Chatting' element={<Chatting/>}/>
>>>>>>> 3b280f2150adc7e0a2c87c611631068b4cdca692
    </Routes>
    </div>
  );
}

export default App;
