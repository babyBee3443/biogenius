
"use client";

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, TrendingUp, Users } from "lucide-react";

export const PlaceholderAnalyticsCards = () => {
  const placeholderData = [
    { title: "Sayfa Görüntülenme", value: "0", icon: <Eye className="h-5 w-5 text-blue-500" />, note: "(Gerçek analitik verisi gerekiyor)" },
    { title: "Hemen Çıkma Oranı", value: "0.00%", icon: <TrendingUp className="h-5 w-5 text-red-500" />, note: "(Gerçek analitik verisi gerekiyor)" },
    { title: "Dönüşüm Oranı (Hedef)", value: "0.00%", icon: <Users className="h-5 w-5 text-green-500" />, note: "(Gerçek analitik verisi gerekiyor)" },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {placeholderData.map((metric, index) => (
        <Card key={index} className="bg-muted/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              {metric.icon}
              {metric.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground">{metric.note}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PlaceholderAnalyticsCards;
