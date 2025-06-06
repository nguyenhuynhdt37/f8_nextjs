import React from 'react';
import Course from './Course';
import { motion } from 'framer-motion';

const Category = ({ data }: any) => {
  return (
    <div className="mb-8">
      {data?.length > 0 && (
        <div className="text-base font-medium mb-4 text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 p-2 rounded-md border-l-4 border-blue-500 dark:border-blue-600">
          {data[0]?.level?.name}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data && data.map((course: any, index: number) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="transform hover:scale-[1.02] transition-transform"
          >
            <Course data={course} level={data[0]?.level?.id} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Category;
