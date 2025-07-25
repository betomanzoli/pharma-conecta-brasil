import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import UserProfile from './navigation/UserProfile';
import MobileMenu from './navigation/MobileMenu';
import NotificationBell from './notifications/NotificationBell';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

const Navigation = () => {
  const { profile } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                alt="Workflow"
              />
            </Link>
            
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              
              <NavLink
                to="/network"
                className={({ isActive }) =>
                  `text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-gray-100 text-gray-900' : ''}`
                }
              >
                Rede
              </NavLink>
              <NavLink
                to="/marketplace"
                className={({ isActive }) =>
                  `text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-gray-100 text-gray-900' : ''}`
                }
              >
                Marketplace
              </NavLink>
              <NavLink
                to="/projects"
                className={({ isActive }) =>
                  `text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-gray-100 text-gray-900' : ''}`
                }
              >
                Projetos
              </NavLink>
              <NavLink
                to="/regulatory"
                className={({ isActive }) =>
                  `text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-gray-100 text-gray-900' : ''}`
                }
              >
                Regulatório
              </NavLink>
              <NavLink
                to="/mentorship"
                className={({ isActive }) =>
                  `text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-gray-100 text-gray-900' : ''}`
                }
              >
                Mentoria
              </NavLink>
              <NavLink
                to="/forums"
                className={({ isActive }) =>
                  `text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-gray-100 text-gray-900' : ''}`
                }
              >
                Fóruns
              </NavLink>
              <NavLink
                to="/knowledge"
                className={({ isActive }) =>
                  `text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-gray-100 text-gray-900' : ''}`
                }
              >
                Conhecimento
              </NavLink>
              <NavLink
                to="/integrations"
                className={({ isActive }) =>
                  `text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium ${isActive ? 'bg-gray-100 text-gray-900' : ''}`
                }
              >
                Integrações
              </NavLink>
              <Link
                to="/chat"
                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Chat
              </Link>
              <Link
                to="/ratings"
                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Avaliações
              </Link>
              <Link
                to="/analytics"
                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Analytics
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            <div className="flex-shrink-0">
              <NotificationBell />
            </div>
            <div className="hidden md:ml-4 md:flex-shrink-0 md:flex items-center">
              <UserProfile />
            </div>
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
