
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
        <img src="https://picsum.photos/seed/articleimg1/800/400" alt="Ana Görsel" />
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        <h2>Alt Başlık</h2>
        <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
    `
  },
  {
    id: 'listicle',
    name: 'Listeleme Makalesi',
    description: 'Numaralı veya madde işaretli listeler içeren makaleler için uygundur.',
    previewImageUrl: 'https://picsum.photos/seed/template2/300/200',
    content: `
        <h1>Listeleme Makale Başlığı</h1>
        <p>Giriş paragrafı buraya gelecek.</p>
        <ol>
            <li>Madde 1</li>
            <li>Madde 2</li>
            <li>Madde 3</li>
        </ol>
        <p>Sonuç paragrafı.</p>
    `
  },
  {
    id: 'image-gallery',
    name: 'Görsel Galerisi',
    description: 'Görsellerin ön planda olduğu, açıklamalı galeri düzeni.',
    previewImageUrl: 'https://picsum.photos/seed/template3/300/200',
    content: `
        <h1>Görsel Galerisi Başlığı</h1>
        <p>Galeri hakkında kısa bir açıklama.</p>
        <figure>
            <img src="https://picsum.photos/seed/gallery1/600/400" alt="Görsel 1" />
            <figcaption>Görsel 1 Açıklaması</figcaption>
        </figure>
        <figure>
            <img src="https://picsum.photos/seed/gallery2/600/400" alt="Görsel 2" />
            <figcaption>Görsel 2 Açıklaması</figcaption>
        </figure>
    `
  },
    {
    id: 'faq-article',
    name: 'SSS Makalesi',
    description: 'Sıkça sorulan sorular ve cevapları formatında bir düzen.',
    previewImageUrl: 'https://picsum.photos/seed/template4/300/200',
    content: `
        <h1>SSS Makale Başlığı</h1>
        <h2>Soru 1?</h2>
        <p>Cevap 1 buraya gelecek.</p>
        <h2>Soru 2?</h2>
        <p>Cevap 2 buraya gelecek.</p>
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
      <DialogContent className="sm:max-w-[60%] lg:max-w-[50%] max-h-[80vh] flex flex-col"> {/* Adjusted width and height */}
        <DialogHeader>
          <DialogTitle>Makale Şablonu Seç</DialogTitle>
          <DialogDescription>
            İçeriğinizi oluşturmaya başlamak için hazır bir şablon seçin. Şablon içeriği mevcut içeriğinizin üzerine yazılacaktır.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-grow pr-4 -mr-4"> {/* Added ScrollArea */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
                {templates.map((template) => (
                    <Card key={template.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleSelect(template.content)}>
                        <CardHeader className="p-0">
                            <Image
                                src={template.previewImageUrl}
                                alt={`${template.name} önizlemesi`}
                                width={300}
                                height={200}
                                className="w-full h-32 object-cover rounded-t-lg"
                            />
                        </CardHeader>
                        <CardContent className="p-4">
                            <CardTitle className="text-base font-semibold mb-1">{template.name}</CardTitle>
                            <p className="text-xs text-muted-foreground">{template.description}</p>
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
