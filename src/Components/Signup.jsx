import React,{useState} from 'react'
import './Signup.css'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';
import {Link} from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import DateRangeIcon from '@mui/icons-material/DateRange';
import WcIcon from '@mui/icons-material/Wc';
import { Icon } from 'react-icons-kit';
import {eye} from 'react-icons-kit/icomoon/eye';
import {eyeBlocked} from 'react-icons-kit/icomoon/eyeBlocked';
import sign_validation from './SignupValidations';
import Swal from 'sweetalert2';
import axios from 'axios';

import {useNavigate} from 'react-router-dom';



function Signup() {
    
       
    const [values, setValues] = useState({
        username:'',
        email:'',
        age:'',
        gender:'',
        password:''
    })
   
    const [type,setType]=useState('password');
    const [icon,setIcon]=useState(eyeBlocked);
    const navigate = useNavigate();
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
        const err = sign_validation(values);
        setErrors(err);
        axios.post('http://localhost:8081/signup',values)
            .then(res =>{
                if(res.data.Status === "Success"){
                    const Toast = Swal.mixin({
                        toast: true,
                        position: "top",
                        showConfirmButton: false,
                        timer: 1000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                          toast.onmouseenter = Swal.stopTimer;
                          toast.onmouseleave = Swal.resumeTimer;
                        }
                      });
                      Toast.fire({
                        icon: "success",
                        title: "Sign up successfully"
                      });
                    navigate('/login')
                }else{
                    alert("Error");
                }
            })
            .then(err=> console.log(err));
    } 
  
    return (
        <div className='container'>
            <div className='card'>
                <header>
                    <h3>Signup in to your account</h3>
                </header>
                <form autoComplete="off" onSubmit={handleSubmit}>
                    <div>
                        <label><AccountCircleIcon id='icon'></AccountCircleIcon>Username <p className='star'>*</p> </label>
                        <input type='text' placeholder='Username' name='username'
                        onChange={e => setValues({...values,username:e.target.value})}></input>
                        {errors.username && <span className='error'>{errors.username}</span>}
                    </div>
                    
                    <label><EmailIcon id='icon'></EmailIcon>Email <p className='star'>*</p> </label>
                    <input type='email' placeholder='Somename@gmail.com'name='email'
                    onChange={e => setValues({...values,email:e.target.value})}></input>
                    {errors.email && <span className='error'>{errors.email}</span>}
                    <label><DateRangeIcon id='icon'></DateRangeIcon>Age <p className='star'>*</p> </label>
                    <input type='number' placeholder='Enter your Age'name= 'age'
                    onChange={e => setValues({...values,age:e.target.value})}></input>
                    {errors.age && <span className='error'>{errors.age}</span>}
                    <FormControl>
                        <FormLabel id="demo-row-radio-buttons-group-label"><WcIcon id='icon'></WcIcon>Gender <p className='star'>*</p></FormLabel>
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="gender"
                            onChange={e => setValues({...values,gender:e.target.value})} 
                        >
                            <FormControlLabel value="female" control={<Radio />} label="Female" />
                            <FormControlLabel value="male" control={<Radio />} label="Male" />
                            <FormControlLabel value="other" control={<Radio />} label="Other" />
                            
                        </RadioGroup>
                   </FormControl>
                   <label><LockIcon id='icon'></LockIcon >Password <p className='star'>*</p> </label>
                        <input type={type} placeholder='Create Password (Min character size is 8)' name= 'password'
                        onChange={e => setValues({...values,password:e.target.value})}></input>
                        {errors.password && <span className='error'>{errors.password}</span>}
                        
                   <Button type='submit'  variant="contained" id='Signup_button'>Signup</Button>
                   <p className='pm'>Already have an account? <Link className='link-s' to="/login">Sign In</Link></p>
                   
                   
                    
                </form>
            </div>
            <span onClick={handleToggle} className='eye-s' ><Icon icon={icon} size={25} /></span>
        </div>
        
    )
}

export default Signup
