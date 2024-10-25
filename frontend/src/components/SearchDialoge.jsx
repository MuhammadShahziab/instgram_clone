import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "./ui/input";
import axios from "axios";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { ClipLoader } from "react-spinners";
import { useSelector } from "react-redux";

const SearchDialoge = ({ open, setOpen }) => {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:8000/api/user/search?search=${search}`
      );

      if (res.data.users.length === 0) {
        setNotFound(true);
      } else {
        setNotFound(false);
      }

      setSuggestions(res.data.users);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (search.trim() !== "") {
      fetchUsers();
    } else {
      setSuggestions([]); // Clear suggestions if search is empty
      setNotFound(false);
    }
  }, [search]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="px-0 min-h-[400px] flex flex-col">
        <div className="  px-4 flex flex-col justify-center">
          <h1 className="text-xl font-semibold">Search</h1>
          <Input
            className="w-full h-12  mt-2 mb-3 bg-gray-100 focus-visible:ring-transparent"
            placeholder="Search..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex-1 px-4 overflow-y-auto relative">
          {loading && (
            <div className="flex flex-1 items-center justify-center mt-10 ">
              <ClipLoader size={47} color={"#1877f2"} />{" "}
            </div>
          )}

          {!loading &&
            suggestions.length > 0 &&
            suggestions.map((profile) => (
              <Link to={`/profile/${profile._id}`} key={profile._id}>
                <div
                  onClick={() => {
                    setOpen(false);
                    setSuggestions([]);
                  }}
                  className="flex gap-x-3 items-center py-3 px-4 rounded-xl cursor-pointer hover:bg-gray-100"
                >
                  <div className="w-11 h-11 rounded-full">
                    <img
                      src={profile?.profilePic || "/img/noavatar.jpg"}
                      alt="IMAGE"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[16px] font-semibold">
                      {profile.username}
                    </span>
                    <p className="text-sm text-gray-500 flex items-center gap-x-3">
                      {profile.fullName}{" "}
                      <span>
                        {user?.following?.includes(profile._id) ? (
                          <>
                            <span className="h-1 w-1 rounded-full relative inline-block bg-gray-500"></span>{" "}
                            Following
                          </>
                        ) : (
                          <>
                            <span className="h-1 w-1 rounded-full relative inline-block bg-gray-500"></span>{" "}
                            Follow
                          </>
                        )}
                      </span>
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          {!loading && notFound && (
            <div className="text-center flex flex-col gap-y-3 items-center mt-8">
              <p className="text-gray-500 text-lg">
                No users found for "{search}"
              </p>
              <Search size={50} className="text-gray-500" />
            </div>
          )}
          {!loading && !notFound && suggestions.length === 0 && (
            <div className="text-center flex flex-col gap-y-3 items-center mt-8">
              <p className="text-gray-500 text-lg">Find your friends</p>
              <Search size={50} className="text-gray-500" />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialoge;
