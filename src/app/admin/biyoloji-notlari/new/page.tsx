
"use client"; // Essential for hooks

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from "@/hooks/use-toast";
import { BlockEditor } from "@/components/admin/block-editor";
import { TemplateSelector, type Block } from "@/components/admin/template-selector"; // Import TemplateSelector
import { useDebouncedCallback } from 'use-debounce';
import { createNote, type NoteData, generateSlug, getCategories, type Category } from '@/lib/mock-data'; // Import getCategories

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"; // Import Tabs
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Eye, Loader2, Save, Upload, BookCopy, Tag, AlertTriangle, Layers } from "lucide-react"; // Added Layers icon

// Helper to generate unique block IDs safely on the client
const generateBlockId = () => `block-${Date.now()}-${Math.random().toString(36).substring(7)}`;
const createDefaultBlock = (): Block => ({ id: generateBlockId(), type: 'text', content: '' });

const PREVIEW_STORAGE_KEY = 'preview_data'; // Consistent key

// --- Main Page Component ---
export default function NewBiyolojiNotuPage() {
    const router = useRouter();

    // --- State ---
    const [saving, setSaving] = React.useState(false);
    const [templateApplied, setTemplateApplied] = React.useState(false); // Track if template is applied
    const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = React.useState(false); // State for modal
    const [categories, setCategories] = React.useState<Category[]>([]); // State for categories
    const [loadingCategories, setLoadingCategories] = React.useState(true); // Loading state for categories

    const [title, setTitle] = React.useState("");
    const [summary, setSummary] = React.useState("");
    const [category, setCategory] = React.useState(""); // Category is now a string
    const [level, setLevel] = React.useState<NoteData['level'] | "">(""); // Example: "Lise 9"
    const [tags, setTags] = React.useState<string[]>([]);
    const [imageUrl, setImageUrl] = React.useState("");
    const [slug, setSlug] = React.useState("");
    const [blocks, setBlocks] = React.useState<Block[]>([]); // Start empty, add default in effect
    const [selectedBlockId, setSelectedBlockId] = React.useState<string | null>(null);

    // Default block effect and category loading
    React.useEffect(() => {
        if (blocks.length === 0) {
            setBlocks([createDefaultBlock()]);
        }

         setLoadingCategories(true);
         getCategories()
             .then(data => setCategories(data))
             .catch(err => {
                 console.error("Error fetching categories:", err);
                 toast({ variant: "destructive", title: "Hata", description: "Kategoriler yüklenemedi." });
             })
             .finally(() => setLoadingCategories(false));

    }, []); // Empty dependency array ensures this runs only once on mount

    // --- Handlers ---

    // Auto-generate slug from title (debounced)
    const debouncedSetSlug = useDebouncedCallback((newTitle: string) => {
        if (newTitle) {
            setSlug(generateSlug(newTitle));
        } else {
            setSlug('');
        }
    }, 500);

    React.useEffect(() => {
        debouncedSetSlug(title);
    }, [title, debouncedSetSlug]);

    // --- Block Editor Handlers ---
    const handleAddBlock = (type: Block['type']) => {
        const newBlock: Block = {
            id: generateBlockId(),
            type: type,
            ...(type === 'text' && { content: '' }),
            ...(type === 'heading' && { level: 2, content: '' }),
            ...(type === 'image' && { url: '', alt: '', caption: '' }),
            ...(type === 'gallery' && { images: [] }),
            ...(type === 'video' && { url: '', youtubeId: '' }),
            ...(type === 'quote' && { content: '', citation: '' }),
            ...(type === 'divider' && {}),
            ...(type === 'section' && { sectionType: 'custom-text', settings: {} }),
        } as Block;
        setBlocks((prevBlocks) => [...prevBlocks, newBlock]);
        setSelectedBlockId(newBlock.id);
        setTemplateApplied(false); // Adding manually modifies template
    };

    const handleDeleteBlock = (id: string) => {
        setBlocks((prevBlocks) => prevBlocks.filter(block => block.id !== id));
        if (selectedBlockId === id) setSelectedBlockId(null);
        setTemplateApplied(false); // Deleting modifies template
    };

    const handleUpdateBlock = (updatedBlock: Block) => {
        setBlocks(prevBlocks =>
            prevBlocks.map(block =>
                block.id === updatedBlock.id ? updatedBlock : block
            )
        );
    };

    const handleReorderBlocks = (reorderedBlocks: Block[]) => {
        setBlocks(reorderedBlocks);
        setTemplateApplied(false); // Reordering modifies template
    };

    const handleBlockSelect = (id: string | null) => {
        setSelectedBlockId(id);
    };
    // --- End Block Editor Handlers ---

    const handleSave = async () => {
         if (!title || !slug || !category || !level) {
             toast({ variant: "destructive", title: "Eksik Bilgi", description: "Lütfen Başlık, Kategori ve Seviye alanlarını doldurun." });
             return;
         }

         setSaving(true);

         const newNoteData: Omit<NoteData, 'id' | 'createdAt' | 'updatedAt'> = {
             title,
             slug,
             category, // Category is string
             level,
             tags,
             summary,
             contentBlocks: blocks.length > 0 ? blocks : [createDefaultBlock()],
             imageUrl: imageUrl || null,
         };

         console.log("Preparing to create note:", newNoteData);

         try {
             const newNote = await createNote(newNoteData);
             if (newNote) {
                 toast({
                     title: "Not Oluşturuldu",
                     description: `"${newNote.title}" başlıklı not başarıyla oluşturuldu.`,
                 });
                  router.push(`/admin/biyoloji-notlari/edit/${newNote.id}`);
             } else {
                  toast({ variant: "destructive", title: "Oluşturma Hatası", description: "Not oluşturulamadı." });
                  setSaving(false);
             }
         } catch (error) {
             console.error("Error creating note:", error);
             toast({ variant: "destructive", title: "Oluşturma Hatası", description: "Not oluşturulurken bir hata oluştu." });
             setSaving(false);
         }
    };

    // --- Template Handlers ---
     const handleTemplateSelect = (templateBlocks: Block[]) => {
         const newBlocks = templateBlocks.map(block => ({
             ...block,
             id: generateBlockId()
         }));
         setBlocks(newBlocks);
         setTemplateApplied(true);
         setIsTemplateSelectorOpen(false);
         toast({ title: "Şablon Uygulandı", description: "Seçilen şablon içeriğe başarıyla uygulandı." });
     };

     const handleRemoveTemplate = () => {
         if (window.confirm("Mevcut içeriği kaldırıp varsayılan boş metin bloğuna dönmek istediğinizden emin misiniz?")) {
             setBlocks([createDefaultBlock()]);
             setTemplateApplied(false);
             setSelectedBlockId(null);
             toast({ title: "Şablon Kaldırıldı", description: "İçerik varsayılan boş metin bloğuna döndürüldü." });
         }
     };
     // --- End Template Handlers ---


     const handlePreview = () => {
        if (typeof window === 'undefined') return;

        if (!category || !level) {
            toast({ variant: "destructive", title: "Önizleme Hatası", description: "Lütfen önizlemeden önce Kategori ve Seviye seçin." });
            return;
        }

        // Simulate NoteData structure for preview
        const previewData: Partial<NoteData> & { previewType: 'note' } = { // Add a type identifier
            previewType: 'note',
            id: 'preview_new_note',
            title: title || 'Başlıksız Not',
            slug: slug || generateSlug(title),
            category: category, // Category is string
            level: level,
            tags: tags,
            summary: summary || '',
            contentBlocks: blocks, // Use contentBlocks for notes
            imageUrl: imageUrl || 'https://picsum.photos/seed/notepreview/800/400',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        console.log(`[NewBiyolojiNotuPage/handlePreview] Saving preview data with key: ${PREVIEW_STORAGE_KEY}:`, previewData);

        try {
            localStorage.setItem(PREVIEW_STORAGE_KEY, JSON.stringify(previewData));
            console.log(`[NewBiyolojiNotuPage/handlePreview] Successfully saved preview data for key: ${PREVIEW_STORAGE_KEY}`);

            // Verification Step
            const storedData = localStorage.getItem(PREVIEW_STORAGE_KEY);
            if (!storedData) throw new Error("Verification failed: No data found in localStorage.");
            const parsed = JSON.parse(storedData);
            if (!parsed || parsed.previewType !== 'note') throw new Error("Verification failed: Invalid data structure in localStorage.");
            console.log("[NewBiyolojiNotuPage/handlePreview] Verification SUCCESS");
            // ---

            const previewUrl = `/admin/preview`;
            console.log(`[NewBiyolojiNotuPage/handlePreview] Opening preview window: ${previewUrl}`);

            setTimeout(() => {
                const newWindow = window.open(previewUrl, '_blank');
                if (!newWindow) {
                     console.error("[NewBiyolojiNotuPage/handlePreview] Failed to open preview window.");
                     toast({ variant: "destructive", title: "Önizleme Açılamadı", description: "Pop-up engelleyiciyi kontrol edin.", duration: 10000 });
                } else {
                     console.log("[NewBiyolojiNotuPage/handlePreview] Preview window opened.");
                }
            }, 150);

        } catch (error: any) {
            console.error("[NewBiyolojiNotuPage/handlePreview] Error:", error);
            toast({ variant: "destructive", title: "Önizleme Hatası", description: error.message, duration: 10000 });
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Top Bar */}
             <div className="flex items-center justify-between px-6 py-3 border-b bg-card sticky top-0 z-10">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/admin/biyoloji-notlari"><ArrowLeft className="mr-2 h-4 w-4" /> Geri</Link>
                </Button>
                <h1 className="text-xl font-semibold flex items-center gap-2"> <BookCopy className="h-6 w-6 text-green-600"/> Yeni Biyoloji Notu Oluştur</h1>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handlePreview} disabled={saving}>
                        <Eye className="mr-2 h-4 w-4" /> Önizle
                    </Button>
                    <Button size="sm" onClick={handleSave} disabled={saving || !title || !slug || !category || !level}>
                        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Kaydet
                    </Button>
                 </div>
            </div>

            {/* Main Content Area */}
             <div className="flex flex-1 overflow-hidden">
                {/* Left Content Area (Editor with Tabs) */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                     <Tabs defaultValue="content">
                         <TabsList className="mb-6">
                            <TabsTrigger value="content">Not İçeriği</TabsTrigger>
                             <TabsTrigger value="template" onClick={() => setIsTemplateSelectorOpen(true)}>Şablon Seç</TabsTrigger> {/* Template Trigger */}
                         </TabsList>

                         <TabsContent value="content" className="space-y-6">
                            {/* Metadata Card */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Not Bilgileri</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Başlık <span className="text-destructive">*</span></Label>
                                        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Notun başlığını girin" required />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="slug">URL Metni (Slug)</Label>
                                            <Input id="slug" value={slug} onChange={(e) => setSlug(generateSlug(e.target.value))} placeholder="not-basligi-url" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="category">Kategori <span className="text-destructive">*</span></Label>
                                             <Select value={category} onValueChange={(value) => setCategory(value)} required disabled={loadingCategories}>
                                                <SelectTrigger id="category"><SelectValue placeholder="Kategori seçin" /></SelectTrigger>
                                                <SelectContent>
                                                    {loadingCategories ? (
                                                        <SelectItem disabled>Yükleniyor...</SelectItem> {/* Remove value="" */}
                                                     ) : (
                                                        categories.map(cat => (
                                                           <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                                                        ))
                                                     )}
                                                      <Separator />
                                                      <Link href="/admin/categories" className="p-2 text-sm text-muted-foreground hover:text-primary">Kategorileri Yönet</Link>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="level">Seviye <span className="text-destructive">*</span></Label>
                                            <Select value={level} onValueChange={(value) => setLevel(value as NoteData['level'])} required>
                                                <SelectTrigger id="level"><SelectValue placeholder="Seviye seçin" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Lise 9">Lise 9</SelectItem>
                                                    <SelectItem value="Lise 10">Lise 10</SelectItem>
                                                    <SelectItem value="Lise 11">Lise 11</SelectItem>
                                                    <SelectItem value="Lise 12">Lise 12</SelectItem>
                                                    <SelectItem value="Genel">Genel</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="summary">Özet</Label>
                                        <Textarea id="summary" value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Notun kısa bir özetini girin" rows={2} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="tags">Etiketler</Label>
                                        <div className="flex items-center gap-2">
                                            <Tag className="h-4 w-4 text-muted-foreground"/>
                                            <Input id="tags" value={tags.join(', ')} onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag !== ''))} placeholder="Etiketleri virgülle ayırın (örn: hücre, dna, organel)" />
                                        </div>
                                        <p className="text-xs text-muted-foreground">Notun bulunabilirliğini artırmak için ilgili anahtar kelimeleri girin.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="image-url">Kapak Görsel URL</Label>
                                        <div className="flex gap-2">
                                             <Input id="image-url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
                                             <Button variant="outline"><Upload className="mr-2 h-4 w-4"/> Yükle</Button>
                                        </div>
                                        {imageUrl && (
                                            <div className="mt-2 rounded border p-2 w-fit">
                                                <Image src={imageUrl} alt="Kapak Görsel Önizleme" width={200} height={100} className="object-cover rounded" data-ai-hint="biology note cover placeholder"/>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Separator />

                             {/* Block Editor Section */}
                            <BlockEditor
                              blocks={blocks}
                              onAddBlock={handleAddBlock}
                              onDeleteBlock={handleDeleteBlock}
                              onUpdateBlock={handleUpdateBlock}
                              onReorderBlocks={handleReorderBlocks}
                              selectedBlockId={selectedBlockId}
                              onBlockSelect={handleBlockSelect}
                            />
                          </TabsContent>

                          {/* Template Tab Content (Placeholder for trigger) */}
                           <TabsContent value="template">
                               <p className="text-muted-foreground">Şablon seçmek için yukarıdaki "Şablon Seç" sekmesine tıklayın.</p>
                               {/* Show Remove Template button if a template is applied */}
                               {templateApplied && (
                                    <Button variant="outline" className="mt-4 text-destructive border-destructive/50 hover:bg-destructive/10" onClick={handleRemoveTemplate} disabled={saving}>
                                        <Layers className="mr-2 h-4 w-4" /> Şablonu Kaldır
                                    </Button>
                               )}
                           </TabsContent>
                     </Tabs>
                </div>
             </div>

              {/* Template Selector Modal */}
              <TemplateSelector
                  isOpen={isTemplateSelectorOpen}
                  onClose={() => setIsTemplateSelectorOpen(false)}
                  onSelectTemplateBlocks={handleTemplateSelect}
                  blocksCurrentlyExist={blocks.length > 1 || (blocks.length === 1 && (blocks[0]?.type !== 'text' || blocks[0]?.content !== ''))}
                  templateTypeFilter="note" // Filter for note templates
              />
        </div>
    );
}

