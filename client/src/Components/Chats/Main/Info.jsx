import React, { useEffect,useState} from 'react'
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import './info.css'

const Info = ({userdata}) => { 
    const navigate = useNavigate();
    const logout=async()=>{
        Swal.fire({
            title: 'Are you sure?',
            text: "You want's to Logout.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, do it!'
          }).then((result) => {
            if (result.isConfirmed) {
                localStorage.clear("userId");
              Swal.fire(
                'Logout!',
                'You are Logout.',
                'success'
              ).then(()=>{
                navigate("/Form")
              })
             
            }
          })
    }

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
           
            <div className='mt-3 d-flex log'> <div className='mx-2'> <i className="bi bi-box-arrow-right pointer " onClick={logout}></i></div>
            <span className='tooltiptxt1'>Logout</span>
             </div>
        </div>
    )
}

export default Info