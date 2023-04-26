import React, { useState, useEffect, createContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import SidebarChat from './SideBar/SidebarChat'
import Chatting from './Main/Chatting';
import { useLocation } from 'react-router-dom';
import io from 'socket.io-client'
export  const uniqueId=createContext();

const URL = "http://localhost:5000";
const socket = io(URL, { autoConnect: false });
const Chat = () => {

  const [change, setChange] = useState(false);
  const location = useLocation();
  const [userId,setUserId]=useState();

  const setWidth = () => {
    const w = window.innerWidth
    if (w < 600) {
      setChange(true);
    }
    else {
      setChange(false)
    }
  }

  window.onresize = function () {
    setWidth()
  }

  const getID = async () => {
    const res = await fetch("/getID", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    })

    const data=await res.json();
    setUserId(data.cookies.email)    
  }

  useEffect(() => {
    setWidth();
    getID();
    socket.emit('AddRoom');
  }, [])

  return (
    <uniqueId.Provider value={userId}>
    <div>
      {change == false ?
        <div className='d-flex'>
          <SidebarChat change={change} />
          <Chatting change={change} />
        </div>
        : <div><SidebarChat change={change} /></div>}

    </div>
    </uniqueId.Provider>
  )
}

export default Chat