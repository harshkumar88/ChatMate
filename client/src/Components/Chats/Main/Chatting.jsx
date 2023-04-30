import React,{createContext, useEffect,useState,useContext} from 'react'
import Display from './Display'
import Info from './Info'
import io from 'socket.io-client'
import './Main.css'
import { SocketIO } from '../../../App'

const Chatting = ({change}) => { 
  const [userDetails,setDetails]=useState();
  const socket=useContext(SocketIO);
  

   
  return (
    <div className={change==false?'bg-light w-75 heightMIn':'bg-light w-100 heightMIn'}>
    <Info/>
    <div className='d-flex flex-column justify-content-between heightDisplay'>
    <Display change={change}/>
    </div>
    </div>
  )
}

export default Chatting