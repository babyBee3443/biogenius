
import * as React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Bold, Italic, Underline, Link as LinkIcon, List, ListOrdered } from "lucide-react";
import type { Block } from "@/components/admin/template-selector";

interface TextBlockProps {
  block: Extract<Block, { type: 'text' }>;
  onChange: (id: string, content: string) => void;
}

const TextBlock: React.FC<TextBlockProps> = ({ block, onChange }) => {
    // TODO: Implement actual formatting logic
  return (
    <div>
      <div className="flex items-center gap-1 mb-2 border-b pb-2">
        <Button variant="ghost" size="icon" className="h-7 w-7"><Bold className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" className="h-7 w-7"><Italic className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" className="h-7 w-7"><Underline className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" className="h-7 w-7"><LinkIcon className="h-4 w-4" /></Button>
        <Separator orientation="vertical" className="h-6 mx-1" />
        <Button variant="ghost" size="icon" className="h-7 w-7"><List className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" className="h-7 w-7"><ListOrdered className="h-4 w-4" /></Button>
      </div>
      <Textarea
        value={block.content}
        onChange={(e) => onChange(block.id, e.target.value)}
        placeholder="Metninizi girin..."
        rows={6}
        className="text-base border-0 shadow-none focus-visible:ring-0 px-1" // Simplified styling
      />
    </div>
  );
};

export default TextBlock;
