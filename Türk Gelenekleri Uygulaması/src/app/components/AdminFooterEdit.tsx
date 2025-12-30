import { useState } from 'react';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Save, FileText } from 'lucide-react';

interface AdminFooterEditProps {
  footerText: string;
  onSave: (text: string) => void;
}

export function AdminFooterEdit({ footerText, onSave }: AdminFooterEditProps) {
  const [text, setText] = useState(footerText);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(text);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="size-6 text-amber-600" />
        <div>
          <h3 className="font-serif">Footer Metin Düzenleme</h3>
          <p className="text-sm text-gray-600">Site altında görünecek "Hakkımızda" metnini düzenleyin</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="footerText">Hakkımızda Metni</Label>
          <Textarea
            id="footerText"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Site hakkında bilgilendirme metni..."
            rows={8}
            className="resize-none"
          />
          <p className="text-xs text-gray-500">
            Bu metin ana sayfanın en altında görüntülenecektir.
          </p>
        </div>

        <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
          <Save className="size-4 mr-2" />
          Kaydet
        </Button>
      </form>
    </Card>
  );
}
