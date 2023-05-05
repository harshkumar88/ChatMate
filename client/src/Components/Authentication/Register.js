import React, { useEffect, useState } from 'react'
import './Form.css'
import Swal from 'sweetalert2'



const Register = () => {

    const [formData, setData] = useState({
        username: "",
        email: "",
        password: "",
        confirmpass: "",
        pic: ""
    });
    const [filename, setFileName] = useState("");
    const [loader, setLoader] = useState(false);
    const [loader2, setLoader2] = useState(false);
    const [allusers, setUsers] = useState([]);
    const [showUser, setshowUSer] = useState(false);
    const [datashow, setShowdata] = useState("username already taken")

    useEffect(() => {
        getUsers()
    }, [])

    const getUsers = async () => {
        const res = await fetch("/CheckUser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await res.json();
        setUsers(data.users)
    }
    const CheckUser = (e) => {
        const { name, value } = e.target;
        return allusers.indexOf(value) == -1;
    }
    const getData = (e) => {
        const { name, value } = e.target;
        if (name == "username") {
            console.log(value)
            if (value.length < 4) {
                setShowdata("min 4 chars required")
                setshowUSer(true)
            }
            else {
                if (CheckUser(e) == 1) {
                    setshowUSer(false);
                }
                else {
                    setShowdata("username already taken")
                    setshowUSer(true)
                }
            }

        }
        setData({ ...formData, [name]: value });
    }
    const getPic = async (e) => {
        setLoader(true)
        const file = e.target.files[0];
        setFileName(file.name)
        if (file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/jpg") {
            const formdata = new FormData();
            formdata.append('file', file);
            formdata.append('upload_preset', 'chatAPP')
            formdata.append("cloud_name", 'db1ihyoqu');
            const res = await fetch("https://api.cloudinary.com/v1_1/db1ihyoqu/image/upload", {
                method: "post",
                body: formdata
            });

            const data = await res.json();
            const img = data.url;
            if (img) {
                setLoader(false);
            }
            setData({ ...formData, pic: img });
        }
    }

    const registerUser = async (e) => {
        e.preventDefault();
        setLoader2(true);
        const { username, email, password, confirmpass, pic } = formData;
        if (password !== confirmpass) {
            Swal.fire('Password Must be Same')
            setLoader2(false);
            return;
        }

        const res = await fetch("/registerData", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username, email, password, confirmpass, pic
            })
        })
        const data = await res.json();

        if (data.error === "emailrejected") {
            Swal.fire('Inavalid email')
        }
        else if (data.error === "UserExist") {
            Swal.fire('User Already Exist')
        }
        else if (data.error === "passwordrejected") {
            Swal.fire("Your Password must be in Format eg. Abc12@ min 8 chars ")
        }
        else {
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Succesfully Registered',
                showConfirmButton: false,
                timer: 1500
            })

            setData({ username: "", email: "", password: "", confirmpass: "" })
            document.getElementById("labelClick").click();

        }
        setLoader2(false)

        return;

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
                        // data-toggle="tooltip" data-placement="top" title="username already exist"
                    />
                    <span className='text-danger'>{showUser ? datashow : ""}</span>
                </div>
                <div className={showUser ? 'w-75 mt-2 mx-auto' : "w-75 mt-3 mx-auto"}>
                    {showUser ?
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            required
                            className='form-control'
                            value={formData.email}
                            onChange={getData}
                            disabled
                        /> : <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            required
                            className='form-control'
                            value={formData.email}
                            onChange={getData}
                        />}
                </div>
                <div className='w-75 mt-3 mx-auto'>
                    {showUser ?
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            required
                            className='form-control'
                            value={formData.password}
                            onChange={getData}
                            disabled
                        /> : <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            required
                            className='form-control'
                            value={formData.password}
                            onChange={getData}

                        />}
                </div>
                <div className='w-75 mt-3 mx-auto'>
                {showUser?
                    <input
                        type="password"
                        name="confirmpass"
                        placeholder="ConfirmPassword"
                        required
                        className='form-control'
                        value={formData.confirmpass}
                        onChange={getData}
                        disabled
                    />: <input
                    type="password"
                    name="confirmpass"
                    placeholder="ConfirmPassword"
                    required
                    className='form-control'
                    value={formData.confirmpass}
                    onChange={getData}
                />}
                </div>

                {showUser==false?<div className='w-75 mt-3 mx-auto'>

                    {filename != "" ? <span className='text-dark'>Image Uploaded:<span className='fw-bolder text-dark'>{filename}</span></span> : <label htmlFor="imageUpload" className='form-control '>Upload Pic</label>}
                    <input type="file" id="imageUpload" accept="image/*" style={{ display: 'none' }} className='form-control'
                        onChange={getPic}></input>
                </div>:<div className='w-75 mt-3 mx-auto'>

                {filename != "" ? <span className='text-dark'>Image Uploaded:<span className='fw-bolder text-dark'>{filename}</span></span> : <label htmlFor="imageUpload" className='form-control ' style={{backgroundColor:"#e9ecef"}} >Upload Pic</label>}
                <input type="file" id="imageUpload" accept="image/*" style={{ display: 'none' }} className='form-control' disabled
                    onChange={getPic}></input>
            </div>}
                {loader == true ? <div className="loading">&#8230;</div> : <button className='mt-3' style={{ minWidth: "35%" }} >Sign up</button>}
                {loader2 == true ? <div className="loading">&#8230;</div> : ""}

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