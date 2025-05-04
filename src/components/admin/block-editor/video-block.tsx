
import * as React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import type { Block } from '@/components/admin/template-selector';
import Image from 'next/image'; // For thumbnail preview

interface VideoBlockProps {
  block: Extract<Block, { type: 'video' }>;
  onChange: (id: string, value: string | null, field: 'url' | 'youtubeId') => void;
}

const VideoBlock: React.FC<VideoBlockProps> = ({ block, onChange }) => {
  const [videoId, setVideoId] = React.useState<string | null>(block.youtubeId || null);

  // Function to extract YouTube ID from various URL formats
  const getYouTubeId = (url: string): string | null => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const id = (match && match[2].length === 11) ? match[2] : null;
    return id;
  };

  // Handle URL change and update video ID
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    onChange(block.id, newUrl, 'url'); // Update the URL in the parent state

    const newVideoId = getYouTubeId(newUrl);
    setVideoId(newVideoId);
    onChange(block.id, newVideoId, 'youtubeId'); // Update the extracted ID in the parent state
  };

  // Construct thumbnail URL if videoId exists
  const thumbnailUrl = videoId
    ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` // Use hqdefault for better quality preview
    : null;

  return (
    <div className="space-y-3">
      {thumbnailUrl && (
        <div className="mb-3 rounded border p-2 w-fit mx-auto aspect-video bg-black flex items-center justify-center overflow-hidden">
          <Image
            src={thumbnailUrl}
            alt="YouTube Video Thumbnail"
            width={320} // Adjust size as needed
            height={180}
            className="object-contain rounded"
            data-ai-hint="youtube video thumbnail"
          />
        </div>
      )}
      {!thumbnailUrl && block.url && (
        <div className="mb-3 rounded border p-4 w-full text-center text-muted-foreground text-sm bg-muted/50">
            Geçerli bir YouTube URL'si algılanamadı. Lütfen URL'yi kontrol edin.
        </div>
      )}
      <div className="space-y-1">
        <Label htmlFor={`vid-url-${block.id}`} className="text-xs">YouTube Video URL</Label>
        <Input
          id={`vid-url-${block.id}`}
          value={block.url || ''}
          onChange={handleUrlChange}
          placeholder="https://www.youtube.com/watch?v=..."
        />
         <p className="text-xs text-muted-foreground">
            Sadece YouTube videoları desteklenmektedir. Tam URL'yi yapıştırın.
         </p>
      </div>
    </div>
  );
};

export default VideoBlock;
