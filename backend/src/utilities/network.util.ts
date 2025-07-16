import os from "os";
import { Address4 } from "ip-address";

export const getLocalIp = (): string => {
  const interfaces = os.networkInterfaces();

  // Prioritize physical interfaces (eth0, en0, etc.)
  const preferredOrder = ["eth0", "en0", "wlan0", "Wi-Fi", "Ethernet"];
  const ignoreKeywords = ["Virtual", "vEthernet", "docker", "lo"];

  for (const [name, addresses] of Object.entries(interfaces)) {
    if (!addresses) continue;

    // Skip virtual/unwanted interfaces
    if (ignoreKeywords.some((k) => name.includes(k))) continue;

    for (const addr of addresses) {
      const isIPv4 = addr.family === "IPv4";
      const isInternal = addr.internal;

      if (isIPv4 && !isInternal) {
        // Validate IP format
        const ip = new Address4(addr.address);
        return ip.correctForm();
      }
    }
  }

  throw new Error("No valid local IP found. Check network connections.");
};
