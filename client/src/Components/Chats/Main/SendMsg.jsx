import React,{useState} from 'react'
import {useNavigate} from 'react-router-dom'
const SendMsg = ({setData,data}) => {
  const [text,setText]=useState();
  const navigate=useNavigate();
  const sendMsg=(e)=>{
    e.preventDefault();
    let info=data[1];
    info.Data.push(text);
    setData(data)
    
    
  }
  return (
    <div className='d-flex'>
    <div className='bi bi-plus-circle-fill sizeIcon ms-5 mx-1 bg-light'></div>
    <div className='w-75'>
       <form onSubmit={sendMsg} className="d-flex">
       <input className='form-control bg-light' placeholder='send Message' onChange={(e)=>setText(e.target.value)}/>
       <div className='bi bi-emoji-smile sizeIcon ms-2 bg-light'></div>
       <button  type="submit" className='bg-light sizeIcon'><div className='bi bi-send-fill sizeIcon mx-1 bg-light'></div></button>
       </form>
       </div>
    </div>
  )
}

export default SendMsg