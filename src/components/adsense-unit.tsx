
"use client";

import * as React from 'react';

interface AdsenseUnitProps {
  slotId: string;
  adFormat?: string;
  responsive?: boolean;
  style?: React.CSSProperties;
  minHeight?: string;
  className?: string; // Allow custom className for the wrapper
}

const AdsenseUnit: React.FC<AdsenseUnitProps> = ({
  slotId,
  adFormat = "auto",
  responsive = true,
  style,
  minHeight,
  className,
}) => {
  const [adsenseEnabled, setAdsenseEnabled] = React.useState(false);
  const [adsensePublisherId, setAdsensePublisherId] = React.useState<string | null>(null);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const storedAdsenseEnabled = localStorage.getItem('biyohox_adsenseEnabled');
      setAdsenseEnabled(storedAdsenseEnabled === null ? true : storedAdsenseEnabled === 'true'); // Default to true

      const storedPublisherId = localStorage.getItem('biyohox_adsensePublisherId');
      setAdsensePublisherId(storedPublisherId);
    }
  }, []);

  // AdSense script'inin yüklenip yüklenmediğini kontrol etmek için bir state.
  // Bu, aynı script'in birden fazla kez eklenmesini önlemeye yardımcı olabilir,
  // ancak ana script genellikle layout.tsx'de bir kez eklenir.
  // Bu bileşen daha çok birimlerin kendisini render etmeye odaklanır.
  React.useEffect(() => {
    if (isMounted && adsenseEnabled && adsensePublisherId) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdSense push error:", e);
      }
    }
  }, [isMounted, adsenseEnabled, adsensePublisherId, slotId]); // slotId'yi de dependency'ye ekleyerek her birim için push denemesi yapılabilir.

  if (!isMounted || !adsenseEnabled || !adsensePublisherId) {
    return null; // Render nothing if not enabled or ID is missing
  }

  return (
    <div className={className || "my-8 text-center"} style={{ ...style, minHeight: minHeight || 'auto' }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client={`ca-${adsensePublisherId}`}
        data-ad-slot={slotId}
        data-ad-format={adFormat}
        data-full-width-responsive={responsive ? "true" : "false"}
      ></ins>
    </div>
  );
};

export default AdsenseUnit;
