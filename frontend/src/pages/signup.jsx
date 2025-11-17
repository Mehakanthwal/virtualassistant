import React, { useContext, useState } from 'react';
import bg from '../assets/pic1.jpg';
import { IoEye } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from '../context/UserContext';
import axios from "axios";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const { serverUrl, userData, setUserData } = useContext(UserDataContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [loading, setloading] = useState(false);
  const [err, setErr] = useState("");

  const handlesignup = async (e) => {
    e.preventDefault();
    setErr("");
    setloading(true);

    // ✅ Frontend validation
    if (!name.trim() || !email.trim() || !password.trim()) {
      setErr("All fields are required");
      setloading(false);
      return;
    }

    try {
      console.log("Sending signup data:", { name, email, password }); 
      let result = await axios.post(`${serverUrl}/api/auth/signup`, {
        name,
        email,
        password
      }, {
        withCredentials: true
      });

      setUserData(result.data);
      setloading(false);
      navigate("/customise"); // ✅ Navigate on success
    } catch (error) {
      console.log("Signup error:", error); // ✅ Debug log
      setUserData(null);
      setloading(false);
      setErr(error.response?.data?.message || "Signup failed"); // ✅ Safe error handling
    }
  };

  return (
    <div className='w-full h-[100vh] bg-cover flex justify-center items-center cover' style={{ backgroundImage: `url(${bg})` }}>
      <form className='w-[90%] h-[600px] max-w-[500px] bg-[#00000083] backdrop-blur shadow-lg shadow-black flex flex-col items-center justify-center gap-[20px]' onSubmit={handlesignup}>
        <h1 className='text-white text-[30px] font-semibold mb-[30px]'>
          Register to <span className='text-blue-400'>Virtual Assistant</span>
        </h1>

        <input
          type="text"
          placeholder='Enter your name'
          className='w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]'
          required
          onChange={(e) => setName(e.target.value)}
          value={name}
        />

        <input
          type="email"
          placeholder='Email'
          className='w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]'
          required
          onChange={(e) => setemail(e.target.value)}
          value={email}
        />

        <div className='w-full h-[60px] border-2 border-white bg-transparent text-white rounded-full text-[18px] relative'>
          <input
            type={showPassword ? "text" : "password"}
            placeholder='Password'
            className='w-full h-full rounded-full outline-none bg-transparent placeholder-gray-300 px-[20px] py-[10px]'
            required
            onChange={(e) => setpassword(e.target.value)}
            value={password}
          />
          {!showPassword && (
            <IoEye
              className='absolute top-[16px] left-[420px] text-white w-[25px] h-[25px] cursor-pointer'
              onClick={() => setShowPassword(true)}
            />
          )}
          {showPassword && (
            <IoMdEyeOff
              className='absolute top-[16px] left-[420px] text-white w-[25px] h-[25px] cursor-pointer'
              onClick={() => setShowPassword(false)}
            />
          )}
        </div>

        {err.length > 0 && (
          <p className='text-red-500 text-[17px]'>
            *{err}
          </p>
        )}

        <button
          className={`min-w-[150px] h-[60px] bg-white mt-[30px] text-black text-[19px] font-semibold rounded-full ${loading ? "opacity-80 cursor-not-allowed" : ""}`}
          disabled={loading}
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>

        <p className='text-white text-[18px] cursor-pointer' onClick={() => navigate("/signin")}>
          Already have an account? <span className='text-blue-400'>Sign In</span>
        </p>
      </form>
    </div>
  );
}

export default Signup;
