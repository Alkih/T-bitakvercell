import { ArrowLeft, Save, Upload, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Motif, MotifCategory, categoryLabels } from '../types/motif';
import * as api from '../lib/api';
import { toast } from 'sonner';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface AdminMotifFormProps {
  motif: Motif | null;
  onSave: (motif: Omit<Motif, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export function AdminMotifForm({ motif, onSave, onCancel }: AdminMotifFormProps) {
  const [formData, setFormData] = useState({
    title: motif?.title || '',
    category: motif?.category || ('çini' as MotifCategory),
    description: motif?.description || '',
    history: motif?.history || '',
    imageUrl: motif?.imageUrl || '',
    fileName: motif?.fileName || '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is image
    if (!file.type.startsWith('image/')) {
      toast.error('Lütfen bir resim dosyası seçin (JPEG veya PNG)');
      return;
    }

    // Check file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Dosya boyutu 5MB\'dan küçük olmalıdır');
      return;
    }

    setIsUploading(true);
    try {
      const result = await api.uploadImage(file);
      setFormData((prev) => ({ 
        ...prev, 
        imageUrl: result.url,
        fileName: result.fileName 
      }));
      toast.success('Resim başarıyla yüklendi');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Resim yüklenirken hata oluştu');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onCancel}>
          <ArrowLeft className="size-4 mr-2" />
          Geri
        </Button>
        <div>
          <h2 className="font-serif">{motif ? 'Motif Düzenle' : 'Yeni Motif Ekle'}</h2>
          <p className="text-gray-600 text-sm">Motif bilgilerini girin</p>
        </div>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Başlık *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Örn: İznik Çini Lalesi"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Kategori *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleChange('category', value)}
              >
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Resim URL *</Label>
            <Input
              id="imageUrl"
              value={formData.imageUrl}
              onChange={(e) => handleChange('imageUrl', e.target.value)}
              placeholder="https://..."
              required
            />
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>veya</span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageFile" className="cursor-pointer">
                <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors w-fit">
                  {isUploading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Upload className="size-4" />
                  )}
                  <span>{isUploading ? 'Yükleniyor...' : 'Dosya Yükle (JPEG/PNG)'}</span>
                </div>
              </Label>
              <Input
                id="imageFile"
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
              />
            </div>
            {formData.imageUrl && (
              <div className="mt-2">
                <img
                  src={formData.imageUrl}
                  alt="Önizleme"
                  className="h-32 rounded object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Açıklama *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Motif hakkında kısa açıklama..."
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="history">Tarihçe *</Label>
            <Textarea
              id="history"
              value={formData.history}
              onChange={(e) => handleChange('history', e.target.value)}
              placeholder="Motifin tarihi ve kültürel önemi..."
              rows={5}
              required
            />
          </div>

          <div className="flex items-center gap-3 pt-4">
            <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
              {isLoading ? (
                <Loader2 className="size-4 mr-2 animate-spin" />
              ) : (
                <Save className="size-4 mr-2" />
              )}
              {motif ? 'Güncelle' : 'Kaydet'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              İptal
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}