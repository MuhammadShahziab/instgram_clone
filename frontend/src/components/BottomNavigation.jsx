import {
  Home,
  MessageCircle,
  Search,
  PlusSquare,
  TrendingUp,
  Send,
} from "lucide-react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import SearchDialoge from "./SearchDialoge";
import CreatePost from "./CreatePost";
import { useState } from "react";

const BottomNavigation = () => {
  const { user } = useSelector((state) => state.auth);
  const [openSearch, setOpenSearch] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const shouldHideNavigation = location.pathname.startsWith("/direct");
  if (shouldHideNavigation) {
    return null;
  }

  return (
    <div className="md:hidden flex justify-around items-center p-2  bg-white h-16c shadow-lg fixed bottom-0 left-0 right-0 z-10">
      <Link to="/">
        <Home size={26} className=" text-black" />
      </Link>
      <Link to={"/explore"}>
        <TrendingUp size={26} className=" text-black" />
      </Link>
      <Search
        onClick={() => setOpenSearch(true)}
        size={26}
        className=" text-black"
      />
      <PlusSquare
        onClick={() => setOpen(true)}
        size={26}
        className=" text-black"
      />
      <Link to={"/direct"}>
        {" "}
        <Send size={26} className=" text-black" />
      </Link>
      <Link to={`/profile/${user?._id}`}>
        {user?.profilePic ? (
          <img
            src={user?.profilePic}
            className="w-10 h-10 rounded-full object-cover"
            alt="profile"
          />
        ) : (
          <img
            src="/img/noavatar.jpg"
            className="w-10 h-10 rounded-full object-cover"
            alt="profile"
          ></img>
        )}
      </Link>
      <SearchDialoge open={openSearch} setOpen={setOpenSearch}></SearchDialoge>
      <CreatePost open={open} setOpen={setOpen}></CreatePost>
    </div>
  );
};

export default BottomNavigation;
