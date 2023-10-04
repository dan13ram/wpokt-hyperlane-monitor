import { useCallback, useState } from 'react';

export const usePage = (): {
  page: number;
  nextPage: () => void;
  prevPage: () => void;
} => {
  const [page, setPage] = useState(1);

  const nextPage = useCallback(() => {
    setPage(_page => _page + 1);
  }, []);

  const prevPage = useCallback(() => {
    setPage(_page => (_page - 1 > 0 ? _page - 1 : 1));
  }, []);

  return {
    page,
    nextPage,
    prevPage,
  };
};
