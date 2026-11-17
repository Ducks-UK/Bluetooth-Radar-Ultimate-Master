import type { RadarDevice } from "../types";

type Props = {
  devices: RadarDevice[];
  scanning: boolean;
  onSelect: (device: RadarDevice) => void;
};

export default function Radar({ devices, scanning, onSelect }: Props) {
  return (
    <section className="radar-panel panel">
      <div className="radar-heading">
        <div>
          <h2>Radar</h2>
          <p>Visual scale: 120 m · not guaranteed Bluetooth range</p>
        </div>
        <span className={scanning ? "scan-label scanning" : "scan-label"}>
          {scanning ? "● SCANNING" : "○ STANDBY"}
        </span>
      </div>

      <div className={`radar ${scanning ? "is-scanning" : ""}`}>
        <span className="direction north">N</span>
        <span className="direction east">E</span>
        <span className="direction south">S</span>
        <span className="direction west">W</span>
        <div className="crosshair horizontal" />
        <div className="crosshair vertical" />

        {Array.from({ length: 12 }, (_, i) => (
          <div
            className="range-ring"
            key={i}
            style={{
              width: `${((i + 1) / 12) * 100}%`,
              height: `${((i + 1) / 12) * 100}%`,
            }}
          >
            <span>{(i + 1) * 10}m</span>
          </div>
        ))}

        <div className="sweep" />

        {devices.map((device, index) => (
          <button
            className={`radar-marker signal-${index % 4}`}
            key={device.id}
            style={{
              left: `${28 + ((index * 23) % 48)}%`,
              top: `${28 + ((index * 31) % 45)}%`,
            }}
            onClick={() => onSelect(device)}
            title={`${device.name} — ${device.demo ? "DEMO" : "selected device"}`}
            aria-label={`Select ${device.name}`}
          />
        ))}

        <div className="radar-center">ᛒ</div>
      </div>
    </section>
  );
}
