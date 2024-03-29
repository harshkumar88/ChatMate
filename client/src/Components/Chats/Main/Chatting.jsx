import React, { useContext, useEffect, useRef, useState } from 'react'
import Display from './Display'
import Info from './Info'
import Swal from 'sweetalert2'
import io from 'socket.io-client'
import './Main.css'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import { UserID, uId } from '../../../App'
import { useLocation, useNavigate } from 'react-router-dom'
import Users from '../SideBar/Users'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Addperson from '../SideBar/Addperson'
const socket = io('https://chatmate-backend.onrender.com', { autoConnect: true, transports: ['websocket'] });
let userId;
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
  const [hide, hideChat] = useState(false)
  const [check, setCheck] = useState(true);
  const [chatload, setLoad] = useState(true);
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
  const [showColor, setColor] = useState("");
  const [msgCount, setMsgCount] = useState([]);
  const [infonoti, setinfonoti] = useState("");

  const handleBackButton = () => {
    // This function will be called when the user navigates back to this page
    console.log("back")
    setChatPage(false)
    // Do something else here
  };



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
    if (data.Friends.length > 0) {
      userdata = data.Friends[0];
      setColor(userdata.username)
      setDetails(userdata)
    }
    getMsg(userId, userdata.username)
  }

  useEffect(() => {
    window.addEventListener('popstate', handleBackButton);
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
    return (() => {
      socket.disconnect();
    })
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


  const deleteDupli = async (sender, reciever) => {
    const res = await fetch("/DeleteDuplicateChat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        sender, reciever
      })
    });
  }
  const getMsg = async (sender, reciever) => {
    console.log(sender, reciever)
    const res = await fetch("/getChat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        sender, reciever
      })
    });

    const info = await res.json();
    let checkArr = [];
    let dupli = false;
    let doc = '';
    for (let i of info.msg) {
      if (doc == '') {
        doc = i;
        checkArr.push(i);
      }
      else if (doc.text == i.text && doc.sender == i.sender &&
        doc.reciever == i.reciever && doc.miliTime == i.miliTime && doc.time == i.time && doc.senddate == i.senddate) {
        dupli = true;
      }
      else {
        checkArr.push(i);
        doc = i;
      }

    }
    if (dupli) {
      deleteDupli(sender, reciever);
      deleteDupli(reciever, sender)
    }

    contentList = checkArr;
    console.log("check change ")
    ch = true;
    setCheck(true);
    setLoad(false);
    setChats(contentList);

    return info
  }

  const deleteChat = async (sender, chat, text) => {
    const res = await fetch("/deleteChat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        sender, chat, text
      })
    });

    const data = await res.json();
    contentList = data.msg
    ch = true;
    setCheck(true);
    setLoad(false);
    setChats(contentList);
    toast.success('Msg Deleted!', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 500,
    });
  }


  useEffect(() => {

    socket.on('NotificationSent', function (message) {
      console.log('Message from server:', message + " ->" + userId);
      if (message == userId) {
        getFriends(message);
      }
    });


    socket.on("getMessage", async (data) => {
      if (data.sender == userId) {
        const res = await saveMsg(data, { uid: data.sender, Fid: data.reciever });
        console.log(res)
        if (res) {
          const response = await saveMsg(data, { uid: data.reciever, Fid: data.sender });
          console.log("msg");
          if (response) {
            console.log("ki")
            getMsg(data.sender, data.reciever)
            socket.emit("msgSaved", data);
          }
        }
      }
    })


    socket.on("showMsg", (data) => {
      if (data.reciever == userId && data.sender == userdata.username) {
        let Count = msgCount.filter((el) => {
          return el != data.sender
        })

        getMsg(data.reciever, data.sender)
        setMsgCount(Count);
      }

      else if (data.reciever == userId) {
        if (msgCount.indexOf(data.sender) == -1) {
          setMsgCount([...msgCount, data.sender]);
        }
      }
    })

    socket.on("FriendRemove", async ({ friendId, deleteId }) => {
      if (userId == friendId) {
        await getFriends(friendId);
        Swal.fire(
          `${deleteId} and you are no longer friend`,
        )
        setChatPage(false)
      }
    })

    socket.on("chatDelete", async (ele) => {
      if (ele.text == "Delete for me" && ele.sender == userId) {
        deleteChat(ele.sender, ele.chat, ele.text);
      }
      else if (ele.text == "Delete for everyone") {
        await deleteChat(ele.sender, ele.chat, ele.text);
        socket.emit("deletefromFriend", ele);
      }
    })

    socket.on("delete1", (ele) => {
      if (ele.reciever == userId) {
        getMsg(ele.reciever, ele.sender)
      }
    })

    socket.on("deleteMyChat", (myid, friendkiid) => {
      if (userId === myid) {
          DeleteAllChat(myid,friendkiid)
      }

    })
  }, [socket])

  const DeleteAllChat=async(myid,friendkiid)=>{
    const res = await fetch("/deleteAllChat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: myid,
        friendid: friendkiid
      })
    });
    const data=await res.json();
    const checkArr=data.msg;
    contentList = checkArr;
    ch = true;
    setCheck(true);
    setLoad(false);
    setChats(contentList);
    Swal.fire("Chats deleted Successfully")
  }

  const showChat = (ele) => {
    let Count = msgCount.filter((el) => {
      return el != ele.username
    })
    setMsgCount(Count);
    contentList = [];
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
  const logout = async () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You want's to Logout.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, do it!'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear("userId");
        Swal.fire(
          'Logout!',
          'You are Logout.',
          'success'
        ).then(() => {
          navigate("/Form")
        })

      }
    })
  }
  const deleteFriend = async (friend) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You want to remove ${friend} from your friends.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, do it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await fetch("/deleteFriend", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userId, friend
          })
        });
        const data = await res.json();

        setList(data.msg);
        socket.emit("removefriend", friend, userId);
        Swal.fire(
          `${friend} removed from friend list`
        )

      }
    })



  }

  const showPic = (ele) => {
    if (!ele.pic) ele.pic = 'https://img.icons8.com/ultraviolet/512/user.png'
    setPic(ele);
    setPch(true)
  }

  return (
    <div className={picChange == true ? "bg-dark" : ""}>
      {picChange == false ? <div className='d-flex w-100 ' style={{ minHeight: "100vh", overflow: 'hidden' }}>
        {chatPage == false ?
          <div className={changePage == true & picChange == false ? 'sideWidth2 bg-light' : (changePage == true & picChange == true) || userlist.length == 0 ? 'sideWidth2' : picChange == true ? "sidebarWidth1 " : "sidebarWidth1 bg-light"} style={{ minHeight: "100vh" }}>

            <div className={picChange == true ? 'heightSide1 opacityChange d-flex flex-column bg-light' : userlist.length == 0 ? 'heightSide3  d-flex flex-column bg-light' : 'heightSide1  d-flex flex-column bg-light'}>
              {/*Adduserpage*/}
              <div className='w-100 bg-light d-flex justify-content-between p-3'>
                <div><h2>Chats</h2><p className='text-muted'>Recents Chats</p></div>
                <div className='w-25'>
                  <div className='d-flex justify-content-evenly w-100 bellICon mt-2  ' >

                    <div className='bi bi-bell ms-4' onClick={() => { navigate('/Notifications') }} onMouseOver={() => setinfonoti("Notifications")} onMouseLeave={() => setinfonoti("")}></div>
                    <div className='bi bi-plus-circle-fill sizeIcon  ms-3 bg-light' onClick={showPage} onMouseOver={() => setinfonoti("Add Friends")} onMouseLeave={() => setinfonoti("")}></div>
                    <div className='bi bi-box-arrow-right pointer ms-3 me-5' onClick={logout} onMouseOver={() => setinfonoti("Logout")} onMouseLeave={() => setinfonoti("")}></div>

                  </div>

                  {infonoti == "Notifications" ? <div style={{ marginLeft: "-13px", marginTop: "-10px" }}> <span style={{ fontSize: "10px", fontWeight: "bold" }}>{infonoti}</span></div> : ""}
                  {infonoti == "Add Friends" ? <div style={{ marginLeft: "25px", marginTop: "-10px" }}> <span style={{ fontSize: "10px", fontWeight: "bold" }}>{infonoti}</span></div> : ""}
                  {infonoti == "Logout" ? <div style={{ marginLeft: "65px", marginTop: "-10px" }}> <span style={{ fontSize: "10px", fontWeight: "bold" }}>{infonoti}</span></div> : ""}
                </div>
              </div>

              <div className=' mb-5 bg-light'>

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
            </div>
            <div className={picChange == true ? 'heightSide2 opacityChange mt-5' : 'heightSide2 mt-5'} >
              {/*userspage*/}
              <div className={change == true ? 'scrollChats1 bg-light p-4' : "scrollChats2 bg-light p-4"}>

                {loader ? <div className='p-3 mt-5'>
                  <div className="loader">
                    <div className="inner one"></div>
                    <div className="inner two"></div>
                    <div className="inner three"></div>
                  </div>
                </div> :
                  userlist.length == 0 ? <div className='mt-5 text-center'><h1 >Your FriendList <br /> is Empty</h1>
                    <div className='bi bi-plus-circle-fill sizeIcon bg-light mx-auto' onClick={showPage}></div><p style={{ fontWeight: "bold" }} className='mt-3'>Add Friend</p></div> :
                    userlist.map((ele, id) => {
                      return (
                        <div className={ele.username == showColor ? 'd-flex justify-content-between mt-3 letsChat chatHover p-1' : 'd-flex justify-content-between mt-3 chatHover p-1'} key={id}>
                          <div className="d-flex">
                            <div style={ele.pic == "" || ele.pic == undefined ? { backgroundImage: "url('https://img.icons8.com/ultraviolet/512/user.png')" } : { backgroundImage: `url(${ele.pic})` }} className='setImage mr-3 mt-2 pointer' onClick={() => showPic(ele)}>
                            </div>
                            <div className='mx-3 pointer' onClick={() => showChat(ele)}>
                              <span style={{ display: "block" }}>{ele.username}</span>
                              <span className='text-muted'>Text me fast</span>

                            </div>
                          </div>
                          <div className='text-muted me-2'> {msgCount.indexOf(ele.username) != -1 ? <span className='text-success'><i className="bi bi-bell"></i></span> : <span>
                            <i className="bi bi-trash" style={{ cursor: "pointer" }} onClick={() => deleteFriend(ele.username)}> </i></span>}</div>
                        </div>
                      )
                    })}
              </div>
            </div>
          </div>
          : ""}
        {(changePage == false || chatPage) && userlist.length != 0 ?
          <div className={change == false && !picChange ? 'bg-light w-75 heightMIn' : change == false && picChange ? 'bg-light w-75 heightMIn opacityChange ' : 'bg-light w-100 heightMIn'}>
            <Info userdata={userdata} />
            <div className={hide == false ? 'd-flex flex-column justify-content-between heightDisplay' : 'd-flex flex-column justify-content-between heightDisplay dontsee'}>
              <Display change={change} userId={userId} FriendId={userDetails.username} arr={chats} check={check} chatload={chatload} />
            </div>
          </div> : ""}

      </div> :
        <div style={{ minHeight: "100vh" }}>

          <div className={changePage == true ? 'setImage3 mr-3 mt-2 pointer' : 'setImage2 mr-3 mt-2 pointer'}>
            <div className='text-light text-center' style={{ fontWeight: "bold", fontVariant: "small-caps", fontSize: "2rem" }}>{pic.username}</div>
            <div className='img'>
              <div className='mt-4'><button className={changePage == false ? 'abs' : 'abs1'} onClick={() => setPch(false)}>X</button></div>
              <div style={{ backgroundImage: `url(${pic.pic})` }} className='setImage4'></div>
            </div>
          </div>
        </div>}
      <ToastContainer />
    </div>
  )
}

export default Chatting