
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Users, Target, Eye } from "lucide-react";

export default function HakkimizdaPage() {
  return (
    <div className="space-y-12">
      <header className="text-center pt-8 pb-4">
        <h1 className="text-4xl font-bold tracking-tight">Hakkımızda</h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
          TeknoBiyo'nun arkasındaki vizyonu, misyonu ve değerleri keşfedin.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold">Biz Kimiz?</h2>
          <p className="text-muted-foreground leading-relaxed">
            TeknoBiyo, teknoloji ve biyoloji dünyalarının kesişim noktasında yer alan, meraklı zihinler için hazırlanmış bir bilgi platformudur. Amacımız, bu iki dinamik alandaki en son gelişmeleri, derinlemesine analizleri ve ilgi çekici içerikleri okuyucularımıza sunmaktır.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Bilimin ve teknolojinin hızla ilerlediği bu çağda, karmaşık konuları anlaşılır ve erişilebilir bir dilde aktarmayı hedefliyoruz. Uzman yazarlarımız ve araştırmacılarımızla, güvenilir ve güncel bilgiler sunarak bilgi kirliliğinin önüne geçmeyi amaçlıyoruz.
          </p>
        </div>
        <div className="relative h-80 rounded-lg overflow-hidden shadow-lg">
          <Image
            src="https://picsum.photos/seed/teamwork/800/600"
            alt="Ekip Çalışması"
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-500 hover:scale-105"
            data-ai-hint="teamwork collaboration office"
            priority // Prioritize this image as it's likely LCP
          />
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-col items-center gap-2">
              <Target className="h-8 w-8 text-primary" />
              Misyonumuz
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            Teknoloji ve biyoloji alanlarındaki karmaşık bilgileri basitleştirerek, herkesin anlayabileceği ve faydalanabileceği içerikler üretmek. Bilimsel merakı teşvik etmek ve geleceği şekillendiren yenilikler hakkında toplumu bilgilendirmek.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-col items-center gap-2">
              <Eye className="h-8 w-8 text-primary" />
              Vizyonumuz
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            Türkiye'de ve dünyada teknoloji ve biyoloji alanlarında referans gösterilen, güvenilir ve öncü bir bilgi kaynağı olmak. Bilim ve teknoloji okuryazarlığını artırarak daha bilinçli bir toplum oluşmasına katkıda bulunmak.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-col items-center gap-2">
              <Users className="h-8 w-8 text-primary" />
              Değerlerimiz
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            Doğruluk, tarafsızlık, erişilebilirlik, yenilikçilik ve sürekli öğrenme temel değerlerimizdir. Bilimsel etiğe bağlı kalarak, topluma fayda sağlama ilkesiyle hareket ederiz.
          </CardContent>
        </Card>
      </section>

       {/* Optionally add a Team section if applicable */}
      {/*
      <section>
        <h2 className="text-3xl font-semibold text-center mb-8">Ekibimiz</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          { Placeholder for team members }
          <div className="text-center">
            <Image src="https://picsum.photos/seed/member1/200/200" alt="Ekip Üyesi 1" width={150} height={150} className="rounded-full mx-auto mb-4 shadow-md" />
            <h3 className="font-semibold">İsim Soyisim</h3>
            <p className="text-sm text-muted-foreground">Pozisyon</p>
          </div>
          { Repeat for other members }
        </div>
      </section>
      */}
    </div>
  );
}
