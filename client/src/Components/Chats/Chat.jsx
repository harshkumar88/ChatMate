import React,{useState,useEffect} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import SidebarChat from './SideBar/SidebarChat'
import Chatting from './Main/Chatting';
import { useLocation } from 'react-router-dom';

const Chat = () => {

  const [change, setChange] = useState(false);
  const location=useLocation();

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

  useEffect(() => {
    setWidth();   
  }, [])

  return (
    <div>
   {change==false?
    <div className='d-flex'>
     <SidebarChat change={change}/>
     <Chatting change={change}/>
    </div>
    :<div><SidebarChat change={change}/></div>}

    </div>
  )
}

export default Chat