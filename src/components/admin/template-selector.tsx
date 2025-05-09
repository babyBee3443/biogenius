
"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Eye } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import type { ArticleData, NoteData, Template as TemplateDefinition, PageData as PageDataType } from '@/lib/mock-data';
import { allMockTemplates } from "@/lib/mock-data";

// --- Block Types (Should match the editor's block types) ---
export type Block =
  | { id: string; type: 'text'; content: string }
  | { id: string; type: 'heading'; level: number; content: string }
  | { id: string; type: 'image'; url: string; alt: string; caption?: string }
  | { id: string; type: 'gallery'; images: { url: string; alt: string }[] }
  | { id: string; type: 'video'; url: string; youtubeId?: string | null }
  | { id: string; type: 'quote'; content: string; citation?: string }
  | { id: string; type: 'code'; language: string; content: string }
  | { id: string; type: 'divider' }
  | { id: string; type: 'section'; sectionType: string; settings: Record<string, any> };


interface TemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplateBlocks: (blocks: Block[]) => void;
  blocksCurrentlyExist: boolean;
  templateTypeFilter?: 'article' | 'note' | 'page';
}


const generateId = () => `block-${Date.now()}-${Math.random().toString(36).substring(7)}`;

const PREVIEW_STORAGE_KEY = 'preview_data';


export function TemplateSelector({
  isOpen,
  onClose,
  onSelectTemplateBlocks,
  blocksCurrentlyExist,
  templateTypeFilter
}: TemplateSelectorProps) {
    const [selectedTemplate, setSelectedTemplate] = React.useState<TemplateDefinition | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);

    const handleSelectClick = (template: TemplateDefinition) => {
        setSelectedTemplate(template);
        if (blocksCurrentlyExist) {
            setIsConfirmOpen(true);
        } else {
            applyTemplate(template);
        }
    };

    const applyTemplate = (templateToApply: TemplateDefinition | null) => {
        if (!templateToApply) return;

        const newBlocks = templateToApply.blocks.map(block => ({
            ...block,
            id: generateId()
        }));
        onSelectTemplateBlocks(newBlocks);
        onClose();
        setIsConfirmOpen(false);
        setSelectedTemplate(null);
    };

    const handlePreview = (template: TemplateDefinition) => {
        if (typeof window === 'undefined') return;

        let previewData: (Partial<ArticleData> | Partial<NoteData> | Partial<PageDataType>) & { previewType: string };
        
        const basePreviewData = {
            id: `preview_template_${template.id}_${Date.now()}`,
            title: template.name,
            blocks: template.blocks.map(b => ({...b, id: generateId()})),
            seoTitle: template.seoTitle || template.name,
            seoDescription: template.seoDescription || template.description,
            keywords: template.keywords || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        switch (template.type) {
            case 'article':
                previewData = {
                    ...basePreviewData,
                    previewType: 'article',
                    excerpt: template.excerpt || template.description,
                    category: template.category || 'Biyoloji', // Default to Biyoloji if Teknoloji removed
                    status: 'Yayınlandı',
                    mainImageUrl: template.blocks.find((b): b is Extract<Block, { type: 'image' }> => b.type === 'image')?.url || template.previewImageUrl,
                    authorId: 'template-author',
                    isFeatured: false,
                    isHero: false,
                    slug: `template-${template.id}-preview`,
                };
                break;
            case 'note':
                previewData = {
                    ...basePreviewData,
                    previewType: 'note',
                    slug: `template-${template.id}-preview`,
                    category: template.category || 'Genel',
                    level: 'Lise 9',
                    tags: template.keywords || [],
                    summary: template.excerpt || template.description,
                    contentBlocks: template.blocks.map(b => ({...b, id: generateId()})),
                    imageUrl: template.blocks.find((b): b is Extract<Block, { type: 'image' }> => b.type === 'image')?.url || template.previewImageUrl,
                    authorId: 'template-author',
                };
                break;
            case 'page':
                 previewData = {
                    ...basePreviewData,
                    previewType: 'page',
                    slug: `template-${template.id}-preview`,
                    imageUrl: template.previewImageUrl,
                    settings: {},
                };
                break;
            default:
                toast({ variant: "destructive", title: "Önizleme Hatası", description: "Bilinmeyen şablon tipi." });
                return;
        }

        try {
            localStorage.setItem(PREVIEW_STORAGE_KEY, JSON.stringify(previewData));
            const previewUrl = `/admin/preview`;
            
            setTimeout(() => {
                const newWindow = window.open(previewUrl, '_blank');
                if (!newWindow) {
                    toast({ variant: "destructive", title: "Önizleme Penceresi Açılamadı", description: "Lütfen tarayıcınızın pop-up engelleyicisini kontrol edin.", duration: 10000 });
                }
            }, 250);

        } catch (error: any) {
            toast({ variant: "destructive", title: "Önizleme Hatası", description: `Önizleme verisi kaydedilemedi: ${error.message}`, duration: 10000 });
        }
    };

    const filteredTemplates = allMockTemplates.filter(t => {
        if (t.category === 'Teknoloji') return false; // Exclude Teknoloji templates
        if (templateTypeFilter) {
            return t.type === templateTypeFilter;
        }
        return true;
    });


    let dialogTitle = "Şablon Seç";
    if (templateTypeFilter === 'article') dialogTitle = "Makale Şablonu Seç";
    else if (templateTypeFilter === 'note') dialogTitle = "Not Şablonu Seç";
    else if (templateTypeFilter === 'page') dialogTitle = "Sayfa Şablonu Seç";


    return (
        <>
            <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
                <DialogContent className="sm:max-w-[60%] lg:max-w-[70%] max-h-[80vh] flex flex-col p-0">
                    <DialogHeader className="p-6 pb-0">
                        <DialogTitle>{dialogTitle}</DialogTitle>
                        <DialogDescription>
                            İçeriğinizi oluşturmaya başlamak için hazır bir şablon seçin.
                            {blocksCurrentlyExist && <span className="text-destructive font-medium"> Şablon içeriği mevcut içeriğinizin üzerine yazılabilir (onayınızla).</span>}
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="flex-grow border-t border-b">
                        <div className="grid gap-4 p-6 md:grid-cols-2 lg:grid-cols-3">
                            {filteredTemplates.map((template) => (
                                <Card key={template.id} className="flex flex-col">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-base">{template.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex flex-col flex-grow space-y-3">
                                        <div className="relative aspect-[3/2] w-full rounded overflow-hidden">
                                            <Image
                                                src={template.previewImageUrl}
                                                alt={template.name}
                                                layout="fill"
                                                objectFit="cover"
                                                className="rounded"
                                                data-ai-hint={template.category?.toLowerCase() || 'abstract content'}
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground flex-grow">{template.description}</p>
                                        <div className="flex justify-between items-center pt-2">
                                            <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); handlePreview(template); }}>
                                                <Eye className="mr-2 h-4 w-4" />
                                                Önizle
                                            </Button>
                                             <Button size="sm" onClick={() => handleSelectClick(template)}>Seç</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                            {filteredTemplates.length === 0 && (
                                <p className="text-muted-foreground text-center md:col-span-2 lg:col-span-3 py-4">
                                    Bu tür için uygun şablon bulunamadı.
                                </p>
                            )}
                        </div>
                    </ScrollArea>
                    <DialogFooter className="p-6 pt-0">
                        <Button type="button" variant="secondary" onClick={onClose}>
                            Kapat
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            
            {selectedTemplate && (
                <AlertDialog open={isConfirmOpen} onOpenChange={(open) => { if (!open) { setIsConfirmOpen(false); setSelectedTemplate(null); }}}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Mevcut İçeriğin Üzerine Yazılsın mı?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Düzenleyicide zaten içerik bulunuyor. "{selectedTemplate?.name}" şablonunu uygulamak mevcut içeriği silecektir.
                                Bu işlem geri alınamaz. Devam etmek istediğinizden emin misiniz?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => { setIsConfirmOpen(false); setSelectedTemplate(null); }}>İptal</AlertDialogCancel>
                            <AlertDialogAction onClick={() => applyTemplate(selectedTemplate)}>
                                Evet, Üzerine Yaz
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </>
    );
}
