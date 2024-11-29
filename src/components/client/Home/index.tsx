"use client";
import { useEffect, useState } from "react";
import Category from "./Category";
import { getAllCourseByLevel } from "@/api/api";

const Home = () => {
  const [courseOne, setCourseOne] = useState<any>(null);
  const [courseTwo, setCourseTwo] = useState<any>(null);
  useEffect(() => {
    const getDataAsync = async () => {
      const resOne = await getAllCourseByLevel(1);
      const resTwo = await getAllCourseByLevel(2);
      if (resOne?.statusCode === 200) {
        setCourseOne(resOne?.data);
      }
      if (resTwo.statusCode === 200) {
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
