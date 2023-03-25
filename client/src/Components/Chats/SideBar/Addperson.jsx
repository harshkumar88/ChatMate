import React from 'react'

const Addperson = () => {

    const showPage=()=>{
         alert("ji")
    }
    return (
        <div >
            <div className='w-100 bg-light d-flex justify-content-between p-3'>
                <div><h2>Chats</h2><p className='text-muted'>Recents Chats</p></div>
                <div><div className='bi bi-plus-circle-fill sizeIcon' onClick={showPage}></div></div>
            </div>
        </div>
    )
}

export default Addperson