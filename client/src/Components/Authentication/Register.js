import React,{useState} from 'react'
import './Form.css'
import Swal from 'sweetalert2'



const Register = () => {
    // console.log(c)
    
    const [formData,setData]=useState({
        username:"",
        email:"",
        password:"",
        confirmpass:"",
        pic:""
    });
    const [file,setFile]=useState();

    const getData=(e)=>{
         const {name,value}=e.target;
         setData({...formData,[name]:value});
    }
    const getPic=async(e)=>{
          const file=e.target.files[0];
          if(file.type==="image/jpeg" || file.type==="image/png" || file.type==="image/jpg"){
            const formdata=new FormData();
            formdata.append('myImage',file);
            const res=await fetch("/upload-image",{
                method:"post",
                body:formdata
            });

            const data=await res.json();
            const img=data.url
            setData({...formData,pic:img});
            setFile(img);
          }
    }

    const registerUser= async(e)=>{
        e.preventDefault();
        const {username,email,password,confirmpass,pic}=formData;
        if(password!==confirmpass){
            Swal.fire('Password Must be Same')
           return;
        }
        
        const res=await fetch("/registerData",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
               username,email,password,confirmpass,pic
           })
        })
        const data=await res.json();
        
        if(data.error==="emailrejected"){
            Swal.fire('Inavalid email')
        }
        else if(data.error==="UserExist"){
            Swal.fire('User Already Exist')
        }
        else if(data.error==="passwordrejected"){
            Swal.fire("Your Password must be in Format eg. Abc12@ min 8 chars ")
       }
        else{
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Succesfully Registered',
                showConfirmButton: false,
                timer: 1500
              })
            setData({username:"",email:"",password:"",confirmpass:""})
            document.getElementById("labelClick").click();
            
        }
    
    
     return ;
          
    }

    return (
        <div>
        <form onSubmit={registerUser}>
            <label htmlFor="chk" aria-hidden="true" id="labelClick">
                Sign Up
            </label>
            <div className='w-75 mt-5 mx-auto '>
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
                    required
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
            <div className='w-75 mt-3 mx-auto'>
                <input
                    type="password"
                    name="confirmpass"
                    placeholder="ConfirmPassword"
                    required
                    className='form-control'
                    value={formData.confirmpass}
                    onChange={getData}
                />
            </div>

            <div className='w-75 mt-3 mx-auto'>
            <input
                type="file"  
                className='form-control'
                onChange={getPic}   
                     
            />
        </div>
            <button className='mt-3'>Sign up</button>
            
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
            </svg></div>
    )
}

export default Register