import type { ThemeName } from "../types";

const themes: ThemeName[] = [
  "Old Sub Radar",
  "Dark Mode",
  "Flashbang Mode",
  "Pastel Mode",
  "Sifi Mode",
  "Cat Mode",
];

type Props = {
  theme: ThemeName;
  onChange: (theme: ThemeName) => void;
};

export default function ThemeSelector({ theme, onChange }: Props) {
  return (
    <nav className="theme-bar" aria-label="Theme selector">
      <span>THEME</span>
      {themes.map((item) => (
        <button
          key={item}
          className={`theme-choice ${theme === item ? "chosen" : ""}`}
          onClick={() => onChange(item)}
        >
          {item}
        </button>
      ))}
    </nav>
  );
}
