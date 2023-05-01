import React,{useEffect,useState} from 'react'
import './Main.css'
import io from 'socket.io-client'
const socket=io('http://localhost:5000',{autoConnect: false,transports: ['websocket']});
let data=[{Data:["hi how are youaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","i am fineaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","aur btao","bs yaar kuch nhi aap Btao",
"kya kar rahe the","aapko yaad aur kya","ok Nice","Kya hua kuch nhi","Chlo Bye","Bye Gn"],Day:"Yesterday"},{Data:["hi how are youaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","i am fineaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa","aur btao","bs yaar kuch nhi aap Btao",
"kya kar rahe the","aapko yaad aur kya","ok Nice","Kya hua kuch nhi","Chlo Bye","Bye","ok"],Day:"Today"}];
const Display = ({change,userId,FriendId}) => {
  const [arr,setData]=useState(data);
  const [text,setText]=useState("");

  useEffect(()=>{
     let objDiv = document.getElementById("scrollDiv");
     objDiv.scrollTop = objDiv.scrollHeight;
     socket.connect();
    console.log("connet")
    socket.emit('AddRoom');
    return () => {
       socket.disconnect();
    };
  },[])

  const sendMsg=(e)=>{
    e.preventDefault();
    //sending info to backenf
    socket.emit("msgInfo",{text,userId,FriendId});
    setText("");

      let objDiv = document.getElementById("scrollDiv");
      objDiv.scrollTop = objDiv.scrollHeight;
  }



  return (
    
    <div className='flex-grow-1 border-top scroll mb-5' id="scrollDiv">
      <div className=" mx-auto mt-3">
      {arr.map((ele,id)=>{
           return(
            <div key={id}>
            <p className='text-muted text-center fitContent mx-auto'>{ele.Day}</p>
            <div className='mt-4'>
            {ele.Data.map((ele,id)=>{
              return (
               <div key={id}>
               {id%2==0? <div key={id} className="ms-5 bg-light"><p className=' text-break  leftStyle '>{ele}</p></div>:<div key={id} className=" text-break me-5 w-100 bg-light "><p className='ms-auto me-5 rightStyle'>{ele}</p></div>}
              </div>
              )
           })}
           </div>
            </div>
           )
      })}
      </div> 

      {/*SEnd Msg*/}
      

    <div className={change==false?'d-flex fixedPos1 mt-5 mb-2 ':'d-flex fixedPos2 mt-5 mb-2'}>
    <div className='bi bi-plus-circle-fill sizeIcon ms-5 mx-1 bg-light borderR'></div>
    <div className='w-75'>
       <form onSubmit={sendMsg} className="d-flex heightSet">
       <div className='inp w-100'>
       <input className='form-control bg-light' placeholder='send Message' onChange={(e)=>setText(e.target.value)} value={text}/>
       <span className ='tooltiptxt'>Search</span>
       </div>
       <div className='bi bi-emoji-smile sizeIcon ms-2 bg-light'></div>
       <button  type="submit" className='bg-light sizeIcon marginTop'><div className='bi bi-send-fill sizeIcon mx-1 bg-light '></div></button>
       </form>
       </div>
    </div>
    </div>
  )
}

export default Display