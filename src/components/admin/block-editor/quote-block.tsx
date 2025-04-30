
import * as React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Block } from '@/components/admin/template-selector';

interface QuoteBlockProps {
  block: Extract<Block, { type: 'quote' }>;
  onChange: (id: string, value: string, field: 'content' | 'citation') => void;
}

const QuoteBlock: React.FC<QuoteBlockProps> = ({ block, onChange }) => {
  return (
    <div className="space-y-3 border-l-4 border-primary pl-4">
      <div className="space-y-1">
        <Label htmlFor={`quote-content-${block.id}`} className="text-xs">Alıntı Metni</Label>
        <Textarea
          id={`quote-content-${block.id}`}
          value={block.content}
          onChange={(e) => onChange(block.id, e.target.value, 'content')}
          placeholder="Alıntı yapılacak metni buraya girin..."
          rows={3}
          className="text-base italic border-0 shadow-none focus-visible:ring-0 px-1"
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor={`quote-citation-${block.id}`} className="text-xs">Kaynak (İsteğe bağlı)</Label>
        <Input
          id={`quote-citation-${block.id}`}
          value={block.citation || ''}
          onChange={(e) => onChange(block.id, e.target.value, 'citation')}
          placeholder="Alıntının kaynağı (örneğin, Yazar Adı)"
          className="text-sm border-0 shadow-none focus-visible:ring-0 px-1"
        />
      </div>
    </div>
  );
};

export default QuoteBlock;
