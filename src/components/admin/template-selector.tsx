
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
    previewImageUrl: 'https://picsum.photos/seed/template-std/300/200', // Preview image for selector dialog
    blocks: [
      { id: generateId(), type: 'heading', level: 1, content: 'Standart Makale Başlığı' },
      { id: generateId(), type: 'text', content: 'Bu makale, [Konu] hakkında genel bir bakış sunmaktadır. Giriş paragrafında konunun önemi ve makalenin kapsamı belirtilir.' },
      { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/std-main/800/400', alt: 'Standart Makale Ana Görseli', caption: 'Görsel alt yazı (isteğe bağlı)' },
      { id: generateId(), type: 'text', content: 'Ana metin bölümü burada başlar. Konuyla ilgili temel bilgiler, açıklamalar ve argümanlar bu kısımda yer alır. Paragraflar arasında mantıksal bir akış olmalıdır.' },
      { id: generateId(), type: 'heading', level: 2, content: 'Konunun Detayları' },
      { id: generateId(), type: 'text', content: 'Konunun daha derinlemesine incelendiği bölüm. Alt başlıklar kullanarak okunabilirliği artırın. İstatistikler, örnekler veya alıntılarla içeriği zenginleştirin.' },
      { id: generateId(), type: 'heading', level: 2, content: 'Farklı Bir Bakış Açısı' },
      { id: generateId(), type: 'video', url: 'https://www.youtube.com/watch?v=SJm5suVpOK0', youtubeId: 'SJm5suVpOK0' }, // Example relevant video
      { id: generateId(), type: 'text', content: 'Konuyla ilgili farklı görüşler veya alternatif yaklaşımlar bu bölümde ele alınabilir. Tartışmalı konular için dengeli bir sunum önemlidir.' },
      { id: generateId(), type: 'quote', content: 'Konuyla ilgili önemli bir kişinin veya kaynağın sözünü buraya ekleyin.', citation: 'Sözün Sahibi/Kaynak' },
      { id: generateId(), type: 'text', content: 'Sonuç paragrafı, makalede ele alınan ana noktaları özetler ve okuyucuya bir çıkarım veya mesaj sunar.' },
    ]
  },
   {
    id: 'listicle',
    name: 'Listeleme Makalesi',
    description: 'Numaralı veya madde işaretli listeler içeren makaleler için uygundur.',
    previewImageUrl: 'https://picsum.photos/seed/template-list/300/200', // Preview image for selector dialog
    blocks: [
        { id: generateId(), type: 'heading', level: 1, content: '[Konu] Hakkında Bilmeniz Gereken [X] Şey' },
        { id: generateId(), type: 'text', content: 'Bu listeleme makalesinde, [konu] ile ilgili en önemli veya ilgi çekici [X] noktayı keşfedeceğiz. İşte başlıyoruz!' },
        { id: generateId(), type: 'heading', level: 2, content: '1. İlk Önemli Nokta' },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/list-item1/600/300', alt: 'Birinci Madde Görseli', caption: 'İlk maddeyi görselleştiren bir imaj.' },
        { id: generateId(), type: 'text', content: 'Birinci noktanın açıklaması. Neden bu kadar önemli olduğunu veya nasıl çalıştığını detaylandırın. Okuyucuya pratik bilgiler sunun.' },
        { id: generateId(), type: 'divider'},
        { id: generateId(), type: 'heading', level: 2, content: '2. İkinci İlginç Bilgi' },
        { id: generateId(), type: 'text', content: 'İkinci maddenin detayları. Belki bir istatistik, bir tarihsel bilgi veya beklenmedik bir gerçek ekleyebilirsiniz.' },
         { id: generateId(), type: 'divider'},
        { id: generateId(), type: 'heading', level: 2, content: '3. Üçüncü Dikkat Çeken Unsur' },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/list-item3/600/300', alt: 'Üçüncü Madde Görseli' },
        { id: generateId(), type: 'text', content: 'Üçüncü maddeye ilişkin açıklamalar. Farklı bir açıdan bakın veya bir örnek olay incelemesi sunun.' },
         { id: generateId(), type: 'divider'},
        { id: generateId(), type: 'text', content: '(...diğer maddeler...)' },
         { id: generateId(), type: 'divider'},
        { id: generateId(), type: 'heading', level: 2, content: `[X]. Son Madde: Özet ve Gelecek` },
        { id: generateId(), type: 'text', content: 'Listenin son maddesi. Tüm listeyi kısaca özetleyebilir veya konuyla ilgili gelecekteki beklentilere değinebilirsiniz.' },
        { id: generateId(), type: 'text', content: 'Umarız bu liste [konu] hakkındaki anlayışınızı genişletmiştir. Daha fazla bilgi için diğer makalelerimize göz atın!'},
    ]
  },
  {
    id: 'image-gallery',
    name: 'Görsel Galerisi',
    description: 'Görsellerin ön planda olduğu, açıklamalı galeri düzeni.',
    previewImageUrl: 'https://picsum.photos/seed/template-gallery/300/200', // Preview image for selector dialog
    blocks: [
        { id: generateId(), type: 'heading', level: 1, content: '[Konu] Temalı Etkileyici Görsel Galerisi' },
        { id: generateId(), type: 'text', content: 'Bu galeride, [konu] ile ilgili özenle seçilmiş görselleri ve hikayelerini bulacaksınız. Görsel bir yolculuğa çıkmaya hazır olun.' },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/gallery-img1/800/500', alt: 'Galeri Görseli 1', caption: 'Görsel 1: [Açıklayıcı Başlık]. Bu görselin anlamını veya çekildiği anı anlatan kısa bir metin.' },
        { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/gallery-img2/800/500', alt: 'Galeri Görseli 2', caption: 'Görsel 2: [Farklı Bir Başlık]. Görseldeki detaylara veya kompozisyona dikkat çeken bir açıklama.' },
        { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/gallery-img3/800/500', alt: 'Galeri Görseli 3', caption: 'Görsel 3: [İlginç Bir Detay]. Görselin teknik özellikleri veya sanatsal değeri hakkında bilgi.' },
         { id: generateId(), type: 'divider' },
         { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/gallery-img4/800/500', alt: 'Galeri Görseli 4', caption: 'Görsel 4: [Son Başlık]. Galerideki son görsel ve onunla ilgili notlar.' },
        { id: generateId(), type: 'text', content: 'Bu görsel şölenin sonuna geldik. Umarız [konu] hakkındaki bu görseller ilginizi çekmiştir.' },
    ]
  },
  {
    id: 'faq-article',
    name: 'SSS Makalesi',
    description: 'Sıkça sorulan sorular ve cevapları formatında bir düzen.',
    previewImageUrl: 'https://picsum.photos/seed/template-faq/300/200', // Preview image for selector dialog
    blocks: [
        { id: generateId(), type: 'heading', level: 1, content: '[Konu] Hakkında Sıkça Sorulan Sorular (SSS)' },
        { id: generateId(), type: 'text', content: '[Konu] ile ilgili en çok merak edilen soruları derledik ve uzmanlarımızın yanıtlarıyla birlikte size sunuyoruz.' },
        { id: generateId(), type: 'heading', level: 2, content: 'Soru 1: [En Temel Soru] nedir?' },
        { id: generateId(), type: 'text', content: '**Cevap:** [Konu]nun temel tanımı ve ne işe yaradığı hakkında net ve anlaşılır bir açıklama. Karmaşık terimleri basitleştirin.'},
        { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'heading', level: 2, content: 'Soru 2: [Konu]nun faydaları nelerdir?' },
        { id: generateId(), type: 'text', content: '**Cevap:** Konunun sağladığı başlıca avantajları madde madde listeleyin:\n- Fayda 1: Kısa açıklama.\n- Fayda 2: Kısa açıklama.\n- Fayda 3: Kısa açıklama.' }, // Simple list within text
         { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'heading', level: 2, content: 'Soru 3: [Konu] ile ilgili yaygın yanılgılar nelerdir?' },
        { id: generateId(), type: 'text', content: '**Cevap:** Konu hakkında sıkça duyulan yanlış bilgilere değinin ve doğrularını açıklayın. Bu, okuyucunun güvenini artıracaktır.'},
         { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'heading', level: 2, content: 'Soru 4: [Konu]yu öğrenmeye nereden başlamalıyım?' },
        { id: generateId(), type: 'text', content: '**Cevap:** Yeni başlayanlar için önerilen kaynakları, web sitelerini veya kitapları listeleyin. Öğrenme sürecini kolaylaştıracak ipuçları verin.'},
         { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'text', content: 'Bu SSS bölümü sürekli güncellenmektedir. Başka sorularınız varsa, lütfen bizimle iletişime geçin.' },
    ]
  },
  {
    id: 'how-to-guide',
    name: 'Nasıl Yapılır Rehberi',
    description: 'Adım adım talimatlar içeren öğretici makaleler için.',
    previewImageUrl: 'https://picsum.photos/seed/template-howto/300/200', // Preview image for selector dialog
    blocks: [
        { id: generateId(), type: 'heading', level: 1, content: '[Görev] Adım Adım Nasıl Yapılır?' },
        { id: generateId(), type: 'text', content: 'Bu pratik rehberle, [görev] işlemini baştan sona nasıl gerçekleştireceğinizi öğreneceksiniz. Başlamak için gereken her şey burada!' },
        { id: generateId(), type: 'heading', level: 2, content: 'Gereksinimler ve Hazırlık' },
        { id: generateId(), type: 'text', content: 'Başlamadan önce ihtiyacınız olacaklar:\n- **Malzeme/Araç 1:** (Örn: Belirli bir yazılım, bir alet)\n- **Malzeme/Araç 2:** (Örn: İnternet bağlantısı, hesap bilgileri)\n- **Ön Bilgi:** (Örn: Temel bilgisayar bilgisi)\n- **Tahmini Süre:** Yaklaşık [Süre] dakika.' },
        { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'heading', level: 2, content: 'Adım 1: [İlk Adımın Açıklaması]' },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/howto-step1/600/350', alt: 'Adım 1 Görsel Anlatımı', caption:'İlk adımın ekran görüntüsü veya görseli.' },
        { id: generateId(), type: 'text', content: 'İlk adımı detaylı bir şekilde açıklayın. Hangi butona tıklanmalı, hangi bilgi girilmeli gibi net talimatlar verin.' },
         { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'heading', level: 2, content: 'Adım 2: [İkinci Adımın Açıklaması]' },
        { id: generateId(), type: 'text', content: 'İkinci adımı anlatın. Önceki adıma nasıl bağlandığını belirtin. Varsa dikkat edilmesi gereken özel durumları vurgulayın.' },
         { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'heading', level: 2, content: 'Adım 3: [Üçüncü Adımın Açıklaması]' },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/howto-step3/600/350', alt: 'Adım 3 Görsel Anlatımı' },
        { id: generateId(), type: 'text', content: 'Üçüncü adımı gerçekleştirin. Sonuca yaklaştığınızı belirtin.' },
         { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'text', content: '(...diğer adımlar...)' },
         { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'heading', level: 2, content: 'Adım [X]: Kontrol ve Tamamlama' },
        { id: generateId(), type: 'text', content: 'Son adımı tamamlayın. Her şeyin doğru çalıştığını nasıl kontrol edeceğinizi açıklayın.' },
        { id: generateId(), type: 'heading', level: 2, content: 'Sorun Giderme ve İpuçları' },
        { id: generateId(), type: 'text', content: 'Sık karşılaşılan sorunlar ve çözümleri. İşlemi daha verimli hale getirecek ek ipuçları.' },
    ]
  },
   {
    id: 'interview-article',
    name: 'Röportaj Makalesi',
    description: 'Bir kişiyle yapılan röportajı soru-cevap formatında sunar.',
    previewImageUrl: 'https://picsum.photos/seed/template-interview/300/200', // Preview image for selector dialog
    blocks: [
        { id: generateId(), type: 'heading', level: 1, content: '[Kişi Adı] ile Söyleşi: [Alanındaki] Derinliklerine Yolculuk' },
        { id: generateId(), type: 'image', url: 'https://picsum.photos/seed/interview-person/400/400', alt: '[Kişi Adı] Portresi', caption:'[Kişi Adı], [Kısa Tanıtım]' }, // Placeholder content image (profile picture)
        { id: generateId(), type: 'text', content: '[Alanında] öncü isimlerden [Kişi Adı] ile [Röportaj Konusu] üzerine keyifli bir sohbet gerçekleştirdik. Deneyimleri ve öngörüleri sizlerle...' },
        { id: generateId(), type: 'heading', level: 2, content: 'Kariyer Yolculuğu ve İlham Kaynakları' },
        { id: generateId(), type: 'text', content: '**Soru:** Bize kariyer yolculuğunuzdan ve bu alana yönelmenize neyin ilham verdiğinden bahseder misiniz?' },
        { id: generateId(), type: 'text', content: '**Cevap:** [Kişi Adı]\'nın kariyer başlangıcı, motivasyonları ve dönüm noktaları hakkında detaylı yanıtı.' },
        { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'heading', level: 2, content: '[Alanındaki] Güncel Gelişmeler ve Gelecek Öngörüleri' },
        { id: generateId(), type: 'text', content: '**Soru:** Alanınızdaki en heyecan verici gelişmeler neler ve önümüzdeki 5-10 yıl içinde neler bekliyorsunuz?' },
        { id: generateId(), type: 'text', content: '**Cevap:** [Kişi Adı]\'nın alanındaki trendler, yenilikler ve gelecek tahminleri hakkındaki görüşleri.' },
        { id: generateId(), type: 'quote', content: "[Kişi Adı]'nın röportaj sırasında vurguladığı en çarpıcı veya düşündürücü ifadesi.", citation:"[Kişi Adı]" },
        { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'heading', level: 2, content: 'Gençlere Tavsiyeler' },
        { id: generateId(), type: 'text', content: '**Soru:** Bu alana ilgi duyan gençlere ne gibi tavsiyelerde bulunursunuz?' },
        { id: generateId(), type: 'text', content: '**Cevap:** [Kişi Adı]\'nın genç profesyonellere veya öğrencilere yönelik önerileri, yol gösterici ipuçları.' },
        { id: generateId(), type: 'divider' },
        { id: generateId(), type: 'text', content: 'Bu değerli söyleşi için [Kişi Adı]\'na teşekkür ederiz. Umarız okuyucularımız için ilham verici olmuştur.' },
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
             imageUrl: template.blocks.find(b => b.type === 'image')?.url || template.previewImageUrl, // Use first image in blocks or preview image
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
                        <CardHeader className="p-0 relative h-32 overflow-hidden cursor-pointer" onClick={() => handlePreview(template)}> {/* Changed header click to Preview */}
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
                               {/* Added Preview Icon Overlay */}
                               <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                   <Eye className="h-8 w-8 text-white/80" />
                               </div>
                         </CardHeader>
                         <CardContent className="p-3 flex flex-col flex-grow"> {/* Reduced padding */}
                             <p className="text-xs text-muted-foreground flex-grow mb-3">{template.description}</p>
                             {/* Changed buttons */}
                             <div className="flex gap-2 mt-auto">
                                 <Button variant="outline" size="sm" className="flex-1" onClick={() => handlePreview(template)}>
                                    <Eye className="mr-1 h-3.5 w-3.5"/> Önizle
                                </Button>
                                <Button size="sm" className="flex-1" onClick={() => handleSelect(template.blocks)}>Seç</Button> {/* Select button now directly selects */}
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
