import React from 'react';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Routes,Route} from 'react-router-dom';

import Profile from './Components/pages/Profile';
import Home from './Components/Home';
import Login from './Components/Login';
import Practice from './Components/pages/Practice';
import Signup from './Components/Signup';
import Human from './Components/pages/Human';
import Ai from './Components/pages/AI';
import Forgot from './Components/Forgot';
import Sum from './Components/pages/Sum';
import Competition from './Components/pages/Competition';




function App() {
  return (
          <>
           <ToastContainer position="top-center"/>
            <Routes>
            <Route path="/" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot" element={<Forgot />} />
            <Route path="/home" element={<Home />}>  </Route>  
            <Route path="/home/practice" element={<Practice />} />
            <Route path="/home/human" element={<Human />} />
            <Route path="/home/ai" element={<Ai />} />
            <Route path="/sum" element={<Sum />} />
            <Route path="/competition" element={<Competition />} />
            
              
  
</Routes>
           
            
           
          </>
  
  );
}

export default App;
