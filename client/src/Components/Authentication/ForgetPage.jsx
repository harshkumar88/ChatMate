import React from 'react'

const ForgetPage = () => {
  return (
    <div className='mt-3'>
     <h2>Forget</h2>
    <form className='mt-3'>
        <div className='w-75 mt-3 mx-auto'>
            <input
                type="email"
                name="email"
                placeholder="Email"
                required=""
                className='form-control'
            />
        </div>
    
        <button className='mt-3'>Forget</button>

    </form></div>
  )
}

export default ForgetPage