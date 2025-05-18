
"use client"; // May not be strictly necessary here, but won't harm

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
  isCompleted?: boolean; // Kullanıcının bu dersi tamamlayıp tamamlamadığı (ileride)
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
}

// --- Mock Course Data ---

const mockCourseData: Course[] = [
  {
    id: "temel-hucre-biyolojisi",
    title: "Temel Hücre Biyolojisi",
    description: "Hücrenin yapısı, organelleri ve temel işlevlerine giriş niteliğinde bir kurs.",
    category: "Biyoloji",
    coverImageUrl: "https://placehold.co/800x450.png?text=Hücre+Biyolojisi",
    instructor: "Dr. Biyo Hox",
    totalDuration: "Yaklaşık 2 Saat",
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
            videoUrl: "https://www.youtube.com/embed/URUJD5NEXC8", // Örnek video
            contentBlocks: [
              { id: generateId(), type: "text", content: "Bu derste hücrenin temel tanımı yapılacak ve hücre teorisinin tarihsel gelişimi ile temel ilkeleri anlatılacaktır." },
              { id: generateId(), type: "heading", level: 3, content: "Hücre Teorisinin Maddeleri" },
              { id: generateId(), type: "text", content: "1. Tüm canlılar bir ya da daha fazla hücreden oluşur.\n2. Hücre, canlılığın temel yapısal ve işlevsel birimidir.\n3. Tüm hücreler, daha önce var olan hücrelerin bölünmesiyle meydana gelir." },
              { id: generateId(), type: "image", url: "https://placehold.co/600x350.png?text=Hücre+Teorisi+Şeması", alt: "Hücre Teorisi", caption: "Hücre teorisinin şematik gösterimi." }
            ]
          },
          {
            id: "ders-1-2",
            title: "Prokaryot ve Ökaryot Hücreler",
            order: 2,
            estimatedTime: "15 dk",
            videoUrl: "https://www.youtube.com/embed/Pxujitlv8wc", // Örnek video
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
              { id: generateId(), type: "image", url: "https://placehold.co/700x400.png?text=Mitokondri+ve+Kloroplast", alt: "Mitokondri ve Kloroplast yapıları", caption: "Mitokondri ve kloroplastın karşılaştırmalı yapısı."}
            ]
          },
          {
            id: "ders-2-2",
            title: "Endoplazmik Retikulum ve Golgi Aygıtı",
            order: 2,
            estimatedTime: "18 dk",
            contentBlocks: [
              { id: generateId(), type: "text", content: "Protein sentezi, modifikasyonu ve taşınmasında görevli olan ER ve Golgi'nin yapı ve işlevleri." },
              { id: generateId(), type: "video", url: "https://www.youtube.com/embed/rvfvRgk0MSc" }
            ]
          }
        ]
      }
    ]
  }
];

// --- Data Fetching Functions ---

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getCourses = async (): Promise<Course[]> => {
  await delay(100); // Simulate API call delay
  // In a real app, this would fetch from a database or a static JSON file.
  // For now, we use the mock data directly.
  // Consider localStorage for persistence in mock environment if needed.
  return JSON.parse(JSON.stringify(mockCourseData)); // Return a deep copy
};

export const getCourseById = async (id: string): Promise<Course | null> => {
  await delay(50);
  const course = mockCourseData.find(c => c.id === id);
  return course ? JSON.parse(JSON.stringify(course)) : null;
};

// Functions to initialize from localStorage (similar to other data types if needed)
// export const COURSE_STORAGE_KEY = 'biyohox_mock_courses_v1';

// export const initializeCourses = (initialCourses: Course[]) => {
//   mockCourseData = initialCourses;
//   if (typeof window !== 'undefined') {
//     localStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(mockCourseData));
//   }
// };
// // Load initial data if available from localStorage
// if (typeof window !== 'undefined') {
//   const storedCourses = localStorage.getItem(COURSE_STORAGE_KEY);
//   if (storedCourses) {
//     try {
//       const parsed = JSON.parse(storedCourses);
//       if (Array.isArray(parsed)) {
//         mockCourseData = parsed;
//       }
//     } catch (e) {
//       console.error("Error parsing courses from localStorage", e);
//     }
//   } else {
//     // If nothing in localStorage, save the default mock data
//     localStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(mockCourseData));
//   }
// }
