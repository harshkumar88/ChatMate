import React,{useState,useEffect} from 'react'
import './Form.css'
import Login from './Login';
import Register from './Register';
// import 'bootstrap/dist/css/bootstrap.min.css';

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
   
    useEffect(() => {
       setWidth();
    }, [])

   
    return (
        <div className="App container-fluid">
            <div className={change==false?"mt-5 outerWidth":"mt-5 outerWidth2"}>
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