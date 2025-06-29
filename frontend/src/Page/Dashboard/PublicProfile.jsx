import { useEffect, useState } from 'react'
import UserIcone from '../../assets/profile.png'
import { useUserInfo } from '../../Context/UserInfo';
import Alert from '../../Utils/Alert';

function PublicProfile() {
    const [switchPhone, setSwitchPhone]=useState(false);
    const [switchAddress, setSwitchAddress]=useState(false);
    const [switchGender, setSwitchGender]=useState(false);
    const [switchBio, setSwitchBio]=useState(false);
    const [switchIntersted, setSwitchIntersted]=useState(false);
    const {userInfo, getAllUser}=useUserInfo();
    const [phone,setPhone]=useState('');
    const [address, setAddress]=useState('');
    const [bio, setBio]=useState('');
    const [gender, setGender]=useState('');
    const [interested, setInterested]=useState('');
    const [msg, setMsg]=useState(null);
    const [type, setType]=useState(null);
    const [allFollower, setAllFollower]=useState([]);
    const [allFollowing, setAllFollowing]=useState([]);
    const [totalFollower, setTotalFollower]=useState(0);
    const [totalFollowing, setTotalFollowing]=useState(0);
    const [followerPage, setFollowePage]=useState(1);
    const [totalFollowerPage, setTotalFollowerPage]=useState()
    const [followingPage, setFollowingPage]=useState(1);
    const [totalFollowingPage, setTotalFollowingPage]=useState();
    const baseApi= import.meta.env.VITE_API_URI_KEY

    const unfollowUser=async(targetuserId)=>{
         const token = sessionStorage.getItem('auth-token')
         const response = await fetch(`${baseApi}/api/userintraction/unfollow/${targetuserId}`,{
            method:'DELETE',
            headers:{'Authorization':`Bearer ${token}`}
         });
         const data= await response.json()
         if(response.ok){setMsg(data.msg); setType('sucess'); getAllFollowing()}
         else if( response.status===400||500){setMsg(data.msg); setType('Error')}
         }

    const getAllFollowing=async(page)=>{
         const token = sessionStorage.getItem('auth-token')
        const response = await fetch(`${baseApi}/api/userintraction/getfollowing?page=${page}`,{
            method:'GET',
            headers:{'Authorization':`Bearer ${token}`}
        });
        const data = await response.json();
        if(response.ok){setAllFollowing(data.getfollowing); setTotalFollowing(data.total); setTotalFollowingPage(data.totalPage)}

    }

    const getAllFollower=async(page)=>{
        const token = sessionStorage.getItem('auth-token')
        const response = await fetch(`${baseApi}/api/userintraction/getfollower?page=${page}`,{
            method:'GET',
            headers:{'Authorization':`Bearer ${token}`}
        });
        const data = await response.json();
        if(response.ok){setAllFollower(data.getfollower); setTotalFollower(data.total); setTotalFollowerPage(data.totalPage)}
    };

    useEffect(()=>{
        getAllFollower(followerPage);
        getAllFollowing(followingPage);
    },[followerPage, followingPage])


    const handleNextFollower=()=>{
        
        if(followerPage<totalFollowerPage){setFollowePage((p)=>p+1)}else{setMsg('No More Page Available');setType('Error')}
    }

    const handleNextFollowing=()=>{
        if(followingPage<totalFollowingPage){setFollowingPage((p)=>p+1)}else{setMsg('No More Page Available');setType('Error')}
    }


    const updateUserPhone=async()=>{
        const token = sessionStorage.getItem('auth-token')
        const response= await fetch(`${baseApi}/api/user/userphoneupdate`,{
            method: 'PUT',
            headers:{
                'Content-Type':'application/json',
                 'Authorization':`Bearer ${token}`
            },
            body:JSON.stringify({phone})
        });
        const data = await response.json()
        if(response.ok){setMsg(data.msg); setType('Success'); getAllUser()}
        else if(response.status===404){setMsg(data.msg); setType('Error')}
         else if(response.status===400){setMsg(data.msg); setType('Error')}
        else if(response.status===500){setMsg(data.msg); setType('Error')}
    }

    const handleSubmitPhone=()=>{
        updateUserPhone()
        setSwitchPhone(false);
    };


     const updateUserAddress=async()=>{
        const token = sessionStorage.getItem('auth-token')
        const response= await fetch(`${baseApi}/api/user/useraddressupdate`,{
            method: 'PUT',
            headers:{
                'Content-Type':'application/json',
                 'Authorization':`Bearer ${token}`
            },
            body:JSON.stringify({address})
        });
        const data = await response.json()
        if(response.ok){setMsg(data.msg); setType('Success'); getAllUser()}
        else if(response.status===404){setMsg(data.msg); setType('Error')}
         else if(response.status===400){setMsg(data.msg); setType('Error')}
        else if(response.status===500){setMsg(data.msg); setType('Error')}
    }

    const handleSubmitAddress=()=>{
        updateUserAddress()
        setSwitchAddress(false);
    };

      const updateUserGender=async()=>{
        const token = sessionStorage.getItem('auth-token')
        const response= await fetch(`${baseApi}/api/user/usergenderupdate`,{
            method: 'PUT',
            headers:{
                'Content-Type':'application/json',
                 'Authorization':`Bearer ${token}`
            },
            body:JSON.stringify({gender})
        });
        const data = await response.json()
        if(response.ok){setMsg(data.msg); setType('Success'); getAllUser()}
        else if(response.status===404){setMsg(data.msg); setType('Error')}
         else if(response.status===400){setMsg(data.msg); setType('Error')}
        else if(response.status===500){setMsg(data.msg); setType('Error')}
    }

    const handleSubmitGender=()=>{
        updateUserGender()
        setSwitchGender(false);
    };

       const updateUserBio=async()=>{
        const token = sessionStorage.getItem('auth-token')
        const response= await fetch(`${baseApi}/api/user/userbioupdate`,{
            method: 'PUT',
            headers:{
                'Content-Type':'application/json',
                 'Authorization':`Bearer ${token}`
            },
            body:JSON.stringify({bio})
        });
        const data = await response.json()
        if(response.ok){setMsg(data.msg); setType('Success'); getAllUser()}
        else if(response.status===404){setMsg(data.msg); setType('Error')}
         else if(response.status===400){setMsg(data.msg); setType('Error')}
        else if(response.status===500){setMsg(data.msg); setType('Error')}
    }

    const handleSubmitBio=()=>{
        updateUserBio()
        setSwitchBio(false);
    };

           const updateUserInterested=async()=>{
        const token = sessionStorage.getItem('auth-token')
        const response= await fetch(`${baseApi}/api/user/userinterestedupdate`,{
            method: 'PUT',
            headers:{
                'Content-Type':'application/json',
                 'Authorization':`Bearer ${token}`
            },
            body:JSON.stringify({interested})
        });
        const data = await response.json()
        if(response.ok){setMsg(data.msg); setType('Success'); getAllUser()}
         else if(response.status===400){setMsg(data.msg); setType('Error')}
        else if(response.status===404){setMsg(data.msg); setType('Error')}
        else if(response.status===500){setMsg(data.msg); setType('Error')}
    }

    const handleSubmitInterested=()=>{
        updateUserInterested()
        setSwitchIntersted(false);
    };

  return (
    <>
    {msg&&<Alert message={msg} type={type} onClose={()=>{setMsg('')}}/>}
    <section className='max-w-[1380px] mx-auto overflow-hidden'>
        <header className='max-w-[1380px] mx-auto h-[100px] bg-[#667085] flex items-center justify-around'>
            <div className=''>
                <img className='lg:h-[80px] lg:w-[80px] h-[60px] w-[60px] rounded-4xl' src={userInfo.photos || UserIcone} alt='profilePhoto'/>
            </div>
            <div className='flex items-center'>
                <h1 className='lg:text-3xl text-xl lg:mr-[10px] font-semibold'>{userInfo.name}</h1>
            </div>
            <div className='lg:flex grid '>
                <p className='lg:mr-[30px] lg:text-xl text-sm font-semibold'>Follower: {totalFollower}</p>
                <p className='lg:text-xl text-sm font-semibold'>Following: {totalFollowing}</p>
            </div>
         
        </header>

        <main className='max-w-[1380px] mx-auto mt-[10px]'>
            <div className='max-w-[1380px] mx-[10px] grid grid-rows-3 gap-[10px] '>
                <div className='bg-[#D1D6E0] p-[10px] rounded-2xl grid gap-[10px] font-semibold '>
                    <h1 className='text-center text-2xl font-semibold '>Profile</h1>
                    <h2 className='bg-[#667085] p-[10px] rounded-2xl shadow-sm'>User-ID: {userInfo.id}</h2>
                    <h2 className='bg-[#667085] p-[10px] rounded-2xl shadow-sm' >Role: {userInfo.role}</h2>
                    <h2 className='bg-[#667085] p-[10px] rounded-2xl shadow-sm'>Email: {userInfo.email}</h2>
                    <h2 className='bg-[#667085] p-[10px] rounded-2xl shadow-sm'>Primium: {userInfo.isPrimium?'Yes':'No'}</h2>
                    <h2 className='bg-[#667085] p-[10px] rounded-2xl shadow-sm'>Verified: {userInfo.isVerified?'Yes':'No'}</h2>
                    <div className='flex items-center bg-[#667085] p-[10px] rounded-2xl shadow-sm'>
                        <h2 className='flex-[70%]'>Phone: {userInfo.phone || 'N/A'}</h2>
                        <button onClick={()=>{setSwitchPhone(true)}} className=' flex-[30%] h-[30px] w-[120px] rounded-2xl border cursor-pointer'>Set Phone</button>
                    </div>
                     {switchPhone&& <div className='flex'>
                        <input type='number' value={phone} onChange={(e)=>{setPhone(e.target.value)}} placeholder='Set Phone Number' className='border mr-[15px] px-[5px] w-full rounded-2xl'/>
                        <button onClick={handleSubmitPhone} className='h-[30px] w-[120px] rounded-2xl border cursor-pointer'>Set</button>
                        </div>}
                  
                    <div className='flex items-center bg-[#667085] p-[10px] rounded-2xl shadow-sm'>
                     <h2 className='flex-[70%]'>Address: {userInfo.address || 'N/A'}</h2>
                    <button onClick={()=>{setSwitchAddress(true)}} className=' flex-[30%] h-[30px] w-[120px] rounded-2xl border cursor-pointer'>Set Address</button>
                    
                    </div>
                      {switchAddress&&<div className='flex'>
                        <input type='text' value={address} onChange={(e)=>{setAddress(e.target.value)}} placeholder='Set Address' className='border mr-[15px] px-[5px] w-full rounded-2xl'/>
                        <button onClick={handleSubmitAddress}  className='h-[30px] w-[120px] rounded-2xl border cursor-pointer'>Set</button>
                        </div> }

                    <div  className='flex items-center bg-[#667085] p-[10px] rounded-2xl shadow-sm'>
                        <h2 className='flex-[70%]'>Gender: {userInfo.gender || 'N/A'}</h2>
                        <button onClick={()=>{setSwitchGender(true)}} className=' flex-[30%] h-[30px] w-[120px] rounded-2xl border cursor-pointer'>Set Gender</button>
                    </div>
                         {switchGender&&<div className='flex'>
                        <input type='text' value={gender} onChange={(e)=>{setGender(e.target.value)}} placeholder='Set Address' className='border mr-[15px] px-[5px] w-full rounded-2xl'/>
                        <button onClick={handleSubmitGender}  className='h-[30px] w-[120px] rounded-2xl border cursor-pointer'>Set</button>
                        </div> }

                      <div  className='flex items-center bg-[#667085] p-[10px] rounded-2xl shadow-sm'>
                        <h2 className='flex-[70%]'>Bio: {userInfo.bio || 'N/A'}</h2>
                        <button onClick={()=>{setSwitchBio(true)}} className='flex-[30%] h-[30px] w-[120px] rounded-2xl border cursor-pointer'>Set Bio</button>
                    </div>
                        {switchBio&&<div className='flex'>
                        <input type='text' value={bio} onChange={(e)=>{setBio(e.target.value)}} placeholder='Set Bio' className='border mr-[15px] px-[5px] w-full rounded-2xl'/>
                        <button onClick={handleSubmitBio}  className='h-[30px] w-[120px] rounded-2xl border cursor-pointer'>Set</button>
                        </div>}

                      <div  className='flex items-center bg-[#667085] p-[10px] rounded-2xl shadow-sm'>
                        <h2 className='flex-[70%]'>Interested: {userInfo.interested || 'N/A'}</h2>
                        <button onClick={()=>{setSwitchIntersted(true)}} className=' flex-[30%] h-[30px] w-[130px] rounded-2xl border cursor-pointer text-sm'>Set Intersted</button>
                    </div>
                      {switchIntersted&&<div className='flex'>
                        <input type='text' value={interested} onChange={(e)=>{setInterested(e.target.value)}} placeholder='Seperate By Comma' className='border mr-[15px] px-[5px] w-full rounded-2xl'/>
                        <button onClick={handleSubmitInterested}  className='h-[30px] w-[120px] rounded-2xl border cursor-pointer'>Set</button>
                        </div>}
                </div>

                
                      <div className='  bg-[#667085]  rounded-2xl'>
                    <h1 className='text-2xl text-center my-[15px] font-semibold'>Following</h1>
                    <div className='grid gap-[10px]'>
                         {allFollowing.map((folloing)=>(
                        <div key={folloing.following.id} className='flex items-center  bg-[#D1D6E0] my-auto mx-[10px] p-[10px] rounded-2xl'>
                        <img className='h-[40px] w-[40px] rounded-3xl mr-[15px]' alt='userprofilephoto' src={folloing.following.photos||UserIcone}/>
                        <p className='text-xl '>{folloing.following.name}  <span className=' lg:text-xs text-[10px]'>@{folloing.following.role}</span></p>
                        <button onClick={()=>{unfollowUser(folloing.following.id)}} className='lg:h-[35px] lg:w-[120px] h-[30px] w-[80px] rounded-2xl border lg:ml-[50px] ml-[10px] lg:text-[18px] text-xs cursor-pointer'>Unfollow</button>
                    </div>
                     ))}
                    </div>
                    <div className='flex justify-between my-[15px] mx-[15px]'>
                        <button onClick={()=>{setFollowingPage((p)=>p-1, 1)}} disabled={followingPage<=1} className=' bg-blue-500 text-white h-[40px] w-[120px] cursor-pointer rounded-2xl'>Previous</button>
                        <button onClick={handleNextFollowing} className=' bg-blue-500 text-white h-[40px] w-[120px] cursor-pointer rounded-2xl'>Next</button>
                    </div>
                </div>

                
               
                     <div  className='bg-[#D1D6E0] rounded-2xl'>
                    <h1 className='text-2xl text-center my-[15px] font-semibold'>Follower</h1>
                    <div className='grid gap-[10px]'>
                         {allFollower.map((follo)=>(
                    <div key={follo.follower.id} className='flex bg-[#667085] items-center my-auto mx-[10px] p-[10px] rounded-2xl'>
                        <img className='h-[40px] w-[40px] rounded-3xl mr-[15px]' alt='userprofilephoto' src={follo.follower.photos||UserIcone}/>
                        <p className='text-xl'>{follo.follower.name}</p>
                        <p className='ml-[5px] lg:text-xs text-[10px]'>@{follo.follower.role}</p>
                    </div>
                        ))}
                    </div>
                     <div className='flex justify-between my-[15px] mx-[15px]'>
                        <button onClick={()=>{setFollowePage((p)=>p-1, 1)}} disabled={followerPage<=1} className=' bg-blue-500 text-white h-[40px] w-[120px] cursor-pointer rounded-2xl'>Previous</button>
                        <button onClick={handleNextFollower} className=' bg-blue-500 text-white h-[40px] w-[120px] cursor-pointer rounded-2xl'>Next</button>
                    </div>
                </div>
            
             


            </div>

        </main>
      
    </section>
    </>
  )
}

export default PublicProfile
