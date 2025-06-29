import React from 'react'
import payment from '../.././assets/payment.JPG'
import { useNavigate } from 'react-router-dom'

function PaymentSuccess() {
  const navigate = useNavigate()
  const handleButton=()=>{
    navigate('/home/userdashboard')
  }
  return (
    <div className='max-w-[1380px] mx-auto  h-screen overflow-hidden'>
      <div className='flex justify-around items-center mx-[10px]'>
        <h1 className=' lg:ml-[120px] lg:text-5xl text-2xl font-[Roboto] font-extrabold mb-[20px] mt-[20px] text-green-900'>Congratulation! Payment Successfull!</h1>
        <button onClick={handleButton} className=' cursor-pointer h-[50px] w-[150px] font-xl rounded-xl bg-blue-300 font-semibold'> Home</button>
      </div>
     

      <img className='max-w-[1380px] lg:h-full h-screen w-full  object-fill' src={payment}/>
 
    </div>
  )
}

export default PaymentSuccess
