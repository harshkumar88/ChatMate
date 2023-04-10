import React from 'react'
import { useNavigate } from 'react-router-dom'

const Addperson = () => {
    const naigate=useNavigate();

    const showPage=()=>{
          naigate('/Adduser')
    }
    return (
        <div >
            <div className='w-100 bg-light d-flex justify-content-between p-3'>
                <div><h2>Chats</h2><p className='text-muted'>Recents Chats</p></div>
                
                <div>
                    {/* <span className ='tooltiptxt'>hello</span> */}
                    <div className='bi bi-plus-circle-fill sizeIcon' onClick={showPage}></div>
                </div>
            </div>
        </div>
    )
}

export default Addperson