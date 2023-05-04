import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {io} from 'socket.io-client'
import './Home.css'
import { uId } from '../../App'

let userId
const Home = () => {
    const uid=useContext(uId);
    if(uid){
        userId=uid;
    }
    const navigate=useNavigate();
    const [Chat,setChat]=useState({
        C:"",
        h:"",
        a:"",
        t:""
    });
    const [ChatS,setChatS]=useState({
        p:"",
        M:"",
        a:"",
        t:"",
        e:""
    });
    const [blink,setblink]=useState(false);
    
    const makeEffect=()=>{
         let i=1;
        const cls=setInterval(()=>{
            
            if(i==1){
                setChat({...Chat,C:'C'});
            }
            else if(i==2){
                setChat({...Chat,C:'C',h:'h'});
            }
            else if(i==3){
                setChat({...Chat,C:'C',h:'h',a:'a'});
            }
            else if(i==4){
                setChat({...Chat,C:'C',h:'h',a:'a',t:'t'});
            }
            i++;
            if(i==5){
                clearInterval(cls);
                makeEffect2();
            }
        },300);
        
    }

    const makeEffect2=()=>{
        let i=1;
       const cls=setInterval(()=>{
           
           if(i==1){
               setChatS({...ChatS,p:'p'});
           }
           else if(i==2){
               setChatS({...ChatS,p:'p',M:'M'});
           }
           else if(i==3){
               setChatS({...ChatS,p:'p',M:'M',a:'a'});
           }
           else if(i==4){
               setChatS({...ChatS,p:'p',M:'M',a:'a',t:'t'});
           }
           else if(i==5){
            setChatS({...ChatS,p:'p',M:'M',a:'a',t:'t',e:'e'});
        }
           i++;
           if(i==6){
               clearInterval(cls);
               makeBlink();
           }
       },300);
       
   }

   const makeBlink=()=>{
    let i=0;
       const set=setInterval(()=>{
          if(i%2==0){
            setblink(true);
          }
          else{
            setblink(false);
          }
          i++;

          if(i==10){
            clearInterval(set);
            console.log(userId)
            if(!userId){
                navigate("/Form")
            }
            else{
                navigate('/Chat')
            }
          }
       },200);
   }

    useEffect(()=>{
        makeEffect();
    },[])
    return (
        <div className='bgColor d-flex justify-content-center  w-100'>
            <div className='text-light Mtop w-75 mx-auto text-muted' >
                <div className='marginInner'>
                    <h1 className='fontSizeChat' style={blink?{fontWeight:"bolder"}:{}}>
                        <span className={Chat.C!=""?"text-light":""}>C</span>
                        <span className={Chat.h!=""?"text-light":""}>h</span>
                        <span className={Chat.a!=""?"text-light":""}>a</span>
                        <span className={Chat.t!=""?"text-light":""}>t</span>
                    </h1></div>
                <div className='text-center'>
                <h2 className='fontSizeMate'  style={blink?{fontWeight:"bolder"}:{}}>
                <span className={ChatS.p!=""?"text-light":""}>@</span>
                <span className={ChatS.M!=""?"text-light":""}>M</span>
                <span className={ChatS.a!=""?"text-light":""}>a</span>
                <span className={ChatS.t!=""?"text-light":""}>t</span>
                <span className={ChatS.e!=""?"text-light":""}>e</span>
                </h2></div>
            </div>
        </div>
    )
}

export default Home