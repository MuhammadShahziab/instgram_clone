import { setUserProfile } from "@/redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const getUserProfile = (userId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get(
          `https://instgram-clone-3yhc.onrender.com/api/profile/${userId}`,
          {
            withCredentials: true,
          }
        );
        if (res?.data?.success) {
          dispatch(setUserProfile(res?.data?.user));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserProfile();
  }, [userId]);
};

export default getUserProfile;
