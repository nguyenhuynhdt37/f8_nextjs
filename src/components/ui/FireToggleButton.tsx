import { useState } from 'react';

const FireToggleButton = () => {
    const [isActive, setIsActive] = useState(false);

    const toggleFire = () => {
        setIsActive(!isActive);
    };

    return (
        <button
            onClick={toggleFire}
            className={`p-2 rounded-full transition-all duration-300 ${isActive
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
            aria-label={isActive ? 'Disable fire mode' : 'Enable fire mode'}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`}
            >
                <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177A7.547 7.547 0 016.648 6.61a.75.75 0 00-1.152-.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 011.925-3.545 3.75 3.75 0 013.255 3.717z" clipRule="evenodd" />
            </svg>
        </button>
    );
};

export default FireToggleButton;
