import React, { useEffect,useState} from 'react'
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom'

const Info = ({userdata}) => { 
    const navigate = useNavigate();
    const logout=async()=>{
        // const data= await fetch("http://localhost:5000/logout", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json"
        //     }

        // });
        // const res=await data.json();
        // console.log(res)
        const al=Cookies.remove('jwt');
        console.log(al)
        navigate("/Form")
    }

    return (
        <div className='p-3 mx-2 d-flex justify-content-between'>
            <div className="d-flex">
            <div style={userdata.pic=="" || userdata.pic==undefined?{backgroundImage: "url('https://img.icons8.com/ultraviolet/512/user.png')"}:{ backgroundImage: `url(${userdata.pic})` }} className='setImage mr-3 mt-2'>
            </div>
                <div className=' mx-3'>
                    <span style={{ display: "block" }}>{userdata.username}</span>
                   
                </div>
            </div>
            <div className='mt-3 d-flex'> <div className='mx-2'> <i className="bi bi-box-arrow-right" onClick={logout}></i></div> </div>
        </div>
    )
}

export default Info