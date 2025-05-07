'use client'
import { PiStudentBold } from "react-icons/pi";
import { getSearchWithType } from "@/api/axios/api";
import { useEffect, useState, ChangeEvent, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { IoMdHeart } from "react-icons/io";
import { MdPlayLesson } from "react-icons/md";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { FaCheckCircle } from "react-icons/fa";
interface Course {
    id: string;
    title: string;
    type: string;
    banner: string;
    description: string | null;
    createdAt: string;
    countUsers: number;
    countLesson: number;
}
interface User {
    id: string;
    fullName: string;
    userName: string;
    roleId: number;
    avatar: string;
    isFriend: boolean;
    commonFriends: number | null;
    statusFriend: string | null;

}
interface Blog {
    id: string;
    title: string;
    type: string;
    banner: string;
    createdAt: string;
    numberOfHeart: number;
    numberOfComment: number;
}

interface PageState {
    post: number;
    user: number;
    course: number;
}

interface HasMoreState {
    post: boolean;
    user: boolean;
    course: boolean;
}
interface Data {
    post: Blog[];
    user: User[];
    course: Course[];
}
const isActiveTab = (value: any): value is ActiveTab => {
    return value === 'user' || value === 'post' || value === 'course';
};
type ActiveTab = 'user' | 'post' | 'course';

const Search = () => {
    const searchParams = useSearchParams();
    const [data, setData] = useState<Data>({
        post: [],
        user: [],
        course: []
    });
    const router = useRouter();
    const typeParam = searchParams.get('type');
    const keywordParam = searchParams.get('keyword');
    const [keyword, setKeyword] = useState(keywordParam || '')
    const initialTab: ActiveTab = isActiveTab(typeParam) ? typeParam : 'course';
    const [tab, setTab] = useState<ActiveTab>(initialTab);
    const [page, setPage] = useState<PageState>({
        post: 1,
        user: 1,
        course: 1,
    })
    useEffect(() => {
        const currentTab = searchParams.get('type') as 'user' | 'post' | 'course';
        const keywordParam2 = searchParams.get('keyword');

        if (keyword !== keywordParam2) {
            setKeyword(keywordParam2 || keyword)
        }
        if (currentTab) {
            setTab(currentTab);
            if (keyword && hasMore[currentTab]) {
                if (keyword.trim()) {
                    setPage({
                        post: 1,
                        user: 1,
                        course: 1,
                    })
                    setHasMore({
                        post: true,
                        user: true,
                        course: true,
                    })
                    setData({
                        post: [],
                        user: [],
                        course: []
                    });
                }
                fetchData(keyword, currentTab, page[currentTab])
            }
        } else {
            const params = new URLSearchParams(searchParams.toString());
            params.set('type', 'course');
            router.push(`?${params.toString()}`);
            setTab('course')
            if (keyword && hasMore['course']) {
                if (keyword.trim()) {
                    setPage({
                        post: 1,
                        user: 1,
                        course: 1,
                    })
                    setHasMore({
                        post: true,
                        user: true,
                        course: true,
                    })
                    setData({
                        post: [],
                        user: [],
                        course: []
                    });
                }
                fetchData(keyword, 'course', page['course'])
            }
        }

    }, [searchParams])
    function debounce<T extends (...args: any[]) => void>(func: T, delay: number): (...args: Parameters<T>) => void {
        let timer: NodeJS.Timeout;
        return (...args: Parameters<T>) => {
            clearTimeout(timer);
            timer = setTimeout(() => func(...args), delay);
        };
    }
    const fetchData = async (keyword: string, type: ActiveTab, pageNumber: number) => {
        try {
            const res = await getSearchWithType(keyword, type, pageNumber)
            if (res?.statusCode === 200) {
                if (pageNumber === 1) {
                    setData(prev => ({
                        ...prev,
                        [type]: res?.data || []
                    }))
                }
                else {
                    setData(prev => ({
                        ...prev,
                        [type]: [...prev[type], ...(res?.data || [])]
                    }))
                }
                if (res?.data?.length < 5) {
                    setHasMore({ ...hasMore, [type]: false })
                }
            }
        } catch (ex) {
            console.error(ex);
            setHasMore(prev => ({ ...prev, [type]: false }));
        }
    }
    const handleSearch = useCallback(
        debounce(async (value: string) => {
            if (value.trim()) {
                await fetchData(value, tab, page[tab])
            }
        }, 300), []);
    const [hasMore, setHasMore] = useState<HasMoreState>({
        post: true,
        user: true,
        course: true,
    })

    useEffect(() => {
        if (keyword.trim()) {
            setPage({
                post: 1,
                user: 1,
                course: 1,
            })
            setHasMore({
                post: true,
                user: true,
                course: true,
            })
            setData({
                post: [],
                user: [],
                course: []
            });
        }
    }, [keyword])

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        setKeyword(e.target.value);
        const params = new URLSearchParams(searchParams.toString());
        params.set('keyword', e.target.value);
        router.push(`?${params.toString()}`);
        handleSearch(e.target.value);
    }

    const fetchMore = async () => {
        if (hasMore[tab]) {
            const nextpage = page[tab] + 1
            await fetchData(keyword, tab, nextpage)
            setPage({ ...page, [tab]: nextpage })
        }
    }
    const handleOnChangeTab = async (tab: ActiveTab) => {
        setTab(tab)
        const params = new URLSearchParams(searchParams.toString());
        params.set('type', tab);
        router.push(`?${params.toString()}`);
        if (hasMore[tab] == true && data[tab].length == 0) {
            await fetchData(keyword, tab, page[tab])
        }
    }
    console.log('data', data['user']);

    const render = () => {
        return (
            <div className="">
                {tab === 'course' && data[tab]?.length > 0 && data[tab]?.map((course: Course) => (
                    <div key={course?.id} className="flex py-10 border-b-[0.1rem] gap-11 items-start h-full">
                        <img className="rounded-2xl w-[30rem] h-72 object-cover" src={course?.banner} alt="" />
                        <div className="flex flex-col justify-between w-full">
                            <h2 className="text-4xl font-bold">{course?.title}</h2>
                            <p className="py-5 text-[#555]">{course?.description ? (<div
                                dangerouslySetInnerHTML={{ __html: course?.description }}
                            />) : "Không có dữ liệu"}</p>
                            <div className="flex items-center">
                                <PiStudentBold className="text-3xl mr-2 text-[#656565]" />
                                {course?.countUsers} học viên
                            </div>
                            <div className="flex pt-5 items-center">
                                <MdPlayLesson className="text-3xl mr-2 text-[#656565]" />
                                {course?.countLesson} học viên
                            </div>
                        </div>
                    </div>
                ))
                }
                {tab === 'post' && data[tab]?.length > 0 && data[tab]?.map((post: Blog) => (
                    <div key={post?.id} className="py-10 items-start border-b-[0.1rem]">
                        <img className="rounded-2xl w-full h-[40rem] object-cover" src={post?.banner} alt="" />
                        <div>
                            <h2 className="text-4xl font-bold pt-10">{post.title}</h2>
                            <p className="pt-5 text-[#999]">Đọc tiếp ...</p>
                        </div>
                        <div className="items-center justify-between pt-5 flex">
                            <div className="flex items-center">
                                <IoMdHeart className="text-4xl mr-2" />
                                {post.numberOfHeart || 0}
                            </div>
                            {post.numberOfComment || 0} bình luận
                        </div>
                    </div>
                ))
                }
                {
                    tab === 'user' && data[tab].length > 0 && data[tab]?.map((user: User) => (
                        (
                            <div key={user?.id} className="flex py-5 border-b-[0.1rem] gap-11 items-start">
                                <img className="w-24 rounded-full h-24 object-cover" src={user.avatar || "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"} alt="" />
                                <div className="flex flex-1 items-center gap-5 justify-between">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-2xl font-medium">{user?.fullName}</h2>
                                            {user?.roleId == 2 && <FaCheckCircle color="#0064d1" />}
                                        </div>
                                        {user?.roleId == 2 && <p className="py-2 text-[#555]">Quản trị viên</p>}
                                        {/* {user?.isFriend && <p className="py-2 text-[#555]">Bạn bè</p>} */}
                                        {/* {user?.commonFriends && <p className="text-[#555]">{user?.commonFriends} bạn chung.</p>} */}
                                    </div>
                                    <button className="bg-[#ebf5ff] text-[#0064d1] p-4 rounded-xl cursor-pointer">Thêm bạn bè</button>
                                </div>
                            </div>
                        )
                    ))
                }
            </div >
        )
    }
    return (
        <div className='p-20 w-full text-[1.5rem] flex justify-between gap-20 font-normal'>
            <div className=" w-full">
                <h2 className="title font-bold text-4xl">Tìm kiếm</h2>
                <p className='py-10 text-[#535353]'>Tìm kiếm học viên, video, bài học, ...</p>
                <input
                    type="text"
                    value={keyword}
                    onChange={handleOnChange}
                    className='text-4xl w-full focus:outline-0 py-4 border-b-[0.1rem]'
                />
                {keyword &&
                    (
                        <div>
                            <div className="border-b flex gap-12 pt-6 py-2 items-center border-gray-200">
                                {<button disabled={tab === 'course'} onClick={() => handleOnChangeTab('course')} className={`${tab !== 'course' ? 'hover:text-[#bb7473]' : 'text-[#c3743f]'}`}>Khoá học</button>}
                                {<button disabled={tab === 'post'} onClick={() => handleOnChangeTab('post')} className={`${tab !== 'post' ? 'hover:text-[#bb7473]' : 'text-[#c3743f]'}`}>Bài viết</button>}
                                {<button disabled={tab === 'user'} onClick={() => handleOnChangeTab('user')} className={`${tab !== 'user' ? 'hover:text-[#bb7473]' : 'text-[#c3743f]'}`}>Người dùng</button>}
                            </div>
                            <InfiniteScroll
                                dataLength={
                                    tab === 'user' ? data.user.length :
                                        tab === 'post' ? data.post.length :
                                            data.course.length
                                }
                                next={fetchMore}
                                hasMore={hasMore[tab]}
                                loader={<p className='text-center pt-5 text-gray-400'>Đang tải</p>}
                                endMessage={<p className='text-center pt-5 text-gray-400'>Không còn kết quả</p>}
                                scrollableTarget="scrollableDiv"
                            >
                                {render()}
                            </InfiniteScroll>
                        </div>
                    )}
            </div>
            <div className="w-[35rem] pt-[14rem]">
                <div className="sticky flex flex-col gap-12">
                    <img className="rounded-2xl" src="https://files.fullstack.edu.vn/f8-prod/banners/27/63dc622a82286.png" alt="" />
                    <img className="rounded-2xl" src="https://files.fullstack.edu.vn/f8-prod/banners/34/64211495ef572.png" alt="" />
                </div>
            </div>
        </div >
    )
}

export default Search