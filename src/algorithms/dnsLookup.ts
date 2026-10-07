import { AlgorithmDefinition, NetworkState, CodeSnippets, Step } from '../types/algorithm';

export const DNS_LOOKUP_CODE_SNIPPETS: CodeSnippets = {
  typescript: `import dns from 'dns';

// DNS Resolution Query for 'example.com'
dns.resolve4('example.com', (err, addresses) => {
  if (err) throw err;
  console.log('Resolved IP addresses:', addresses); 
  // e.g. ['93.184.216.34']
});`,
  python: `import socket

# Perform DNS hostname resolution query
ip_address = socket.gethostbyname('example.com')
print(f"IP address of example.com: {ip_address}")
# Output: 93.184.216.34`,
  java: `import java.net.InetAddress;

public class DNSResolver {
    public static void main(String[] args) throws Exception {
        InetAddress address = InetAddress.getByName("example.com");
        System.out.println("Resolved IP: " + address.getHostAddress());
    }
}`,
  cpp: `#include <iostream>
#include <netdb.h>
#include <arpa/inet.h>

int main() {
    struct hostent *host = gethostbyname("example.com");
    if (host) {
        struct in_addr **addr_list = (struct in_addr **)host->h_addr_list;
        std::cout << "Resolved IP: " << inet_ntoa(*addr_list[0]) << "\n";
    }
    return 0;
}`,
};

export function generateDnsLookupSteps(): Step<NetworkState>[] {
  const steps: Step<NetworkState>[] = [];

  const devices = [
    { id: 'client', label: 'Client (PC)', type: 'client' as const, ip: '192.168.1.5', status: 'default' as const },
    { id: 'resolver', label: 'Recursive Resolver (8.8.8.8)', type: 'dns-resolver' as const, ip: '8.8.8.8', status: 'default' as const },
    { id: 'root', label: 'Root Server (.)', type: 'root-dns' as const, ip: '198.41.0.4', status: 'default' as const },
    { id: 'tld', label: 'TLD Server (.com)', type: 'tld-dns' as const, ip: '192.5.6.30', status: 'default' as const },
    { id: 'auth', label: 'Auth Server (ns1.example.com)', type: 'auth-dns' as const, ip: '93.184.216.34', status: 'default' as const },
  ];

  // Step 0: Initial query start
  steps.push({
    state: {
      devices: devices.map((d) => ({ ...d, status: 'unvisited' as const })),
      packets: [],
      logMessage: 'Client requests IP for domain "example.com"',
      protocol: 'DNS',
    },
    highlightedLines: [1, 2, 3, 4],
    description: 'User enters "example.com" in browser. Client checks local browser/OS DNS cache (Cache Miss).',
  });

  // Step 1: Client -> Recursive Resolver
  steps.push({
    state: {
      devices: [
        { ...devices[0], status: 'active' as const },
        { ...devices[1], status: 'comparing' as const },
        ...devices.slice(2).map((d) => ({ ...d, status: 'unvisited' as const })),
      ],
      packets: [
        {
          id: 'dns-q1',
          from: 'client',
          to: 'resolver',
          type: 'DNS Query (A)',
          payload: 'example.com -> A?',
          progress: 0.5,
          status: 'active' as const,
        },
      ],
      logMessage: 'Client -> Recursive Resolver (8.8.8.8): Query "example.com"',
      protocol: 'DNS',
    },
    highlightedLines: [4, 5],
    description: 'Client sends recursive DNS query to ISP / Public Resolver (8.8.8.8).',
  });

  // Step 2: Resolver -> Root Server
  steps.push({
    state: {
      devices: [
        { ...devices[0], status: 'visited' as const },
        { ...devices[1], status: 'active' as const },
        { ...devices[2], status: 'comparing' as const },
        { ...devices[3], status: 'unvisited' as const },
        { ...devices[4], status: 'unvisited' as const },
      ],
      packets: [
        {
          id: 'dns-q2',
          from: 'resolver',
          to: 'root',
          type: 'Iterative Query',
          payload: 'Who owns .com?',
          progress: 0.5,
          status: 'comparing' as const,
        },
      ],
      logMessage: 'Resolver -> Root Server (.): Where is .com TLD?',
      protocol: 'DNS',
    },
    highlightedLines: [4, 5],
    description: 'Resolver asks Root DNS Server (.) for the IP address of the .com Top-Level Domain (TLD) server.',
  });

  // Step 3: Root Server -> Resolver (returns TLD IP)
  steps.push({
    state: {
      devices: [
        { ...devices[0], status: 'visited' as const },
        { ...devices[1], status: 'active' as const },
        { ...devices[2], status: 'visited' as const },
        { ...devices[3], status: 'comparing' as const },
        { ...devices[4], status: 'unvisited' as const },
      ],
      packets: [
        {
          id: 'dns-q3',
          from: 'resolver',
          to: 'tld',
          type: 'TLD Query',
          payload: 'Where is example.com?',
          progress: 0.5,
          status: 'comparing' as const,
        },
      ],
      logMessage: 'Resolver -> .com TLD Server: Where is example.com Authoritative DNS?',
      protocol: 'DNS',
    },
    highlightedLines: [4, 5],
    description: 'Root server points to .com TLD Server. Resolver queries .com TLD server for "example.com".',
  });

  // Step 4: TLD Server -> Auth Server
  steps.push({
    state: {
      devices: [
        { ...devices[0], status: 'visited' as const },
        { ...devices[1], status: 'active' as const },
        { ...devices[2], status: 'visited' as const },
        { ...devices[3], status: 'visited' as const },
        { ...devices[4], status: 'comparing' as const },
      ],
      packets: [
        {
          id: 'dns-q4',
          from: 'resolver',
          to: 'auth',
          type: 'Auth Query',
          payload: 'Get A Record for example.com',
          progress: 0.5,
          status: 'active' as const,
        },
      ],
      logMessage: 'Resolver -> Authoritative Nameserver (ns1.example.com): Return A Record IP',
      protocol: 'DNS',
    },
    highlightedLines: [4, 5],
    description: 'TLD server refers to Authoritative Nameserver (ns1.example.com). Resolver requests exact A Record.',
  });

  // Step 5: Auth Server returns IP -> Resolver -> Client
  steps.push({
    state: {
      devices: [
        { ...devices[0], status: 'sorted' as const },
        { ...devices[1], status: 'sorted' as const },
        { ...devices[2], status: 'visited' as const },
        { ...devices[3], status: 'visited' as const },
        { ...devices[4], status: 'sorted' as const },
      ],
      packets: [
        {
          id: 'dns-res',
          from: 'resolver',
          to: 'client',
          type: 'DNS Response',
          payload: 'example.com -> 93.184.216.34 (TTL=300)',
          progress: 1.0,
          status: 'sorted' as const,
        },
      ],
      logMessage: 'Authoritative Server returns IP: 93.184.216.34. Resolver caches result & responds to Client.',
      protocol: 'DNS',
    },
    highlightedLines: [4, 5, 6],
    description: 'DNS Resolution Completed! Client caches IP address 93.184.216.34 and initiates HTTP connection.',
  });

  return steps;
}

export const dnsLookupDefinition: AlgorithmDefinition<unknown, NetworkState> = {
  meta: {
    id: 'dns-lookup',
    name: 'DNS Resolution Query Flow',
    category: 'computer-networks',
    timeComplexity: {
      best: 'O(1) (Cache Hit)',
      average: '20-100ms (4 round trips)',
      worst: 'O(N) (Root $\\to$ TLD $\\to$ Auth query timeouts)',
    },
    spaceComplexity: 'O(1) DNS Cache Table',
    description: 'Visualizes the complete recursive and iterative DNS resolution pipeline: Client $\\to$ Recursive Resolver $\\to$ Root Server $\\to$ TLD Server $\\to$ Authoritative Nameserver.',
    code: DNS_LOOKUP_CODE_SNIPPETS,
    defaultInput: null,
    implemented: true,
  },
  generateSteps: () => generateDnsLookupSteps(),
};
