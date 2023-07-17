import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function NotFoundPage(): JSX.Element | null {
  const { push } = useRouter();

  useEffect(() => {
    push('/');
  }, [push]);

  return null;
}
