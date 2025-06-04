import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import axios from 'axios'
import { toast } from 'react-toastify';
import eyeOpenIcon from '../assets/see.svg'; 
import eyeClosedIcon from '../assets/hide.svg';



const Login = () => {

  const navigate = useNavigate()

  const {backendUrl, setIsLoggedin, getUserData} = useContext(AppContent)

  const [state, setState] = useState('Sign Up')
  const [name, SetName] = useState('')
  const [email, SetEmail] = useState('')
  const [password, SetPassword] = useState('')
  //new change
  const [retypePassword, setRetypePassword] = useState(''); // New state for retype password
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [vibrate, setVibrate] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [showRetypePassword, setShowRetypePassword] = useState(false); // State to toggle retype password visibility
  //end of new change


  //neew change 
  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };


  // Function to validate password strength
  const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(password);
  };


  const handlePasswordKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (!isValidPassword(password)) {
        e.preventDefault(); // Prevent form submission
        setShowPasswordError(true);
        triggerVibration();
      }
    }
  };
  


    // Handle password input change
    const handlePasswordChange = (e) => {
      const newPassword = e.target.value;
      SetPassword(newPassword);
  
      // Validate password and enable retype field if valid
      if (isValidPassword(newPassword)) {
        setIsPasswordValid(true);
        setShowPasswordError(false);
      } else {
        setIsPasswordValid(false);
        setRetypePassword(""); // Reset retype password field if password is invalid
      }
    };

      // Trigger password requirement message when user leaves password input
  const handlePasswordBlur = () => {
    if (!isPasswordValid) {
      setShowPasswordError(true);
      triggerVibration();
    }else {
      setShowPasswordError(false); // Hide error when the password is valid
    }
  };



const triggerVibration = () => {
  setVibrate(false); // Reset immediately
  setTimeout(() => {
    setVibrate(true); // Start vibration
    setTimeout(() => setVibrate(false), 600); // Keep vibrating for 600ms
  }, 100); // Small delay before reapplying to ensure effect triggers
};



  

  //end of new change
  

  const onSubitHandler = async (e)=>{
    try{
      e.preventDefault();
      axios.defaults.withCredentials = true

      if(state === 'Sign Up'){
        //new chahge
        if (!isValidEmail(email)) {
          toast.error("Invalid email format");
          return;
        } 
        
          // Validate password strength
          if (!isValidPassword(password)) {
            toast.error("Password must be at least 8 characters, contain one uppercase letter, and one number.");
            return;
          }
  
          // Check if passwords match
          if (password !== retypePassword) {
            toast.error("Passwords do not match.");
            return;
          }
        //end of new change
        const { data } = await axios.post(`${backendUrl}/api/auth/register`, {
          name,
          email,
          password,
          retypePassword // Ensure this is included if needed
      }, {
          headers: { "Content-Type": "application/json" }
      });
      
          if(data.success){
            setIsLoggedin(true)
            getUserData()
            navigate('/')
          }else{
            toast.error(data.message)
          }
      }else{


                  if (email === "admin@gmail.com" && password === "Admin123456") {
                    localStorage.setItem('token', 'admin_token'); // ✅ Store admin token
                    localStorage.setItem('role', 'admin');
                    toast.success("Admin logged in successfully");
                    navigate('/admin'); // ✅ Redirect to Admin Dashboard
                    window.location.reload(); // ✅ Ensure state is refreshed
                    return;
                  }
                  

        const {data} = await axios.post(backendUrl + '/api/auth/login', {email,password})
        if(data.success){
          localStorage.setItem("token", data.token);
          setIsLoggedin(true)
          getUserData()
          navigate('/')
          window.location.reload();
        }else{
          toast.error(data.message)
        }
      }
    } catch (error){
      toast.error(error.message)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
        setIsLoggedin(true);
        getUserData();
        navigate("/");
    }
}, [setIsLoggedin, getUserData, navigate]);



  

  return (
    <div className='flex items-center justify-center min-h-screen px-4 sm:px-6 md:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
      <img onClick={()=>navigate('/')} src={assets.logo} alt="" className='absolute left-2 xs:left-4 sm:left-20 top-3 xs:top-5 w-20 xs:w-24 sm:w-28 md:w-32 cursor-pointer ' />
      <div className='bg-slate-900 p-4 xs:p-6 sm:p-10 rounded-lg shadow-lg w-full max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg text-indigo-300 text-xs xs:text-sm'>
        <h2 className='text-xl xs:text-2xl sm:text-3xl font-semibold text-white text-center mb-2 xs:mb-3'>{state === 'Sign Up' ? 'Create Account' :'Login'}</h2>
        <p className='text-center text-xs sm:text-sm mb-4 xs:mb-6'>{state === 'Sign Up' ? 'Create your account' :'Login in to your account!'}</p>
        <form onSubmit={onSubitHandler}>
          {state === 'Sign Up' && (
            <>
            {/* Name input (only for Sign up) */}
            <div className='mb-4 flex items-center gap-3 w-full px-4 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.person_icon} alt="" />
            <input 
            onChange={e => SetName(e.target.value)} 
            value={name} 
            className='bg-transparent outline-none w-full' 
            type="text" 
            placeholder='Full Name' required />
          </div>
          </>
          )}
          {/* email input */}
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.mail_icon} alt="" />
            <input 
            onChange={e => SetEmail(e.target.value)} 
            value={email}
            className='bg-transparent outline-none' 
            type="email" 
            placeholder='Email id' required />
          </div>

          {/* Password input with Show/Hide Option */}
<div className={`mb-4 flex items-center gap-2 xs:gap-3 w-full px-3 xs:px-4 py-2 xs:py-2.5 rounded-full bg-[#333A5C] ${vibrate ? 'shake' : ''} relative`}>
  <img src={assets.lock_icon} alt="" />
  <input
    onChange={handlePasswordChange}
    onBlur={handlePasswordBlur}
    onKeyDown={handlePasswordKeyPress} // Add this to detect Enter keypress
    value={password}
    className='bg-transparent outline-none flex-1 pr-10' 
    type={showPassword ? 'text' : 'password'}
    placeholder='Password' 
    required 
  />
  <span 
    className='absolute right-3 text-white cursor-pointer' onClick={() => setShowPassword(!showPassword)}>
   <img 
    src={showPassword ? eyeOpenIcon : eyeClosedIcon} 
    alt="Toggle Password" 
    className="w-5 h-5"
  />
  </span>
</div>


          {/* Password Requirements Message */}
          {state === 'Sign Up' && showPasswordError && !isPasswordValid && (
            <p className="text-xs text-red-400 mb-4 px-2 shake">
              Password must be at least <b>8 characters</b> long, contain <b>one uppercase letter</b>, and <b>one number</b>.
            </p>
          )}
            {/* retype password Input (only for Sign Up) */}

          {state === 'Sign Up' && (
            <div className='mb-4 flex items-center gap-2 xs:gap-3 w-full px-4 xs:px-5 py-2 xs:py-2.5 rounded-full bg-[#333A5C] relative'>
              <img src={assets.lock_icon} alt="" />
              <input
                onChange={e => setRetypePassword(e.target.value)}
                value={retypePassword}
                className='bg-transparent outline-none flex-1 pr-10'
                type={showRetypePassword ? 'text' : 'password'}
                placeholder='Retype Password'
                required
                disabled={!isPasswordValid}
              />
              <span 
                className='absolute right-3 text-white cursor-pointer ' onClick={() => setShowRetypePassword(!showRetypePassword)}>
                   <img 
    src={showRetypePassword ? eyeOpenIcon : eyeClosedIcon} 
    alt="Toggle Password" 
    className="w-5 h-5"
  />
              </span>
            </div>
          )}


          
                    {/* Forgot Password Link (Only for Login) */}
          {state === 'Login' && (
          <p onClick={()=>navigate('/reset-password')}  className='mb-4 text-indigo-500 cursor-pointer'>Forgot password?</p>
          )}
          {/*Submit Button */}
          <button className='w-full py-2 xs:py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium text-sm xs:text-base'>{state}</button>
        </form>

        {/* Toggle between Login & Sign Up */}
        {state === 'Sign Up' ? (
          <p className='text-gray-400 text-center text-xs mt-3 xs:mt-4' >Already have an account?{' '}
          <span onClick={()=> setState('Login')} className='text-blue-400 cursor-pointer underline'>Login here</span>
        </p>) 
        : (
          <p className='text-gray-400 text-center text-xs mt-3 xs:mt-4' >Dont have an account?{' '}
      <span onClick={()=> setState('Sign Up')} className='text-blue-400 cursor-pointer underline'>Sign Up</span>
    </p>
        )}

      </div>
    </div>
  )
}

export default Login

