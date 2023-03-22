import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'

const ForgetPage = () => {
  const [flipPage, setPage] = useState(false);
  const [Resend, setResend] = useState(false);
  const [min, setMin] = useState(1);
  const [sec, setSec] = useState(30);
  const [email, setEmail] = useState("");
  const [otp, setotp] = useState();
  const [enterOTP, setOTP] = useState('');
  const [changePass, setPass] = useState(false);
  const [password,setpassword]=useState("");
  const [confirmpassword,setconfirmpassword]=useState("");

  const navigate = useNavigate();
  const otpTimer = () => {
  //  alert(min+" "+sec)
    let m = 1;
    let s = 30;

    const cset = setInterval(() => {

      s--;

      if (m == 0 && s == 0) {
        clearInterval(cset);
        setResend(true);
        const ot = generateRandomNumber();
        setotp(ot);
        setMin(0);
        setSec(0);
      }
      setMin(m);
      setSec(s);
     
      if (s == 0) {
        m--;
        if(m>=0)s=59;
      }
      

    }, 1000)
  }

  function generateRandomNumber() {
    var minm = 100000;
    var maxm = 999999;
    return Math.floor(Math
      .random() * (maxm - minm + 1)) + minm;
  }

  const EmailSend = () => {
    const ot = generateRandomNumber();
    setotp(ot);
    const config = {
      SecureToken: "b9949762-47b6-4393-aff5-6e4a07ed7de1",
      To: email,
      From: "tmate9353@gmail.com",
      Subject: "One Time Password",
      Body: `<h1>${ot}</h1>`
    }

    if (window.Email) {
      window.Email.send(config).then((res) => {
        Swal.fire('OTP Sent Successfully')
          .then((result) => {
            if (result) {
              setPage(true);
              otpTimer();
            }

          })
      })
    }
  }

  const ResendOTP = () => {
    setResend(false);
    setMin(1);
    setSec(30);
    EmailSend();
    setOTP("")
  }


  const forgetPassword = async (e) => {
    e.preventDefault();
    const res = await fetch("/verifyEmail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email: email })
    })

    const data = await res.json();

    if (data.message === "UserNotFound") {
       Swal.fire("User Not Found").then((result) => {
        if (result) {
             navigate('/')
        }
      });
    }
    else {
      EmailSend();
    }
    return
  }

  const checkOTP = (e) => {
    e.preventDefault();

    if (enterOTP == otp) {
      Swal.fire('Verification Successfull')
        .then((result) => {
          if (result) {
            setPass(true);
          }

        })
    }
    else {
      Swal.fire('Not Verified');
      setOTP("");
    }
  }
  const updatePassword=async(e)=>{
    e.preventDefault();
    if(password!==confirmpassword){
      alert("Both Password must be same")
      return;
    }
    const res = await fetch("/changepassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ confirmpassword,password,email })
    })

    const data = await res.json();
    if(data.error==='passwordrejected'){
      alert("Your Password must be in Format eg. Abc12@ min 8 chars ")
    }
    if(data.message=="Success"){
      Swal.fire("Password Changed Successfully").then((result) => {
        if (result) {
             navigate('/')
        }
      });
    }
  }
  return (
    <div>
      {changePass == false ?
        <div>
          {flipPage == false ? <div className='pt-1'>
            <form className='mt-3' onSubmit={forgetPassword}>
              <div className='w-75 mt-3 mx-auto'>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  className='form-control'
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                />
                <span className='text-muted'>We'll never share your email with anyone else.</span>
              </div>
              <button className='mt-4 w-25'>Forget</button>
            </form>
          </div>
            :
            <div className='pt-1'>
              <div className='text-start w-75 mx-auto'>
                <p className='ForgetHeader' style={{ fontWeight: "bold" }}>Note: <span className='text-danger'>OTP expires in <span style={{ fontSize: "1.3rem" }}>{min}:{sec}</span></span></p>
              </div>
              <form className='mt-3' onSubmit={checkOTP}>
                <div className='w-75 mt-3 mx-auto'>
                  <input
                    type="text"
                    name="otp"
                    placeholder="Enter your OTP"
                    required
                    className='form-control'
                    onChange={(e) => setOTP(e.target.value)}
                    value={enterOTP}
                  />
                  <div className='text-end w-100 mx-auto '>
                    {Resend == false ? <div><span className='text-muted ForgetHeader'  style={{marginRight:"45%",}}>Check your spam folder</span><span className='text-muted ForgetHeader'>Resend OTP</span></div>
                      : <span className='ForgetHeader' style={{ fontWeight: "bold", cursor: "pointer" }} onClick={ResendOTP}>Resend OTP</span>}
                  </div>
                </div>
                <button className='mt-4 w-25'>Submit</button>
              </form>
            </div>
          }
        </div> : <div >
          <form className='mt-3 ' onSubmit={updatePassword}>
            <div className='w-75 mt-3 mx-auto'>
              <input
                type="password"
                name="password"
                placeholder="new password"
                required
                className='form-control'
                value={password}
                onChange={(e)=>{setpassword(e.target.value)}}
              />

            </div>
            <div className='w-75 mt-3 mx-auto'>
              <input
                type="password"
                name="confirmpassword"
                placeholder="confirm password"
                required
                className='form-control'
                value={confirmpassword}
                onChange={(e)=>{setconfirmpassword(e.target.value)}}

              />
              <span className='text-muted'>your password is encrypted end to end</span>
            </div>
            <button  style={{marginbottom:"5%",marginTop:"3%"}}>Change Password</button>
          </form>
        </div>}
    </div>
  )
}

export default ForgetPage