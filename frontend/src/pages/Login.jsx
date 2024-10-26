import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { PulseLoader } from "react-spinners";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleEventChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setInput({ ...input, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        "https://instgram-clone-3yhc.onrender.com/api/auth/login",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res?.data?.success) {
        toast.success(res?.data?.message);
        dispatch(setAuthUser(res?.data?.user));
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);

  return (
    <div className="h-screen flex justify-center  mx-auto lg:items-center max-w-[1266px]">
      <div className="flex-1 flex justify-center max-lg:hidden">
        <img
          src="/img/login.jpeg"
          className="h-[70vh] object-contain"
          alt="loin"
        />
      </div>
      <div className="flex-1   flex justify-center  px-0 max-lg:mt-11 ">
        <form onSubmit={handleLogin} className="lg:w-[60%] w-full max-lg:px-4">
          <div className="flex flex-col  items-center">
            <img src="/img/logo.png" alt="logo" className="lg:w-50 w-52" />
            <p className="text-gray-500 font-semibold text-center">
              Login to see photos and videos from <br /> your friends.
            </p>
          </div>
          <div className="mt-9 flex flex-col gap-y-1">
            <div>
              <span className="font-medium text-slate-500">Email</span>
              <Input
                type="text"
                name="email"
                placeholder="shahzaib@gmail.com"
                value={input.email}
                onChange={handleEventChange}
                className="focus-visible:ring-transparent text-[16px] py-2 h-[50px] my-2"
              ></Input>
            </div>{" "}
            <div>
              <span className="font-medium text-slate-500">Password</span>
              <Input
                type="password"
                name="password"
                placeholder="Password"
                value={input.password}
                onChange={handleEventChange}
                className="focus-visible:ring-transparent text-[16px] py-2 h-[50px] my-2"
              ></Input>
            </div>
            <Button
              type="submit"
              className="bg-[#0095f6] hover:bg-[#0095f6]/90 text-lg mt-3 flex items-center gap-3"
            >
              Login{" "}
              {loading && (
                <PulseLoader
                  color="#ffffff" // Instagram-like light gray color
                  size={8}
                />
              )}
            </Button>
            <p className="text-center mt-3">
              Does't Have an Account?{" "}
              <Link to="/signup" className="text-sky-600 ">
                Signup
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
