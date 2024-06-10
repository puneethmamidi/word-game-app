import React, { useState, useEffect } from 'react';
import Home from '../Home';
import './Human.css';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


function Human() {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const [auth,setAuth] = useState(false)
  const [id, setUserId] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8081')
      .then(res => {
        if (res.data.Status === "Success") {
          setAuth(true)
          setUsername(res.data.username)
          setUserId(res.data.id)
        } else {
          console.log(res.data.Error)
        }
      });
  }, []);

  const handleJoinCompetition = () => {
    axios.post('http://localhost:8081/join_competition', {id})
      .then(response => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: response.data,
          showConfirmButton: true,
        });
        navigate('/competition')
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <div>
      <Home />
      <div className='human-container'>
        <div className='human-card'>
          <div>
            <h2 className='head-l'>Welcome to Human Competition Lobby {username}</h2>
          </div>
          <div>
            <button className='btn-j' onClick={handleJoinCompetition}>
              Join Competition
            </button>
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default Human;
