"use client"; // Make this a client component

import * as React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Twitter, Facebook, Linkedin, Loader2 } from 'lucide-react'; // Added Loader2
import { getArticleById, getArticles, type ArticleData } from '@/lib/mock-data';
import type { Block } from '@/components/admin/template-selector';
import { ArticleCard } from '@/components/article-card';
import { cn } from '@/lib/utils';

// --- Block Rendering Components ---
const TextBlockRenderer: React.FC<{ block: Extract<Block, { type: 'text' }> }> = ({ block }) => (
  <div dangerouslySetInnerHTML={{ __html: block.content.replace(/\n/g, '<br />') }} />
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
            height={450}
            className="rounded-lg shadow-md mx-auto max-w-full h-auto"
            data-ai-hint="article content image"
            loading="lazy"
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
                    loading="lazy"
                ></iframe>
            </div>
        );
    }
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

const PlaceholderBlockRenderer: React.FC<{ type: string }> = ({ type }) => (
  <div className="bg-muted p-4 rounded my-4 text-center text-muted-foreground italic">
    [{type} Bloku İçeriği]
  </div>
);

const renderBlock = (block: Block) => {
    switch (block.type) {
        case 'text': return <TextBlockRenderer key={block.id} block={block} />;
        case 'heading': return <HeadingBlockRenderer key={block.id} block={block} />;
        case 'image': return <ImageBlockRenderer key={block.id} block={block} />;
        case 'quote': return <QuoteBlockRenderer key={block.id} block={block} />;
        case 'divider': return <DividerBlockRenderer key={block.id} />;
        case 'video': return <VideoBlockRenderer key={block.id} block={block} />;
        case 'gallery':
        case 'code':
        case 'section':
        default: return <PlaceholderBlockRenderer key={block.id} type={block.type} />;
    }
};

interface ArticlePageProps {
  params: {
    id: string;
  };
}

function createMarkup(htmlContent: string) {
    const sanitizedHtml = htmlContent?.replace(/<script.*?>.*?<\/script>/gi, '') || '';
    return { __html: sanitizedHtml };
}

// generateStaticParams can remain as is for public, published articles.
// Next.js will attempt to render other paths dynamically if not found here.
export async function generateStaticParams() {
  const articles = await getArticles();
  return articles
      .filter(article => article.status === 'Yayınlandı')
      .map((article) => ({ id: article.id }));
}


export default function ArticlePage({ params }: ArticlePageProps) {
  const articleId = params.id;
  const [article, setArticle] = React.useState<ArticleData | null>(null);
  const [relatedArticles, setRelatedArticles] = React.useState<ArticleData[]>([]);
  const [currentUserRole, setCurrentUserRole] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          if (isMounted) setCurrentUserRole(user.role || null);
        } catch (e) {
          console.error("Error parsing current user from localStorage", e);
          if (isMounted) setCurrentUserRole(null);
        }
      }
    }

    const fetchArticleData = async () => {
      if (!articleId) {
        if (isMounted) setLoading(false);
        notFound();
        return;
      }

      try {
        const fetchedArticle = await getArticleById(articleId);
        
        if (isMounted) {
            if (fetchedArticle) {
                setArticle(fetchedArticle);

                // Fetch related articles
                const allArticles = await getArticles();
                const relArticles = allArticles
                    .filter(a => 
                        (a.status === 'Yayınlandı' || ( (currentUserRole === 'Admin' || currentUserRole === 'Editor') && a.status === 'Hazır')) && // Show ready articles to admin/editor
                        a.category === fetchedArticle.category && 
                        a.id !== articleId
                    )
                    .slice(0, 2);
                setRelatedArticles(relArticles);

            } else {
                setArticle(null); // Explicitly set to null if not found
            }
        }
      } catch (error) {
        console.error("Failed to fetch article:", error);
        if (isMounted) setArticle(null); // Handle fetch error
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchArticleData();
    return () => { isMounted = false; };
  }, [articleId, currentUserRole]); // Re-fetch if articleId or userRole changes

  // Determine visibility after data is loaded
  const isVisible = React.useMemo(() => {
    if (!article) return false;
    if (article.status === 'Yayınlandı') return true;
    if ((currentUserRole === 'Admin' || currentUserRole === 'Editor') && article.status === 'Hazır') return true;
    return false;
  }, [article, currentUserRole]);


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        Makale yükleniyor...
      </div>
    );
  }

  if (!article || !isVisible) {
    notFound();
  }

  const categoryLinkClass = article.category === 'Teknoloji'
    ? 'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
    : 'text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300';

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

      <div className="prose dark:prose-invert lg:prose-lg max-w-none mb-12">
        {article.blocks && article.blocks.length > 0 ? (
             article.blocks.map(renderBlock)
         ) : (
             <div dangerouslySetInnerHTML={createMarkup( '<p class="italic text-muted-foreground">[İçerik bulunamadı]</p>')} />
         )}
      </div>

       {relatedArticles.length > 0 && (
          <div className="mt-16 border-t border-border/50 pt-10">
             <h2 className="text-2xl font-semibold mb-6">İlgili Makaleler</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {relatedArticles.map(relArticle => (
                   <ArticleCard 
                     key={relArticle.id} 
                     article={relArticle} 
                     imageLoading="lazy"
                     imageHint="related article abstract"
                   />
                 ))}
             </div>
           </div>
       )}

       <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Paylaş</h2>
           <div className="flex space-x-3">
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
