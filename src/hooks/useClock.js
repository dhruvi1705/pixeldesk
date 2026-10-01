import { useState, useEffect } from "react";

export function useClock(format = "12h") {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const dateString = time.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric"
  });

  const is12Hour = format === "12h";
  const hours = is12Hour ? time.getHours() % 12 || 12 : time.getHours();
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const seconds = time.getSeconds().toString().padStart(2, "0");
  const ampm = is12Hour ? (time.getHours() >= 12 ? "PM" : "AM") : "";

  const timeString = is12Hour
    ? `${hours}:${minutes} ${ampm}`
    : `${hours.toString().padStart(2, "0")}:${minutes}`;

  return {
    date: dateString,
    time: timeString,
    rawTime: time,
    seconds
  };
}
