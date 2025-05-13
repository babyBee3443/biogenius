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
import { Eye, Loader2 } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import type { ArticleData, NoteData, Template as TemplateDefinition, PageData as PageDataType } from '@/lib/mock-data';
import { allMockTemplatesGetter } from "@/lib/mock-data";

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
  | { id: string; type: 'section'; sectionType: string; settings: Record&lt;string, any&gt; };


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
    const [selectedTemplate, setSelectedTemplate] = React.useState&lt;TemplateDefinition | null&gt;(null);
    const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
    const [templates, setTemplates] = React.useState&lt;TemplateDefinition[]&gt;([]);
    const [loadingTemplates, setLoadingTemplates] = React.useState(true);


    React.useEffect(() =&gt; {
        const fetchTemplates = async () =&gt; {
            if (isOpen) {
                setLoadingTemplates(true);
                try {
                    const data = await allMockTemplatesGetter();
                    console.log("[TemplateSelector] Fetched templates data:", data);
                    if (Array.isArray(data)) {
                        setTemplates(data);
                    } else {
                        console.error("[TemplateSelector] Fetched templates are not an array:", data);
                        setTemplates([]); 
                        toast({ variant: "destructive", title: "Hata", description: "Şablon verileri geçersiz." });
                    }
                } catch (err) {
                    console.error("[TemplateSelector] Error fetching templates:", err);
                    toast({ variant: "destructive", title: "Hata", description: "Şablonlar yüklenemedi." });
                    setTemplates([]);
                } finally {
                    setLoadingTemplates(false);
                }
            }
        };
        fetchTemplates();
    }, [isOpen]);


    const handleSelectClick = (template: TemplateDefinition) =&gt; {
        setSelectedTemplate(template);
        if (blocksCurrentlyExist) {
            setIsConfirmOpen(true);
        } else {
            applyTemplate(template);
        }
    };

    const applyTemplate = (templateToApply: TemplateDefinition | null) =&gt; {
        if (!templateToApply) return;

        const newBlocks = templateToApply.blocks.map(block =&gt; ({
            ...block,
            id: generateId() 
        }));
        onSelectTemplateBlocks(newBlocks);
        onClose();
        setIsConfirmOpen(false);
        setSelectedTemplate(null);
    };

    const handlePreview = (template: TemplateDefinition) =&gt; {
        if (typeof window === 'undefined') return;

        let previewData: (Partial&lt;ArticleData&gt; | Partial&lt;NoteData&gt; | Partial&lt;PageDataType&gt;) &amp; { previewType: string };
        
        const basePreviewData = {
            id: `preview_template_${template.id}_${Date.now()}`,
            title: template.name,
            blocks: template.blocks.map(b =&gt; ({...b, id: generateId()})),
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
                    category: template.category || 'Biyoloji',
                    status: 'Yayınlandı', 
                    mainImageUrl: template.blocks.find((b): b is Extract&lt;Block, { type: 'image' }&gt; =&gt; b.type === 'image')?.url || template.previewImageUrl,
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
                    contentBlocks: template.blocks.map(b =&gt; ({...b, id: generateId()})), 
                    imageUrl: template.blocks.find((b): b is Extract&lt;Block, { type: 'image' }&gt; =&gt; b.type === 'image')?.url || template.previewImageUrl,
                    authorId: 'template-author', 
                    status: 'Yayınlandı',
                };
                break;
            case 'page':
                 previewData = {
                    ...basePreviewData,
                    previewType: 'page',
                    slug: `template-${template.id}-preview`,
                    imageUrl: template.previewImageUrl,
                    settings: {}, 
                    status: 'Yayınlandı',
                };
                break;
            default:
                toast({ variant: "destructive", title: "Önizleme Hatası", description: "Bilinmeyen şablon tipi." });
                return;
        }

        console.log(`[TemplateSelector/handlePreview] Preparing to save preview data to localStorage with key: ${PREVIEW_STORAGE_KEY}`);
        console.log("[TemplateSelector/handlePreview] Preview Data before stringify:", previewData);

        if (!previewData || Object.keys(previewData).length === 0 || !previewData.previewType) {
            console.error("[TemplateSelector/handlePreview] Error: Preview data is empty or invalid before stringifying.", previewData);
            toast({ variant: "destructive", title: "Önizleme Hatası", description: "Oluşturulacak önizleme verisi boş veya geçersiz." });
            return;
        }
        
        try {
            const stringifiedData = JSON.stringify(previewData);
            console.log("[TemplateSelector/handlePreview] Stringified data:", stringifiedData.substring(0, 200) + "..."); // Log part of stringified data
            if (!stringifiedData || stringifiedData === 'null' || stringifiedData === '{}') {
                 console.error("[TemplateSelector/handlePreview] Error: Stringified preview data is empty or null.");
                 toast({ variant: "destructive", title: "Önizleme Hatası", description: "Önizleme verisi oluşturulamadı (boş veri)." });
                 return;
            }
            localStorage.setItem(PREVIEW_STORAGE_KEY, stringifiedData);
            console.log(`[TemplateSelector/handlePreview] Successfully called localStorage.setItem for key: ${PREVIEW_STORAGE_KEY}`);
            
            // Verification step
            const checkStoredData = localStorage.getItem(PREVIEW_STORAGE_KEY);
            console.log(`[TemplateSelector/handlePreview] Verification - Data retrieved from localStorage for key '${PREVIEW_STORAGE_KEY}':`, checkStoredData ? checkStoredData.substring(0,200) + "..." : "NULL");

            if (!checkStoredData || checkStoredData === 'null' || checkStoredData === 'undefined') {
                 console.error(`[TemplateSelector/handlePreview] Verification FAILED: No data found for key ${PREVIEW_STORAGE_KEY} immediately after setItem.`);
                 throw new Error("Verification failed: No data found in localStorage after setItem.");
            }
            const parsedVerify = JSON.parse(checkStoredData);
            if (!parsedVerify || !parsedVerify.previewType) {
                console.error(`[TemplateSelector/handlePreview] Verification FAILED: Invalid data structure or previewType in localStorage after setItem. Parsed:`, parsedVerify);
                throw new Error("Verification failed: Invalid data structure in localStorage after setItem.");
            }
            console.log("[TemplateSelector/handlePreview] Verification SUCCESS after setItem");
            
            const previewUrl = `/admin/preview`;
            console.log(`[TemplateSelector/handlePreview] Opening preview window with URL: ${previewUrl}`);
            
            setTimeout(() =&gt; {
                const newWindow = window.open(previewUrl, '_blank');
                if (!newWindow) {
                    console.error("[TemplateSelector/handlePreview] Failed to open preview window.");
                    toast({ variant: "destructive", title: "Önizleme Penceresi Açılamadı", description: "Lütfen tarayıcınızın pop-up engelleyicisini kontrol edin.", duration: 10000 });
                } else {
                     console.log("[TemplateSelector/handlePreview] Preview window opened successfully.");
                }
            }, 300); 

        } catch (error: any) {
            console.error("[TemplateSelector/handlePreview] Error during preview process:", error);
            toast({ variant: "destructive", title: "Önizleme Hatası", description: `Önizleme verisi kaydedilemedi veya doğrulanamadı: ${error.message}`, duration: 10000 });
        }
    };

    const filteredTemplates = Array.isArray(templates) ? templates.filter(t =&gt; {
        if (templateTypeFilter) {
            return t.type === templateTypeFilter;
        }
        return true;
    }) : [];


    let dialogTitle = "Şablon Seç";
    if (templateTypeFilter === 'article') dialogTitle = "Makale Şablonu Seç";
    else if (templateTypeFilter === 'note') dialogTitle = "Not Şablonu Seç";
    else if (templateTypeFilter === 'page') dialogTitle = "Sayfa Şablonu Seç";


    return (
        &lt;&gt;
            &lt;Dialog open={isOpen} onOpenChange={(open) =&gt; { if (!open) onClose(); }}&gt;
                &lt;DialogContent className="sm:max-w-[60%] lg:max-w-[70%] max-h-[80vh] flex flex-col p-0"&gt;
                    &lt;DialogHeader className="p-6 pb-0"&gt;
                        &lt;DialogTitle&gt;{dialogTitle}&lt;/DialogTitle&gt;
                        &lt;DialogDescription&gt;
                            İçeriğinizi oluşturmaya başlamak için hazır bir şablon seçin.
                            {blocksCurrentlyExist && &lt;span className="text-destructive font-medium"&gt; Şablon içeriği mevcut içeriğinizin üzerine yazılabilir (onayınızla).&lt;/span&gt;}
                        &lt;/DialogDescription&gt;
                    &lt;/DialogHeader&gt;
                    &lt;ScrollArea className="flex-grow border-t border-b"&gt;
                        {loadingTemplates ? (
                            &lt;div className="flex justify-center items-center h-64"&gt;
                                &lt;Loader2 className="h-8 w-8 animate-spin text-primary" /&gt;
                                &lt;span className="ml-2"&gt;Şablonlar yükleniyor...&lt;/span&gt;
                            &lt;/div&gt;
                        ) : (
                            &lt;div className="grid gap-4 p-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"&gt;
                                {filteredTemplates.length &gt; 0 ? filteredTemplates.map((template) =&gt; (
                                    &lt;Card key={template.id} className="flex flex-col"&gt;
                                        &lt;CardHeader className="pb-2"&gt;
                                            &lt;CardTitle className="text-base"&gt;{template.name}&lt;/CardTitle&gt;
                                        &lt;/CardHeader&gt;
                                        &lt;CardContent className="flex flex-col flex-grow space-y-3"&gt;
                                            &lt;div className="relative aspect-[3/2] w-full rounded overflow-hidden bg-muted"&gt;
                                                &lt;Image
                                                    src={template.previewImageUrl || 'https://picsum.photos/seed/default-template/300/200'}
                                                    alt={template.name}
                                                    fill 
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Example sizes
                                                    className="rounded object-cover" // Ensure object-cover
                                                    data-ai-hint={template.category?.toLowerCase() || 'abstract content design'}
                                                /&gt;
                                            &lt;/div&gt;
                                            &lt;p className="text-xs text-muted-foreground flex-grow line-clamp-3"&gt;{template.description}&lt;/p&gt;
                                            &lt;div className="flex justify-between items-center pt-2"&gt;
                                                &lt;Button size="sm" variant="outline" onClick={(e) =&gt; { e.stopPropagation(); handlePreview(template); }}&gt;
                                                    &lt;Eye className="mr-2 h-4 w-4" /&gt;
                                                    Önizle
                                                &lt;/Button&gt;
                                                 &lt;Button size="sm" onClick={(e) =&gt; {e.stopPropagation(); handleSelectClick(template);}}&gt;Seç&lt;/Button&gt;
                                            &lt;/div&gt;
                                        &lt;/CardContent&gt;
                                    &lt;/Card&gt;
                                )) : (
                                     &lt;p className="text-muted-foreground text-center md:col-span-2 lg:col-span-3 xl:col-span-4 py-4"&gt;
                                        Bu tür için uygun şablon bulunamadı veya hiç şablon eklenmemiş.
                                    &lt;/p&gt;
                                )}
                            &lt;/div&gt;
                        )}
                    &lt;/ScrollArea&gt;
                    &lt;DialogFooter className="p-6 pt-0"&gt;
                        &lt;Button type="button" variant="secondary" onClick={onClose}&gt;
                            Kapat
                        &lt;/Button&gt;
                    &lt;/DialogFooter&gt;
                &lt;/DialogContent&gt;
            &lt;/Dialog&gt;
            
            {selectedTemplate && (
                &lt;AlertDialog open={isConfirmOpen} onOpenChange={(open) =&gt; { if (!open) { setIsConfirmOpen(false); setSelectedTemplate(null); }}}&gt;
                    &lt;AlertDialogContent&gt;
                        &lt;AlertDialogHeader&gt;
                            &lt;AlertDialogTitle&gt;Mevcut İçeriğin Üzerine Yazılsın mı?&lt;/AlertDialogTitle&gt;
                            &lt;AlertDialogDescription&gt;
                                Düzenleyicide zaten içerik bulunuyor. "{selectedTemplate?.name}" şablonunu uygulamak mevcut içeriği silecektir.
                                Bu işlem geri alınamaz. Devam etmek istediğinizden emin misiniz?
                            &lt;/AlertDialogDescription&gt;
                        &lt;/AlertDialogHeader&gt;
                        &lt;AlertDialogFooter&gt;
                            &lt;AlertDialogCancel onClick={() =&gt; { setIsConfirmOpen(false); setSelectedTemplate(null); }}&gt;İptal&lt;/AlertDialogCancel&gt;
                            &lt;AlertDialogAction onClick={() =&gt; applyTemplate(selectedTemplate)}&gt;
                                Evet, Üzerine Yaz
                            &lt;/AlertDialogAction&gt;
                        &lt;/AlertDialogFooter&gt;
                    &lt;/AlertDialogContent&gt;
                &lt;/AlertDialog&gt;
            )}
        &lt;/&gt;
    );
}
