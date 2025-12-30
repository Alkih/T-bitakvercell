import { Motif } from '../types/motif';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Badge } from './ui/badge';
import { categoryLabels } from '../types/motif';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface MotifDetailProps {
  motif: Motif | null;
  open: boolean;
  onClose: () => void;
}

export function MotifDetail({ motif, open, onClose }: MotifDetailProps) {
  if (!motif) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between gap-4">
            <span className="font-serif">{motif.title}</span>
            <Badge className="bg-amber-100 text-amber-900">
              {categoryLabels[motif.category]}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            {motif.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="aspect-video overflow-hidden rounded-lg bg-gray-100">
            <ImageWithFallback
              src={motif.imageUrl}
              alt={motif.title}
              className="size-full object-cover"
            />
          </div>

          <div>
            <h3 className="font-serif mb-2">Tarihçe</h3>
            <p className="text-gray-700 leading-relaxed">{motif.history}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}