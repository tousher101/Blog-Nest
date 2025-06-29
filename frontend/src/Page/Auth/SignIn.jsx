import { useState } from "react"
import img3 from '../../assets/img-3.png'
import { Link, useNavigate } from 'react-router-dom'
import emailIcon from '../../assets/at.png'
import eyeIcon from '../../assets/eye.png'
import Alert from '../../Utils/Alert'
import { useUserInfo } from "../../Context/UserInfo"
const baseApi= import.meta.env.VITE_API_URI_KEY

export default function SignIn() {
const [showPass, setShowPass]=useState('password');
const [email,setEmail]=useState('');
const [password,setPassword]=useState('');
const navigator = useNavigate();
const [msg, setMsg]=useState(null);
const [type, setType]=useState(null);
const {getAllUser}=useUserInfo()

const submitLoging= async (e)=>{
e.preventDefault();
const response= await fetch(`${baseApi}/api/auth/login`,{
  method: 'POST',
  headers:{
    'Content-Type':'application/json'
  },
  body:JSON.stringify({email,password})
})
const data = await response.json()
if(response.status===200){ sessionStorage.setItem('auth-token',data.token); await getAllUser();
  if(data.role==='ADMIN'){navigator('/home/admindashboard')} 
  if (data.role === 'AUTHOR'){navigator('/home/athuordashboard')} 
  if (data.role === 'USER'){navigator('/home/userdashboard')} 
}
if(response.status === 400){setMsg(data.msg); setType('Error')}
else if(response.status === 404){setMsg(data.msg); setType('Error')}
else if(response.status === 500){setMsg(data.msg); setType('Error')}

}
  
const togglePassword=()=>{
if(showPass==='password'){setShowPass('text')}else{setShowPass('password')}
 }
  
  return (
    <>
    {msg&&<Alert message={msg} type={type} onClose={()=>{setMsg('')}}/>}
     <div  className='h-screen w-full bg-cover bg-center' style={{backgroundImage:`url(${img3})`}}>
      <div className='font-[Roboto] pt-[20px] pl-[20px]'>
        <h1 className='lg:text-5xl md:text-4xl text-3xl font-extrabold text-[#dd85bb]'>Hello,</h1>
        <p className='lg:text-4xl md:text-3xl text-2xl font-bold text-[#ac86e9]'>Blog-Nest</p>
      </div>
      <div className='lg:w-[400px] md:w-[350px] w-[350px] flex  rounded-r-2xl absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 lg:mt-[30px] mt-[90px]' >
          <form onSubmit={submitLoging} className='grid grid-cols-1 lg:w-[400px] md:w-[380px] w-[350px] p-[25px] text-[#88e09e] border rounded-2xl backdrop-blur-xs font-[Roboto] shadow-lg shadow-cyan-500'>
        <div className='flex flex-col justify-center'>
          <h1 className='text-center text-3xl mb-[20px] font-semibold'>Login</h1>
 

        <input value={email} onChange={(e)=>{setEmail(e.target.value)}} className='p-[10px] mt-[10px] border rounded-2xl' type='email' placeholder='E-mail' required/>
          <img className='w-[20px] h-[20px] absolute top-26 right-11' src={emailIcon}/>
          
          <input value={password} onChange={(e)=>{setPassword(e.target.value)}} className='p-[10px] mt-[10px] border rounded-2xl' type={showPass} placeholder='Password' required/>
          <input onChange={togglePassword} type='checkbox' id='toggle' className=' hidden peer'/>
          <label className='absolute top-40 right-11 cursor-pointer' htmlFor='toggle' >
            <img src={eyeIcon}/>
          </label>
        
        <div className='flex justify-center'>
           <button type='submit' className=' mt-[20px] h-[50px] w-[180px] mb-[20px] rounded-2xl bg-amber-300 text-black
           text-xl font-semibold cursor-pointer hover:scale-105 duration-1000'>Login</button>
        </div>
<div className='lg:flex lg:justify-between grid justify-center  mb-[20px] text-xl'>
   <h1>Remember Me <input type='checkbox'/></h1>
   <h1><Link to='/forgetpassword'>Forget Password?</Link></h1>
</div>
       
        <h1 className='text-center text-xl'><Link to='/signup'> Have No Account? Sign Up</Link></h1>
        </div>
      </form>
      </div>
   
    
    </div>
    </>
  )
}
