import React from "react";
import { FaRegHeart } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  const shouldHiderHeader = location.pathname.startsWith("/direct");

  const isNotificationPage = location.pathname === "/notifications";
  const isEditProfilePage = location.pathname === "/accounts/edit";
  if (shouldHiderHeader) {
    return null;
  }

  return (
    <div className="md:hidden flex justify-between items-center p-4 bg-white border-b border-gray-200  h-[51px]  fixed top-0 left-0 right-0 z-10">
      {isNotificationPage ? (
        <span className="font-bold text-lg text-center w-full">
          Notifications
        </span>
      ) : isEditProfilePage ? (
        <span className="font-bold text-lg text-center w-full">
          Edit Profile
        </span>
      ) : (
        <>
          <img
            src="/img/logo.png"
            alt="Instagram"
            className="w-20 object-contain"
          />
          <Link to="/notifications">
            <FaRegHeart size={23} />
          </Link>
        </>
      )}
    </div>
  );
};

export default Header;
