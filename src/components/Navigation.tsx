
import React from 'react';
import { Link } from 'react-router-dom';
import NotificationCenter from '@/components/notifications/NotificationCenter';
import UserProfile from '@/components/navigation/UserProfile';
import MobileMenu from '@/components/navigation/MobileMenu';
import DesktopNavigation from '@/components/navigation/DesktopNavigation';

const Navigation = () => {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="shrink-0 flex items-center">
              <Link to="/dashboard">
                <img
                  className="h-8 w-auto"
                  src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                  alt="PharmaConnect"
                />
              </Link>
            </div>
            <DesktopNavigation />
          </div>

          <div className="flex items-center space-x-4">
            <NotificationCenter />
            <UserProfile />
            <div className="-mr-2 flex md:hidden">
              <MobileMenu />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
