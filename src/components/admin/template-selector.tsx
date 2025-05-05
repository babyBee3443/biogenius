
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
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image"; // Using next/image for placeholders
import { Eye } from 'lucide-react'; // Import Eye icon for preview
import { toast } from "@/hooks/use-toast"; // Import toast for error feedback

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

// Define Template Structure
interface Template {
  id: string;
  name: string;
  description: string;
  previewImageUrl: string; // URL for the small preview image in the selector dialog
  blocks: Block[]; // Content as an array of blocks, including placeholder images for the actual article content
}

interface TemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  /** @deprecated Use onSelectTemplateBlocks instead */
  onSelectTemplate?: (content: string) => void; // Keep for potential backward compatibility, but prefer blocks
  onSelectTemplateBlocks: (blocks: Block[]) => void; // New prop for passing blocks directly
}


// --- Mock Templates (Using Block Structure) ---
// Note: The images defined within the 'blocks' array below use picsum.photos URLs.
// These are placeholder images that will be part of the template content when selected.
// They will appear in the editor and subsequently in the preview if the template is applied.
const generateId = () => `block-${Date.now()}-${Math.random().toString(36).substring(7)}`;

const templates: Template[] = [
  {
    id: 'standard-article',
    name: 'Standart Makale',
    description: 'Başlık, ana görsel ve metin içeriği için temel düzen.',
    previewImageUrl: 'https://picsum.photos/seed/template1/300/200', // Preview image for selector dialog
    blocks: [
      { id: generateId(), type: 'heading', level: 1, content: 'Makale Başlığı' },
      { id: generateId(), type: 'text', content: 'Özetleyici bir giriş paragrafı buraya ekleyin...' },
      { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/articleimg1/800/400', alt: 'Ana Görsel', caption: 'Görsel alt yazı (isteğe bağlı)' }, // Placeholder content image
      { id: generateId(), type: 'text', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' },
      { id: generateId(), type: 'heading', level: 2, content: 'Alt Başlık 1' },
      { id: generateId(), type: 'text', content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
      { id: generateId(), type: 'heading', level: 2, content: 'Alt Başlık 2' },
       { id: generateId(), type: 'video', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', youtubeId: 'dQw4w9WgXcQ' }, // Added example video block
      { id: generateId(), type: 'text', content: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.' },
      { id: generateId(), type: 'quote', content: 'Bu alana önemli bir alıntı veya vurgu ekleyebilirsiniz.', citation: 'Kaynak (isteğe bağlı)' },
      { id: generateId(), type: 'text', content: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.' },
    ]
  },
   {
    id: 'listicle',
    name: 'Listeleme Makalesi',
    description: 'Numaralı veya madde işaretli listeler içeren makaleler için uygundur.',
    previewImageUrl: 'https://picsum.photos/seed/template2/300/200', // Preview image for selector dialog
    blocks: [
        { id: generateId(), type: 'heading', level: 1, content: 'Harika [X] Şey Listesi' },
        { id: generateId(), type: 'text', content: 'Bu makalede, [konu] hakkında bilmeniz gereken en önemli [X] şeyi listeliyoruz. Giriş paragrafı buraya gelecek.' },
        { id: generateId(), type: 'heading', level: 2, content: '1. Birinci Madde Başlığı' },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/list1/600/300', alt: 'Madde 1 Görseli' }, // Placeholder content image
        { id: generateId(), type: 'text', content: 'Birinci maddenin açıklaması. Neden önemli olduğunu veya nasıl çalıştığını açıklayın.' },
        { id: generateId(), type: 'heading', level: 2, content: '2. İkinci Madde Başlığı' },
        { id: generateId(), type: 'text', content: 'İkinci maddenin detayları burada yer alacak. Örnekler veya ek bilgiler ekleyebilirsiniz.' },
        { id: generateId(), type: 'heading', level: 2, content: '3. Üçüncü Madde Başlığı' },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/list3/600/300', alt: 'Madde 3 Görseli' }, // Placeholder content image
        { id: generateId(), type: 'text', content: 'Üçüncü maddeye ilişkin açıklamalar ve önemli noktalar.' },
        { id: generateId(), type: 'text', content: '...' },
        { id: generateId(), type: 'heading', level: 2, content: '[X]. Son Madde Başlığı' },
        { id: generateId(), type: 'text', content: 'Listenin son maddesi ve açıklaması.' },
        { id: generateId(), type: 'text', content: 'Makalenin ana fikrini özetleyen veya okuyucuya bir sonraki adımı öneren bir sonuç paragrafı ekleyin.'},
    ]
  },
  {
    id: 'image-gallery',
    name: 'Görsel Galerisi',
    description: 'Görsellerin ön planda olduğu, açıklamalı galeri düzeni.',
    previewImageUrl: 'https://picsum.photos/seed/template3/300/200', // Preview image for selector dialog
    blocks: [
        { id: generateId(), type: 'heading', level: 1, content: '[Konu] Görsel Galerisi' },
        { id: generateId(), type: 'text', content: 'Bu galeride [konu] ile ilgili etkileyici görselleri bir araya getirdik. Galeri hakkında kısa bir açıklama.' },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/gallery1/800/500', alt: 'Görsel 1', caption: 'Görsel 1: Kısa ve açıklayıcı bir başlık. Bu görselin ne hakkında olduğunu veya neyi gösterdiğini anlatan birkaç cümle.' }, // Placeholder content image
        { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/gallery2/800/500', alt: 'Görsel 2', caption: 'Görsel 2: Başka bir açıklayıcı başlık. Görselle ilgili ilginç detaylar veya bağlam bilgisi.' }, // Placeholder content image
        { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/gallery3/800/500', alt: 'Görsel 3', caption: 'Görsel 3: Üçüncü görsel için başlık ve açıklama.' }, // Placeholder content image
        { id: generateId(), type: 'text', content: 'Galeriyi sonlandıran veya ek bilgi veren bir paragraf.' },
    ]
  },
  {
    id: 'faq-article',
    name: 'SSS Makalesi',
    description: 'Sıkça sorulan sorular ve cevapları formatında bir düzen.',
    previewImageUrl: 'https://picsum.photos/seed/template4/300/200', // Preview image for selector dialog
    blocks: [
        { id: generateId(), type: 'heading', level: 1, content: '[Konu] Hakkında Sıkça Sorulan Sorular (SSS)' },
        { id: generateId(), type: 'text', content: '[Konu] ile ilgili merak edilen yaygın soruları ve cevaplarını bu makalede bulabilirsiniz.' },
        { id: generateId(), type: 'heading', level: 2, content: 'Soru 1: [İlk Soru Buraya]?' },
        { id: generateId(), type: 'text', content: 'Cevap: İlk sorunun detaylı cevabı buraya gelecek. Açıklayıcı ve net olun.'},
        { id: generateId(), type: 'heading', level: 2, content: 'Soru 2: [İkinci Soru Buraya]?' },
        { id: generateId(), type: 'text', content: 'Cevap: İkinci sorunun yanıtı. Gerekirse alt maddeler veya listeler kullanabilirsiniz.\n- Alt madde 1\n- Alt madde 2' }, // Simple list within text
        { id: generateId(), type: 'heading', level: 2, content: 'Soru 3: [Üçüncü Soru Buraya]?' },
        { id: generateId(), type: 'text', content: 'Cevap: Üçüncü sorunun cevabı. İlgili kaynaklara bağlantılar verebilirsiniz.'},
        { id: generateId(), type: 'heading', level: 2, content: 'Soru 4: [Dördüncü Soru Buraya]?' },
        { id: generateId(), type: 'text', content: 'Cevap: Dördüncü soruya verilen yanıt.'},
        { id: generateId(), type: 'text', content: 'Daha fazla sorunuz varsa, bizimle iletişime geçmekten çekinmeyin.' },
    ]
  },
  {
    id: 'how-to-guide',
    name: 'Nasıl Yapılır Rehberi',
    description: 'Adım adım talimatlar içeren öğretici makaleler için.',
    previewImageUrl: 'https://picsum.photos/seed/template5/300/200', // Preview image for selector dialog
    blocks: [
        { id: generateId(), type: 'heading', level: 1, content: '[Görev] Nasıl Yapılır: Adım Adım Rehber' },
        { id: generateId(), type: 'text', content: 'Bu rehber, [görev] işlemini nasıl kolayca gerçekleştirebileceğinizi adım adım gösterecektir.' },
        { id: generateId(), type: 'heading', level: 2, content: 'Gereksinimler' },
        { id: generateId(), type: 'text', content: '- Gerekli malzeme veya araç 1\n- Gerekli malzeme veya araç 2\n- Önceden yapılması gerekenler (varsa)' }, // List as text
        { id: generateId(), type: 'heading', level: 2, content: 'Adım 1: [İlk Adım Başlığı]' },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/step1/600/350', alt: 'Adım 1 Görseli' }, // Placeholder content image
        { id: generateId(), type: 'text', content: 'İlk adımın detaylı açıklaması. Ne yapmanız gerektiğini net bir şekilde belirtin.' },
        { id: generateId(), type: 'heading', level: 2, content: 'Adım 2: [İkinci Adım Başlığı]' },
        { id: generateId(), type: 'text', content: 'İkinci adımın açıklaması. İpuçları veya dikkat edilmesi gereken noktaları ekleyin.' },
        { id: generateId(), type: 'heading', level: 2, content: 'Adım 3: [Üçüncü Adım Başlığı]' },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/step3/600/350', alt: 'Adım 3 Görseli' }, // Placeholder content image
        { id: generateId(), type: 'text', content: 'Üçüncü adımın detayları.' },
        { id: generateId(), type: 'text', content: '...' },
        { id: generateId(), type: 'heading', level: 2, content: 'Adım [X]: [Son Adım Başlığı]' },
        { id: generateId(), type: 'text', content: 'Son adımın açıklaması ve işlemin tamamlanması.' },
        { id: generateId(), type: 'heading', level: 2, content: 'Sonuç ve İpuçları' },
        { id: generateId(), type: 'text', content: 'İşlemi başarıyla tamamladınız! Ekstra ipuçları veya sorun giderme bilgileri buraya eklenebilir.' },
    ]
  },
   {
    id: 'interview-article',
    name: 'Röportaj Makalesi',
    description: 'Bir kişiyle yapılan röportajı soru-cevap formatında sunar.',
    previewImageUrl: 'https://picsum.photos/seed/template6/300/200', // Preview image for selector dialog
    blocks: [
        { id: generateId(), type: 'heading', level: 1, content: '[Kişi Adı] ile Özel Röportaj: [Röportaj Konusu]' },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/interviewee/300/300', alt: '[Kişi Adı]' }, // Placeholder content image (profile picture)
        { id: generateId(), type: 'text', content: '[Kişi Adı], [Kişinin Unvanı/Alanı], [konu] hakkındaki görüşlerini ve deneyimlerini paylaştı. Giriş paragrafı...' },
        { id: generateId(), type: 'heading', level: 2, content: 'Giriş ve Bağlam' },
        { id: generateId(), type: 'text', content: 'Röportajın neden yapıldığı veya kişinin uzmanlığı hakkında kısa bir bilgi verin.' },
        { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'text', content: '**Soru:** İlk soru buraya yazılacak?' },
        { id: generateId(), type: 'text', content: '**Cevap:** İlk sorunun cevabı. Kişinin kendi ifadeleriyle...' },
        { id: generateId(), type: 'text', content: '**Soru:** İkinci soru...?' },
        { id: generateId(), type: 'text', content: '**Cevap:** İkinci sorunun cevabı...' },
        { id: generateId(), type: 'text', content: '**Soru:** Üçüncü soru...?' },
        { id: generateId(), type: 'text', content: '**Cevap:** Üçüncü sorunun cevabı...' },
        { id: generateId(), type: 'quote', content: "[Kişi Adı]'nın röportajdan çarpıcı bir sözü veya alıntısı." },
        { id: generateId(), type: 'text', content: '**Soru:** Son soru...?' },
        { id: generateId(), type: 'text', content: '**Cevap:** Son sorunun cevabı...' },
        { id: generateId(), type: 'heading', level: 2, content: 'Sonuç' },
        { id: generateId(), type: 'text', content: 'Röportajın ana çıkarımlarını özetleyen veya okuyucuya teşekkür eden bir kapanış paragrafı.' },
    ]
  },
];

// --- Helper Functions ---

// Function to convert block structure to HTML (basic implementation for backward compatibility)
const blocksToHtml = (blocks: Block[]): string => {
    let html = '';
    blocks.forEach(block => {
        switch (block.type) {
            case 'heading':
                html += `<h${block.level}>${block.content}</h${block.level}>\n`;
                break;
            case 'text':
                // Basic markdown-like handling for bold/italic if needed, or rely on editor
                const processedContent = block.content
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Basic bold
                    .replace(/\*(.*?)\*/g, '<em>$1</em>'); // Basic italic
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
                 // Use youtubeId if available, otherwise try to extract from URL
                 const videoId = block.youtubeId || block.url.split('v=')[1]?.split('&')[0] || block.url.split('/').pop();
                 if (videoId && videoId.length === 11) { // Basic check for YouTube ID length
                     html += `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>\n`;
                 } else if (block.url) {
                     html += `<p><a href="${block.url}" target="_blank" rel="noopener noreferrer">Video izle: ${block.url}</a></p>\n`; // Fallback link
                 }
                 break;
             case 'section':
                 // Sections might not have a direct HTML representation here,
                 // or you could add a placeholder comment.
                 html += `<!-- Section: ${block.sectionType} -->\n`;
                 break;
        }
    });
    return html;
};


export function TemplateSelector({ isOpen, onClose, onSelectTemplate, onSelectTemplateBlocks }: TemplateSelectorProps) {

    const handleSelect = (blocks: Block[]) => {
        // Call the new prop with the blocks array
        onSelectTemplateBlocks(blocks);

        // Call the old prop with converted HTML if it exists
        if (onSelectTemplate) {
             console.warn("TemplateSelector: onSelectTemplate is deprecated. Use onSelectTemplateBlocks instead.");
             const htmlContent = blocksToHtml(blocks);
             onSelectTemplate(htmlContent);
        }

        onClose(); // Close the dialog after selection
    };

     // Handle template preview
     const handlePreview = (template: Template) => {
         const previewData = {
             id: `template-preview-${template.id}`,
             title: `${template.name} Şablon Önizlemesi`,
             description: template.description,
             category: 'Teknoloji', // Default category for preview, can be adjusted
             imageUrl: template.previewImageUrl, // Use template preview for main image
             blocks: template.blocks,
         };
         try {
             localStorage.setItem('articlePreviewData', JSON.stringify(previewData));
             window.open('/admin/preview', '_blank');
         } catch (error) {
             console.error("Error saving template preview data:", error);
             toast({
                 variant: "destructive",
                 title: "Önizleme Hatası",
                 description: "Şablon önizleme verisi kaydedilemedi.",
             });
         }
     };


  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}> {/* Ensure close on background click */}
      <DialogContent className="sm:max-w-[60%] lg:max-w-[70%] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Makale Şablonu Seç</DialogTitle>
          <DialogDescription>
            İçeriğinizi oluşturmaya başlamak için hazır bir şablon seçin. Şablon içeriği mevcut içeriğinizin üzerine yazılabilir (onayınızla).
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-grow pr-4 -mr-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4">
                {templates.map((template) => (
                    <Card key={template.id} className="flex flex-col overflow-hidden group border hover:shadow-lg transition-shadow">
                        <CardHeader className="p-0 relative h-32 overflow-hidden cursor-pointer" onClick={() => handleSelect(template.blocks)}> {/* Make header clickable */}
                             <Image
                                src={template.previewImageUrl} // This is the small image shown in the dialog
                                alt={`${template.name} önizlemesi`}
                                width={300}
                                height={200}
                                className="w-full h-full object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105"
                                data-ai-hint="template preview abstract design"
                             />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div> {/* Gradient overlay */}
                              <CardTitle className="absolute bottom-2 left-3 text-sm font-semibold text-white p-1 bg-black/50 rounded text-shadow-sm">{template.name}</CardTitle> {/* Title on image */}
                         </CardHeader>
                         <CardContent className="p-3 flex flex-col flex-grow"> {/* Reduced padding */}
                             <p className="text-xs text-muted-foreground flex-grow mb-3">{template.description}</p>
                             {/* Moved buttons to CardContent */}
                             <div className="flex gap-2 mt-auto">
                                 <Button variant="outline" size="sm" className="flex-1" onClick={(e) => { e.stopPropagation(); handlePreview(template); }}>
                                    <Eye className="mr-1 h-3.5 w-3.5"/> Önizle
                                </Button>
                                <Button size="sm" className="flex-1" onClick={(e) => { e.stopPropagation(); handleSelect(template.blocks); }}>Seç</Button>
                             </div>
                         </CardContent>
                    </Card>
                ))}
            </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Kapat
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
