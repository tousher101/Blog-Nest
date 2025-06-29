import React from 'react'
import img1 from '../../assets/img-1.png'
import { Link } from 'react-router-dom'

function StartUp() {
  return (
    <div className='h-screen w-full bg-cover bg-center' style={{backgroundImage:`url(${img1})`}}>
       <section className='text-center text-5xl font-[Roboto] font-extrabold pt-[150px]'>
        <h1 className=' text-[#b1dab1]'>WELCOME</h1>
      <p className='text-4xl  text-[#97c45e]'>TO</p>
      <h1 className='text-[#dfe237]'>BLOG-NEST WORLD</h1>
       <button className='mt-[50px] font-semibold text-3xl p-[10px] w-[250px] h-[70px] rounded-3xl bg-amber-300 cursor-pointer
       hover:transform hover:rotate-[360deg] duration-2000 '><Link to='/signup'>Let's Go</Link> </button>
      </section>

   
    </div>
  )
}

export default StartUp
