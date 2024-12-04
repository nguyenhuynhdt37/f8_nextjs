"use client";
import { useEffect, useState } from "react";
import Category from "./Category";
import { getAllCourseByLevel } from "@/api/api";
import { useAppDispatch, useAppSelector } from "@/redux/hook/hook";
import { setStateNav } from "@/redux/reducers/slices/NavbarSlice";

const Home = () => {
  const dispatch = useAppDispatch();
  const [courseOne, setCourseOne] = useState<any>(null);
  const [courseTwo, setCourseTwo] = useState<any>(null);
  useEffect(() => {
    dispatch(setStateNav(1));
    const getDataAsync = async () => {
      const resOne = await getAllCourseByLevel(1);
      const resTwo = await getAllCourseByLevel(2);
      if (resOne?.statusCode === 200) {
        setCourseOne(resOne?.data);
      }
      if (resTwo?.statusCode === 200) {
        setCourseTwo(resTwo?.data);
      }
    };
    getDataAsync();
  }, []);

  return (
    <div className="px-32 pt-16">
      <Category data={courseOne} />
      <Category data={courseTwo} />
    </div>
  );
};

export default Home;
