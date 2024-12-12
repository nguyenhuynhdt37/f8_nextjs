import Profile from "@/components/client/Profile";
import { useCookie } from "@/hook/useCookie";
import { redirect } from "next/navigation";
import React from "react";

interface Iprops {
  params: { id: string };
}
const ProfilePage = async () => {
  return (
    <>
      <Profile user={null} />
    </>
  );
};

export default ProfilePage;
