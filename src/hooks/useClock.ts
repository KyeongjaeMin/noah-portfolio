import { useEffect, useMemo, useState } from 'react';

/** 지정한 지역의 현재 시각 (예: "11:42 PM") — 10초마다 갱신 */
export function useClock(timeZone: string): string {
  const fmt = useMemo(() => {
    try {
      return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone });
    } catch {
      return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    }
  }, [timeZone]);

  const [now, setNow] = useState(() => fmt.format(new Date()));

  useEffect(() => {
    setNow(fmt.format(new Date()));
    const id = window.setInterval(() => setNow(fmt.format(new Date())), 10_000);
    return () => window.clearInterval(id);
  }, [fmt]);

  return now;
}
