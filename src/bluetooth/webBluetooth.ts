export type BrowserBluetoothDevice = {
  id: string;
  name?: string;
  gatt?: {
    connected: boolean;
    connect: () => Promise<unknown>;
    disconnect: () => void;
  };
  addEventListener: (type: string, listener: () => void) => void;
};

type BluetoothApi = {
  requestDevice: (options: {
    acceptAllDevices: boolean;
  }) => Promise<BrowserBluetoothDevice>;
};

export function browserBluetooth(): BluetoothApi | undefined {
  return (navigator as Navigator & { bluetooth?: BluetoothApi }).bluetooth;
}

export async function chooseDevice(): Promise<BrowserBluetoothDevice> {
  const bluetooth = browserBluetooth();

  if (!bluetooth) {
    throw new Error(
      "Web Bluetooth is unavailable in this browser. Try a supported browser on localhost or HTTPS.",
    );
  }

  return bluetooth.requestDevice({ acceptAllDevices: true });
}
