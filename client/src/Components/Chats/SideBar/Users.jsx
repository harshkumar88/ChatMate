import React, { useEffect, useState,useContext } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import img from '../AddCreate/Images/icon.png'
import '../../NotificationPage/Notifications'
import io from 'socket.io-client'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import './sidechat.css'
import { UserID, uId } from '../../../App';
//'https://chatmate-backend.onrender.com'
const socket=io('https://chatmate-backend.onrender.com',{autoConnect: false,transports: ['websocket']});
let userId;
let FixeduserList=[];
const Users = ({ check}) => {
    const navigate=useNavigate();
    const [change, setChange] = useState(false);
    const [name,setname]=useState("");
    const [userlist,setList]=useState([]);
    const [loader,setLoader]=useState(true);
    const [user,setUid]=useState("");
   
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
        FixeduserList=data.Friends;
        setList(data.Friends)
     }

     const getID = async () => {
        const res = await fetch("/getID", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })
     
        const data = await res.json();
        let check=false;
        if(data.cookies){
            check=true;
        }
     
         
        if(check){
            userId=data.cookies.uniqueId;
            setUid(data.cookies.uniqueId);
        }
     }

   
    useEffect(() => {
        getID();
        socket.connect();
         socket.on('connect', () => {
      });
        if(userId)
        getFriends(userId);
        socket.emit('AddRoom');
        return () => {
           socket.disconnect();
        };
    },[userId])

    useEffect(()=>{
        socket.on('NotificationSent', function (message) {
            console.log('Message from server:', message+" ->"+userId);
            if(message==userId){
                console.log("hii")
                getFriends(message);
            }
          });

          
    },[socket])

    useEffect(() => {
        setChange(check);
    },[check])
    
    const showChat=(ele)=>{
        
        ele.userId=userId
        sessionStorage.setItem("userData",ele);
        socket.emit("userDetails",ele,()=>{
            console.log("send hua")
        });
        if(change==true){
            navigate("/Chatting",{
                state:{data:ele}},{ replace: true })
        }
        else{
        navigate("/Chat",{
            state:{data:ele}},{ replace: true })
        }
    }
    const changeUserList = (name) => {
        console.log(name)
        // console.log(FixeduserList)
        const newUserList = FixeduserList.filter((ele) => {
            let s = ele.username;
            let len = name.length;
            let st = s.substring(0, len);
            return st == name;
        })
        setList(newUserList)
    }
    
    
    return (
        <div className={change == true ? 'scrollChats1 bg-light p-4' : "scrollChats2 bg-light p-4"}>
             <div className='searchMargin mb-5'>
       
       <InputGroup className="mb-3 mx-auto bg-light inputWidth ">
         <Form.Control
           placeholder="Search Chat"
           aria-label="Search Chat"
           aria-describedby="basic-addon2"
           className='formWidth bg-light'
           onChange={(e)=>{changeUserList(e.target.value)}}
           
         />
         
         <span className ='tooltiptxt'>Search</span>
         
         <Button id="button-addon2" className='searchWidth bg-outline-none'>
           <i className="bi bi-search"></i>
         </Button>
         
       </InputGroup>
       </div>
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