
import Alert from '../../Utils/Alert'
import { useState } from 'react'
import { useEffect } from 'react';
import ChangePhotoModal from '../../Component/AuthorDashboard/ChangePhotoModal'
import ChangePhotoModalPrivate from '../../Component/AuthorDashboard/ChangePhotoModalprivate'
import AllPrivateGlobal from '../../Component/AdminDashboard/AllPrivateGlobal';




function Author() {
  const [msg , setMsg]=useState(null);
  const [type, setType]=useState(null);
  const [title,setTitle]=useState('');
  const [description, setDescription]=useState('');
  const [content, setContent]=useState('');
  const [photo, setPhoto]=useState(null);
  const [publicblog,setPublicBlog]=useState([]);
  const [privateblog, setPrivateBlog]=useState([]);
  const [imgModal, setImgModal]=useState(false);
   const [imgModalprivate, setImgModalprivate]=useState(false);
   const [publicPostId, setPublicPostId]=useState(null);
   const [privatePostId, setPrivatePostId]=useState(null);
   const [newPhoto, setNewPhoto]=useState(null);
   const [pagePublic, setPagePublic]=useState(1);
   const [totalPagePublic, setTotalPagePublic]=useState();
   const [pagePrivate, setPagePrivate]=useState(1)
   const [totalPagPrivate, setTotalPagePrivate]=useState();
   const [publicSearchData,setPublicSearchData]=useState({});
   const [publicSearchText, setPublicSearchText]=useState('');
   const [privateSearchText, setPrivateSearchText]=useState('')
   const [privateSercheData, setPrivateSearchData]=useState({});
   const [uploadPreview, setUploadPreview]=useState(null);
   const baseApi= import.meta.env.VITE_API_URI_KEY


const handleChangePhoto=async(id)=>{
   const token = sessionStorage.getItem('auth-token');
   const formData= new FormData()
   formData.append('photos', newPhoto)

    const response = await fetch(`${baseApi}/api/author/uploadnewphoto/${id}`,{
      method: 'PUT',
      headers:{
        'Authorization':`Bearer ${token}`
      },
      body:formData
    });
    const data = await response.json()
    if(response.ok){setMsg(data.msg); setType('success'); getAllPbulicBlog(); getAllPrivateBlog()}
    else if (response.status===404){setMsg(data.msg); setType('Error')}
      else if (response.status===500){setMsg(data.msg); setType('Error')}
}

const handleDeleteBlog=async(id)=>{
    const token = sessionStorage.getItem('auth-token');
    const response = await fetch(`${baseApi}/api/author/deleteauthorpost/${id}`,{
      method: 'DELETE',
      headers:{
        'Authorization':`Bearer ${token}`
      }
    });
    const data = await response.json()
    if(response.ok){setMsg(data.msg); setType('success'); getAllPbulicBlog(); getAllPrivateBlog()}
    else if (response.status===404){setMsg(data.msg); setType('Error')}
      else if (response.status===500){setMsg(data.msg); setType('Error')}
}

const getAllPrivateBlog = async()=>{
    const token = sessionStorage.getItem('auth-token');
  const response = await fetch(`${baseApi}/api/author/getallprivateblogs?page=${pagePrivate}`,{
    method: 'GET',
    headers:{
      'Content-Type':'application/json',
       'Authorization':`Bearer ${token}`
    }
  });
  const data = await response.json();
  if(response.ok){setPrivateBlog(data.allprivateblog); setTotalPagePrivate(data.totalPage)}
};

const handleNextPrivatePost=()=>{
  if(pagePrivate<totalPagPrivate){setPagePrivate((p)=>p+1)}else{setMsg('No more page available'); setType('Error')}
}


  const getAllPbulicBlog=async()=>{
  const token = sessionStorage.getItem('auth-token');
  const response = await fetch(`${baseApi}/api/author/getallpublicblogs?page=${pagePublic}`,{
    method: 'GET',
    headers:{
      'Content-Type':'application/json',
       'Authorization':`Bearer ${token}`
    }
  });
  const data = await response.json();
  if(response.ok){setPublicBlog(data.allpublicblog); setTotalPagePublic(data.totalPage)}
  }
  const handleNextPublicPost=()=>{
if(pagePublic<totalPagePublic){setPagePublic((p)=>p+1)}else{setMsg('No more page available'); setType('Error')}
  }


useEffect(()=>{
  getAllPbulicBlog();
  getAllPrivateBlog();
  
},[pagePublic,pagePrivate])

  const postBlog= async(visibilityValue)=>{
    const foremData = new FormData();
    foremData.append('title',title);
    foremData.append('description', description);
    foremData.append('content', content);
    foremData.append('photos',photo);
    foremData.append('visibility', visibilityValue)
    const token = sessionStorage.getItem('auth-token');
    const response = await fetch(`${baseApi}/api/author/addblog`,{
      method: 'POST',
      headers:{

        'Authorization':`Bearer ${token}`
      },
      body:foremData
    });

    const data = await response.json();
    if(response.ok){setMsg(data.msg); setType('success');getAllPbulicBlog();getAllPrivateBlog();}
      else if (response.status===500){setMsg(data.msg); setType('Error')}
      else if (response.status===400){setMsg(data.msg); setType('Error')}
      else if (response.status===401){setMsg(data.msg); setType('Error')}
      else if (response.status===402){setMsg(data.msg); setType('Error')}
  };

  const handlePublicPost=(e)=>{
    e.preventDefault();
    postBlog('PUBLIC');
    setTitle('');
    setDescription('');
    setPhoto(null);
    setContent('');
    setUploadPreview('');
  };
  const handlePrivatePost=(e)=>{
    e.preventDefault();
    postBlog('PRIVATE');
      setTitle('');
    setDescription('');
    setPhoto(null);
    setContent('');
    setUploadPreview('');
  };

  const submitUploadPhotoPublic=()=>{
    handleChangePhoto(publicPostId)
      setImgModal(false);
    
   
  };
  
  const submitUploadPhotoPrivate=()=>{
    handleChangePhoto(privatePostId)
      setImgModalprivate(false);
    
   
  };
  const handleImgModalOpen = ()=>{
    setImgModal(true)
  };

  const handleImgModalClose= ()=>{
    setImgModal(false)
  };

    const handleImgModalOpenPrivate = ()=>{
    setImgModalprivate(true)
  };

  const handleImgModalClosePrivate= ()=>{
    setImgModalprivate(false)
  };

  const searchPublicPost= async(id)=>{
      const token = sessionStorage.getItem('auth-token');
      const response = await fetch(`${baseApi}/api/author/searchpublicpost?query=${id}`,{
        method: 'GET',
        headers:{
        'Content-Type':'application/json',
       'Authorization':`Bearer ${token}`
        }
      });
      const data = await response.json();
      if(response.ok){setPublicSearchData(data)}
      else if (response.status===400){setMsg(data.msg); setType('Error')}
       else if (response.status===404){setMsg(data.msg); setType('Error')}
        else if (response.status===500){setMsg(data.msg); setType('Error')}
  };
  const handleSearchPublicSubmit=()=>{
    searchPublicPost(publicSearchText)
    setPublicSearchText('')
  };


  const searchPrivatePost= async(id)=>{
      const token = sessionStorage.getItem('auth-token');
      const response = await fetch(`${baseApi}/api/author/searchprivatepost?query=${id}`,{
        method: 'GET',
        headers:{
        'Content-Type':'application/json',
       'Authorization':`Bearer ${token}`
        }
      });
      const data = await response.json();
      if(response.ok){setPrivateSearchData(data)}
      else if (response.status===400){setMsg(data.msg); setType('Error')}
       else if (response.status===404){setMsg(data.msg); setType('Error')}
        else if (response.status===500){setMsg(data.msg); setType('Error')}
  };
  const handleSearchPrivateSubmit=()=>{
 searchPrivatePost(privateSearchText)
    setPrivateSearchText('')
  };



  return (
    <>
    {msg&&<Alert message={msg} type={type} onClose={()=>{setMsg('')}}/>}
    <div className='max-w-[1380px] mx-auto overflow-hidden font-[Roboto] mt-[50px]'>
     <h1 className='text-center lg:text-4xl text-3xl font-bold '>Welcome To Author Dashboard</h1>
      <div className='bg-[#E0E4EB] grid grid-cols-1 mt-[30px] p-[15px] gap-y-[15px] rounded-2xl mx-[10px]'>
        <h1 className='text-center text-3xl font-bold'>Post Blog</h1>
        <input value={title} onChange={(e)=>{setTitle(e.target.value)}} type='text' placeholder='Post Title' className='border p-[10px] rounded-2xl'/>
        <input value={description} onChange={(e)=>{setDescription(e.target.value)}} type='text' placeholder='Short Description' className='border p-[10px] rounded-2xl ' />
        <textarea value={content} onChange={(e)=>{setContent(e.target.value)}} placeholder='Main Content' className='border rounded-2xl p-[10px]'/>
        <input accept='image/*' onChange={(e)=>{setPhoto(e.target.files[0]); setUploadPreview(URL.createObjectURL(e.target.files[0]))}} type='file' className='hidden' id='upload'/>
        <label htmlFor='upload' className='flex justify-center'>
            <div className='h-[40px] w-[120px] border text-center bg-blue-500 text-white rounded-2xl cursor-pointer hover:scale-110 duration-1000'><p className='mt-[8px]'>Upload Photo</p></div>
        </label>
         <div className='text-center'> {uploadPreview}</div>

    
          <div className='flex justify-center mt-[20px]'>
          <button onClick={handlePrivatePost} className='border h-[40px] w-[120px] bg-blue-500 text-white rounded-2xl cursor-pointer hover:scale-110 duration-1000'>Post Private</button>
          <button onClick={handlePublicPost} className='border h-[40px] w-[120px] bg-blue-500 text-white rounded-2xl ml-[25px] cursor-pointer hover:scale-110 duration-1000'>Post Public</button>
        </div>
      </div>
    </div>

    <div className='max-w-[1380px] mx-auto overflow-hidden mt-[30px]'>
    <div className='bg-[#BFC6D4] rounded-2xl p-[10px] pb-[30px] mx-[10px]'>
      <div className=' mb-[20px] lg:flex lg:justify-between  grid grid-cols-1 justify-items-center mx-[10px]'>
        <p className='text-center text-3xl font-[Roboto] font-bold'>  Public Post</p>
         <div className='flex justify-center items-center mt-[10px] '>
              <input value={publicSearchText} onChange={(e)=>{setPublicSearchText(e.target.value)}} type='search' placeholder='Search By PostID' className='border p-[5px] mr-[10px] rounded-2xl shadow-md'/>
              <button onClick={ handleSearchPublicSubmit} className=' h-[35px] w-[100px] rounded-2xl text-md bg-[#97f1a6] cursor-pointer shadow-md'>Search</button>
            </div>
      </div> 
      <div className='lg:grid lg:grid-cols-3 md:grid md:grid-cols-2 grid grid-cols-1 justify-items-center gap-y-[20px] '>

        {publicSearchData&&publicSearchData.id?<AllPrivateGlobal title={publicSearchData.title} description={publicSearchData.description} photo={publicSearchData.photos} createDate={publicSearchData.createdAt} id={publicSearchData.id}
          update={publicSearchData.updatedAt} delblog={()=>{handleDeleteBlog(publicSearchData.id)}} openImgModal={handleImgModalOpen} mode={'author'} /> 
          :
          publicblog?.map((pub)=>(
          <div key={pub.id} onClick={()=>{setPublicPostId(pub.id)}}>
          <AllPrivateGlobal title={pub.title} description={pub.description} photo={pub.photos} createDate={pub.createdAt} id={pub.id}
          update={pub.updatedAt} delblog={()=>{handleDeleteBlog(pub.id)}} openImgModal={handleImgModalOpen} mode={'author'} />
          </div>
        ))}
      
        
        </div> 
        <div className='flex justify-between mt-[50px]'>
          <button onClick={()=>{setPagePublic((p)=>p-1, 1)}} disabled={pagePublic<=1} className=' lg:h-[50px] lg:w-[150px] h-[40px] w-[120px] rounded-2xl bg-white text-xl mx-[10px] cursor-pointer shadow-lg'>Previous</button>
          <button onClick={handleNextPublicPost} className=' lg:h-[50px] lg:w-[150px] h-[40px] w-[120px] rounded-2xl bg-white text-xl mx-[10px] cursor-pointer shadow-lg'>Next</button>
        </div>
      </div>
    </div>

       <div className='mt-[50px]  bg-[#BFC6D4] rounded-2xl p-[10px] font-[Roboto]'>
        <div className='mb-[20px] lg:flex lg:justify-between grid grid-cols-1 mx-[10px] '>
        <p className='text-center text-3xl  font-bold'>Private Post</p>
          <div className='flex justify-center items-center mt-[10px] '>
              <input value={privateSearchText} onChange={(e)=>{setPrivateSearchText(e.target.value)}} type='search' placeholder='Search By PostID' className='border p-[5px] mr-[10px] rounded-2xl shadow-md'/>
              <button onClick={handleSearchPrivateSubmit} className=' h-[35px] w-[100px] rounded-2xl text-md bg-[#97f1a6] cursor-pointer shadow-md'>Search</button>
            </div>
       </div>
       <div className='lg:grid lg:grid-cols-3 md:grid md:grid-cols-2 grid grid-cols-1 gap-y-[20px] justify-items-center '>
        {
        privateSercheData&&privateSercheData.id ? <div key={privateSercheData.id} onClick={()=>{setPrivatePostId(privateSercheData.id)}}>
         <AllPrivateGlobal title={privateSercheData.title} description={privateSercheData.description} photo={privateSercheData.photos} createDate={privateSercheData.createdAt} id={privateSercheData.id}
          update={privateSercheData.updatedAt} delblog={()=>{handleDeleteBlog(privateSercheData.id)}} openImgModal={handleImgModalOpenPrivate} mode={'author'}/>
          </div> :
        privateblog?.map((pri)=>(
          <div key={pri.id} onClick={()=>{setPrivatePostId(pri.id)}}>
         <AllPrivateGlobal title={pri.title} description={pri.description} photo={pri.photos} createDate={pri.createdAt} id={pri.id}
          update={pri.updatedAt} delblog={()=>{handleDeleteBlog(pri.id)}} openImgModal={handleImgModalOpenPrivate} mode={'author'}/>
          </div>
        ))}
        </div>
        <div className='flex justify-between mt-[50px]'>
          <button onClick={()=>{setPagePrivate((p)=>p-1, 1)}} disabled={pagePrivate<=1} className=' lg:h-[50px] lg:w-[150px] h-[40px] w-[120px] rounded-2xl bg-white text-xl mx-[10px] cursor-pointer shadow-lg'>Previous</button>
          <button onClick={handleNextPrivatePost} className='lg:h-[50px] lg:w-[150px] h-[40px] w-[120px] rounded-2xl bg-white text-xl mx-[10px] cursor-pointer shadow-lg'>Next</button>
        </div>
      </div>

      {imgModal&&<ChangePhotoModal cancle={handleImgModalClose} submit={submitUploadPhotoPublic} OnCha={(e)=>{setNewPhoto(e.target.files[0])}} />}
      {imgModalprivate&&<ChangePhotoModalPrivate cancle={handleImgModalClosePrivate} onCha={(e)=>{setNewPhoto(e.target.files[0])}} submit={submitUploadPhotoPrivate}/>}
  
    </>
  )
}

export default Author
