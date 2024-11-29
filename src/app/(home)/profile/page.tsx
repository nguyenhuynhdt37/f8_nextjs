import Profile from "@/components/client/Profile";
import { useCookie } from "@/hook/useCookie";
import { redirect } from "next/navigation";
import React from "react";

const ProfilePage = async () => {
  return (
    <>
      <Profile />
    </>
  );
};

export default ProfilePage;
