
"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from 'next/image';
import { BookCopy, ArrowRight, Loader2, Search } from "lucide-react"; 
import { getNotes, type NoteData } from '@/lib/data/notes'; 
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { NoteCard } from '@/components/note-card';

export default function BiyolojiNotlariPage() {
  const [allNotes, setAllNotes] = React.useState<NoteData[]>([]);
  const [filteredNotes, setFilteredNotes] = React.useState<NoteData[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [selectedLevel, setSelectedLevel] = React.useState("all");
  const [loading, setLoading] = React.useState(true);
  const [adsenseEnabled, setAdsenseEnabled] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedAdsenseEnabled = localStorage.getItem('biyohox_adsenseEnabled');
      setAdsenseEnabled(storedAdsenseEnabled === 'true');
    }

    setLoading(true);
    getNotes()
      .then(data => {
        setAllNotes(data);
        setFilteredNotes(data);
      })
      .catch(err => {
        console.error("Error fetching notes:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  React.useEffect(() => {
    let results = allNotes;
    const lowerSearchTerm = searchTerm.toLowerCase();

    if (lowerSearchTerm) {
      results = results.filter(note =>
        note.title.toLowerCase().includes(lowerSearchTerm) ||
        (note.summary && note.summary.toLowerCase().includes(lowerSearchTerm)) || 
        note.category.toLowerCase().includes(lowerSearchTerm) ||
        (note.tags && note.tags.some(tag => tag.toLowerCase().includes(lowerSearchTerm))) 
      );
    }

    if (selectedCategory !== "all") {
        results = results.filter(note => note.category === selectedCategory);
    }

    if (selectedLevel !== "all") {
        results = results.filter(note => note.level === selectedLevel);
    }
    setFilteredNotes(results);
  }, [searchTerm, selectedCategory, selectedLevel, allNotes]);


  const categories = React.useMemo(() => [...new Set(allNotes.map(note => note.category))], [allNotes]);
  const levels = React.useMemo(() => [...new Set(allNotes.map(note => note.level))], [allNotes]);


  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="space-y-12">
      <header className="text-center pt-8 pb-4">
        <BookCopy className="h-12 w-12 mx-auto text-green-600 dark:text-green-400 mb-3" />
        <h1 className="text-4xl font-bold tracking-tight">Biyoloji Notları</h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
          Lise biyoloji müfredatına uygun, anlaşılır ve özet ders notları.
        </p>
      </header>

      <section className="mb-12">
          <Card className="bg-secondary/50 border-border/50">
            <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Notlarda ara (başlık, etiket...)"
                        className="pl-10" 
                        value={searchTerm}
                        onChange={handleSearchChange}
                     />
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-full md:w-[180px]">
                            <SelectValue placeholder="Kategori Seçin" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tüm Kategoriler</SelectItem>
                            {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                        </SelectContent>
                    </Select>
                     <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                        <SelectTrigger className="w-full md:w-[180px]">
                            <SelectValue placeholder="Seviye Seçin" />
                        </SelectTrigger>
                        <SelectContent>
                             <SelectItem value="all">Tüm Seviyeler</SelectItem>
                            {levels.map(lvl => <SelectItem key={lvl} value={lvl}>{lvl}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
          </Card>
      </section>

      {adsenseEnabled && (
        <div className="my-8 p-4 text-center bg-muted/30 border border-dashed border-border rounded-lg">
          {/* Google AdSense Reklam Birimi Kodu Buraya Eklenecek (Örn: Yatay Banner - Notlar Liste Filtre Altı) */}
          <p className="text-sm text-muted-foreground">Reklam Alanı (Notlar Liste Filtre Altı)</p>
        </div>
      )}

      {loading ? (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
                 <Card key={index} className="overflow-hidden shadow-md flex flex-col h-full rounded-lg">
                    <Skeleton className="w-full h-40" />
                    <CardContent className="p-5 flex flex-col flex-grow">
                        <Skeleton className="h-6 w-3/4 mb-2 rounded-md" />
                        <div className="mb-3 space-x-1">
                           <Skeleton className="h-5 w-20 inline-block rounded-full" />
                           <Skeleton className="h-5 w-16 inline-block rounded-full" />
                        </div>
                        <Skeleton className="h-4 w-full mb-1 rounded-md" />
                        <Skeleton className="h-4 w-full mb-1 rounded-md" />
                        <Skeleton className="h-4 w-2/3 mb-4 rounded-md" />
                        <div className="mt-auto flex justify-end">
                            <Skeleton className="h-6 w-24 rounded-md" />
                        </div>
                    </CardContent>
                 </Card>
             ))}
         </div>
      ) : filteredNotes.length === 0 ? (
        <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
                {searchTerm || selectedCategory !== 'all' || selectedLevel !== 'all'
                    ? "Arama kriterlerinize uygun not bulunamadı."
                    : "Henüz biyoloji notu eklenmemiş."
                 }
            </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNotes.map((note, index) => (
            <React.Fragment key={note.id}>
              <NoteCard note={note} imageLoading="lazy" />
              {adsenseEnabled && (index + 1) % 3 === 0 && index < filteredNotes.length -1 && (
                <div className="my-4 p-4 text-center bg-muted/30 border border-dashed border-border rounded-lg md:col-span-1 lg:col-span-1 flex items-center justify-center">
                  {/* Google AdSense Reklam Birimi Kodu Buraya Eklenecek (Örn: Kare veya Dikey - Notlar Liste Kart Arası) */}
                  <p className="text-sm text-muted-foreground">Reklam Alanı (Notlar Liste Kart Arası)</p>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {adsenseEnabled && (
        <div className="mt-12 mb-8 p-4 text-center bg-muted/30 border border-dashed border-border rounded-lg">
          {/* Google AdSense Reklam Birimi Kodu Buraya Eklenecek (Örn: Yatay Banner - Notlar Liste Sayfa Sonu) */}
          <p className="text-sm text-muted-foreground">Reklam Alanı (Notlar Liste Sayfa Sonu)</p>
        </div>
      )}
    </div>
  );
}

    