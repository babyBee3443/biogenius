
"use client";

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Newspaper, BookCopy, Users, MessageSquare } from "lucide-react"; // Example icons
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface TotalStatsCardsProps {
  totalArticles: number;
  totalNotes: number;
  totalUsers: number;
  totalComments: number;
}

export const TotalStatsCards: React.FC<TotalStatsCardsProps> = ({
  totalArticles,
  totalNotes,
  totalUsers,
  totalComments
}) => {
  const stats = [
    { title: "Toplam Makale", value: totalArticles, icon: <Newspaper className="h-5 w-5 text-primary" />, link: "/admin/articles", linkText: "Tüm makaleleri gör" },
    { title: "Toplam Not", value: totalNotes, icon: <BookCopy className="h-5 w-5 text-green-500" />, link: "/admin/biyoloji-notlari", linkText: "Tüm notları gör" },
    { title: "Toplam Kullanıcı", value: totalUsers, icon: <Users className="h-5 w-5 text-indigo-500" />, link: "/admin/users", linkText: "Kullanıcıları yönet" },
    { title: "Yorumlar", value: totalComments, icon: <MessageSquare className="h-5 w-5 text-orange-500" />, link: "#", linkText: "Yorumları yönet (Yakında)" },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              {stat.icon}
              {stat.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            {stat.link && (
              <Button variant="link" asChild className="p-0 h-auto text-xs text-muted-foreground mt-1">
                <Link href={stat.link}>
                  {stat.linkText}
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TotalStatsCards;
