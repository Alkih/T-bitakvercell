import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { AdminPanel } from './components/AdminPanel';
import { Motif } from './types/motif';
import { initialMotifs } from './data/initialMotifs';
import * as api from './lib/api';
import { toast, Toaster } from 'sonner';

const ADMIN_PASSWORD = 'tetra86!';
const ADMIN_KEY = 'motiflab-admin';

const DEFAULT_FOOTER_TEXT = `MotifLAB, Türkiye'nin zengin kültürel mirasını dijital ortamda yaşatmayı amaçlayan bir platformdur. Anadolu'nun binlerce yıllık geçmişinden gelen geleneksel motifleri, çini sanatını, halı ve kilim dokumacılığını keşfetmenizi sağlıyoruz.

Her motif bir hikaye anlatır, her desen bir medeniyetin izlerini taşır. Amacımız, atalarımızdan miras kalan bu benzersiz sanat eserlerini gelecek nesillere aktarmak ve dünya çapında tanıtmaktır.`;

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'admin'>('home');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [motifs, setMotifs] = useState<Motif[]>([]);
  const [footerText, setFooterText] = useState(DEFAULT_FOOTER_TEXT);
  const [isLoading, setIsLoading] = useState(true);

  // Load motifs from Supabase on mount
  useEffect(() => {
    loadMotifs();
    loadFooter();
    
    // Check admin session
    const adminSession = sessionStorage.getItem(ADMIN_KEY);
    if (adminSession === 'true') {
      setIsAdminLoggedIn(true);
    }
  }, []);

  const loadMotifs = async () => {
    try {
      setIsLoading(true);
      const data = await api.getMotifs();
      
      // If no motifs in database, initialize with default motifs
      if (data.length === 0) {
        for (const motif of initialMotifs) {
          await api.createMotif(motif);
        }
        setMotifs(initialMotifs);
      } else {
        setMotifs(data);
      }
    } catch (error) {
      console.error('Error loading motifs:', error);
      toast.error('Motifler yüklenirken hata oluştu');
      // Fallback to initial motifs
      setMotifs(initialMotifs);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFooter = async () => {
    try {
      const footer = await api.getFooter();
      if (footer && footer.text) {
        setFooterText(footer.text);
      }
    } catch (error) {
      console.error('Error loading footer:', error);
    }
  };

  const handleLogin = (password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem(ADMIN_KEY, 'true');
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem(ADMIN_KEY);
    setCurrentView('home');
  };

  const handleAddMotif = async (motifData: Omit<Motif, 'id' | 'createdAt'>) => {
    try {
      const newMotif: Motif = {
        ...motifData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      
      await api.createMotif(newMotif);
      setMotifs([...motifs, newMotif]);
      toast.success('Motif başarıyla eklendi');
    } catch (error) {
      console.error('Error adding motif:', error);
      toast.error('Motif eklenirken hata oluştu');
      throw error;
    }
  };

  const handleUpdateMotif = async (id: string, motifData: Omit<Motif, 'id' | 'createdAt'>) => {
    try {
      const existingMotif = motifs.find(m => m.id === id);
      const updatedMotif = { 
        ...motifData, 
        id, 
        createdAt: existingMotif?.createdAt || new Date().toISOString() 
      };
      
      await api.updateMotif(id, updatedMotif);
      const updatedMotifs = motifs.map((m) =>
        m.id === id ? updatedMotif : m
      );
      setMotifs(updatedMotifs);
      toast.success('Motif başarıyla güncellendi');
    } catch (error) {
      console.error('Error updating motif:', error);
      toast.error('Motif güncellenirken hata oluştu');
      throw error;
    }
  };

  const handleDeleteMotif = async (id: string) => {
    try {
      await api.deleteMotif(id);
      setMotifs(motifs.filter((m) => m.id !== id));
      toast.success('Motif başarıyla silindi');
    } catch (error) {
      console.error('Error deleting motif:', error);
      const errorMessage = error instanceof Error ? error.message : 'Motif silinirken hata oluştu';
      
      // If motif not found in database, remove it from state anyway
      if (errorMessage.includes('not found')) {
        setMotifs(motifs.filter((m) => m.id !== id));
        toast.success('Motif listeden kaldırıldı');
      } else {
        toast.error(`Silme hatası: ${errorMessage}`);
        throw error;
      }
    }
  };

  const handleUpdateFooter = async (text: string) => {
    try {
      await api.updateFooter({ text });
      setFooterText(text);
      toast.success('Footer başarıyla güncellendi');
    } catch (error) {
      console.error('Error updating footer:', error);
      toast.error('Footer güncellenirken hata oluştu');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center size-full">
        <div className="text-center">
          <div className="size-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="size-full">
      <Toaster position="top-right" richColors />
      <Header
        onNavigate={setCurrentView}
        currentView={currentView}
        isAdminLoggedIn={isAdminLoggedIn}
        onAdminLogout={handleLogout}
      />
      {currentView === 'home' ? (
        <HomePage motifs={motifs} footerText={footerText} />
      ) : (
        <AdminPanel
          motifs={motifs}
          onAddMotif={handleAddMotif}
          onUpdateMotif={handleUpdateMotif}
          onDeleteMotif={handleDeleteMotif}
          isLoggedIn={isAdminLoggedIn}
          onLogin={handleLogin}
          footerText={footerText}
          onUpdateFooter={handleUpdateFooter}
        />
      )}
    </div>
  );
}