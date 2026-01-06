import { ReactNode } from 'react';
import { Header } from './Header';
import { DemoBanner } from './DemoBanner';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <DemoBanner />
      <a href="#main-content" className="skip-link">
        Pular para o conteúdo principal
      </a>
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <footer className="border-t border-border bg-card py-4">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} WorkLocation Report Generator. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
