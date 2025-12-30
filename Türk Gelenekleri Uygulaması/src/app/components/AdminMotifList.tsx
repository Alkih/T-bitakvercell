import { Motif, categoryLabels } from '../types/motif';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Edit, Trash2, Plus } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';

interface AdminMotifListProps {
  motifs: Motif[];
  onEdit: (motif: Motif) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export function AdminMotifList({ motifs, onEdit, onDelete, onAdd }: AdminMotifListProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif">Motif Yönetimi</h2>
          <p className="text-gray-600">Tüm motifleri görüntüleyin, düzenleyin veya silin</p>
        </div>
        <Button onClick={onAdd} className="bg-amber-600 hover:bg-amber-700">
          <Plus className="size-4 mr-2" />
          Yeni Motif Ekle
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Başlık</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {motifs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-gray-500 py-8">
                  Henüz motif eklenmemiş
                </TableCell>
              </TableRow>
            ) : (
              motifs.map((motif) => (
                <TableRow key={motif.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={motif.imageUrl}
                        alt={motif.title}
                        className="size-12 rounded object-cover"
                      />
                      <span>{motif.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-amber-100 text-amber-900">
                      {categoryLabels[motif.category]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(motif)}
                      >
                        <Edit className="size-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="size-4 text-red-600" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Motifi Sil</AlertDialogTitle>
                            <AlertDialogDescription>
                              "{motif.title}" motifini silmek istediğinize emin misiniz? 
                              Bu işlem geri alınamaz.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>İptal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDelete(motif.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Sil
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}