import React from 'react'

function AuthorRequest({name,email,id, accept, decline}) {
  return (
    <div className='bg-[#D1D6E0] p-[15px] rounded-2xl mt-[20px] shadow-lg' >
      <div className=' overflow-hidden'>
            <p>User Id : {id} </p>
            <p>Name : {name}</p>
            <p>E-mail : {email}</p>
            <div className='mt-[10px]'>
               <button onClick={accept} className=' h-[35px] w-[60px] mr-[10px] rounded-sm cursor-pointer bg-green-400'>Accept</button>
            <button onClick={decline} className=' h-[35px] w-[60px] rounded-sm cursor-pointer bg-red-400'>Decline</button>
            </div>
           
      </div>
    
   
      
          
        </div>
  )
}

export default AuthorRequest
