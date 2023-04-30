import React, { useEffect, useState,useContext } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import img from '../AddCreate/Images/icon.png'
import '../../NotificationPage/Notifications'
import { UserID } from '../../../App';
import { SocketIO } from '../../../App';

const Users = ({ check}) => {
    const userId=useContext(UserID);
    const socket=useContext(SocketIO);
    const navigate=useNavigate();
    const [change, setChange] = useState(false);
    const [userlist,setList]=useState([]);
    const [loader,setLoader]=useState(true);

     const getFriends=async(Id)=>{
        setLoader(true);
        const Friends= await fetch("/getFriends", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: Id
            })
        });
        const data=await Friends.json();
        setLoader(false);
        console.log(data.Friends);
        setList(data.Friends)
     }
   
    useEffect(() => {
        if(userId)
        getFriends(userId);
    },[userId])

    useEffect(()=>{
        socket.on('NotificationSent', function (message) {
            console.log('Message from server:', message+" ->"+userId);
            if(message==userId){
                console.log("hii")
                getFriends(message);
            }
          });
          return () => {
            socket.off('broadcast');
          };
    },[socket])

    useEffect(() => {
        setChange(check);
    },[check])
    
    const showChat=(ele)=>{
        if(change==true){
            navigate("/Chatting",{change:check})
        }
        socket.emit("userDetails",ele);

    }
    
    return (
        <div className={change == true ? 'scrollChats1 bg-light p-4' : "scrollChats2 bg-light p-4"}>
            {loader?<div className='p-3 mt-5'>
            <div className="loader">
            <div className="inner one"></div>
            <div className="inner two"></div>
            <div className="inner three"></div>
          </div>
          </div>:
            userlist.length==0?<div className='mt-5 text-center'><h1 >Your ChatMat <br/> is Empty</h1></div>:
            userlist.map((ele, id) => {
                return (
                    <div className={id!=0?'d-flex justify-content-between mt-3 pointer':'d-flex justify-content-between pointer'} key={id} onClick={()=>showChat(ele)}>
                        <div  className="d-flex">
                            <div style={ele.pic=="" || ele.pic==undefined?{backgroundImage: "url('https://img.icons8.com/ultraviolet/512/user.png')"}:{ backgroundImage: `url(${ele.pic})` }} className='setImage mr-3 mt-2'>
                            </div>
                            <div className=' mx-3'>
                                <span style={{ display: "block" }}>{ele.username}</span>
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