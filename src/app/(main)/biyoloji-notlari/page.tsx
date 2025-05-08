
"use client"; // Make this a client component for state and effects

import * as React from "react"; // Import React for hooks
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from 'next/image';
import { BookCopy, ArrowRight, Loader2 } from "lucide-react"; // Added Loader2
import { getNotes, type NoteData } from '@/lib/mock-data';
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton
import { NoteCard } from '@/components/note-card'; // Import the new NoteCard

export default function BiyolojiNotlariPage() {
  const [allNotes, setAllNotes] = React.useState<NoteData[]>([]);
  const [filteredNotes, setFilteredNotes] = React.useState<NoteData[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [selectedLevel, setSelectedLevel] = React.useState("all");
  const [loading, setLoading] = React.useState(true);

  // Fetch all notes on component mount
  React.useEffect(() => {
    setLoading(true);
    getNotes()
      .then(data => {
        setAllNotes(data);
        setFilteredNotes(data); // Initialize filtered notes with all notes
      })
      .catch(err => {
        console.error("Error fetching notes:", err);
        // TODO: Add user-facing error handling (e.g., toast notification)
      })
      .finally(() => setLoading(false));
  }, []);

  // Filter notes whenever searchTerm, category, or level changes
  React.useEffect(() => {
    let results = allNotes;
    const lowerSearchTerm = searchTerm.toLowerCase();

    // Filter by search term
    if (lowerSearchTerm) {
      results = results.filter(note =>
        note.title.toLowerCase().includes(lowerSearchTerm) ||
        note.summary.toLowerCase().includes(lowerSearchTerm) ||
        note.category.toLowerCase().includes(lowerSearchTerm) ||
        note.tags.some(tag => tag.toLowerCase().includes(lowerSearchTerm))
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
        results = results.filter(note => note.category === selectedCategory);
    }

    // Filter by level
    if (selectedLevel !== "all") {
        results = results.filter(note => note.level === selectedLevel);
    }


    setFilteredNotes(results);
  }, [searchTerm, selectedCategory, selectedLevel, allNotes]);


  const categories = [...new Set(allNotes.map(note => note.category))];
  const levels = [...new Set(allNotes.map(note => note.level))];


  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleFilter = () => {
      // The filtering now happens automatically in useEffect,
      // but you might keep this button for explicit actions or leave it out.
      console.log("Applying filters (handled by useEffect now)...");
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

      {/* Filtering/Search Section */}
      <section className="mb-12">
          <Card className="bg-secondary/50 border-border/50">
            <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center">
                <Input
                    placeholder="Notlarda ara (başlık, etiket...)"
                    className="flex-grow"
                    value={searchTerm}
                    onChange={handleSearchChange} // Bind value and onChange
                 />
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
                {/* Filter button is optional now as filtering is reactive */}
                {/* <Button className="w-full md:w-auto" onClick={handleFilter}>Filtrele</Button> */}
            </CardContent>
          </Card>
      </section>

      {/* Notes Grid */}
      {loading ? (
        // Loading Skeleton
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
                 <Card key={index} className="overflow-hidden shadow-md flex flex-col h-full">
                    <Skeleton className="w-full h-40" />
                    <CardContent className="p-5 flex flex-col flex-grow">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <div className="mb-3 space-x-1">
                           <Skeleton className="h-5 w-20 inline-block" />
                           <Skeleton className="h-5 w-16 inline-block" />
                        </div>
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-4 w-2/3 mb-4" />
                        <div className="mt-auto flex justify-end">
                            <Skeleton className="h-6 w-24" />
                        </div>
                    </CardContent>
                 </Card>
             ))}
         </div>
      ) : filteredNotes.length === 0 ? (
        // No Results Message
        <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
                {searchTerm || selectedCategory !== 'all' || selectedLevel !== 'all'
                    ? "Arama kriterlerinize uygun not bulunamadı."
                    : "Henüz biyoloji notu eklenmemiş."
                 }
            </p>
        </div>
      ) : (
        // Display Filtered Notes
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNotes.map((note) => (
             <NoteCard key={note.id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
}
