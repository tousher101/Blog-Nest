import { createContext,useContext,useEffect,useState } from "react";
  const baseApi= import.meta.env.VITE_API_URI_KEY

const UserInfoContext = createContext();
export const UserProvider = ({children})=>{
    const[userInfo, setUserInfo]=useState('');
 
    const getAllUser= async()=>{
      const token = sessionStorage.getItem('auth-token')
      const headers = token?{'Authorization': `Bearer ${token}`}:{}
    const response = await fetch(`${baseApi}/api/userinfo/getalluser`,{
      method: "GET",
      headers       
    });
    const data = await response.json();

    if(response.ok){setUserInfo(data.User)}
  }
  useEffect(()=>{
    getAllUser()
  },[])

  return (<UserInfoContext.Provider value={{userInfo, setUserInfo, getAllUser,}}>{children}</UserInfoContext.Provider>)
}
export const useUserInfo = ()=>useContext(UserInfoContext)