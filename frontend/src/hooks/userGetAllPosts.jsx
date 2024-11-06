import { setPosts } from "@/redux/postSlice";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const userGetAllPosts = () => {
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "https://instgram-clone-3yhc.onrender.com/api/post/all",
          {
            withCredentials: true,
          }
        );
        console.log(res, "check all posts ");
        if (res?.data?.success) {
          dispatch(setPosts(res?.data?.posts));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPosts();
  }, []);

  return { loading };
};

export default userGetAllPosts;
