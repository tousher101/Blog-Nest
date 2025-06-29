import React from 'react'
import './output.css'
import { RouterProvider } from 'react-router-dom'
import {route} from './Router'
import ReactDOM from 'react-dom/client'
import  {UserProvider} from './Context/UserInfo'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
    <RouterProvider router={route}>
    </RouterProvider>
    </UserProvider>
  </React.StrictMode>,
)
