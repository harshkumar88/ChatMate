import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import io from 'socket.io-client'
import './Adduser.css'
import icon from './Images/icon.png'
import { UserID } from '../../../App';
let FixeduserList;
let uid;
const socket=io('https://chatmate-backend.onrender.com',{autoConnect: false,transports: ['websocket']});
const userId=sessionStorage.getItem("userId")
const Adduser = () => {
    const navigate = useNavigate();
    const [change, setChange] = useState(false);
    const [loading, setLoading] = useState(true);

    const [list, setlist] = useState([]);
    const [users, setUsers] = useState([]);
    const [fId,setFid]=useState();         
    const setWidth = () => {
        const w = window.innerWidth
        if (w < 600) {
            setChange(true);
        }
        else {
            setChange(false)
        }
    }

    
    useEffect(()=>{
        socket.connect();
        setWidth();
        getAllUsers(userId);
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
                getAllUsers(message);
            }
          });
          return () => {
            socket.off('broadcast');
          };
    },[socket])

    const getAllUsers = async (id) => {
        const res = await fetch("/getAllUsers", {
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
        const users = data.users;
        FixeduserList = users;
        setUsers(users);
    }
    
   

//Sent Notifications
   const NotificationSent=async(Id)=>{
        setFid(Id);
        const AddNotification= await fetch("/SendNotification", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: userId,
                FriendId:Id
            })
        });
        const info=await AddNotification.json();
        getAllUsers(userId);
        toast('Notification Sent', {
            position: 'top-right',
            autoClose: 2000,
           
          })
          await socket.emit('message', Id);
    }


    window.onresize = function () {
        setWidth()
    }
  

    const userAdded = () => {
        console.log("User" + list)
        navigate("/Chat")
        sessionStorage.setItem("userList", JSON.stringify(list));
    }

    const changeUserList = (name) => {
        const newUserList = FixeduserList.filter((ele) => {
            let s = ele.username;
            let len = name.length;
            let st = s.substring(0, len);
            return st == name;
        })
        setUsers(newUserList)
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
                        <h2 className='ForgetHeader pt-3  border-bottom border-dark'>Add User</h2>
                        <div className='mx-auto w-100 text-center bg-light p-1' style={{ zIndex: 2 }}><input className='form-control w-75 mx-auto' placeholder='Search User' onChange={(e) => changeUserList(e.target.value)} /></div>
                        {loading==false?<div style={{ height: "auto", maxHeight: "400px", overflow: "scroll" }} >
                            {users.length>0?users.map((ele, id) => {
                                return (
                                    <div className='d-flex mt-3 bg-light p-3' key={id} style={{ cursor: 'pointer' }}>
                                        <div className='setImage ms-2'>
                                        <img src={icon} alt="icon" style={{borderRadius:"50%"}}/>
                                        </div>
                                        <div className=' ms-3'>
                                            <span className='text-dark'>{ele.username}</span>
                                        </div>
                                        <div className=' ms-auto'>
                                        <div className='sizeIcon bg-light' onClick={()=>NotificationSent(ele.username)}><div className='bi bi-plus-circle-fill'></div></div>
                                        </div>
                                    </div>
                                )
                            }):<p className='text-dark pt-3'>No User Found</p>}
                        </div>:
                        <div className='p-3'>
                        <div className="loader">
                        <div className="inner one"></div>
                        <div className="inner two"></div>
                        <div className="inner three"></div>
                      </div>
                      </div>
                    }
                        <div className='w-100 mb-1'><button style={{ width: "47%" }} onClick={() => userAdded()}>Chat Page</button></div>

                    </div>

                </div>
            </div>

            <ToastContainer className="my-toast-container"/>

        </div>
    )
}

export default Adduser
