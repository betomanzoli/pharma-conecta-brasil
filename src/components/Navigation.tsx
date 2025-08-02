
import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar"
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@/components/ui/navbar";
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  LayoutDashboard,
  FileSearch,
  Mail,
  Bell,
  Settings,
  Power,
  Menu,
  Search,
  Plus,
  Users,
  Building2,
  MessageSquare,
  TrendingUp,
  Star,
  Calendar,
  Lock,
  Shield,
  Brain,
  Target,
  Activity
} from "lucide-react";

const Navigation = () => {
  const { profile, signOut } = useAuth();
  const { notifications } = useNotifications();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const unreadNotifications = notifications?.filter(notification => !notification.read);

  const handleLogout = async () => {
    await signOut();
  };

  const navigationItems = [
    {
      label: "Home",
      href: "/",
      icon: Home
    },
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard
    },
    {
      label: "Marketplace",
      href: "/marketplace",
      icon: Building2
    },
    {
      label: "Segurança",
      href: "/security",
      icon: Shield
    },
    {
      label: "Otimização",
      href: "/optimization",
      icon: Settings,
      badge: "NOVA"
    },
  ];

  return (
    <Navbar shouldHideOnScroll className="bg-background border-b">
      <NavbarBrand>
        <Link to="/dashboard" className="flex items-center space-x-2">
          <img src="/logo.png" alt="PharmaConnect Brasil Logo" width="32" height="32" />
          <span className="font-bold text-xl">PharmaConnect Brasil</span>
        </Link>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4">
        {navigationItems.map((item) => (
          <NavbarItem key={item.label}>
            <Link to={item.href} className="flex items-center space-x-2">
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
              {item.badge && (
                <Badge className="ml-2">{item.badge}</Badge>
              )}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        <Input placeholder="Buscar..." className="hidden sm:block w-40 mr-4" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative">
              <Bell className="h-5 w-5" />
              {unreadNotifications?.length > 0 && (
                <Badge
                  className="absolute -top-1 -right-1 rounded-full h-5 w-5 flex items-center justify-center text-xs"
                >
                  {unreadNotifications.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-72">
            <DropdownMenuLabel>Notificações</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications?.slice(0, 5).map((notification) => (
              <DropdownMenuItem key={notification.id}>
                {notification.message}
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem>Ver todas</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt={profile?.first_name} />
                <AvatarFallback>{profile?.first_name?.charAt(0)}{profile?.last_name?.charAt(0)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuItem>
              <Link to="/profile">Perfil</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to="/settings">Configurações</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </NavbarContent>

      <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} className="sm:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <Menu />
      </NavbarMenuToggle>

      <NavbarMenu className="sm:hidden">
        {navigationItems.map((item) => (
          <NavbarMenuItem key={item.label}>
            <Link to={item.href} className="w-full">
              {item.label}
              {item.badge && (
                <Badge className="ml-2">{item.badge}</Badge>
              )}
            </Link>
          </NavbarMenuItem>
        ))}
        <NavbarMenuItem>
          <Button onClick={handleLogout} className="w-full">
            Sair
          </Button>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
};

export default Navigation;
