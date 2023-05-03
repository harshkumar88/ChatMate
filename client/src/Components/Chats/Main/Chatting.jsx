import React,{useContext, useEffect,useState} from 'react'
import Display from './Display'
import Info from './Info'
import io from 'socket.io-client'
import './Main.css'
import { UserID } from '../../../App'
const socket=io('https://chatmate-backend.onrender.com',{autoConnect: true,transports: ['websocket']});
const userId=sessionStorage.getItem("userId");
let arr=[];
let userdata={username:"harsh",pic:""};
const Chatting = ({change}) => { 
 
  const [userDetails,setDetails]=useState({username:"harsh",pic:""});
  const [chats,setChats]=useState([]);
  const [check,setCheck]=useState(true);
  const [chatload,setLoad]=useState(false);
  useEffect(() => {
       socket.connect();
    console.log("connet")
    socket.emit('AddRoom');
    return () => {
           socket.disconnect();
      };
},[])

const saveMsg1=async(data,Info)=>{
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
return info;
}


// const saveMsg2=async(data,Info)=>{
//   //  console.log(data)
// const res = await fetch("/saveMsg", {
//   method: "POST",
//   headers: {
//       "Content-Type": "application/json"
//   },
//   body: JSON.stringify({
//         data,Info
//   })
// });

// const info=await res.json();
// getMsg(Info.uid,Info.Fid);
// }



const saveMsg3=async(data,Info)=>{
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
return info;
}

const getMsg=async(sender,reciever)=>{
        console.log(sender,reciever)
        
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
arr=info.msg
setChats(info.msg);
setCheck(false);
setLoad(false)
}

useEffect(()=>{
    socket.on("getuserDetails",(data)=>{
      console.log(data)
      if(data.userId==userId){
          userdata=data
          setDetails(data)
          setLoad(true)
          getMsg(userId,data.username)
          
    }
     })
    socket.on("getMessage",async(data)=>{
      let resp;
      if(data.sender==userId){
         const res=await saveMsg1(data,{uid:data.sender,Fid:data.reciever});
         if(res)
             resp=await saveMsg3(data,{uid:data.reciever,Fid:data.sender});

             if(data.reciever==userId){
              console.log("hiii",resp)
              if(resp)
                 getMsg(data.reciever,data.sender);
             }
      }
      else{
        if(data.reciever==userId){
          let resp=await saveMsg3(data,{uid:data.reciever,Fid:data.sender});
          console.log("hiii");
          if(resp)
             getMsg(data.reciever,data.sender);
         }
      }
      
    })
},[socket])
   
  return (
    <div className={change==false?'bg-light w-75 heightMIn':'bg-light w-100 heightMIn'}>
    <Info userdata={userdata}/>
    <div className='d-flex flex-column justify-content-between heightDisplay'>
    <Display change={change} userId={userId} FriendId={userDetails.username} arr={arr} check={check} chatload={chatload}/>
    </div>
    </div>
  )
}

export default Chatting