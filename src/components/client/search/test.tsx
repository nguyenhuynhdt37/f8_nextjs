'use client';
import { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getUsers } from '@/api/axios/api'; // API bạn tự cấu hình nhé

interface User {
    id: string;
    fullName: string;
    avatar: string;
}

interface Post {
    id: string;
    title: string;
    banner: string;
}

interface Course {
    id: string;
    title: string;
    banner: string;
}

type ActiveTab = 'user' | 'post' | 'course';

const SearchFacebookStyle = () => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('user');
    const [keyword, setKeyword] = useState('');

    const [users, setUsers] = useState<User[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);

    const [pages, setPages] = useState({
        user: 1,
        post: 1,
        course: 1,
    });

    const [hasMore, setHasMore] = useState({
        user: true,
        post: true,
        course: true,
    });

    useEffect(() => {
        if (keyword.trim()) {
            // Khi đổi keyword => reset hết
            setUsers([]);
            setPosts([]);
            setCourses([]);
            setPages({ user: 1, post: 1, course: 1 });
            setHasMore({ user: true, post: true, course: true });
            fetchData('user', 1);
            fetchData('post', 1);
            fetchData('course', 1);
        }
    }, [keyword]);

    const fetchData = async (type: ActiveTab, pageNumber: number) => {
        try {
            const res = await getUsers(keyword, type, pageNumber); // nhớ chỉnh API gọi đúng
            if (res?.statusCode === 200) {
                switch (type) {
                    case 'user':
                        if (pageNumber === 1) setUsers(res.users || []);
                        else setUsers(prev => [...prev, ...(res.users || [])]);
                        if (!res.users || res.users.length < 5) {
                            setHasMore(prev => ({ ...prev, user: false }));
                        }
                        break;
                    case 'post':
                        if (pageNumber === 1) setPosts(res.posts || []);
                        else setPosts(prev => [...prev, ...(res.posts || [])]);
                        if (!res.posts || res.posts.length < 5) {
                            setHasMore(prev => ({ ...prev, post: false }));
                        }
                        break;
                    case 'course':
                        if (pageNumber === 1) setCourses(res.courses || []);
                        else setCourses(prev => [...prev, ...(res.courses || [])]);
                        if (!res.courses || res.courses.length < 5) {
                            setHasMore(prev => ({ ...prev, course: false }));
                        }
                        break;
                }
            }
        } catch (error) {
            console.error(error);
            setHasMore(prev => ({ ...prev, [type]: false }));
        }
    };

    const fetchMore = () => {
        const nextPage = pages[activeTab] + 1;
        setPages(prev => ({ ...prev, [activeTab]: nextPage }));
        fetchData(activeTab, nextPage);
    };

    const renderData = () => {
        switch (activeTab) {
            case 'user':
                return users.map(u => (
                    <div key={u.id} className="flex items-center gap-3 p-3 border-b hover:bg-gray-100 cursor-pointer">
                        <img src={u.avatar || '/default-avatar.png'} className="w-10 h-10 rounded-full" />
                        <p>{u.fullName}</p>
                    </div>
                ));
            case 'post':
                return posts.map(p => (
                    <div key={p.id} className="flex items-center gap-3 p-3 border-b hover:bg-gray-100 cursor-pointer">
                        <img src={p.banner || '/default-banner.png'} className="w-10 h-10 rounded" />
                        <p>{p.title}</p>
                    </div>
                ));
            case 'course':
                return courses.map(c => (
                    <div key={c.id} className="flex items-center gap-3 p-3 border-b hover:bg-gray-100 cursor-pointer">
                        <img src={c.banner || '/default-banner.png'} className="w-10 h-10 rounded" />
                        <p>{c.title}</p>
                    </div>
                ));
        }
    };

    return (
        <div className='w-[400px] mx-auto'>
            <input
                type="text"
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                placeholder="Tìm kiếm người dùng, bài viết, khoá học..."
                className="w-full p-3 border rounded mb-5"
            />
            <div className="flex justify-around mb-5">
                <button onClick={() => setActiveTab('user')} className={activeTab === 'user' ? 'text-blue-500' : ''}>User</button>
                <button onClick={() => setActiveTab('post')} className={activeTab === 'post' ? 'text-blue-500' : ''}>Post</button>
                <button onClick={() => setActiveTab('course')} className={activeTab === 'course' ? 'text-blue-500' : ''}>Course</button>
            </div>
            <InfiniteScroll
                dataLength={
                    activeTab === 'user' ? users.length :
                        activeTab === 'post' ? posts.length :
                            courses.length
                }
                next={fetchMore}
                hasMore={hasMore[activeTab]}
                loader={<p>Đang tải...</p>}
                endMessage={<p className='text-center text-gray-400'>Không còn kết quả</p>}
                scrollableTarget="scrollableDiv"
            >
                {renderData()}
            </InfiniteScroll>
        </div>
    );
};

export default SearchFacebookStyle;
