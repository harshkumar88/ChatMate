import React,{useEffect,useState} from 'react'
import Display from './Display'
import Info from './Info'
import { Navigate,useNavigate } from 'react-router-dom'

import './Main.css'

const Chatting = ({change}) => { 
  return (
    <div className={change==false?'bg-light w-75':'bg-light w-100'}>
    <Info/>
    <div className='d-flex flex-column justify-content-between heightDisplay'>
    <Display change={change}/>
    </div>
    </div>
  )
}

export default Chatting