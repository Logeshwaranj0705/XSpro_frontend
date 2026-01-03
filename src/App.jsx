import React from 'react';

import{
  BrowserRouter as Router,
  Routes,Route,Navigate
} from "react-router-dom";

import Login from "./pages/Auth/Login";
import SignUp from './pages/Auth/Signup';
import Home from "./pages/Dashboard/Home";

import UserProvider from "./context/userContext";
import Analysis from './pages/Dashboard/Analysis';
import Messager from './pages/Dashboard/Messager';
import Tracker from "./components/admin/Tracker";

function App() {
  return (
    <UserProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/messager" element={<Messager />} />
        <Route path="/tracker" element={<Tracker />} />
      </Routes>
    </Router>
    </UserProvider>
  )
}

export default App
const Root =() =>{
  const isAuthenticated = !!localStorage.getItem ("token");
  return isAuthenticated ?(
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  ) 
}