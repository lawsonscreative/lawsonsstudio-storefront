'use client';

/**
 * UK Postcode Autocomplete Component
 * Uses postcodes.io (free, no API key required) for UK postcode lookup
 */

import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';

interface PostcodeResult {
  postcode: string;
  admin_district?: string;
  region?: string;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (result: PostcodeResult) => void;
  className?: string;
  placeholder?: string;
}

export function PostcodeAutocomplete({ value, onChange, onSelect, className, placeholder }: Props) {
  const [suggestions, setSuggestions] = useState<PostcodeResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [debouncedValue] = useDebounce(value, 300);

  useEffect(() => {
    if (!debouncedValue || debouncedValue.length < 3) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setIsLoading(true);
      try {
        // Clean postcode (remove spaces, uppercase)
        const cleanPostcode = debouncedValue.replace(/\s/g, '').toUpperCase();

        // Use postcodes.io autocomplete endpoint
        const response = await fetch(
          `https://api.postcodes.io/postcodes/${cleanPostcode}/autocomplete`
        );

        if (response.ok) {
          const data = await response.json();
          if (data.result) {
            setSuggestions(
              data.result.map((pc: string) => ({
                postcode: pc,
              }))
            );
            setShowSuggestions(true);
          }
        }
      } catch (error) {
        console.error('Postcode lookup failed:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedValue]);

  const handleSelect = async (postcode: string) => {
    onChange(postcode);
    setShowSuggestions(false);

    // Fetch full postcode details
    if (onSelect) {
      try {
        const response = await fetch(`https://api.postcodes.io/postcodes/${postcode}`);
        if (response.ok) {
          const data = await response.json();
          onSelect(data.result);
        }
      } catch (error) {
        console.error('Failed to fetch postcode details:', error);
      }
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        className={className}
        placeholder={placeholder}
        autoComplete="off"
      />

      {isLoading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-primary border-t-transparent" />
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
          <ul className="max-h-60 overflow-auto py-1">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSelect(suggestion.postcode)}
                className="cursor-pointer px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium text-gray-900">{suggestion.postcode}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
