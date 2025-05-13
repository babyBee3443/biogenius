
import * as React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import type { Block } from '@/components/admin/template-selector';
import { toast } from '@/hooks/use-toast';

interface ImageBlockProps {
  block: Extract<Block, { type: 'image' }>;
  onChange: (id: string, value: string, field: 'url' | 'alt' | 'caption') => void;
}

const ImageBlock: React.FC<ImageBlockProps> = ({ block, onChange }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // Max 2MB
        toast({ variant: "destructive", title: "Dosya Çok Büyük", description: "Lütfen 2MB'den küçük bir resim dosyası seçin." });
        return;
      }
      if (!['image/png', 'image/jpeg', 'image/gif', 'image/webp'].includes(file.type)) {
        toast({ variant: "destructive", title: "Geçersiz Dosya Türü", description: "Lütfen PNG, JPG, GIF veya WEBP formatında bir resim seçin." });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(block.id, reader.result as string, 'url'); // Set the base64 data URL
        toast({ title: "Görsel Yüklendi (Önizleme)", description: "Değişiklikleri kaydetmeyi unutmayın." });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-3">
      {block.url && (
        <div className="mb-3 rounded border p-2 w-fit mx-auto bg-muted/30">
          <Image 
            src={block.url} 
            alt={block.alt || 'Görsel Önizleme'} 
            width={300} 
            height={150} 
            className="object-contain rounded max-h-[200px]" // Added max-h for better layout
            data-ai-hint="block image content"
            />
        </div>
      )}
      <div className="space-y-1">
        <Label htmlFor={`img-url-${block.id}`} className="text-xs">Görsel URL veya Dosya Seçimi</Label>
        <div className="flex gap-2">
          <Input
            id={`img-url-${block.id}`}
            value={block.url?.startsWith('data:') ? '(Yerel Dosya Yüklendi)' : block.url}
            onChange={(e) => onChange(block.id, e.target.value, 'url')}
            placeholder="https://... veya dosya yükleyin"
            disabled={block.url?.startsWith('data:')} // Disable if local file is loaded
          />
          <Button variant="outline" size="sm" onClick={handleUploadClick}>
            <Upload className="mr-1 h-3.5 w-3.5" /> Yükle
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/gif, image/webp"
          />
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor={`img-alt-${block.id}`} className="text-xs">Alternatif Metin (Alt)</Label>
        <Input
          id={`img-alt-${block.id}`}
          value={block.alt}
          onChange={(e) => onChange(block.id, e.target.value, 'alt')}
          placeholder="Görsel açıklaması (SEO için önemli)"
        />
      </div>
       <div className="space-y-1">
        <Label htmlFor={`img-caption-${block.id}`} className="text-xs">Görsel Alt Yazısı (İsteğe bağlı)</Label>
        <Input
          id={`img-caption-${block.id}`}
          value={block.caption || ''}
          onChange={(e) => onChange(block.id, e.target.value, 'caption')}
          placeholder="Görsel altında görünecek yazı"
        />
      </div>
    </div>
  );
};

export default ImageBlock;
