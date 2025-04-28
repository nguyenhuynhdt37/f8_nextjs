'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { LuSearch } from 'react-icons/lu';
import { TiDelete } from 'react-icons/ti';
import { IoSearch } from "react-icons/io5";
import { getSearch } from '@/api/axios/api';
import { FaSpinner } from 'react-icons/fa';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import LoadingBar, { LoadingBarRef } from 'react-top-loading-bar';
import { useRouter } from 'next/navigation';
interface Course {
  id: number;
  title: string;
  type: string;
  banner: string;
  createdAt: string;
}
interface User {
  id: number;
  fullName: string;
  userName: string;
  roleId: number;
  avatar: string;
  isFriend: boolean;
}
interface Blog {
  id: number;
  title: string;
  type: string;
  banner: string;
  createdAt: string;
}

const Search = () => {
  const [value, setValue] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [isBlur, setIsBlur] = useState(false);
  const ref = useRef<LoadingBarRef>(null);
  const router = useRouter();
  const searchDropdownRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<{
    users: User[];
    courses: Course[];
    posts: Blog[];
  } | null>(null);
  function debounce<T extends (...args: any[]) => void>(func: T, delay: number): (...args: Parameters<T>) => void {
    let timer: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  }
  const handleFetchSearch = async (value: string) => {

    const res = await getSearch(value)
    if (res?.statusCode === 200) {
      setData(res?.data)
    }
    setLoading(false)
  }
  const handleSearch = useCallback(
    debounce((value: string) => {
      if (value.trim()) {
        try {
          handleFetchSearch(value.trim())
        } catch (ex) {
          // throw
          console.log(ex);
        }
      }
    }, 300),
    []
  );
  const handleChange = (q: string) => {
    setLoading(true)
    setValue(q)
    handleSearch(q)
  }
  const handleFocus = () => {
    setIsFocus(true)
  }
  const handleOnblur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (searchDropdownRef.current && searchDropdownRef.current.contains(e.relatedTarget as Node)) return;
    setIsFocus(false)
  }

  const handleClick = (type: string) => {

    if (!type) return;
    if (ref.current) {
      ref.current.continuousStart();
    }
    router.push(`/search?keyword=${value}&type=${type}`);
    if (ref.current) {
      ref.current.complete();
    }
    setIsFocus(false)
  }
  const handleRedirect = (type: string, id: number) => {
    setIsFocus(false)
    if (!type && !id) {
      return;
    } else {
      ref.current?.continuousStart();
      switch (type) {
        case 'user':
          router.push('/profile/' + id);
          break;
        case 'post':
          router.push('/post/' + id);
          break;
        case 'course':
          router.push('/learning/' + id);
          break;
        default:
          router.push('/404');
          break;
      }
      ref.current?.complete();
    }
  }
  return (
    <div className='relative'>
      <LoadingBar color="#0066df" ref={ref} />
      <div className="flex items-center border-2 px-4 text-[#7c7c7c] focus:border-[#676666] py-3 rounded-full text-[2rem]">
        <LuSearch />
        <input
          onFocus={handleFocus}
          onBlur={handleOnblur}
          value={value}
          type="text"
          placeholder="Tìm kiếm khóa học, bài viết, video, ..."
          className="text-[1.4rem] px-4 w-[36rem] focus:outline-none"
          onChange={e => handleChange(e.target.value)}
        />

        <TiDelete
          className={`cursor-pointer ${value ? 'text-[#bdbdbd]' : 'text-[#fff]'}`}
          onClick={() => setValue('')}
        />
      </div>
      {isFocus && value && (<div tabIndex={-1} onBlur={handleOnblur} ref={searchDropdownRef} className='absolute text-[1.5rem] max-h-[50rem] overflow-y-scroll shadow-md p-5 top-20 border-[1px] border-[#fbfbfb] bg-white rounded-xl w-full'>
        {value && !loading && data && (data.users?.length > 0 || data.courses?.length > 0 || data.posts?.length > 0) ? (
          <div>
            <div className="flex items-center pb-5">
              <IoSearch className='text-3xl mr-5 text-[#868686]' />
              <p className='text-xl text-[#919191]'>Kết quả cho '{value}'</p>
            </div>
            <div className="text-[#575757]">
              {data.courses?.length > 0 && <div className="">
                <div className="flex items-center py-3 justify-between border-b-[1px] border-[#f2f2f2]">
                  <h2>Khoá học</h2>
                  <button onClick={() => handleClick('course')} className='text-[#b3b3b3] font-light text-md  hover:text-[#d98686]'>Xem thêm</button>
                </div>
                {data.courses?.map((item: Course, index: number) => (
                  <div key={item?.id} className="" onClick={() => handleRedirect('course', item?.id)} >
                    <div className="flex items-center hover:text-[#d98686] cursor-pointer py-5">
                      <img className='w-12 h-12 rounded-full object-cover' src={item?.banner || 'https://st.depositphotos.com/1779253/5140/v/450/depositphotos_51402559-stock-illustration-avatar-internet-social-profile-vector.jpg'} alt="" />
                      <p className='ps-10 font-light'>{item?.title}</p>
                    </div>
                  </div>
                ))}
              </div>
              }
              {data.posts?.length > 0 && <div className="">
                <div className="flex items-center py-3 justify-between border-b-[1px] border-[#f2f2f2]">
                  <h2>Bài viết</h2>
                  <button onClick={() => handleClick('post')} className='text-[#b3b3b3] font-light text-md  hover:text-[#d98686]'>Xem thêm</button>
                </div>
                {data.posts?.map((item: Blog, index: number) => (
                  <div key={item?.id} className="" onClick={() => handleRedirect('post', item?.id)} >
                    <div className="flex items-center hover:text-[#d98686] cursor-pointer py-5">
                      <img className='w-12 h-12 rounded-full object-cover' src={item?.banner} alt="" />
                      <p className='ps-10 font-light'>{item?.title}</p>
                    </div>
                  </div>
                ))}
              </div>
              }
              {data.users?.length > 0 && <div className="">
                <div className="flex items-center py-3 justify-between border-b-[1px] border-[#f2f2f2]">
                  <h2>Người dùng</h2>
                  <button onClick={() => handleClick('user')} className='text-[#b3b3b3] font-light text-md  hover:text-[#d98686]'>Xem thêm</button>
                </div>
                {data.users?.map((item: User, index: number) => (
                  <div onClick={() => handleRedirect('user', item?.id)} key={item?.id} className="">
                    <div className="flex items-center hover:text-[#d98686] cursor-pointer py-5">
                      <img className='w-12 h-12 rounded-full object-cover' src={item?.avatar || 'https://st.depositphotos.com/1779253/5140/v/450/depositphotos_51402559-stock-illustration-avatar-internet-social-profile-vector.jpg'} alt="" />
                      <p className='ps-10 font-light'>{item?.fullName}</p>
                    </div>
                  </div>
                ))}
              </div>
              }
            </div>
          </div>
        ) : (value && !loading && (
          <div className='flex items-center'>
            <IoSearch className='text-3xl mr-5' />
            <p className='text-xl text-[#bebebe]'>Không có kết quả cho '{value}'</p>
          </div>
        ))}
        {value && loading && <div className='flex items-center'>
          <Spin className='mr-5' indicator={<LoadingOutlined spin />} size="small" />
          <p className='text-xl text-[#bebebe]'>Tìm '{value}'</p>
        </div>}
      </div>)}
    </div>
  );
};

export default Search;


