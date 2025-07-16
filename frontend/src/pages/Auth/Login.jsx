import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthLayout from '../../components/Layouts/AuthLayout';
import Input from '../../components/Inputs/Input'; 
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_URL } from "../../utils/apiPath";
import { UserContext } from '../../context/userContext';
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const {updateUser}=useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,}$/;

    if (!passwordRegex.test(password)) {
    setError("Password must be at least 4 characters, include a capital letter, number, and special character.");
    return;
    }

    setError("");

    //LOGIN API
    try {
      const response = await axiosInstance.post(API_URL.AUTH.LOGIN, { email, password });
      const {token,user}=response.data;

      if(token){
        localStorage.setItem('token', token);
        updateUser(user);
        navigate('/dashboard');
      }
    } catch (err) {
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
    
  };

  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h4 className="text-xl font-semibold text-black">Welcome Back</h4>
        <p className="text-xs text-slate-700 mt-[5px] mb-6">
          Please enter your details to log in
        </p>

        <form onSubmit={handleLogin}>
          <Input
  id="email"
  name="email"
  value={email}
  onChange={({ target }) => setEmail(target.value)}
  label="Email Address"
  placeholder="john@example.com"
  type="text"
/>

<Input
  id="password"
  name="password"
  value={password}
  onChange={({ target }) => setPassword(target.value)}
  label="Password"
  placeholder="Min 4 characters"
  type="password"
/>


          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" className="btn-primary">
            LOGIN
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Don't have an account?{" "}
            <Link className="font-medium text-violet-500 underline" to="/SignUp">
              SignUp
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
