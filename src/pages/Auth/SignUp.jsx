import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { validateEmail } from '../../utils/helper';
import AuthLayout from '../../components/layouts/AuthLayout';
import ProfilePhotoSelector from '../../components/inputs/ProfilePhotoSelector';
import Input from '../../components/inputs/input';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATH } from "../../utils/apiPaths";
import { UserContext } from '../../context/userContext'; 

const Signup = () => {
  const value = "signup";
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [profilePic, setProfilePic] = useState(null);
  const [fullname, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState(null);

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!fullname) return setError("Please enter your name");
    if (!validateEmail(email)) return setError("Please enter a valid email address");
    if (!password) return setError("Please enter your password");
    if (!role) return setError("Please select your role");

    setError("");

    try {
      const formData = new FormData();
      formData.append("fullname", fullname);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("role", role);
      if (profilePic) formData.append("profileImage", profilePic);

      const response = await axiosInstance.post(API_PATH.AUTH.REGISTER, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
    } catch (err) {
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <AuthLayout isActive={value}>
      <div className="lg:w-[95%] h-auto max-h-full flex flex-col justify-start pl-12 pr-12 pt-10 overflow-y-auto">
        <h3 className="text-xl font-semibold text-black">Create an Account</h3>
        <p className="text-xs text-slate-700 mt-[5px] mb-5">Join us by entering your details below.</p>

        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          <div className="grid grid-cols-1 md:grid-cols-2">
            <Input
              value={fullname}
              onChange={setFullName}
              label="Full Name"
              placeholder="Name"
              type="text"
            />
            <Input
              value={email}
              onChange={setEmail}
              label="Email Address"
              placeholder="Enter your email"
              type="text"
            />
            <div className="col-span-2">
              <Input
                value={password}
                onChange={setPassword}
                label="Password"
                placeholder="Min 8 Characters"
                type="password"
              />
            </div>
            <div className="col-span-2">
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
            </div>
          </div>

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button
            type="submit"
            className="w-[98.5%] text-sm font-medium text-white bg-blue-600 shadow-lg shadow-purple-600/5 p-[10px] rounded-md my-1 hover:bg-blue-600/20 hover:text-purple-600"
          >
            SIGNUP
          </button>
        </form>

        <p className="text-[13px] text-slate-800 mt-3">
          already have an account?{" "}
          <Link className="font-medium text-primary underline" to="/login">LOGIN</Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Signup;
