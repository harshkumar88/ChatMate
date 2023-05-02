import React, { useEffect, useState } from 'react'
import './Main.css'
import io from 'socket.io-client'
const socket = io('https://chatmate-backend.onrender.com', { autoConnect: false, transports: ['websocket'] });

let len=0;
const Display = ({ change, userId, FriendId, arr,check}) => {
  let counter=arr.length+1;
  const [text, setText] = useState("");
  const [loader,setLoader]=useState(true);
  const [msg,setmsg]=useState(false);

  if(len<arr.length){
    setmsg(false);
    len=arr.length;
  }

 
  useEffect(() => {
    if(check){
      setLoader(false);
     
    }
  
    let objDiv = document.getElementById("scrollDiv");
    objDiv.scrollTop = objDiv.scrollHeight;
    socket.connect();
    console.log("connet")
    socket.emit('AddRoom');
    return () => {
      socket.disconnect();
    };
  }, [])

  const sendMsg = (e) => {
   setmsg(true)
    e.preventDefault();
    //sending info to backenf
    socket.emit("msgInfo", { text, sender: userId, reciever: FriendId,counter});
    setText("");

    let objDiv = document.getElementById("scrollDiv");
    objDiv.scrollTop = objDiv.scrollHeight;
  }



  return (

    <div className={loader==true?'flex-grow-1 border-top scroll mb-5 centerLoader':'flex-grow-1 border-top scroll mb-5'} id="scrollDiv">
    {loader==true?
    <div>
    <div className="loader">
    <div className="inner one"></div>
    <div className="inner two"></div>
    <div className="inner three"></div>
  </div>
  </div>:
      <div className=" mx-auto">
        <p className='text-muted text-center fitContent mx-auto'>"Today"</p>
        {arr.map((ele, id) => {
          return (
            <div key={id}>
              {ele.sender != userId ? <div key={id} className="ms-5 bg-light"><p className=' text-break  leftStyle '>{ele.text}</p></div> : <div key={id} className=" text-break me-5 w-100 bg-light "><p className='ms-auto me-5 rightStyle'>{ele.text}</p></div>}
            </div>
          )
        })}
        {msg==true?<p>Wait</p>:""}
      </div>
      }
      {/*SEnd Msg*/}


      <div className={change == false ? 'd-flex fixedPos1 mt-5 mb-2 ' : 'd-flex fixedPos2 mt-5 mb-2'}>
        <div className='bi bi-plus-circle-fill sizeIcon ms-5 mx-1 bg-light borderR'></div>
        <div className='w-75'>
          <form onSubmit={sendMsg} className="d-flex heightSet">
            <div className='inp w-100'>
              {loader==true?<input className='form-control bg-light' placeholder='send Message' onChange={(e) => setText(e.target.value)} value={text} readOnly/>:
              <input className='form-control bg-light' placeholder='send Message' onChange={(e) => setText(e.target.value)} value={text}/>}
              <span className='tooltiptxt'>Search</span>
            </div>
            <div className='bi bi-emoji-smile sizeIcon ms-2 bg-light'></div>
            <button type="submit" className='bg-light sizeIcon marginTop'><div className='bi bi-send-fill sizeIcon mx-1 bg-light '></div></button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Display