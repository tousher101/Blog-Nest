import { useEffect, useState } from 'react'
import UserCount from '../../Component/AdminDashboard/UserCount'
import AuthorCount from '../../Component/AdminDashboard/AuthorCount'
import AuthorRequest from '../../Component/AdminDashboard/AuthorRequest'
import Alert from '../../Utils/Alert'
import { useRef } from 'react'
import AllPrivateGlobal from '../../Component/AdminDashboard/AllPrivateGlobal'


function Admin() {

  const [reqAuthor, setReqAuthor]=useState(null);
  const [totalReq, setTotalReq]=useState(null);
  const [msg,setMsg]=useState(null);
  const [type, setType]=useState(null);
  const [allData, setAllData]=useState(null);
  const [allAuthor, setAllAuthor]=useState(null);
  const [allUser, setAllUser]=useState(null);
  const [publicPost, setPublicPost]=useState([]);
  const [totalPublicPage, setTotalPublicPage]=useState()
  const [privatePost, setPrivatePost]=useState([]);
  const [totalPrivatePage, setTotalPrivatePage]=useState();
  const [publicPage, setPublicPage]=useState(1);
  const [privatePage, setPrivatePage]=useState(1);
  const [userPage, setUserPage]=useState(1);
  const [totalUserPage, setTotalUserPage]=useState();
  const [authorPage, setAuthorPage]=useState(1);
  const [totalAuthorPage, setTotalAuthorPage]=useState();
  const [authorReqPage, setAuthorReqPage]=useState(1);
  const [userSearchText, setUserSearchText]=useState('');
  const [userSerchData,setUserSerchData]=useState({});
  const [authorSearchText, setAuthorSearchText]=useState('');
  const [authorSearchData, setAuthorSearchData]=useState({});
  const [authorReqSearchText, setAuthorReqSearchText]=useState('');
  const [authorReqSearchData, setAuthorReqSearchData]=useState({});
  const[publicSerchData, setPublicSearchData]=useState([])
  const [publicSearchText, setPublicSearchText]=useState('');
  const[privateSerchData, setPrivateSearchData]=useState([])
  const [privateSearchText, setPrivateSearchText]=useState('');
  const [privateSearchPage, setPrivateSearchPage]=useState(1);
  const [privateSearchTotalPage, setPrivateSearchTotalPage]=useState(0);
  const [mode, setMode]=useState(false);
  const searchRef = useRef('');
  const [publicSearchPage, setPublicSearchPage]=useState(1);
  const [publicTotoalSearchPage, setpublicTotoalSearchPage]=useState();
  const baseApi= import.meta.env.VITE_API_URI_KEY



  const allAuthorReq= async()=>{
    const token = sessionStorage.getItem('auth-token')
    const response = await fetch(`${baseApi}/api/admin/authorRequest?page=${authorReqPage}`,{
      method:'GET',
      headers:{
         'Content-Type':'application/json',
        'Authorization':`Bearer ${token}`
      }
    });
    const data= await response.json()
    if(response.ok){setReqAuthor(data.authorRequest);setTotalReq(data.totalReq)}
  };
  const handleNextAuthorReq=()=>{
    if(authorReqPage<totalReq){setAuthorReqPage((p)=>p+1)}else{setMsg('No more athour request page');setType('Error')}
  }

  const getAllPublicPost = async()=>{
    const token = sessionStorage.getItem('auth-token')
    const response = await fetch(`${baseApi}/api/admin/getallpublicpost?page=${publicPage}`,{
      method:'GET',
      headers:{
         'Content-Type':'application/json',
        'Authorization':`Bearer ${token}`
      }
    });
    const data =await response.json()
    if(response.ok){setPublicPost(data.allPublicPost);setTotalPublicPage(data.totalPage)}
  };

  const handleNexPublicPost=()=>{
    if(publicPage<totalPublicPage){setPublicPage((p)=>p+1)}else{setMsg('No more page available'); setType('Error')}
  }

  const getAllPrivatePost=async()=>{
     const token = sessionStorage.getItem('auth-token')
    const response = await fetch(`${baseApi}/api/admin/getallprivatepost?page=${privatePage}`,{
      method:'GET',
      headers:{
         'Content-Type':'application/json',
        'Authorization':`Bearer ${token}`
      }
    });
    const data =await response.json()
    if(response.ok){setPrivatePost(data.allPrivatePost);setTotalPrivatePage(data.totalPage)}
  };

  const handleNextPrivate=()=>{
    if(privatePage<totalPrivatePage){setPrivatePage((p)=>p+1)}else{setMsg('No more page available'); setType('Error')}
  }

  const handleDeletePost=async(id)=>{
  const token = sessionStorage.getItem('auth-token');
  const response = await fetch(`${baseApi}/api/admin/deletepost/${id}`,{
    method: 'DELETE',
    headers:{
       'Authorization':`Bearer ${token}`
    }
  });
  const data = await response.json();
  if(response.ok){setMsg(data.msg); setType('success'); getAllPublicPost(); getAllPrivatePost();}
  else if(response.status===404){setMsg(data.msg); setType('Error')}
  else if(response.status===500){setMsg(data.msg); setType('Error')}

  };


  useEffect(()=>{
    const fetchAllData = async()=>{
      try{
        await Promise.all([
           allAuthorReq(),
            allcountData(),
    getAllAuthor(),
     getAllUser(),
    getAllPublicPost(),
    getAllPrivatePost(),
    ]);
      }catch (err){console.error(err)}
    }
    fetchAllData();
   },[userPage, authorReqPage,authorPage,publicPage,privatePage])

  const acceptAuthorReq= async(id)=>{
  const token = sessionStorage.getItem('auth-token')
    const response = await fetch(`${baseApi}/api/admin/approvedauthor/${id}`,{
      method:'PUT',
      headers:{
         'Content-Type':'application/json',
        'Authorization':`Bearer ${token}`
      }
    });
    const data = await response.json();
    if(response.status===200){setMsg(data.msg); setType('success');allAuthorReq(); getAllAuthor()}
    if(response.status === 500) {setMsg(data.msg); setType('Error')}

  };

  const declineAuthorReq= async(id)=>{
    const token = sessionStorage.getItem('auth-token')
    const response = await fetch(`${baseApi}/api/admin/declineauthor/${id}`,{
      method:'PUT',
      headers:{
         'Content-Type':'application/json',
        'Authorization':`Bearer ${token}`
      }
    });
    const data = await response.json();
    if(response.status===200){setMsg(data.msg); setType('success');allAuthorReq()}
    if(response.status === 500) {setMsg(data.msg); setType('Error')}

  };

  const allcountData= async()=>{
    const token = sessionStorage.getItem('auth-token');
     const response = await fetch(`${baseApi}/api/admin/getalldata`,{
      method:'GET',
      headers:{
         'Content-Type':'application/json',
        'Authorization':`Bearer ${token}`
      }
    });
    const data = await response.json();
    if(response.ok){setAllData(data)}

  };

  const getAllAuthor=async()=>{
     const token = sessionStorage.getItem('auth-token');
     const response = await fetch(`${baseApi}/api/admin/allauthor?page=${authorPage}`,{
      method:'GET',
      headers:{
         'Content-Type':'application/json',
        'Authorization':`Bearer ${token}`
      }
    });
    const data = await response.json();
    if(response.ok){setAllAuthor(data.author); setTotalAuthorPage(data.totalPage)}
  };

  const handleNextAuthor=()=>{
    if(authorPage<totalAuthorPage){setAuthorPage((p)=>p+1)}else{setMsg('No more author page available'); setType('Error')}
  }

  const demoteAuthor=async(id)=>{
      const token = sessionStorage.getItem('auth-token')
    const response = await fetch(`${baseApi}/api/admin/roledemotion/${id}`,{
      method:'PUT',
      headers:{
         'Content-Type':'application/json',
        'Authorization':`Bearer ${token}`
      }
    });
    const data = await response.json();
    if(response.status===200){setMsg(data.msg); setType('success');getAllAuthor(); getAllUser()}
    if(response.status === 500) {setMsg(data.msg); setType('Error')}

  };

  const getAllUser=async()=>{
      const token = sessionStorage.getItem('auth-token');
     const response = await fetch(`${baseApi}/api/admin/getuser?page=${userPage}`,{
      method:'GET',
      headers:{
         'Content-Type':'application/json',
        'Authorization':`Bearer ${token}`
      }
    });
    const data = await response.json();
    if(response.ok){setAllUser(data.users);setTotalUserPage(data.totUserPage)}
  };
 


  const handleNextUser=()=>{
    if(userPage<totalUserPage){setUserPage(p=>p+1)}else{setMsg('No more user page available'); setType('Error')}
  }

  const deleteUser=async(id)=>{
      const token = sessionStorage.getItem('auth-token')
    const response = await fetch(`${baseApi}/api/admin/deleteuser/${id}`,{
      method:'DELETE',
      headers:{
         'Content-Type':'application/json',
        'Authorization':`Bearer ${token}`
      }
    });
    const data = await response.json();
    if(response.status===200){setMsg(data.msg); setType('success');getAllUser()}
    else if(response.status === 500) {setMsg(data.msg); setType('Error')}
     else if(response.status === 404) {setMsg(data.msg); setType('Error')}

  };


  const searchUserControllBoard= async (text)=>{
   const token = sessionStorage.getItem('auth-token');
    const response = await fetch(`${baseApi}/api/admin/searchuser?query=${text}`,{
      method: 'GET',
      headers:{
         'Content-Type':'application/json',
        'Authorization':`Bearer ${token}`
      }
    });
    const data = await response.json()
   
    if(response.ok){setUserSerchData(data.User)}
    else if(response.status===400){setMsg(data.msg); setType('Error')}
    else if(response.status===500){setMsg(data.msg); setType('Error')}
      else if(response.status===404){setMsg(data.msg); setType('Error')}
  };

  const handlUserSerchSubmit=()=>{
    searchUserControllBoard(userSearchText);
    setUserSearchText('')
  }

    const searchAuthorControllBoard= async (text)=>{
   const token = sessionStorage.getItem('auth-token');
    const response = await fetch(`${baseApi}/api/admin/searchauthor?query=${text}`,{
      method: 'GET',
      headers:{
         'Content-Type':'application/json',
        'Authorization':`Bearer ${token}`
      }
    });
    const data = await response.json()
   
    if(response.ok){setAuthorSearchData(data.User)}
    else if(response.status===400){setMsg(data.msg); setType('Error')}
    else if(response.status===500){setMsg(data.msg); setType('Error')}
     else if(response.status===404){setMsg(data.msg); setType('Error')}
  };

  const handlAuthorSerchSubmit=()=>{
    searchAuthorControllBoard(authorSearchText);
  setAuthorSearchText('')
  };


  const searchAuthorReqControllBoard= async (text)=>{
   const token = sessionStorage.getItem('auth-token');
    const response = await fetch(`${baseApi}/api/admin/searchauthorreq?query=${text}`,{
      method: 'GET',
      headers:{
         'Content-Type':'application/json',
        'Authorization':`Bearer ${token}`
      }
    });
    const data = await response.json()
   
    if(response.ok){setAuthorReqSearchData(data.User)}
    else if(response.status===400){setMsg(data.msg); setType('Error')}
    else if(response.status===500){setMsg(data.msg); setType('Error')}
     else if(response.status===404){setMsg(data.msg); setType('Error')}
  };
    const handlAuthorReqSerchSubmit=()=>{
    searchAuthorReqControllBoard(authorReqSearchText);
  setAuthorReqSearchText('')
  };

  const searchPublicPost=async(text,page)=>{
  const token = sessionStorage.getItem('auth-token');
    const response = await fetch(`${baseApi}/api/admin/searchpublicpost?query=${text}&page=${page}`,{
      method: 'GET',
      headers:{
         'Content-Type':'application/json',
        'Authorization':`Bearer ${token}`
      }
    });
    const data = await response.json()
    if(response.ok){setPublicSearchData(data.Post);setpublicTotoalSearchPage(data.totalPage)}
    else if(response.status===400){setMsg(data.msg); setType('Error')}
    else if(response.status===500){setMsg(data.msg); setType('Error')}
     else if(response.status===404){setMsg(data.msg); setType('Error')}
  };

  const handleNextPublicSearchPost=()=>{
    if(publicSearchPage<publicTotoalSearchPage){setPublicSearchPage((p)=>p+1)}else{setMsg('No more page available');setType('Error')}
  }

  const handleSubmitPublicPostSearch=()=>{
    setMode(true)
  searchRef.current=publicSearchText
    searchPublicPost(publicSearchText,1);
  };

  useEffect(()=>{
    if(!publicSearchPage||!publicSearchText) return;
    searchPublicPost(searchRef.current, publicSearchPage)
  },[publicSearchPage])

   const searchPrivatePost=async(text,page)=>{
    const token = sessionStorage.getItem('auth-token');
    const response = await fetch(`${baseApi}/api/admin/searchprivatepost?query=${text}&page=${page}`,{
      method: 'GET',
      headers:{
         'Content-Type':'application/json',
        'Authorization':`Bearer ${token}`
      }
    });
    const data = await response.json()

    if(response.ok){setPrivateSearchData(data.Post); setPrivateSearchTotalPage(data.totalPage)}
    else if(response.status===400){setMsg(data.msg); setType('Error')}
    else if(response.status===500){setMsg(data.msg); setType('Error')}
     else if(response.status===404){setMsg(data.msg); setType('Error')}
  };

  const handleSubmitPivatePostSearch=()=>{
  searchRef.current = privateSearchText
    setMode(true)
    searchPrivatePost(privateSearchText,1);


  };

  useEffect(()=>{
    if(!privateSearchText||!privateSearchPage) return;
     searchPrivatePost(searchRef.current, privateSearchPage)
  },[privateSearchPage])

  const handleNextSearchPrivatePost = ()=>{
    if(privateSearchPage<privateSearchTotalPage){setPrivateSearchPage((p)=>p+1)}else{setMsg('No more Page Available');setType('Error')}
  };

 

  return (
    <>
    {msg&&<Alert message={msg} type={type} onClose={()=>{setMsg('')}}/>}
    <section className='max-w-[1380px] h-full mx-auto overflow-hidden  bg-[#4E5766] p-[20px]'>
     <div className='text-center lg:text-4xl text-3xl  font-[Roboto] text-[#ebf1e2] font-bold mb-[25px]'><p>Admin Dashboard</p></div> 
    
     <div className='flex bg-[#F0F1F5] rounded-2xl mx-[10px] mb-[15px] p-[10px] justify-around'>
      <div className='flex lg:text-xl text-sm font-semibold'><h1>Total Post : {allData?.totalPost}</h1></div>
      <div className='flex lg:text-xl text-sm font-semibold'><h1>Total Premium Membar : {allData?.totalpremium}</h1></div>
     </div>

      <header className='lg:grid lg:grid-cols-3 md:grid md:grid-cols-2 grid grid-cols-1 gap-[10px] '>
        <div className='  p-[15px]  bg-[#F0F1F5] rounded-2xl '>
          <div className='text-center'>
            <p className='font-[Roboto] lg:text-2xl text-xl  font-semibold'>User Details</p>
            <p className='font-[Roboto] lg:text-xl text-sm font-semibold'>Total User: {allData?.totalUser}</p>
            <div className='flex justify-center items-center mt-[10px]'>
              <input value={userSearchText} onChange={(e)=>{setUserSearchText(e.target.value)}} type='search' placeholder='Search By ID' className='border p-[5px] mr-[10px] rounded-2xl shadow-md'/>
              <button onClick={handlUserSerchSubmit} className=' h-[35px] w-[100px] rounded-2xl text-md bg-[#97f1a6] cursor-pointer shadow-md '>Search</button>
            </div>
       
          </div>
          {userSerchData&&userSerchData.id ? <UserCount name={userSerchData.name} email={userSerchData.email} deluser={()=>{deleteUser(userSerchData.id)}} id={userSerchData.id}/>:allUser?.map((user)=>(
            <div key={user.id}>
               <UserCount name={user.name} email={user.email} deluser={()=>{deleteUser(user.id)}} id={user.id}/>
            </div>
          ))}
          <div className='flex justify-between mx-[10px] mt-[15px]'>
            <button onClick={()=>{setUserPage((p)=>p-1, 1)}} disabled={userPage<=1} className=' cursor-pointer h-[30px] w-[100px] rounded-2xl bg-green-400'>Previous</button>
            <button onClick={handleNextUser} className=' h-[30px] w-[100px] rounded-2xl bg-green-400 cursor-pointer'>Next</button>
          </div>
          
        </div>


       <div className=' p-[15px] bg-[#F0F1F5] rounded-2xl '>
        <div className='text-center'>
            <p className='font-[Roboto] lg:text-2xl text-xl font-semibold'>Author Details</p>
            <p className='font-[Roboto] lg:text-xl text-sm font-semibold'>Total Author: {allData?.totalAuthor}</p>
             <div className='flex justify-center items-center mt-[10px]'>
              <input value={authorSearchText} onChange={(e)=>{setAuthorSearchText(e.target.value)}} type='search' placeholder='Search By ID' className='border p-[5px] mr-[10px] rounded-2xl shadow-md'/>
              <button onClick={handlAuthorSerchSubmit} className=' h-[35px] w-[100px] rounded-2xl text-md bg-[#97f1a6] cursor-pointer shadow-md'>Search</button>
            </div>
        </div>
        { authorSearchData&&authorSearchData.id? <AuthorCount name={authorSearchData.name} email={authorSearchData.email} demote={()=>{demoteAuthor(authorSearchData.id)}} id={authorSearchData.id}/>:
        allAuthor?.map((auth)=>(
          <div key={auth.id}>
          <AuthorCount name={auth.name} email={auth.email} demote={()=>{demoteAuthor(auth.id)}} id={auth.id}/>
          </div>
        ))
        }
         <div className='flex justify-between mx-[10px] mt-[15px]'>
            <button onClick={()=>{setAuthorPage((p)=>p-1, 1)}} disabled={authorPage<=1} className=' cursor-pointer h-[30px] w-[100px] rounded-2xl bg-green-400'>Previous</button>
            <button onClick={handleNextAuthor} className=' cursor-pointer h-[30px] w-[100px] rounded-2xl bg-green-400'>Next</button>
          </div>
          
        </div>

       <div className='p-[15px] bg-[#F0F1F5] rounded-2xl '>
         <div className='text-center'>
             <p className='font-[Roboto] lg:text-2xl text-xl font-semibold'>Author Request</p>
             <p className='font-[Roboto] lg:text-xl text-sm font-semibold'>Total Request: {totalReq}</p>
              <div className='flex justify-center items-center mt-[10px]'>
              <input value={authorReqSearchText} onChange={(e)=>{setAuthorReqSearchText(e.target.value)}} type='search' placeholder='Search By ID' className='border p-[5px] mr-[10px] rounded-2xl shadow-md'/>
              <button onClick={handlAuthorReqSerchSubmit} className=' h-[35px] w-[100px] rounded-2xl text-md bg-[#97f1a6] cursor-pointer shadow-md'>Search</button>
            </div>
        </div>
        { authorReqSearchData&&authorReqSearchData.id?<AuthorRequest name={authorReqSearchData.name} email={authorReqSearchData.email} id={authorReqSearchData.id} accept={()=>{acceptAuthorReq(authorReqSearchData.id)}} decline={()=>{declineAuthorReq(authorReqSearchData.id)}}/>:
        reqAuthor?.map((req)=>(
          <div key={req.id}>
             <AuthorRequest name={req.name} email={req.email} id={req.id} accept={()=>{acceptAuthorReq(req.id)}} decline={()=>{declineAuthorReq(req.id)}}/>
          </div>
          ))}
         <div className='flex justify-between mx-[10px] mt-[15px]'>
            <button onClick={()=>{setAuthorReqPage((p)=> p-1, 1)}} disabled={authorReqPage<=1} className=' cursor-pointer h-[30px] w-[100px] rounded-2xl bg-green-400'>Previous</button>
            <button onClick={handleNextAuthorReq} className=' cursor-pointer h-[30px] w-[100px] rounded-2xl bg-green-400'>Next</button>
          </div>
        </div>
      </header>

      <main className=' mt-[50px] '>
     <div className='text-center lg:text-4xl  text-3xl font-[Roboto] font-bold text-[#ebf1e2]  mb-[25px] '>
      <h1> Author Post</h1>
      </div>   

      <div className='bg-[#BFC6D4] rounded-2xl p-[10px] pb-[30px]'>
      <div className=' mb-[20px] lg:flex lg:justify-between grid justify-items-center mx-[10px]'>
        <p className='text-center lg:text-4xl text-3xl  font-[Roboto] font-bold'>  Public Post</p>
         <div className='flex justify-center items-center  mt-[10px] '>
              <input value={publicSearchText} onChange={(e)=>{setPublicSearchText(e.target.value)}} type='search' placeholder='Search By Author-ID' className='border p-[5px] mr-[10px] rounded-2xl shadow-md'/>
              <button onClick={handleSubmitPublicPostSearch} className=' h-[35px] w-[100px] rounded-2xl text-md bg-[#97f1a6] cursor-pointer shadow-md'>Search</button>
            </div>
      </div> 
      <div className='lg:grid lg:grid-cols-3 md:grid md:grid-cols-2 grid grid-cols-1 justify-items-center gap-y-[20px] '>
        {publicSerchData.length>0 ? publicSerchData.map((pubsrc)=>(
          <div key={pubsrc.id}>
          <AllPrivateGlobal title={pubsrc.title} description={pubsrc.description} author={pubsrc.author.name} authorId={pubsrc.author.id}
          id={pubsrc.id} authorEmail={pubsrc.author.email} create={pubsrc.createdAt} update={pubsrc.updatedAt} photo={pubsrc.photos}
          deletePost={()=>{handleDeletePost(pubsrc.id)}} mode={'admin'}/>
          </div>

        )):
         publicPost?.map((pub)=>(
          <div key={pub.id}>
          <AllPrivateGlobal title={pub.title} description={pub.description} author={pub.author.name} authorId={pub.author.id}
          id={pub.id} authorEmail={pub.author.email} create={pub.createdAt} update={pub.updatedAt} photo={pub.photos}
          deletePost={()=>{handleDeletePost(pub.id)}} mode={'admin'}/>
          </div>
        ))}
      
        </div> 

          {!mode&& <div className='flex justify-between mt-[50px]'>
          <button onClick={()=>{setPublicPage((p)=>p -1, 1)}} disabled={publicPage<=1} className=' lg:h-[50px] lg:w-[150px] h-[40px] w-[120px] lg:rounded-2xl rounded-xl bg-white text-xl mx-[10px] cursor-pointer shadow-lg'>Previous</button>
          <button onClick={handleNexPublicPost} className=' lg:h-[50px] lg:w-[150px] h-[40px] w-[120px] lg:rounded-2xl rounded-xl bg-white text-xl mx-[10px] cursor-pointer shadow-lg'>Next</button>
        </div>}

        {mode&&<div className='flex justify-between mt-[50px]'>
          <button onClick={()=>{setPublicSearchPage((p)=>p -1, 1)}} disabled={publicSearchPage<=1} className=' lg:h-[50px] lg:w-[150px] h-[40px] w-[120px] lg:rounded-2xl rounded-xl bg-white text-xl mx-[10px] cursor-pointer shadow-lg'>Previous</button>
          <button onClick={ handleNextPublicSearchPost} className=' lg:h-[50px] lg:w-[150px] h-[40px] w-[120px] lg:rounded-2xl rounded-xl bg-white text-xl mx-[10px] cursor-pointer shadow-lg'>Next</button>
        </div>}
      </div>

        <div className='mt-[50px]  bg-[#BFC6D4] rounded-2xl p-[10px] font-[Roboto]'>
        <div className='mb-[20px] lg:flex lg:justify-between grid grid-cols-1 mx-[10px] '>
        <p className='text-center lg:text-4xl text-3xl  font-bold'>Private Post</p>
          <div className='flex justify-center items-center mt-[10px] '>
              <input value={privateSearchText} onChange={(e)=>{setPrivateSearchText(e.target.value)}}  type='search' placeholder='Search By Author-ID' className='border p-[5px] mr-[10px] rounded-2xl shadow-md'/>
              <button onClick={ handleSubmitPivatePostSearch} className=' h-[35px] w-[100px] rounded-2xl text-md bg-[#97f1a6] cursor-pointer shadow-md'>Search</button>
            </div>
       </div>
       <div className='lg:grid lg:grid-cols-3 md:grid md:grid-cols-2 grid grid-cols-1 gap-y-[20px] justify-items-center '>
        {privateSerchData.length > 0? privateSerchData.map((prisear)=>(
           <div key={prisear.id}>
          <AllPrivateGlobal title={prisear.title} description={prisear.description} author={prisear.author.name} authorId={prisear.author.id}
          id={prisear.id} authorEmail={prisear.author.email} create={prisear.createdAt} update={prisear.updatedAt} photo={prisear.photos} deletePost={()=>{handleDeletePost(prisear.id)}} mode={'admin'}/>
          </div>
        )):
          privatePost?.map((pri)=>(
          <div key={pri.id} >
          <AllPrivateGlobal title={pri.title} description={pri.description} author={pri.author.name} authorId={pri.author.id}
          id={pri.id} authorEmail={pri.author.email} create={pri.createdAt} update={pri.updatedAt} photo={pri.photos} deletePost={()=>{handleDeletePost(pri.id)}} mode={'admin'}/>
          </div>
        ))}
        
         
        </div>

       { !mode&&<div className='flex justify-between mt-[50px]'>
         <button onClick={()=>{setPrivatePage(p=>p -1, 1)}} disabled={privatePage<=1}className=' lg:h-[50px] lg:w-[150px] h-[40px] w-[120px] lg:rounded-2xl rounded-xl bg-white text-xl mx-[10px] cursor-pointer shadow-lg'>Previous</button>
          <button onClick={handleNextPrivate} className=' lg:h-[50px] lg:w-[150px] h-[40px] w-[120px] lg:rounded-2xl rounded-xl bg-white text-xl mx-[10px] cursor-pointer shadow-lg'>Next</button> 
          </div>}

          {mode&&<div className='flex justify-between mt-[50px]'>
           <button onClick={()=>{setPrivateSearchPage((p)=>p-1, 1)}} disabled={privateSearchPage<=1}className=' lg:h-[50px] lg:w-[150px] h-[40px] w-[120px] lg:rounded-2xl rounded-xl bg-white text-xl mx-[10px] cursor-pointer shadow-lg'>Previous</button>
          <button onClick={handleNextSearchPrivatePost} className=' lg:h-[50px] lg:w-[150px] h-[40px] w-[120px] lg:rounded-2xl rounded-xl bg-white text-xl mx-[10px] cursor-pointer shadow-lg'>Next</button>
        </div>}
      </div>
      </main>
    </section>
    </>
  )
}

export default Admin
