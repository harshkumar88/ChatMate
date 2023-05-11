import React, { useEffect,useState} from 'react'
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import './info.css'

const Info = ({userdata}) => { 
    const navigate = useNavigate();
   

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
           
        </div>
    )
}

export default Info