import React from 'react'
import paymentfalid from '../.././assets/paymentfaild.jpg'
import { useNavigate } from 'react-router-dom'


function PaymentFaild() {
    const navigate = useNavigate()
  const handleButton=()=>{
    navigate('/home/userdashboard')
  }
  return (
      <div className='max-w-[1380px] mx-auto  overflow-hidden'>
        <div className='flex justify-around items-center mx-[10px]'>
          <h1 className=' lg:ml-[120px] lg:text-5xl text-2xl font-[Roboto] font-extrabold mb-[20px] mt-[20px] text-red-600'>Sorry! Payment Faild! Try Again</h1>
          <button onClick={handleButton} className=' cursor-pointer lg:h-[50px] h-[40px] lg:w-[150px] w-[120px] font-xl rounded-xl bg-blue-300 font-semibold'>Home</button>
        </div>
       
  
        <img className='max-w-[1380px] lg:h-screen  w-full object-center h-screen' src={paymentfalid}/>
   
      </div>
  )

}

export default PaymentFaild
