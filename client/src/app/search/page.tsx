'use client';

import { useSearchArticlesQuery } from '@/utils/redux/ApiSlice';
import { skipToken } from '@reduxjs/toolkit/dist/query/react';
import { useSearchParams } from 'next/navigation';

const SearchResults = () => {
  const searchParams = useSearchParams().get('_query');
  const { data: searchResults, isLoading: isSearching } =
    useSearchArticlesQuery(searchParams ?? skipToken);
  if (isSearching) return <h1>Loading ...</h1>;
  console.log(searchResults);
  return (
    <div className="max-w-2xl mx-auto flex items-center justify-center">
      <div className="flex flex-col space-y-2 divide-y">
        <h3 className="text-semibold mb-4">
          Results: {searchResults?.length ?? 0}
        </h3>
        {searchResults?.map((result, idx) => (
          <div key={idx} className="group/seresult pt-6">
            {result.imageUrl && (
              <img
                src={result.imageUrl}
                className="w-full h-64 group-hover/article:opacity-90 rounded-t-lg rounded-tr-lg object-cover"
                alt=""
              />
            )}
            <a
              href={`/${result.slug}`}
              className="group-hover/seresult:text-indigo-500 hover:underline font-bold text-2xl"
            >
              {result.title}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
