
import * as React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import type { Block } from '@/components/admin/template-selector';

interface ImageBlockProps {
  block: Extract<Block, { type: 'image' }>;
  onChange: (id: string, value: string, field: 'url' | 'alt' | 'caption') => void;
}

const ImageBlock: React.FC<ImageBlockProps> = ({ block, onChange }) => {
  // TODO: Implement actual image upload logic
  const handleUploadClick = () => {
    console.log("Upload image clicked for block:", block.id);
    // Trigger file input or open media library modal
  };

  return (
    <div className="space-y-3">
      {block.url && (
        <div className="mb-3 rounded border p-2 w-fit mx-auto">
          <Image src={block.url} alt={block.alt || 'Görsel Önizleme'} width={300} height={150} className="object-contain rounded" />
        </div>
      )}
      <div className="space-y-1">
        <Label htmlFor={`img-url-${block.id}`} className="text-xs">Görsel URL</Label>
        <div className="flex gap-2">
          <Input
            id={`img-url-${block.id}`}
            value={block.url}
            onChange={(e) => onChange(block.id, e.target.value, 'url')}
            placeholder="https://..."
          />
          <Button variant="outline" size="sm" onClick={handleUploadClick}>
            <Upload className="mr-1 h-3.5 w-3.5" /> Yükle
          </Button>
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
