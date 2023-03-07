import React from 'react'
import Display from './Display'
import Info from './Info'
import SendMsg from './SendMsg'
import './Main.css'

const Chatting = () => {
  return (
    <div className='bg-light w-75'>
    <Info/>
    <div className='d-flex flex-column justify-content-between heightDisplay'>
    <Display/>
    <SendMsg/>
    </div>
    
    
    </div>
  )
}

export default Chatting