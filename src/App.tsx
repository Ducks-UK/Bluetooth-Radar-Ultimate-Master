import { useMemo, useState } from "react";
import Header from "./components/Header";
import Radar from "./components/Radar";
import DeviceList from "./components/DeviceList";
import DeviceDetails from "./components/DeviceDetails";
import ThemeSelector from "./components/ThemeSelector";
import { useBluetooth } from "./hooks/useBluetooth";
import type { RadarDevice, ThemeName } from "./types";

const demoDevices: RadarDevice[] = [
  {
    id: "DEMO-001",
    name: "Demo Headphones",
    category: "Headphones",
    distance: 18,
    rssi: -54,
    lastSeen: "Just now",
    demo: true,
  },
  {
    id: "DEMO-002",
    name: "Demo Phone",
    category: "Smartphone",
    distance: 42,
    rssi: -68,
    lastSeen: "Just now",
    demo: true,
  },
  {
    id: "DEMO-003",
    name: "Demo Keyboard",
    category: "Keyboard",
    distance: 76,
    rssi: -82,
    lastSeen: "Just now",
    demo: true,
  },
];

export default function App() {
  const [demo, setDemo] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [selected, setSelected] = useState<RadarDevice | null>(null);
  const [theme, setTheme] = useState<ThemeName>("Dark Mode");
  const bluetooth = useBluetooth();

  const devices = useMemo<RadarDevice[]>(() => {
    const result = demo ? [...demoDevices] : [];

    if (bluetooth.device) {
      result.push({
        id: bluetooth.device.id,
        name: bluetooth.device.name || "Unnamed Bluetooth device",
        category: "Unknown Device",
        distance: 0,
        rssi: 0,
        lastSeen: bluetooth.status,
      });
    }

    return result;
  }, [demo, bluetooth.device, bluetooth.status]);

  function changeTheme(next: ThemeName) {
    if (
      next === "Flashbang Mode" &&
      !window.confirm(
        "WARNING: FLASHBANG MODE! This theme is VERY bright. Continue?",
      )
    ) {
      return;
    }

    setTheme(next);
  }

  return (
    <main className={`app theme-${theme.toLowerCase().replace(/ /g, "-")}`}>
      <Header
        demo={demo}
        scanning={scanning}
        onDemo={() => {
          setDemo((value) => !value);
          setScanning(false);
        }}
        onScan={() => setScanning((value) => !value)}
        onBluetooth={bluetooth.selectDevice}
      />

      {bluetooth.error && (
        <div className="notice">{bluetooth.error}</div>
      )}

      {bluetooth.device && (
        <div className="notice">
          Bluetooth: {bluetooth.device.name || "Unnamed device"} —{" "}
          {bluetooth.status}
          {bluetooth.device.gatt && (
            <>
              {" "}
              <button className="text-button" onClick={bluetooth.connect}>
                Connect
              </button>
              <button className="text-button" onClick={bluetooth.disconnect}>
                Disconnect
              </button>
            </>
          )}
        </div>
      )}

      <ThemeSelector theme={theme} onChange={changeTheme} />

      <section className="dashboard">
        <DeviceList devices={devices} onSelect={setSelected} />

        <Radar
          devices={devices}
          scanning={scanning}
          onSelect={setSelected}
        />

        <aside className="panel stats-panel">
          <h2>Signal overview</h2>
          <p>
            Devices shown: <strong>{devices.length}</strong>
          </p>
          <p>
            Radar scale: <strong>120 m</strong>
          </p>
          <p className="note">
            Distance and signal values are not available from this browser
            selection flow. Demo values are simulated.
          </p>

          <DeviceDetails
            device={selected}
            onClose={() => setSelected(null)}
          />
        </aside>
      </section>

      <footer className="footer">
        <span>{devices.length} devices shown</span>
        <span>{demo ? "Demo data enabled" : "No demo devices"}</span>
        <span>{bluetooth.status}</span>
      </footer>
    </main>
  );
}
