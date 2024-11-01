import React from "react";
import Course from "./Course";

const Category = () => {
  return (
    <div className="pb-10">
      <div className="text-[2.5rem] font-bold">Khoá học Pro</div>
      <div className="grid grid-cols-4 pt-10 gap-8">
        <Course />
        <Course />
        <Course />
        <Course />
      </div>
    </div>
  );
};

export default Category;
