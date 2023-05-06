import React, { useContext, useEffect, useRef, useState } from 'react'
import Display from './Display'
import Info from './Info'
import io from 'socket.io-client'
import './Main.css'
import { UserID, uId } from '../../../App'
import { useLocation, useNavigate } from 'react-router-dom'
import Users from '../SideBar/Users'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Addperson from '../SideBar/Addperson'
const socket = io('https://chatmate-backend.onrender.com', { autoConnect: true, transports: ['websocket'] });
let userId;
// let arr = [];
let FixeduserList = [];
let userdata = { username: "DontSee123", pic: "" };
let contentList;
let ch;
const Chatting = ({ change, user }) => {
  const navigate = useNavigate();
  const changeDiv = useRef(null)
  const showPage = () => {
    navigate('/Adduser')
  }
  const [userDetails, setDetails] = useState({ username: "DontSee123", pic: "" });
  const [chats, setChats] = useState([]);
  const [hide,hideChat]=useState(false)
  const [check, setCheck] = useState(true);
  const [chatload, setLoad] = useState(false);
  const location = useLocation();
  const [userdd, setUid] = useState("");
  const [changePage, setChange] = useState(false);
  const [name, setname] = useState("");
  const [userlist, setList] = useState([]);
  const [loader, setLoader] = useState(true);
  // const [user, setUid] = useState("");
  const [pic, setPic] = useState("");
  const [picChange, setPch] = useState(false);
  const [chatPage, setChatPage] = useState(false);
  const [showColor,setColor]=useState("");


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

  const getID = async () => {
    const res = await fetch("/getID", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    })

    const data = await res.json();
    let check = false;
    if (data.cookies) {
      check = true;
    }

    if (check) {
      userId = data.cookies.uniqueId;
      setUid(data.cookies.uniqueId);
      getFriends(userId);
    }
  }

  const getFriends = async (Id) => {
    setLoader(true);
    const Friends = await fetch("/getFriends", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: Id
      })
    });
    const data = await Friends.json();
    setLoader(false);
    console.log(data.Friends);
    FixeduserList = data.Friends;
    setList(data.Friends)
    userdata=data.Friends[0];
    setColor(userdata.username)
    setDetails(userdata)
    getMsg(userId, userdata.username)
  }

  useEffect(() => {
    
    setColor("")
    setWidth();
    if (change) {
      setCheck(true)
    }
    if (location.state && location.state.data) {
      userdata = location.state.data;
      setDetails(userdata)
      getMsg(userId, userdata.username)
    }
    getID();
    socket.connect();
    console.log("connet")
    socket.emit('AddRoom');

  }, [])


  const saveMsg = async (data, Info) => {
    //  console.log(data)
    const res = await fetch("/saveMsg", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        data, Info
      })
    });

    const info = await res.json();
    return info
  }

 
  const getMsg = async (sender, reciever) => {
    const res = await fetch("getChat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        sender, reciever
      })
    });

    const info = await res.json();
    contentList=info.msg
    console.log("check change ")
    ch=true;
    setCheck(true);
    setLoad(false);
    setChats(contentList);
   
    return info
  }
   

  useEffect(() => {

    socket.on('NotificationSent', function (message) {
      console.log('Message from server:', message+" ->"+userId);
      if(message==userId){
          getFriends(message);
      }
    });


    socket.on("getMessage", async (data) => {
      if (data.sender == userId) {
           const res = await saveMsg(data, { uid: data.sender, Fid: data.reciever });
           if(res){
             getMsg(data.sender, data.reciever);
             const response=await saveMsg(data, { uid: data.reciever, Fid: data.sender });
            }
       }

      if (data.reciever == userId) {
            getMsg(data.reciever, data.sender);
            const response=await saveMsg(data, { uid: data.reciever, Fid: data.sender });
            if(response){
              getMsg(data.reciever, data.sender);
            }
        }

    })
  }, [socket])


  const showChat = (ele) => {
    setColor(ele.username)
    ele.userId = userId
    userdata = ele
    
    setDetails(ele)
    setCheck(true);
    setLoad(true)
    if (changePage)
      setChatPage(true);

    getMsg(userId, ele.username)
    if (changePage == true) {
      navigate("/Chat", {
        state: { data: ele }
      }, { replace: true })
    }

  }
  const changeUserList = (name) => {
    const newUserList = FixeduserList.filter((ele) => {
      let s = ele.username;
      let len = name.length;
      let st = s.substring(0, len);
      return st == name;
    })
    setList(newUserList)
  }

  const showPic = (pic) => {
    if (!pic) pic = 'https://img.icons8.com/ultraviolet/512/user.png'
    setPic(pic);
    setPch(true)
  }

  return (
    <div className='d-flex w-100 bg-dark' style={{ minHeight: "100vh" }}>
      {chatPage == false ?
        <div className={changePage == true & picChange == false ? 'sideWidth2 bg-light' : changePage == true & picChange == true ? 'sideWidth2' : picChange == true ? "sidebarWidth1 " : "sidebarWidth1 bg-light"} style={{ minHeight: "100vh" }}>
          <div className={picChange == true ? 'heightSide1 opacityChange' : 'heightSide1'}>
            {/*Adduserpage*/}
            <div >
              <div className='w-100 bg-light d-flex justify-content-between p-3'>
                <div><h2>Chats</h2><p className='text-muted'>Recents Chats</p></div>

                <div className='d-flex justify-content-evenly w-25 bellICon mt-2 ms-5 ' >
                  {/* <span className ='tooltiptxt'>hello</span> */}

                  <div className='bi bi-bell ms-4' onClick={() => { navigate('/Notifications') }}></div>
                  <div className='bi bi-plus-circle-fill sizeIcon bg-light ms-3' onClick={showPage}></div>
                </div>
              </div>
            </div>
          </div>
          <div className={picChange == true ? 'heightSide2 opacityChange' : 'heightSide2'}>
            {/*userspage*/}
            <div className={change == true ? 'scrollChats1 bg-light p-4' : "scrollChats2 bg-light p-4"}>
              <div className='searchMargin mb-5'>

                <InputGroup className="mb-3 mx-auto bg-light inputWidth ">
                  <Form.Control
                    placeholder="Search Chat"
                    aria-label="Search Chat"
                    aria-describedby="basic-addon2"
                    className='formWidth bg-light'
                    onChange={(e) => { changeUserList(e.target.value) }} />

                  <span className='tooltiptxt'>Search</span>

                  <Button id="button-addon2" className='searchWidth bg-outline-none'>
                    <i className="bi bi-search"></i>
                  </Button>

                </InputGroup>
              </div>
              {loader ? <div className='p-3 mt-5'>
                <div className="loader">
                  <div className="inner one"></div>
                  <div className="inner two"></div>
                  <div className="inner three"></div>
                </div>
              </div> :
                userlist.length == 0 ? <div className='mt-5 text-center'><h1 >Your ChatMat <br /> is Empty</h1></div> :
                  userlist.map((ele, id) => {
                    return (
                      <div className={ele.username==showColor? 'd-flex justify-content-between mt-3 letsChat' : 'd-flex justify-content-between mt-3'} key={id}>
                        <div className="d-flex">
                          <div style={ele.pic == "" || ele.pic == undefined ? { backgroundImage: "url('https://img.icons8.com/ultraviolet/512/user.png')" } : { backgroundImage: `url(${ele.pic})` }} className='setImage mr-3 mt-2 pointer' onClick={() => showPic(ele.pic)}>
                          </div>
                          <div className='mx-3 pointer' onClick={() => showChat(ele)}>
                            <span style={{ display: "block",fontVariant:"small-caps" }}>{ele.username}</span>
                            <span className='text-muted'>Text me fast</span>
                          </div>
                        </div>
                        <div className='text-muted me-2'>Let's chat</div>
                      </div>
                    )
                  })}
            </div>
          </div>
        </div>
        : ""}
      {changePage == false || chatPage ?
        <div className={change == false && !picChange ? 'bg-light w-75 heightMIn' : change == false && picChange ? 'bg-light w-75 heightMIn opacityChange ' : 'bg-light w-100 heightMIn'}>
          <Info userdata={userdata} />
          <div className={hide==false?'d-flex flex-column justify-content-between heightDisplay':'d-flex flex-column justify-content-between heightDisplay dontsee'}>
            <Display change={change} userId={userId} FriendId={userDetails.username} arr={chats} check={check} chatload={chatload} />
          </div>
        </div> : ""}
      {picChange ? <div className={changePage == true ? 'setImage3 mr-3 mt-2 pointer' : 'setImage2 mr-3 mt-2 pointer'}>
        <div><button className='abs' onClick={() => setPch(false)}>X</button></div>
        <div style={{ backgroundImage: `url(${pic})` }} className='setImage4'></div>
      </div> : ""}
    </div>
  )
}

export default Chatting