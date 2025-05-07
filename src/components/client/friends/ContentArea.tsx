import React, { useEffect } from 'react';
import Section from './Section';
import UserCard from './UserCard';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getDataFriendRequests } from '@/api/axios/api';

const ContentArea: React.FC = () => {
    const [hasMore, setHasMore] = React.useState(true);
    const [loading, setLoading] = React.useState(false);
    const [data, setData] = React.useState([]);
    const [page, setPage] = React.useState({
        totalPage: 1,
        currentPage: 1,
        size: 10,
    });

    const filterData = (data: any, setData: any) => {

        if (!data) setData([]);
        if (page.currentPage === 1) {
            setData(data?.friendRequests);
            setPage({
                ...page,
                totalPage: data?.totalPage,
                currentPage: data?.currentPage,
            });
        } else {
            setData((prevData: any) => [...prevData, ...data?.friendRequests]);
            setPage({
                ...page,
                totalPage: data?.totalPage,
                currentPage: data?.currentPage,
            });
        }
        if (page.currentPage === page.totalPage) {
            setHasMore(false);
        }
    }
    const handleFetchData = async (size: number, currentPage: number) => {
        try {
            const response = await getDataFriendRequests(size, currentPage);

            if (response?.statusCode === 200) {
                filterData(response?.data, setData);
            }
            else {
                setHasMore(false);
            }
        }
        catch (error) {
            console.error('Error fetching data:', error);
        }
        finally {
            setLoading(false);
        }
        setLoading(false);
    }
    useEffect(() => {
        handleFetchData(page.size, page.currentPage);
    }
        , []);
    const fetchMore = async () => {
        handleFetchData(page.size, page.currentPage + 1);
    }
    // --- Dữ liệu mẫu ---
    const peopleMayKnow = [];
    // --- Kết thúc dữ liệu mẫu ---
    const renderData = () => {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {data.map((item: any) => (
                    <UserCard
                        key={item.id}
                        data={item}
                        type="request"
                    />
                ))}
            </div>
        );
    }
    return (
        // flex-1 để chiếm không gian còn lại, padding, space-y để tạo khoảng cách giữa các section
        <main className="flex-1 overflow-y-auto">
            {/* Friend Requests Section */}
            <Section title="Lời mời kết bạn" seeAllLink="#">
                <InfiniteScroll
                    dataLength={
                        data.length
                    }
                    next={fetchMore}
                    hasMore={hasMore}
                    loader={<p>Đang tải...</p>}
                    endMessage={<p className='text-center text-xl p-5 text-gray-400'>Không còn kết quả</p>}
                    scrollableTarget="scrollableDiv"
                >
                    {renderData()}
                </InfiniteScroll>
            </Section>

            {/* People You May Know Section */}
            <Section title="Bạn bè có thể biết" seeAllLink="#">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                    {peopleMayKnow.map(user => (
                        <UserCard
                            key={user.id}
                            data={user}
                            type="suggestion"
                        />
                    ))}
                </div>
            </Section>

            {/* Thêm các section khác nếu cần */}
        </main>
    );
};

export default ContentArea;