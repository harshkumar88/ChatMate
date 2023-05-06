import React, { createContext, useState } from 'react'
import './Form.css'
import Swal from 'sweetalert2'
import { NavLink, useNavigate } from 'react-router-dom'


const Login = () => {
    
    const [formData, setData] = useState({
        email: "",
        password: ""
    });
    const [loader, setLoader] = useState(false);
    const navigate=useNavigate()
    const getData = (e) => {
        const { name, value } = e.target;
        setData({ ...formData, [name]: value });
    }

    const loginUser=async(e)=>{
        e.preventDefault();
        setLoader(true)
        const {email,password}=formData;
        const res=await fetch("/LoginData",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                email,password
                })
        })
        const data=await res.json();
        if(data.error==="notAuthorize"){
            Swal.fire('Not an Authentic User')
        }
        else if( data.error==="UserNotFound"){
           Swal.fire("User Not Found").then(()=>{
                navigate("/form")
                setData({email:"",password:""})
                document.getElementById("labelClick").click();
          
           });
           
        }
        else{
           localStorage.setItem("userId",data.userId)
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Login Successfully',
                showConfirmButton: false,
                timer: 1500
              })
             
            setData({email:"",password:""})
            setTimeout(()=>{
                navigate("/Chat")
            },1500)
           
        }
       
        setLoader(false)
          return ;
    }
    return (
       
       
        <div>
            <form onSubmit={loginUser}>
                <label htmlFor="chk" aria-hidden="true">
                    Login
                </label>
                
                <div className='w-75 mt-5 mx-auto'>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        required=""
                        className='form-control'
                        value={formData.email}
                        onChange={getData}
                    />
                </div>
                <div className='w-75 mt-3 mx-auto'>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                        className='form-control'
                        value={formData.password}
                        onChange={getData}
                    />
                </div>
                <div className='text-end w-75 mx-auto'>
                    <NavLink to='/forget' className='text-muted'> Forget Password</NavLink>
                </div>
                <button className='mt-3' style={{minWidth:"35%"}}>Login</button>
                {loader==true?<div className="loading">&#8230;</div>:""}
            </form>
            
            </div>
           
    )
}

export default Login