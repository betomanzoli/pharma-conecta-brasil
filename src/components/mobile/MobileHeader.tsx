import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Menu, 
  Search,
  Wifi,
  WifiOff,
  Battery,
  Signal
} from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';
import { cn } from '@/lib/utils';

interface MobileHeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  showMenu?: boolean;
  onMenuClick?: () => void;
  rightAction?: React.ReactNode;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  title,
  showBack = false,
  onBack,
  showMenu = true,
  onMenuClick,
  rightAction
}) => {
  const { profile } = useAuth();
  const { unreadCount } = useNotifications();
  const { isOffline, networkStatus, isInstalled } = usePWA();
  const [batteryLevel, setBatteryLevel] = React.useState<number | null>(null);

  // Battery API
  React.useEffect(() => {
    const getBatteryInfo = async () => {
      if ('getBattery' in navigator) {
        try {
          const battery = await (navigator as any).getBattery();
          setBatteryLevel(battery.level);
          
          const updateBattery = () => setBatteryLevel(battery.level);
          battery.addEventListener('levelchange', updateBattery);
          
          return () => battery.removeEventListener('levelchange', updateBattery);
        } catch (error) {
          console.log('Battery API não disponível');
        }
      }
    };
    
    getBatteryInfo();
  }, []);

  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    return profile?.email?.[0]?.toUpperCase() || 'U';
  };

  const getBatteryColor = () => {
    if (batteryLevel === null) return 'text-muted-foreground';
    if (batteryLevel < 20) return 'text-red-500';
    if (batteryLevel < 50) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getSignalColor = () => {
    if (isOffline) return 'text-red-500';
    if (networkStatus === 'slow') return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border/40 md:hidden">
      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-1 text-xs text-muted-foreground bg-muted/30">
        <div className="flex items-center gap-2">
          <span>{new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
          {isInstalled && (
            <Badge variant="secondary" className="text-xs px-1 py-0">
              PWA
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {/* Signal Indicator */}
          <div className="flex items-center gap-1">
            {isOffline ? (
              <WifiOff className={cn("h-3 w-3", getSignalColor())} />
            ) : (
              <div className="flex items-center gap-0.5">
                <Signal className={cn("h-3 w-3", getSignalColor())} />
                <Wifi className={cn("h-3 w-3", getSignalColor())} />
              </div>
            )}
          </div>
          
          {/* Battery Indicator */}
          {batteryLevel !== null && (
            <div className="flex items-center gap-1">
              <Battery className={cn("h-3 w-3", getBatteryColor())} />
              <span className={cn("text-xs", getBatteryColor())}>
                {Math.round(batteryLevel * 100)}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {showBack ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="h-8 w-8 p-0"
            >
              ←
            </Button>
          ) : showMenu ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuClick}
              className="h-8 w-8 p-0"
            >
              <Menu className="h-4 w-4" />
            </Button>
          ) : null}
          
          <div>
            <h1 className="text-lg font-semibold text-foreground truncate max-w-[200px]">
              {title}
            </h1>
            {isOffline && (
              <p className="text-xs text-muted-foreground">Modo Offline</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {rightAction || (
            <>
              {/* Search Button */}
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Search className="h-4 w-4" />
              </Button>

              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative h-8 w-8 p-0">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs flex items-center justify-center"
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Badge>
                )}
              </Button>

              {/* Profile Avatar */}
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileHeader;