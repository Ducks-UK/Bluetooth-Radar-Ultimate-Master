import { useState } from "react";
import type { CSSProperties } from "react";
import frankImage from "../assets/frank.png";
import "./Frank.css";

export default function Frank() {
  const [showPopup, setShowPopup] = useState(false);
  const [fixed, setFixed] = useState(false);

  return (
    <>
      <figure className="frank-card">
        <img
          className="frank-image"
          src={frankImage}
          alt="Jeff the WiFi Fixer"
        />
        <figcaption className="frank-caption">
          Jeff the WiFi Fixer
        </figcaption>

        <button
          type="button"
          className="fix-wifi-button"
          onClick={() => {
            setFixed(false);
            setShowPopup(true);
          }}
        >
          Fix My WiFi
        </button>
      </figure>

      {showPopup && (
        <div
          role="presentation"
          onClick={() => setShowPopup(false)}
          style={overlayStyle}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="frank-dialog-title"
            onClick={(event) => event.stopPropagation()}
            style={dialogStyle}
          >
            <button
              type="button"
              aria-label="Close popup"
              onClick={() => setShowPopup(false)}
              style={closeButtonStyle}
            >
              ×
            </button>

            {fixed ? (
              <>
                <img
                  src={frankImage}
                  alt="Jeff the WiFi Fixer"
                  style={successImageStyle}
                />
                <h2 id="frank-dialog-title">WiFi fixed!</h2>
                <p>Jeff the WiFi Fixer has saved the day.</p>
                <button
                  type="button"
                  onClick={() => setShowPopup(false)}
                >
                  Awesome
                </button>
              </>
            ) : (
              <>
                <h2 id="frank-dialog-title">Need a WiFi fix?</h2>
                <p>Jeff is ready to work his magic.</p>
                <button type="button" onClick={() => setFixed(true)}>
                  Let Jeff fix it
                </button>
              </>
            )}
          </section>
        </div>
      )}
    </>
  );
}

const overlayStyle: CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: 1000,
  display: "grid",
  placeItems: "center",
  padding: "1rem",
  background: "rgba(0, 0, 0, 0.7)",
};

const dialogStyle: CSSProperties = {
  position: "relative",
  width: "min(100%, 380px)",
  padding: "2rem",
  borderRadius: "12px",
  background: "#171923",
  color: "#fff",
  textAlign: "center",
  boxShadow: "0 12px 40px rgba(0, 0, 0, 0.4)",
};

const closeButtonStyle: CSSProperties = {
  position: "absolute",
  top: "0.5rem",
  right: "0.75rem",
  border: 0,
  background: "transparent",
  color: "inherit",
  fontSize: "1.75rem",
  cursor: "pointer",
};

const successImageStyle: CSSProperties = {
  display: "block",
  width: "min(100%, 220px)",
  maxHeight: "240px",
  objectFit: "contain",
  margin: "0 auto",
  borderRadius: "8px",
};
