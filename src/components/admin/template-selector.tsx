
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
} from "@/components/ui/alert-dialog" // AlertDialogTrigger removed as it's handled in loop
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Eye } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import type { ArticleData, NoteData, Template as TemplateDefinition } from '@/lib/mock-data'; // Import Template as TemplateDefinition
import { allMockTemplates } from "@/lib/mock-data"; // Import allMockTemplates

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
  /** @deprecated Use onSelectTemplateBlocks instead */
  onSelectTemplate?: (content: string) => void; // Keep for potential backward compatibility if needed
  onSelectTemplateBlocks: (blocks: Block[]) => void;
  blocksCurrentlyExist: boolean; // Indicates if there are blocks in the editor
  templateTypeFilter?: 'article' | 'note' | 'page'; // Optional filter
}


// --- Helper Functions ---
const PREVIEW_STORAGE_KEY = 'preview_data';

// Function to convert block structure to HTML (basic implementation for backward compatibility)
// NOTE: This function is deprecated and might not fully represent complex block types.
const blocksToHtml = (blocks: Block[]): string => {
    let html = '';
    blocks.forEach(block => {
        switch (block.type) {
            case 'heading':
                html += `<h${block.level}>${block.content}</h${block.level}>\n`;
                break;
            case 'text':
                const processedContent = block.content
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
                    .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
                    .replace(/\n/g, '<br />'); // Basic newline handling
                html += `<p>${processedContent}</p>\n`;
                break;
            case 'image':
                 html += `<figure>\n  <img src="${block.url}" alt="${block.alt}" />\n`;
                if (block.caption) {
                    html += `  <figcaption>${block.caption}</figcaption>\n`;
                 }
                 html += `</figure>\n`;
                break;
             case 'quote':
                html += `<blockquote><p>${block.content}</p>`;
                if (block.citation) {
                    html += `<footer>— ${block.citation}</footer>`;
                }
                html += `</blockquote>\n`;
                break;
             case 'code':
                 html += `<pre><code class="language-${block.language}">${block.content}</code></pre>\n`;
                 break;
             case 'divider':
                 html += `<hr />\n`;
                 break;
             case 'gallery':
                 html += `<div class="gallery">\n`;
                 block.images.forEach(img => {
                     html += `  <figure><img src="${img.url}" alt="${img.alt}" /></figure>\n`;
                 });
                 html += `</div>\n`;
                 break;
             case 'video':
                 // Basic YouTube embed from youtubeId or URL
                 const videoId = block.youtubeId || block.url?.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/)?.pop();
                 if (videoId && videoId.length === 11) {
                     html += `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>\n`;
                 } else if (block.url) {
                     html += `<p><a href="${block.url}" target="_blank" rel="noopener noreferrer">Video izle: ${block.url}</a></p>\n`;
                 }
                 break;
             case 'section':
                 // Section rendering depends heavily on implementation, basic comment here
                 html += `<!-- Section: ${block.sectionType} Settings: ${JSON.stringify(block.settings)} -->\n`;
                 // For custom text, render the content
                 if(block.sectionType === 'custom-text' && block.settings?.content) {
                    html += `<div>${block.settings.content}</div>\n`
                 }
                 break;
            default:
                // Fallback for unknown block types
                //  html += `<!-- Unsupported block type: ${block.type} -->\n`; // Removed logging of unknown types
                break;
        }
    });
    return html;
};

const generateId = () => `block-${Date.now()}-${Math.random().toString(36).substring(7)}`;

export function TemplateSelector({
  isOpen,
  onClose,
  onSelectTemplate,
  onSelectTemplateBlocks,
  blocksCurrentlyExist,
  templateTypeFilter // Added filter prop
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

        if (onSelectTemplate) {
             console.warn("TemplateSelector: onSelectTemplate is deprecated. Use onSelectTemplateBlocks instead.");
             const htmlContent = blocksToHtml(newBlocks);
             onSelectTemplate(htmlContent);
        }
        onClose();
        setIsConfirmOpen(false);
        setSelectedTemplate(null);
    };

     // Handler for template preview - pass the specific template's data
    const handlePreview = (template: TemplateDefinition) => {
        if (typeof window === 'undefined') return;

        // Adjust preview data based on template type
        let previewData: Partial<ArticleData | NoteData | any> & { previewType: string } = { // Use 'any' for pageData part for now
            id: `preview-${template.id}`,
            title: template.seoTitle || template.name,
            blocks: template.blocks,
            previewType: template.type, // Set previewType from template
            // Common fields
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            slug: `template-${template.id}-preview`,
        };

        if (template.type === 'article') {
            previewData = {
                ...previewData,
                excerpt: template.excerpt || template.description,
                category: template.category || 'Teknoloji',
                status: 'Yayınlandı',
                mainImageUrl: template.blocks.find((b): b is Extract<Block, { type: 'image' }> => b.type === 'image')?.url || template.previewImageUrl,
                seoTitle: template.seoTitle,
                seoDescription: template.seoDescription,
                keywords: template.keywords,
                authorId: 'template-author',
                isFeatured: false,
                isHero: false,
            };
        } else if (template.type === 'note') {
             previewData = {
                 ...previewData,
                 category: template.category || 'Genel',
                 level: 'Lise 9',
                 tags: template.keywords || [],
                 summary: template.excerpt || template.description,
                 imageUrl: template.blocks.find((b): b is Extract<Block, { type: 'image' }> => b.type === 'image')?.url || template.previewImageUrl,
             };
        } else if (template.type === 'page') {
            previewData = {
                ...previewData,
                // Add page-specific fields if any for previewData, or keep generic
                seoTitle: template.seoTitle || template.name,
                seoDescription: template.seoDescription || template.description,
                imageUrl: template.previewImageUrl, // Use preview image as a general image for page
            };
        }

        console.log(`[TemplateSelector/handlePreview] Preparing to save preview data with key: ${PREVIEW_STORAGE_KEY}`);
        console.log(`[TemplateSelector/handlePreview] Preview Data:`, previewData);

        try {
            localStorage.setItem(PREVIEW_STORAGE_KEY, JSON.stringify(previewData));
            console.log(`[TemplateSelector/handlePreview] Successfully saved data for key: ${PREVIEW_STORAGE_KEY}`);

            // Verification
            const stored = localStorage.getItem(PREVIEW_STORAGE_KEY);
            if (!stored || stored.length < 10) {
                 throw new Error("Verification failed: Data not found or empty in localStorage immediately after set.");
            }
            const parsed = JSON.parse(stored);
            if (parsed.previewType !== template.type) throw new Error(`Verification failed: Stored data type (${parsed.previewType}) does not match template type (${template.type}).`);

            console.log("[TemplateSelector/handlePreview] Verification SUCCESS.");

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

    // Filter templates based on the provided type
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
                <DialogContent className="sm:max-w-[60%] lg:max-w-[70%] max-h-[80vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>{dialogTitle}</DialogTitle>
                        <DialogDescription>
                            İçeriğinizi oluşturmaya başlamak için hazır bir şablon seçin.
                            {blocksCurrentlyExist && <span className="text-destructive font-medium"> Şablon içeriği mevcut içeriğinizin üzerine yazılabilir (onayınızla).</span>}
                        </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="flex-grow w-full rounded-md border my-4">
                        <div className="grid gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
                            {filteredTemplates.map((template) => (
                                <Card key={template.id} className="flex flex-col">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-base">{template.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex flex-col flex-grow space-y-3">
                                        <div className="relative aspect-[3/2] w-full rounded overflow-hidden">
                                            <Image
                                                src={template.previewImageUrl}
                                                alt={template.description}
                                                layout="fill"
                                                objectFit="cover"
                                                className="rounded"
                                                data-ai-hint={template.category?.toLowerCase() || 'abstract'}
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground flex-grow">{template.description}</p>
                                        <div className="flex justify-between items-center pt-2">
                                             <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); handlePreview(template); }}>
                                                  <Eye className="mr-2 h-4 w-4" />
                                                 Önizle
                                             </Button>
                                             {/* Wrap the "Seç" button and its AlertDialog inside a single parent for proper event handling */}
                                            <div>
                                                <AlertDialog open={isConfirmOpen && selectedTemplate?.id === template.id} onOpenChange={(open) => { if (!open) setSelectedTemplate(null); setIsConfirmOpen(open); }}>
                                                    {/* The Button that triggers the AlertDialog is now outside, handled by handleSelectClick */}
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
                                                 <Button size="sm" onClick={() => handleSelectClick(template)}>Seç</Button>
                                            </div>
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
                    <DialogFooter>
                        <Button type="button" variant="secondary" onClick={onClose}>
                            Kapat
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
