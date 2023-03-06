import React, { useState } from 'react'
import './Form.css'
import Swal from 'sweetalert2'

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
            Swal.fire('Not an Authentic User')
        }
        else if( data.error==="UserNotFound"){
           Swal.fire("User Not Found");
        }
        else{
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Login Successfully',
                showConfirmButton: false,
                timer: 1500
              })
            setData({username:"",email:"",password:""})
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