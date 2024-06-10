import React from 'react'
import {Outlet,Link} from "react-router-dom";

const Layout = () => {
  return (
   <>
    <p>Already have an account? <Link to="/Login" target='_blank'>Signin</Link> </p>
    <Outlet />  
   </>
         
  )
}

export default Layout