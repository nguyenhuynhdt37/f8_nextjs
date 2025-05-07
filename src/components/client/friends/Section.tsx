import React from 'react';

interface SectionProps {
    title: string;
    seeAllLink?: string;
    children: React.ReactNode; // Để chứa nội dung (ví dụ: grid các UserCard)
}

const Section: React.FC<SectionProps> = ({ title, seeAllLink, children }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm">
            {/* Section Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
                {seeAllLink && (
                    <a href={seeAllLink} className="text-xl text-blue-600 hover:underline">
                        Xem tất cả
                    </a>
                )}
            </div>

            {/* Section Content */}
            <div className='py-5'>
                {children}
            </div>
        </div>
    );
};

export default Section;