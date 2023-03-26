import React, { useState, useEffect } from 'react'
import {useNavigate} from 'react-router-dom'
import './Adduser.css'
import Swal from 'sweetalert2'

const Adduser = () => {
   const navigate=useNavigate();
    const [change, setChange] = useState(false);

    const [list, setlist] = useState([]);
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];

    const setWidth = () => {
        const w = window.innerWidth
        if (w < 600) {
            setChange(true);
        }
        else {
            setChange(false)
        }
    }

    window.onresize = function () {
        setWidth()
    }
    useEffect(()=>{
        setWidth()
    },[])


    const UserList = (ele) => {
        setlist([...list, ele]);
       
    }

    const DeleteList = (ele) => {

        const arr=list.filter((el)=>{
            return ele!=el;
        })
        setlist(arr);
    }

    const userAdded = () => {
        console.log("User"+list)
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
        sessionStorage.setItem("userList",JSON.stringify(list));
    }

    const groupAdded = () => {
        console.log("Group"+ list)
        navigate("/Chat")
    }
    
    return (
        <div className="App container-fluid area">
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

                        <div style={{ height: "auto", maxHeight: "400px", overflow: "scroll" }} >
                            {arr.map((ele, id) => {
                                return (
                                    <div className='d-flex mt-3 bg-light p-3' key={id} style={{ cursor: 'pointer' }}>
                                        <div style={{ backgroundImage: 'url("https://th.bing.com/th/id/OIP.OmZtZd_CsC1JImAaVjEZUwHaFj?pid=ImgDet&rs=1")' }} className='setImage ms-2'>
                                        </div>
                                        <div className=' ms-3'>
                                            <span className='text-dark'>Harsh Kumar {ele}</span>
                                        </div>
                                        <div className=' ms-auto'>
                                            <span className='text-dark'><input type="checkbox" onChange={(e) => e.target.checked==true? UserList(ele):DeleteList(ele)} /></span>
                                        </div>
                                    </div>
                                )
                            })}

                        </div>
                        <div className='w-100 mb-1'><button style={{width:"47%"}} onClick={() => userAdded()}>Add Users</button> <button className='w-50' onClick={() => groupAdded()}>Create Group</button></div>

                    </div>

                </div>
            </div>




        </div>
    )
}

export default Adduser