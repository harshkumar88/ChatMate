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
                <div className='w-75 mt-5 mx-auto'>
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
                <div className='w-75 mt-3 mx-auto'>
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

                <button className='mt-3'>Login</button>
            </form>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-google"
                viewBox="0 0 16 16"
            >
                <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
            </svg>
            </div>
    )
}

export default Login