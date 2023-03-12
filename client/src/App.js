import React,{useState,useEffect} from "react";
import { Routes,Route } from "react-router-dom";

import Chat from "./Components/Chats/Chat.jsx";
import Chatting from "./Components/Chats/Main/Chatting.jsx";
import Form from "./Components/Authentication/Form.js";

function App() {
  return (
    <div>
    <Routes>
<<<<<<< HEAD
     <Route exact path='/' element={<Form/>}/>
=======
      <Route exact path="/Form" element={<Form/>}/>
     <Route exact path='/' element={<Chat/>}/>
>>>>>>> b16eb255d56a241873bf8a52c1194dfe8fa3256a
     <Route exact path='/Chatting' element={<Chatting/>}/>
    </Routes>
    </div>
  );
}

export default App;
