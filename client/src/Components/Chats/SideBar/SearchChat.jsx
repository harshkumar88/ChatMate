import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import './sidechat.css'

const SearchChat = () => {
   const [name,setname]=useState("");
   const[uid,setUid]=useState("");
   let userId;
   useEffect(()=>{
    getID();
   });
   const getID = async () => {
    const res = await fetch("/getID", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        }
    })
 
    const data = await res.json();
    let check=false;
    if(data.cookies){
        check=true;
    }
 
    if(check){
        userId=data.cookies.uniqueId;
        setUid(data.cookies.uniqueId);
    }
 }
  const handleChange=(e)=>{
     let val=e.target.value;
     setname(val);

  }
  return (

    <div className='searchMargin'>
       
    <InputGroup className="mb-3 mx-auto bg-light inputWidth ">
      <Form.Control
        placeholder="Search Chat"
        aria-label="Search Chat"
        aria-describedby="basic-addon2"
        className='formWidth bg-light'
        onChange={handleChange}
        value={name}
      />
      
      <span className ='tooltiptxt'>Search</span>
      
      <Button id="button-addon2" className='searchWidth bg-outline-none'>
        <i className="bi bi-search"></i>
      </Button>
      
    </InputGroup>
    </div>
  )
}

export default SearchChat