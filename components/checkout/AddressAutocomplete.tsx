'use client';

import { useState, useEffect, useRef } from 'react';
import { useDebouncedCallback } from 'use-debounce';

interface Address {
  line_1: string;
  line_2: string;
  line_3: string;
  line_4: string;
  locality: string;
  town_or_city: string;
  county: string;
  district: string;
  country: string;
  postcode: string;
  formatted_address: string[];
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onAddressSelect: (address: Address) => void;
  placeholder?: string;
  className?: string;
}

export function AddressAutocomplete({
  value,
  onChange,
  onAddressSelect,
  placeholder = 'Start typing your address...',
  className = '',
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState('');
  const isSelectingRef = useRef(false);

  const fetchSuggestions = useDebouncedCallback(async (query: string) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const apiKey = process.env.NEXT_PUBLIC_GETADDRESS_API_KEY;

      if (!apiKey || apiKey === 'your_public_api_key_here') {
        throw new Error('getAddress API key not configured');
      }

      // getAddress.io autocomplete API
      const response = await fetch(
        `https://api.getaddress.io/autocomplete/${encodeURIComponent(query)}?api-key=${apiKey}&all=true&top=6`
      );

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Daily API limit reached (20 lookups/day)');
        }
        throw new Error('Failed to fetch address suggestions');
      }

      const data = await response.json();

      if (data.suggestions && data.suggestions.length > 0) {
        setSuggestions(data.suggestions);
      } else {
        setSuggestions([]);
      }
    } catch (err) {
      console.error('Address autocomplete error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch suggestions');
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, 300);

  useEffect(() => {
    // Don't fetch if this change was from selecting an address
    if (isSelectingRef.current) {
      setShowSuggestions(false);
      return;
    }

    if (value.length >= 3) {
      fetchSuggestions(value);
      setShowSuggestions(true);
    } else if (value.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [value, fetchSuggestions]);

  const handleSelectSuggestion = async (suggestion: any) => {
    // Set ref to prevent useEffect from triggering
    isSelectingRef.current = true;
    setShowSuggestions(false);
    setSuggestions([]);
    setLoading(true);
    setError('');

    try {
      const apiKey = process.env.NEXT_PUBLIC_GETADDRESS_API_KEY;

      // Get full address details using the suggestion ID
      const response = await fetch(
        `https://api.getaddress.io/get/${suggestion.id}?api-key=${apiKey}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch full address');
      }

      const data = await response.json();

      const address: Address = {
        line_1: data.line_1 || '',
        line_2: data.line_2 || '',
        line_3: data.line_3 || '',
        line_4: data.line_4 || '',
        locality: data.locality || '',
        town_or_city: data.town_or_city || '',
        county: data.county || '',
        district: data.district || '',
        country: data.country || 'United Kingdom',
        postcode: data.postcode || '',
        formatted_address: data.formatted_address || [],
      };

      onChange(suggestion.address);
      onAddressSelect(address);

      // Reset after a delay to allow manual editing later
      setTimeout(() => {
        isSelectingRef.current = false;
      }, 1000);
    } catch (err) {
      console.error('Address fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch address');
      isSelectingRef.current = false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            // Reset the ref when user manually types
            isSelectingRef.current = false;
            onChange(e.target.value);
          }}
          onBlur={() => {
            // Delay hiding suggestions to allow click events to fire
            setTimeout(() => {
              setShowSuggestions(false);
              setSuggestions([]);
            }, 300);
          }}
          onFocus={() => {
            // Only show suggestions if we have them and didn't just select
            if (suggestions.length > 0 && !isSelectingRef.current && value.length >= 3) {
              setShowSuggestions(true);
            }
          }}
          placeholder={placeholder}
          className={className}
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <svg
              className="h-5 w-5 animate-spin text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
          <ul className="max-h-60 overflow-auto py-1">
            {suggestions.map((suggestion, index) => (
              <li key={index}>
                <button
                  type="button"
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                >
                  <div className="font-medium text-gray-900">{suggestion.address}</div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showSuggestions && value.length >= 3 && suggestions.length === 0 && !loading && (
        <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-lg">
          <p className="text-sm text-gray-500">No addresses found. Try a different search.</p>
        </div>
      )}
    </div>
  );
}
