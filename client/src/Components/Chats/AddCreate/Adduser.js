import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Adduser.css'
import Swal from 'sweetalert2'
import { uniqueId } from '../../Authentication/Login'
import icon from './Images/icon.png'
let FixeduserList;

const Adduser = () => {
  
    const [userId, setUserId] = useState();
    const navigate = useNavigate();
    const [change, setChange] = useState(false);
    const [loading, setLoading] = useState(true);

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

    

    const getAllUsers = async (id) => {
        // console.log(userId)
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

    const getID = async () => {
        const res = await fetch("/getID", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })

        const data = await res.json();
        console.log(data.cookies)
        setUserId(data.cookies.uniqueId)
        getAllUsers(data.cookies.uniqueId);
    }

//Sent Notifications
   const NotificationSent=async(Id)=>{
        //   console.log(Id,userId)
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
        console.log(info.msg)
        getAllUsers(userId);
        toast('Notification Sent', {
            position: 'top-right',
            autoClose: 2000,
           
          })

    }

    window.onresize = function () {
        setWidth()
    }
    useEffect(() => {
        setWidth();
        getID();
        
        
    }, [])


    const UserList = (ele) => {
        setlist([...list, ele]);

    }

    const DeleteList = (ele) => {

        const arr = list.filter((el) => {
            return ele != el;
        })
        setlist(arr);
    }

    const userAdded = () => {
        console.log("User" + list)
        navigate("/Chat")
        sessionStorage.setItem("userList", JSON.stringify(list));
    }

    const groupAdded = () => {
        console.log("Group" + list)
        navigate("/Chat")
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