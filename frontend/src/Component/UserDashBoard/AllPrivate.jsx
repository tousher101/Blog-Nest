import { Link, useNavigate } from 'react-router-dom';
import Alert from '../../Utils/Alert';
import { useState } from 'react';


function AllPrivate({title, description, author, create, update, photo, id, primium, authorId}) {
  const [msg,setMsg]=useState();
  const [type, setType]=useState();
  const createDate= new Date(create).toDateString();
  const updated = new Date(update).toDateString();
  const navigatetor = useNavigate();
 
const handleReadMore=()=>{
  if(primium.isPremium === false){ setMsg('Acces not allowed! Please Purches Premium Subscription'); setType('Error') ;return
  } else if(primium.isPremium === true){navigatetor(`show-private-post/${id}`)}
}
  return (
    <>
    {msg&&<Alert message={msg} type={type} onClose={()=>{setMsg('')}}/>}
  <div className='w-[400px]  bg-[#E0E4Eb] rounded-2xl shadow-lg'>
        <div className='w-[400px] h-[250px]  overflow-hidden rounded-2xl'>
            <img className=' p-[10px] rounded-2xl' src={photo}  />
        </div>
        <div className='font-[Roboto] p-[20px] text-md break-words overflow-auto'>
          <p className='font-semibold'>Title: {title}</p>
          <p>Description: {description}</p>
          <p>Author: {author}</p>
          <p>Author-ID: {authorId}</p>
          <p>Create Date: {createDate}</p>
          <p>Last Update: {updated}</p>
        </div>
      
            <div className='flex justify-center mb-[10px] mx-[10px] '>
          <button onClick={handleReadMore} className=' w-[400px] bg-[#e98484] py-[10px] rounded-2xl cursor-pointer shadow-lg mb-[15px]'>Read Full
          </button></div>
      
       
        
    </div>
    </>
  )
}

export default AllPrivate
