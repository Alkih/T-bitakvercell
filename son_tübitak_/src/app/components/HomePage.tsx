import { useState } from 'react';
import { Motif, MotifCategory, categoryLabels } from '../types/motif';
import { MotifCard } from './MotifCard';
import { MotifDetail } from './MotifDetail';
import { Button } from './ui/button';
import { Filter } from 'lucide-react';

interface HomePageProps {
  motifs: Motif[];
  footerText: string;
}

export function HomePage({ motifs, footerText }: HomePageProps) {
  const [selectedMotif, setSelectedMotif] = useState<Motif | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<MotifCategory | 'all'>('all');

  const filteredMotifs = selectedCategory === 'all' 
    ? motifs 
    : motifs.filter(m => m.category === selectedCategory);

  const categories: Array<MotifCategory | 'all'> = [
    'all',
    'çini',
    'halı-kilim',
    'motif',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-amber-600 to-red-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif mb-4">Türk Kültürel Mirası</h2>
          <p className="max-w-2xl mx-auto text-lg text-amber-50">
            Anadolu'nun binlerce yıllık zengin kültürel mirasından geleneksel motifleri keşfedin. 
            Her motif bir hikaye, her desen bir medeniyetin izleri taşır.
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="sticky top-0 z-10 bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter className="size-5 text-gray-500 shrink-0" />
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? 'bg-amber-600 hover:bg-amber-700 shrink-0' : 'shrink-0'}
              >
                {category === 'all' ? 'Tümü' : categoryLabels[category]}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Motifs Grid */}
      <div className="container mx-auto px-4 py-8">
        {filteredMotifs.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Bu kategoride henüz motif bulunmamaktadır.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMotifs.map((motif) => (
              <MotifCard
                key={motif.id}
                motif={motif}
                onClick={() => setSelectedMotif(motif)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Motif Detail Dialog */}
      <MotifDetail
        motif={selectedMotif}
        open={!!selectedMotif}
        onClose={() => setSelectedMotif(null)}
      />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h3 className="font-serif mb-4">Hakkımızda</h3>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
              {footerText}
            </p>
          </div>
          <div className="text-center border-t border-gray-700 pt-6">
            <p className="text-gray-400">© 2024 MotifLAB - Türk Kültürel Mirası</p>
          </div>
        </div>
      </footer>
    </div>
  );
}