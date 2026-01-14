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
import { FiSend } from 'react-icons/fi';

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

  const handleSendMessages = async () => {
    if (loading) return;

    try {
      setLoading(true);
      const toastId = toast.loading("Sending messages...");

      const query = selectedUserId ? `?userId=${selectedUserId}` : "";
      await axiosInstance.post(`${API_PATH.MESSAGER.SET_ALL_MESSAGE}${query}`);

      toast.update(toastId, {
        render: "Messages sent successfully",
        type: "success",
        isLoading: false,
        autoClose: 2000,
        closeOnClick: true,
        pauseOnHover: true,
      });

      fetchMessagerDetails();
    } catch (error) {
      toast.error("Failed to send messages");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessagerDetails();
  }, [user, selectedUserId]);

  return (
    <DashBoardLayout activeMenu="Messager">
      <ToastContainer />

      <div className="flex justify-end mb-4">
        <button
          onClick={handleSendMessages}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <FiSend className="text-lg" />
          Send
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500 mt-10">Loading messages...</p>
      ) : (
        <div className="flex flex-col gap-6">
          <MessagerPaid status={addPaid} />
          <MessagerDue status={addAction} />
        </div>
      )}
    </DashBoardLayout>
  );
};

export default Messager;
