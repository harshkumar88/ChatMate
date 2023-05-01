import React,{useContext, useEffect,useState} from 'react'
import Display from './Display'
import Info from './Info'
import io from 'socket.io-client'
import './Main.css'
import { UserID } from '../../../App'
const socket=io('http://localhost:5000',{autoConnect: false,transports: ['websocket']});
const Chatting = ({change}) => { 
  const userId=useContext(UserID)
  const [userDetails,setDetails]=useState({username:"harsh",pic:""});
  useEffect(() => {
    socket.connect();
    console.log("connet")
    socket.emit('AddRoom');
    return () => {
       socket.disconnect();
    };
},[])

const saveMsg=async()=>{
     
}

useEffect(()=>{
    socket.on("getuserDetails",(data)=>{
      setDetails(data)
      // console.log("chatting",data)
    })
    socket.on("getMessage",(data)=>{
      if(data.userId==userId || data.FriendId==userDetails.username){
         saveMsg(data);
      }
      console.log(data)
    })
},[socket])
   
  return (
    <div className={change==false?'bg-light w-75 heightMIn':'bg-light w-100 heightMIn'}>
    <Info userdata={userDetails}/>
    <div className='d-flex flex-column justify-content-between heightDisplay'>
    <Display change={change} userId={userId} FriendId={userDetails.username}/>
    </div>
    </div>
  )
}

export default Chatting