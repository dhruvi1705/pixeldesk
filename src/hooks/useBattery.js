import { useState, useEffect } from "react";

export function useBattery() {
  const [batteryState, setBatteryState] = useState({
    level: 92,
    charging: false,
    isSupported: false,
    statusText: "ONLINE"
  });

  useEffect(() => {
    let batteryInstance = null;

    const handleBatteryUpdate = (battery) => {
      setBatteryState({
        level: Math.round(battery.level * 100),
        charging: battery.charging,
        isSupported: true,
        statusText: battery.charging ? "CHARGING" : "ONLINE"
      });
    };

    if (typeof navigator !== "undefined" && "getBattery" in navigator) {
      navigator.getBattery()
        .then((battery) => {
          batteryInstance = battery;
          handleBatteryUpdate(battery);

          battery.addEventListener("levelchange", () => handleBatteryUpdate(battery));
          battery.addEventListener("chargingchange", () => handleBatteryUpdate(battery));
        })
        .catch(() => {
          // Graceful fallback if permission rejected or blocked
          setBatteryState((prev) => ({ ...prev, isSupported: false, statusText: "ONLINE" }));
        });
    }

    return () => {
      if (batteryInstance) {
        try {
          batteryInstance.removeEventListener("levelchange", () => {});
          batteryInstance.removeEventListener("chargingchange", () => {});
        } catch {
          // Ignore cleanup errors
        }
      }
    };
  }, []);

  return batteryState;
}
