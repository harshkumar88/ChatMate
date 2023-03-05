import React, { useState } from 'react'
import './Form.css'
const Login = () => {

    const [formData, setData] = useState({
        username: "",
        email: "",
        password: ""
    });

    const getData = (e) => {
        const { name, value } = e.target;
        setData({ ...formData, [name]: value });
    }
    
    const loginUser=async(e)=>{
        e.preventDefault();
        const {username,email,password}=formData;
        const res=await fetch("/LoginData",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
               username,email,password
                })
        })
        const data=await res.json();
        console.log(data)
        if(data.error==="passwordincorrect"){
            alert("Password Incorrect")
        }
        else if( data.error==="UserNotFound"){
           alert("User Not Found");
        }
        else{
            alert("Successfull Login")
            setData({username:"",email:"",password:""})

           alert("successfull login")
        }
    
   
     return ;
    }
    return (
        <div>
            <form onSubmit={loginUser}>
                <label htmlFor="chk" aria-hidden="true">
                    Login
                </label>
                <div className='w-75 mx-auto'>
                    <input
                        type="text"
                        name="username"
                        placeholder="User name"
                        required
                        className='form-control'
                        value={formData.username}
                        onChange={getData}
                    />
                </div>
                <div className='w-75 mx-auto'>
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
                <div className='w-75 mx-auto'>
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
                <button>Login</button>
            </form></div>
    )
}

export default Login