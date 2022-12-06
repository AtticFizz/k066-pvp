import { useEffect } from "react";
import { useTimer } from "react-timer-hook";

export default function Timer({ timeLimit, onExpire, stopped }) {
  const { seconds, minutes, pause } = useTimer({
    expiryTimestamp: new Date(Date.now() + timeLimit * 60000),
    onExpire,
  });

  useEffect(() => {
    if (stopped) pause();
  }, [stopped, pause]);

  return (
    <span className="fs-4">
      {minutes.toString().padStart(2, "0")}:
      {seconds.toString().padStart(2, "0")}
    </span>
  );
}
