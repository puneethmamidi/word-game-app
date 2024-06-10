import React,{useState} from 'react'
import './Signup.css'
import Button from '@mui/material/Button';
import './Login.css';
import Swal from 'sweetalert2'
//import {toast } from 'react-toastify';
import {Link} from 'react-router-dom';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import validation from './LoginValidation';
import { Icon } from 'react-icons-kit';
import {eye} from 'react-icons-kit/icomoon/eye';
import {eyeBlocked} from 'react-icons-kit/icomoon/eyeBlocked';
import axios from 'axios';

import {useNavigate} from 'react-router-dom';


function Login() {
   
    const [values, setValues] = useState({
        email:'',
        password:''
    })
    const [type,setType]=useState('password');
    const [icon,setIcon]=useState(eyeBlocked);
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;
    const [errors, setErrors] = useState({})

    const handleToggle=()=>{
        if(type==='password'){
            setIcon(eye);
            setType('text')
        }else{
            setIcon(eyeBlocked);
            setType('password')
        }
    }
    
    const handleSubmit =(event) => {
        event.preventDefault();
        setErrors(validation(values));
        axios.post('http://localhost:8081/login',values)
            .then(res =>{
                if(res.data.Status === "Success"){
                    const Toast = Swal.mixin({
                        toast: true,
                        position: "top",
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                          toast.onmouseenter = Swal.stopTimer;
                          toast.onmouseleave = Swal.resumeTimer;
                        }
                      });
                      Toast.fire({
                        icon: "success",
                        title: "Signed in successfully"
                      });
                    navigate('/home')
                }else{
                    alert(res.data.Error);
                }
            })
            .catch(err=> console.log(err));
    }
    //const notify = () => toast.success(" Logged in successfully !");
    return (
        <div>
            <div className='container'>
                <div className='card_login'>
                    <header>
                        <h3 className='lh-3'>Sign in to your account</h3>
                    </header>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label><EmailIcon id="icon"></EmailIcon>Email <p className='star'>*</p> </label>
                            <input type='email'placeholder='name123@gmail.com' name='email'
                            onChange={e => setValues({...values,email:e.target.value})}></input>
                            {errors.email && <span className='error'>{errors.email}</span>}
                        </div>
                        <div>
                            <label><LockIcon id="icon"></LockIcon>Password <p className='star'>*</p> </label>
                            <input type={type} placeholder='Enter the Password' name='password'
                            onChange={e => setValues({...values,password:e.target.value})}></input>
                            {errors.password && <span className='error'>{errors.password}</span>}
                      </div>
                      
                        <Link to='/forgot' id='forgot'>Forgot Password?</Link>
                        <Button type='submit' variant="contained" id='Signup_button'>Signin</Button>
                     
                        <p className='pm'>Not a member? <Link className='link-s' to="/">Sign Up</Link></p>
                    </form>    
                </div>
            </div>
            <span onClick={handleToggle} className='eye' ><Icon icon={icon} size={25} /></span>
       </div>     
    )
}

export default Login
