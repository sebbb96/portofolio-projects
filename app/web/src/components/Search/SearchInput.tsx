import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/useDebounce';
import { useEffect, useState } from 'react';

interface SearchInputProps {
  onSearch: (term: string) => void;
  placeholder?: string;
}

export function SearchInput({
  onSearch,
  placeholder = 'Search projects...',
}: SearchInputProps) {
  const [localSearch, setLocalSearch] = useState('');
  const debouncedSearch = useDebounce(localSearch, 300);

  useEffect(() => {
    onSearch(debouncedSearch);
  }, [debouncedSearch, onSearch]);

  return (
    <div className="relative hidden md:block">
      <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
        <svg
          className="w-4 h-4 text-gray-500 dark:text-gray-400"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
          />
        </svg>
        <span className="sr-only">Search icon</span>
      </div>
      <Input
        type="search"
        placeholder={placeholder}
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
        className="w-[200px] lg:w-[300px] pl-10"
      />
    </div>
  );
}
