import React, { useEffect,useState} from 'react'
import io from 'socket.io-client'
const socket=io('https://chatmate-backend.onrender.com',{autoConnect: false,transports: ['websocket']});
const userId=sessionStorage.getItem("userId");
const Info = () => {
    const [userdata,setDetails]=useState({username:"harsh",pic:""});
    
    useEffect(() => {
        socket.connect();
        console.log("connet")
        socket.emit('AddRoom');
        return () => {
            socket.disconnect();
          };
    },[])

    useEffect(()=>{
        socket.on("getuserDetails",(data)=>{
            console.log(data)
            if(data.userId==userId){
                  setDetails(data)
            }
           })
    },[socket])
    return (
        <div className='p-3 mx-2 d-flex justify-content-between'>
            <div className="d-flex">
            <div style={userdata.pic=="" || userdata.pic==undefined?{backgroundImage: "url('https://img.icons8.com/ultraviolet/512/user.png')"}:{ backgroundImage: `url(${userdata.pic})` }} className='setImage mr-3 mt-2'>
            </div>
                <div className=' mx-3'>
                    <span style={{ display: "block" }}>{userdata.username}</span>
                    <span className='text-muted'>Last seen 2 min ago</span>
                </div>
            </div>
            <div className='mt-3 d-flex'> <div className='mx-2'> <i className="bi bi-three-dots"></i></div> </div>
        </div>
    )
}

export default Info