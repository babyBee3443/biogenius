
"use client";

import * as React from "react";
import { notFound, useParams } from 'next/navigation';
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
  Trash2,
  History, // Keep for revisions potentially
  MessageSquare, // Keep for comments potentially
  GripVertical,
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
import Image from 'next/image'; // Keep for image previews
import { TemplateSelector } from "@/components/admin/template-selector"; // Keep for template tab

// Define Block Types (Must match NewArticlePage and TemplateSelector)
// TODO: Import from a shared types file
type Block =
  | { id: string; type: 'text'; content: string }
  | { id: string; type: 'heading'; level: number; content: string }
  | { id: string; type: 'image'; url: string; alt: string; caption?: string }
  | { id: string; type: 'gallery'; images: { url: string; alt: string }[] }
  | { id: string; type: 'video'; url: string }
  | { id: string; type: 'quote'; content: string; citation?: string }
  | { id: string; type: 'code'; language: string; content: string }
  | { id: string; type: 'divider' };


// --- Mock Data Fetching ---
// TODO: Replace with actual API calls and data structure
interface ArticleData {
  id: string;
  title: string;
  excerpt: string;
  // content: string; // Old content, might need migration or removal
  blocks: Block[]; // New block-based content
  category: string;
  status: string;
  mainImageUrl: string | null; // Corresponds to Ana Görsel URL
  seoTitle: string;
  seoDescription: string;
  slug: string;
  isFeatured: boolean;
  tags: string[];
  // Add other fields like author, createdAt, updatedAt etc.
}

// Mock Function
const getArticleById = async (id: string): Promise<ArticleData | null> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const articles: ArticleData[] = [
         {
            id: '1',
            title: 'Yapay Zeka Devrimi',
            excerpt: 'AI etkileri ve geleceği üzerine derinlemesine bir bakış.',
            blocks: [
                { id: 'b1', type: 'text', content: 'Yapay zeka (AI), makinelerin öğrenme, problem çözme ve karar verme gibi tipik olarak insan zekası gerektiren görevleri yerine getirme yeteneğidir.' },
                { id: 'b2', type: 'image', url: 'https://picsum.photos/seed/ai-edit/800/400', alt: 'Yapay Zeka Görseli', caption: 'AI teknolojileri gelişiyor.' },
                { id: 'b3', type: 'heading', level: 2, content: 'AI\'nın Etki Alanları' },
                { id: 'b4', type: 'text', content: 'Sağlık hizmetlerinde AI, hastalıkların daha erken teşhis edilmesine yardımcı olmaktadır...' }
            ],
            category: 'Teknoloji',
            status: 'Yayınlandı',
            mainImageUrl: 'https://picsum.photos/seed/ai/600/400',
            seoTitle: 'Yapay Zeka Devrimi | TeknoBiyo',
            seoDescription: 'AI etkileri ve geleceği üzerine derinlemesine bir bakış.',
            slug: 'yapay-zeka-devrimi',
            isFeatured: true,
            tags: ['ai', 'makine öğrenimi']
        },
        // Add other articles if needed
    ];
    return articles.find(article => article.id === id) || null;
};

// --- Block Editor Components (Copied from NewArticlePage for consistency) ---
// TODO: Extract block components into their own files/directory

interface BlockWrapperProps {
  blockId: string;
  blockType: string;
  blockNumber: number;
  children: React.ReactNode;
  onDelete: (id: string) => void;
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
      className="text-base"
    />
  </div>
);

interface HeadingBlockProps {
    block: Extract<Block, { type: 'heading' }>;
    onChange: (id: string, content: string, level?: number) => void;
}
const HeadingBlock: React.FC<HeadingBlockProps> = ({ block, onChange }) => (
    <div className="flex items-center gap-2">
        <Input
            value={block.content}
            onChange={(e) => onChange(block.id, e.target.value)}
            placeholder={`Başlık ${block.level} Metni...`}
            className={`text-${['xl', 'lg', 'md'][block.level - 2] || 'base'} font-semibold border-0 shadow-none focus-visible:ring-0 px-1`} // Dynamic size (approx)
        />
    </div>
);

const PlaceholderBlock: React.FC<{ type: string }> = ({ type }) => (
    <div className="text-muted-foreground italic">
        {type} block component will be here.
    </div>
);

// --- Main Page Component ---

export default function EditArticlePage() {
    const params = useParams();
    const articleId = params.id as string;

    // --- State ---
    const [articleData, setArticleData] = React.useState<ArticleData | null>(null);
    const [loading, setLoading] = React.useState(true);

    const [title, setTitle] = React.useState("");
    const [excerpt, setExcerpt] = React.useState("");
    const [category, setCategory] = React.useState("");
    const [mainImageUrl, setMainImageUrl] = React.useState("");
    const [isFeatured, setIsFeatured] = React.useState(false);
    const [status, setStatus] = React.useState("Taslak");
    const [blocks, setBlocks] = React.useState<Block[]>([]);
    const [seoTitle, setSeoTitle] = React.useState("");
    const [seoDescription, setSeoDescription] = React.useState("");
    const [slug, setSlug] = React.useState("");
    const [tags, setTags] = React.useState<string[]>([]);

    const [isTemplateSelectorOpen, setIsTemplateSelectorOpen] = React.useState(false);

    // --- Data Fetching ---
    React.useEffect(() => {
        if (articleId) {
            setLoading(true);
            getArticleById(articleId)
                .then(data => {
                    if (data) {
                        setArticleData(data);
                        // Initialize state from fetched data
                        setTitle(data.title);
                        setExcerpt(data.excerpt);
                        setCategory(data.category);
                        setStatus(data.status);
                        setMainImageUrl(data.mainImageUrl || "");
                        setIsFeatured(data.isFeatured);
                        setBlocks(data.blocks || []); // Initialize with fetched blocks
                        setSeoTitle(data.seoTitle);
                        setSeoDescription(data.seoDescription);
                        setSlug(data.slug);
                        setTags(data.tags || []);
                    } else {
                        notFound(); // Redirect to 404 if article not found
                    }
                })
                .catch(error => {
                    console.error("Error fetching article:", error);
                    toast({ variant: "destructive", title: "Hata", description: "Makale yüklenirken bir sorun oluştu." });
                })
                .finally(() => setLoading(false));
        }
    }, [articleId]);

     // --- Handlers ---
     const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-').replace(/-+/g, '-');
    };

     // Auto-update slug when title changes (optional)
    React.useEffect(() => {
        if (title && !slug) { // Only auto-update if slug is empty initially
            setSlug(generateSlug(title));
        }
    }, [title, slug]); // Depend on slug too


    const handleAddBlock = (type: Block['type']) => {
        const newBlock: Block = {
            id: `block-${Date.now()}-${Math.random().toString(36).substring(7)}`,
            type: type,
            ...(type === 'text' && { content: '' }),
            ...(type === 'heading' && { level: 2, content: '' }),
            ...(type === 'image' && { url: '', alt: '' }),
            ...(type === 'gallery' && { images: [] }),
            ...(type === 'video' && { url: '' }),
            ...(type === 'quote' && { content: '' }),
            ...(type === 'code' && { language: 'javascript', content: '' }),
            ...(type === 'divider' && {}),
        } as Block;
        setBlocks([...blocks, newBlock]);
    };

    const handleDeleteBlock = (id: string) => {
        setBlocks(blocks.filter(block => block.id !== id));
    };

     const handleContentChange = (id: string, content: string, level?: number) => {
        setBlocks(blocks.map(block => {
            if (block.id === id) {
                 if (block.type === 'text') return { ...block, content };
                 if (block.type === 'heading') return { ...block, content, level: level ?? block.level };
                 if (block.type === 'quote') return { ...block, content };
                 if (block.type === 'code') return { ...block, content };
                 // Add handlers for other types if needed (e.g., image URL, alt text)
             }
             return block;
         }));
     };

    const handleSave = (publish: boolean = false) => {
         const finalStatus = publish ? "Yayınlandı" : status;
         // TODO: Implement actual API call to update the article
         console.log("Updating article:", { articleId, title, excerpt, category, status: finalStatus, mainImageUrl, isFeatured, slug, tags: tags.join(','), blocks, seoTitle, seoDescription });

         toast({
             title: "Makale Güncellendi",
             description: `"${title}" başlıklı makale başarıyla güncellendi (${finalStatus}).`,
         });
    };

     const handleDelete = () => {
        if (window.confirm(`"${title}" başlıklı makaleyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`)) {
            console.log("Deleting article:", articleId);
            // TODO: Implement actual API call to delete the article
             toast({
                 variant: "destructive",
                 title: "Makale Silindi",
                 description: `"${title}" başlıklı makale silindi.`,
            });
            // TODO: Redirect to articles list page after deletion
             // router.push('/admin/articles');
        }
    };

     const handleTemplateSelect = (templateBlocks: Block[]) => {
         if (blocks.length > 0) {
            if (!window.confirm("Mevcut içerik bölümlerinin üzerine şablon uygulansın mı? Bu işlem geri alınamaz.")) {
                 setIsTemplateSelectorOpen(false);
                 return;
            }
        }
        setBlocks(templateBlocks);
        setIsTemplateSelectorOpen(false);
     };

     // --- Rendering ---

    if (loading) {
        // TODO: Replace with a proper Skeleton loader for the editor layout
        return <div className="flex justify-center items-center h-screen">Makale yükleniyor...</div>;
    }

    if (!articleData) {
         // Should be handled by notFound(), but as a fallback
         return <div className="text-center py-10">Makale bulunamadı.</div>;
    }


    return (
        <div className="flex flex-col h-full">
             {/* Top Bar */}
             <div className="flex items-center justify-between px-6 py-3 border-b bg-card sticky top-0 z-10">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/admin/articles"><ArrowLeft className="mr-2 h-4 w-4" /> Geri</Link>
                </Button>
                 <h1 className="text-xl font-semibold truncate" title={`Makaleyi Düzenle: ${articleData.title}`}>Makaleyi Düzenle</h1>
                 {/* Action Buttons */}
                <div className="flex items-center gap-2">
                     <Button variant="destructive" size="sm" onClick={handleDelete}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                    {/* Add other actions like Revision History here if needed */}
                    {/* <Button variant="outline" size="sm"><History className="mr-2 h-4 w-4"/> Revizyonlar</Button> */}
                </div>
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
                                     <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                                 </div>
                                 <div className="space-y-2">
                                     <Label htmlFor="category">Kategori</Label>
                                     <Select value={category} onValueChange={setCategory} required>
                                         <SelectTrigger id="category"><SelectValue /></SelectTrigger>
                                         <SelectContent>
                                             <SelectItem value="Teknoloji">Teknoloji</SelectItem>
                                             <SelectItem value="Biyoloji">Biyoloji</SelectItem>
                                         </SelectContent>
                                     </Select>
                                 </div>
                             </div>
                              <div className="space-y-2">
                                 <Label htmlFor="excerpt">Özet</Label>
                                 <Textarea id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3} />
                             </div>
                             <div className="space-y-2">
                                 <Label htmlFor="main-image-url">Ana Görsel URL</Label>
                                 <div className="flex gap-2">
                                      <Input id="main-image-url" value={mainImageUrl} onChange={(e) => setMainImageUrl(e.target.value)} />
                                      <Button variant="outline"><Upload className="mr-2 h-4 w-4"/> Yükle</Button>
                                 </div>
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

                          {/* Template Tab */}
                         <TabsContent value="template">
                             <p className="text-muted-foreground">Şablon seçmek için yukarıdaki "Şablon" sekmesine tıklayın.</p>
                         </TabsContent>

                         {/* Media Tab */}
                         <TabsContent value="media">
                              <Card>
                                  <CardHeader>
                                     <CardTitle>Medya Yönetimi</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                      <p className="text-muted-foreground">Medya kütüphanesi burada yer alacak.</p>
                                  </CardContent>
                              </Card>
                         </TabsContent>

                         {/* SEO Tab */}
                         <TabsContent value="seo">
                             <Card>
                                  <CardHeader>
                                     <CardTitle>SEO Ayarları</CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-4">
                                      <div className="space-y-2">
                                         <Label htmlFor="slug">URL Metni (Slug)</Label>
                                         <Input id="slug" value={slug} onChange={(e) => setSlug(generateSlug(e.target.value))} required />
                                     </div>
                                      <div className="space-y-2">
                                         <Label htmlFor="seo-title">SEO Başlığı</Label>
                                         <Input id="seo-title" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
                                     </div>
                                      <div className="space-y-2">
                                         <Label htmlFor="seo-description">Meta Açıklama</Label>
                                         <Textarea id="seo-description" value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} rows={2} maxLength={160} />
                                     </div>
                                  </CardContent>
                              </Card>
                         </TabsContent>
                     </Tabs>
                 </div>

                  {/* Right Sidebar */}
                  <aside className="w-72 border-l bg-card p-6 overflow-y-auto space-y-6 hidden lg:block">
                      <Card>
                         <CardHeader><CardTitle>Durum</CardTitle></CardHeader>
                         <CardContent className="space-y-4">
                              <div className="space-y-2">
                                 <Label htmlFor="status">Yayın Durumu</Label>
                                 <Select value={status} onValueChange={setStatus}>
                                     <SelectTrigger id="status"><SelectValue /></SelectTrigger>
                                     <SelectContent>
                                         <SelectItem value="Taslak">Taslak</SelectItem>
                                         <SelectItem value="İncelemede">İncelemede</SelectItem>
                                         <SelectItem value="Yayınlandı">Yayınlandı</SelectItem>
                                         <SelectItem value="Arşivlendi">Arşivlendi</SelectItem>
                                     </SelectContent>
                                 </Select>
                             </div>
                              <Separator />
                              <Button variant="outline" className="w-full justify-center"><Eye className="mr-2 h-4 w-4" /> Önizle</Button>
                              <Button className="w-full" onClick={() => handleSave(status === 'Yayınlandı')}>
                                <Save className="mr-2 h-4 w-4" />
                                {status === 'Yayınlandı' ? 'Güncelle' : 'Kaydet'}
                             </Button>
                             {status !== 'Yayınlandı' && (
                                 <Button className="w-full" onClick={() => handleSave(true)}>
                                     <Upload className="mr-2 h-4 w-4" /> Yayınla
                                 </Button>
                             )}
                         </CardContent>
                      </Card>

                       <Card>
                         <CardHeader><CardTitle>Etiketler</CardTitle></CardHeader>
                         <CardContent>
                             <Input
                                 id="tags"
                                 value={tags.join(', ')}
                                 onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag !== ''))}
                                 placeholder="Etiketleri virgülle ayırın"
                              />
                         </CardContent>
                      </Card>

                      {/* Placeholder for Comments - Keep if still relevant */}
                       <Card>
                          <CardHeader>
                             <CardTitle>Yorumlar</CardTitle>
                             <CardDescription>Bu makaleye yapılan yorumlar.</CardDescription>
                          </CardHeader>
                          <CardContent>
                              <p className="text-sm text-muted-foreground">Yorum yönetimi burada olacak.</p>
                              <Button variant="outline" size="sm" className="mt-4"><MessageSquare className="mr-2 h-4 w-4" /> Yorumları Yönet</Button>
                          </CardContent>
                       </Card>
                  </aside>
              </div>

              {/* Template Selector Modal */}
              <TemplateSelector
                  isOpen={isTemplateSelectorOpen}
                  onClose={() => setIsTemplateSelectorOpen(false)}
                  onSelectTemplateBlocks={handleTemplateSelect}
              />
         </div>
    );
}
