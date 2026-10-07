import { AlgorithmDefinition, CodeSnippets, NetworkState, Step } from '../types/algorithm';

export const SOCKET_FTP_CODE_SNIPPETS: CodeSnippets = {
  python: `# Socket & FTP Client-Server Communication in Python
import socket

# 1. Server Socket Setup
server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server_socket.bind(('0.0.0.0', 21)) # Port 21 (FTP Control)
server_socket.listen(5)
print("[Server] Listening on Port 21...")

# 2. Accept Client Connection
conn, client_addr = server_socket.accept()
print(f"[Server] Connected by {client_addr}")

# 3. FTP Command Control & Data Transfer
conn.sendall(b"220 FTP Service Ready\\r\\n")
cmd = conn.recv(1024) # e.g. RETR document.pdf
conn.sendall(b"150 Opening BINARY mode data connection\\r\\n")

# 4. Stream File Data over Data Channel Socket
with open("document.pdf", "rb") as f:
    conn.sendfile(f)
conn.sendall(b"226 Transfer Complete\\r\\n")
conn.close()`,
  java: `// Socket & FTP Stream in Java
ServerSocket server = new ServerSocket(21);
Socket client = server.accept();
PrintWriter out = new PrintWriter(client.getOutputStream(), true);
BufferedReader in = new BufferedReader(new InputStreamReader(client.getInputStream()));

out.println("220 FTP Server Ready");
String command = in.readLine(); // USER / RETR
out.println("226 Transfer Complete");
client.close();`,
  cpp: `// BSD Socket API in C++
int server_fd = socket(AF_INET, SOCK_STREAM, 0);
sockaddr_in address;
address.sin_port = htons(21);
bind(server_fd, (struct sockaddr*)&address, sizeof(address));
listen(server_fd, 3);
int new_socket = accept(server_fd, nullptr, nullptr);
send(new_socket, "220 FTP Ready", 13, 0);`,
  javascript: `// TCP Socket in Node.js
const net = require('net');
const server = net.createServer((socket) => {
  socket.write('220 FTP Ready\\r\\n');
  socket.on('data', (data) => {
    socket.write('226 Transfer Complete\\r\\n');
  });
});
server.listen(21);`,
};

export function generateSocketFtpSteps(): Step<NetworkState>[] {
  const clientDevice = { id: 'client', label: 'Client (FTP/Socket)', type: 'client' as const, ip: '192.168.1.10', status: 'active' as const };
  const serverDevice = { id: 'server', label: 'FTP Server (Port 21/20)', type: 'server' as const, ip: '198.51.100.2', status: 'default' as const };

  const stepsData = [
    {
      desc: 'Step 1: Server initializes TCP Socket, binds to Port 21 (FTP Control), and enters LISTEN state.',
      lines: [5, 6, 7, 8],
      cStatus: 'default' as const,
      sStatus: 'active' as const,
      packet: { from: 'server', to: 'server', type: 'SOCKET_LISTEN', payload: 'bind(0.0.0.0:21) -> listen(5)', progress: 0, status: 'active' as const },
      log: 'Server socket(AF_INET, SOCK_STREAM) created. Ready to accept incoming TCP socket connections.',
    },
    {
      desc: 'Step 2: Client initiates TCP 3-Way Handshake (SYN) to establish reliable stream socket connection.',
      lines: [10, 11],
      cStatus: 'active' as const,
      sStatus: 'default' as const,
      packet: { from: 'client', to: 'server', type: 'TCP_SYN', payload: 'SYN -> Port 21 (Control Channel)', progress: 50, status: 'active' as const },
      log: 'Client opens outbound socket connect("198.51.100.2", 21).',
    },
    {
      desc: 'Step 3: Server accepts connection (accept() syscall) and returns "220 FTP Service Ready" banner.',
      lines: [11, 14],
      cStatus: 'default' as const,
      sStatus: 'active' as const,
      packet: { from: 'server', to: 'client', type: 'FTP_BANNER', payload: '220 Service Ready (Control Channel Established)', progress: 100, status: 'completed' as const },
      log: 'Socket connection established. Control channel (Port 21) is active for authentication & commands.',
    },
    {
      desc: 'Step 4: Client authenticates with USER/PASS commands and requests file: "RETR resume.pdf".',
      lines: [15],
      cStatus: 'active' as const,
      sStatus: 'default' as const,
      packet: { from: 'client', to: 'server', type: 'FTP_RETR', payload: 'RETR resume.pdf (File Request)', progress: 50, status: 'active' as const },
      log: 'FTP Client requests binary file transfer over control socket.',
    },
    {
      desc: 'Step 5: Server opens dedicated Data Channel (Port 20) and streams raw file bytes to client.',
      lines: [16, 19, 20],
      cStatus: 'active' as const,
      sStatus: 'active' as const,
      packet: { from: 'server', to: 'client', type: 'FTP_DATA', payload: 'Streaming Binary Payload (resume.pdf) [Chunk 1..N]', progress: 75, status: 'active' as const },
      log: 'File data streamed over TCP socket buffer via sendfile() kernel zero-copy transfer.',
    },
    {
      desc: 'Step 6: Transfer Complete! Server sends "226 Transfer Complete" and closes sockets cleanly.',
      lines: [21, 22],
      cStatus: 'completed' as const,
      sStatus: 'completed' as const,
      packet: { from: 'server', to: 'client', type: '226_COMPLETE', payload: '226 Transfer Complete (Socket Closed)', progress: 100, status: 'completed' as const },
      log: 'Socket stream closed cleanly. File successfully downloaded to local filesystem.',
    },
  ];

  return stepsData.map((s) => ({
    state: {
      devices: [
        { ...clientDevice, status: s.cStatus },
        { ...serverDevice, status: s.sStatus },
      ],
      packets: [
        {
          id: `pkt-${s.packet.type}`,
          from: s.packet.from,
          to: s.packet.to,
          type: s.packet.type,
          payload: s.packet.payload,
          progress: s.packet.progress,
          status: s.packet.status,
        },
      ],
      logMessage: s.log,
      protocol: 'TCP',
    },
    highlightedLines: s.lines,
    description: s.desc,
  }));
}

export const socketFtpDefinition: AlgorithmDefinition<null, NetworkState> = {
  meta: {
    id: 'socket-ftp-transfer',
    name: 'Socket Programming & FTP File Transfer',
    category: 'computer-networks',
    timeComplexity: { best: 'O(1)', average: 'O(N)', worst: 'O(N)' },
    spaceComplexity: 'O(1)',
    description:
      'Visualizes Berkeley/POSIX Socket connection lifecycle (socket, bind, listen, accept, send/recv) and FTP two-channel (Control + Data) file transfer.',
    code: SOCKET_FTP_CODE_SNIPPETS,
    defaultInput: null,
    implemented: true,
    conceptType: 'architecture',
  },
  generateSteps: () => generateSocketFtpSteps(),
};
