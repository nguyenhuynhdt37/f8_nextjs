import React, { useEffect, useState } from 'react';
import Post from './Post';
import { GetPostOutstandingAsync } from '@/api/api';

const FeaturedPost = () => {
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    const getDataAsync = async () => {
      const res = await GetPostOutstandingAsync();
      if (res?.statusCode === 200) {
        setData(res?.data);
      }
    };
    getDataAsync();
  }, []);
  return (
    <div className="">
      {data && (
        <>
          <div className="text-[2.5rem] font-bold">Bài viết nổi bật</div>
          <div className="grid grid-cols-4 pt-10 gap-8 mb-10">
            {data &&
              data?.map((post: any, index: any) => (
                <Post key={index} data={post} />
              ))}
          </div>
        </>
      )}
    </div>
  );
};

export default FeaturedPost;
