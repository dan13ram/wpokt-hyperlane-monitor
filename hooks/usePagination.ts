import { Dispatch, SetStateAction, useCallback, useMemo } from 'react';

export type PaginationType = {
  page: number;
  nextPage: () => void;
  prevPage: () => void;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  lastPage: () => void;
  firstPage: () => void;
  totalPages: number;
  goToPage: (page: number) => void;
};

export const usePagination = ({
  totalPages,
  page,
  setPage,
}: {
  totalPages: number;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
}): PaginationType => {
  const hasNextPage = useMemo(() => page < totalPages, [page, totalPages]);

  const hasPrevPage = useMemo(() => page > 1, [page]);

  const nextPage = useCallback(() => {
    if (hasNextPage) {
      setPage(_page => _page + 1);
    }
  }, [hasNextPage, setPage]);

  const prevPage = useCallback(() => {
    if (hasPrevPage) {
      setPage(_page => (_page - 1 > 0 ? _page - 1 : 1));
    }
  }, [hasPrevPage, setPage]);

  const lastPage = useCallback(() => {
    setPage(totalPages || 1);
  }, [totalPages, setPage]);

  const firstPage = useCallback(() => {
    setPage(1);
  }, [setPage]);

  const goToPage = useCallback(
    (_page: number) => {
      const page = Math.floor(_page);
      if (page > 0 && page <= totalPages) {
        setPage(page);
      }
    },
    [setPage, totalPages],
  );

  return {
    page,
    nextPage,
    prevPage,
    hasNextPage,
    hasPrevPage,
    lastPage,
    firstPage,
    totalPages,
    goToPage,
  };
};
