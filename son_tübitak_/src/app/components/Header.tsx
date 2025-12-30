import { Palette, Lock, Home } from 'lucide-react';
import { Button } from './ui/button';

interface HeaderProps {
  onNavigate: (view: 'home' | 'admin') => void;
  currentView: 'home' | 'admin';
  isAdminLoggedIn: boolean;
  onAdminLogout: () => void;
}

export function Header({ onNavigate, currentView, isAdminLoggedIn, onAdminLogout }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-amber-700 to-red-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Palette className="size-8" />
            <div>
              <h1 className="font-serif">MotifLAB</h1>
              <p className="text-amber-100 text-sm">Türk Kültürel Mirası</p>
            </div>
          </div>
          
          <nav className="flex items-center gap-2">
            <Button
              variant={currentView === 'home' ? 'secondary' : 'ghost'}
              onClick={() => onNavigate('home')}
              className={currentView === 'home' ? '' : 'text-white hover:text-amber-100 hover:bg-white/10'}
            >
              <Home className="size-4 mr-2" />
              Ana Sayfa
            </Button>
            
            {isAdminLoggedIn ? (
              <>
                <Button
                  variant={currentView === 'admin' ? 'secondary' : 'ghost'}
                  onClick={() => onNavigate('admin')}
                  className={currentView === 'admin' ? '' : 'text-white hover:text-amber-100 hover:bg-white/10'}
                >
                  <Lock className="size-4 mr-2" />
                  Admin Panel
                </Button>
                <Button
                  variant="ghost"
                  onClick={onAdminLogout}
                  className="text-white hover:text-amber-100 hover:bg-white/10"
                >
                  Çıkış
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                onClick={() => onNavigate('admin')}
                className="text-white hover:text-amber-100 hover:bg-white/10"
              >
                <Lock className="size-4 mr-2" />
                Admin Girişi
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
