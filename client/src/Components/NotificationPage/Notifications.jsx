import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import io from 'socket.io-client'
import './Notifications.css'
import Swal from 'sweetalert2'
import { uniqueId } from '../Authentication/Login'
import icon from './Images/icon.png'
import { UserID, uId } from '../../App';
let FixeduserList;
const socket=io('https://chatmate-backend.onrender.com',{autoConnect: false,transports: ['websocket']});
let userId;
const Notifications = () => {
    const navigate = useNavigate();
    const [change, setChange] = useState(false);
    const [loading, setLoading] = useState(true);
    const [user,setUid]=useState("");
    const [notifi,setNotifi]=useState(false);

    const [list, setlist] = useState([]);
    const [users, setUsers] = useState([]);
    const setWidth = () => {
        const w = window.innerWidth
        if (w < 600) {
            setChange(true);
        }
        else {
            setChange(false)
        }
    }

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
       
    useEffect(()=>{       
        getID();
        socket.connect();
        setWidth();
        getAllNotifications(userId);
        socket.emit('AddRoom');
        return () => {
           socket.disconnect();
        };
    },[])

    useEffect(()=>{
        socket.on('NotificationSent', function (message) {
            console.log('Message from server:', message+" ->"+userId);
            if(message==userId){
                console.log("hii")
                getAllNotifications(message);
            }
          });
          return () => {
            socket.off('broadcast');
          };
    },[socket])

    const getAllNotifications = async (id) => {
        // console.log(userId)
        const res = await fetch("/getAllNotifications", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                uniqueId: id
            })
        })

        const data = await res.json();
       
        if (data) {
            setLoading(false);
        }
        // console.log(loading)
        const users = data.users;
        FixeduserList = users;
        //  console.log(FixeduserList);
        setUsers(users);
        //  console.log(users)
        
        setNotifi(false);
    }

//Accepted Notifications
const Accepted=async(Id)=>{
    setNotifi(true);
    const Accepted= await fetch("/Accepted", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userId: userId,
            FriendId:Id
        })
    });
    const info=await Accepted.json();
  
    getAllNotifications(userId);
    toast('User Added', {
        position: 'top-right',
        autoClose: 2000,
       
      })
       socket.emit('message', Id);

}
const Rejected=async(Id)=>{
    setNotifi(true);
  const Rejected= await fetch("/Rejected", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
          userId: userId,
          FriendId:Id
      })
  });
  const info=await Rejected.json();
  
  getAllNotifications(userId);
  toast('Request Deleted', {
      position: 'top-right',
      autoClose: 2000,
     
    })
 
    socket.emit('message', Id);

}
   
    window.onresize = function () {
        setWidth()
    }
    

    return (
        <div className="App container-fluid areaApp">
            <ul className="circles">
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </ul>


            <div className={change == false ? " outerWidth d-flex justify-content-center align-items-center" : " d-flex justify-content-center align-items-center outerWidth2"} >

                <div className="mainForget mx-auto innerWidth" style={{ height: "auto" }} >


                    <div className="signup d-flex flex-column" style={{ height: "auto", maxHeight: "500px" }} >
                        <h2 className='ForgetHeader pt-3  border-bottom border-dark'>Notifications</h2>
                        {/* <div className='mx-auto w-100 text-center bg-light p-1' style={{ zIndex: 2 }}><input className='form-control w-75 mx-auto' placeholder='Search User' onChange={(e) => changeUserList(e.target.value)} /></div> */}
                        {loading==false?<div style={{ height: "auto", maxHeight: "400px", overflow: "scroll" }} >
                            {users.length>0 && notifi==false?users.map((ele, id) => {
                                return (
                                    <div className='d-flex mt-3 bg-light p-3' key={id} style={{ cursor: 'pointer' }}>
                                        <div className='setImage ms-2'>
                                        <img src={icon} alt="icon" style={{borderRadius:"50%"}}/>
                                        </div>
                                        <div className=' ms-3'>
                                            <span className='text-dark'>{ele}</span>
                                        </div>
                                       
                                        <div className='sizeIcon bg-light d-flex w-25 ms-auto' >
                                           
                                            <div className='bi bi-person-fill-check' onClick={()=>Accepted(ele)}></div>
                                            <div className="bi bi-person-x-fill ms-3" onClick={()=>Rejected(ele)}></div> </div>
                                        </div>
                                    
                                )
                            }):notifi?<p className='text-dark pt-3'>Wait pls ...</p>:<p className='text-dark pt-3'>No Notifications yet</p>}
                        </div>:
                        <div className='p-3'>
                        <div className="loader">
                        <div className="inner one"></div>
                        <div className="inner two"></div>
                        <div className="inner three"></div>
                      </div>
                      </div>
                    }
                    <div className='w-100 mb-1'><button style={{ width: "47%" }} onClick={()=>navigate("/Chat")}>Chat Page</button></div>

                    </div>

                </div>
            </div>

            <ToastContainer className="my-toast-container"/>

        </div>
    )
}

export default Notifications