import React,{useState,useEffect} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import SidebarChat from './SideBar/SidebarChat'
import Chatting from './Main/Chatting';

const Chat = () => {

  const [change, setChange] = useState(false);

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
   
    <div className='d-flex'>
     <SidebarChat/>
     <Chatting/>
    </div>
  )
}

export default Chat