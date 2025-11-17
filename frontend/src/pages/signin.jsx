import React, { useContext, useState } from 'react';
import bg from '../assets/pic1.jpg';
import { IoEye } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from '../context/UserContext';
import axios from "axios";

function Signin() {
  const [showPassword, setShowPassword] = useState(false);
  const { serverUrl, setUserData } = useContext(UserDataContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleSignin = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    if (!email.trim() || !password.trim()) {
      setErr("Email and password are required");
      setLoading(false);
      return;
    }

    try {
      console.log("Sending signin data:", { email, password });
      const result = await axios.post(`${serverUrl}/api/auth/signin`, {
        email,
        password
      }, {
        withCredentials: true
      });

      const user = result.data.user;
      if (!user) {
        throw new Error("No user returned from backend");
      }

      // ✅ Set context and persist to localStorage
      setUserData(user);
      localStorage.setItem("userData", JSON.stringify(user));
      console.log("User signed in:", user);

      setLoading(false);
      navigate("/customise");
    } catch (error) {
      console.log("Signin error:", error);
      setUserData(null);
      localStorage.removeItem("userData");
      setLoading(false);
      setErr(error.response?.data?.message || "Signin failed");
    }
  };

  return (
    <div className='w-full h-[100vh] bg-cover flex justify-center items-center cover' style={{ backgroundImage: `url(${bg})` }}>
      <form className='w-[90%] h-[600px] max-w-[500px] bg-[#00000083] backdrop-blur shadow-lg shadow-black flex flex-col items-center justify-center gap-[20px]' onSubmit={handleSignin}>
        <h1 className='text-white text-[30px] font-semibold mb-[30px]'>
          Sign In to <span className='text-blue-400'>Virtual Assistant</span>
        </h1>

        <input
          type="email"
          placeholder='Email'
          className='w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]'
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />

        <div className='w-full h-[60px] border-2 border-white bg-transparent text-white rounded-full text-[18px] relative'>
          <input
            type={showPassword ? "text" : "password"}
            placeholder='Password'
            className='w-full h-full rounded-full outline-none bg-transparent placeholder-gray-300 px-[20px] py-[10px]'
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          {!showPassword ? (
            <IoEye
              className='absolute top-[16px] left-[320px] text-white w-[25px] h-[25px] cursor-pointer'
              onClick={() => setShowPassword(true)}
            />
          ) : (
            <IoMdEyeOff
              className='absolute top-[16px] left-[320px] text-white w-[25px] h-[25px] cursor-pointer'
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
          {loading ? "Loading..." : "Sign In"}
        </button>

        <p className='text-white text-[18px] cursor-pointer' onClick={() => navigate("/signup")}>
          Want to create a new account? <span className='text-blue-400'>Sign Up</span>
        </p>
      </form>
    </div>
  );
}

export default Signin;