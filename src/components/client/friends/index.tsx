'use client';
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import ContentArea from './ContentArea';

const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState(0);
    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Content Area */}
            <ContentArea />
        </div>
    );
};

export default App;