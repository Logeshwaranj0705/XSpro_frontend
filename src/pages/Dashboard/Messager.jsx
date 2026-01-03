import React, { useState, useEffect, useContext } from 'react';
import { useUserAuth } from '../../hooks/useUserAuth';
import DashBoardLayout from '../../components/layouts/DashBoardLayout';
import MessagerPaid from '../../components/Messager/MessagerPaid';
import MessagerDue from '../../components/Messager/MessagerDue';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATH } from '../../utils/apiPaths';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from '../../context/userContext';

const Messager = () => {
  useUserAuth();
  const { user, selectedUserId } = useContext(UserContext);

  const [addAction, setAddAction] = useState([]);
  const [addPaid, setAddPaid] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMessagerDetails = async () => {
    if (!user) return;
    if (loading) return;
    setLoading(true);

    try {
      const query = selectedUserId ? `?userId=${selectedUserId}` : "";
      const response = await axiosInstance.get(`${API_PATH.MESSAGER.GET_ALL_HISTORY}${query}`);
      if (response.data) {
        setAddAction(response.data.action || []);
        setAddPaid(response.data.noAction || []);
      }
    } catch (error) {
      console.error("Something went wrong. Please try again.", error);
      toast.error("Failed to fetch message history");
    } finally {
      setLoading(false);
    }
  };

  const showLoadToast = (message) => {
    const id = toast.loading("Loading...");
    setTimeout(() => {
      toast.update(id, {
        render: message,
        type: "success",
        isLoading: false,
        autoClose: 2000,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }, 1000);
  }; 

  useEffect(() => {
    fetchMessagerDetails();
    showLoadToast("Message sent successfully");
  }, [user, selectedUserId]);

  return (
    <DashBoardLayout activeMenu="Messager">
      <ToastContainer />
      {loading ? (
        <p className="text-center text-gray-500 mt-10">Loading messages...</p>
      ) : (
        <div className='flex flex-col gap-6'>
          <MessagerPaid status={addPaid} />
          <MessagerDue status={addAction} />
        </div>
      )}
    </DashBoardLayout>
  );
};

export default Messager;
