import { useState } from "react";

type BluetoothDeviceLike = {
  id: string;
  name?: string;
  gatt?: {
    connected: boolean;
    connect: () => Promise<unknown>;
    disconnect: () => void;
  };
  addEventListener: (
    type: string,
    listener: () => void,
  ) => void;
};

type BluetoothApiLike = {
  requestDevice: (options: {
    acceptAllDevices: boolean;
  }) => Promise<BluetoothDeviceLike>;
};

function getBluetooth(): BluetoothApiLike | undefined {
  return (
    navigator as Navigator & {
      bluetooth?: BluetoothApiLike;
    }
  ).bluetooth;
}

export default function App() {
  const [device, setDevice] = useState<BluetoothDeviceLike | null>(null);
  const [status, setStatus] = useState("Ready");
  const [error, setError] = useState("");

  async function selectBluetoothDevice() {
    setError("");

    const bluetooth = getBluetooth();

    if (!bluetooth) {
      setStatus("Bluetooth unavailable");
      setError(
        "This browser does not expose Web Bluetooth. Try a supported Chromium-based browser over HTTPS or localhost.",
      );
      return;
    }

    try {
      setStatus("Waiting for device selection…");

      // Must be called directly from a user action, such as this button click.
      const selected = await bluetooth.requestDevice({
        acceptAllDevices: true,
      });

      selected.addEventListener("gattserverdisconnected", () => {
        setStatus("Device disconnected");
      });

      setDevice(selected);
      setStatus("Device selected");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unknown Bluetooth error";

      setStatus("Not connected");
      setError(message);
    }
  }

  async function connect() {
    if (!device?.gatt) {
      setError("This device does not expose a connectable GATT server.");
      return;
    }

    try {
      setError("");
      setStatus("Connecting…");
      await device.gatt.connect();
      setStatus("Connected");
    } catch (err) {
      setStatus("Connection failed");
      setError(err instanceof Error ? err.message : "Bluetooth connection failed");
    }
  }

  function disconnect() {
    if (device?.gatt?.connected) {
      device.gatt.disconnect();
      setStatus("Disconnected");
    }
  }

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <h1>Bluetooth Device Test</h1>
        <p>
          Select a Bluetooth device using the browser permission prompt. This
          is a real device selection—not a simulated scan.
        </p>

        <button style={styles.button} onClick={selectBluetoothDevice}>
          Select Bluetooth Device
        </button>

        {device && (
          <div style={styles.device}>
            <h2>{device.name || "Unnamed Bluetooth device"}</h2>
            <p><strong>Browser device ID:</strong> {device.id}</p>
            <p><strong>Status:</strong> {status}</p>

            <button style={styles.button} onClick={connect}>
              Connect over GATT
            </button>

            <button style={styles.secondaryButton} onClick={disconnect}>
              Disconnect
            </button>
          </div>
        )}

        {!device && <p><strong>Status:</strong> {status}</p>}
        {error && <p style={styles.error}>{error}</p>}

        <p style={styles.note}>
          This browser API does not provide a continuous nearby-device radar,
          Bluetooth Classic discovery, or RSSI signal readings.
        </p>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    background: "#07110f",
    color: "#e4fff4",
    fontFamily: "system-ui, sans-serif",
    padding: 24,
  },
  card: {
    width: "min(100%, 620px)",
    padding: 28,
    border: "1px solid #1f7654",
    borderRadius: 16,
    background: "#0d1c18",
    boxShadow: "0 0 32px #00ff8830",
  },
  button: {
    margin: "8px 8px 8px 0",
    padding: "11px 16px",
    border: 0,
    borderRadius: 8,
    background: "#00d982",
    color: "#03150e",
    fontWeight: 700,
    cursor: "pointer",
  },
  secondaryButton: {
    margin: 8,
    padding: "11px 16px",
    border: "1px solid #3e8068",
    borderRadius: 8,
    background: "transparent",
    color: "#e4fff4",
    cursor: "pointer",
  },
  device: {
    marginTop: 24,
    padding: 16,
    borderRadius: 10,
    background: "#132a22",
    overflowWrap: "anywhere",
  },
  error: {
    color: "#ff9b9b",
  },
  note: {
    marginTop: 24,
    color: "#a9c7ba",
    fontSize: 14,
  },
};
