import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from 'next/image';
import { BookCopy, ArrowRight } from "lucide-react";
import { getNotes, type NoteData } from '@/lib/mock-data'; // Import note data functions
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default async function BiyolojiNotlariPage() {
  // Fetch notes (replace with dynamic fetching/filtering later)
  const notes = await getNotes();

  const categories = [...new Set(notes.map(note => note.category))];
  const levels = [...new Set(notes.map(note => note.level))];

  return (
    <div className="space-y-12">
      <header className="text-center pt-8 pb-4">
        <BookCopy className="h-12 w-12 mx-auto text-green-600 dark:text-green-400 mb-3" />
        <h1 className="text-4xl font-bold tracking-tight">Biyoloji Notları</h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
          Lise biyoloji müfredatına uygun, anlaşılır ve özet ders notları.
        </p>
      </header>

      {/* Filtering/Search Section (Basic Placeholder) */}
      <section className="mb-12">
          <Card className="bg-secondary/50 border-border/50">
            <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center">
                <Input placeholder="Notlarda ara (başlık, etiket...)" className="flex-grow"/>
                <div className="flex gap-3 w-full md:w-auto">
                    <Select>
                        <SelectTrigger className="w-full md:w-[180px]">
                            <SelectValue placeholder="Kategori Seçin" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tüm Kategoriler</SelectItem>
                            {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                        </SelectContent>
                    </Select>
                     <Select>
                        <SelectTrigger className="w-full md:w-[180px]">
                            <SelectValue placeholder="Seviye Seçin" />
                        </SelectTrigger>
                        <SelectContent>
                             <SelectItem value="all">Tüm Seviyeler</SelectItem>
                            {levels.map(lvl => <SelectItem key={lvl} value={lvl}>{lvl}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <Button className="w-full md:w-auto">Filtrele</Button>
            </CardContent>
          </Card>
      </section>

      {/* Notes Grid */}
      {notes.length === 0 ? (
        <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Henüz biyoloji notu eklenmemiş.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {notes.map((note) => (
             <Link key={note.id} href={`/biyoloji-notlari/${note.slug}`} className="block group">
                <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out flex flex-col h-full">
                   {note.imageUrl && (
                       <CardHeader className="p-0 relative">
                         <Image
                           src={note.imageUrl}
                           alt={note.title}
                           width={400}
                           height={250}
                           className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                           data-ai-hint="biology concept abstract" // Added hint
                         />
                       </CardHeader>
                   )}
                   <CardContent className="p-5 flex flex-col flex-grow">
                     <CardTitle className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">{note.title}</CardTitle>
                      <div className="mb-3 space-x-1">
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">{note.category}</Badge>
                        <Badge variant="outline" className="text-xs">{note.level}</Badge>
                      </div>
                     <CardDescription className="text-sm text-muted-foreground mb-4 flex-grow line-clamp-3">{note.summary}</CardDescription>
                     <div className="mt-auto flex justify-end items-center">
                        <Button variant="link" size="sm" className="p-0 h-auto text-primary hover:text-primary/80 transition-colors">
                           Detayları Gör <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                     </div>
                   </CardContent>
                 </Card>
             </Link>
          ))}
        </div>
      )}
    </div>
  );
}
