import React,{useContext, useEffect,useState} from 'react'
import Display from './Display'
import Info from './Info'
import io from 'socket.io-client'
import './Main.css'
import { UserID } from '../../../App'
const socket=io('https://chatmate-backend.onrender.com',{autoConnect: false,transports: ['websocket']});
const userId=sessionStorage.getItem("userId");
let arr=[];
const Chatting = ({change}) => { 
  const [userDetails,setDetails]=useState({username:"harsh",pic:""});
  const [chats,setChats]=useState([]);
  const [check,setCheck]=useState(true);
  useEffect(() => {
    socket.connect();
    console.log("connet")
    socket.emit('AddRoom');
    
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
// console.log(info.msg)
getMsg(data.sender,data.reciever);
}

const getMsg=async(sender,reciever)=>{
         
  const res = await fetch("getChat", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
          sender,reciever
    })
});

const info=await res.json();
setChats(info.msg);
setCheck(false);
}

useEffect(()=>{
    socket.on("getuserDetails",(data)=>{
      if(data.userId==userId)
            setDetails(data)
            getMsg(userId,data.username)
     })
    socket.on("getMessage",(data)=>{
      if(data.sender==userId){
         saveMsg(data,{uid:data.sender,Fid:data.reciever});
         saveMsg(data,{uid:data.reciever,Fid:data.sender});
      }
      if(data.reciever==userId){
            getMsg(data.reciever,data.sender);
      }
    })
},[socket])
   
  return (
    <div className={change==false?'bg-light w-75 heightMIn':'bg-light w-100 heightMIn'}>
    <Info userdata={userDetails}/>
    <div className='d-flex flex-column justify-content-between heightDisplay'>
    <Display change={change} userId={userId} FriendId={userDetails.username} arr={chats} check={check}/>
    </div>
    </div>
  )
}

export default Chatting