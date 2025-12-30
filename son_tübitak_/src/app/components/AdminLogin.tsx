import { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Lock, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface AdminLoginProps {
  onLogin: (password: string) => boolean;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(password);
    if (!success) {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="size-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="size-8 text-amber-700" />
          </div>
          <h2 className="font-serif text-center mb-2">Admin Panel Girişi</h2>
          <p className="text-gray-600 text-center text-sm">
            MotifLAB yönetim paneline erişim
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="size-4" />
            <AlertDescription>
              Hatalı şifre. Lütfen tekrar deneyin.
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Şifre</Label>
            <Input
              id="password"
              type="password"
              placeholder="Admin şifrenizi girin"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              autoFocus
            />
          </div>

          <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700">
            Giriş Yap
          </Button>
        </form>
      </Card>
    </div>
  );
}