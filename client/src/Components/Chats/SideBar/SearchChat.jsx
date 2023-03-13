import React from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import './sidechat.css'

const SearchChat = () => {
  return (
    <div className='searchMargin'>
    <InputGroup className="mb-3 mx-auto bg-light inputWidth">
      <Form.Control
        placeholder="Search Chat"
        aria-label="Search Chat"
        aria-describedby="basic-addon2"
        className='formWidth bg-light'
      />
      <Button id="button-addon2" className='searchWidth'>
      <i class="bi bi-search"></i>
      </Button>
    </InputGroup>
    </div>
  )
}

export default SearchChat