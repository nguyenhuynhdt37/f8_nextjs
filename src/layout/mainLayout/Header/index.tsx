'use client';
import ModalAuth from '@/components/client/Header/ModalAuth';
import ModalUser from '@/components/client/Header/ModalUser';
import Search from '@/components/client/Header/Search';
import { useAppSelector } from '@/redux/hook/hook';
import { useRouter, usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import LoadingBar from 'react-top-loading-bar';
import { IoMenuOutline, IoHomeOutline, IoNewspaperOutline, IoChatbubblesOutline } from 'react-icons/io5';
import { RiRoadMapLine, RiAdminLine } from 'react-icons/ri';
import ThemeToggle from '@/components/ui/ThemeToggle';

const Header = () => {
  const user = useAppSelector(state => state?.auth?.user);
  const router = useRouter();
  const pathname = usePathname();
  const ref = React.createRef<any>();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleRedirectHome = () => {
    ref.current.continuousStart();
    router.push('/');
    ref.current.complete();
  };

  const navLinks = [
    { path: '/', label: 'Trang chủ', icon: <IoHomeOutline className="mr-2" /> },
    { path: '/learning-paths', label: 'Lộ trình', icon: <RiRoadMapLine className="mr-2" /> },
    { path: '/post', label: 'Bài viết', icon: <IoNewspaperOutline className="mr-2" /> },
    { path: '/chat', label: 'Tin nhắn', icon: <IoChatbubblesOutline className="mr-2" />, requireAuth: true },
    { path: '/admin/users', label: 'Admin', icon: <RiAdminLine className="mr-2" />, requireAdmin: true }
  ];

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  const handleNavClick = (path: string) => {
    ref.current.continuousStart();
    router.push(path);
    setIsMobileMenuOpen(false);
    ref.current.complete();
  };

  return (
    <header className="relative">
      <LoadingBar color="#0ea5e9" ref={ref} height={3} />
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? 'bg-sky-600/95 dark:bg-gray-800/95 backdrop-blur-md shadow-lg'
          : 'bg-gradient-to-r from-sky-500 to-blue-500 dark:from-gray-800 dark:to-gray-900'
          }`}
      >
        {/* Top gradient bar */}
        {/* <div className="h-1 bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-500 dark:from-sky-600 dark:via-blue-600 dark:to-indigo-700"></div> */}

        {/* Main header content */}
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* Mobile menu button */}
            <button
              className="lg:hidden text-white p-2 rounded-md hover:bg-sky-600/50 dark:hover:bg-gray-700/50 transition-all"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <IoMenuOutline size={24} />
            </button>

            {/* Logo */}
            <div
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={handleRedirectHome}
            >
              <div className="bg-white dark:bg-gray-800 p-1.5 rounded-lg shadow-md group-hover:shadow-lg transition-all transform group-hover:scale-105">
                <img
                  src="https://fullstack.edu.vn/assets/f8-icon-lV2rGpF0.png"
                  alt="F8 Logo"
                  className="w-9 h-9 object-contain"
                />
              </div>
              <div className="hidden md:block">
                <h1 className="font-bold text-xl tracking-tight text-white dark:text-white">F8</h1>
                <p className="text-xs text-sky-100 dark:text-gray-300">Học Lập Trình Để Đi Làm</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => {
                // Skip if link requires auth and user is not logged in
                if (link.requireAuth && !user) return null;

                // Skip if link requires admin and user is not admin
                if (link.requireAdmin && (!user?.user || user?.user?.roleId !== 2)) return null;

                return (
                  <button
                    key={link.path}
                    onClick={() => handleNavClick(link.path)}
                    className={`relative flex items-center text-white font-medium text-sm transition-colors ${isActive(link.path)
                      ? 'text-white after:absolute after:bottom-[-10px] after:left-0 after:right-0 after:h-1 after:bg-white after:rounded-full'
                      : 'text-sky-100 dark:text-gray-300 hover:text-white'
                      }`}
                  >
                    {link.icon}
                    {link.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:block w-64">
              <Search />
            </div>
            <ThemeToggle />
            <div className="flex-shrink-0">
              {!user ? <ModalAuth /> : <ModalUser data={user} />}
            </div>
          </div>
        </div>

        {/* Mobile search - visible only on mobile */}
        <div className="md:hidden px-4 pb-4 flex items-center space-x-3">
          <Search />
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="fixed top-20 left-0 right-0 bg-sky-700/95 dark:bg-gray-800/95 backdrop-blur-md text-white z-40 shadow-lg lg:hidden animate-fadeIn">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => {
                // Skip if link requires auth and user is not logged in
                if (link.requireAuth && !user) return null;

                // Skip if link requires admin and user is not admin
                if (link.requireAdmin && (!user?.user || user?.user?.roleId !== 2)) return null;

                return (
                  <button
                    key={link.path}
                    onClick={() => handleNavClick(link.path)}
                    className={`text-left flex items-center text-white font-medium text-base py-2 px-3 rounded-md transition-colors ${isActive(link.path)
                      ? 'bg-sky-600/70 dark:bg-gray-700/70 text-white'
                      : 'hover:bg-sky-600/50 dark:hover:bg-gray-700/50 text-sky-100 dark:text-gray-300 hover:text-white'
                      }`}
                  >
                    {link.icon}
                    {link.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
