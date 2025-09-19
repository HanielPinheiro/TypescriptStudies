import React, { useState, useEffect, useRef, type ChangeEvent } from 'react';
import { Search, X, Loader2 } from 'lucide-react'; // Lucide icons

export interface SearchResult {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  // Other known properties
}

interface SearchComponentProps {
  placeholder?: string;
  debounceTime?: number;
  onSearch: (query: string) => Promise<SearchResult[]> | SearchResult[];
  onResultSelect?: (result: SearchResult) => void;
  className?: string;
}

export const SearchComponent: React.FC<SearchComponentProps> = ({ placeholder = 'Search...', debounceTime = 300, onSearch, onResultSelect, className = '' }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Debounce the search
  useEffect(() => {
    const handler = setTimeout(() => {
      if (query.trim()) {
        performSearch(query);
      } else {
        setResults([]);
      }
    }, debounceTime);

    return () => {
      clearTimeout(handler);
    };
  }, [query, debounceTime]);

  const performSearch = async (searchQuery: string) => {
    try {
      setIsLoading(true);
      const searchResults = await onSearch(searchQuery);
      setResults(searchResults);
      setActiveIndex(-1); // Reset active index on new results
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    inputRef.current?.focus();
  };

  const handleResultSelect = (result: SearchResult) => {
    if (onResultSelect) {
      onResultSelect(result);
    }
    setQuery(result.title);
    setResults([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        if (activeIndex >= 0 && activeIndex < results.length) {
          handleResultSelect(results[activeIndex]);
        }
        break;
      case 'Escape':
        setResults([]);
        break;
    }
  };

  // Scroll into view for keyboard navigation
  useEffect(() => {
    if (activeIndex >= 0 && resultsRef.current) {
      const activeItem = resultsRef.current.children[activeIndex] as HTMLElement;
      if (activeItem) {
        activeItem.scrollIntoView({
          block: 'nearest',
        });
      }
    }
  }, [activeIndex]);

  return (
    <div className={`relative ${className}`}>
      <div className="relative flex items-center">
        <div className="absolute left-3 text-gray-400">
          <Search className="h-5 w-5" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Search input"
        />
        {(query || isLoading) && (
          <div className="absolute right-3 flex items-center">
            {isLoading ? (
              <Loader2 className="h-5 w-5 text-gray-400" />
            ) : (
              <button onClick={handleClear} className="text-gray-400 hover:text-gray-600" aria-label="Clear search">
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )}
      </div>

      {isFocused && results.length > 0 && (
        <div ref={resultsRef} className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {results.map((result, index) => (
            <div
              key={result.id}
              onClick={() => handleResultSelect(result)}
              onMouseEnter={() => setActiveIndex(index)}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${index === activeIndex ? 'bg-gray-100' : ''}`}
            >
              <div className="font-medium">{result.title}</div>
              {result.description && <div className="text-sm text-gray-500">{result.description}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
