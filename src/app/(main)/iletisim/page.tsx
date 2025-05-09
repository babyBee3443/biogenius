"use client"; // Mark as client component for form handling (even if basic)

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";

export default function IletisimPage() {

  // Basic state for form inputs (no actual submission logic yet)
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [message, setMessage] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for submission logic
    console.log("Form submitted (placeholder):", { name, email, subject, message });
    toast({
      title: "Mesajınız Gönderildi (Simülasyon)",
      description: "Geri bildiriminiz için teşekkür ederiz! En kısa sürede size dönüş yapacağız.",
    });
    // Clear form (optional)
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  };

  return (
    <div className="space-y-12">
      <header className="text-center pt-8 pb-4">
        <h1 className="text-4xl font-bold tracking-tight">İletişim</h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
          Bizimle iletişime geçmekten çekinmeyin. Sorularınız, önerileriniz veya işbirliği talepleriniz için buradayız.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle>Mesaj Gönderin</CardTitle>
            <CardDescription>Aşağıdaki formu kullanarak bize ulaşabilirsiniz.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Adınız Soyadınız</Label>
                  <Input id="name" placeholder="Adınız ve soyadınız" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-posta Adresiniz</Label>
                  <Input id="email" type="email" placeholder="eposta@adresiniz.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Konu</Label>
                <Input id="subject" placeholder="Mesajınızın konusu" value={subject} onChange={(e) => setSubject(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Mesajınız</Label>
                <Textarea id="message" placeholder="Mesajınızı buraya yazın..." rows={5} value={message} onChange={(e) => setMessage(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full sm:w-auto">
                <Send className="mr-2 h-4 w-4" /> Mesajı Gönder
              </Button>
               <p className="text-xs text-muted-foreground text-center sm:text-left pt-2">
                * Bu form şu anda yalnızca bir gösterimdir. Gerçek gönderme işlevi henüz aktif değildir.
              </p>
            </form>
          </CardContent>
        </Card>

        {/* Contact Information & Map */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>İletişim Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground">E-posta</h3>
                  <a href="mailto:iletisim@teknobiyo.example.com" className="hover:text-primary transition-colors">iletisim@teknobiyo.example.com</a> (Yanıt süresi: 1-2 iş günü)
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                 <div>
                  <h3 className="font-semibold text-foreground">Telefon (Destek Hattı)</h3>
                  <p>+90 (XXX) XXX XX XX (Hafta içi 09:00 - 17:00)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                 <div>
                  <h3 className="font-semibold text-foreground">Adres</h3>
                  <p>Örnek Mah. Teknoloji Cad. No:123, 347XX Kadıköy/İstanbul</p>
                  <p>(Lütfen ziyaret öncesi randevu alınız.)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Placeholder Map */}
          <div className="relative h-64 rounded-lg overflow-hidden shadow-md">
            <Image
              src="https://picsum.photos/seed/maplocation/800/400"
              alt="Konum Haritası"
              layout="fill"
              objectFit="cover"
              data-ai-hint="map location city"
              loading="lazy" // Lazy load the map image
            />
             <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <p className="text-white text-lg font-semibold bg-black/50 px-4 py-2 rounded">Harita Alanı (Placeholder)</p>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}

