import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';

const Users = ({ check }) => {
    const navigate=useNavigate();
    const [change, setChange] = useState(false);
    useEffect(() => {
        setChange(check);
    })
    const showHideChat=()=>{
        if(change==true){
            navigate("/Chatting",{change:check})
        }
    }
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
    return (
        <div className={change == true ? 'scrollChats1 bg-light p-4' : "scrollChats2 bg-light p-4"}>

            {arr.map((ele, id) => {
                return (
                    <div className={id!=0?'d-flex justify-content-between mt-3 pointer':'d-flex justify-content-between pointer'} key={id} onClick={showHideChat}>
                        <div  className="d-flex">
                            <div style={{ backgroundImage: 'url("https://th.bing.com/th/id/OIP.OmZtZd_CsC1JImAaVjEZUwHaFj?pid=ImgDet&rs=1")' }} className='setImage mr-3 mt-2'>
                            </div>
                            <div className=' mx-3'>
                                <span style={{ display: "block" }}>Harsh Kumar</span>
                                <span className='text-muted'>Text me fast</span>
                            </div>
                        </div>
                        <div className='text-muted'>2min ago</div>
                    </div>
                )
            })}
        </div>
    )
}

export default Users