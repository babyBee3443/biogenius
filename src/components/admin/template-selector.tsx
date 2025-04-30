
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
  onSelectTemplate: (content: string) => void; // Callback with selected template content (HTML string for now)
}

// Define Template Structure
interface Template {
  id: string;
  name: string;
  description: string;
  previewImageUrl: string;
  content: string; // Content as an HTML string (replace with block data later)
}

// Mock Templates (Replace with actual templates and block data)
const templates: Template[] = [
  {
    id: 'standard-article',
    name: 'Standart Makale',
    description: 'Başlık, ana görsel ve metin içeriği için temel düzen.',
    previewImageUrl: 'https://picsum.photos/seed/template1/300/200',
    content: `
        <h1>Makale Başlığı</h1>
        <p><em>Özetleyici bir giriş paragrafı buraya ekleyin...</em></p>
        <img src="https://picsum.photos/seed/articleimg1/800/400" alt="Ana Görsel" />
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        <h2>Alt Başlık 1</h2>
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <h2>Alt Başlık 2</h2>
        <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
        <blockquote>Bu alana önemli bir alıntı veya vurgu ekleyebilirsiniz.</blockquote>
        <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.</p>
    `
  },
  {
    id: 'listicle',
    name: 'Listeleme Makalesi',
    description: 'Numaralı veya madde işaretli listeler içeren makaleler için uygundur.',
    previewImageUrl: 'https://picsum.photos/seed/template2/300/200',
    content: `
        <h1>Harika [X] Şey Listesi</h1>
        <p>Bu makalede, [konu] hakkında bilmeniz gereken en önemli [X] şeyi listeliyoruz. Giriş paragrafı buraya gelecek.</p>
        <h2>1. Birinci Madde Başlığı</h2>
        <img src="https://picsum.photos/seed/list1/600/300" alt="Madde 1 Görseli" />
        <p>Birinci maddenin açıklaması. Neden önemli olduğunu veya nasıl çalıştığını açıklayın.</p>
        <h2>2. İkinci Madde Başlığı</h2>
        <p>İkinci maddenin detayları burada yer alacak. Örnekler veya ek bilgiler ekleyebilirsiniz.</p>
        <h2>3. Üçüncü Madde Başlığı</h2>
        <img src="https://picsum.photos/seed/list3/600/300" alt="Madde 3 Görseli" />
        <p>Üçüncü maddeye ilişkin açıklamalar ve önemli noktalar.</p>
        <p>...</p>
        <h2>[X]. Son Madde Başlığı</h2>
        <p>Listenin son maddesi ve açıklaması.</p>
        <p><strong>Sonuç:</strong> Makalenin ana fikrini özetleyen veya okuyucuya bir sonraki adımı öneren bir sonuç paragrafı ekleyin.</p>
    `
  },
  {
    id: 'image-gallery',
    name: 'Görsel Galerisi',
    description: 'Görsellerin ön planda olduğu, açıklamalı galeri düzeni.',
    previewImageUrl: 'https://picsum.photos/seed/template3/300/200',
    content: `
        <h1>[Konu] Görsel Galerisi</h1>
        <p>Bu galeride [konu] ile ilgili etkileyici görselleri bir araya getirdik. Galeri hakkında kısa bir açıklama.</p>
        <figure>
            <img src="https://picsum.photos/seed/gallery1/800/500" alt="Görsel 1" />
            <figcaption><strong>Görsel 1:</strong> Kısa ve açıklayıcı bir başlık. Bu görselin ne hakkında olduğunu veya neyi gösterdiğini anlatan birkaç cümle.</figcaption>
        </figure>
        <hr />
        <figure>
            <img src="https://picsum.photos/seed/gallery2/800/500" alt="Görsel 2" />
            <figcaption><strong>Görsel 2:</strong> Başka bir açıklayıcı başlık. Görselle ilgili ilginç detaylar veya bağlam bilgisi.</figcaption>
        </figure>
        <hr />
        <figure>
            <img src="https://picsum.photos/seed/gallery3/800/500" alt="Görsel 3" />
            <figcaption><strong>Görsel 3:</strong> Üçüncü görsel için başlık ve açıklama.</figcaption>
        </figure>
        <p>Galeriyi sonlandıran veya ek bilgi veren bir paragraf.</p>
    `
  },
    {
    id: 'faq-article',
    name: 'SSS Makalesi',
    description: 'Sıkça sorulan sorular ve cevapları formatında bir düzen.',
    previewImageUrl: 'https://picsum.photos/seed/template4/300/200',
    content: `
        <h1>[Konu] Hakkında Sıkça Sorulan Sorular (SSS)</h1>
        <p>[Konu] ile ilgili merak edilen yaygın soruları ve cevaplarını bu makalede bulabilirsiniz.</p>
        <h2>Soru 1: [İlk Soru Buraya]?</h2>
        <p><strong>Cevap:</strong> İlk sorunun detaylı cevabı buraya gelecek. Açıklayıcı ve net olun.</p>
        <h2>Soru 2: [İkinci Soru Buraya]?</h2>
        <p><strong>Cevap:</strong> İkinci sorunun yanıtı. Gerekirse alt maddeler veya listeler kullanabilirsiniz.<ul><li>Alt madde 1</li><li>Alt madde 2</li></ul></p>
        <h2>Soru 3: [Üçüncü Soru Buraya]?</h2>
        <p><strong>Cevap:</strong> Üçüncü sorunun cevabı. İlgili kaynaklara bağlantılar verebilirsiniz.</p>
        <h2>Soru 4: [Dördüncü Soru Buraya]?</h2>
        <p><strong>Cevap:</strong> Dördüncü soruya verilen yanıt.</p>
        <p>Daha fazla sorunuz varsa, bizimle iletişime geçmekten çekinmeyin.</p>
    `
  },
  {
    id: 'how-to-guide',
    name: 'Nasıl Yapılır Rehberi',
    description: 'Adım adım talimatlar içeren öğretici makaleler için.',
    previewImageUrl: 'https://picsum.photos/seed/template5/300/200',
    content: `
        <h1>[Görev] Nasıl Yapılır: Adım Adım Rehber</h1>
        <p>Bu rehber, [görev] işlemini nasıl kolayca gerçekleştirebileceğinizi adım adım gösterecektir.</p>
        <h2>Gereksinimler</h2>
        <ul>
            <li>Gerekli malzeme veya araç 1</li>
            <li>Gerekli malzeme veya araç 2</li>
            <li>Önceden yapılması gerekenler (varsa)</li>
        </ul>
        <h2>Adım 1: [İlk Adım Başlığı]</h2>
        <img src="https://picsum.photos/seed/step1/600/350" alt="Adım 1 Görseli" />
        <p>İlk adımın detaylı açıklaması. Ne yapmanız gerektiğini net bir şekilde belirtin.</p>
        <h2>Adım 2: [İkinci Adım Başlığı]</h2>
        <p>İkinci adımın açıklaması. İpuçları veya dikkat edilmesi gereken noktaları ekleyin.</p>
        <h2>Adım 3: [Üçüncü Adım Başlığı]</h2>
        <img src="https://picsum.photos/seed/step3/600/350" alt="Adım 3 Görseli" />
        <p>Üçüncü adımın detayları.</p>
        <p>...</p>
        <h2>Adım [X]: [Son Adım Başlığı]</h2>
        <p>Son adımın açıklaması ve işlemin tamamlanması.</p>
        <h2>Sonuç ve İpuçları</h2>
        <p>İşlemi başarıyla tamamladınız! Ekstra ipuçları veya sorun giderme bilgileri buraya eklenebilir.</p>
    `
  },
    {
    id: 'interview-article',
    name: 'Röportaj Makalesi',
    description: 'Bir kişiyle yapılan röportajı soru-cevap formatında sunar.',
    previewImageUrl: 'https://picsum.photos/seed/template6/300/200',
    content: `
        <h1>[Kişi Adı] ile Özel Röportaj: [Röportaj Konusu]</h1>
        <img src="https://picsum.photos/seed/interviewee/300/300" alt="[Kişi Adı]" style="float:left; margin-right: 15px; border-radius: 50%;" />
        <p><em>[Kişi Adı], [Kişinin Unvanı/Alanı], [konu] hakkındaki görüşlerini ve deneyimlerini paylaştı. Giriş paragrafı...</em></p>
        <br style="clear:both;" />
        <h2>Giriş ve Bağlam</h2>
        <p>Röportajın neden yapıldığı veya kişinin uzmanlığı hakkında kısa bir bilgi verin.</p>
        <hr />
        <p><strong>Soru: İlk soru buraya yazılacak?</strong></p>
        <p><strong>[Kişi Adı]:</strong> İlk sorunun cevabı. Kişinin kendi ifadeleriyle...</p>
        <p><strong>Soru: İkinci soru...?</strong></p>
        <p><strong>[Kişi Adı]:</strong> İkinci sorunun cevabı...</p>
        <p><strong>Soru: Üçüncü soru...?</strong></p>
        <p><strong>[Kişi Adı]:</strong> Üçüncü sorunun cevabı...</p>
        <blockquote>"[Kişi Adı]'nın röportajdan çarpıcı bir sözü veya alıntısı."</blockquote>
        <p><strong>Soru: Son soru...?</strong></p>
        <p><strong>[Kişi Adı]:</strong> Son sorunun cevabı...</p>
        <h2>Sonuç</h2>
        <p>Röportajın ana çıkarımlarını özetleyen veya okuyucuya teşekkür eden bir kapanış paragrafı.</p>
    `
  },
];

export function TemplateSelector({ isOpen, onClose, onSelectTemplate }: TemplateSelectorProps) {

    const handleSelect = (content: string) => {
        onSelectTemplate(content);
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
                    <Card key={template.id} className="cursor-pointer hover:shadow-lg transition-shadow flex flex-col" onClick={() => handleSelect(template.content)}>
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
                             <Button variant="outline" size="sm" className="mt-3 w-full" onClick={(e) => { e.stopPropagation(); handleSelect(template.content); }}>Seç</Button> {/* Prevent card click, trigger select */}
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

    