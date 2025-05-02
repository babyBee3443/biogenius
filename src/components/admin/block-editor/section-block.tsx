
import * as React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea"; // Import Textarea for custom content
import type { Block } from '@/components/admin/template-selector';
import { Button } from '@/components/ui/button'; // Import Button
import { Info } from 'lucide-react'; // Import Info icon

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
            defaultSettings = { title: 'Kategoriler', techButtonLabel: 'Teknoloji', bioButtonLabel: 'Biyoloji' }; // Add button labels
        } else if (newType === 'custom-text') {
             defaultSettings = { content: '<p>Özel metin içeriği buraya...</p>' };
        } else if (newType === 'contact-form') {
            defaultSettings = { title: 'İletişim Formu', recipientEmail: '' };
        }
        // Keep existing common settings like 'title' if applicable?
        const updatedSettings = { ...defaultSettings, title: block.settings?.title || defaultSettings.title || '' };

         onChange(block.id, { sectionType: newType, ...updatedSettings });
    };


    // Common settings and specific settings based on type
    const sectionType = block.sectionType;
    const settings = block.settings || {};

    const hasTitle = ['featured-articles', 'category-teaser', 'recent-articles', 'contact-form'].includes(sectionType);
    const hasCount = ['featured-articles', 'recent-articles'].includes(sectionType);
    const hasCustomContent = sectionType === 'custom-text';
    const isCategoryTeaser = sectionType === 'category-teaser';
    const isContactForm = sectionType === 'contact-form';

    return (
        <div className="space-y-4 p-4 bg-muted/50 rounded-md border border-dashed">
            <div className="space-y-2">
                <Label htmlFor={`section-type-${block.id}`}>Bölüm Tipi</Label>
                <Select
                    value={sectionType}
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

            {/* --- Conditional Settings --- */}

            {hasTitle && (
                <div className="space-y-2">
                    <Label htmlFor={`section-title-${block.id}`}>Bölüm Başlığı</Label>
                    <Input
                        id={`section-title-${block.id}`}
                        value={settings.title || ''}
                        onChange={(e) => handleSettingChange('title', e.target.value)}
                        placeholder="Bölüm Başlığı"
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
                        value={settings.count || 3}
                        onChange={(e) => handleSettingChange('count', parseInt(e.target.value) || 1)}
                    />
                </div>
            )}

             {hasCustomContent && (
                 <div className="space-y-2">
                     <Label htmlFor={`section-content-${block.id}`}>Özel İçerik (HTML destekler)</Label>
                     <Textarea // Changed to Textarea
                        id={`section-content-${block.id}`}
                        value={settings.content || ''}
                        onChange={(e) => handleSettingChange('content', e.target.value)}
                        rows={5}
                        className="w-full p-2 border rounded bg-background font-mono text-xs" // Use background, monospace font
                        placeholder="<p>HTML içeriğinizi buraya yazın...</p>"
                    />
                 </div>
            )}

            {isCategoryTeaser && (
                <>
                    <div className="space-y-2">
                        <Label htmlFor={`section-tech-label-${block.id}`}>Teknoloji Buton Etiketi</Label>
                        <Input
                            id={`section-tech-label-${block.id}`}
                            value={settings.techButtonLabel || 'Teknoloji'}
                            onChange={(e) => handleSettingChange('techButtonLabel', e.target.value)}
                        />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor={`section-bio-label-${block.id}`}>Biyoloji Buton Etiketi</Label>
                        <Input
                            id={`section-bio-label-${block.id}`}
                            value={settings.bioButtonLabel || 'Biyoloji'}
                            onChange={(e) => handleSettingChange('bioButtonLabel', e.target.value)}
                        />
                    </div>
                </>
            )}

            {isContactForm && (
                <div className="space-y-2">
                    <Label htmlFor={`section-recipient-${block.id}`}>Alıcı E-posta Adresi</Label>
                    <Input
                        id={`section-recipient-${block.id}`}
                        type="email"
                        value={settings.recipientEmail || ''}
                        onChange={(e) => handleSettingChange('recipientEmail', e.target.value)}
                        placeholder="formlarin.gonderilecegi@adres.com"
                    />
                     <p className="text-xs text-muted-foreground">Form gönderildiğinde mesajlar bu adrese iletilecektir.</p>
                </div>
            )}

             {/* --- End Conditional Settings --- */}

            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                 <Info className="h-3.5 w-3.5"/>
                 <span>Bu bölümün görsel düzenlemesi önizleme alanında yapılır.</span>
            </div>

        </div>
    );
};

export default SectionBlock;
