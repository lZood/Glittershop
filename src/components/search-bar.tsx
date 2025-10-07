'use client';

import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from './ui/input';
import { useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/use-debounce';

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedQuery) {
      params.set('q', debouncedQuery);
    } else {
      params.delete('q');
    }
    router.replace(`/?${params.toString()}`);
  }, [debouncedQuery, router, searchParams]);


  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search for jewelry..."
        className="w-full pl-9"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
}
