
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

interface TemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (content: string) => void; // Callback still expects HTML string for now
}

// Define Block Types
type Block =
  | { type: 'heading'; level: 1 | 2 | 3 | 4 | 5 | 6; content: string }
  | { type: 'paragraph'; content: string; emphasis?: boolean; strong?: boolean }
  | { type: 'image'; src: string; alt: string; caption?: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'blockquote'; content: string }
  | { type: 'divider' };

// Define Template Structure
interface Template {
  id: string;
  name: string;
  description: string;
  previewImageUrl: string;
  blocks: Block[]; // Content as an array of blocks
}

// Mock Templates (Using Block Structure)
const templates: Template[] = [
  {
    id: 'standard-article',
    name: 'Standart Makale',
    description: 'Başlık, ana görsel ve metin içeriği için temel düzen.',
    previewImageUrl: 'https://picsum.photos/seed/template1/300/200',
    blocks: [
      { type: 'heading', level: 1, content: 'Makale Başlığı' },
      { type: 'paragraph', content: 'Özetleyici bir giriş paragrafı buraya ekleyin...', emphasis: true },
      { type: 'image', src: 'https://picsum.photos/seed/articleimg1/800/400', alt: 'Ana Görsel' },
      { type: 'paragraph', content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' },
      { type: 'heading', level: 2, content: 'Alt Başlık 1' },
      { type: 'paragraph', content: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
      { type: 'heading', level: 2, content: 'Alt Başlık 2' },
      { type: 'paragraph', content: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.' },
      { type: 'blockquote', content: 'Bu alana önemli bir alıntı veya vurgu ekleyebilirsiniz.' },
      { type: 'paragraph', content: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.' },
    ]
  },
  {
    id: 'listicle',
    name: 'Listeleme Makalesi',
    description: 'Numaralı veya madde işaretli listeler içeren makaleler için uygundur.',
    previewImageUrl: 'https://picsum.photos/seed/template2/300/200',
    blocks: [
        { type: 'heading', level: 1, content: 'Harika [X] Şey Listesi' },
        { type: 'paragraph', content: 'Bu makalede, [konu] hakkında bilmeniz gereken en önemli [X] şeyi listeliyoruz. Giriş paragrafı buraya gelecek.' },
        { type: 'heading', level: 2, content: '1. Birinci Madde Başlığı' },
        { type: 'image', src: 'https://picsum.photos/seed/list1/600/300', alt: 'Madde 1 Görseli' },
        { type: 'paragraph', content: 'Birinci maddenin açıklaması. Neden önemli olduğunu veya nasıl çalıştığını açıklayın.' },
        { type: 'heading', level: 2, content: '2. İkinci Madde Başlığı' },
        { type: 'paragraph', content: 'İkinci maddenin detayları burada yer alacak. Örnekler veya ek bilgiler ekleyebilirsiniz.' },
        { type: 'heading', level: 2, content: '3. Üçüncü Madde Başlığı' },
        { type: 'image', src: 'https://picsum.photos/seed/list3/600/300', alt: 'Madde 3 Görseli' },
        { type: 'paragraph', content: 'Üçüncü maddeye ilişkin açıklamalar ve önemli noktalar.' },
        { type: 'paragraph', content: '...' },
        { type: 'heading', level: 2, content: '[X]. Son Madde Başlığı' },
        { type: 'paragraph', content: 'Listenin son maddesi ve açıklaması.' },
        { type: 'paragraph', content: 'Makalenin ana fikrini özetleyen veya okuyucuya bir sonraki adımı öneren bir sonuç paragrafı ekleyin.', strong: true }, // Representing 'Sonuç:' part
    ]
  },
  {
    id: 'image-gallery',
    name: 'Görsel Galerisi',
    description: 'Görsellerin ön planda olduğu, açıklamalı galeri düzeni.',
    previewImageUrl: 'https://picsum.photos/seed/template3/300/200',
    blocks: [
        { type: 'heading', level: 1, content: '[Konu] Görsel Galerisi' },
        { type: 'paragraph', content: 'Bu galeride [konu] ile ilgili etkileyici görselleri bir araya getirdik. Galeri hakkında kısa bir açıklama.' },
        { type: 'image', src: 'https://picsum.photos/seed/gallery1/800/500', alt: 'Görsel 1', caption: 'Kısa ve açıklayıcı bir başlık. Bu görselin ne hakkında olduğunu veya neyi gösterdiğini anlatan birkaç cümle.' },
        { type: 'divider' },
        { type: 'image', src: 'https://picsum.photos/seed/gallery2/800/500', alt: 'Görsel 2', caption: 'Başka bir açıklayıcı başlık. Görselle ilgili ilginç detaylar veya bağlam bilgisi.' },
        { type: 'divider' },
        { type: 'image', src: 'https://picsum.photos/seed/gallery3/800/500', alt: 'Görsel 3', caption: 'Üçüncü görsel için başlık ve açıklama.' },
        { type: 'paragraph', content: 'Galeriyi sonlandıran veya ek bilgi veren bir paragraf.' },
    ]
  },
  {
    id: 'faq-article',
    name: 'SSS Makalesi',
    description: 'Sıkça sorulan sorular ve cevapları formatında bir düzen.',
    previewImageUrl: 'https://picsum.photos/seed/template4/300/200',
    blocks: [
        { type: 'heading', level: 1, content: '[Konu] Hakkında Sıkça Sorulan Sorular (SSS)' },
        { type: 'paragraph', content: '[Konu] ile ilgili merak edilen yaygın soruları ve cevaplarını bu makalede bulabilirsiniz.' },
        { type: 'heading', level: 2, content: 'Soru 1: [İlk Soru Buraya]?' },
        { type: 'paragraph', content: 'İlk sorunun detaylı cevabı buraya gelecek. Açıklayıcı ve net olun.', strong: true }, // Representing Answer
        { type: 'heading', level: 2, content: 'Soru 2: [İkinci Soru Buraya]?' },
        { type: 'paragraph', content: 'İkinci sorunun yanıtı. Gerekirse alt maddeler veya listeler kullanabilirsiniz.', strong: true },
        { type: 'list', ordered: false, items: ['Alt madde 1', 'Alt madde 2'] },
        { type: 'heading', level: 2, content: 'Soru 3: [Üçüncü Soru Buraya]?' },
        { type: 'paragraph', content: 'Üçüncü sorunun cevabı. İlgili kaynaklara bağlantılar verebilirsiniz.', strong: true },
        { type: 'heading', level: 2, content: 'Soru 4: [Dördüncü Soru Buraya]?' },
        { type: 'paragraph', content: 'Dördüncü soruya verilen yanıt.', strong: true },
        { type: 'paragraph', content: 'Daha fazla sorunuz varsa, bizimle iletişime geçmekten çekinmeyin.' },
    ]
  },
  {
    id: 'how-to-guide',
    name: 'Nasıl Yapılır Rehberi',
    description: 'Adım adım talimatlar içeren öğretici makaleler için.',
    previewImageUrl: 'https://picsum.photos/seed/template5/300/200',
    blocks: [
        { type: 'heading', level: 1, content: '[Görev] Nasıl Yapılır: Adım Adım Rehber' },
        { type: 'paragraph', content: 'Bu rehber, [görev] işlemini nasıl kolayca gerçekleştirebileceğinizi adım adım gösterecektir.' },
        { type: 'heading', level: 2, content: 'Gereksinimler' },
        { type: 'list', ordered: false, items: [
            'Gerekli malzeme veya araç 1',
            'Gerekli malzeme veya araç 2',
            'Önceden yapılması gerekenler (varsa)'
            ]
        },
        { type: 'heading', level: 2, content: 'Adım 1: [İlk Adım Başlığı]' },
        { type: 'image', src: 'https://picsum.photos/seed/step1/600/350', alt: 'Adım 1 Görseli' },
        { type: 'paragraph', content: 'İlk adımın detaylı açıklaması. Ne yapmanız gerektiğini net bir şekilde belirtin.' },
        { type: 'heading', level: 2, content: 'Adım 2: [İkinci Adım Başlığı]' },
        { type: 'paragraph', content: 'İkinci adımın açıklaması. İpuçları veya dikkat edilmesi gereken noktaları ekleyin.' },
        { type: 'heading', level: 2, content: 'Adım 3: [Üçüncü Adım Başlığı]' },
        { type: 'image', src: 'https://picsum.photos/seed/step3/600/350', alt: 'Adım 3 Görseli' },
        { type: 'paragraph', content: 'Üçüncü adımın detayları.' },
        { type: 'paragraph', content: '...' },
        { type: 'heading', level: 2, content: 'Adım [X]: [Son Adım Başlığı]' },
        { type: 'paragraph', content: 'Son adımın açıklaması ve işlemin tamamlanması.' },
        { type: 'heading', level: 2, content: 'Sonuç ve İpuçları' },
        { type: 'paragraph', content: 'İşlemi başarıyla tamamladınız! Ekstra ipuçları veya sorun giderme bilgileri buraya eklenebilir.' },
    ]
  },
  {
    id: 'interview-article',
    name: 'Röportaj Makalesi',
    description: 'Bir kişiyle yapılan röportajı soru-cevap formatında sunar.',
    previewImageUrl: 'https://picsum.photos/seed/template6/300/200',
    blocks: [
        { type: 'heading', level: 1, content: '[Kişi Adı] ile Özel Röportaj: [Röportaj Konusu]' },
        // Note: Floating images require CSS not representable in basic blocks easily.
        { type: 'image', src: 'https://picsum.photos/seed/interviewee/300/300', alt: '[Kişi Adı]' },
        { type: 'paragraph', content: '[Kişi Adı], [Kişinin Unvanı/Alanı], [konu] hakkındaki görüşlerini ve deneyimlerini paylaştı. Giriş paragrafı...', emphasis: true },
        { type: 'heading', level: 2, content: 'Giriş ve Bağlam' },
        { type: 'paragraph', content: 'Röportajın neden yapıldığı veya kişinin uzmanlığı hakkında kısa bir bilgi verin.' },
        { type: 'divider' },
        { type: 'paragraph', content: 'İlk soru buraya yazılacak?', strong: true }, // Representing Question
        { type: 'paragraph', content: 'İlk sorunun cevabı. Kişinin kendi ifadeleriyle...' }, // Representing Answer
        { type: 'paragraph', content: 'İkinci soru...?', strong: true },
        { type: 'paragraph', content: 'İkinci sorunun cevabı...' },
        { type: 'paragraph', content: 'Üçüncü soru...?', strong: true },
        { type: 'paragraph', content: 'Üçüncü sorunun cevabı...' },
        { type: 'blockquote', content: "[Kişi Adı]'nın röportajdan çarpıcı bir sözü veya alıntısı." },
        { type: 'paragraph', content: 'Son soru...?', strong: true },
        { type: 'paragraph', content: 'Son sorunun cevabı...' },
        { type: 'heading', level: 2, content: 'Sonuç' },
        { type: 'paragraph', content: 'Röportajın ana çıkarımlarını özetleyen veya okuyucuya teşekkür eden bir kapanış paragrafı.' },
    ]
  },
];


// Function to convert block structure to HTML (basic implementation)
// A real block editor would render this directly or use a dedicated format.
const blocksToHtml = (blocks: Block[]): string => {
    let html = '';
    blocks.forEach(block => {
        switch (block.type) {
            case 'heading':
                html += `<h${block.level}>${block.content}</h${block.level}>\n`;
                break;
            case 'paragraph':
                let content = block.content;
                if (block.strong) content = `<strong>${content}</strong>`;
                if (block.emphasis) content = `<em>${content}</em>`;
                html += `<p>${content}</p>\n`;
                break;
            case 'image':
                html += `<figure>\n  <img src="${block.src}" alt="${block.alt}" />\n`;
                if (block.caption) {
                     const strongCaption = block.caption.includes(':') ? `<strong>${block.caption.split(':')[0]}:</strong>${block.caption.split(':').slice(1).join(':')}` : block.caption;
                    html += `  <figcaption>${strongCaption}</figcaption>\n`;
                }
                html += `</figure>\n`;
                break;
            case 'list':
                const tag = block.ordered ? 'ol' : 'ul';
                html += `<${tag}>\n`;
                block.items.forEach(item => {
                    html += `  <li>${item}</li>\n`;
                });
                html += `</${tag}>\n`;
                break;
            case 'blockquote':
                html += `<blockquote>${block.content}</blockquote>\n`;
                break;
            case 'divider':
                html += `<hr />\n`;
                break;
        }
    });
    return html;
};


export function TemplateSelector({ isOpen, onClose, onSelectTemplate }: TemplateSelectorProps) {

    const handleSelect = (blocks: Block[]) => {
        const htmlContent = blocksToHtml(blocks); // Convert blocks to HTML
        onSelectTemplate(htmlContent); // Pass HTML to the parent
        onClose(); // Close the dialog after selection
    };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[60%] lg:max-w-[70%] max-h-[80vh] flex flex-col"> {/* Adjusted width and height */}
        <DialogHeader>
          <DialogTitle>Makale Şablonu Seç</DialogTitle>
          <DialogDescription>
            İçeriğinizi oluşturmaya başlamak için hazır bir şablon seçin. Şablon içeriği mevcut içeriğinizin üzerine yazılabilir (onayınızla).
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-grow pr-4 -mr-4"> {/* Added ScrollArea */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4"> {/* Responsive grid */}
                {templates.map((template) => (
                    <Card key={template.id} className="cursor-pointer hover:shadow-lg transition-shadow flex flex-col" onClick={() => handleSelect(template.blocks)}>
                        <CardHeader className="p-0">
                            <Image
                                src={template.previewImageUrl}
                                alt={`${template.name} önizlemesi`}
                                width={300}
                                height={200}
                                className="w-full h-32 object-cover rounded-t-lg"
                            />
                        </CardHeader>
                        <CardContent className="p-4 flex flex-col flex-grow">
                            <CardTitle className="text-base font-semibold mb-1">{template.name}</CardTitle>
                            <p className="text-xs text-muted-foreground flex-grow">{template.description}</p>
                             <Button variant="outline" size="sm" className="mt-3 w-full" onClick={(e) => { e.stopPropagation(); handleSelect(template.blocks); }}>Seç</Button> {/* Prevent card click, trigger select */}
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

    