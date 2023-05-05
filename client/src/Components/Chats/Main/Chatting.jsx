import React,{useContext, useEffect,useState} from 'react'
import Display from './Display'
import Info from './Info'
import io from 'socket.io-client'
import './Main.css'
import { UserID, uId } from '../../../App'
import { useLocation } from 'react-router-dom'
const socket=io('https://chatmate-backend.onrender.com',{autoConnect: true,transports: ['websocket']});
let userId;
let arr=[];
let userdata={username:"harsh",pic:""};
const Chatting = ({change,user}) => { 
  const [userDetails,setDetails]=useState({username:"harsh",pic:""});
  const [chats,setChats]=useState([]);
  const [check,setCheck]=useState(true);
  const [chatload,setLoad]=useState(false);
  const location=useLocation();
  const [userdd,setUid]=useState("");

  const getID = async () => {
    const res = await fetch("/getID", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
 
    const data = await res.json();
    let check=false;
    if(data.cookies){
        check=true;
    }
 
    if(check){
      userId=data.cookies.uniqueId;
      setUid(data.cookies.uniqueId);
    }
 }


  useEffect(() => {
    if(change){
      setCheck(true)
    }
    if(location.state && location.state.data){
      userdata=location.state.data;
      setDetails(userdata)
      getMsg(userId,userdata.username)
    }
    getID();
    socket.connect();
    console.log("connet")
    socket.emit('AddRoom');
    return () => {
           socket.disconnect();
      };
},[])

// useEffect(()=>{
//   if(location.state && location.state.data){
//     userdata=location.state.data;
//     setDetails(userdata)
//     getMsg(userId,userdata.username)
//   }
 
// },[location])

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
console.log(info.msg)
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
console.log(info.json)
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
arr=info.msg;
// alert("change")
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
         arr.push(data);
         setChats(arr);
         console.log(arr)
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
          arr.push(data);
          setChats(arr);
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