type Props = {
  demo: boolean;
  scanning: boolean;
  onDemo: () => void;
  onScan: () => void;
  onBluetooth: () => void;
};

export default function Header({
  demo,
  scanning,
  onDemo,
  onScan,
  onBluetooth,
}: Props) {
  return (
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
        {scanning ? "Demo scanning" : "Ready"} · {demo ? "DEMO MODE" : "REAL MODE"}
      </div>

      <div className="controls">
        <button className="button secondary" onClick={onDemo}>
          {demo ? "EXIT DEMO" : "DEMO MODE"}
        </button>
        <button className="button secondary" onClick={onBluetooth}>
          SELECT BLUETOOTH DEVICE
        </button>
        <button className="button primary" onClick={onScan} disabled={!demo}>
          {scanning ? "STOP DEMO" : "START DEMO"}
        </button>
      </div>
    </header>
  );
}
