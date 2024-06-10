import React,{useState} from 'react';
import './Forgot.css';
import EmailIcon from '@mui/icons-material/Email';
import axios from 'axios';

function Forgot() {
  const [email,setEmail] = useState({
    email:''
  })

  
  const handleReset =(event)=>{
    axios.post('http://localhost:8081/forgot-password',{email})
            .then(res =>{
                if(res.data.Status === "Success"){
                    alert("Reset Password is sent to your register Email Successfully")
                }else{
                    alert(res.data.Error);
                }
            })
  }
  return (
    <div className='forgot-con'>
      <div className='forgot-card'>
      <form  onSubmit={handleReset}>
        <h3 className='fo'>Forgot Password</h3>
        <label className='la'><EmailIcon id="icon-1"></EmailIcon> Email Address:</label>
        <input className='em' type='email' placeholder='name123@gmail.com' name='email' onChange={e => setEmail({...email,email:e.target.value})}></input>
        <button className='submit'>Reset Password</button>
      </form>
      </div>
    </div>
  )
}

export default Forgot