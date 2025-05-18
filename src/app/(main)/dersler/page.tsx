
"use client";

import * as React from 'react';
import { getCourseById, type Course, type CourseSection, type Lesson } from '@/lib/data/courses';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, CheckCircle, Circle, Video, FileText, Loader2, AlertTriangle, BookCopy } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

// Re-using existing block renderers from article/note pages
const TextBlockRenderer: React.FC<{ block: Extract<Lesson['contentBlocks'][0], { type: 'text' }> }> = ({ block }) => (
  <div dangerouslySetInnerHTML={{ __html: block.content?.replace(/\n/g, '<br />') || '<p class="italic text-muted-foreground">[Boş Metin Bloğu]</p>' }} />
);

const HeadingBlockRenderer: React.FC<{ block: Extract<Lesson['contentBlocks'][0], { type: 'heading' }> }> = ({ block }) => {
  const Tag = `h${block.level}` as keyof JSX.IntrinsicElements;
  return <Tag className={block.level === 2 ? "text-2xl font-semibold mt-6 mb-3" : "text-xl font-medium mt-4 mb-2"}>{block.content || <span className="italic text-muted-foreground">[Boş Başlık]</span>}</Tag>;
};

const ImageBlockRenderer: React.FC<{ block: Extract<Lesson['contentBlocks'][0], { type: 'image' }> }> = ({ block }) => (
    <figure className="my-6">
        {block.url ? (
            <Image
                src={block.url}
                alt={block.alt || 'Ders Görseli'}
                width={700}
                height={394}
                className="rounded-lg shadow-md mx-auto max-w-full h-auto"
                data-ai-hint="lesson content image"
                loading="lazy"
            />
        ) : (
            <div className="bg-muted rounded-lg aspect-video flex items-center justify-center text-muted-foreground italic">
                [Görsel Alanı - URL Yok]
            </div>
        )}
        {block.caption && <figcaption className="text-center text-sm text-muted-foreground mt-2">{block.caption}</figcaption>}
    </figure>
);

const VideoBlockRendererPlayer: React.FC<{ block: Extract<Lesson['contentBlocks'][0], { type: 'video' }> }> = ({ block }) => {
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
     return <div className="my-6 p-4 bg-muted rounded text-muted-foreground italic text-center">Desteklenmeyen video URL veya formatı.</div>;
};


const QuoteBlockRenderer: React.FC<{ block: Extract<Lesson['contentBlocks'][0], { type: 'quote' }> }> = ({ block }) => (
    <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-6 bg-secondary/30 p-4 rounded-r-lg">
        <p>{block.content || <span className="italic text-muted-foreground">[Boş Alıntı]</span>}</p>
        {block.citation && <footer className="mt-2 text-sm not-italic">— {block.citation}</footer>}
    </blockquote>
);

const DividerBlockRenderer: React.FC = () => (
    <hr className="my-8 border-border/50" />
);

const renderLessonBlock = (block: Lesson['contentBlocks'][0]) => {
    switch (block.type) {
        case 'text': return <TextBlockRenderer key={block.id} block={block} />;
        case 'heading': return <HeadingBlockRenderer key={block.id} block={block} />;
        case 'image': return <ImageBlockRenderer key={block.id} block={block} />;
        case 'quote': return <QuoteBlockRenderer key={block.id} block={block} />;
        case 'video': return <VideoBlockRendererPlayer key={block.id} block={block} />;
        case 'divider': return <DividerBlockRenderer key={block.id} />;
        default: return <div key={block.id} className="text-muted-foreground italic text-sm p-2 bg-muted/30 rounded my-2">[{block.type} bloğu desteklenmiyor veya içerik boş]</div>;
    }
};


export default function DerslerPage() {
  const [selectedCourse, setSelectedCourse] = React.useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = React.useState<Lesson | null>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = React.useState(0);
  const [currentLessonIndexInSection, setCurrentLessonIndexInSection] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = React.useState<Set<string>>(new Set());

  const courseIdToLoad = "temel-hucre-biyolojisi";

  React.useEffect(() => {
    const fetchCourse = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const course = await getCourseById(courseIdToLoad);
        if (course) {
          setSelectedCourse(course);
          if (course.sections && course.sections.length > 0 && course.sections[0].lessons && course.sections[0].lessons.length > 0) {
            setSelectedLesson(course.sections[0].lessons[0]);
            setCurrentSectionIndex(0);
            setCurrentLessonIndexInSection(0);
          }
        } else {
          setError("Ders bulunamadı.");
        }
      } catch (err) {
        console.error("Error fetching course:", err);
        setError("Ders yüklenirken bir hata oluştu.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourse();
  }, [courseIdToLoad]);

  const handleLessonClick = (sectionIndex: number, lessonIndex: number) => {
    if (selectedCourse && selectedCourse.sections[sectionIndex] && selectedCourse.sections[sectionIndex].lessons[lessonIndex]) {
      setSelectedLesson(selectedCourse.sections[sectionIndex].lessons[lessonIndex]);
      setCurrentSectionIndex(sectionIndex);
      setCurrentLessonIndexInSection(lessonIndex);
    }
  };

  const totalLessons = selectedCourse?.sections.reduce((acc, section) => acc + (section.lessons?.length || 0), 0) || 0;

  const navigateLesson = (direction: 'next' | 'prev') => {
    if (!selectedCourse) return;

    let currentAbsoluteLessonIndex = 0;
    for (let i = 0; i < currentSectionIndex; i++) {
      currentAbsoluteLessonIndex += selectedCourse.sections[i].lessons.length;
    }
    currentAbsoluteLessonIndex += currentLessonIndexInSection;

    let newAbsoluteLessonIndex = direction === 'next' ? currentAbsoluteLessonIndex + 1 : currentAbsoluteLessonIndex - 1;

    let tempLessonCounter = 0;
    for (let sectionIdx = 0; sectionIdx < selectedCourse.sections.length; sectionIdx++) {
      for (let lessonIdx = 0; lessonIdx < selectedCourse.sections[sectionIdx].lessons.length; lessonIdx++) {
        if (tempLessonCounter === newAbsoluteLessonIndex) {
          setSelectedLesson(selectedCourse.sections[sectionIdx].lessons[lessonIdx]);
          setCurrentSectionIndex(sectionIdx);
          setCurrentLessonIndexInSection(lessonIdx);
          return;
        }
        tempLessonCounter++;
      }
    }
     if (direction === 'next' && newAbsoluteLessonIndex >= totalLessons) {
        const allMarked = completedLessons.size === totalLessons;
        if (allMarked) {
             setTimeout(() => {
                toast({ title: "Tebrikler!", description: "Kursu tamamladınız." });
            }, 0);
        }
    }
  };

  const handleNextLesson = () => navigateLesson('next');
  const handlePrevLesson = () => navigateLesson('prev');
  
  const toggleLessonCompletion = (lessonId: string) => {
    const newSet = new Set(completedLessons);
    let lessonTitle = selectedLesson?.title || "Bu ders";
    if (newSet.has(lessonId)) {
        newSet.delete(lessonId);
         setTimeout(() => {
            toast({ title: "Ders Tamamlanmadı", description: `"${lessonTitle}" dersi tamamlanmadı olarak işaretlendi.`});
        }, 0);
    } else {
        newSet.add(lessonId);
         setTimeout(() => {
            toast({ title: "Ders Tamamlandı!", description: `"${lessonTitle}" dersi tamamlandı olarak işaretlendi.`});
        }, 0);
        
        if (newSet.size === totalLessons && currentLessonNumber === totalLessons) {
            setTimeout(() => {
                 toast({ title: "Tebrikler!", description: "Kursu tamamladınız." });
            }, 50); 
        }
    }
    setCompletedLessons(newSet);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-[calc(100vh-150px)]"><Loader2 className="h-8 w-8 animate-spin text-primary" /> <span className="ml-2">Dersler yükleniyor...</span></div>;
  }

  if (error) {
    return <div className="text-center py-10 text-destructive"><AlertTriangle className="mx-auto h-10 w-10 mb-2"/>{error}</div>;
  }

  if (!selectedCourse) {
    return <div className="text-center py-10 text-muted-foreground">Gösterilecek ders bulunamadı.</div>;
  }

  
  const numCompletedLessons = completedLessons.size;
  const currentLessonNumber = selectedCourse.sections.slice(0, currentSectionIndex).reduce((acc, section) => acc + (section.lessons?.length || 0), 0) + currentLessonIndexInSection + 1;
  const progressPercentage = totalLessons > 0 ? (numCompletedLessons / totalLessons) * 100 : 0;

  const isCurrentLessonCompleted = selectedLesson ? completedLessons.has(selectedLesson.id) : false;

  return (
    <div className="relative flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-72 lg:w-80 border-l md:border-r border-border bg-card flex-shrink-0 md:order-2 md:fixed md:right-0 md:top-16 md:h-[calc(100vh-4rem)]">
        <ScrollArea className="h-full">
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-1">{selectedCourse.title}</h2>
            <p className="text-xs text-muted-foreground mb-3">{selectedCourse.instructor}</p>
             <div className="text-xs text-muted-foreground mb-1">{numCompletedLessons} / {totalLessons} ders tamamlandı</div>
              <Progress value={progressPercentage} className="h-2 mb-4 [&>div]:bg-green-500" aria-label={`${Math.round(progressPercentage)}% tamamlandı`}/>

            {selectedCourse.sections.map((section, sectionIdx) => (
              <div key={section.id} className="mb-4">
                <h3 className="text-sm font-semibold text-foreground mb-2 py-1.5 px-2.5 bg-secondary rounded-md shadow-sm">
                  BÖLÜM {section.order}: {section.title}
                </h3>
                <ul className="space-y-1">
                  {section.lessons.map((lesson, lessonIdx) => {
                    const isCompleted = completedLessons.has(lesson.id);
                    return (
                        <li key={lesson.id}>
                        <Button
                            variant={selectedLesson?.id === lesson.id ? "secondary" : "ghost"}
                            className={cn(
                            "w-full justify-start text-left h-auto py-2.5 px-3 rounded-md",
                            selectedLesson?.id === lesson.id && "bg-primary/10 text-primary dark:bg-primary/20 ring-1 ring-primary/30"
                            )}
                            onClick={() => handleLessonClick(sectionIdx, lessonIdx)}
                        >
                            <div className="flex items-center w-full">
                            {isCompleted ? <CheckCircle className="h-4 w-4 mr-2.5 text-green-500 flex-shrink-0"/> : <Circle className="h-4 w-4 mr-2.5 text-muted-foreground/70 flex-shrink-0"/>}
                            <div className="flex-grow">
                                <span className="block text-sm leading-snug font-medium">{lesson.title}</span>
                                <span className="text-xs text-muted-foreground flex items-center mt-0.5">
                                    {lesson.videoUrl ? <Video size={12} className="inline mr-1"/> : <FileText size={12} className="inline mr-1"/>}
                                    {lesson.estimatedTime || "Bilinmiyor"}
                                </span>
                            </div>
                            </div>
                        </Button>
                        </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </ScrollArea>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-background md:order-1 md:mr-72 lg:md:mr-80">
        {selectedLesson ? (
          <>
            <div className="sticky top-0 md:top-16 bg-background/80 backdrop-blur-sm z-10 border-b p-4 shadow-sm">
                <h1 className="text-2xl font-bold">{selectedLesson.title}</h1>
                <p className="text-sm text-muted-foreground">Ders {currentLessonNumber} / {totalLessons}</p>
            </div>
            <div className="p-6 md:p-8">
              {selectedLesson.videoUrl && (
                <div className="aspect-video mb-6 rounded-lg overflow-hidden shadow-lg">
                  <iframe
                    width="100%"
                    height="100%"
                    src={selectedLesson.videoUrl.replace("watch?v=", "embed/")}
                    title={selectedLesson.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
                </div>
              )}
              <div className="prose dark:prose-invert max-w-none">
                {selectedLesson.contentBlocks.map(renderLessonBlock)}
              </div>
              <div className="mt-8 border-t pt-6 space-y-4">
                <Button
                    variant={isCurrentLessonCompleted ? "outline" : "default"}
                    onClick={() => toggleLessonCompletion(selectedLesson.id)}
                    className={cn("w-full sm:w-auto shadow-sm", isCurrentLessonCompleted && "border-green-500 text-green-600 hover:bg-green-500/10")}
                >
                    {isCurrentLessonCompleted ? (
                        <> <CheckCircle className="mr-2 h-4 w-4"/> Tamamlandı İşaretini Kaldır</>
                    ) : (
                        <> <Circle className="mr-2 h-4 w-4"/> Dersi Tamamlandı Olarak İşaretle</>
                    )}
                </Button>
                <div className="flex justify-between">
                    <Button
                        variant="outline"
                        onClick={handlePrevLesson}
                        disabled={currentLessonNumber <= 1}
                        className="shadow-sm"
                    >
                        <ChevronLeft className="mr-2 h-4 w-4" /> Önceki Ders
                    </Button>
                    <Button
                        variant="default"
                        onClick={handleNextLesson}
                        disabled={currentLessonNumber >= totalLessons}
                        className="shadow-sm"
                    >
                        Sonraki Ders <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
               </div>
            </div>
          </>
        ) : (
          <div className="p-8 text-center text-muted-foreground flex flex-col items-center justify-center h-full">
             <BookCopy className="h-12 w-12 text-muted-foreground/50 mb-4" />
            Başlamak için lütfen sağ taraftan bir ders seçin.
          </div>
        )}
      </main>
    </div>
  );
}
