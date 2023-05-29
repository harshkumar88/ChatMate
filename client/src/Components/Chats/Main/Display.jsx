import React, { useEffect, useRef, useState } from 'react'
import './Main.css'
import io from 'socket.io-client'
import Swal from 'sweetalert2'
const socket = io('https://chatmate-backend.onrender.com', { autoConnect: false, transports: ['websocket'] });

let len = 0;
let emojiArr = ['😎', '😭', '🥲', '🫡', '🧐', '😆', '😍', '😆', '🙊','😨','🥳','🥱','✌🏻','👍🏻','😡','🥶'];

const Display = ({ change, userId, FriendId, arr = [], check, chatload }) => {
  const [text, setText] = useState("");
  const [loader, setLoader] = useState(true);
  const [msg, setmsg] = useState(false);
  const [emoji, showEmoji] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const [showDelete,setDelete]=useState(false);
  const [chat,setChat]=useState({});
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.addEventListener('focus', handleInputFocus);
    }

    return () => {
      if (inputRef.current) {
        inputRef.current.removeEventListener('focus', handleInputFocus);
      }
    };
  }, [inputRef]);

  useEffect(() => {

    if (len < arr.length || check) {
      console.log("less")
      setLoader(false);
      setmsg(false);
      len = arr.length;
    }

    let objDiv = document.getElementById("scrollDiv");
    if (objDiv)
      objDiv.scrollTop = objDiv.scrollHeight;
    socket.connect();
    console.log("connet")
    socket.emit('AddRoom');

  }, [arr])

  useEffect(() => {
    let objDiv = document.getElementById("scrollDiv");
    if (objDiv)
      objDiv.scrollTop = objDiv.scrollHeight;
  }, [msg])

  function generateRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const handleInputFocus = () => {
    const containerHeight = containerRef.current.offsetHeight;
    const windowHeight = window.innerHeight;
    const inputHeight = inputRef.current.offsetHeight;
    const scrollY = window.scrollY;
    const inputBottom = windowHeight - containerHeight;
    const inputTop = containerRef.current.getBoundingClientRect().top + scrollY;

    if (inputTop > inputBottom) {
      window.scrollTo(0, inputTop - inputHeight - 10);
    }
  };

  const sendMsg = (e) => {
    check = false
    if (text == "") return;
    setmsg(true)
    e.preventDefault();
    //sending info to backenf

    const date = generateRandom(1, 10002020) + new Date();
    const d = new Date();
    const monthName=["Jan","Feb","Mar","April","May","June","July","Aug","Sep","Oct","Nov","Dec"]
    const time = d.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    const day=d.getDate().toString().padStart(2,'0');
    const month=monthName[d.getMonth()];
   const senddate=day+"/"+month

   const miliTime = Date.now();
   console.log(miliTime);
  
    socket.emit("msgInfo", { text, sender: userId, reciever: FriendId, miliTime, time,senddate});
    setText("");
   
    let objDiv = document.getElementById("scrollDiv");
    if (objDiv)
      objDiv.scrollTop = objDiv.scrollHeight;
    showEmoji(false)
  }

  const setEmoji = (ele) => {
    if (emojiArr.indexOf(ele) != -1) {
      setText(text + ele)
    }
    showEmoji(false)
  }
  const DeleteChat=(ele)=>{
    setChat(ele);
    setDelete(true)
  }
  const DeleteChatting=(text)=>{
        socket.emit("deleteChat",{text,sender:userId,reciever:FriendId,chat:chat});
  }

  return (
    <div className='flex-grow-1 border-top scroll mb-5' onClick={showDelete?()=>setDelete(false):()=>{}}>
      {chatload == true ? <div className='chatLoad d-flex justify-content-center align-items-center'><div className='loader2'></div></div> :
        <div className={loader == true ? 'flex-grow-1 border-top scroll mb-5 centerLoader' : 'flex-grow-1 border-top scroll mb-5'} >
          {loader == true ?
            <div className='chatLoad d-flex justify-content-center align-items-center'><div className='loader2'></div></div> :
            <div className=" mx-auto" id="scrollDiv">
              <p className='text-muted text-center fitContent mx-auto'>Let's Chat</p>
              {arr.map((ele, id) => {
                return (
                  <div key={id}>
                    {ele.sender != userId ? <div key={id} className="ms-5 bg-light"><div className='text-break leftStyle mb-2 d-flex'><div className='textChata'>{ele.text} </div>
                    <div className='d-flex flex-column justify-content-center align-items-center mt-1'>
                    <div className='bi bi-trash ms-auto pointer' style={{ fontSize: "10px"}} onClick={()=>DeleteChat(ele)}></div>
                    <div style={{ fontSize: "10px",marginTop:'-5%'}} className='ms-2'>{ele.time}</div></div></div></div> 
                    : <div key={id} className=" text-break me-5 w-100 bg-light "><div className='ms-auto me-5 rightStyle mb-2 d-flex'> 
                    <div className={ele.text=="You deleted this message"?'text-muted text-chata':"text-chata"}>{ele.text} </div> 
                    <div className='d-flex flex-column justify-content-center align-items-center mt-1'>
                    <div className='bi bi-trash ms-auto pointer' style={{ fontSize: "10px"}} onClick={()=>DeleteChat(ele)}></div>
                    <div style={{ fontSize: "10px", marginTop: "-5%" }} className='ms-2'>{ele.time}</div></div></div>
                  </div>}
                  </div>
                )
              })}
              {showDelete?
              <div className='mx-auto deletediv' style={{width:"30%"}}>
              <p className='ms-3 pt-2 text-muted' >Delete message?</p>
              <div className='text-end me-3 pb-2'>
              {chat.text!="You deleted this message" && chat.sender==userId?<p className='pointer' onClick={()=>DeleteChatting("Delete for everyone")}>Delete for everyone</p>:""}

              <p className='pointer' onClick={()=>DeleteChatting("Delete for me")}>Delete for me</p>
              <p className='pointer'>Cancel</p></div>
              </div>:""}
              {msg == true ? <div className='chatLoad ms-auto me-5 rightstyle'><div className='loader3'></div></div> :
                ""}
            </div>
          }
          {/*SEnd Msg*/}

          {emoji == true ? <div className={change == false ? 'd-flex fixedPos3 mt-5 bg-light w-50 ms-5' : 'd-flex fixedPos4 mt-5 mb-2 bg-danger '}>
            <div className='ms-auto d-flex w-50 designEmoji flex-wrap'>
              {emojiArr.map((ele, id) => {
                return (
                  <div key={id} className='ms-3 pointerCursor' onClick={() => setEmoji(ele)}  >{ele}</div>
                )
              })}
            </div>
          </div>
            :
            ""}
          <div className={change == false ? 'd-flex fixedPos1 mt-5 mb-2 ' : 'd-flex fixedPos2 mt-5 mb-2'} ref={containerRef}>
            <div className='bi bi-plus-circle-fill sizeIcon ms-5 mx-1 bg-light borderR'></div>
            <div className='w-75'>
              <form onSubmit={sendMsg} className="d-flex heightSet">
                <div className='inp w-100'>
                  {loader == true || msg == true ? <input className='form-control bg-light' placeholder='wait ....' onChange={(e) => setText(e.target.value)} value={text} readOnly /> :
                    <input className='form-control bg-light' ref={inputRef} placeholder='send Message' onChange={(e) => setText(e.target.value)} value={text} />}
                  <span className='tooltiptxt'>Send Msgx </span>
                </div>
                <div className='bi bi-emoji-smile sizeIcon ms-2 bg-light' onClick={() => showEmoji(!emoji)}></div>
                <button type="submit" className='bg-light sizeIcon marginTop'><div className='bi bi-send-fill sizeIcon mx-1 bg-light '></div></button>
              </form>
            </div>
          </div>
        </div>
      }</div>
  )
}

export default Display