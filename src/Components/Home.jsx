import React,{useEffect,useState} from 'react';
import './Home.css'
import {Link} from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import {useNavigate} from 'react-router-dom';
//import Human from './pages/Human';



function Home() {
  const navigate = useNavigate();
  const [auth,setAuth] = useState(false)
  const [name,setName] = useState('')
  const [message,setMessage] = useState('')
  axios.defaults.withCredentials = true;
  useEffect(() =>{
    axios.get('http://localhost:8081')
            .then(res =>{
                if(res.data.Status === "Success"){
                    
                    setAuth(true);
                    setName(res.data.username)
                   
                }else{
                    setAuth(false)
                    setMessage(res.data.Error)
                    
                }
            })
            .then(err=> console.log(err));
  },[])
  const handleDelete = () =>{
    axios.get('http://localhost:8081/logout')
    .then(res =>{
      navigate('/login')
    }).catch(err => console.log(err))
  }
  return (
   <div>
        {
        auth? 
          <div className='navbar'>
         
            <nav>
                <Link to="/home/practice"  id='practice'>Practice</Link>
                <Link to="/home/human" id='human'>Human Competition</Link>
                <Link to="/home/ai" id='ai'>AI Competition</Link>
                <Link  id='logout' onClick={handleDelete}>Logout</Link>
            </nav>
            <h4 type='file' id ='greet'> Welcome {name}</h4>
            
          </div>
          
        :
        <p>{message}</p>
         
          
          
      }
      
      
    </div>

  )
}

export default Home;