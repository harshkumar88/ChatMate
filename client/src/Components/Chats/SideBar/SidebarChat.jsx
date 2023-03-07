import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './sidechat.css'
import SearchChat from './SearchChat';
import Addperson from './Addperson';
import Users from './Users';


const SidebarChat = () => {

  const [change, setChange] = useState(false);

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

  useEffect(() => {
    setWidth();
  }, [])

  return (
    <div className={change == true ? 'sideWidth2 bg-light' : "sidebarWidth1 bg-light"}>
      <div className='heightSide1'>
        <Addperson />
        <SearchChat />
      </div>
      <div className='heightSide2'>
       <Users check={change}/>
      </div>
    </div>
  )
}

export default SidebarChat