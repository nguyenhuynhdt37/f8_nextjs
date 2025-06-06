'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { LuSearch } from 'react-icons/lu';
import { IoClose, IoSearch } from "react-icons/io5";
import { getSearch } from '@/api/axios/api';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import LoadingBar, { LoadingBarRef } from 'react-top-loading-bar';
import { useRouter } from 'next/navigation';
import { generateSlug } from '@/Utils/functions/slugify';
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
  const ref = useRef<LoadingBarRef>(null);
  const router = useRouter();
  const searchDropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
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

  const handleRedirect = (type: string, id: number, title: string) => {
    setIsFocus(false)
    if (!type && !id) {
      return;
    } else {
      ref.current?.continuousStart();
      switch (type) {
        case 'user':
          const slug = generateSlug(title, id);
          router.push('/profile/' + slug);
          break;
        case 'post':
          const slugPost = generateSlug(title, id);
          router.push('/post/' + slugPost);
          break;
        case 'course':
          const slugCourse = generateSlug(title, id);
          router.push('/courses/' + slugCourse);
          break;
        default:
          router.push('/404');
          break;
      }
      ref.current?.complete();
    }
  }

  const clearSearch = () => {
    setValue('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className='relative w-full'>
      <LoadingBar color="#6366f1" ref={ref} height={2} />
      <div className="relative flex items-center bg-indigo-700/40 backdrop-blur-sm rounded-full px-3 py-2 ring-1 ring-white/20 focus-within:ring-indigo-300 transition-all">
        <IoSearch className="text-indigo-200 text-base" />
        <input
          ref={inputRef}
          onFocus={handleFocus}
          onBlur={handleOnblur}
          value={value}
          type="text"
          placeholder="Tìm kiếm khóa học, bài viết..."
          className="text-sm px-3 w-full bg-transparent text-white placeholder-indigo-200 focus:outline-none"
          onChange={e => handleChange(e.target.value)}
        />
        {value && (
          <button
            onClick={clearSearch}
            className="text-indigo-200 hover:text-white transition-colors"
          >
            <IoClose className="text-lg" />
          </button>
        )}
      </div>

      {isFocus && value && (
        <div
          tabIndex={-1}
          onBlur={handleOnblur}
          ref={searchDropdownRef}
          className='absolute text-sm max-h-96 min-w-96 overflow-y-auto shadow-lg top-12 bg-white dark:bg-gray-800 rounded-lg border border-indigo-100 dark:border-indigo-900 z-50'
        >
          {value && !loading && data && (data.users?.length > 0 || data.courses?.length > 0 || data.posts?.length > 0) ? (
            <div className="p-4">
              <div className="flex items-center pb-3 border-b border-gray-100 dark:border-gray-700">
                <IoSearch className='text-base mr-2 text-indigo-500' />
                <p className='text-sm text-gray-600 dark:text-gray-300'>Kết quả cho '<span className="font-medium">{value}</span>'</p>
              </div>

              <div className="text-gray-700 dark:text-gray-200 pt-2">
                {data.courses?.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center py-2 justify-between border-b border-gray-100 dark:border-gray-700">
                      <h2 className="text-sm font-medium">Khoá học</h2>
                      <button
                        onClick={() => handleClick('course')}
                        className='text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-400 text-xs font-medium transition-colors'
                      >
                        Xem thêm
                      </button>
                    </div>
                    <div className="space-y-1 mt-2">
                      {data.courses?.map((item: Course) => (
                        <div
                          key={item?.id}
                          onClick={() => handleRedirect('course', item?.id, item?.title)}
                          className="flex items-center p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-md cursor-pointer transition-colors"
                        >
                          <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0 bg-indigo-100 dark:bg-indigo-900/50">
                            <img
                              className='w-full h-full object-cover'
                              src={item?.banner || 'https://st.depositphotos.com/1779253/5140/v/450/depositphotos_51402559-stock-illustration-avatar-internet-social-profile-vector.jpg'}
                              alt={item?.title}
                            />
                          </div>
                          <p className='pl-3 font-medium text-sm line-clamp-1'>{item?.title}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {data.posts?.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center py-2 justify-between border-b border-gray-100 dark:border-gray-700">
                      <h2 className="text-sm font-medium">Bài viết</h2>
                      <button
                        onClick={() => handleClick('post')}
                        className='text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-400 text-xs font-medium transition-colors'
                      >
                        Xem thêm
                      </button>
                    </div>
                    <div className="space-y-1 mt-2">
                      {data.posts?.map((item: Blog) => (
                        <div
                          key={item?.id}
                          onClick={() => handleRedirect('post', item?.id, item?.title)}
                          className="flex items-center p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-md cursor-pointer transition-colors"
                        >
                          <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0 bg-indigo-100 dark:bg-indigo-900/50">
                            <img
                              className='w-full h-full object-cover'
                              src={item?.banner}
                              alt={item?.title}
                            />
                          </div>
                          <p className='pl-3 font-medium text-sm line-clamp-1'>{item?.title}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {data.users?.length > 0 && (
                  <div className="mb-2">
                    <div className="flex items-center py-2 justify-between border-b border-gray-100 dark:border-gray-700">
                      <h2 className="text-sm font-medium">Người dùng</h2>
                      <button
                        onClick={() => handleClick('user')}
                        className='text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-400 text-xs font-medium transition-colors'
                      >
                        Xem thêm
                      </button>
                    </div>
                    <div className="space-y-1 mt-2">
                      {data.users?.map((item: User) => (
                        <div
                          key={item?.id}
                          onClick={() => handleRedirect('user', item?.id, item?.fullName || item?.userName)}
                          className="flex items-center p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-md cursor-pointer transition-colors"
                        >
                          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-indigo-100 dark:bg-indigo-900/50">
                            <img
                              className='w-full h-full object-cover'
                              src={item?.avatar || 'https://st.depositphotos.com/1779253/5140/v/450/depositphotos_51402559-stock-illustration-avatar-internet-social-profile-vector.jpg'}
                              alt={item?.fullName}
                            />
                          </div>
                          <p className='pl-3 font-medium text-sm'>{item?.fullName}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            value && !loading && (
              <div className='flex items-center p-4'>
                <IoSearch className='text-base mr-2 text-gray-400' />
                <p className='text-sm text-gray-500'>Không có kết quả cho '<span className="font-medium">{value}</span>'</p>
              </div>
            )
          )}

          {value && loading && (
            <div className='flex items-center p-4'>
              <Spin className='mr-2' indicator={<LoadingOutlined spin />} size="small" />
              <p className='text-sm text-gray-500'>Đang tìm '<span className="font-medium">{value}</span>'</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;


