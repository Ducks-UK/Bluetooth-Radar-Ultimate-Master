import { useState } from "react";
import {
  chooseDevice,
  type BrowserBluetoothDevice,
} from "../bluetooth/webBluetooth";

export function useBluetooth() {
  const [device, setDevice] = useState<BrowserBluetoothDevice | null>(null);
  const [status, setStatus] = useState("Ready");
  const [error, setError] = useState("");

  async function selectDevice() {
    setError("");

    try {
      setStatus("Choose a device in the browser dialog…");
      const found = await chooseDevice();

      found.addEventListener("gattserverdisconnected", () => {
        setStatus("Device disconnected");
      });

      setDevice(found);
      setStatus("Device selected");
    } catch (err) {
      setStatus("Not connected");
      setError(err instanceof Error ? err.message : "Bluetooth request failed");
    }
  }

  async function connect() {
    if (!device?.gatt) {
      setError("This selected device does not expose a connectable GATT server.");
      return;
    }

    try {
      setError("");
      setStatus("Connecting…");
      await device.gatt.connect();
      setStatus("Connected");
    } catch (err) {
      setStatus("Connection failed");
      setError(err instanceof Error ? err.message : "Connection failed");
    }
  }

  function disconnect() {
    if (device?.gatt?.connected) {
      device.gatt.disconnect();
      setStatus("Disconnected");
    }
  }

  return { device, status, error, selectDevice, connect, disconnect };
}
