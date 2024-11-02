import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useReducer, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { Edit, Plus, PlusCircle, Trash } from "lucide-react";
import { ClipLoader } from "react-spinners";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import upload from "@/utils/upload";
import axios from "axios";
import { toast } from "sonner";
import { setAuthUser } from "@/redux/authSlice";
import { useNavigate } from "react-router-dom";

const EditePage = () => {
  const { user } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);
  const imgRef = useRef();
  const [open, setOpen] = useState(false);
  const [hobby, setHobby] = useState("");
  const [loadingImg, setLoadingImg] = useState(false);
  const [editedIndex, setEditedIndex] = useState(null);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    fullName: user?.fullName || "",
    bio: user?.bio || "",
    profilePic: user?.profilePic || "",
    hobbies: user?.hobbies || [],
    gender: user?.gender || "",
    isPrivate: user?.isPrivate || false,
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProfileUpload = async (e) => {
    const file = e.target.files[0];
    try {
      setOpen(false);
      setLoadingImg(true);
      const url = await upload(file);
      setFormData({
        ...formData,
        profilePic: url,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingImg(false);
    }
  };

  const selectChangeHandler = (value) => {
    setFormData({
      ...formData,
      gender: value,
    });
  };

  const handleAddHobby = () => {
    if (hobby.trim()) {
      setFormData({
        ...formData,
        hobbies: [...formData.hobbies, hobby],
      });
      setHobby("");
    } else {
      setHobby("");
    }
  };
  const handleHobbyChange = (index, value) => {
    if (editedIndex !== null && editedIndex !== index) {
      setEditedIndex(null);
    }

    const newHobbies = [...formData.hobbies];
    newHobbies[index] = value;
    setFormData({ ...formData, hobbies: newHobbies });
  };

  const handleRemoveHobby = (index) => {
    setFormData({
      ...formData,
      hobbies: formData.hobbies.filter((_, i) => i !== index),
    });
  };

  const handleEditIndex = (index) => {
    if (index === editedIndex) {
      setEditedIndex(null);
    } else if (hobby.trim() !== "") {
      setEditedIndex(null);
    } else {
      setEditedIndex(index);
    }
  };
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        "https://instgram-clone-3yhc.onrender.com/api/profile/edit",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res?.data?.success) {
        toast.success(res?.data?.message);

        const updatedDataa = {
          ...user,
          username: res?.data?.user?.username,
          fullName: res?.data?.user?.fullName,
          profilePic: res?.data?.user?.profilePic,
          hobbies: res?.data?.user?.hobbies,
          gender: res?.data?.user?.gender,
          bio: res?.data?.user?.bio,
          isPrivate: res?.data?.user?.isPrivate,
        };
        navigate(`/profile/${res?.data?.user?._id}`);
        dispatch(setAuthUser(updatedDataa));
      } else {
        toast.error(res?.data?.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="md:max-w-2xl w-full md:mx-auto my-12 max-md:mt-20 max-md:mb-28 px-5">
      <h1 className="font-bold text-xl max-lg:hidden mb-8">Edit Profile</h1>

      <div className="flex items-start lg:items-center gap-x-7 lg:justify-between bg-gray-100 rounded-xl p-4 py-6">
        <div className="flex items-center gap-x-4">
          {loadingImg ? (
            <ClipLoader color="blue" size={24}></ClipLoader>
          ) : (
            <div className="w-14 h-14 rounded-full overflow-hidden aspect-w-1 aspect-h-1">
              <img
                src={formData?.profilePic || "/img/noavatar.jpg"}
                className="object-cover w-full h-full"
                alt="Profile Picture"
              />
            </div>
          )}
        </div>
        <div className="flex flex-col md:flex-row md:justify-between max-lg:gap-y-2 flex-1">
          <div>
            <p className="font-bold">{formData?.username}</p>
            <span className="text-sm text-gray-400">{formData?.fullName}</span>
          </div>
          <div>
            <input
              ref={imgRef}
              type="file"
              name="profilePic"
              className="hidden"
              onChange={handleProfileUpload}
            />

            <Button
              onClick={() => setOpen(true)}
              className="h-9 bg-[#0094f6da]  text-white hover:bg-[#0095F6] font-semibold max-lg:float-right lg:ml-3"
            >
              Change photo
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild></DialogTrigger>
              <DialogContent className="flex flex-col items-center p-0 gap-0 max-w-sm">
                <div
                  onClick={() => imgRef.current.click()}
                  className="text-[#0094f6da] cursor-pointer p-4 rounded-t-lg hover:bg-gray-100 font-medium border-b-[1px] text-center w-full"
                >
                  Upload Photo
                </div>
                <div className=" text-red-600 font-medium border-b-[1px] cursor-pointer p-4 rounded-t-lg hover:bg-gray-100 text-center w-full text-md">
                  Remove Current Photo
                </div>
                <div
                  onClick={() => setOpen(false)}
                  className="border-b-[1px] cursor-pointer p-4 rounded-t-lg hover:bg-gray-100 text-center w-full text-md"
                >
                  Cancel
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="flex max-md:flex-col gap-y-5 items-center gap-x-4 my-4 md:my-7">
        <div className="flex-1  w-full">
          <p className="text-sm lg:text-md font-semibold mb-1">Username</p>
          <Input
            className="outline-none text-[15px] focus-visible:ring-transparent h-12 md:h-14"
            placeholder="Username"
            name="username"
            value={formData?.username}
            onChange={handleChange}
          ></Input>
        </div>
        <div className="flex-1 w-full">
          <p className="text-sm lg:text-md font-semibold mb-1">Full Name</p>
          <Input
            className="outline-none text-[15px] focus-visible:ring-transparent h-12 md:h-14"
            placeholder="Full Name"
            value={formData?.fullName}
            name="fullName"
            onChange={handleChange}
          ></Input>
        </div>
      </div>

      <div className="my-4 md:my-7">
        <p className=" text-sm lg:text-md font-semibold mb-1">Gender</p>
        <Select
          defaultValue={formData?.gender}
          name="gender"
          onValueChange={selectChangeHandler}
        >
          <SelectTrigger className="w-full h-12 md:h-14 focus-visible:ring-transparent">
            <SelectValue placeholder="Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <p className="text-sm lg:text-md font-semibold mb-1">Bio</p>
        <Textarea
          placeholder="Bio..."
          value={formData?.bio}
          className="focus-visible:ring-transparent text-md"
          onChange={handleChange}
          name="bio"
        />
      </div>

      <div className="my-7">
        <p className="text-sm lg:text-md font-semibold mb-1">Hobbies</p>
        <div className="flex items-center gap-x-3">
          <Input
            className="outline-none text-sm md:text-[15px] focus-visible:ring-transparent h-12 md:h-14"
            placeholder="Add Hobbies"
            name="hobbies"
            value={hobby}
            onChange={(e) => setHobby(e.target.value)}
          ></Input>

          <Button
            disabled={hobby.trim() === ""}
            onClick={handleAddHobby}
            variant="outline"
            className="h-10 md:h-11"
          >
            <Plus className="text-green-400"></Plus>
          </Button>
        </div>
        {formData?.hobbies?.map((hobby, index) => (
          <div className="flex items-center gap-x-3 mt-3" key={index}>
            <Input
              className="outline-none text-sm md:text-[15px] focus-visible:ring-transparent h-12 md:h-14"
              value={formData.hobbies[index]}
              onChange={(e) => handleHobbyChange(index, e.target.value)}
              disabled={editedIndex !== index} // Disable if not being edited
              name="hobbies"
              placeholder="Add Hobbies"
              key={index}
            ></Input>
            <Button
              onClick={() => handleEditIndex(index)}
              variant="outline"
              className={` h-10 md:h-11 ${
                editedIndex === index
                  ? "bg-gray-100 text-green-500 hover:text-green-500"
                  : " text-blue-500 hover:text-blue-500"
              } `}
            >
              <Edit></Edit>
            </Button>
            <Button
              onClick={() => handleRemoveHobby(index)}
              variant="outline"
              className="h-10 md:h-11"
            >
              <Trash className="text-red-400"></Trash>
            </Button>
          </div>
        ))}
      </div>

      <div>
        <p className="font-semibold mb-3 text-sm md:text-md">
          Show your account other users{" "}
        </p>
        <div className="border  rounded-xl p-4 flex  items-center">
          <div>
            <p className="text-sm"> Show your account other users </p>
            <p className="text-xs text-gray-400">
              Choose whether people can see similar account suggestions on your
              profile, and whether your account can be suggested on other
              profiles.
            </p>
          </div>
          <Switch
            checked={formData?.isPrivate}
            onCheckedChange={(value) =>
              setFormData({ ...formData, isPrivate: value })
            }
          />
        </div>
      </div>
      <div className="flex justify-center md:justify-end mt-11">
        <Button
          disabled={loading}
          onClick={handleSubmit}
          className="h-10 md:h-11 bg-[#0094f6da] flex items-center gap-x-2 w-40 text-white hover:bg-[#0095F6] font-semibold ml-3"
        >
          Submit {loading && <ClipLoader color="white" size={18}></ClipLoader>}
        </Button>
      </div>
    </div>
  );
};

export default EditePage;
