
"use client"; // Essential for hooks

import * as React from 'react';
import { useRouter, useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from "@/hooks/use-toast";
import { BlockEditor } from "@/components/admin/block-editor";
import type { Block } from "@/components/admin/template-selector";
import { useDebouncedCallback } from 'use-debounce';
import { getNoteById, updateNote, deleteNote, type NoteData, generateSlug, getCategories, type Category } from '@/lib/mock-data'; // Import getCategories

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { ArrowLeft, Eye, Loader2, Save, Upload, Trash2, BookCopy, Tag, AlertTriangle } from "lucide-react";

// Helper to generate unique block IDs safely on the client
const generateBlockId = () => `block-${Date.now()}-${Math.random().toString(36).substring(7)}`;
const createDefaultBlock = (): Block => ({ id: generateBlockId(), type: 'text', content: '' });

const PREVIEW_STORAGE_KEY = 'preview_data'; // Consistent key

// --- Main Page Component ---
export default function EditBiyolojiNotuPage() {
    const router = useRouter();
    const params = useParams();
    const noteId = React.use(params.id) as string; // Use React.use for simpler param access

    // --- State ---
    const [noteData, setNoteData] = React.useState<NoteData | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [saving, setSaving] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [categories, setCategories] = React.useState<Category[]>([]); // State for categories

    // Form Field States
    const [title, setTitle] = React.useState("");
    const [summary, setSummary] = React.useState("");
    const [category, setCategory] = React.useState(""); // Category is now a string
    const [level, setLevel] = React.useState<NoteData['level'] | "">("");
    const [tags, setTags] = React.useState<string[]>([]);
    const [imageUrl, setImageUrl] = React.useState<string | null>(null);
    const [slug, setSlug] = React.useState("");
    const [blocks, setBlocks] = React.useState<Block[]>([]);
    const [selectedBlockId, setSelectedBlockId] = React.useState<string | null>(null);

    // --- Data Fetching ---
    React.useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            if (!noteId) {
                if (isMounted) {
                     setError("Geçersiz not ID.");
                     setLoading(false);
                     setBlocks([createDefaultBlock()]);
                }
                return;
            }

             if (isMounted) {
                setLoading(true);
                setError(null);
             }

             try {
                 const [noteResult, categoriesResult] = await Promise.all([
                    getNoteById(noteId),
                    getCategories() // Fetch categories
                 ]);

                 if (isMounted) {
                     setCategories(categoriesResult); // Set categories state

                     if (noteResult) {
                         setNoteData(noteResult);
                         setTitle(noteResult.title);
                         setSummary(noteResult.summary || '');
                         setCategory(noteResult.category); // Set string category
                         setLevel(noteResult.level);
                         setTags(noteResult.tags || []);
                         setImageUrl(noteResult.imageUrl || null);
                         setSlug(noteResult.slug);
                         setBlocks(noteResult.contentBlocks && noteResult.contentBlocks.length > 0 ? noteResult.contentBlocks : [createDefaultBlock()]);
                     } else {
                         setError("Not bulunamadı.");
                     }
                 }
             } catch (err) {
                if (isMounted) {
                     console.error("Error fetching data:", err);
                     setError("Veri yüklenirken bir sorun oluştu.");
                     toast({ variant: "destructive", title: "Hata", description: "Not veya kategori bilgileri yüklenemedi." });
                }
             } finally {
                if (isMounted) {
                    setLoading(false);
                }
             }
        };

        fetchData();

        return () => { isMounted = false };
    }, [noteId]);

    // Auto-update slug when title changes (debounced, respects manual changes)
     const debouncedSetSlug = useDebouncedCallback((newTitle: string, originalTitle: string, currentSlug: string) => {
         if (newTitle && newTitle !== originalTitle) {
             if (!currentSlug || currentSlug === generateSlug(originalTitle)) {
                 setSlug(generateSlug(newTitle));
             }
         } else if (newTitle && !currentSlug) {
            setSlug(generateSlug(newTitle));
         }
     }, 500);

     React.useEffect(() => {
         if (noteData) {
             debouncedSetSlug(title, noteData.title, slug);
         } else if (title && !slug) {
            setSlug(generateSlug(title));
         }
     }, [title, noteData, slug, debouncedSetSlug]);


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
    };

    const handleDeleteBlock = (id: string) => {
        setBlocks((prevBlocks) => prevBlocks.filter(block => block.id !== id));
        if (selectedBlockId === id) setSelectedBlockId(null);
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

         const updateData: Partial<Omit<NoteData, 'id' | 'createdAt'>> = {
             title,
             slug,
             category, // Category is string
             level,
             tags,
             summary,
             contentBlocks: blocks.length > 0 ? blocks : [createDefaultBlock()],
             imageUrl: imageUrl || null,
             // 'updatedAt' will be handled by updateNote
         };

         console.log("[EditBiyolojiNotuPage/handleSave] Preparing to save note:", noteId, "with data:", updateData);

         try {
             const updatedNote = await updateNote(noteId, updateData);

             if (updatedNote) {
                 setNoteData(updatedNote); // Update main data state
                 // Re-sync form fields with the response
                 setTitle(updatedNote.title);
                 setSummary(updatedNote.summary || '');
                 setCategory(updatedNote.category); // Update category string
                 setLevel(updatedNote.level);
                 setTags(updatedNote.tags || []);
                 setImageUrl(updatedNote.imageUrl || null);
                 setSlug(updatedNote.slug);
                 setBlocks(updatedNote.contentBlocks && updatedNote.contentBlocks.length > 0 ? updatedNote.contentBlocks : [createDefaultBlock()]);

                 console.log("[EditBiyolojiNotuPage/handleSave] Save successful. Updated noteData state:", updatedNote);
                 toast({
                     title: "Not Kaydedildi",
                     description: `"${updatedNote.title}" başlıklı not başarıyla kaydedildi.`,
                 });

             } else {
                  console.error("[EditBiyolojiNotuPage/handleSave] Save failed. API returned no data.");
                  toast({ variant: "destructive", title: "Kaydetme Hatası", description: "Not kaydedilemedi." });
             }
         } catch (error) {
             console.error("[EditBiyolojiNotuPage/handleSave] Error during save:", error);
             toast({ variant: "destructive", title: "Kaydetme Hatası", description: "Not kaydedilirken bir hata oluştu." });
         } finally {
             setSaving(false);
         }
    };

     const handleDelete = async () => {
        if (window.confirm(`"${title}" başlıklı notu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`)) {
            setSaving(true);
            try {
                const success = await deleteNote(noteId);
                if (success) {
                    toast({
                        variant: "destructive",
                        title: "Not Silindi",
                        description: `"${title}" başlıklı not silindi.`,
                    });
                    router.push('/admin/biyoloji-notlari');
                } else {
                     toast({ variant: "destructive", title: "Silme Hatası", description: "Not silinemedi." });
                     setSaving(false);
                }
             } catch (error) {
                 console.error("Error deleting note:", error);
                 toast({ variant: "destructive", title: "Silme Hatası", description: "Not silinirken bir hata oluştu." });
                 setSaving(false);
             }
        }
    };


     const handlePreview = () => {
        if (typeof window === 'undefined') return;

        if (!category || !level) {
            toast({ variant: "destructive", title: "Önizleme Hatası", description: "Lütfen önizlemeden önce Kategori ve Seviye seçin." });
            return;
        }

        const previewData: Partial<NoteData> & { previewType: 'note' } = { // Add a type identifier
            previewType: 'note',
            id: noteId || 'preview_edit_note',
            title: title || 'Başlıksız Not',
            slug: slug || generateSlug(title),
            category: category, // Category is string
            level: level,
            tags: tags,
            summary: summary || '',
            contentBlocks: blocks, // Use contentBlocks for notes
            imageUrl: imageUrl || 'https://picsum.photos/seed/notepreview/800/400',
            createdAt: noteData?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };


        console.log(`[EditBiyolojiNotuPage/handlePreview] Saving preview data with key ${PREVIEW_STORAGE_KEY}:`, previewData);

        try {
            localStorage.setItem(PREVIEW_STORAGE_KEY, JSON.stringify(previewData));
            console.log(`[EditBiyolojiNotuPage/handlePreview] Successfully saved preview data`);

             // Verification Step
             const storedData = localStorage.getItem(PREVIEW_STORAGE_KEY);
             if (!storedData) throw new Error("Verification failed: No data found in localStorage.");
             const parsed = JSON.parse(storedData);
             if (!parsed || parsed.previewType !== 'note') throw new Error("Verification failed: Invalid data structure in localStorage.");
             console.log("[EditBiyolojiNotuPage/handlePreview] Verification SUCCESS");
             // ---

            const previewUrl = `/admin/preview`;
            console.log(`[EditBiyolojiNotuPage/handlePreview] Opening preview window: ${previewUrl}`);

            setTimeout(() => {
                const newWindow = window.open(previewUrl, '_blank');
                if (!newWindow) {
                     console.error("[EditBiyolojiNotuPage/handlePreview] Failed to open preview window.");
                     toast({ variant: "destructive", title: "Önizleme Açılamadı", description: "Pop-up engelleyiciyi kontrol edin.", duration: 10000 });
                } else {
                     console.log("[EditBiyolojiNotuPage/handlePreview] Preview window opened.");
                }
            }, 150);

        } catch (error: any) {
            console.error("[EditBiyolojiNotuPage/handlePreview] Error:", error);
            toast({ variant: "destructive", title: "Önizleme Hatası", description: error.message, duration: 10000 });
        }
    };


     // --- Rendering ---

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="mr-2 h-8 w-8 animate-spin" />
                Not yükleniyor...
            </div>
        );
    }

    if (error) {
         return <div className="text-center py-10 text-destructive">{error}</div>;
    }

    if (!noteData && !loading) {
         return <div className="text-center py-10">Not bulunamadı veya yüklenemedi.</div>;
    }


    return (
        <div className="flex flex-col h-full">
            {/* Top Bar */}
             <div className="flex items-center justify-between px-6 py-3 border-b bg-card sticky top-0 z-10">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/admin/biyoloji-notlari"><ArrowLeft className="mr-2 h-4 w-4" /> Geri</Link>
                </Button>
                 <h1 className="text-xl font-semibold truncate flex items-center gap-2" title={`Notu Düzenle: ${title || 'Yeni Not'}`}>
                     <BookCopy className="h-6 w-6 text-green-600"/> {noteData ? `Notu Düzenle` : 'Yeni Not'}
                </h1>
                <div className="flex items-center gap-2">
                     {noteData && (
                        <Button variant="destructive" size="sm" onClick={handleDelete} disabled={saving}>
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </Button>
                      )}
                     <Button variant="outline" size="sm" onClick={handlePreview} disabled={saving}>
                        <Eye className="mr-2 h-4 w-4" /> Önizle
                    </Button>
                      <Button size="sm" onClick={handleSave} disabled={saving || !title || !slug || !category || !level}>
                        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Kaydet
                     </Button>
                </div>
            </div>

            {/* Main Content Area */}
             <div className="flex flex-1 overflow-hidden">
                {/* Left Content Area (Editor) */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Not Bilgileri</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Başlık <span className="text-destructive">*</span></Label>
                                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="slug">URL Metni (Slug)</Label>
                                    <Input id="slug" value={slug} onChange={(e) => setSlug(generateSlug(e.target.value))} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category">Kategori <span className="text-destructive">*</span></Label>
                                    {/* Use Select for category */}
                                    <Select value={category} onValueChange={(value) => setCategory(value)} required disabled={loading}>
                                        <SelectTrigger id="category"><SelectValue placeholder="Kategori seçin" /></SelectTrigger>
                                        <SelectContent>
                                            {categories.length === 0 && <SelectItem disabled>Yükleniyor...</SelectItem>}
                                            {categories.map(cat => (
                                                <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                                            ))}
                                             <Separator />
                                             <Link href="/admin/categories" className="p-2 text-sm text-muted-foreground hover:text-primary">Kategorileri Yönet</Link>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="level">Seviye <span className="text-destructive">*</span></Label>
                                    <Select value={level} onValueChange={(value) => setLevel(value as NoteData['level'])} required>
                                        <SelectTrigger id="level"><SelectValue /></SelectTrigger>
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
                                <Textarea id="summary" value={summary} onChange={(e) => setSummary(e.target.value)} rows={2} />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="tags">Etiketler</Label>
                                <div className="flex items-center gap-2">
                                    <Tag className="h-4 w-4 text-muted-foreground"/>
                                    <Input
                                        id="tags"
                                        value={tags.join(', ')}
                                        onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag !== ''))}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="image-url">Kapak Görsel URL</Label>
                                <div className="flex gap-2">
                                     <Input id="image-url" value={imageUrl ?? ""} onChange={(e) => setImageUrl(e.target.value)} />
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
                </div>
             </div>
        </div>
    );
}
