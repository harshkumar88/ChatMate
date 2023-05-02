import React,{useContext, useEffect,useState} from 'react'
import Display from './Display'
import Info from './Info'
import io from 'socket.io-client'
import './Main.css'
import { UserID } from '../../../App'
const socket=io('https://chatmate-backend.onrender.com',{autoConnect: false,transports: ['websocket']});
const userId=sessionStorage.getItem("userId")
const Chatting = ({change}) => { 
  const [userDetails,setDetails]=useState({username:"harsh",pic:""});
  useEffect(() => {
    socket.connect();
    console.log("connet")
    socket.emit('AddRoom');
    return () => {
       socket.disconnect();
    };
},[])

const saveMsg=async(data,Info)=>{
    //  console.log(data)
  const res = await fetch("/saveMsg", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
          data,Info
    })
});

const info=await res.json();
console.log(info.msg)
}

useEffect(()=>{
    socket.on("getuserDetails",(data)=>{
      if(data.userId==userId)
            setDetails(data)
    })
    socket.on("getMessage",(data)=>{
      if(data.userId==userId){
         saveMsg(data,{uid:data.userId,Fid:data.FriendId});
         saveMsg({...data,uid:data.FriendId,Fid:data.userId});
      }
      if(data.FriendId==userId){
            
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