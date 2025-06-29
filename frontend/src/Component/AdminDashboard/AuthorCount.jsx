import React from 'react'

function AuthorCount({name, email, demote, id}) {
  return (
     <div className='bg-[#D1D6E0] p-[15px] rounded-2xl mt-[20px] shadow-lg' >
            <p>Author-ID: {id}</p>
            <p>Name: {name} </p>
            <p>E-mail: {email} </p>
            <button onClick={demote} className=' h-[35px] w-[60px] rounded-sm cursor-pointer bg-red-400 mt-[10px]'>Demote</button>
        </div>
  )
}

export default AuthorCount
