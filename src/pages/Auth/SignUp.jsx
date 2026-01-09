import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import AuthLayout from "../../components/layouts/AuthLayout";
import ProfilePhotoSelector from "../../components/inputs/ProfilePhotoSelector";
import Input from "../../components/inputs/Input";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATH } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";

const Signup = () => {
  const value = "signup";
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [profilePic, setProfilePic] = useState(null);
  const [fullname, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!fullname) return setError("Please enter your name");
    if (!validateEmail(email))
      return setError("Please enter a valid email address");
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

      const response = await axiosInstance.post(
        API_PATH.AUTH.REGISTER,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  return (
    <AuthLayout isActive={value}>
      <div className="w-full min-h-screen flex flex-col justify-start px-4 sm:px-6 md:px-8 lg:px-12 pt-6 overflow-y-auto">
        <h3 className="text-lg sm:text-xl font-semibold text-black">
          Create an Account
        </h3>
        <p className="text-xs sm:text-sm text-slate-700 mt-1 mb-9">
          Join us by entering your details below.
        </p>


        <form onSubmit={handleSignUp} className="w-full max-w-xl md:max-w-none">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
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

            <div className="md:col-span-2">
              <Input
                value={password}
                onChange={setPassword}
                label="Password"
                placeholder="Min 8 Characters"
                type="password"
              />
            </div>

            <div className="md:col-span-2">
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

          {error && (
            <p className="text-red-500 text-xs mt-2">{error}</p>
          )}

          <button
            type="submit"
            className="w-full text-sm font-medium text-white bg-blue-600 p-3 rounded-md mt-4 hover:bg-blue-700 transition"
          >
            SIGNUP
          </button>
        </form>

        <p className="text-xs sm:text-[13px] text-slate-800 mt-4 text-center sm:text-left">
          Already have an account?{" "}
          <Link
            className="font-medium text-primary underline"
            to="/login"
          >
            LOGIN
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Signup;
