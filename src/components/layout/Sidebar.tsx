'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

export interface NavGroup {
  label?: string;
  items: NavItem[];
}

export interface SidebarProps {
  brand: string;
  navItems: NavItem[];
  navGroups?: NavGroup[];
  logo?: React.ReactNode;
}

export default function Sidebar({ brand, navItems, navGroups, logo }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/portal') {
      return pathname === '/portal';
    }
    return pathname.startsWith(href);
  };

  const renderNavItems = (items: NavItem[]) => (
    <ul className="space-y-1">
      {items.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive(item.href)
                ? 'bg-primary-50 text-primary-700 font-medium'
                : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-secondary-200">
        {logo ? (
          <div className="flex items-center gap-3">{logo}</div>
        ) : (
          <h2 className="text-xl font-bold text-secondary-900">{brand}</h2>
        )}
      </div>
      <nav className="flex-1 p-4 overflow-y-auto scrollbar-thin space-y-6">
        {navItems.length > 0 && renderNavItems(navItems)}
        {navGroups && navGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            {group.label && (
              <p className="px-4 text-xs font-semibold text-secondary-400 uppercase tracking-wider mb-2">
                {group.label}
              </p>
            )}
            {renderNavItems(group.items)}
          </div>
        ))}
      </nav>
    </div>
  );
}
