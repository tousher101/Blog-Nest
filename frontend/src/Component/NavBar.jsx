import {  useState } from 'react'
import logo from '../assets/logo2.webp'
import userIcon from '../assets/profile.png'
import CropperModal from '../Utils/PhotoCroper/CropperModal'
import Alert from '../Utils/Alert'
import { useNavigate } from 'react-router-dom'
import { useUserInfo } from '../Context/UserInfo'




function NavBar() {
  const [cropper, setCropper]=useState(false);
  const [msg, setMsg]=useState('');
  const [type, setType]=useState('');
  const {userInfo, getAllUser}=useUserInfo();
  const navigator=useNavigate();
  const baseApi= import.meta.env.VITE_API_URI_KEY


  const openCropperModal =()=>{
    setCropper(true)
  }
  const closeCropperModel =()=>{
    setCropper(false)
  }

  const handleLogout=()=>{
    sessionStorage.removeItem('auth-token')
  navigator( '/signin')
  }

  const handleProfileButton = ()=>{
navigator(`publicprofile/${userInfo.id}`)
  }

  const uploadPhoto= async(blob)=>{
    const token = sessionStorage.getItem('auth-token')
    const formData = new FormData()
    formData.append('photos', blob)
    const response = await fetch(`${baseApi}/api/userinfo/uploaduserphoto`,{
      method: 'PUT',
      headers:{
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    const data= await response.json();
    if(response.status===200){setMsg(data.msg); setType('success'),getAllUser()}
     else if(response.status===401){setMsg(data.msg);setType('Error')}
    else if(response.status===404){setMsg(data.msg);setType('Error')}
     else if(response.status===500){setMsg(data.msg);setType('Error')}
  };

   

  return (
    <>
    {msg&&<Alert message={msg} type={type} onClose={()=>{setMsg('')}}/>}
      <nav>
    <div className='max-w-[1380px] mx-auto h-[100px] bg-[#0D9488] font-[Roboto] lg:flex lg:items-center lg:justify-center  
    md:flex md:items-center md:justify-center relative overflow-visible z-[999] ' >
        <img className='lg:h-[100px] md:h-[80px] h-[60px] ' src={logo} alt='logo'/>
        <div className='flex items-center font-bold'>
        <p className='lg:text-2xl text-md text-[#d2d7e4] lg:ml-[0px] md:ml-[0px] ml-[20px]'>Share Your Blog Free!</p>
        </div>
    </div>


    <aside className=''>
          <input type='checkbox' className='hidden peer' id='togg'/>
          <label htmlFor='togg' className='top-0 right-0'>
          <img className=' top-5 right-5 h-[60px] w-[60px] cursor-pointer  absolute z-[999] rounded-4xl ' src={userInfo.photos || userIcon} alt='profilephoto'/>
          </label>
          <div className='  top-[100px]  right-0 bg-[#D1D6E0]  h-[270px] w-[300px] transition-transform duration-1000 -translate-y-full
          peer-checked:translate-y-0 rounded-b-2xl  absolute'>
             <div className=' mt-[15px] p-[15px] font-[Roboto]  break-words overflow-auto '>
              <p className='text-xl text-center font-semibold'> {userInfo.name} </p>
              <p className='text-xs text-center'>@{userInfo.role}</p>
              <div className='mt-[15px] flex flex-col justify-center'>
              <button onClick={handleProfileButton} className='bg-[#E0E4EB] p-[10px] font-semibold rounded-xl cursor-pointer hover:scale-105 duration-1000 mb-[10px]'>Profile </button>
              <button onClick={openCropperModal}  className='bg-[#E0E4EB] p-[10px] font-semibold rounded-xl cursor-pointer hover:scale-105 duration-1000'>Upload Profile Photo</button>
              <button onClick={handleLogout} className=' p-[10px] mt-[15px] rounded-xl bg-[#E0E4EB] font-semibold  cursor-pointer hover:scale-105 duration-1000'>Sign Out</button>
              </div>
              
             </div>
          </div>
        </aside>
        </nav>

        {cropper&&<CropperModal cancel={closeCropperModel} onUpload={uploadPhoto}/>}
     
    </>
  )
}

export default NavBar
