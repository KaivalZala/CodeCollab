import React, { useContext } from 'react'
import { assets } from '../assets/assets';
import { AppContent } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const{userData} = useContext(AppContent);

  const navigate = useNavigate();

  const handleClickStarted = ()=>{
    navigate('/userdashboard')
  }

  return (
    <div className='flex flex-col items-center mt-20 px-4 text-center'>
      <img src={assets.header_img} alt="" 
      className='w-36 h-36 rounded-full mb-6 shadow-lg border-4 
                 border-gray-300 bg-gradient-to-b from-gray-100 to-gray-300 
                 animate-floating3D'/>
    <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2'>Hey {userData ? userData.name : 'Developer'}!
        <img className='w-8 aspect-square' src={assets.hand_wave} alt="" />
    </h1>

    <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>Welcome To CodeCollab</h2>
    <p className='mb-8 max-w-md'>🚀 Join the Coding Revolution – 🤝 Collaborate, 📚 Learn, and 💡 Innovate!</p>
    {userData && (
    <button onClick={handleClickStarted} className='border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100 transition-all'>Get Started</button>
    )}
    </div>
  )
}

export default Header


//className='w-36 h-36 rounded-full mb-6 '