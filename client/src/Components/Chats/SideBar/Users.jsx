import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';

const Users = ({ check}) => {
    const navigate=useNavigate();
    const [change, setChange] = useState(false);
    const [userlist,setList]=useState([]);
    useEffect(() => {
        if(sessionStorage.getItem("userList")){
            const data=JSON.parse(sessionStorage.getItem("userList"));
            setList(data)
        }
    },[])

    useEffect(() => {
        setChange(check);
       
    },[check])
    
    const showHideChat=()=>{
        if(change==true){
            navigate("/Chatting",{change:check})
        }
    }
    
    return (
        <div className={change == true ? 'scrollChats1 bg-light p-4' : "scrollChats2 bg-light p-4"}>

            {userlist.length==0?<div className='mt-5 text-center'><h1 >Your ChatMat <br/> is Empty</h1></div>:
            userlist.map((ele, id) => {
                return (
                    <div className={id!=0?'d-flex justify-content-between mt-3 pointer':'d-flex justify-content-between pointer'} key={id} onClick={showHideChat}>
                        <div  className="d-flex">
                            <div style={{ backgroundImage: 'url("https://th.bing.com/th/id/OIP.OmZtZd_CsC1JImAaVjEZUwHaFj?pid=ImgDet&rs=1")' }} className='setImage mr-3 mt-2'>
                            </div>
                            <div className=' mx-3'>
                                <span style={{ display: "block" }}>Harsh Kumar {ele}</span>
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