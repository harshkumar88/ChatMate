import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Adduser.css'
import Swal from 'sweetalert2'
import { uniqueId } from '../../Authentication/Login'
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
                email: id
            })
        })

        const data = await res.json();
        if (data) {
            setLoading(false);
        }
        // console.log(loading)
        const users = data.users;
        FixeduserList = users;
        setUsers(users);
        //  console.log(users)
    }

    const getID = async () => {
        const res = await fetch("/getID", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })

        const data = await res.json();
        setUserId(data.cookies.email)
        getAllUsers(data.cookies.email);
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
        // Swal.fire({
        //     title: `Do you want to add ${ele}?`,
        //     showDenyButton: true,
        //     confirmButtonText: 'Save',
        //     denyButtonText: `Don't save`,
        //   }).then((result) => {
        //     /* Read more about isConfirmed, isDenied below */
        //     if (result.isConfirmed) {
        //       Swal.fire(`User ${ele} Added!`, '', 'success')
        //     } else if (result.isDenied) {
        //       Swal.fire(`User ${ele} not Added`, '', 'info')
        //     }
        //   })
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
                                        <div style={{ backgroundImage: 'url("https://th.bing.com/th/id/OIP.OmZtZd_CsC1JImAaVjEZUwHaFj?pid=ImgDet&rs=1")' }} className='setImage ms-2'>
                                        </div>
                                        <div className=' ms-3'>
                                            <span className='text-dark'>{ele.username}</span>
                                        </div>
                                        <div className=' ms-auto'>
                                        <div className='sizeIcon bg-light' onClick={()=>NotificationSent(ele.email)}><div className='bi bi-plus-circle-fill'></div></div>
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
                        <div className='w-100 mb-1'><button style={{ width: "47%" }} onClick={() => userAdded()}>Add Users</button> <button className='w-50' onClick={() => groupAdded()}>Create Group</button></div>

                    </div>

                </div>
            </div>

            <ToastContainer className="my-toast-container"/>


        </div>
    )
}

export default Adduser