
import user from '../../assets/user-voice.png'
import emailIcon from '../../assets/at.png'
import img3 from '../../assets/img-3.png'
import { useState } from 'react'
import Alert from '../../Utils/Alert'

function ForgetPass() {
   const baseApi= import.meta.env.VITE_API_URI_KEY
   const [name, setName]=useState('');
   const [email, setEmail]=useState('');
   const [msg, setMsg]=useState(null);
   const [type, setType]=useState(null);

  const forgetPassword= async()=>{
    const response= await fetch(`${baseApi}/api/auth/forget-password`,{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({name,email})
    });
    const data= await response.json();
    if(response.status===200){setMsg(data.msg); setType('Success')}
    else if(response.status===400 || response.status===404|| response.status===500){setMsg(data.msg); setType('Error')}
  }
  const submitForgetPassword=(e)=>{
    e.preventDefault();
    forgetPassword()
  }

  return (
    <>
    {msg&&<Alert message={msg} type={type} onClose={()=>{setMsg('')}}/>}
  <div  className='h-screen w-full bg-cover bg-center' style={{backgroundImage:`url(${img3})`}}>
      <div className='font-[Roboto] pt-[20px] pl-[20px]'>
        <h1 className='lg:text-5xl md:text-4xl text-3xl font-extrabold text-[#dd85bb]'>Hello,</h1>
        <p className='lg:text-4xl md:text-3xl text-2xl font-bold text-[#ac86e9]'>Blog-Nest</p>
      </div>
      <div className='lg:w-[400px] md:w-[350px] w-[350px] flex  rounded-r-2xl absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 lg:mt-[120px] mt-[90px]' >
          <form onSubmit={submitForgetPassword} className='grid grid-cols-1 lg:w-[400px] md:w-[380px] w-[350px] p-[25px] text-[#88e09e] border rounded-2xl backdrop-blur-xs font-[Roboto] shadow-lg shadow-cyan-500'>
        <div className='flex flex-col justify-center'>
          <h1 className='text-center text-3xl mb-[20px] font-semibold'>Forget Password</h1>
 
              <input value={name} onChange={(e)=>{setName(e.target.value)}} className='p-[10px] mt-[10px] border rounded-2xl' type='text' placeholder='Name' required/>
                    <img className='w-[20px] h-[20px] absolute top-26 right-11' src={user}/>

        <input value={email} onChange={(e)=>{setEmail(e.target.value)}} className='p-[10px] mt-[10px] border rounded-2xl' type='email' placeholder='E-mail' required/>
          <img className='w-[20px] h-[20px] absolute top-40 right-11' src={emailIcon}/>
       
        
        <div className='flex justify-center'>
           <button type='submit' className=' mt-[20px] h-[50px] w-[180px] mb-[20px] rounded-2xl bg-amber-300 text-black
           text-xl font-semibold cursor-pointer hover:scale-105 duration-1000'>Submit</button>
        </div>
        </div>
      </form>
      </div>
   
    
    </div>
    </>
  )
}

export default ForgetPass
