import React, { useState, useEffect } from 'react'
import './Adduser.css'
import Swal from 'sweetalert2'

const Adduser = () => {
    const [change, setChange] = useState(false);
    const [addPage, setPage] = useState(false);
    const [userPage,setUserpage]=useState(true);
    const arr=[1,2,3,4,5,6,7,8,9,10,11,12,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];

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

    const AddUser = () => {
        setPage(true);
        setUserpage(true);
    }

    const CreateGroup = () => {
        setPage(true);
        setUserpage(false);
    }
    const userAdded=(ele)=>{
          
        Swal.fire({
            title: `Do you want to add ${ele}?`,
            showDenyButton: true,
            confirmButtonText: 'Save',
            denyButtonText: `Don't save`,
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              Swal.fire(`User ${ele} Added!`, '', 'success')
            } else if (result.isDenied) {
              Swal.fire(`User ${ele} not Added`, '', 'info')
            }
          })
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

            {addPage == false ? <div className={change == false ? " outerWidth d-flex justify-content-center align-items-center" : " d-flex justify-content-center align-items-center outerWidth2"} >
                <div className="mainForget mx-auto innerWidth" style={{ minHeight: "270px" }}>
                    <div className="signup" >
                        <h2 className='ForgetHeader pt-3'>What you want?</h2>
                        <div className='form-control mt-4'>
                            <button className='w-100' style={{ height: "auto", minHeight: "40px" }} onClick={AddUser}>Add an User</button>
                        </div>

                        <div className='form-control mt-3'>
                            <button className='w-100' style={{ height: "auto", minHeight: "40px" }} onClick={CreateGroup}>Create a Group</button>
                        </div>

                    </div>
                </div>
            </div>
                : <div className={change == false ? " outerWidth d-flex justify-content-center align-items-center" : " d-flex justify-content-center align-items-center outerWidth2"} >
                    <div className="mainForget mx-auto innerWidth" style={{height:"auto"}} >

                        {userPage==true?
                          <div className="signup" style={{ height: "auto",maxHeight:"500px"}} >
                            <h2 className='ForgetHeader pt-3  border-bottom border-dark'>Add your Friend</h2>
                           
                            <div style={{ height: "auto",maxHeight:"400px",overflow:"scroll"}} className='pb-3 ' >
                            {arr.map((ele,id)=>{
                                return (
                                    <div className='d-flex mt-3 bg-light p-3' key={id} style={{cursor:'pointer'}} onClick={()=>userAdded(ele)}>
                                    <div style={{ backgroundImage: 'url("https://th.bing.com/th/id/OIP.OmZtZd_CsC1JImAaVjEZUwHaFj?pid=ImgDet&rs=1")' }} className='setImage ms-2'>
                                    </div>
                                    <div className=' ms-3'>
                                        <span className='text-dark'>Harsh Kumar {ele}</span>
                                    </div>
                                    
                                    </div>
                                )
                            })}
                            </div>
                          
                        </div>
                        :<div className="signup" >
                            <h2 className='ForgetHeader pt-3'>Create your group</h2>
                            <hr className='bg-dark'/>
                            
                        </div>
        } 
                    </div>
                </div>}




        </div>
    )
}

export default Adduser