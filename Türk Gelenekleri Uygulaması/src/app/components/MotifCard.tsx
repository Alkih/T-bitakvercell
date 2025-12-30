import { Motif } from "../types/motif";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { categoryLabels } from "../types/motif";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface MotifCardProps {
  motif: Motif;
  onClick: () => void;
}

export function MotifCard({ motif, onClick }: MotifCardProps) {
  return (
    <Card
      className="overflow-hidden cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1"
      onClick={onClick}
    >
      <div className="aspect-[4/3] overflow-hidden bg-gray-100">
        <ImageWithFallback
          src={motif.imageUrl}
          alt={motif.title}
          className="size-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-serif">{motif.title}</h3>
          <Badge
            variant="secondary"
            className="bg-amber-100 text-amber-900 shrink-0"
          >
            {categoryLabels[motif.category]}
          </Badge>
        </div>
        <p className="text-gray-600 line-clamp-2 text-sm">
          {motif.description}
        </p>
      </div>
    </Card>
  );
}