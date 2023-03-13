import React,{useEffect,useState} from 'react'
import Display from './Display'
import Info from './Info'

import './Main.css'

const Chatting = ({change}) => { 
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