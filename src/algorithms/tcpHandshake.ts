import { AlgorithmDefinition, NetworkState, CodeSnippets, Step } from '../types/algorithm';

export const TCP_HANDSHAKE_CODE_SNIPPETS: CodeSnippets = {
  typescript: `import net from 'net';

// 1. Initiate TCP Connection (Sends SYN)
const client = net.createConnection({ port: 8080, host: '192.168.1.10' }, () => {
  // 3. Connection Established after receiving SYN-ACK and sending ACK
  console.log('TCP 3-Way Handshake completed! Connected to server.');
});

client.on('data', (data) => {
  console.log('Received data:', data.toString());
});`,
  python: `import socket

# 1. Create TCP Socket
client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# 2. Perform TCP 3-Way Handshake (SYN -> SYN-ACK -> ACK)
client_socket.connect(('192.168.1.10', 8080))
print("TCP 3-Way Handshake successful!")`,
  java: `import java.net.Socket;

public class TCPClient {
    public static void main(String[] args) throws Exception {
        // Initiates TCP 3-Way Handshake
        Socket socket = new Socket("192.168.1.10", 8080);
        System.out.println("TCP Connection Established!");
    }
}`,
  cpp: `#include <iostream>
#include <sys/socket.h>
#include <arpa/inet.h>

int main() {
    int sock = socket(AF_INET, SOCK_STREAM, 0);
    sockaddr_in serv_addr;
    serv_addr.sin_family = AF_INET;
    serv_addr.sin_port = htons(8080);
    inet_pton(AF_INET, "192.168.1.10", &serv_addr.sin_addr);

    // Initiates SYN packet and waits for SYN-ACK
    connect(sock, (struct sockaddr*)&serv_addr, sizeof(serv_addr));
    std::cout << "TCP Handshake Complete!\n";
    return 0;
}`,
};

export function generateTcpHandshakeSteps(): Step<NetworkState>[] {
  const steps: Step<NetworkState>[] = [];

  const baseDevices = [
    { id: 'client', label: 'Client (192.168.1.5)', type: 'client' as const, ip: '192.168.1.5', status: 'default' as const },
    { id: 'server', label: 'Server (192.168.1.10)', type: 'server' as const, ip: '192.168.1.10', status: 'default' as const },
  ];

  // Step 0: Initial CLOSED State
  steps.push({
    state: {
      devices: baseDevices.map((d) => ({ ...d, status: 'unvisited' as const })),
      packets: [],
      logMessage: 'Client is in CLOSED state. Server is LISTENing on port 8080.',
      protocol: 'TCP',
    },
    highlightedLines: [1, 2, 3, 4],
    description: 'Client prepares to establish a reliable TCP connection with Server on port 8080.',
  });

  // Step 1: SYN Packet sent from Client
  steps.push({
    state: {
      devices: [
        { ...baseDevices[0], status: 'active' as const },
        { ...baseDevices[1], status: 'unvisited' as const },
      ],
      packets: [
        {
          id: 'pkt-syn',
          from: 'client',
          to: 'server',
          type: 'SYN',
          payload: 'Seq=100 (SYN flag = 1)',
          progress: 0.5,
          status: 'active' as const,
        },
      ],
      logMessage: 'Client -> Server: SYN (Seq=100). State: SYN-SENT',
      protocol: 'TCP',
    },
    highlightedLines: [4, 5],
    description: '1. SYN (Synchronize): Client sends a SYN packet with initial sequence number Seq=100.',
  });

  // Step 2: Server Receives SYN & Sends SYN-ACK
  steps.push({
    state: {
      devices: [
        { ...baseDevices[0], status: 'visited' as const },
        { ...baseDevices[1], status: 'active' as const },
      ],
      packets: [
        {
          id: 'pkt-syn-ack',
          from: 'server',
          to: 'client',
          type: 'SYN-ACK',
          payload: 'Seq=300, Ack=101 (SYN+ACK flags = 1)',
          progress: 0.5,
          status: 'comparing' as const,
        },
      ],
      logMessage: 'Server -> Client: SYN-ACK (Seq=300, Ack=101). State: SYN-RECEIVED',
      protocol: 'TCP',
    },
    highlightedLines: [6, 7],
    description: '2. SYN-ACK: Server acknowledges Client SYN (Ack=101) and sends its own SYN (Seq=300).',
  });

  // Step 3: Client Receives SYN-ACK & Sends ACK
  steps.push({
    state: {
      devices: [
        { ...baseDevices[0], status: 'active' as const },
        { ...baseDevices[1], status: 'visited' as const },
      ],
      packets: [
        {
          id: 'pkt-ack',
          from: 'client',
          to: 'server',
          type: 'ACK',
          payload: 'Seq=101, Ack=301 (ACK flag = 1)',
          progress: 0.8,
          status: 'sorted' as const,
        },
      ],
      logMessage: 'Client -> Server: ACK (Seq=101, Ack=301). State: ESTABLISHED',
      protocol: 'TCP',
    },
    highlightedLines: [8, 9],
    description: '3. ACK (Acknowledge): Client acknowledges Server SYN (Ack=301). Client enters ESTABLISHED state.',
  });

  // Step 4: Connection Established
  steps.push({
    state: {
      devices: [
        { ...baseDevices[0], status: 'sorted' as const },
        { ...baseDevices[1], status: 'sorted' as const },
      ],
      packets: [],
      logMessage: 'Both Client & Server in ESTABLISHED state. Full-duplex connection active!',
      protocol: 'TCP',
    },
    highlightedLines: [6, 7, 8, 9, 10],
    description: 'TCP 3-Way Handshake Completed! Data transfer can now safely begin over socket.',
  });

  return steps;
}

export const tcpHandshakeDefinition: AlgorithmDefinition<unknown, NetworkState> = {
  meta: {
    id: 'tcp-handshake',
    name: 'TCP 3-Way Handshake',
    category: 'computer-networks',
    timeComplexity: {
      best: '1 RTT (Round Trip Time)',
      average: '1.5 RTT',
      worst: '3 RTT (retransmissions)',
    },
    spaceComplexity: 'O(1) Socket Control Block buffer',
    description: 'Visualizes the 3-way handshake process (SYN, SYN-ACK, ACK) required to establish a reliable, connection-oriented TCP socket connection between client and server.',
    code: TCP_HANDSHAKE_CODE_SNIPPETS,
    defaultInput: null,
    implemented: true,
  },
  generateSteps: () => generateTcpHandshakeSteps(),
};
