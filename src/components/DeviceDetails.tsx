import type { RadarDevice } from "../types";

type Props = {
  device: RadarDevice | null;
  onClose: () => void;
};

export default function DeviceDetails({ device, onClose }: Props) {
  if (!device) return null;

  return (
    <section className="details panel">
      <div className="details-title">
        <h2>{device.name}</h2>
        <button className="icon-button" onClick={onClose} aria-label="Close">
          ×
        </button>
      </div>
      <p>{device.category}{device.demo ? " · DEMO DEVICE" : ""}</p>
      <dl>
        <dt>Identifier</dt><dd>{device.id}</dd>
        <dt>RSSI</dt><dd>{device.rssi} dBm (demo value)</dd>
        <dt>Estimated distance</dt><dd>{device.distance} m (demo value)</dd>
        <dt>Last seen</dt><dd>{device.lastSeen}</dd>
      </dl>
      <small className="note">
        Browser device selection does not provide RSSI or distance readings.
      </small>
    </section>
  );
}
