import "./Frank.css";

export default function Frank() {
  return (
    <figure className="frank-card">
      <img
        className="frank-image"
        src="/frank.jpeg"
        alt="Frank, the WiFi fixer"
      />
      <figcaption className="frank-caption">
        Jeff the WiFi Fixer
      </figcaption>
    </figure>
  );
}
