
"use client";

import * as React from 'react';
import { useRouter, useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { toast } from "@/hooks/use-toast";
import { BlockEditor } from "@/components/admin/block-editor";
import type { Block } from "@/components/admin/template-selector";
import {
    getCourseById, updateCourse, deleteCourse, type Course, type CourseSection, type Lesson,
    addSectionToCourse, updateSectionInCourse, deleteSectionFromCourse,
    addLessonToSection, updateLessonInSection, deleteLessonFromSection
} from '@/lib/data/courses';
import { getCategories, type Category } from '@/lib/data/categories';
import { generateId } from '@/lib/utils';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
    ArrowLeft, Eye, Loader2, Save, Trash2, PlusCircle, Edit2, ChevronDown, ChevronUp, BookOpen as DerslerIcon, AlertTriangle, Video
} from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';
import { usePermissions } from "@/hooks/usePermissions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

interface EditingLessonState {
    sectionId: string;
    lessonId: string;
    title: string;
    order: number;
    estimatedTime?: string;
    videoUrl?: string;
    contentBlocks: Block[];
}

export default function EditDersPage() {
    const router = useRouter();
    const params = useParams();
    const courseId = params.id as string;
    const { hasPermission, isLoading: permissionsLoading } = usePermissions();

    const [course, setCourse] = React.useState<Course | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [saving, setSaving] = React.useState(false);
    const [categories, setCategories] = React.useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = React.useState(true);

    // Course Info States
    const [title, setTitle] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [category, setCategory] = React.useState("");
    const [coverImageUrl, setCoverImageUrl] = React.useState("");
    const [instructor, setInstructor] = React.useState("");

    // Section & Lesson Management States
    const [isAddingSection, setIsAddingSection] = React.useState(false);
    const [newSectionTitle, setNewSectionTitle] = React.useState("");
    const [editingSection, setEditingSection] = React.useState<CourseSection | null>(null);

    const [isAddingLessonToSectionId, setIsAddingLessonToSectionId] = React.useState<string | null>(null);
    const [newLessonTitle, setNewLessonTitle] = React.useState("");
    const [newLessonOrder, setNewLessonOrder] = React.useState(1);
    const [newLessonTime, setNewLessonTime] = React.useState("");
    const [newLessonVideoUrl, setNewLessonVideoUrl] = React.useState("");

    const [currentlyEditingLesson, setCurrentlyEditingLesson] = React.useState<EditingLessonState | null>(null);
    const [selectedBlockId, setSelectedBlockId] = React.useState<string | null>(null);

    const [itemToDelete, setItemToDelete] = React.useState<{ type: 'course' | 'section' | 'lesson', id: string, parentId?: string, title: string } | null>(null);


    React.useEffect(() => {
        if (!permissionsLoading && !hasPermission('Dersleri Yönetme')) {
            toast({ variant: "destructive", title: "Erişim Reddedildi", description: "Bu kursu düzenleme yetkiniz yok." });
            router.push('/admin/dersler');
            return;
        }

        const fetchData = async () => {
            if (!courseId) {
                setLoading(false);
                notFound();
                return;
            }
            setLoading(true);
            try {
                const [courseData, categoriesData] = await Promise.all([
                    getCourseById(courseId),
                    getCategories()
                ]);
                if (courseData) {
                    setCourse(courseData);
                    setTitle(courseData.title);
                    setDescription(courseData.description);
                    setCategory(courseData.category);
                    setCoverImageUrl(courseData.coverImageUrl || "");
                    setInstructor(courseData.instructor || "");
                } else {
                    notFound();
                }
                setCategories(categoriesData);
            } catch (err) {
                console.error("Error fetching course/categories data:", err);
                toast({ variant: "destructive", title: "Hata", description: "Kurs veya kategori bilgileri yüklenemedi." });
            } finally {
                setLoading(false);
                setLoadingCategories(false);
            }
        };
        if (!permissionsLoading && hasPermission('Dersleri Yönetme')) {
            fetchData();
        }
    }, [courseId, permissionsLoading, hasPermission, router]);

    // --- Course Info Save ---
    const handleSaveCourseInfo = async () => {
        if (!title || !category || !description) {
            toast({ variant: "destructive", title: "Eksik Bilgi", description: "Lütfen Başlık, Kategori ve Açıklama alanlarını doldurun." });
            return;
        }
        setSaving(true);
        try {
            const updated = await updateCourse(courseId, { title, description, category, coverImageUrl, instructor });
            if (updated) {
                setCourse(updated);
                toast({ title: "Kurs Bilgileri Kaydedildi" });
            } else {
                toast({ variant: "destructive", title: "Kaydetme Hatası" });
            }
        } catch (err) { toast({ variant: "destructive", title: "Kaydetme Hatası" }); }
        finally { setSaving(false); }
    };

    // --- Section Management ---
    const handleAddSection = async () => {
        if (!newSectionTitle.trim()) {
            toast({ variant: "destructive", title: "Bölüm başlığı boş olamaz." });
            return;
        }
        setSaving(true);
        const order = course ? course.sections.length + 1 : 1;
        const updatedCourse = await addSectionToCourse(courseId, { title: newSectionTitle, order });
        if (updatedCourse) {
            setCourse(updatedCourse);
            setNewSectionTitle("");
            setIsAddingSection(false);
            toast({ title: "Bölüm Eklendi" });
        } else { toast({ variant: "destructive", title: "Bölüm Ekleme Hatası" });}
        setSaving(false);
    };

    const handleUpdateSection = async (sectionId: string, newTitle: string) => {
        if (!newTitle.trim()) {
            toast({ variant: "destructive", title: "Bölüm başlığı boş olamaz." });
            return;
        }
        setSaving(true);
        const updatedCourse = await updateSectionInCourse(courseId, sectionId, { title: newTitle });
        if (updatedCourse) {
            setCourse(updatedCourse);
            setEditingSection(null); // Close edit form
            toast({ title: "Bölüm Güncellendi" });
        } else { toast({ variant: "destructive", title: "Bölüm Güncelleme Hatası" }); }
        setSaving(false);
    };

    const initiateDelete = (type: 'course' | 'section' | 'lesson', id: string, title: string, parentId?: string) => {
        setItemToDelete({ type, id, title, parentId });
    };

    const confirmDeleteItem = async () => {
        if (!itemToDelete) return;
        setSaving(true);
        let updatedCourse: Course | null = null;
        try {
            if (itemToDelete.type === 'course') {
                const success = await deleteCourse(itemToDelete.id);
                if (success) {
                    toast({ title: "Kurs Silindi" });
                    router.push('/admin/dersler');
                } else throw new Error("Kurs silinemedi");
            } else if (itemToDelete.type === 'section') {
                updatedCourse = await deleteSectionFromCourse(courseId, itemToDelete.id);
            } else if (itemToDelete.type === 'lesson' && itemToDelete.parentId) {
                updatedCourse = await deleteLessonFromSection(courseId, itemToDelete.parentId, itemToDelete.id);
                 if (currentlyEditingLesson?.lessonId === itemToDelete.id) {
                    setCurrentlyEditingLesson(null); // Close editor if deleted lesson was being edited
                }
            }

            if (updatedCourse) {
                setCourse(updatedCourse);
                toast({ title: `${itemToDelete.type === 'section' ? 'Bölüm' : 'Ders'} Silindi` });
            }
        } catch (err) { toast({ variant: "destructive", title: "Silme Hatası" }); }
        finally {
            setSaving(false);
            setItemToDelete(null);
        }
    };


    // --- Lesson Management ---
    const handleAddLesson = async (sectionId: string) => {
        if (!newLessonTitle.trim()) {
            toast({ variant: "destructive", title: "Ders başlığı boş olamaz." });
            return;
        }
        setSaving(true);
        const updatedCourse = await addLessonToSection(courseId, sectionId, {
            title: newLessonTitle,
            order: newLessonOrder,
            estimatedTime: newLessonTime,
            videoUrl: newLessonVideoUrl
        });
        if (updatedCourse) {
            setCourse(updatedCourse);
            setNewLessonTitle(""); setNewLessonOrder(1); setNewLessonTime(""); setNewLessonVideoUrl("");
            setIsAddingLessonToSectionId(null);
            toast({ title: "Ders Eklendi" });
        } else { toast({ variant: "destructive", title: "Ders Ekleme Hatası" }); }
        setSaving(false);
    };

    const handleEditLessonClick = (sectionId: string, lesson: Lesson) => {
        setCurrentlyEditingLesson({
            sectionId: sectionId,
            lessonId: lesson.id,
            title: lesson.title,
            order: lesson.order,
            estimatedTime: lesson.estimatedTime,
            videoUrl: lesson.videoUrl,
            contentBlocks: JSON.parse(JSON.stringify(lesson.contentBlocks)), // Deep copy
        });
         setSelectedBlockId(null); // Reset block selection
    };

    const handleSaveLessonChanges = async () => {
        if (!currentlyEditingLesson) return;
        setSaving(true);
        const { sectionId, lessonId, ...lessonData } = currentlyEditingLesson;
        const updatedCourse = await updateLessonInSection(courseId, sectionId, lessonId, lessonData);
        if (updatedCourse) {
            setCourse(updatedCourse);
            toast({ title: "Ders Kaydedildi" });
            // Optionally close editor or keep it open
            // setCurrentlyEditingLesson(null);
        } else {
            toast({ variant: "destructive", title: "Ders Kaydetme Hatası" });
        }
        setSaving(false);
    };
    
    // Block Editor Handlers for Lesson Content
    const handleAddBlockToLesson = (type: Block['type']) => {
        if (!currentlyEditingLesson) return;
        const newBlock: Block = {
            id: generateId(), type,
            ...(type === 'text' && { content: '' }),
            ...(type === 'heading' && { level: 2, content: '' }),
            ...(type === 'image' && { url: '', alt: '', caption: '' }),
            ...(type === 'video' && { url: ''}),
            ...(type === 'quote' && { content: '', citation: '' }),
            ...(type === 'divider' && {}),
        } as Block;
        setCurrentlyEditingLesson(prev => prev ? { ...prev, contentBlocks: [...prev.contentBlocks, newBlock] } : null);
        setSelectedBlockId(newBlock.id);
    };

    const handleDeleteBlockFromLesson = (id: string) => {
        if (!currentlyEditingLesson) return;
        setCurrentlyEditingLesson(prev => prev ? { ...prev, contentBlocks: prev.contentBlocks.filter(b => b.id !== id) } : null);
        if (selectedBlockId === id) setSelectedBlockId(null);
    };

    const handleUpdateBlockInLesson = (updatedBlock: Block) => {
        if (!currentlyEditingLesson) return;
        setCurrentlyEditingLesson(prev => prev ? {
            ...prev,
            contentBlocks: prev.contentBlocks.map(b => b.id === updatedBlock.id ? updatedBlock : b)
        } : null);
    };

    const handleReorderBlocksInLesson = (reorderedBlocks: Block[]) => {
        if (!currentlyEditingLesson) return;
        setCurrentlyEditingLesson(prev => prev ? { ...prev, contentBlocks: reorderedBlocks } : null);
    };


    if (loading || permissionsLoading || loadingCategories) {
        return (
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-between px-6 py-3 border-b bg-card sticky top-0 z-10">
                    <Skeleton className="h-8 w-24 rounded-md" />
                    <Skeleton className="h-8 w-48 rounded-md" />
                    <div className="flex gap-2">
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-8 w-20 rounded-md" />
                    </div>
                </div>
                <div className="flex-1 p-6 space-y-6">
                    <Skeleton className="h-12 w-1/3 rounded-md" />
                    <Skeleton className="h-40 w-full rounded-md" />
                    <Skeleton className="h-64 w-full rounded-md" />
                </div>
            </div>
        );
    }
    if (!course) return notFound();


    return (
        <>
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-6 py-3 border-b bg-card sticky top-0 z-20">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/admin/dersler"><ArrowLeft className="mr-2 h-4 w-4" /> Kurs Listesine Dön</Link>
                </Button>
                <h1 className="text-xl font-semibold truncate" title={`Kursu Düzenle: ${title}`}>
                    <DerslerIcon className="inline h-5 w-5 mr-1.5 text-primary"/>Kursu Düzenle
                </h1>
                <div className="flex items-center gap-2">
                    <Button variant="destructive" size="sm" onClick={() => initiateDelete('course', course.id, course.title)} disabled={saving}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button size="sm" onClick={handleSaveCourseInfo} disabled={saving || !title || !category || !description}>
                        <Save className="mr-2 h-4 w-4" /> Kurs Bilgilerini Kaydet
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                <Tabs defaultValue="info" className="w-full">
                    <TabsList className="mb-6">
                        <TabsTrigger value="info">Kurs Bilgileri</TabsTrigger>
                        <TabsTrigger value="content">Bölümler ve Dersler</TabsTrigger>
                    </TabsList>

                    <TabsContent value="info">
                        <Card>
                            <CardHeader><CardTitle>Temel Kurs Bilgileri</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                {/* Course Info Form Fields */}
                                <div className="space-y-2">
                                    <Label htmlFor="course-title">Kurs Başlığı <span className="text-destructive">*</span></Label>
                                    <Input id="course-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="course-description">Açıklama <span className="text-destructive">*</span></Label>
                                    <Textarea id="course-description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} required />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="course-category">Kategori <span className="text-destructive">*</span></Label>
                                        <Select value={category} onValueChange={(value) => setCategory(value)} required>
                                            <SelectTrigger id="course-category"><SelectValue placeholder="Kategori seçin" /></SelectTrigger>
                                            <SelectContent>
                                                {categories.map(cat => <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="course-instructor">Eğitmen</Label>
                                        <Input id="course-instructor" value={instructor} onChange={(e) => setInstructor(e.target.value)} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="course-coverImageUrl">Kapak Görseli URL</Label>
                                    <Input id="course-coverImageUrl" value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)} />
                                </div>
                                <div className="flex justify-end">
                                     <Button onClick={handleSaveCourseInfo} disabled={saving || !title || !category || !description}>
                                        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Kurs Bilgilerini Kaydet
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="content">
                        <Card>
                            <CardHeader>
                                <CardTitle>Kurs İçeriği</CardTitle>
                                <CardDescription>Bölümleri ve dersleri yönetin. Ders içeriklerini düzenlemek için dersi seçin.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Sections Management */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Bölümler</h3>
                                    {course.sections.sort((a,b) => a.order - b.order).map(section => (
                                        <Card key={section.id} className="bg-muted/50">
                                            <CardHeader className="flex flex-row items-center justify-between p-4">
                                                {editingSection?.id === section.id ? (
                                                    <Input value={editingSection.title} onChange={(e) => setEditingSection({...editingSection, title: e.target.value})} className="flex-grow mr-2 h-9"/>
                                                ) : (
                                                    <CardTitle className="text-md flex-grow">{section.order}. {section.title}</CardTitle>
                                                )}
                                                <div className="flex gap-1">
                                                    {editingSection?.id === section.id ? (
                                                        <Button size="sm" variant="default" onClick={() => handleUpdateSection(section.id, editingSection.title)} disabled={saving}>Kaydet</Button>
                                                    ) : (
                                                        <Button size="sm" variant="outline" onClick={() => setEditingSection(section)} disabled={saving}><Edit2 className="h-4 w-4"/></Button>
                                                    )}
                                                    <Button size="sm" variant="destructive" onClick={() => initiateDelete('section', section.id, section.title)} disabled={saving}><Trash2 className="h-4 w-4"/></Button>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="p-4 pt-0">
                                                {/* Lessons within this section */}
                                                <div className="space-y-2 mt-2 pl-4 border-l-2">
                                                    {section.lessons.sort((a,b) => a.order - b.order).map(lesson => (
                                                        <div key={lesson.id} className="flex items-center justify-between p-2 rounded hover:bg-background transition-colors">
                                                            <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleEditLessonClick(section.id, lesson)}>
                                                                {lesson.videoUrl && <Video className="h-4 w-4 text-muted-foreground"/>}
                                                                <span>{lesson.order}. {lesson.title} ({lesson.estimatedTime || 'N/A'})</span>
                                                            </div>
                                                            <div className="flex gap-1">
                                                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditLessonClick(section.id, lesson)}><Edit2 className="h-3.5 w-3.5"/></Button>
                                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => initiateDelete('lesson', lesson.id, lesson.title, section.id)}><Trash2 className="h-3.5 w-3.5"/></Button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {isAddingLessonToSectionId === section.id ? (
                                                        <div className="p-3 border rounded bg-background mt-2 space-y-2">
                                                            <Input placeholder="Yeni Ders Başlığı" value={newLessonTitle} onChange={e => setNewLessonTitle(e.target.value)} className="h-8 text-sm"/>
                                                            <div className="flex gap-2">
                                                                <Input type="number" placeholder="Sıra" value={newLessonOrder} onChange={e => setNewLessonOrder(parseInt(e.target.value) || 1)} className="h-8 text-sm w-20"/>
                                                                <Input placeholder="Tahmini Süre (örn: 15 dk)" value={newLessonTime} onChange={e => setNewLessonTime(e.target.value)} className="h-8 text-sm"/>
                                                            </div>
                                                            <Input placeholder="Video URL (YouTube Embed)" value={newLessonVideoUrl} onChange={e => setNewLessonVideoUrl(e.target.value)} className="h-8 text-sm"/>
                                                            <div className="flex justify-end gap-2">
                                                                <Button size="xs" variant="outline" onClick={() => setIsAddingLessonToSectionId(null)}>İptal</Button>
                                                                <Button size="xs" onClick={() => handleAddLesson(section.id)} disabled={saving}>Ders Ekle</Button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                         <Button size="sm" variant="outline" className="mt-2 w-full justify-start" onClick={() => setIsAddingLessonToSectionId(section.id)}><PlusCircle className="mr-2 h-4 w-4"/>Bu Bölüme Ders Ekle</Button>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                    {isAddingSection ? (
                                        <Card className="mt-4 p-4 space-y-2">
                                            <Input placeholder="Yeni Bölüm Başlığı" value={newSectionTitle} onChange={e => setNewSectionTitle(e.target.value)} />
                                            <div className="flex justify-end gap-2">
                                                <Button variant="outline" onClick={() => setIsAddingSection(false)}>İptal</Button>
                                                <Button onClick={handleAddSection} disabled={saving}>Bölüm Ekle</Button>
                                            </div>
                                        </Card>
                                    ) : (
                                        <Button variant="default" onClick={() => setIsAddingSection(true)} className="w-full"><PlusCircle className="mr-2 h-4 w-4"/>Yeni Bölüm Ekle</Button>
                                    )}
                                </div>
                                <Separator className="my-8"/>
                                {/* Lesson Content Editor Area */}
                                {currentlyEditingLesson && (
                                    <Card className="mt-6 border-primary ring-2 ring-primary/30">
                                        <CardHeader>
                                            <CardTitle className="text-lg">Ders Düzenle: {currentlyEditingLesson.title}</CardTitle>
                                            <CardDescription>Dersin başlığını, sırasını, süresini, videosunu ve içeriğini buradan düzenleyebilirsiniz.</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <Label htmlFor="editing-lesson-title">Ders Başlığı</Label>
                                                    <Input id="editing-lesson-title" value={currentlyEditingLesson.title} onChange={e => setCurrentlyEditingLesson(prev => prev ? {...prev, title: e.target.value} : null)}/>
                                                </div>
                                                 <div className="space-y-1">
                                                    <Label htmlFor="editing-lesson-order">Sıra</Label>
                                                    <Input id="editing-lesson-order" type="number" value={currentlyEditingLesson.order} onChange={e => setCurrentlyEditingLesson(prev => prev ? {...prev, order: parseInt(e.target.value) || 1} : null)}/>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <Label htmlFor="editing-lesson-time">Tahmini Süre</Label>
                                                    <Input id="editing-lesson-time" value={currentlyEditingLesson.estimatedTime || ""} onChange={e => setCurrentlyEditingLesson(prev => prev ? {...prev, estimatedTime: e.target.value} : null)}/>
                                                </div>
                                                <div className="space-y-1">
                                                    <Label htmlFor="editing-lesson-video">Video URL (YouTube Embed)</Label>
                                                    <Input id="editing-lesson-video" value={currentlyEditingLesson.videoUrl || ""} onChange={e => setCurrentlyEditingLesson(prev => prev ? {...prev, videoUrl: e.target.value} : null)}/>
                                                </div>
                                            </div>
                                            <Separator/>
                                            <h4 className="font-medium">Ders İçeriği Blokları</h4>
                                            <BlockEditor
                                                blocks={currentlyEditingLesson.contentBlocks}
                                                onAddBlock={handleAddBlockToLesson}
                                                onDeleteBlock={handleDeleteBlockFromLesson}
                                                onUpdateBlock={handleUpdateBlockInLesson}
                                                onReorderBlocks={handleReorderBlocksInLesson}
                                                selectedBlockId={selectedBlockId}
                                                onBlockSelect={setSelectedBlockId}
                                            />
                                            <div className="flex justify-end gap-2 pt-4">
                                                <Button variant="outline" onClick={() => setCurrentlyEditingLesson(null)}>Kapat</Button>
                                                <Button onClick={handleSaveLessonChanges} disabled={saving}>
                                                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4"/>} Ders Değişikliklerini Kaydet
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>

        <AlertDialog open={!!itemToDelete} onOpenChange={(open) => { if(!open) setItemToDelete(null); }}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
                    <AlertDialogDescription>
                        "{itemToDelete?.title}" başlıklı {itemToDelete?.type === 'course' ? 'kursu (ve tüm içeriğini)' : itemToDelete?.type === 'section' ? 'bölümü (ve tüm derslerini)' : 'dersi'} kalıcı olarak silmek üzeresiniz. Bu işlem geri alınamaz.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setItemToDelete(null)}>İptal</AlertDialogCancel>
                    <AlertDialogAction onClick={confirmDeleteItem} className={cn(buttonVariants({ variant: "destructive" }))} disabled={saving}>
                        {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2"/> : null}
                        Evet, Sil
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        </>
    );
}

    