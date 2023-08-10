import { useEffect, useState } from 'react';

export const TimeLeft: React.FC<{ time: number | string | Date }> = ({
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
  const secondsLeft = Math.floor((date - now) / 1000);

  if (secondsLeft <= 0) {
    return <span>now</span>;
  }

  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  return (
    <span>
      {'in '}
      {hours ? `${hours}h` : ''}
      {minutes ? `${minutes}m` : ''}
      {seconds ? `${seconds}s` : ''}
    </span>
  );
};
