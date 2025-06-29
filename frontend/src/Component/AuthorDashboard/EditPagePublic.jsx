import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Alert from '../../Utils/Alert';


function EditPagePublic() {
const {id}=useParams();
const [publicPost,setPublicPost]=useState(null);
const navigate = useNavigate();
const [visibility, setVisibility]=useState('');
const [msg, setMsg]=useState(null);
const [type, setType]=useState(null);
const baseApi= import.meta.env.VITE_API_URI_KEY
const getallPublicpost = async()=>{
    const token = sessionStorage.getItem('auth-token');
  const response = await fetch(`${baseApi}/api/author/getallpublicedit/${id}`,{
    method: 'GET',
    headers:{
      'Content-Type':'application/json',
       'Authorization':`Bearer ${token}`
    }
  });
  const data = await response.json();

  if(response.ok){setPublicPost(data)}
};
useEffect(()=>{
  getallPublicpost();
},[])

const submitEdit= async()=>{
const token = sessionStorage.getItem('auth-token');
  const response = await fetch(`${baseApi}/api/author/updateauthorpost/${id}`,{
    method: 'PUT',
    headers:{
      'Content-Type':'application/json',
       'Authorization':`Bearer ${token}`
    },
    body: JSON.stringify({title:publicPost.title, description:publicPost.description, content:publicPost.content, visibility})
  });
  const data = await response.json()
  if(response.ok){navigate('/home/athuordashboard')}
  else if (response.status===404){setMsg(data.msg),setType('Error')}
    else if (response.status===400){setMsg(data.msg),setType('Error')}
      else if (response.status===401){setMsg(data.msg),setType('Error')}
        else if (response.status===500){setMsg(data.msg),setType('Error')}

}

const handleCancle = ()=>{navigate('/home/athuordashboard')}


  return (
    <>
    {msg&&<Alert message={msg} type={type} onClose={()=>{setMsg('')}}/>}
    <div className='max-w-[1380px] mx-auto grid grid-cols-1 font-[Roboto]'>
      <h1 className='text-5xl text-center mt-[20px] font-semibold'>Edit Your Post</h1>
      <div className='grid grid-cols-1'>
      <input value={publicPost?.title} onChange={(e)=>{setPublicPost({...publicPost, title:e.target.value})}} type='text' className='bg-[#BFC6D4] mx-[10px] text-xl p-[10px] rounded-xl mt-[20px] font-semibold border'/>
      <input value={publicPost?.description} onChange={(e)=>{setPublicPost({...publicPost, description:e.target.value})}} type='text' className='bg-[#BFC6D4] mx-[10px] text-xl p-[10px] rounded-xl mt-[20px] border' />
      <textarea value={publicPost?.content} onChange={(e)=>{setPublicPost({...publicPost, content: e.target.value})}} className='border mx-[10px] text-md p-[10px] rounded-xl mt-[20px] mb-[30px]'/>
      <div className='text-xl mx-[10px] flex items-center mb-[30px]'>
        <p className='text-2xl mr-[20px]'>Visibility:</p>
        <p className='mr-[20px]'> <input name='visibility' value={'PUBLIC'} onChange={(e)=>{setVisibility(e.target.value)}} checked={visibility==='PUBLIC'} type='radio'/> Public </p>
        <p> <input type='radio' name='visibility' value={'PRIVATE'} onChange={(e)=>{setVisibility(e.target.value)}} checked={visibility==='PRIVATE'}/> Private </p>
      </div>
      <div className='flex justify-center mb-[30px]'>
        <button onClick={submitEdit} className=' cursor-pointer mr-[20px]  h-[45px] w-[150px] text-xl rounded-2xl bg-green-400'>Update</button>
        <button onClick={handleCancle} className=' cursor-pointer  h-[45px] w-[150px] text-xl rounded-2xl bg-blue-500'>Cancel</button>
      </div>
      

      </div>
     
      
      
      
    </div>
    </>
  )
}

export default EditPagePublic
