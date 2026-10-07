import { AlgorithmDefinition, OsiState, CodeSnippets, Step, OsiLayer } from '../types/algorithm';

export const OSI_MODEL_CODE_SNIPPETS: CodeSnippets = {
  python: `# OSI 7-Layer Protocol Encapsulation & Decapsulation
class OSIStack:
    def __init__(self):
        self.payload = "GET /index.html HTTP/1.1"

    def encapsulate(self):
        l7_app = {"data": self.payload}
        l6_pres = {"tls": True, "encoding": "UTF-8", "payload": l7_app}
        l5_sess = {"session_id": "0x7F2B", "payload": l6_pres}
        l4_trans = {"tcp_port": (54321, 443), "payload": l5_sess}
        l3_net = {"ip_addr": ("192.168.1.10", "93.184.216.34"), "payload": l4_trans}
        l2_link = {"eth_mac": ("00:1A:2B:3C:4D:5E", "AA:BB:CC:DD:EE:FF"), "fcs": "0x9D4E", "payload": l3_net}
        l1_phys = "01010011 01100101 01101110 01100100"
        return l1_phys

    def decapsulate(self, bitstream):
        # Strips headers L1 -> L2 -> L3 -> L4 -> L5 -> L6 -> L7
        pass`,
  java: `public class OSIStack {
    public static void main(String[] args) {
        String data = "HTTP/1.1 200 OK Payload";
        String segment = "[TCP: 443 -> 54321] " + data;
        String packet = "[IP: 10.0.0.1 -> 10.0.0.2] " + segment;
        String frame = "[ETH MAC] " + packet + " [FCS CRC32]";
        String bits = "0101110010100110";
    }
}`,
  cpp: `struct OSIFrame {
    uint8_t  eth_header[14]; // L2 MAC
    uint32_t src_ip, dst_ip; // L3 IP
    uint16_t src_port, dst_port; // L4 TCP
    char     app_data[512];  // L5-L7 Payload
    uint32_t fcs_crc;        // L2 Trailer
};`,
  typescript: `interface OSIPacket {
  L7_Application: string;
  L6_Presentation: { encrypted: boolean };
  L5_Session: { sessionId: string };
  L4_Transport: { protocol: 'TCP' | 'UDP'; port: number };
  L3_Network: { srcIP: string; dstIP: string };
  L2_DataLink: { srcMAC: string; dstMAC: string; fcs: string };
  L1_Physical: string; // 01010101
}`,
};

export const OSI_LAYERS_INFO = [
  { n: 7, name: 'Application', pdu: 'Data', ex: 'HTTP, DNS, SMTP', purpose: 'App data creation & user network interface' },
  { n: 6, name: 'Presentation', pdu: 'Data', ex: 'TLS, encoding', purpose: 'Data encryption, compression, and translation' },
  { n: 5, name: 'Session', pdu: 'Data', ex: 'Session control', purpose: 'Establish, manage, and terminate application sessions' },
  { n: 4, name: 'Transport', pdu: 'Segment', ex: 'TCP, UDP', purpose: 'End-to-end segmentation, port addressing, flow control' },
  { n: 3, name: 'Network', pdu: 'Packet', ex: 'IP, routing', purpose: 'Logical IP addressing and packet path routing' },
  { n: 2, name: 'Data Link', pdu: 'Frame', ex: 'Ethernet, MAC', purpose: 'Physical MAC addressing, framing & CRC / FCS error detection' },
  { n: 1, name: 'Physical', pdu: 'Bits', ex: 'Cable, WiFi, signal', purpose: 'Raw binary electrical/optical/radio pulse transmission' },
];

function getChips(n: number, isWire: boolean = false): string[] {
  if (isWire || n === 1) return ['BITS: 0101 1100 1010…'];
  const chips: string[] = [];
  if (n <= 2) chips.push('ETH');
  if (n <= 3) chips.push('IP');
  if (n <= 4) chips.push('TCP');
  chips.push('DATA');
  if (n <= 2) chips.push('FCS');
  return chips;
}

export function generateOsiModelSteps(): Step<OsiState>[] {
  const steps: Step<OsiState>[] = [];

  const baseLayers: OsiLayer[] = OSI_LAYERS_INFO.map((l) => ({
    number: l.n,
    name: `${l.n}. ${l.name}`,
    pdu: l.pdu,
    protocols: l.ex.split(', '),
    purpose: l.purpose,
    status: 'default',
  }));

  const downText: Record<number, string> = {
    7: 'App creates the payload data (e.g. HTTP GET /api/v1/resource)',
    6: 'Format / encrypt payload with TLS 1.3 & UTF-8 character encoding',
    5: 'Open and manage the logical session token & socket connection',
    4: 'Add TCP header (Source: 54321, Dest: 443) → Creates Segment',
    3: 'Add IP header (Source: 192.168.1.5, Dest: 93.184.216.34) → Creates Packet',
    2: 'Add Ethernet header (MAC Address) + FCS trailer (CRC error check) → Creates Frame',
    1: 'Convert structured frame into raw binary bit pulses (0s & 1s) / radio signals',
  };

  const upText: Record<number, string> = {
    1: 'Receive raw electrical/optical bit pulses from physical medium wire',
    2: 'Verify FCS CRC32 checksum, strip Ethernet L2 header & FCS trailer',
    3: 'Inspect destination IP address, verify routing, strip IP L3 header',
    4: 'Inspect destination TCP port 443, perform sequence check, strip TCP L4 header',
    5: 'Validate session state, socket connection, and transmission tokens',
    6: 'Decrypt TLS payload, decompress data, and decode character stream',
    7: 'Application layer (Web Server) processes HTTP request and delivers to handler ✔',
  };

  // 1. Sender Encapsulation: Layers 7 down to 1
  for (let i = 0; i < OSI_LAYERS_INFO.length; i++) {
    const layer = OSI_LAYERS_INFO[i];
    const n = layer.n;
    const chips = getChips(n);

    const updatedLayers = baseLayers.map((l) => {
      if (l.number > n) return { ...l, status: 'visited' as const };
      if (l.number === n) return { ...l, status: 'active' as const };
      return { ...l, status: 'unvisited' as const };
    });

    steps.push({
      state: {
        direction: 'down-client',
        activeLayerNumber: n,
        layers: updatedLayers,
        packetData: chips.join(' | '),
        logMessage: `Sender (PC A) L${n} ${layer.name}: ${downText[n]}`,
      },
      highlightedLines: [6, 7, 8, 9, 10, 11, 12].slice(0, i + 1),
      description: `Sender L${n} ${layer.name}: ${downText[n]} (PDU: ${layer.pdu})`,
    });
  }

  // 2. Physical Transmission Across the Wire
  steps.push({
    state: {
      direction: 'across-wire',
      activeLayerNumber: 1,
      layers: baseLayers.map((l) => ({ ...l, status: l.number === 1 ? ('swapping' as const) : ('visited' as const) })),
      packetData: 'BITS: 0101 1100 1010 1111 0001 (Physical Wire Flow)',
      logMessage: 'Transmitting raw binary pulses over physical network medium (Copper Wire / Fiber / Wi-Fi)...',
    },
    highlightedLines: [12, 13],
    description: 'Physical Transmission: Raw bits (0s & 1s) travel across the medium from PC A to PC B.',
  });

  // 3. Receiver Decapsulation: Layers 1 up to 7
  for (let i = OSI_LAYERS_INFO.length - 1; i >= 0; i--) {
    const layer = OSI_LAYERS_INFO[i];
    const n = layer.n;
    const chips = getChips(n);

    const updatedLayers = baseLayers.map((l) => {
      if (l.number < n) return { ...l, status: 'sorted' as const };
      if (l.number === n) return { ...l, status: 'active' as const };
      return { ...l, status: 'visited' as const };
    });

    steps.push({
      state: {
        direction: 'up-server',
        activeLayerNumber: n,
        layers: updatedLayers,
        packetData: chips.join(' | '),
        logMessage: `Receiver (PC B) L${n} ${layer.name}: ${upText[n]}`,
      },
      highlightedLines: [15, 16, 17],
      description: `Receiver L${n} ${layer.name}: ${upText[n]} (PDU: ${layer.pdu})`,
    });
  }

  // 4. Completed Step
  steps.push({
    state: {
      direction: 'up-server',
      activeLayerNumber: 7,
      layers: baseLayers.map((l) => ({ ...l, status: 'sorted' as const })),
      packetData: 'Delivered: HTTP 200 OK / Payload Handled Successfully',
      logMessage: 'Done: Data encapsulated, transmitted, and successfully decapsulated by receiving application ✔',
    },
    highlightedLines: [1, 2, 3, 4, 15, 16, 17],
    description: 'Done: Full end-to-end OSI 7-layer data encapsulation, transmission, and decapsulation complete ✔',
  });

  return steps;
}

export const osiModelDefinition: AlgorithmDefinition<unknown, OsiState> = {
  meta: {
    id: 'osi-model',
    name: 'OSI 7-Layer Model Architecture',
    category: 'computer-networks',
    timeComplexity: {
      best: '7 Encapsulation Steps',
      average: '7 Down (Sender) → Wire → 7 Up (Receiver)',
      worst: '15 Interactive Stages',
    },
    spaceComplexity: 'O(1) PDU Frame Headers & Trailers',
    description: 'Interactive ISO/OSI 7-Layer visualizer: sender encapsulation (L7→L1), physical bitstream transmission, and receiver decapsulation (L1→L7).',
    code: OSI_MODEL_CODE_SNIPPETS,
    defaultInput: null,
    implemented: true,
    conceptType: 'osi',
  },
  generateSteps: () => generateOsiModelSteps(),
};

