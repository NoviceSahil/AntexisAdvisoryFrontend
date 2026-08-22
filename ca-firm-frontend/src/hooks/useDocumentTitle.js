import { useEffect } from 'react';

// The browser tab title never changed per page before this - every route
// showed the same static "Antexis Advisory LLP" from public/index.html,
// which makes bookmarking, multiple open tabs, and search-result snippets
// all equally unhelpful.
export default function useDocumentTitle(title) {
  useEffect(() => {
    const previous = document.title;
    document.title = title ? `${title} - Antexis Advisory` : 'Antexis Advisory LLP';
    return () => {
      document.title = previous;
    };
  }, [title]);
}
