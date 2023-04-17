import React from 'react'
import { useNavigate } from 'react-router-dom'

const Addperson = () => {
    const navigate=useNavigate();

    const showPage=()=>{
          navigate('/Adduser')
    }
    return (
        <div >
            <div className='w-100 bg-light d-flex justify-content-between p-3'>
                <div><h2>Chats</h2><p className='text-muted'>Recents Chats</p></div>
                
                <div className='d-flex justify-content-evenly w-25 bellICon mt-2 ms-5 ' >
                    {/* <span className ='tooltiptxt'>hello</span> */}
                   
                    <div className='bi bi-bell ms-4' onClick={()=>{navigate('/Notifications')}}></div>
                    <div className='bi bi-plus-circle-fill sizeIcon bg-light ms-3' onClick={showPage}></div>
                </div>
            </div>
        </div>
    )
}

export default Addperson