import { useMemo, useState } from "react";
import "./App.css";

type Device = {
  id: string;
  name: string;
  category: string;
  distance: number;
  rssi: number;
  lastSeen: string;
  x: number;
  y: number;
};

const themes = [
  "Old Sub Radar",
  "Dark Mode",
  "Flashbang Mode",
  "Pastel Mode",
  "Sifi Mode",
  "Cat Mode",
];

const demoDevices: Device[] = [
  {
    id: "DEMO-001",
    name: "Demo Headphones",
    category: "Headphones",
    distance: 18,
    rssi: -54,
    lastSeen: "Just now",
    x: 58,
    y: 36,
  },
  {
    id: "DEMO-002",
    name: "Demo Phone",
    category: "Smartphone",
    distance: 42,
    rssi: -68,
    lastSeen: "Just now",
    x: 72,
    y: 62,
  },
  {
    id: "DEMO-003",
    name: "Demo Keyboard",
    category: "Keyboard",
    distance: 76,
    rssi: -82,
    lastSeen: "Just now",
    x: 34,
    y: 68,
  },
];

function signalColor(rssi: number) {
  if (rssi >= -60) return "strong";
  if (rssi >= -72) return "medium";
  if (rssi >= -85) return "weak";
  return "very-weak";
}

export default function App() {
  const [theme, setTheme] = useState("Dark Mode");
  const [demoMode, setDemoMode] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Closest");
  const [selected, setSelected] = useState<Device | null>(null);
  const [flashbangPrompt, setFlashbangPrompt] = useState(false);

  const devices = demoMode ? demoDevices : [];

  const visibleDevices = useMemo(() => {
    const filtered = devices.filter((device) =>
      `${device.name} ${device.category} ${device.id}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );

    return [...filtered].sort((a, b) => {
      switch (sort) {
        case "Furthest":
          return b.distance - a.distance;
        case "Strongest signal":
          return b.rssi - a.rssi;
        case "Weakest signal":
          return a.rssi - b.rssi;
        case "Name":
          return a.name.localeCompare(b.name);
        default:
          return a.distance - b.distance;
      }
    });
  }, [devices, search, sort]);

  function chooseTheme(nextTheme: string) {
    if (nextTheme === "Flashbang Mode") {
      setFlashbangPrompt(true);
      return;
    }
    setTheme(nextTheme);
  }

  return (
    <main className={`app theme-${theme.toLowerCase().replaceAll(" ", "-")}`}>
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">ᛒ</div>
          <div>
            <h1>BLUETOOTH RADAR</h1>
            <p>LOCAL DEVICE DASHBOARD</p>
          </div>
        </div>

        <div className="header-status">
          <span className={`status-dot ${scanning ? "active" : ""}`} />
          {scanning ? "Scanning" : "Ready"}
          <span className="divider">|</span>
          {demoMode ? "DEMO MODE" : "REAL MODE — NO SCAN"}
        </div>

        <div className="controls">
          <button
            className="button secondary"
            onClick={() => setDemoMode((current) => !current)}
          >
            {demoMode ? "EXIT DEMO" : "DEMO MODE"}
          </button>
          <button
            className="button primary"
            onClick={() => setScanning((current) => !current)}
            disabled={!demoMode}
            title={
              !demoMode
                ? "Real Bluetooth scanning is not implemented in this starter."
                : ""
            }
          >
            {scanning ? "STOP SCAN" : "START SCAN"}
          </button>
        </div>
      </header>

      <nav className="theme-bar" aria-label="Theme selector">
        <span>THEME</span>
        {themes.map((item) => (
          <button
            key={item}
            className={`theme-choice ${theme === item ? "chosen" : ""}`}
            onClick={() => chooseTheme(item)}
          >
            {item}
          </button>
        ))}
      </nav>

      <section className="dashboard">
        <aside className="device-panel panel">
          <div className="panel-heading">
            <div>
              <h2>Devices</h2>
              <p>{visibleDevices.length} shown</p>
            </div>
            <span className="badge">{demoMode ? "DEMO" : "LIVE"}</span>
          </div>

          <input
            className="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search devices..."
            aria-label="Search devices"
          />

          <select
            className="sort"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            aria-label="Sort devices"
          >
            {[
              "Closest",
              "Furthest",
              "Strongest signal",
              "Weakest signal",
              "Name",
            ].map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>

          <div className="device-list">
            {visibleDevices.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">⌁</span>
                <strong>No devices to display</strong>
                <p>Turn on Demo Mode to view sample devices.</p>
              </div>
            ) : (
              visibleDevices.map((device) => (
                <button
                  className={`device-row ${
                    selected?.id === device.id ? "selected" : ""
                  }`}
                  key={device.id}
                  onClick={() => setSelected(device)}
                >
                  <span className={`device-icon ${signalColor(device.rssi)}`}>
                    ◉
                  </span>
                  <span className="device-copy">
                    <strong>{device.name}</strong>
                    <small>{device.category} · {device.id}</small>
                    <small>{device.distance} m · {device.rssi} dBm</small>
                  </span>
                  <span className="chevron">›</span>
                </button>
              ))
            )}
          </div>

          {selected && (
            <div className="details">
              <div className="details-title">
                <h3>{selected.name}</h3>
                <button
                  className="icon-button"
                  onClick={() => setSelected(null)}
                  aria-label="Close device details"
                >
                  ×
                </button>
              </div>
              <p>{selected.category} · DEMO DEVICE</p>
              <dl>
                <dt>Identifier</dt><dd>{selected.id}</dd>
                <dt>RSSI</dt><dd>{selected.rssi} dBm</dd>
                <dt>Estimated distance</dt><dd>{selected.distance} m</dd>
                <dt>Last detected</dt><dd>{selected.lastSeen}</dd>
              </dl>
              <small className="note">
                Demo values are simulated and do not represent detected devices.
              </small>
            </div>
          )}
        </aside>

        <section className="radar-panel panel">
          <div className="radar-heading">
            <div>
              <h2>Radar</h2>
              <p>Visual scale: 120 m · not a guaranteed Bluetooth range</p>
            </div>
            <span className={`scan-label ${scanning ? "scanning" : ""}`}>
              {scanning ? "● SCANNING" : "○ STANDBY"}
            </span>
          </div>

          <div className={`radar ${scanning ? "is-scanning" : ""}`}>
            <div className="direction north">N</div>
            <div className="direction east">E</div>
            <div className="direction south">S</div>
            <div className="direction west">W</div>
            <div className="crosshair horizontal" />
            <div className="crosshair vertical" />

            {Array.from({ length: 12 }, (_, index) => {
              const size = `${((index + 1) / 12) * 100}%`;
              return (
                <div className="range-ring" key={index} style={{ width: size, height: size }}>
                  <span>{(index + 1) * 10}m</span>
                </div>
              );
            })}

            <div className="sweep" />

            {demoMode &&
              demoDevices.map((device) => (
                <button
                  key={device.id}
                  className={`radar-marker ${signalColor(device.rssi)}`}
                  style={{ left: `${device.x}%`, top: `${device.y}%` }}
                  onClick={() => setSelected(device)}
                  title={`${device.name} — DEMO DEVICE`}
                  aria-label={`Select ${device.name}`}
                >
                  <span />
                </button>
              ))}

            <div className="radar-center">⌁</div>
          </div>

          <div className="radar-legend">
            <span><i className="legend-dot strong" /> Strong</span>
            <span><i className="legend-dot medium" /> Medium</span>
            <span><i className="legend-dot weak" /> Weak</span>
            <span><i className="legend-dot very-weak" /> Very weak</span>
          </div>
        </section>

        <aside className="stats-panel panel">
          <div className="panel-heading">
            <div>
              <h2>Signal overview</h2>
              <p>Current session</p>
            </div>
          </div>
          <div className="stat-card">
            <span>DEVICES SHOWN</span>
            <strong>{visibleDevices.length}</strong>
          </div>
          <div className="stat-card">
            <span>STRONGEST RSSI</span>
            <strong>{devices.length ? `${Math.max(...devices.map((d) => d.rssi))} dBm` : "—"}</strong>
          </div>
          <div className="stat-card">
            <span>CLOSEST ESTIMATE</span>
            <strong>{devices.length ? `${Math.min(...devices.map((d) => d.distance))} m` : "—"}</strong>
          </div>
          <div className="approximation">
            <strong>Distance estimates are approximate.</strong>
            <p>Walls, interference, antenna design, and device hardware affect RSSI measurements.</p>
          </div>
          <div className="mode-note">
            {!demoMode
              ? "Real Bluetooth scanning is not available in this starter."
              : "Sample devices are simulated and labeled DEMO."}
          </div>
        </aside>
      </section>

      <footer className="footer">
        <span>{visibleDevices.length} devices shown</span>
        <span>{demoMode ? "Demo data" : "No Bluetooth scan running"}</span>
        <span>Radar range: 120 m</span>
      </footer>

      <button className="wifi-joke" onClick={() => alert("CALL JEFF THE WIFI FIXER?\n\nThis joke feature does not change WiFi settings.")}>
        🔧 FIX MY WIFI
      </button>

      {flashbangPrompt && (
        <div className="modal-backdrop" role="presentation">
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="flashbang-title">
            <h2 id="flashbang-title">WARNING: FLASHBANG MODE!</h2>
            <p>This theme is VERY bright. Continue?</p>
            <div className="modal-actions">
              <button
                className="button primary"
                onClick={() => {
                  setTheme("Flashbang Mode");
                  setFlashbangPrompt(false);
                }}
              >
                ACTIVATE FLASHBANG
              </button>
              <button className="button secondary" onClick={() => setFlashbangPrompt(false)}>
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
