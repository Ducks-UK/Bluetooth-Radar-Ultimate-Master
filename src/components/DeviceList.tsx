import type { RadarDevice } from "../types";

type Props = {
  devices: RadarDevice[];
  onSelect: (device: RadarDevice) => void;
};

export default function DeviceList({ devices, onSelect }: Props) {
  return (
    <aside className="panel device-panel">
      <div className="panel-heading">
        <div>
          <h2>Devices</h2>
          <p>{devices.length} shown</p>
        </div>
      </div>

      {devices.length === 0 ? (
        <div className="empty-state">
          <strong>No devices to display</strong>
          <p>Turn on Demo Mode for sample devices, or select a device using Bluetooth.</p>
        </div>
      ) : (
        <div className="device-list">
          {devices.map((device) => (
            <button
              className="device-row"
              key={device.id}
              onClick={() => onSelect(device)}
            >
              <span className="device-icon">◉</span>
              <span className="device-copy">
                <strong>{device.name}</strong>
                <small>{device.category}{device.demo ? " · DEMO DEVICE" : ""}</small>
                <small>{device.distance} m · {device.rssi} dBm</small>
              </span>
              <span>›</span>
            </button>
          ))}
        </div>
      )}
    </aside>
  );
}
