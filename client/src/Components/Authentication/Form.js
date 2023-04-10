import React,{useState,useEffect} from 'react'
import './Form.css'
import Login from './Login';
import Register from './Register';

const Form = () => {
    const [change,setChange]=useState(false);

    const setWidth=()=>{
        const w= window.innerWidth
        if(w<600){
           setChange(true);
        }
        else{
            setChange(false)
        }
   }

   window.onresize = function () {
    setWidth()
   }
   
   const fetchCookies=async()=>{
         
    try{
        const res=await fetch("/",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            }
        })
    }
    catch(e){

    }
   }
    useEffect(() => {
       setWidth();
       fetchCookies();
    }, [])

   
    return (
        <div className="App container-fluid areaApp">
                <ul className="circles">
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                </ul>

            <div className={change==false?"mt-5 outerWidth":"mt-5 outerWidth2 d-flex justify-content-center align-items-center"}>
                <div className="main mx-auto innerWidth">
                    <input type="checkbox" id="chk" aria-hidden="true" />
                    <div className="signup">
                        <Register/>
                    </div>
                    <div className="login ">
                         <Login/>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}

export default Form