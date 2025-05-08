
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
} from "@/components/ui/alert-dialog" // AlertDialogTrigger is not needed here if AlertDialog is conditionally rendered
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

// Fixed key for storing preview data in localStorage
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
            setIsConfirmOpen(true); // Open confirmation dialog
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
        onClose(); // Close the main template selector dialog
        setIsConfirmOpen(false); // Close confirmation dialog if it was open
        setSelectedTemplate(null); // Reset selected template
    };

    const handlePreview = (template: TemplateDefinition) => {
        if (typeof window === 'undefined') return;

        let previewData: (Partial<ArticleData> | Partial<NoteData> | Partial<PageDataType>) & { previewType: string };
        
        const basePreviewData = {
            id: `preview_template_${template.id}_${Date.now()}`,
            title: template.name,
            blocks: template.blocks.map(b => ({...b, id: generateId()})), // Ensure blocks have unique IDs for preview
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
                    category: template.category || 'Teknoloji',
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
                    level: 'Lise 9', // Example default
                    tags: template.keywords || [],
                    summary: template.excerpt || template.description,
                    contentBlocks: template.blocks.map(b => ({...b, id: generateId()})), // Ensure unique IDs
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
                console.error("Unknown template type for preview:", (template as any).type);
                toast({ variant: "destructive", title: "Önizleme Hatası", description: "Bilinmeyen şablon tipi." });
                return;
        }

        const previewKey = PREVIEW_STORAGE_KEY;

        console.log(`[TemplateSelector/handlePreview] Preparing to save preview data with key: ${previewKey}`);
        console.log(`[TemplateSelector/handlePreview] Preview Data:`, previewData);

        try {
            localStorage.setItem(previewKey, JSON.stringify(previewData));
            console.log(`[TemplateSelector/handlePreview] Successfully saved data for key: ${previewKey}`);
            
            const stored = localStorage.getItem(previewKey);
            if (!stored) throw new Error("Verification failed: No data found in localStorage.");
            JSON.parse(stored); // Try to parse to ensure it's valid JSON
            console.log("[TemplateSelector/handlePreview] Verification SUCCESS (data stored and is valid JSON).");

            const previewUrl = `/admin/preview`;
            console.log(`[TemplateSelector/handlePreview] Opening preview window with URL: ${previewUrl}`);

            setTimeout(() => {
                const newWindow = window.open(previewUrl, '_blank');
                if (!newWindow) {
                    console.error("[TemplateSelector/handlePreview] Failed to open preview window. Pop-up blocker might be active.");
                    toast({ variant: "destructive", title: "Önizleme Penceresi Açılamadı", description: "Lütfen tarayıcınızın pop-up engelleyicisini kontrol edin.", duration: 10000 });
                } else {
                    console.log("[TemplateSelector/handlePreview] Preview window opened successfully.");
                }
            }, 150);

        } catch (error: any) {
            console.error("[TemplateSelector/handlePreview] Error during preview process:", error);
            toast({ variant: "destructive", title: "Önizleme Hatası", description: `Önizleme verisi kaydedilemedi veya doğrulanamadı: ${error.message}`, duration: 10000 });
        }
    };

    const filteredTemplates = templateTypeFilter
        ? allMockTemplates.filter(t => t.type === templateTypeFilter)
        : allMockTemplates;

    let dialogTitle = "Şablon Seç";
    if (templateTypeFilter === 'article') dialogTitle = "Makale Şablonu Seç";
    else if (templateTypeFilter === 'note') dialogTitle = "Not Şablonu Seç";
    else if (templateTypeFilter === 'page') dialogTitle = "Sayfa Şablonu Seç";


    return (
        <>
            <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
                <DialogContent className="sm:max-w-[60%] lg:max-w-[70%] max-h-[80vh] flex flex-col p-0"> {/* Remove p-6, handle padding in sub-components */}
                    <DialogHeader className="p-6 pb-0"> {/* Add padding to header */}
                        <DialogTitle>{dialogTitle}</DialogTitle>
                        <DialogDescription>
                            İçeriğinizi oluşturmaya başlamak için hazır bir şablon seçin.
                            {blocksCurrentlyExist && <span className="text-destructive font-medium"> Şablon içeriği mevcut içeriğinizin üzerine yazılabilir (onayınızla).</span>}
                        </DialogDescription>
                    </DialogHeader>
                    {/* ScrollArea now directly child of DialogContent, allow it to manage its own scroll */}
                    <ScrollArea className="flex-grow border-t border-b"> {/* Added border-t and border-b for visual separation */}
                        <div className="grid gap-4 p-6 md:grid-cols-2 lg:grid-cols-3"> {/* Add padding to the content inside ScrollArea */}
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
                                            {/* AlertDialogTrigger should be a direct child of AlertDialog */}
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
                    <DialogFooter className="p-6 pt-0"> {/* Add padding to footer */}
                        <Button type="button" variant="secondary" onClick={onClose}>
                            Kapat
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            
            {/* Confirmation Dialog */}
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
