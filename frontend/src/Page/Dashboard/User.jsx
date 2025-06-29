import React, { useEffect, useState } from 'react'

import Alert from '../../Utils/Alert';
import AllPrivate from '../../Component/UserDashBoard/AllPrivate';
import { useRef } from 'react';
import AllPrivateGlobal from '../../Component/AdminDashboard/AllPrivateGlobal';

function User() {
  const [privatePost, setPrivatePost]=useState([]);
  const [msg, setMsg]=useState(null);
  const [type, setType]=useState(null);
  const [privatePage, setPrivatePage]=useState(1);
  const[totalPrivatePage, setTotalPrivatePage]=useState();
  const [publicPost, setPublicPost]=useState([]);
  const [totalPublicPage, setTotalPublicPage]=useState();
  const [publicPage,setPublicPage]=useState(1);
  const [isPrimium, setIsPrimium]=useState();
  const [privateSearchPage, setPrivateSearchPage]=useState(1);
  const [privateSearchTotalPage, setPrivateSearchTotalPage]=useState();
  const [privateSearchData, setPrivateSearchData]=useState([]);
  const [publicSearchPage, setPublicSearchPage]=useState(1);
  const [publicSearchTotalPage, setPublicSearchTotalPage]=useState();
  const [publicSearchData, setPublicSearchData]=useState([]);
  const [publicSearchText, setPublicSearchText]=useState('');
  const [privateSearchText, setPrivateSearchText]=useState('');
  const [mode, setMode]=useState(false);
  const searchRef=useRef();
  const baseApi= import.meta.env.VITE_API_URI_KEY


  const getAllPrivatePost= async()=>{
    const token = sessionStorage.getItem('auth-token');
    const response = await fetch(`${baseApi}/api/user/getprivatepost?page=${privatePage}`,{
      method: 'GET',
      headers:{
        'Content-Type':'application/json',
        'Authorization':`Bearer ${token}`
      },

    });
    const data = await response.json();
  
    if(response.ok){setPrivatePost(data.privatePost); setTotalPrivatePage(data.totalPage), setIsPrimium(data.User)}
  };

  const handleNextPrivatePost=()=>{
    if(privatePage<totalPrivatePage){setPrivatePage((p)=>p+1)}else{setMsg('No more page Available'); setType('Error')}
  }

  const getAllPublicPost= async()=>{
    const token = sessionStorage.getItem('auth-token');
    const response = await fetch(`${baseApi}/api/user/getpublicpost?page=${publicPage}`,{
      method: 'GET',
      headers:{
        'Content-Type':'application/json',
        'Authorization':`Bearer ${token}`
      },

    });
    const data = await response.json();
    if(response.ok){setPublicPost(data.pubPost); setTotalPublicPage(data.totalPage)}
  };

  const handleNextPublicPost=()=>{
    if(publicPage<totalPublicPage){setPublicPage((p)=>p+1)}else{setMsg('No more page Available'); setType('Error')}
  }


  useEffect(()=>{
  getAllPrivatePost();
  getAllPublicPost();
  },[publicPage, privatePage])

  const authorReq= async()=>{
    const token = sessionStorage.getItem('auth-token')
    const response= await fetch(`${baseApi}/api/user/authorrequest`,{
      method: 'POST',
      headers:{
        'Content-Type':'application/json',
         'Authorization': `Bearer ${token}`
       
      },
    });
    const data= await response.json()
    if(response.status===200){setMsg(data.msg); setType('sucess')}
    else if(response.status===500){setMsg(data.msg); setType('Error')}
  }

  const paymentReq=async()=>{
        const token = sessionStorage.getItem('auth-token')
    const response= await fetch(`${baseApi}/api/payment/create-checkout-session`,{
      method: 'POST',
      headers:{
        'Content-Type':'application/json',
         'Authorization': `Bearer ${token}`
       
      },
   
    });
    const data= await response.json()
    if(response.status===200){window.location.href=data.url}
    else if(response.status===500){setMsg(data.msg); setType('Error')}

  };

  const searchPublicPost=async(query,page)=>{
      const token = sessionStorage.getItem('auth-token')
      const response = await fetch(`${baseApi}/api/user/searchpublicpost?query=${query}&page=${page}`,{
          method: 'GET',
          headers:{
          'Content-Type':'application/json',
         'Authorization': `Bearer ${token}`
          }
      });
      const data=await response.json();
      if(response.ok){setPublicSearchData(data.Post); setPublicSearchTotalPage(data.totalPage)}
      else if(response.status===400){setMsg(data.msg); setType('Error')}
       else if(response.status===404){setMsg(data.msg); setType('Error')}
        else if(response.status===500){setMsg(data.msg); setType('Error')}
};
const handleSubmitPublicSearch=()=>{
  setMode(true)
  searchRef.current=publicSearchText
  searchPublicPost(publicSearchText,1)
};

const handleNextPublicSeacrhPost=()=>{
  if(publicSearchPage<publicSearchTotalPage){setPublicSearchPage((p)=>p+1)}else{setMsg('No More Page Available');setType('Error')}
};
useEffect(()=>{
  if(!publicSearchPage || !publicSearchText) return;
  searchPublicPost(searchRef.current, publicSearchPage)
},[publicSearchPage]);


const searchPrivatePost=async(query,page)=>{
      const token = sessionStorage.getItem('auth-token')
      const response = await fetch(`${baseApi}/api/user/searchprivatepost?query=${query}&page=${page}`,{
          method: 'GET',
          headers:{
          'Content-Type':'application/json',
         'Authorization': `Bearer ${token}`
          }
      });
      const data=await response.json();
      if(response.ok){setPrivateSearchData(data.Post); setPrivateSearchTotalPage(data.totalPage)}
      else if(response.status===400){setMsg(data.msg); setType('Error')}
       else if(response.status===404){setMsg(data.msg); setType('Error')}
        else if(response.status===500){setMsg(data.msg); setType('Error')}
};
  const handleSubmitPrivateSearch=()=>{
    searchRef.current=privateSearchText;
    setMode(true)
    searchPrivatePost(privateSearchText,1)
  }
  const handleNextPrivateSeachPost=()=>{
    if(privateSearchPage<privateSearchTotalPage){setPrivateSearchPage((p)=>p+1)}else{setMsg('No more page available')}
  }
  useEffect(()=>{
    if(!privateSearchPage||!privateSearchText) return;
    searchPrivatePost(searchRef.current, privateSearchPage)
  },[privateSearchPage])


  return (
    <>
    {msg&&<Alert message={msg} type={type} onClose={()=>{setMsg('')}}/>}
    <div className='max-w-[1380px] mx-auto overflow-hidden font-[Roboto]'>
      <div className='grid grid-cols-1 lg:hidden '>
      <div className=' max-w-[1380px] overflow-hidden   bg-[#e59bdc] mx-[10px] rounded-2xl mt-[10px] py-[10px]'>
             <div className='grid grid-cols-1 justify-items-center'>
            <h1 className='text-2xl font-semibold'> Become an Author?</h1>
            <p className='text-[10px]'>Share Your Blog Private/Public</p>
            <button onClick={authorReq} className=' mt-[10px] h-[40px] w-[120px] bg-green-500 rounded-2xl text-xl shadow-xl 
          cursor-pointer hover:transform hover:rotate-x-[360deg] duration-2000'>Click Here</button>
          </div>
        </div>
        <div className=' max-w-[1380px] overflow-hidden   bg-[#e59bdc] mx-[10px] rounded-2xl mt-[10px] py-[10px]'>
            <div className='grid grid-cols-1 justify-items-center'>
           <h1 className='text-2xl font-semibold'> Want Membership?</h1>
           <p className='text-[10px]'>*PHP 100 per Month</p>
            <button onClick={paymentReq} className=' mt-[10px] h-[40px] w-[120px] bg-green-500 rounded-2xl text-xl shadow-xl 
          cursor-pointer hover:transform hover:rotate-x-[360deg] duration-2000'>Click Here</button>
          </div>
        </div>
      </div>
  
      <div className='h-[70px] max-w-[1380px] overflow-hidden lg:flex hidden  bg-[#e59bdc] mx-[10px] rounded-2xl mt-[10px]'>
        <div className='flex flex-[50%] border-r items-center justify-center'>
          <div className='flex flex-col items-center'>
            <h1 className='text-3xl font-semibold'> Become an Author?</h1>
            <p className='text-[10px]'>Share Your Blog Private/Public</p>
          </div>
          
          <button onClick={authorReq} className='ml-[20px] h-[50px] w-[180px] bg-green-500 rounded-2xl text-xl shadow-xl 
          cursor-pointer hover:transform hover:rotate-x-[360deg] duration-2000'>Click Here</button>

        </div>
        <div className='flex-[50%] flex items-center justify-center'>
          <div className=' flex flex-col items-center'>
           <h1 className='text-3xl font-semibold'> Want Membership?</h1>
           <p className='text-[10px]'>*PHP 100 per Month</p>
          </div>
        
          <button onClick={paymentReq} className='ml-[20px] h-[50px] w-[180px] bg-green-500 rounded-2xl text-xl shadow-xl 
          cursor-pointer hover:transform hover:rotate-x-[360deg] duration-2000'>Click Here</button>
        </div>
      </div>
    </div>

    <div className='max-w-[1380px] mx-auto overflow-hidden mt-[30px]'>
    <div className='bg-[#BFC6D4] rounded-2xl p-[10px] pb-[30px] mx-[10px]'>
      <div className=' mb-[20px] lg:flex grid grid-cols-1 lg:justify-between justify-items-center mx-[10px]'>
        <p className='text-center text-3xl font-[Roboto] font-bold'>  Public Post</p>
         <div className='flex justify-center items-center mt-[10px] '>
              <input value={publicSearchText} onChange={(e)=>{setPublicSearchText(e.target.value)}} type='search' placeholder='Search By AuthorID' className='border p-[5px] mr-[10px] rounded-2xl shadow-md'/>
              <button onClick={handleSubmitPublicSearch} className=' h-[35px] w-[100px] rounded-2xl text-md bg-[#97f1a6] cursor-pointer shadow-md'>Search</button>
            </div>
      </div> 
      <div className='lg:grid lg:grid-cols-3 md:grid md:grid-cols-2 grid grid-cols-1 justify-items-center gap-y-[20px] '>
        {publicSearchData.length > 0?publicSearchData.map((pubSrc)=>(
          <div key={pubSrc.id}>
        <AllPrivateGlobal title={pubSrc.title} description={pubSrc.description} author={pubSrc.author.name} create={pubSrc.createdAt} update={pubSrc.updatedAt}
        photo={pubSrc.photos} id={pubSrc.id} authorId={pubSrc.author.id} mode={'user'} />
          </div>
        )):
        publicPost.map((pub)=>(
          <div key={pub.id}>
        <AllPrivateGlobal title={pub.title} description={pub.description} author={pub.author.name} create={pub.createdAt} update={pub.updatedAt}
        photo={pub.photos} id={pub.id} authorId={pub.author.id} mode={'user'} />
          </div>
        ))}
       
        </div> 

        {!mode&&<div className='flex justify-between mt-[50px]'>
          <button onClick={()=>{setPublicPage((p)=>p-1, 1)}} disabled={publicPage<=1} className=' lg:h-[50px] h-[40px] lg:w-[150px] w-[120px] rounded-2xl bg-white text-xl mx-[10px] cursor-pointer shadow-lg'>Previous</button>
          <button onClick={handleNextPublicPost} className=' lg:h-[50px] h-[40px] lg:w-[150px] w-[120px] rounded-2xl bg-white text-xl mx-[10px] cursor-pointer shadow-lg'>Next</button>
        </div>}

         {mode&&<div className='flex justify-between mt-[50px]'>
          <button onClick={()=>{setPublicSearchPage((p)=>p-1, 1)}} disabled={publicSearchPage<=1} className=' lg:h-[50px] h-[40px] lg:w-[150px] w-[120px] rounded-2xl bg-white text-xl mx-[10px] cursor-pointer shadow-lg'>Previous</button>
          <button onClick={handleNextPublicSeacrhPost} className=' lg:h-[50px] h-[40px] lg:w-[150px] w-[120px] rounded-2xl bg-white text-xl mx-[10px] cursor-pointer shadow-lg'>Next</button>
        </div>}

      </div>
    </div>

       <div className='mt-[50px]  bg-[#BFC6D4] rounded-2xl p-[10px] font-[Roboto]'>
        <div className='mb-[20px] lg:flex grid grid-cols-1 lg:justify-between justify-items-center mx-[10px] '>
        <p className='text-center text-3xl  font-bold'>Private Post</p>
          <div className='flex justify-center items-center mt-[10px] '>
              <input value={privateSearchText} onChange={(e)=>{setPrivateSearchText(e.target.value)}} type='search' placeholder='Search By authorId' className='border p-[5px] mr-[10px] rounded-2xl shadow-md'/>
              <button onClick={handleSubmitPrivateSearch} className=' h-[35px] w-[100px] rounded-2xl text-md bg-[#97f1a6] cursor-pointer shadow-md'>Search</button>
            </div>
       </div>
        <div className='lg:grid lg:grid-cols-3 md:grid md:grid-cols-2 grid grid-cols-1 gap-y-[20px] justify-items-center '>
       {privateSearchData.length > 0? privateSearchData.map((priSrc)=>(
        <div key={priSrc.id}>
        <AllPrivate title={priSrc.title} description={priSrc.description} author={priSrc.author.name} create={priSrc.createdAt} update={priSrc.updatedAt}
        photo={priSrc.photos} id={priSrc.id} primium={isPrimium} authorId={priSrc.author.id} />
        </div>
       )):
       privatePost.map((pri)=>(
        <div key={pri.id}>
        <AllPrivate title={pri.title} description={pri.description} author={pri.author.name} create={pri.createdAt} update={pri.updatedAt}
        photo={pri.photos} id={pri.id} primium={isPrimium} authorId={pri.author.id}  />
        </div>
       ))}  
        
        </div>

        {!mode&&<div className='flex justify-between mt-[50px]'>
          <button onClick={()=>{setPrivatePage((p)=>p-1, 1)}} disabled={privatePage<=1} className='lg:h-[50px] h-[40px] lg:w-[150px] w-[120px] rounded-2xl bg-white text-xl mx-[10px] cursor-pointer shadow-lg'>Previous</button>
          <button onClick={handleNextPrivatePost} className=' lg:h-[50px] h-[40px] lg:w-[150px] w-[120px] rounded-2xl bg-white text-xl mx-[10px] cursor-pointer shadow-lg'>Next</button>
        </div>}

         {mode&& <div className='flex justify-between mt-[50px]'>
          <button onClick={()=>{setPrivateSearchPage((p)=>p-1, 1)}} disabled={privateSearchPage<=1} className=' lg:h-[50px] h-[40px] lg:w-[150px] w-[120px] rounded-2xl bg-white text-xl mx-[10px] cursor-pointer shadow-lg'>Previous</button>
          <button onClick={handleNextPrivateSeachPost} className=' lg:h-[50px] h-[40px] lg:w-[150px] w-[120px] rounded-2xl bg-white text-xl mx-[10px] cursor-pointer shadow-lg'>Next</button>
        </div>}

      </div>

</>

  )
}

export default User
