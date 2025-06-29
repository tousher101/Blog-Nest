
import upload from '../../assets/upload.gif'

function ChangePhotoModal({cancle, submit,OnCha}) {
    

  return (
  <div className={`fixed top-0 left-0 h-full w-full bg-[rgba(0,0,0,0.5)] flex justify-center items-center z-50`}>
        <div className={`grid justify-items-center center content-center items-center bg-white p-[25px] rounded-2xl w-[500px] text-center text-black`}>
            <p className='text-4xl font-bold'>Upload Your Photo</p>
           <input type='file' accept='image/*' id='image' className='hidden' onChange={OnCha}/>
           <label htmlFor='image'>
            <div className='flex flex-col justify-center items-center'>
                <img className='h-[200px] w-[200px] cursor-pointer ' src={upload}/>
            </div>
           </label>

         
             <button onClick={submit} className=' h-[45px] w-[180px] text-xl bg-blue-500 rounded-2xl font-semibold cursor-pointer mb-[15px]'>Upload</button>
            <button onClick={cancle} className=' h-[45px] w-[180px] text-xl bg-blue-500 rounded-2xl font-semibold cursor-pointer'>Cancel</button>
        </div>

    </div>
  )
}

export default ChangePhotoModal
