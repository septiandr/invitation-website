import { useEffect, useState } from "react";
import { getCountdown } from "../lib/formatters";

export function useCountdown(targetIso: string) {
  const [tick, setTick] = useState(() => getCountdown(targetIso));

  useEffect(() => {
    const id = setInterval(() => setTick(getCountdown(targetIso)), 1000);
    return () => clearInterval(id);
  }, [targetIso]);

  return tick;
}
