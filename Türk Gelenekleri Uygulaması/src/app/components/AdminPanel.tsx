import { useState } from 'react';
import { Motif } from '../types/motif';
import { AdminLogin } from './AdminLogin';
import { AdminMotifList } from './AdminMotifList';
import { AdminMotifForm } from './AdminMotifForm';
import { AdminFooterEdit } from './AdminFooterEdit';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface AdminPanelProps {
  motifs: Motif[];
  onAddMotif: (motif: Omit<Motif, 'id' | 'createdAt'>) => void;
  onUpdateMotif: (id: string, motif: Omit<Motif, 'id' | 'createdAt'>) => void;
  onDeleteMotif: (id: string) => void;
  isLoggedIn: boolean;
  onLogin: (password: string) => boolean;
  footerText: string;
  onUpdateFooter: (text: string) => void;
}

export function AdminPanel({
  motifs,
  onAddMotif,
  onUpdateMotif,
  onDeleteMotif,
  isLoggedIn,
  onLogin,
  footerText,
  onUpdateFooter,
}: AdminPanelProps) {
  const [editingMotif, setEditingMotif] = useState<Motif | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  if (!isLoggedIn) {
    return <AdminLogin onLogin={onLogin} />;
  }

  const handleSaveMotif = (motifData: Omit<Motif, 'id' | 'createdAt'>) => {
    if (editingMotif) {
      onUpdateMotif(editingMotif.id, motifData);
      setEditingMotif(null);
    } else {
      onAddMotif(motifData);
      setIsAdding(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingMotif(null);
    setIsAdding(false);
  };

  if (isAdding || editingMotif) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <AdminMotifForm
            motif={editingMotif}
            onSave={handleSaveMotif}
            onCancel={handleCancelEdit}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <Tabs defaultValue="motifs" className="space-y-6">
          <TabsList>
            <TabsTrigger value="motifs">Motifler</TabsTrigger>
            <TabsTrigger value="footer">Footer Metni</TabsTrigger>
          </TabsList>

          <TabsContent value="motifs">
            <AdminMotifList
              motifs={motifs}
              onEdit={setEditingMotif}
              onDelete={onDeleteMotif}
              onAdd={() => setIsAdding(true)}
            />
          </TabsContent>

          <TabsContent value="footer">
            <AdminFooterEdit
              footerText={footerText}
              onSave={onUpdateFooter}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}