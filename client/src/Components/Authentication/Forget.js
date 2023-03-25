import React, { useState, useEffect } from 'react'
import './Form.css'
import ForgetPage from './ForgetPage'


const Forget = () => {
    const [change, setChange] = useState(false);

    const setWidth = () => {
        const w = window.innerWidth
        if (w < 600) {
            setChange(true);
        }
        else {
            setChange(false)
        }
    }

    window.onresize = function () {
        setWidth()
    }

    const fetchCookies = async () => {

        try {
            await fetch("/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            })
        }
        catch (e) {

        }
    }
    useEffect(() => {
        setWidth();
        fetchCookies();
    }, [])


    return (
        <div className="App container-fluid area">
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

            <div className={change == false ? "mt-5 pt-5 outerWidth" : "mt-5 outerWidth2 pt-5"} >
                <div className="mainForget mx-auto innerWidth" style={{minHeight:"270px"}}>
                    <div className="signup" >
                    <h2 className='ForgetHeader pt-3'>Forget</h2>
                        <ForgetPage/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Forget