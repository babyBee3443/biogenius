
import * as React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Block } from "@/components/admin/template-selector";

interface HeadingBlockProps {
  block: Extract<Block, { type: 'heading' }>;
  onChange: (id: string, content: string, field?: string, level?: number) => void;
}

const HeadingBlock: React.FC<HeadingBlockProps> = ({ block, onChange }) => {
    const headingLevels = [2, 3, 4, 5, 6]; // H1 is usually reserved for the main title

    // Dynamic class based on level for approximate visual representation
    const getSizeClass = (level: number) => {
        switch (level) {
            case 2: return 'text-2xl';
            case 3: return 'text-xl';
            case 4: return 'text-lg';
            case 5: return 'text-base font-semibold'; // Adjusted base size
            case 6: return 'text-sm font-semibold';
            default: return 'text-xl';
        }
    };

    return (
        <div className="flex items-center gap-2">
            <Select
                value={String(block.level)}
                onValueChange={(value) => onChange(block.id, block.content, 'level', parseInt(value))}
            >
                <SelectTrigger className="w-[70px]">
                    <SelectValue placeholder={`H${block.level}`} />
                </SelectTrigger>
                <SelectContent>
                    {headingLevels.map(level => (
                        <SelectItem key={level} value={String(level)}>H{level}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Input
                value={block.content}
                onChange={(e) => onChange(block.id, e.target.value, 'content')}
                placeholder={`Başlık ${block.level} Metni...`}
                className={`${getSizeClass(block.level)} font-semibold border-0 shadow-none focus-visible:ring-0 px-1 flex-1`}
            />
        </div>
    );
};

export default HeadingBlock;
