import React from 'react'

const Info = () => {
    return (
        <div className='p-3 mx-2 d-flex justify-content-between'>
            <div className="d-flex">
                <div style={{ backgroundImage: 'url("https://th.bing.com/th/id/OIP.OmZtZd_CsC1JImAaVjEZUwHaFj?pid=ImgDet&rs=1")' }} className='setImage mr-3 mt-2'>
                </div>
                <div className=' mx-3'>
                    <span style={{ display: "block" }}>Harsh Kumar</span>
                    <span className='text-muted'>Last seen 2 min ago</span>
                </div>
            </div>
            <div className='mt-3 d-flex'> <div className='mx-2'> <i class="bi bi-three-dots"></i></div> </div>
        </div>
    )
}

export default Info