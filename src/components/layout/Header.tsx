import { FileSpreadsheet } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Dashboard' },
  { href: '/reports', label: 'Relatórios' },
];

export function Header() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
          aria-label="Ir para página inicial"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <FileSpreadsheet className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
          </div>
          <span className="text-lg font-semibold text-foreground">
            WorkLocation Reports
          </span>
        </Link>

        <nav aria-label="Navegação principal">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={cn(
                      'rounded-md px-4 py-2 text-sm font-medium transition-colors',
                      'hover:bg-secondary hover:text-foreground',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
