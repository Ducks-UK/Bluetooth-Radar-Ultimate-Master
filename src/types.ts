export type RadarDevice = {
  id: string;
  name: string;
  category: string;
  distance: number;
  rssi: number;
  lastSeen: string;
  demo?: boolean;
};

export type ThemeName =
  | "Old Sub Radar"
  | "Dark Mode"
  | "Flashbang Mode"
  | "Pastel Mode"
  | "Sifi Mode"
  | "Cat Mode";
