import React from 'react'
import NavBar from '../Component/NavBar'
import { Outlet } from 'react-router-dom'

function Home() {
  return (
   <>
   <NavBar/>
   <Outlet/>
   
   </>
  )
}

export default Home
