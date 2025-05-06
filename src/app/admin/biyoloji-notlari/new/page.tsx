"use client"; // Essential for hooks

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from "@/hooks/use-toast";
import { BlockEditor } from "@/components/admin/block-editor";
import { TemplateSelector, type Block } from "@/components/admin/template-selector";
import { useDebouncedCallback } from 'use-debounce';
import { createNote, type NoteData, generateSlug, getCategories, type Category } from '@/lib/mock-data';
import { generateBiologyNoteSuggestion, type GenerateBiologyNoteSuggestionInput, type GenerateBiologyNoteSuggestionOutput, type AiBlockStructure as GenerateNoteAiBlockStructure } from '@/ai/flows/generate-biology-note-flow';
import { biologyChat, type BiologyChatInput, type BiologyChatOutput, type ChatMessage as AiDirectChatMessageDef } from '@/ai/flows/biology-chat-flow';


import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
import { ArrowLeft, Eye, Loader2, Save, Upload, BookCopy, Tag, AlertTriangle, Layers, Sparkles, MessageCircle, MessageSquare as ChatIcon, Send } from "lucide-react"; // Added Send icon
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';


// Helper to generate unique block IDs safely on the client
const generateBlockId = () => `block-${Date.now()}-${Math.random().toString(36).substring(7)}`;
const createDefaultBlock = (): Block => ({ id: generateBlockId(), type: 'text', content: '' });

const PREVIEW_STORAGE_KEY = 'preview_data';

// --- AI Message Types ---
interface AiAssistantMessage {
    id: string;
    type: 'user' | 'ai' | 'error';
    content: string | React.ReactNode;
}

// Use the imported type for AI Direct Chat
type AiDirectChatMessage = AiDirectChatMessageDef;


// --- Main Page Component ---
export default function NewBiyolojiNotuPage() {
    const router = useRouter();

    // --- State ---
    const [saving, setSaving] = React.useState(false);
    const [templateApplied, setTemplateApplied] = React.useState(false);
    const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = React.useState(false);
    const [categories, setCategories] = React.useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = React.useState(true);

    const [title, setTitle] = React.useState("");
    const [summary, setSummary] = React.useState("");
    const [category, setCategory] = React.useState("");
    const [level, setLevel] = React.useState<NoteData['level'] | "">("Lise 9"); // Default to Lise 9
    const [tags, setTags] = React.useState<string[]>([]);
    const [imageUrl, setImageUrl] = React.useState("");
    const [slug, setSlug] = React.useState("");
    const [blocks, setBlocks] = React.useState<Block[]>([]);
    const [selectedBlockId, setSelectedBlockId] = React.useState<string | null>(null);

    // --- AI Note Assistant State ---
    const [isAiAssistantPanelOpen, setIsAiAssistantPanelOpen] = React.useState(false);
    const [aiAssistantTopic, setAiAssistantTopic] = React.useState("");
    const [aiAssistantKeywords, setAiAssistantKeywords] = React.useState("");
    const [aiAssistantOutline, setAiAssistantOutline] = React.useState("");
    const [aiAssistantMessages, setAiAssistantMessages] = React.useState<AiAssistantMessage[]>([]);
    const [isAiAssistantGenerating, setIsAiAssistantGenerating] = React.useState(false);
    const aiAssistantChatContainerRef = React.useRef<HTMLDivElement>(null);

    // --- AI Biology Chat State ---
    const [isAiChatPanelOpen, setIsAiChatPanelOpen] = React.useState(false);
    const [aiChatMessages, setAiChatMessages] = React.useState<AiDirectChatMessage[]>([]);
    const [aiChatInput, setAiChatInput] = React.useState("");
    const [isAiChatResponding, setIsAiChatResponding] = React.useState(false);
    const aiDirectChatContainerRef = React.useRef<HTMLDivElement>(null);


    React.useEffect(() => {
        if (blocks.length === 0) {
            setBlocks([createDefaultBlock()]);
        }
        setLoadingCategories(true);
        getCategories()
            .then(data => {
                setCategories(data.filter(cat => cat.id && cat.name)); // Ensure categories have id and name
            })
            .catch(err => {
                console.error("Error fetching categories:", err);
                toast({ variant: "destructive", title: "Hata", description: "Kategoriler yüklenemedi." });
            })
            .finally(() => setLoadingCategories(false));
    }, []);

    const debouncedSetSlug = useDebouncedCallback((newTitle: string) => {
        if (newTitle) setSlug(generateSlug(newTitle));
        else setSlug('');
    }, 500);

    React.useEffect(() => debouncedSetSlug(title), [title, debouncedSetSlug]);

    React.useEffect(() => {
        if (aiAssistantChatContainerRef.current) {
            aiAssistantChatContainerRef.current.scrollTop = aiAssistantChatContainerRef.current.scrollHeight;
        }
    }, [aiAssistantMessages]);

    React.useEffect(() => {
        if (aiDirectChatContainerRef.current) {
            aiDirectChatContainerRef.current.scrollTop = aiDirectChatContainerRef.current.scrollHeight;
        }
    }, [aiChatMessages]);


    const handleAddBlock = (type: Block['type']) => {
        const newBlock: Block = {
            id: generateBlockId(), type,
            ...(type === 'text' && { content: '' }),
            ...(type === 'heading' && { level: 2, content: '' }),
            ...(type === 'image' && { url: '', alt: '', caption: '' }),
            ...(type === 'gallery' && { images: [] }),
            ...(type === 'video' && { url: '', youtubeId: '' }),
            ...(type === 'quote' && { content: '', citation: '' }),
            ...(type === 'divider' && {}),
            ...(type === 'section' && { sectionType: 'custom-text', settings: {} }),
        } as Block;
        setBlocks((prev) => [...prev, newBlock]);
        setSelectedBlockId(newBlock.id);
        setTemplateApplied(false);
    };

    const handleDeleteBlock = (id: string) => {
        setBlocks((prev) => prev.filter(block => block.id !== id));
        if (selectedBlockId === id) setSelectedBlockId(null);
        setTemplateApplied(false);
    };

    const handleUpdateBlock = (updatedBlock: Block) => {
        setBlocks(prev => prev.map(b => b.id === updatedBlock.id ? updatedBlock : b));
    };

    const handleReorderBlocks = (reorderedBlocks: Block[]) => {
        setBlocks(reorderedBlocks);
        setTemplateApplied(false);
    };

    const handleBlockSelect = (id: string | null) => setSelectedBlockId(id);

    const handleSave = async () => {
         if (!title || !slug || !category || !level) {
             toast({ variant: "destructive", title: "Eksik Bilgi", description: "Lütfen Başlık, Kategori ve Seviye alanlarını doldurun." });
             return;
         }
         setSaving(true);
         const newNoteData: Omit<NoteData, 'id' | 'createdAt' | 'updatedAt'> = {
             title, slug, category, level, tags, summary,
             contentBlocks: blocks.length > 0 ? blocks : [createDefaultBlock()],
             imageUrl: imageUrl || null,
         };
         try {
             const newNote = await createNote(newNoteData);
             if (newNote) {
                 toast({ title: "Not Oluşturuldu", description: `"${newNote.title}" başlıklı not başarıyla oluşturuldu.` });
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

    const handleTemplateSelect = (templateBlocks: Block[]) => {
         const newBlocks = templateBlocks.map(block => ({ ...block, id: generateBlockId() }));
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

    const handlePreview = () => {
        if (typeof window === 'undefined') return;
        if (!category || !level) {
            toast({ variant: "destructive", title: "Önizleme Hatası", description: "Lütfen önizlemeden önce Kategori ve Seviye seçin." });
            return;
        }
        const previewData: Partial<NoteData> & { previewType: 'note' } = {
            previewType: 'note', id: 'preview_new_note', title: title || 'Başlıksız Not', slug: slug || generateSlug(title),
            category: category, level: level, tags: tags, summary: summary || '', contentBlocks: blocks,
            imageUrl: imageUrl || 'https://picsum.photos/seed/notepreview/800/400',
            createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
        };

        console.log(`[NewBiyolojiNotuPage/handlePreview] Preparing to save preview data with key: ${PREVIEW_STORAGE_KEY}`);
        console.log(`[NewBiyolojiNotuPage/handlePreview] Preview Data:`, previewData);

        try {
            localStorage.setItem(PREVIEW_STORAGE_KEY, JSON.stringify(previewData));
            console.log(`[NewBiyolojiNotuPage/handlePreview] Successfully called localStorage.setItem for key: ${PREVIEW_STORAGE_KEY}`);

            const storedData = localStorage.getItem(PREVIEW_STORAGE_KEY);
            if (!storedData) throw new Error("Verification failed: No data found in localStorage.");
            const parsed = JSON.parse(storedData);
            if (!parsed || parsed.previewType !== 'note') throw new Error("Verification failed: Invalid data structure.");
            console.log("[NewBiyolojiNotuPage/handlePreview] Verification SUCCESS");

            const previewUrl = `/admin/preview`; // Single, fixed preview URL
            console.log(`[NewBiyolojiNotuPage/handlePreview] Opening preview window: ${previewUrl}`);

            setTimeout(() => {
                const newWindow = window.open(previewUrl, '_blank');
                if (!newWindow) {
                    console.error("[NewBiyolojiNotuPage/handlePreview] Failed to open preview window. Pop-up blocker might be active.");
                    toast({ variant: "destructive", title: "Önizleme Açılamadı", description: "Pop-up engelleyiciyi kontrol edin.", duration: 10000 });
                } else {
                    console.log("[NewBiyolojiNotuPage/handlePreview] Preview window opened successfully.");
                }
            }, 150);

        } catch (error: any) {
            console.error("[NewBiyolojiNotuPage/handlePreview] Error during preview process:", error);
            toast({ variant: "destructive", title: "Önizleme Hatası", description: error.message, duration: 10000 });
        }
    };


    // --- AI Note Assistant Handlers ---
    const handleAiAssistantGenerateNote = async () => {
        if (!aiAssistantTopic.trim()) {
            setAiAssistantMessages(prev => [...prev, { id: Date.now().toString(), type: 'error', content: 'Lütfen bir konu girin.' }]);
            return;
        }
        if (!level) {
            setAiAssistantMessages(prev => [...prev, { id: Date.now().toString(), type: 'error', content: 'Lütfen not için bir seviye seçin (form alanından).' }]);
            return;
        }

        const currentFormData = {
            currentTitle: title,
            currentSummary: summary,
            currentTags: tags,
            currentCategory: category,
            currentLevel: level,
            currentBlocksStructure: blocks.map(b => ({ type: b.type, contentPreview: (b as any).content?.substring(0, 50) || `[${b.type} bloğu]` }) as GenerateNoteAiBlockStructure[])
        };

        const userInput: GenerateBiologyNoteSuggestionInput = {
            topic: aiAssistantTopic,
            level: level,
            keywords: aiAssistantKeywords,
            outline: aiAssistantOutline,
            currentFormData: currentFormData,
        };

        let userMessage = `Konu: ${aiAssistantTopic}`;
        if (aiAssistantKeywords) userMessage += `, Anahtar Kelimeler: ${aiAssistantKeywords}`;
        if (aiAssistantOutline) userMessage += `, Taslak: ${aiAssistantOutline}`;

        userMessage += `\n\nMevcut Form Alanları ve Not Yapısı (bunları dikkate alarak öneri ver):`;
        if (currentFormData.currentTitle) userMessage += `\n- Başlık: ${currentFormData.currentTitle}`;
        if (currentFormData.currentSummary) userMessage += `\n- Özet: ${currentFormData.currentSummary}`;
        if (currentFormData.currentTags && currentFormData.currentTags.length > 0) userMessage += `\n- Etiketler: ${currentFormData.currentTags.join(', ')}`;
        if (currentFormData.currentCategory) userMessage += `\n- Kategori: ${currentFormData.currentCategory}`;
        if (currentFormData.currentLevel) userMessage += `\n- Seviye: ${currentFormData.currentLevel}`;
        if (currentFormData.currentBlocksStructure && currentFormData.currentBlocksStructure.length > 0) {
            userMessage += `\n- Mevcut Bloklar (${currentFormData.currentBlocksStructure.length} adet):`;
            currentFormData.currentBlocksStructure.forEach((b, i) => {
                userMessage += `\n  - Blok ${i+1}: Tip: ${b.type}, İçerik Önizlemesi: ${b.contentPreview}`;
            });
        }

        setAiAssistantMessages(prev => [...prev, { id: Date.now().toString(), type: 'user', content: userMessage }]);
        setIsAiAssistantGenerating(true);

        try {
            const aiOutput: GenerateBiologyNoteSuggestionOutput = await generateBiologyNoteSuggestion(userInput);
            const aiResponseContent = (
                <div className="space-y-2 text-left">
                    {aiOutput.suggestedTitle && (
                        <div>
                            <strong className="block text-sm font-medium">Önerilen Başlık:</strong>
                            <p className="text-sm">{aiOutput.suggestedTitle}</p>
                        </div>
                    )}
                    {aiOutput.suggestedSummary && (
                        <div>
                            <strong className="block text-sm font-medium">Önerilen Özet:</strong>
                            <p className="text-sm whitespace-pre-wrap">{aiOutput.suggestedSummary}</p>
                        </div>
                    )}
                    {aiOutput.suggestedTags && aiOutput.suggestedTags.length > 0 && (
                        <div>
                            <strong className="block text-sm font-medium">Önerilen Etiketler:</strong>
                            <div className="flex flex-wrap gap-1 mt-1">
                                {aiOutput.suggestedTags.map(tag => (
                                    <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                                ))}
                            </div>
                        </div>
                    )}
                     {aiOutput.suggestedContentIdeas && (
                        <div>
                            <strong className="block text-sm font-medium">Önerilen İçerik Fikirleri/Taslak:</strong>
                            <div className="text-sm whitespace-pre-wrap prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: aiOutput.suggestedContentIdeas.replace(/\n/g, '<br />') }} />
                        </div>
                    )}
                </div>
            );
            setAiAssistantMessages(prev => [...prev, { id: Date.now().toString(), type: 'ai', content: aiResponseContent }]);
        } catch (error: any) {
            console.error("AI note suggestion error:", error);
            setAiAssistantMessages(prev => [...prev, { id: Date.now().toString(), type: 'error', content: `AI not önerisi oluştururken hata: ${error.message}` }]);
        } finally {
            setIsAiAssistantGenerating(false);
        }
    };

    // --- AI Biology Chat Handlers ---
    const handleAiChatSubmit = async () => {
        const userQuery = aiChatInput.trim();
        if (!userQuery) return;

        setAiChatMessages(prev => [...prev, { id: `user-${Date.now()}`, role: 'user', content: userQuery }]);
        setAiChatInput("");
        setIsAiChatResponding(true);

        try {
            // Filter out system_error messages before sending to AI history
            // and ensure the history objects match AiDirectChatMessageDef for the flow
            const historyForAI: AiDirectChatMessageDef[] = aiChatMessages
                .filter(m => m.role === 'user' || m.role === 'assistant') // Filter out system_error for the AI
                .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })); // Ensure correct role type


            const response: BiologyChatOutput = await biologyChat({ query: userQuery, history: historyForAI });

            setAiChatMessages(prev => [...prev, { id: `ai-${Date.now()}`, role: 'assistant', content: response.answer }]);
        } catch (error: any) {
            console.error("AI biology chat error:", error);
            setAiChatMessages(prev => [...prev, { id: `error-${Date.now()}`, role: 'system_error', content: `AI sohbet yanıtı alınırken hata oluştu: ${error.message}` }]);
        } finally {
            setIsAiChatResponding(false);
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
                     <Button variant="outline" size="sm" onClick={() => setIsAiChatPanelOpen(prev => !prev)} className={isAiChatPanelOpen ? "bg-blue-100 dark:bg-blue-900/30" : ""}>
                        <ChatIcon className="mr-2 h-4 w-4" /> AI Sohbet {isAiChatPanelOpen ? "(Kapat)" : "(Aç)"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setIsAiAssistantPanelOpen(prev => !prev)} className={isAiAssistantPanelOpen ? "bg-primary/10" : ""}>
                        <Sparkles className="mr-2 h-4 w-4" /> AI Öneri {isAiAssistantPanelOpen ? "(Kapat)" : "(Aç)"}
                    </Button>
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
                             <TabsTrigger value="template" onClick={() => setIsTemplateSelectorOpen(true)}>Şablon Seç</TabsTrigger>
                         </TabsList>
                         <TabsContent value="content" className="space-y-6">
                            <Card>
                                <CardHeader><CardTitle>Not Bilgileri</CardTitle></CardHeader>
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
                                                        <SelectItem value="loading_placeholder" disabled>Yükleniyor...</SelectItem>
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
                                        <p className="text-xs text-muted-foreground">Notun bulunabilirliğini artırmak için ilgili anahtar kelimeleri belirtin.</p>
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
                            <BlockEditor
                              blocks={blocks} onAddBlock={handleAddBlock} onDeleteBlock={handleDeleteBlock}
                              onUpdateBlock={handleUpdateBlock} onReorderBlocks={handleReorderBlocks}
                              selectedBlockId={selectedBlockId} onBlockSelect={handleBlockSelect}
                            />
                          </TabsContent>
                           <TabsContent value="template">
                               <p className="text-muted-foreground">Şablon seçmek için yukarıdaki "Şablon Seç" sekmesine tıklayın.</p>
                               {templateApplied && (
                                    <Button variant="outline" className="mt-4 text-destructive border-destructive/50 hover:bg-destructive/10" onClick={handleRemoveTemplate} disabled={saving}>
                                        <Layers className="mr-2 h-4 w-4" /> Şablonu Kaldır
                                    </Button>
                               )}
                           </TabsContent>
                     </Tabs>
                </div>

                {/* Right AI Assistant Panel (Collapsible) */}
                 {isAiAssistantPanelOpen && (
                    <aside className="w-96 border-l bg-card p-6 overflow-y-auto space-y-4 flex flex-col">
                        <CardHeader className="p-0 mb-2">
                             <CardTitle className="text-lg flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary"/> AI Not Öneri Yardımcısı</CardTitle>
                             <CardDescription className="text-xs">AI'dan not içeriği, başlık, özet ve etiketler için fikir ve öneri alın.</CardDescription>
                        </CardHeader>

                        <div className="space-y-3 flex-grow flex flex-col">
                            <ScrollArea className="flex-grow pr-3 -mr-3" ref={aiAssistantChatContainerRef}>
                                <div className="space-y-3 mb-3">
                                    {aiAssistantMessages.map(msg => (
                                        <div key={msg.id} className={`p-3 rounded-lg max-w-[95%] text-sm ${msg.type === 'user' ? 'bg-primary/10 self-end text-right ml-auto' : msg.type === 'ai' ? 'bg-secondary self-start mr-auto' : 'bg-destructive/10 text-destructive self-start mr-auto'}`}>
                                            {typeof msg.content === 'string' ? (
                                                <div className="whitespace-pre-wrap">{msg.content}</div>
                                            ) : (
                                                msg.content // Render ReactNode directly
                                            )}
                                        </div>
                                    ))}
                                    {isAiAssistantGenerating && (
                                        <div className="p-3 rounded-lg bg-secondary self-start flex items-center mr-auto">
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            <span className="text-sm">AI düşünüyor...</span>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>

                            <form onSubmit={(e) => { e.preventDefault(); handleAiAssistantGenerateNote(); }} className="mt-auto pt-3 border-t">
                                 <div className="space-y-2">
                                    <Label htmlFor="ai-assistant-topic">Konu Başlığı</Label>
                                    <Input id="ai-assistant-topic" value={aiAssistantTopic} onChange={(e) => setAiAssistantTopic(e.target.value)} placeholder="Örn: Fotosentez Aşamaları" />
                                </div>
                                <div className="space-y-2 mt-2">
                                    <Label htmlFor="ai-assistant-keywords">Anahtar Kelimeler (isteğe bağlı)</Label>
                                    <Input id="ai-assistant-keywords" value={aiAssistantKeywords} onChange={(e) => setAiAssistantKeywords(e.target.value)} placeholder="Örn: kloroplast, ATP, Calvin döngüsü" />
                                </div>
                                 <div className="space-y-2 mt-2">
                                    <Label htmlFor="ai-assistant-outline">İstenen Taslak/Bölümler (isteğe bağlı)</Label>
                                    <Textarea id="ai-assistant-outline" value={aiAssistantOutline} onChange={(e) => setAiAssistantOutline(e.target.value)} placeholder="Örn: Tanımı, Işığa bağlı reaksiyonlar, Işıktan bağımsız reaksiyonlar, Önemi" rows={2} />
                                </div>
                                 <p className="text-xs text-muted-foreground mt-2">
                                    AI, önerilerde bulunurken soldaki formdaki <strong>Başlık, Özet, Etiketler, Kategori ve Seviye</strong> alanlarını ve <strong>mevcut blok yapısını</strong> dikkate alacaktır.
                                </p>
                                <Button type="submit" className="w-full mt-3" disabled={isAiAssistantGenerating || !level}>
                                    {isAiAssistantGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MessageCircle className="mr-2 h-4 w-4" />}
                                    AI'dan Öneri Al
                                </Button>
                                {!level && <p className="text-xs text-destructive text-center mt-1">Öneri almak için lütfen formdaki "Seviye" alanını seçin.</p>}
                            </form>
                        </div>
                    </aside>
                )}

                 {/* Right AI Biology Chat Panel (Collapsible) */}
                 {isAiChatPanelOpen && (
                    <aside className="w-96 border-l bg-card p-6 overflow-y-auto space-y-4 flex flex-col">
                        <CardHeader className="p-0 mb-2">
                             <CardTitle className="text-lg flex items-center gap-2"><ChatIcon className="h-5 w-5 text-blue-600"/> AI Biyoloji Sohbet</CardTitle>
                             <CardDescription className="text-xs">Biyoloji uzmanı AI ile sohbet edin. AI, doğruluğu ön planda tutar ve emin olmadığı konularda bunu belirtir.</CardDescription>
                        </CardHeader>

                        <div className="space-y-3 flex-grow flex flex-col">
                            <ScrollArea className="flex-grow pr-3 -mr-3" ref={aiDirectChatContainerRef}>
                                <div className="space-y-3 mb-3">
                                    {aiChatMessages.map(msg => (
                                        <div key={msg.id} className={`p-3 rounded-lg max-w-[95%] text-sm ${msg.role === 'user' ? 'bg-primary/10 self-end text-right ml-auto' : msg.role === 'assistant' ? 'bg-secondary self-start mr-auto' : 'bg-destructive/10 text-destructive self-start mr-auto'}`}>
                                            <div className="whitespace-pre-wrap">{msg.content}</div>
                                        </div>
                                    ))}
                                    {isAiChatResponding && (
                                        <div className="p-3 rounded-lg bg-secondary self-start flex items-center mr-auto">
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            <span className="text-sm">AI yanıtlıyor...</span>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>

                            <form onSubmit={(e) => { e.preventDefault(); handleAiChatSubmit(); }} className="mt-auto pt-3 border-t flex gap-2 items-center">
                                 <Input
                                     id="ai-chat-input"
                                     value={aiChatInput}
                                     onChange={(e) => setAiChatInput(e.target.value)}
                                     placeholder="Biyoloji sorunuzu yazın..."
                                     className="flex-grow"
                                     disabled={isAiChatResponding}
                                 />
                                <Button type="submit" size="icon" disabled={isAiChatResponding || !aiChatInput.trim()}>
                                    <Send className="h-4 w-4" />
                                    <span className="sr-only">Gönder</span>
                                </Button>
                            </form>
                        </div>
                    </aside>
                )}
             </div>

              <TemplateSelector
                  isOpen={isTemplateSelectorOpen}
                  onClose={() => setIsTemplateSelectorOpen(false)}
                  onSelectTemplateBlocks={handleTemplateSelect}
                  blocksCurrentlyExist={blocks.length > 1 || (blocks.length === 1 && (blocks[0]?.type !== 'text' || blocks[0]?.content !== ''))}
                  templateTypeFilter="note"
              />
         </div>
    );
}

