import { useEffect, useState } from 'react';

export const TimeAgo: React.FC<{ time: number | string | Date }> = ({
  time,
}) => {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate(n => n + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const now = Date.now();
  const date = new Date(time).getTime();
  const secondsAgo = Math.floor((now - date) / 1000);

  if (secondsAgo <= 0) {
    return <span>now</span>;
  }

  const hours = Math.floor(secondsAgo / 3600);
  const minutes = Math.floor((secondsAgo % 3600) / 60);
  const seconds = secondsAgo % 60;

  return (
    <span>
      {hours ? `${hours}h` : ''}
      {minutes ? `${minutes}m` : ''}
      {seconds ? `${seconds}s` : ''}
      {' ago'}
    </span>
  );
};
