using System.ComponentModel;
using System.Runtime.InteropServices;
using System.Text;
using System.Text.Json;

internal static class Program
{
    private const int ErrorNoMoreItems = 259;
    private const int ErrorNotFound = 1168;

    private static int Main()
    {
        try
        {
            Console.OutputEncoding = Encoding.UTF8;

            var search = new BluetoothDeviceSearchParams
            {
                Size = (uint)Marshal.SizeOf<BluetoothDeviceSearchParams>(),
                ReturnAuthenticated = 1,
                ReturnRemembered = 1,
                ReturnUnknown = 0,
                ReturnConnected = 1,
                IssueInquiry = 0,
                TimeoutMultiplier = 0,
                Radio = IntPtr.Zero,
            };

            var deviceInfo = CreateDeviceInfo();
            var findHandle = BluetoothFindFirstDevice(ref search, ref deviceInfo);
            var devices = new List<object>();

            if (findHandle == IntPtr.Zero)
            {
                var error = Marshal.GetLastWin32Error();

                if (error == ErrorNoMoreItems || error == ErrorNotFound)
                {
                    Console.WriteLine("[]");
                    return 0;
                }

                throw new Win32Exception(error);
            }

            try
            {
                do
                {
                    // Return only devices Windows reports as currently connected.
                    if (deviceInfo.Connected != 0)
                    {
                        var name = (deviceInfo.Name ?? string.Empty).TrimEnd('\0').Trim();

                        devices.Add(new
                        {
                            name = string.IsNullOrWhiteSpace(name)
                                ? "Unnamed connected Bluetooth device"
                                : name,
                        });
                    }

                    deviceInfo = CreateDeviceInfo();
                }
                while (BluetoothFindNextDevice(findHandle, ref deviceInfo));
            }
            finally
            {
                BluetoothFindDeviceClose(findHandle);
            }

            Console.WriteLine(JsonSerializer.Serialize(devices));
            return 0;
        }
        catch (Exception error)
        {
            Console.Error.WriteLine(error.Message);
            return 1;
        }
    }

    private static BluetoothDeviceInfo CreateDeviceInfo()
    {
        return new BluetoothDeviceInfo
        {
            Size = (uint)Marshal.SizeOf<BluetoothDeviceInfo>(),
            Name = string.Empty,
        };
    }

    [StructLayout(LayoutKind.Sequential)]
    private struct BluetoothDeviceSearchParams
    {
        public uint Size;
        public int ReturnAuthenticated;
        public int ReturnRemembered;
        public int ReturnUnknown;
        public int ReturnConnected;
        public int IssueInquiry;
        public byte TimeoutMultiplier;
        public IntPtr Radio;
    }

    [StructLayout(LayoutKind.Sequential)]
    private struct SystemTime
    {
        public ushort Year;
        public ushort Month;
        public ushort DayOfWeek;
        public ushort Day;
        public ushort Hour;
        public ushort Minute;
        public ushort Second;
        public ushort Milliseconds;
    }

    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)]
    private struct BluetoothDeviceInfo
    {
        public uint Size;
        public ulong Address;
        public uint ClassOfDevice;
        public int Connected;
        public int Remembered;
        public int Authenticated;
        public SystemTime LastSeen;
        public SystemTime LastUsed;

        [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 248)]
        public string Name;
    }

    [DllImport(
        "bthprops.cpl",
        CharSet = CharSet.Unicode,
        SetLastError = true)]
    private static extern IntPtr BluetoothFindFirstDevice(
        ref BluetoothDeviceSearchParams searchParams,
        ref BluetoothDeviceInfo deviceInfo);

    [DllImport(
        "bthprops.cpl",
        CharSet = CharSet.Unicode,
        SetLastError = true)]
    [return: MarshalAs(UnmanagedType.Bool)]
    private static extern bool BluetoothFindNextDevice(
        IntPtr findHandle,
        ref BluetoothDeviceInfo deviceInfo);

    [DllImport("bthprops.cpl", SetLastError = true)]
    [return: MarshalAs(UnmanagedType.Bool)]
    private static extern bool BluetoothFindDeviceClose(IntPtr findHandle);
}
