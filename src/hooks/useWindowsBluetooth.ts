import { useEffect, useState } from "react";

export interface ConnectedClassicDevice {
  name: string;
}

declare global {
  interface Window {
    bluetoothRadar?: {
      getConnectedClassicDevices: () => Promise<ConnectedClassicDevice[]>;
    };
  }
}

export function useWindowsBluetooth(enabled: boolean) {
  const [devices, setDevices] = useState<ConnectedClassicDevice[]>([]);
  const [status, setStatus] = useState("Press Scan to check Windows devices.");
  const [error, setError] = useState("");

  useEffect(() => {
    const api = window.bluetoothRadar;

    if (!enabled) {
      setError("");
      setStatus(
        api
          ? "Press Scan to check connected Windows Bluetooth devices."
          : "Windows device monitoring is available in the installed app.",
      );
      return;
    }

    if (!api) {
      setError("");
      setStatus(
        "Windows Bluetooth monitoring is only available in the installed app.",
      );
      return;
    }

    let stopped = false;
    let requestInProgress = false;

    async function refresh() {
      if (requestInProgress || stopped) return;

      requestInProgress = true;

      try {
        const result = await api!.getConnectedClassicDevices();

        if (stopped) return;

        const validDevices = Array.isArray(result)
          ? result.filter(
              (device) =>
                device &&
                typeof device.name === "string" &&
                device.name.trim().length > 0,
            )
          : [];

        setDevices(validDevices);
        setError("");
        setStatus(
          validDevices.length === 0
            ? "No connected Classic Bluetooth devices found."
            : `${validDevices.length} connected Windows Bluetooth device${
                validDevices.length === 1 ? "" : "s"
              }.`,
        );
      } catch (err) {
        if (stopped) return;

        setError(
          err instanceof Error
            ? err.message
            : "Could not read Windows Bluetooth devices.",
        );
        setStatus("Windows Bluetooth check failed.");
      } finally {
        requestInProgress = false;
      }
    }

    setStatus("Checking Windows-connected Bluetooth devices…");
    void refresh();

    const timer = window.setInterval(() => {
      void refresh();
    }, 3000);

    return () => {
      stopped = true;
      window.clearInterval(timer);
    };
  }, [enabled]);

  return { devices, status, error };
}
