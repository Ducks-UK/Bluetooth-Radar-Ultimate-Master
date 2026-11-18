import "./Frank.css";

export default function Frank() {
  return (
    <figure className="frank-card">
      <img
        className="frank-image"
        src="./frank.jpeg"
        alt="Frank, a hand-drawn character on graph paper"
      />
      <figcaption className="frank-caption">Frank</figcaption>
    </figure>
  );
}
