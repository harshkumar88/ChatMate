import React, { useEffect,useState} from 'react'
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import io from 'socket.io-client'
import './info.css'
let userId;
const socket = io('https://chatmate-backend.onrender.com', { autoConnect: true, transports: ['websocket'] });
const Info = ({userdata}) => { 
    const navigate = useNavigate();
    
    const getID = async () => {
        const res = await fetch("/getID", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          }
        })
    
        const data = await res.json();
        let check = false;
        if (data.cookies) {
          check = true;
        }
    
        if (check) {
          userId = data.cookies.uniqueId;
        }
      }
    
    const deleteChat= (friendid)=>{
        Swal.fire({
            title: 'Are you sure?',
            text: `You want to delete chats?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, do it!'
          }).then(async(result) => {
            if (result.isConfirmed) {
              socket.emit("deleteAllChat",userId,friendid);
            }
          })
        
        
      
    }
    useEffect(()=>{
        getID();
    })
    

    return (
        <div className='p-3 mx-2 d-flex justify-content-between'>
            <div className={userdata.username=="DontSee123"?"dontsee d-flex":"d-flex"}>
            <div style={userdata.pic=="" || userdata.pic==undefined?{backgroundImage: "url('https://img.icons8.com/ultraviolet/512/user.png')"}:{ backgroundImage: `url(${userdata.pic})` }} className='setImage mr-3 mt-2'>
            </div>
                <div  className='mx-3'>
                    <span style={{ display: "block",fontWeight:"bold",fontVariant:"all-small-caps" }}>{userdata.username}</span>
                     let's chat
                </div>
            </div>
            <div onClick={()=>{deleteChat(userdata.username)}} style={{cursor:"pointer",paddingTop:"10px",fontSize:'20px'}}><i className="bi bi-trash"></i></div>
           
        </div>
    )
}

export default Info