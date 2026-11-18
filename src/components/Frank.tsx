import frankImage from "../images/frank.jpeg";
import "./Frank.css";

export default function Frank() {
  return (
    <section className="frank-card" aria-label="Frank">
      <img
        className="frank-image"
        src={frankImage}
        alt="Frank, a hand-drawn character on graph paper"
      />
      <p className="frank-caption">Frank</p>
    </section>
  );
}
