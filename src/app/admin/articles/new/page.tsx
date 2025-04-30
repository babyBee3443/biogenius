
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Save,
  Eye,
  Upload,
  GripVertical,
  Trash2,
  Bold,
  Italic,
  Underline,
  Link as LinkIcon,
  List,
  ListOrdered,
  Type,
  Heading2,
  Image as ImageIcon,
  GalleryHorizontal,
  Video,
  Quote,
  Code,
} from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Image from 'next/image'; // Used for image previews if needed
import { TemplateSelector, Block } from "@/components/admin/template-selector"; // Import Block type as well

// --- Block Editor Components ---

interface BlockWrapperProps {
  blockId: string;
  blockType: string;
  blockNumber: number;
  children: React.ReactNode;
  onDelete: (id: string) => void;
  // Add onMoveUp/Down later for basic reordering if needed
}

const BlockWrapper: React.FC<BlockWrapperProps> = ({ blockId, blockType, blockNumber, children, onDelete }) => {
  return (
    <div className="border border-border rounded-lg p-4 mb-4 relative group bg-card">
      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="icon" className="h-7 w-7 cursor-grab" aria-label="Blok Taşı">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => onDelete(blockId)} aria-label="Blok Sil">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <Label className="text-xs text-muted-foreground mb-2 block capitalize">{blockType} (Bölüm {blockNumber})</Label>
      {children}
    </div>
  );
};

// Example Text Block Component
interface TextBlockProps {
  block: Extract<Block, { type: 'text' }>;
  onChange: (id: string, content: string) => void;
}
const TextBlock: React.FC<TextBlockProps> = ({ block, onChange }) => (
  <div>
    <div className="flex items-center gap-1 mb-2 border-b pb-2">
      <Button variant="ghost" size="icon" className="h-7 w-7"><Bold className="h-4 w-4" /></Button>
      <Button variant="ghost" size="icon" className="h-7 w-7"><Italic className="h-4 w-4" /></Button>
      <Button variant="ghost" size="icon" className="h-7 w-7"><Underline className="h-4 w-4" /></Button>
      <Button variant="ghost" size="icon" className="h-7 w-7"><LinkIcon className="h-4 w-4" /></Button>
      <Separator orientation="vertical" className="h-6 mx-1" />
      <Button variant="ghost" size="icon" className="h-7 w-7"><List className="h-4 w-4" /></Button>
      <Button variant="ghost" size="icon" className="h-7 w-7"><ListOrdered className="h-4 w-4" /></Button>
    </div>
    <Textarea
      value={block.content}
      onChange={(e) => onChange(block.id, e.target.value)}
      placeholder="Metninizi girin..."
      rows={6}
      className="text-base" // Ensure readability
    />
  </div>
);

// Example Heading Block Component
interface HeadingBlockProps {
    block: Extract<Block, { type: 'heading' }>;
    onChange: (id: string, content: string, level?: number) => void;
}
const HeadingBlock: React.FC<HeadingBlockProps> = ({ block, onChange }) => (
    <div className="flex items-center gap-2">
         {/* Basic level selector - could be improved */}
         {/* <Select value={String(block.level)} onValueChange={(val) => onChange(block.id, block.content, parseInt(val))}>
            <SelectTrigger className="w-[60px]">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="2">H2</SelectItem>
                <SelectItem value="3">H3</SelectItem>
                <SelectItem value="4">H4</SelectItem>
            </SelectContent>
        </Select> */}
        <Input
            value={block.content}
            onChange={(e) => onChange(block.id, e.target.value)}
            placeholder={`Başlık ${block.level} Metni...`}
            className="text-xl font-semibold border-0 shadow-none focus-visible:ring-0 px-1" // Simplified styling
        />
    </div>
);

// Placeholder for other block types
const PlaceholderBlock: React.FC<{ type: string }> = ({ type }) => (
    <div className="text-muted-foreground italic">
        {type} block component will be here.
    </div>
);

// --- Main Page Component ---

export default function NewArticlePage() {
    // --- State ---
    const [title, setTitle] = React.useState("");
    const [excerpt, setExcerpt] = React.useState("");
    const [category, setCategory] = React.useState<"Teknoloji" | "Biyoloji" | "">("");
    const [mainImageUrl, setMainImageUrl] = React.useState("");
    const [isFeatured, setIsFeatured] = React.useState(false);
    const [status, setStatus] = React.useState("Taslak");

    // Block Editor State
    const [blocks, setBlocks] = React.useState<Block[]>([
        // Initial block for example
        { id: `block-${Date.now()}`, type: 'text', content: '' },
    ]);

    // Other States
    const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = React.useState(false);
    const [seoTitle, setSeoTitle] = React.useState("");
    const [seoDescription, setSeoDescription] = React.useState("");
    const [slug, setSlug] = React.useState("");
    const [tags, setTags] = React.useState<string[]>([]);
    // TODO: Add state for Media Tab content, SEO Tab content

    // --- Handlers ---

    // Basic slug generation
    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-').replace(/-+/g, '-');
    };

     // Auto-generate slug from title
     React.useEffect(() => {
         if (title) {
             setSlug(generateSlug(title));
         }
     }, [title]);


    const handleAddBlock = (type: Block['type']) => {
        const newBlock: Block = {
            id: `block-${Date.now()}-${Math.random().toString(36).substring(7)}`, // More unique ID
            type: type,
            // Default content based on type
            ...(type === 'text' && { content: '' }),
            ...(type === 'heading' && { level: 2, content: '' }),
            ...(type === 'image' && { url: '', alt: '' }),
            ...(type === 'gallery' && { images: [] }),
            ...(type === 'video' && { url: '' }),
            ...(type === 'quote' && { content: '' }),
            ...(type === 'code' && { language: 'javascript', content: '' }),
             ...(type === 'divider' && {}),
        } as Block; // Added type assertion
        setBlocks([...blocks, newBlock]);
    };

    const handleDeleteBlock = (id: string) => {
        setBlocks(blocks.filter(block => block.id !== id));
    };

    const handleUpdateBlock = (id: string, newContent: Partial<Block>) => {
       setBlocks(blocks.map(block => block.id === id ? { ...block, ...newContent } : block));
    };

     // Specific handler for simple content changes (text, heading)
     const handleContentChange = (id: string, content: string, level?: number) => {
        setBlocks(blocks.map(block => {
            if (block.id === id) {
                 if (block.type === 'text') return { ...block, content };
                 if (block.type === 'heading') return { ...block, content, level: level ?? block.level };
                 if (block.type === 'quote') return { ...block, content };
                 if (block.type === 'code') return { ...block, content };
             }
             return block;
         }));
     };

    const handleSave = (publish: boolean = false) => {
         const finalStatus = publish ? "Yayınlandı" : status;
         // TODO: Implement actual API call to save the article
         const blocksToSave = blocks; // Process blocks if needed
         console.log("Saving article:", { title, excerpt, category, status: finalStatus, mainImageUrl, isFeatured, slug, tags: tags.join(','), blocks: blocksToSave, seoTitle, seoDescription });
         toast({
             title: publish ? "Makale Yayınlandı" : "Makale Kaydedildi",
             description: `"${title}" başlıklı makale başarıyla ${publish ? 'yayınlandı' : 'kaydedildi (' + finalStatus + ')'}.`,
         });
         // Redirect or clear form based on action
    };

     // Handler for template selection (assuming template gives blocks)
     const handleTemplateSelect = (templateBlocks: Block[]) => {
        // Ask for confirmation before overwriting existing content
        if (blocks.length > 1 || (blocks.length === 1 && blocks[0].content !== '')) {
            if (!window.confirm("Mevcut içerik bölümlerinin üzerine şablon uygulansın mı? Bu işlem geri alınamaz.")) {
                 setIsTemplateSelectorOpen(false); // Close selector if cancelled
                 return;
            }
        }
        // Ensure new unique IDs for blocks from the template
        const newBlocks = templateBlocks.map(block => ({
            ...block,
            id: `block-${Date.now()}-${Math.random().toString(36).substring(7)}`
        }));
        setBlocks(newBlocks); // Update blocks state with template
        setIsTemplateSelectorOpen(false); // Close the selector
     };

      const handlePreview = () => {
         const previewData = {
             id: 'preview', // Use a temporary ID
             title,
             description: excerpt, // Use excerpt as description for preview
             category: category || 'Teknoloji', // Default category if not set
             imageUrl: mainImageUrl || 'https://picsum.photos/seed/preview/1200/600', // Placeholder if no image
             blocks, // Pass the current blocks
         };
         try {
             localStorage.setItem('articlePreviewData', JSON.stringify(previewData));
             window.open('/admin/preview', '_blank'); // Open preview in a new tab
         } catch (error) {
             console.error("Error saving preview data to localStorage:", error);
             toast({
                 variant: "destructive",
                 title: "Önizleme Hatası",
                 description: "Önizleme verisi kaydedilemedi. Tarayıcı depolama alanı dolu olabilir.",
             });
         }
     };


     // TODO: Add handlers for media upload, SEO fields, etc.


    return (
        <div className="flex flex-col h-full">
            {/* Top Bar */}
             <div className="flex items-center justify-between px-6 py-3 border-b bg-card sticky top-0 z-10">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/admin/articles"><ArrowLeft className="mr-2 h-4 w-4" /> Geri</Link>
                </Button>
                <h1 className="text-xl font-semibold">Yeni Makale Oluştur</h1>
                {/* Placeholder for potential actions or user info */}
                <div className="w-20"></div> {/* Spacer */}
            </div>

            {/* Main Content Area */}
             <div className="flex flex-1 overflow-hidden">
                {/* Left Content Area (Tabs & Editor) */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <Tabs defaultValue="content">
                        <TabsList className="mb-6">
                            <TabsTrigger value="content">İçerik</TabsTrigger>
                            <TabsTrigger value="template" onClick={() => setIsTemplateSelectorOpen(true)}>Şablon</TabsTrigger>
                            <TabsTrigger value="media">Medya</TabsTrigger>
                            <TabsTrigger value="seo">SEO</TabsTrigger>
                        </TabsList>

                        {/* Content Tab */}
                        <TabsContent value="content" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Makale Başlığı</Label>
                                    <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Makalenizin başlığını girin" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category">Kategori</Label>
                                    <Select value={category} onValueChange={(value) => setCategory(value as "Teknoloji" | "Biyoloji")} required>
                                        <SelectTrigger id="category">
                                            <SelectValue placeholder="Kategori seçin" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Teknoloji">Teknoloji</SelectItem>
                                            <SelectItem value="Biyoloji">Biyoloji</SelectItem>
                                            {/* Add more categories fetched dynamically */}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="excerpt">Özet</Label>
                                <Textarea id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Makalenizin kısa bir özetini girin" rows={3} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="main-image-url">Ana Görsel URL</Label>
                                <div className="flex gap-2">
                                     <Input id="main-image-url" value={mainImageUrl} onChange={(e) => setMainImageUrl(e.target.value)} placeholder="Ana görsel URL'si (isteğe bağlı)" />
                                     <Button variant="outline"><Upload className="mr-2 h-4 w-4"/> Yükle</Button> {/* TODO: Implement upload */}
                                </div>
                                {mainImageUrl && (
                                    <div className="mt-2 rounded border p-2">
                                        <Image src={mainImageUrl} alt="Ana Görsel Önizleme" width={200} height={100} className="object-cover rounded"/>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center space-x-2 pt-2">
                                <Switch id="featured-article" checked={isFeatured} onCheckedChange={setIsFeatured} />
                                <Label htmlFor="featured-article">Öne Çıkarılmış Makale</Label>
                            </div>

                             <Separator className="my-8" />

                             {/* Block Editor Section */}
                             <div>
                                 <h2 className="text-lg font-semibold mb-1">Makale Bölümleri</h2>
                                 <p className="text-sm text-muted-foreground mb-4">İçeriğinizi düzenlemek için bölümler ekleyin ve sürükleyerek sıralayın.</p>

                                 <div className="space-y-4">
                                     {blocks.map((block, index) => (
                                         <BlockWrapper key={block.id} blockId={block.id} blockType={block.type} blockNumber={index + 1} onDelete={handleDeleteBlock}>
                                            {block.type === 'text' && <TextBlock block={block} onChange={handleContentChange} />}
                                            {block.type === 'heading' && <HeadingBlock block={block} onChange={handleContentChange} />}
                                            {/* Render other block types here */}
                                             {(block.type === 'image' || block.type === 'gallery' || block.type === 'video' || block.type === 'quote' || block.type === 'code' || block.type === 'divider') && (
                                                 <PlaceholderBlock type={block.type} /> // Replace with actual components
                                             )}
                                         </BlockWrapper>
                                     ))}
                                 </div>

                                  {/* Add Block Buttons */}
                                  <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                                     <Button variant="outline" size="sm" onClick={() => handleAddBlock('text')}><Type className="mr-2 h-4 w-4"/> Metin Ekle</Button>
                                     <Button variant="outline" size="sm" onClick={() => handleAddBlock('heading')}><Heading2 className="mr-2 h-4 w-4"/> Başlık Ekle</Button>
                                     <Button variant="outline" size="sm" onClick={() => handleAddBlock('image')}><ImageIcon className="mr-2 h-4 w-4"/> Görsel Ekle</Button>
                                     <Button variant="outline" size="sm" onClick={() => handleAddBlock('gallery')}><GalleryHorizontal className="mr-2 h-4 w-4"/> Galeri Ekle</Button>
                                     <Button variant="outline" size="sm" onClick={() => handleAddBlock('video')}><Video className="mr-2 h-4 w-4"/> Video Ekle</Button>
                                     <Button variant="outline" size="sm" onClick={() => handleAddBlock('quote')}><Quote className="mr-2 h-4 w-4"/> Alıntı Ekle</Button>
                                     <Button variant="outline" size="sm" onClick={() => handleAddBlock('code')}><Code className="mr-2 h-4 w-4"/> Kod Ekle</Button>
                                     <Button variant="outline" size="sm" onClick={() => handleAddBlock('divider')}>Ayırıcı Ekle</Button>
                                  </div>
                             </div>

                        </TabsContent>

                         {/* Template Tab (Content is handled by Modal) */}
                         <TabsContent value="template">
                             <p className="text-muted-foreground">Şablon seçmek için yukarıdaki "Şablon" sekmesine tıklayın.</p>
                        </TabsContent>

                        {/* Media Tab */}
                        <TabsContent value="media">
                             <Card>
                                 <CardHeader>
                                    <CardTitle>Medya Yönetimi</CardTitle>
                                    <CardDescription>Mevcut medyaları yönetin veya yenilerini yükleyin.</CardDescription>
                                 </CardHeader>
                                 <CardContent>
                                     {/* TODO: Implement Media Library Component */}
                                     <p className="text-muted-foreground">Medya kütüphanesi burada yer alacak.</p>
                                     <Button className="mt-4"><Upload className="mr-2 h-4 w-4"/> Medya Yükle</Button>
                                 </CardContent>
                             </Card>
                        </TabsContent>

                        {/* SEO Tab */}
                        <TabsContent value="seo">
                            <Card>
                                 <CardHeader>
                                    <CardTitle>SEO Ayarları</CardTitle>
                                    <CardDescription>Arama motorları için makale görünürlüğünü optimize edin.</CardDescription>
                                 </CardHeader>
                                 <CardContent className="space-y-4">
                                     <div className="space-y-2">
                                        <Label htmlFor="slug">URL Metni (Slug)</Label>
                                        <Input id="slug" value={slug} onChange={(e) => setSlug(generateSlug(e.target.value))} placeholder="makale-basligi-url" required />
                                         <p className="text-xs text-muted-foreground">Makalenin URL'si. Genellikle otomatik oluşturulur, ancak düzenleyebilirsiniz.</p>
                                    </div>
                                     <div className="space-y-2">
                                        <Label htmlFor="seo-title">SEO Başlığı</Label>
                                        <Input id="seo-title" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder="Arama sonuçlarında görünecek başlık (isteğe bağlı)" />
                                    </div>
                                     <div className="space-y-2">
                                        <Label htmlFor="seo-description">Meta Açıklama</Label>
                                        <Textarea id="seo-description" value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} placeholder="Arama sonuçlarında görünecek kısa açıklama (150-160 karakter önerilir)" rows={2} maxLength={160} />
                                    </div>
                                    {/* TODO: Add Keyword input, Schema options, etc. */}
                                 </CardContent>
                             </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                 {/* Right Sidebar (Actions & Status) */}
                 <aside className="w-72 border-l bg-card p-6 overflow-y-auto space-y-6 hidden lg:block"> {/* Hide on smaller screens for simplicity for now */}
                     <Card>
                        <CardHeader>
                           <CardTitle>Durum</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="space-y-2">
                                <Label htmlFor="status">Yayın Durumu</Label>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger id="status">
                                        <SelectValue placeholder="Durum seçin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Taslak">Taslak</SelectItem>
                                        <SelectItem value="İncelemede">İncelemede</SelectItem>
                                        <SelectItem value="Yayınlandı">Yayınlandı</SelectItem>
                                        <SelectItem value="Arşivlendi">Arşivlendi</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {/* Optional: Add visibility, publish date */}
                             <Separator />
                              <Button variant="outline" className="w-full justify-center" onClick={handlePreview}>
                                 <Eye className="mr-2 h-4 w-4" /> Önizle
                             </Button>
                             <Button className="w-full" onClick={() => handleSave(status === 'Yayınlandı')}>
                                <Save className="mr-2 h-4 w-4" /> Kaydet
                            </Button>
                            {/* Conditionally show Publish button */}
                             {status !== 'Yayınlandı' && (
                                 <Button className="w-full" variant="default" onClick={() => handleSave(true)}>
                                     <Upload className="mr-2 h-4 w-4" /> Yayınla
                                 </Button>
                             )}
                        </CardContent>
                     </Card>

                      <Card>
                        <CardHeader>
                           <CardTitle>Etiketler</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Input
                                id="tags"
                                value={tags.join(', ')}
                                onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag !== ''))}
                                placeholder="Etiketleri virgülle ayırın"
                             />
                        </CardContent>
                     </Card>

                     {/* Add more sidebar cards if needed: Revisions, etc. */}
                 </aside>
             </div>

             {/* Template Selector Modal */}
             <TemplateSelector
                 isOpen={isTemplateSelectorOpen}
                 onClose={() => setIsTemplateSelectorOpen(false)}
                 onSelectTemplateBlocks={handleTemplateSelect} // Use the new prop
             />
        </div>
    );
}

