import { Link } from 'react-router-dom';
import like from '../../assets/like-icon.svg'
import dislike from '../../assets/dislike-icon.svg'
import comment from '../../assets/comment.svg'
import { useState, useEffect } from 'react';
import noPhoto from '../../assets/noimage.png'

function AllPrivateGlobal({title, description, author, authorId, id,authorEmail,create,update,photo, deletePost, mode,
  delblog, openImgModal, createDate
}) {

    const createData = new Date(create).toDateString();
  const updateDate = new Date(update).toDateString();
  const [privateLike, setPrivateLike]=useState(0);
const [privateDislike, setPrivateDislike]=useState(0);
const [privateComment, setPrivateComment]=useState(0);
  const baseApi= import.meta.env.VITE_API_URI_KEY

   const getCountLikeDislike=async(id)=>{
 const token = sessionStorage.getItem('auth-token');
 const response = await fetch(`${baseApi}/api/userintraction/getlike-dislike/${id}`,{
  method:'GET',
  headers:{
    'Authorization':`Bearer ${token}`
  }
 });
 const data = await response.json()
 if(response.ok){setPrivateLike(data.countLike);setPrivateDislike(data.countDislike)}
  };

  const getCommentCount=async(id)=>{
     const token = sessionStorage.getItem('auth-token');
 const response = await fetch(`${baseApi}/api/userintraction/countcomment/${id}`,{
  method:'GET',
  headers:{
    'Authorization':`Bearer ${token}`
  }
 });
 const data=await response.json()
 if(response.ok){setPrivateComment(data)}
  }

  useEffect(()=>{
    getCountLikeDislike(id)
    getCommentCount(id)
  },[])

  return (
    <>
  <div className=' grid grid-cols-1 bg-[#E0E4Eb] rounded-2xl shadow-lg'>
        <div className='overflow-hidden'>
            <img className=' p-[10px] rounded-2xl' src={photo||noPhoto} alt='privateCardPhoto' />
        </div>
        { mode === 'admin' &&<div className='font-[Roboto] p-[20px] text-md break-words overflow-auto'>
         <p className='font-semibold'>Title : {title}</p>
          <p>Description : {description}</p>
          <p>Post-ID : {id}</p>
          <p>Author-ID : {authorId}</p>
          <p>Author : {author} </p>
          <p>Author-Email : {authorEmail} </p>
          <p>Create Date : {createData}</p>
          <p>Last Updated : {updateDate} </p>
        </div>}

          {mode ==='author'&&  <div className='font-[Roboto] p-[20px] text-md break-words overflow-auto'>
          <p className='font-semibold'>Title: {title}</p>
          <p>Description: {description}</p>
          <p>Create Date: {new Date(createDate).toDateString()}</p>
          <p>Last Update: {updateDate}</p>
          <p>Post-ID: {id} </p>
        </div>}

        {mode==='user'&&   <div className='font-[Roboto] p-[20px] text-md break-words overflow-auto'>
          <p className='font-semibold'>Title: {title}</p>
          <p>Description: {description}</p>
          <p>Author: {author}</p>
          <p>Author-ID: {authorId}</p>
          <p>Create Date: {createData}</p>
          <p>Last Update: {updateDate}</p>
        </div>}



        <div className='flex mb-[15px] justify-around items-center'>
          <div> <img className='h-[30px] w-[30px]' src={like}/> <p>{(privateLike.likeCount)}</p>  </div>
          <div><img className='h-[30px] w-[30px]' src={dislike}/> <p>{(privateDislike.dislikeCount)}</p>  </div>
          <div><img className='h-[30px] w-[30px]' src={comment}/> <p>{(privateComment)}</p>  </div>
        </div>
        {mode ==='admin'&&
        <div className='flex justify-center'>
          <button onClick={deletePost} className='shadow-lg h-[40px] w-[120px] mb-[15px] bg-red-600 text-white mr-[20px] rounded-2xl cursor-pointer '>Delete</button>
          <Link to={`show-admin-post/${id}`}>
          <button className=' h-[40px] w-[120px] bg-[#79eb6f]  rounded-2xl cursor-pointer shadow-lg'>Read Full</button>
          </Link>
        </div>}

        {  mode ==='author' &&  <div className='flex justify-between mx-[10px] items-center'>
                  <button onClick={delblog} className=' shadow-lg lg:h-[40px] h-[35px] lg:w-[120px] w-[100px] mb-[15px] bg-red-600 text-white  rounded-2xl cursor-pointer '>Delete</button>
                  <Link to={`edit-post/${id}`}>
                  <button className='shadow-lg lg:h-[40px] h-[35px] lg:w-[120px] w-[100px] mb-[15px] bg-amber-400 rounded-2xl cursor-pointer '>Edit</button>
                  </Link>
                  <button onClick={openImgModal} className='shadow-lg lg:h-[40px] h-[35px] w-[120px] mb-[15px] bg-green-400 rounded-2xl cursor-pointer '>Change Photo</button>
                </div>}

               { mode === 'author'&& <div>
                   <Link to={`show-post/${id}`}>
                    <div className='flex justify-center mb-[10px] mx-[10px]'>
                  <button className=' w-[400px] bg-[#e98484] py-[10px] rounded-2xl cursor-pointer shadow-lg mb-[20px]'>Read Full
                  </button></div>
                  </Link>
                  </div>}

       {mode === 'user'&&<div>
         <Link to={`show-public-post/${id}`}>
            <div className='flex justify-center mb-[10px] mx-[10px]'>
          <button className=' w-[400px] bg-[#e98484] py-[10px] rounded-2xl cursor-pointer shadow-lg mb-[15px]'>Read Full
          </button></div>
          </Link>
        </div>}


      
    </div>
    </>
  )
}

export default AllPrivateGlobal
