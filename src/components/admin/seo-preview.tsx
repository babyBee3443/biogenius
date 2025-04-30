
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Search, CircleAlert } from 'lucide-react';

interface SeoPreviewProps {
  title?: string;
  description?: string;
  slug?: string;
  category?: string;
}

const SeoPreview: React.FC<SeoPreviewProps> = ({
  title = "Makale Başlığı",
  description = "Bu makale için henüz bir açıklama girilmedi...",
  slug = "makale-url",
  category = "kategori",
}) => {
  const siteUrlBase = "teknobiyo.com"; // Replace with actual domain if needed
  const fullUrl = `${siteUrlBase} › ${category.toLowerCase()} › ${slug}`;
  const displayTitle = title || "Makale Başlığı";
  const displayDescription = description
    ? description.length > 160
      ? description.substring(0, 157) + '...'
      : description
    : "Bu makale için henüz bir açıklama girilmedi...";

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Search className="h-5 w-5 text-muted-foreground" />
          SEO Önizleme (Google)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="border p-4 rounded-lg space-y-1 bg-muted/20">
           <span className="text-sm text-muted-foreground block truncate">{fullUrl}</span>
           <h3 className="text-blue-700 dark:text-blue-400 text-xl font-medium hover:underline cursor-pointer truncate">
             {displayTitle}
           </h3>
           <p className="text-sm text-muted-foreground line-clamp-2">{displayDescription}</p>
        </div>

         <Separator />

         <div>
            <h4 className="text-base font-semibold mb-3">SEO İpuçları</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                    <CircleAlert className="h-4 w-4 mt-0.5 text-yellow-500 flex-shrink-0" />
                    <span>Başlık uzunluğu ideal olarak <strong>50-60 karakter</strong> arasında olmalı.</span>
                </li>
                <li className="flex items-start gap-2">
                    <CircleAlert className="h-4 w-4 mt-0.5 text-yellow-500 flex-shrink-0" />
                    <span>Açıklama uzunluğu ideal olarak <strong>150-160 karakter</strong> arasında olmalı.</span>
                </li>
                 <li className="flex items-start gap-2">
                    <CircleAlert className="h-4 w-4 mt-0.5 text-yellow-500 flex-shrink-0" />
                    <span>Anahtar kelimeler belirlenmiş olmalı.</span>
                </li>
            </ul>
         </div>
      </CardContent>
    </Card>
  );
};

export default SeoPreview;
