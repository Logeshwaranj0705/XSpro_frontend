import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/layouts/AuthLayout';
import { validateEmail } from "../../utils/helper";
import Input from '../../components/inputs/input';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATH } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';

const Login = () => {
  const value = "login";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!password) {
      setError("Please enter the password");
      return;
    }

    if (!role) {
      setError("Please select a role");
      return;
    }

    setError("");

    try {
      const response = await axiosInstance.post(API_PATH.AUTH.LOGIN, {
        email,
        password,
      });

      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate('/dashboard');
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <AuthLayout isActive={value}>
      <div className="lg:w-[95%] h-auto max-h-full flex flex-col justify-start pl-12 pr-12 pt-10 overflow-y-auto">
        <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
        <p className="text-xs text-slate-700 mt-1 mb-6">
          Please enter your details to log in
        </p>

        <form onSubmit={handleLogin} className="flex flex-col">


          <Input
            value={email}
            onChange={setEmail}   
            label="Email address"
            placeholder="Enter your email"
            type="text"
          />

          <Input
            value={password}
            onChange={setPassword} 
            label="Password"
            placeholder="Min 8 Characters"
            type="password"
          />

          <Input
            value={role}
            onChange={setRole} 
            label="User role"
            placeholder="Choose role"
            type="select"
            options={[
              { value: "admin", label: "Admin" },
              { value: "user", label: "User" },
            ]}
          />

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button
            type="submit"
            className='w-[98.5%] text-sm font-medium text-white bg-blue-600 shadow-lg shadow-purple-600/5 p-[10px] rounded-md my-1 hover:bg-blue-600/20 hover:text-purple-600'
          >
            LOGIN
          </button>
        </form>

        <p className='text-[13px] text-slate-800 mt-3'>
          Don't have an account?{" "}
          <Link className="font-medium text-primary underline" to="/signup">SIGNUP</Link>
        </p>
      </div>
    </AuthLayout>
  );
}

export default Login;
