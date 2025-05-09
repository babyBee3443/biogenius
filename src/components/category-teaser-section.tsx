
"use client";

import * as React from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';

const CategoryTeaserSection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-8"> {/* Changed to md:grid-cols-1 */}
      {/* Removed Teknoloji Teaser */}
      <div className="bg-secondary/70 p-8 rounded-lg shadow-sm text-center border border-transparent hover:border-primary/30 transition-colors duration-300">
        <h3 className="text-2xl font-semibold mb-3">Biyoloji</h3>
        <p className="text-muted-foreground mb-6">Genetik, mikrobiyoloji, evrim, ekoloji ve yaşam bilimlerinin diğer dallarındaki gelişmeler.</p>
        <Button asChild>
          <Link href="/categories/biyoloji">Biyoloji Makaleleri <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </div>
    </div>
  );
};

export default CategoryTeaserSection;
