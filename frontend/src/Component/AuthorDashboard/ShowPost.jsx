
import { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import sendIcon from '../../assets/send-icon.svg'
import UserIcone from '../../assets/profile.png'
import Alert from '../../Utils/Alert'

function ShowPost() {
    const {id}=useParams()
    const [displayPost, setDisplayPost]=useState(null);
    const navigator = useNavigate();
    const [getComment, setGetComment]=useState([]);
    const [countComment, setCountComment]=useState(0);
    const [comment, setComment]=useState('');
    const [msg, setMsg]=useState(null);
    const [type, setType]=useState(null);
    const [commentPage, setCommentPage]=useState(1);
    const [commentTotalPage, setCommentTotalPage]=useState(null);
    const baseApi= import.meta.env.VITE_API_URI_KEY

     const follow = async(targetUserId)=>{
        const token = sessionStorage.getItem('auth-token');
        const response = await fetch(`${baseApi}/api/userintraction/follow/${targetUserId}`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${token}`

            }
        });
        const data = await response.json();
        if(response.ok){setMsg(data.msg); setType('Success')}
        else if(response.status===400){setMsg(data.msg); setType('Error')}
        else if(response.status===500){setMsg(data.msg); setType('Error')}
       
    };

 const getAllComments=async(id,page)=>{
           const token = sessionStorage.getItem('auth-token');
           const response=await fetch(`${baseApi}/api/userintraction/getcomment/${id}?page=${page}`,{
            method: 'GET',
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${token}`
            },
           });
           const data=await response.json();
           if(response.ok){setGetComment(data.comment);setCountComment(data.totalComment); setCommentTotalPage(data.totalPage)}
    };
    const handleCommentNext=()=>{
        if(commentPage<commentTotalPage){setCommentPage((p)=>p+1)}else{setMsg('No More Comment'); setType('Error')}
    }


    const commentAuthor = async(id)=>{
           const token = sessionStorage.getItem('auth-token');
           const response = await fetch(`${baseApi}/api/userintraction/commentpost/${id}`,{
            method: 'POST',
            headers:{
                'Content-Type':'application/json',
                'Authorization':`Bearer ${token}`
            },
            body:JSON.stringify({comment})
           });
           const data=await response.json()
           if(response.ok){setMsg(data.msg); setType('Success');getAllComments(id)}
            else if(response.status===400){setMsg(data.msg); setType('Error')}
            else if(response.status===404){setMsg(data.msg); setType('Error')}
            else if(response.status===500){setMsg(data.msg); setType('Error')}
    };
    const handleSubmitComment=()=>{
        commentAuthor(id);
        setComment('')
    };

    

    const getallPost = async()=>{
        const token = sessionStorage.getItem('auth-token');
        const response= await fetch(`${baseApi}/api/author/getallpublicshow/${id}`,{
            method: 'GET',
            headers:  {
                'Authorization':`Bearer ${token}`
            } 
        });
        const data=await response.json()
        if(response.ok){setDisplayPost(data)}
    }
    useEffect(()=>{
        getallPost()
        getAllComments(id, commentPage)
    },[commentPage])


    const createDate = new Date(displayPost?.createdAt).toDateString();
    const updateDate = new Date(displayPost?.updatedAt).toDateString();

    const handleCancel = ()=>{
        navigator('/home/athuordashboard')

    }
  return (
    <>
        {msg&&<Alert message={msg} type={type} onClose={()=>{setMsg('')}}/>}
    <div className='max-w-[1380px] mx-auto grid grid-cols-1 font-[Roboto]'>
        <div className='lg:flex grid'>
        <div className='flex-[60%]'>
        < h1 className='text-2xl bg-[#F0F1F5] font-semibold mt-[20px] p-[10px] mx-[10px] rounded-2xl'>Title : {displayPost?.title} </h1>
        <p className='text-xl bg-[#E0E4EB] mt-[15px] p-[10px] mx-[10px] rounded-2xl'>Description : {displayPost?.description}</p>
        </div>


        <div className='flex-[40%]  mt-[20px] bg-[#E0E4EB] rounded-2xl p-[15px] mx-[10px]'>
            <p className='text-center text-2xl font-semibold'>Post Details</p>
            <p>Post-ID : {displayPost?.id}</p>
            <p>Author-Name : {displayPost?.author.name}</p>
            <p>Author-ID : {displayPost?.author.id}</p>
            <p>Author-Email : {displayPost?.author.email}</p>
            <p>Create Date : {createDate}</p>
            <p>Last Update : {updateDate} </p>
            <p>Post-Type : {displayPost?.visibility} </p>
            <p>Total View: {displayPost?.viewCount}</p>
          

        </div>

        </div>
    
       
        <div className='bg-[#BFC6D4] text-md  mt-[15px] mb-[15px] p-[10px] mx-[10px] rounded-2xl'>
            <p>Full Content : {displayPost?.content}</p>
        </div>

        <div className='bg-amber-300 mx-[10px] rounded-2xl p-[15px]'>
                    <h1 className='text-2xl font-semibold mb-[15px]'>Comments({countComment})</h1>
                    {getComment?.map((com)=>(
                         <div key={com.id} className='grid grid-cols-1 bg-[#BFC6D4] mb-[15px] rounded-2xl p-[15px]'>
                        <div className='flex items-center'>
                            <div className=''>
                            <img className='h-[40px] w-[40px] rounded-3xl' src={com?.user.photos || UserIcone}/>
                        </div>
                        <div className='ml-[10px] '>
                            <p className='lg:text-xl text-sm font-semibold '>{com.user.name} <span className='lg:text-sm text-[10px] text-gray-500'>@{com.user.role}</span><button onClick={()=>{follow(com.user.id)}}  className=' h-[30px] w-[70px] font-normal text-sm ml-[10px] rounded-xl cursor-pointer bg-blue-500 text-white'>Follow</button></p>
                        </div>
                        </div>
                        <div className='mt-[10px]'><p className='text-md'>{com.comment}</p></div>
                        <div className='flex mt-[10px] items-center'>
                            <p className='text-[10px]'>{new Date(com.createdAt).toDateString()}</p>
                        </div>
                    </div>
        
                    ))}
                    <div className='flex justify-between mx-[10px] mb-[10px]'>
                <button onClick={()=>{setCommentPage((p)=>p-1, 1)}} disabled={commentPage<=1} className='border lg:h-[50px] h-[40px] lg:w-[180px] w-[120px] rounded-2xl cursor-pointer font-semibold shadow-md'>Previous</button>
                <button onClick={handleCommentNext} className='border lg:h-[50px] h-[40px] lg:w-[180px] w-[120px] rounded-2xl cursor-pointer font-semibold shadow-md'>Next</button>
                </div>
                    
                    <div className='flex  bg-[#F0F1F5] p-[15px] rounded-2xl max-w-[1380px] mx-auto justify-center'>
                        <div className='flex w-full flex-[95%]'>
                            <input value={comment} onChange={(e)=>{setComment(e.target.value)}} className='p-[5px] w-full ' type='text' placeholder='Write Your Comment'/>
                        </div>
                            <button onClick={handleSubmitComment} className='flex-[5%]  flex justify-center items-center cursor-pointer'><img className='h-[25px] w-[25px] ' src={sendIcon}/></button>
                    </div>
                </div>
        

        <div className='flex justify-center mt-[10px] mb-[10px]'>
            <button onClick={handleCancel} className=' h-[45px] w-[150px] bg-blue-500 rounded-2xl text-xl cursor-pointer'>Cancle</button>
        </div>
    
    </div>
    </>
  )
}

export default ShowPost
