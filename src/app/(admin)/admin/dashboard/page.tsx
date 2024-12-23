import { NextResponse, NextRequest } from "next/server";
import React from "react";

const DashBoard = (request: any) => {
  // const cookies = parse(req.headers.cookie || "");
  // const { jwt, role } = cookies;
  // if (!jwt || !role || role !== "Admin") {
  //   return {
  //     redirect: {
  //       destination: "/", // Chuyển hướng đến trang đăng nhập nếu cookie không tồn tại
  //       permanent: false,
  //     },
  //   };
  // }
  return <div>DashBoard</div>;
};

export default DashBoard;
