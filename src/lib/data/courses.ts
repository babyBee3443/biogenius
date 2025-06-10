
"use client";

import type { Block } from "@/components/admin/template-selector";
import { generateId } from '@/lib/utils';

// --- Course Data Structures ---

export interface LessonBlock extends Block {
  // Ders blokları için özel ek alanlar buraya gelebilir
  // Şimdilik genel Block yapısını kullanıyoruz
}

export interface Lesson {
  id: string;
  title: string;
  order: number; // Dersin bölüm içindeki sırası
  estimatedTime?: string; // "5 dk", "1 saat" gibi
  videoUrl?: string; // Ana ders videosu (YouTube embed URL'si olabilir)
  contentBlocks: LessonBlock[];
}

export interface CourseSection {
  id: string;
  title: string;
  order: number; // Kurs içindeki bölüm sırası
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string; // Örneğin "Biyoloji", "Genetik"
  coverImageUrl?: string;
  sections: CourseSection[];
  instructor?: string; // Eğitmen adı
  totalDuration?: string; // Toplam kurs süresi
  studentCount?: number; // Kayıtlı öğrenci sayısı (ileride)
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
}

// --- Storage Key ---
export const COURSE_STORAGE_KEY = 'biyohox_mock_courses_v1';

// In-memory cache and localStorage interaction
let mockCourses: Course[] = [];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- Course CRUD ---
export const getCourses = async (): Promise<Course[]> => {
  await delay(10);
  if (typeof window !== 'undefined') {
    const storedCourses = localStorage.getItem(COURSE_STORAGE_KEY);
    if (storedCourses) {
      try {
        const parsedCourses = JSON.parse(storedCourses);
        if (Array.isArray(parsedCourses)) {
          mockCourses = parsedCourses;
          return parsedCourses;
        }
      } catch (e) {
        console.error("Error parsing courses from localStorage", e);
      }
    }
  }
  return mockCourses;
};

export const initializeCourses = (initialCourses: Course[]) => {
  mockCourses = initialCourses;
  if (typeof window !== 'undefined') {
    localStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(mockCourses));
  }
};

export const getCourseById = async (id: string): Promise<Course | null> => {
  await delay(10);
  const courses = await getCourses();
  const course = courses.find(c => c.id === id);
  return course ? JSON.parse(JSON.stringify(course)) : null;
};

export const createCourse = async (data: Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'sections' | 'totalDuration' | 'studentCount'>): Promise<Course> => {
  await delay(50);
  const newCourse: Course = {
    ...data,
    id: generateId(),
    instructor: data.instructor || 'BiyoHox Ekibi',
    sections: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const currentCourses = await getCourses();
  currentCourses.push(newCourse);
  if (typeof window !== 'undefined') {
    localStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(currentCourses));
  }
  mockCourses = currentCourses;
  return JSON.parse(JSON.stringify(newCourse));
};

export const updateCourse = async (id: string, data: Partial<Omit<Course, 'id' | 'createdAt' | 'sections'>>): Promise<Course | null> => {
  await delay(50);
  const currentCourses = await getCourses();
  const index = currentCourses.findIndex(c => c.id === id);
  if (index !== -1) {
    // Preserve existing sections when updating other course info
    currentCourses[index] = { ...currentCourses[index], ...data, updatedAt: new Date().toISOString() };
    if (typeof window !== 'undefined') {
      localStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(currentCourses));
    }
    mockCourses = currentCourses;
    return JSON.parse(JSON.stringify(currentCourses[index]));
  }
  return null;
};

export const deleteCourse = async (id: string): Promise<boolean> => {
  await delay(80);
  let currentCourses = await getCourses();
  const initialLength = currentCourses.length;
  currentCourses = currentCourses.filter(c => c.id !== id);
  if (currentCourses.length < initialLength) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(currentCourses));
    }
    mockCourses = currentCourses;
    return true;
  }
  return false;
};

// --- Section CRUD (within a Course) ---
export const addSectionToCourse = async (courseId: string, sectionData: Omit<CourseSection, 'id' | 'lessons'>): Promise<Course | null> => {
  await delay(30);
  const courses = await getCourses();
  const courseIndex = courses.findIndex(c => c.id === courseId);
  if (courseIndex === -1) return null;

  const newSection: CourseSection = {
    ...sectionData,
    id: generateId(),
    lessons: [],
  };
  courses[courseIndex].sections.push(newSection);
  courses[courseIndex].updatedAt = new Date().toISOString();
  localStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(courses));
  mockCourses = courses;
  return JSON.parse(JSON.stringify(courses[courseIndex]));
};

export const updateSectionInCourse = async (courseId: string, sectionId: string, sectionData: Partial<Omit<CourseSection, 'id' | 'lessons'>>): Promise<Course | null> => {
  await delay(30);
  const courses = await getCourses();
  const courseIndex = courses.findIndex(c => c.id === courseId);
  if (courseIndex === -1) return null;

  const sectionIndex = courses[courseIndex].sections.findIndex(s => s.id === sectionId);
  if (sectionIndex === -1) return null;

  courses[courseIndex].sections[sectionIndex] = { ...courses[courseIndex].sections[sectionIndex], ...sectionData };
  courses[courseIndex].updatedAt = new Date().toISOString();
  localStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(courses));
  mockCourses = courses;
  return JSON.parse(JSON.stringify(courses[courseIndex]));
};

export const deleteSectionFromCourse = async (courseId: string, sectionId: string): Promise<Course | null> => {
  await delay(50);
  const courses = await getCourses();
  const courseIndex = courses.findIndex(c => c.id === courseId);
  if (courseIndex === -1) return null;

  courses[courseIndex].sections = courses[courseIndex].sections.filter(s => s.id !== sectionId);
  courses[courseIndex].updatedAt = new Date().toISOString();
  localStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(courses));
  mockCourses = courses;
  return JSON.parse(JSON.stringify(courses[courseIndex]));
};

// --- Lesson CRUD (within a Section of a Course) ---
export const addLessonToSection = async (courseId: string, sectionId: string, lessonData: Omit<Lesson, 'id' | 'contentBlocks'>): Promise<Course | null> => {
  await delay(20);
  const courses = await getCourses();
  const courseIndex = courses.findIndex(c => c.id === courseId);
  if (courseIndex === -1) return null;

  const sectionIndex = courses[courseIndex].sections.findIndex(s => s.id === sectionId);
  if (sectionIndex === -1) return null;

  const newLesson: Lesson = {
    ...lessonData,
    id: generateId(),
    contentBlocks: [{ id: generateId(), type: 'text', content: 'Yeni ders içeriğini buraya yazın...' }],
  };
  courses[courseIndex].sections[sectionIndex].lessons.push(newLesson);
  courses[courseIndex].updatedAt = new Date().toISOString();
  localStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(courses));
  mockCourses = courses;
  return JSON.parse(JSON.stringify(courses[courseIndex]));
};

export const updateLessonInSection = async (courseId: string, sectionId: string, lessonId: string, lessonData: Partial<Omit<Lesson, 'id'>>): Promise<Course | null> => {
  await delay(20);
  const courses = await getCourses();
  const courseIndex = courses.findIndex(c => c.id === courseId);
  if (courseIndex === -1) return null;

  const sectionIndex = courses[courseIndex].sections.findIndex(s => s.id === sectionId);
  if (sectionIndex === -1) return null;

  const lessonIndex = courses[courseIndex].sections[sectionIndex].lessons.findIndex(l => l.id === lessonId);
  if (lessonIndex === -1) return null;

  courses[courseIndex].sections[sectionIndex].lessons[lessonIndex] = {
    ...courses[courseIndex].sections[sectionIndex].lessons[lessonIndex],
    ...lessonData,
  };
  courses[courseIndex].updatedAt = new Date().toISOString();
  localStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(courses));
  mockCourses = courses;
  return JSON.parse(JSON.stringify(courses[courseIndex]));
};

export const deleteLessonFromSection = async (courseId: string, sectionId: string, lessonId: string): Promise<Course | null> => {
  await delay(40);
  const courses = await getCourses();
  const courseIndex = courses.findIndex(c => c.id === courseId);
  if (courseIndex === -1) return null;

  const sectionIndex = courses[courseIndex].sections.findIndex(s => s.id === sectionId);
  if (sectionIndex === -1) return null;

  courses[courseIndex].sections[sectionIndex].lessons = courses[courseIndex].sections[sectionIndex].lessons.filter(l => l.id !== lessonId);
  courses[courseIndex].updatedAt = new Date().toISOString();
  localStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(courses));
  mockCourses = courses;
  return JSON.parse(JSON.stringify(courses[courseIndex]));
};

// Helper to get a specific lesson (for editing content blocks)
export const getLessonFromCourse = async (courseId: string, sectionId: string, lessonId: string): Promise<Lesson | null> => {
    const course = await getCourseById(courseId);
    if (!course) return null;
    const section = course.sections.find(s => s.id === sectionId);
    if (!section) return null;
    const lesson = section.lessons.find(l => l.id === lessonId);
    return lesson || null;
};

// Ensure default data is initialized when the module loads in the browser
if (typeof window !== 'undefined' && !localStorage.getItem(COURSE_STORAGE_KEY)) {
    const defaultCourses: Course[] = [
        {
            id: "temel-hucre-biyolojisi",
            title: "Temel Hücre Biyolojisi",
            description: "Hücrenin yapısı, organelleri ve temel işlevlerine giriş niteliğinde bir kurs.",
            category: "Biyoloji",
            coverImageUrl: "https://placehold.co/800x450.png?text=Hücre+Biyolojisi",
            instructor: "Dr. Biyo Hox",
            totalDuration: "Yaklaşık 2 Saat",
            studentCount: 0,
            createdAt: new Date("2023-10-01T10:00:00Z").toISOString(),
            updatedAt: new Date("2023-10-01T10:00:00Z").toISOString(),
            sections: [
                {
                    id: "giris",
                    title: "Giriş ve Hücre Teorisi",
                    order: 1,
                    lessons: [
                        {
                            id: "ders-1-1",
                            title: "Hücre Nedir ve Hücre Teorisi",
                            order: 1,
                            estimatedTime: "10 dk",
                            videoUrl: "https://www.youtube.com/embed/URUJD5NEXC8",
                            contentBlocks: [
                                { id: generateId(), type: "text", content: "Bu derste hücrenin temel tanımı yapılacak ve hücre teorisinin tarihsel gelişimi ile temel ilkeleri anlatılacaktır." },
                                { id: generateId(), type: "heading", level: 3, content: "Hücre Teorisinin Maddeleri" },
                                { id: generateId(), type: "text", content: "1. Tüm canlılar bir ya da daha fazla hücreden oluşur.\n2. Hücre, canlılığın temel yapısal ve işlevsel birimidir.\n3. Tüm hücreler, daha önce var olan hücrelerin bölünmesiyle meydana gelir." },
                                { id: generateId(), type: "image", url: "https://placehold.co/600x350.png?text=Hücre+Teorisi+Diyagramı", alt: "Hücre Teorisi", caption: "Hücre teorisinin şematik gösterimi.", "data-ai-hint": "cell theory diagram" }
                            ]
                        },
                        {
                            id: "ders-1-2",
                            title: "Prokaryot ve Ökaryot Hücreler",
                            order: 2,
                            estimatedTime: "15 dk",
                            videoUrl: "https://www.youtube.com/embed/Pxujitlv8wc",
                            contentBlocks: [
                                { id: generateId(), type: "text", content: "Prokaryot ve ökaryot hücrelerin temel yapısal farklılıkları ve benzerlikleri incelenecektir." },
                                { id: generateId(), type: "heading", level: 3, content: "Karşılaştırma Tablosu" },
                                { id: generateId(), type: "text", content: "Özellik | Prokaryot | Ökaryot\n------- | -------- | --------\nÇekirdek | Yok | Var\nOrganel | Zarla çevrili yok | Zarla çevrili var\nBoyut | Küçük | Büyük" },
                                { id: generateId(), type: "quote", content: "Ökaryot hücreler, prokaryot hücrelere göre çok daha karmaşık bir iç organizasyona sahiptir.", citation: "Campbell Biyoloji" }
                            ]
                        }
                    ]
                },
                {
                    id: "hucre-organelleri",
                    title: "Hücre Organelleri ve Görevleri",
                    order: 2,
                    lessons: [
                        {
                            id: "ders-2-1",
                            title: "Mitokondri ve Kloroplast",
                            order: 1,
                            estimatedTime: "20 dk",
                            contentBlocks: [
                                { id: generateId(), type: "heading", level: 2, content: "Enerji Üretim Merkezleri" },
                                { id: generateId(), type: "text", content: "Mitokondri, hücresel solunumla ATP üretirken; kloroplast ise fotosentez ile besin üretir." },
                                { id: generateId(), type: "image", url: "https://placehold.co/700x400.png?text=Mitokondri+Kloroplast", alt: "Mitokondri ve Kloroplast yapıları", caption: "Mitokondri ve kloroplastın karşılaştırmalı yapısı.", "data-ai-hint": "mitochondria chloroplast biology" }
                            ]
                        },
                    ]
                }
            ]
        }
    ];
    initializeCourses(defaultCourses);
}

    