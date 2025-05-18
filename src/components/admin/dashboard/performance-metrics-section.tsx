
"use client";

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gauge, Server, AlertTriangle, RefreshCw } from "lucide-react";

export const PerformanceMetricsSection = () => {
  // Placeholder data - replace with actual data fetching and logic
  const metrics = [
    { title: "Sayfa Yüklenme Süresi", value: "0ms", icon: <Gauge className="h-5 w-5 text-blue-500" />, note: "(Gerçek ölçüm gerekiyor)" },
    { title: "Sunucu Yanıt Süresi", value: "0ms", icon: <Server className="h-5 w-5 text-green-500" />, note: "(Gerçek ölçüm gerekiyor)" },
    { title: "Dönüşüm Oranı (Abone)", value: "0.00%", icon: <RefreshCw className="h-5 w-5 text-purple-500" />, note: "(Gerçek analitik verisi gerekiyor)" },
    { title: "Hata Oranı", value: "0.00%", icon: <AlertTriangle className="h-5 w-5 text-red-500" />, note: "(Gerçek ölçüm/loglama gerekiyor)" },
  ];

  return (
    <Card>
        <CardHeader>
            <CardTitle>Performans Metrikleri (Placeholder)</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
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
      </CardContent>
    </Card>
  );
};

export default PerformanceMetricsSection;
