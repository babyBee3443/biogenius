
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Twitter, Facebook, Linkedin } from 'lucide-react';
import { getArticleById, getArticles, type ArticleData } from '@/lib/mock-data'; // Import mock data functions
import type { Block } from '@/components/admin/template-selector'; // Import Block type

// --- Block Rendering Components ---
const TextBlockRenderer: React.FC<{ block: Extract<Block, { type: 'text' }> }> = ({ block }) => (
  <div dangerouslySetInnerHTML={{ __html: block.content.replace(/\n/g, '<br />') }} /> // Basic newline handling
);

const HeadingBlockRenderer: React.FC<{ block: Extract<Block, { type: 'heading' }> }> = ({ block }) => {
  const Tag = `h${block.level}` as keyof JSX.IntrinsicElements;
  return <Tag>{block.content}</Tag>;
};

const ImageBlockRenderer: React.FC<{ block: Extract<Block, { type: 'image' }> }> = ({ block }) => (
    <figure className="my-6">
        <Image
            src={block.url}
            alt={block.alt || 'Makale Görseli'}
            width={800}
            height={450} // Adjusted height
            className="rounded-lg shadow-md mx-auto max-w-full h-auto"
            data-ai-hint="article content image"
         />
        {block.caption && <figcaption className="text-center text-sm text-muted-foreground mt-2">{block.caption}</figcaption>}
    </figure>
);

const QuoteBlockRenderer: React.FC<{ block: Extract<Block, { type: 'quote' }> }> = ({ block }) => (
    <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-6">
        <p>{block.content}</p>
        {block.citation && <footer className="mt-2 text-sm not-italic">— {block.citation}</footer>}
    </blockquote>
);

const DividerBlockRenderer: React.FC = () => (
    <hr className="my-8 border-border/50" />
);

const VideoBlockRenderer: React.FC<{ block: Extract<Block, { type: 'video' }> }> = ({ block }) => {
    // Extract YouTube ID from various URL formats
    const getYouTubeId = (url: string): string | null => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = block.youtubeId || getYouTubeId(block.url);

    if (videoId) {
        return (
            <div className="aspect-video my-6 shadow-md rounded-lg overflow-hidden">
                <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
        );
    }
     // Fallback for non-YouTube URLs
     if (block.url) {
         return (
             <div className="my-6 text-center">
                <a href={block.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    Videoyu izle: {block.url}
                 </a>
                 <p className="text-xs text-muted-foreground">(Desteklenmeyen video formatı)</p>
             </div>
         );
     }

     return <PlaceholderBlockRenderer type="video" />;
};

// Add renderers for other block types (Gallery, Code, Section) as needed
const PlaceholderBlockRenderer: React.FC<{ type: string }> = ({ type }) => (
  <div className="bg-muted p-4 rounded my-4 text-center text-muted-foreground italic">
    [{type} Bloku İçeriği]
  </div>
);

// Function to render a single block
const renderBlock = (block: Block) => {
    switch (block.type) {
        case 'text':
            return <TextBlockRenderer key={block.id} block={block} />;
        case 'heading':
            return <HeadingBlockRenderer key={block.id} block={block} />;
        case 'image':
            return <ImageBlockRenderer key={block.id} block={block} />;
        case 'quote':
            return <QuoteBlockRenderer key={block.id} block={block} />;
        case 'divider':
            return <DividerBlockRenderer key={block.id} />;
        case 'video':
            return <VideoBlockRenderer key={block.id} block={block} />;
        // Add cases for other block types
        case 'gallery':
        case 'code':
        case 'section': // Sections might not be directly rendered here, depends on implementation
        default:
            return <PlaceholderBlockRenderer key={block.id} type={block.type} />;
    }
};

interface ArticlePageProps {
  params: {
    id: string;
  };
}

// Function to safely render HTML content (Basic - Consider DOMPurify for production)
function createMarkup(htmlContent: string) {
    // WARNING: This is a basic example. For production, use a robust sanitizer like DOMPurify.
    // const sanitizedHtml = DOMPurify.sanitize(htmlContent);
    // For this mock environment, we'll do very basic script tag removal.
    const sanitizedHtml = htmlContent?.replace(/<script.*?>.*?<\/script>/gi, '') || '';
    return { __html: sanitizedHtml };
}


export async function generateStaticParams() {
  // Generate static paths for all PUBLISHED articles
  const articles = await getArticles();
  return articles
      .filter(article => article.status === 'Yayınlandı') // Only generate for published
      .map((article) => ({
         id: article.id,
      }));
}


export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getArticleById(params.id);

  // If article not found or not published, return 404
  if (!article || article.status !== 'Yayınlandı') {
    notFound();
  }

  const categoryLinkClass = article.category === 'Teknoloji'
    ? 'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
    : 'text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300';

  // Fetch related articles (simple example: same category, not the current one)
  const allArticles = await getArticles();
  const relatedArticles = allArticles
      .filter(a => a.status === 'Yayınlandı' && a.category === article.category && a.id !== article.id)
      .slice(0, 2); // Limit to 2 related articles

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <header className="mb-10 pt-4">
         <Link href={`/categories/${article.category.toLowerCase()}`} className={`text-sm font-medium mb-3 inline-block tracking-wide uppercase ${categoryLinkClass}`}>
           {article.category}
         </Link>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{article.title}</h1>
        {article.excerpt && <p className="text-lg md:text-xl text-muted-foreground">{article.excerpt}</p>}
        <p className="text-sm text-muted-foreground mt-3">Yazar: {article.authorId} | Yayınlanma: {new Date(article.createdAt).toLocaleDateString('tr-TR')}</p>
      </header>

      {article.mainImageUrl && (
          <div className="mb-10 shadow-xl rounded-lg overflow-hidden">
            <Image
                src={article.mainImageUrl}
                alt={article.title}
                width={1200}
                height={600}
                className="w-full h-auto object-cover"
                priority
                data-ai-hint="article main image"
            />
          </div>
      )}


      {/* Render Blocks */}
      <div className="prose dark:prose-invert lg:prose-lg max-w-none mb-12">
        {article.blocks && article.blocks.length > 0 ? (
             article.blocks.map(renderBlock)
         ) : (
             // Fallback if blocks array is empty or undefined
             <div dangerouslySetInnerHTML={createMarkup(article.content || '<p class="italic text-muted-foreground">[İçerik bulunamadı]</p>')} />
         )}
      </div>


      {/* Related Articles, Sharing Buttons, Comments */}
       {relatedArticles.length > 0 && (
          <div className="mt-16 border-t border-border/50 pt-10">
             <h2 className="text-2xl font-semibold mb-6">İlgili Makaleler</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {relatedArticles.map(relArticle => (
                     <Link key={relArticle.id} href={`/articles/${relArticle.id}`} className="block group">
                        <Card className="h-full flex flex-col overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                             {relArticle.mainImageUrl && (
                                 <div className="relative h-40 overflow-hidden">
                                    <Image
                                         src={relArticle.mainImageUrl}
                                         alt={relArticle.title}
                                         layout="fill"
                                         objectFit="cover"
                                         className="transition-transform duration-300 group-hover:scale-105"
                                         data-ai-hint="related article abstract"
                                     />
                                 </div>
                             )}
                             <CardContent className="p-4 flex-grow">
                                 <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">{relArticle.title}</h3>
                                 <p className="text-sm text-muted-foreground line-clamp-2">{relArticle.excerpt}</p>
                             </CardContent>
                        </Card>
                     </Link>
                 ))}
             </div>
           </div>
       )}

       <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Paylaş</h2>
           <div className="flex space-x-3">
              {/* Add actual sharing links later */}
              <Button variant="outline" size="icon" aria-label="Twitter'da paylaş">
                  <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" aria-label="Facebook'ta paylaş">
                  <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" aria-label="LinkedIn'de paylaş">
                 <Linkedin className="h-5 w-5" />
              </Button>
           </div>
       </div>

       <div className="mt-16">
         <h2 className="text-2xl font-semibold mb-6">Yorumlar</h2>
         <div className="bg-secondary/50 p-6 rounded-lg">
           <p className="text-muted-foreground">Yorum yapma özelliği yakında aktif olacaktır.</p>
           {/* TODO: Implement Comments Component */}
         </div>
       </div>

       <div className="mt-16 mb-8 text-center">
           <Button asChild variant="outline">
               <Link href="/" className="inline-flex items-center">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Ana Sayfaya Dön
               </Link>
           </Button>
       </div>
    </article>
  );
}
