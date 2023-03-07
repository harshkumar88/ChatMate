import React from 'react'

const SendMsg = () => {
  return (
    <div className='d-flex'>
    <div className='bi bi-plus-circle-fill sizeIcon ms-5 mx-1'></div>
    <div className='w-75'>
       <form>
       <input className='form-control bg-light' placeholder='send Message'/>
       </form>
       </div>
     <div className='bi bi-emoji-smile sizeIcon ms-2'></div>
     <div className='bi bi-send-fill sizeIcon mx-1'></div>

    </div>
  )
}

export default SendMsg