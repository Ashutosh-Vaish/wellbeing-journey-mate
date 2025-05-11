
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  path: string;
  icon: string;
}

const NavBar: React.FC = () => {
  const location = useLocation();
  
  const navItems: NavItem[] = [
    { name: 'Home', path: '/', icon: '🏠' },
    { name: 'Journal', path: '/journal', icon: '📓' },
    { name: 'Breathing', path: '/breathing', icon: '🧘' },
    { name: 'Affirmations', path: '/affirmations', icon: '💭' },
    { name: 'Progress', path: '/progress', icon: '📊' },
    { name: 'Resources', path: '/resources', icon: '📚' },
  ];
  
  return (
    <nav className="fixed bottom-0 w-full md:top-0 md:h-screen md:w-auto md:p-4 bg-white dark:bg-gray-900 shadow-lg z-50 md:shadow-md">
      <div className="flex md:flex-col justify-around md:justify-start md:gap-8 py-3 md:py-6 px-4">
        {navItems.map((item) => (
          <Link 
            key={item.name} 
            to={item.path}
            className={cn(
              "flex flex-col md:flex-row items-center md:gap-3 px-2 md:px-4 py-2 rounded-lg transition-all",
              location.pathname === item.path 
                ? "text-primary bg-primary/10 font-medium"
                : "text-muted-foreground hover:text-primary hover:bg-primary/5"
            )}
          >
            <span className="text-lg md:text-xl">{item.icon}</span>
            <span className="text-xs md:text-sm">{item.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default NavBar;
