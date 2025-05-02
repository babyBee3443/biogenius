
import * as React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Block } from '@/components/admin/template-selector';

interface SectionBlockProps {
  block: Extract<Block, { type: 'section' }>;
  onChange: (id: string, settings: Record<string, any>) => void; // Pass the whole settings object
}

// Define available section types
const sectionTypes = [
  { value: 'featured-articles', label: 'Öne Çıkan Makaleler' },
  { value: 'category-teaser', label: 'Kategori Tanıtımı' },
  { value: 'recent-articles', label: 'Son Eklenen Makaleler' },
  { value: 'contact-form', label: 'İletişim Formu' },
  { value: 'custom-text', label: 'Özel Metin/HTML' },
  // Add more predefined section types here
];

const SectionBlock: React.FC<SectionBlockProps> = ({ block, onChange }) => {

    const handleSettingChange = (key: string, value: any) => {
        const newSettings = { ...block.settings, [key]: value };
        onChange(block.id, newSettings);
    };

    const handleTypeChange = (newType: string) => {
        // Reset settings when type changes, or define default settings per type
        let defaultSettings: Record<string, any> = {};
        if (newType === 'featured-articles' || newType === 'recent-articles') {
            defaultSettings = { title: sectionTypes.find(t => t.value === newType)?.label || '', count: 3 };
        } else if (newType === 'category-teaser') {
            defaultSettings = { title: 'Kategoriler' };
        } else if (newType === 'custom-text') {
             defaultSettings = { content: '<p>Özel metin içeriği buraya...</p>' };
        }
        // Keep existing common settings like 'title' if applicable? Decide on behavior.
        const updatedSettings = { /* ...block.settings */ ...defaultSettings, title: block.settings?.title || '' };

        onChange(block.id, { ...updatedSettings, sectionType: newType }); // Update type via settings change
         // Also need to update the block type itself in the parent state?
         // The current onChange signature doesn't allow changing the block.type directly.
         // This might require restructuring how blocks are updated or introducing a dedicated onTypeChange prop.
         // For now, we assume onChange handles updating the whole block based on ID.
         // Let's adjust onChange in BlockEditor to potentially handle type change? No, stick to settings for now.
          onChange(block.id, { sectionType: newType, ...defaultSettings });
    };


    // Common settings
    const hasTitle = ['featured-articles', 'category-teaser', 'recent-articles'].includes(block.sectionType);
    const hasCount = ['featured-articles', 'recent-articles'].includes(block.sectionType);
    const hasCustomContent = block.sectionType === 'custom-text';

    return (
        <div className="space-y-4 p-4 bg-muted/50 rounded-md border border-dashed">
            <div className="space-y-2">
                <Label htmlFor={`section-type-${block.id}`}>Bölüm Tipi</Label>
                <Select
                    value={block.sectionType}
                    onValueChange={handleTypeChange}
                >
                    <SelectTrigger id={`section-type-${block.id}`}>
                        <SelectValue placeholder="Bölüm tipi seçin..." />
                    </SelectTrigger>
                    <SelectContent>
                        {sectionTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Conditional Settings based on sectionType */}
            {hasTitle && (
                <div className="space-y-2">
                    <Label htmlFor={`section-title-${block.id}`}>Bölüm Başlığı</Label>
                    <Input
                        id={`section-title-${block.id}`}
                        value={block.settings.title || ''}
                        onChange={(e) => handleSettingChange('title', e.target.value)}
                        placeholder="Bölüm Başlığı (örn: Öne Çıkanlar)"
                    />
                </div>
            )}

            {hasCount && (
                 <div className="space-y-2">
                    <Label htmlFor={`section-count-${block.id}`}>Gösterilecek Öğe Sayısı</Label>
                    <Input
                        id={`section-count-${block.id}`}
                        type="number"
                        min="1"
                        max="12" // Example limit
                        value={block.settings.count || 3}
                        onChange={(e) => handleSettingChange('count', parseInt(e.target.value) || 1)}
                    />
                </div>
            )}

             {hasCustomContent && (
                 <div className="space-y-2">
                     <Label htmlFor={`section-content-${block.id}`}>Özel İçerik (HTML destekler)</Label>
                    {/* Basic textarea for now, could be replaced with a simple WYSIWYG */}
                     <textarea
                        id={`section-content-${block.id}`}
                        value={block.settings.content || ''}
                        onChange={(e) => handleSettingChange('content', e.target.value)}
                        rows={5}
                        className="w-full p-2 border rounded"
                        placeholder="<p>HTML içeriğinizi buraya yazın...</p>"
                    />
                 </div>
            )}


            {block.sectionType === 'contact-form' && (
                <p className="text-sm text-muted-foreground italic">İletişim formu ayarları burada yapılandırılacak (örn: alıcı e-posta).</p>
            )}

             {/* Add settings for other section types as needed */}

             <p className="text-xs text-muted-foreground pt-2">Not: Bu bölümün görsel düzenlemesi önizleme alanında yapılır.</p>

        </div>
    );
};

export default SectionBlock;
