import { AlgorithmDefinition, CodeSnippets, Step } from '../types/algorithm';
import { LinuxTerminalState } from '../visualizers/LinuxTerminalView';

export const LINUX_TERMINAL_CODE: CodeSnippets = {
  python: `# Linux Shell Script Execution in Python
import subprocess

# 1. Inspect Working Directory & Files
subprocess.run(["pwd"])
subprocess.run(["ls", "-la"])

# 2. File & Permissions Management
subprocess.run(["mkdir", "-p", "app"])
subprocess.run(["chmod", "755", "app/server.py"])

# 3. Process & Pipe Monitoring
ps = subprocess.Popen(["ps", "aux"], stdout=subprocess.PIPE)
grep = subprocess.run(["grep", "python"], stdin=ps.stdout, capture_output=True, text=True)
print(grep.stdout)`,
  java: `// Executing Linux Shell commands in Java
ProcessBuilder pb = new ProcessBuilder("bash", "-c", "ls -la | grep .py");
Process process = pb.start();
BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
String line;
while ((line = reader.readLine()) != null) {
    System.out.println(line);
}`,
  cpp: `// POSIX system call execution
#include <cstdlib>
#include <unistd.h>

int main() {
    std::system("ls -la");
    std::system("chmod 755 app.py");
    return 0;
}`,
  javascript: `// Child Process Execution in Node.js
const { execSync } = require('child_process');
const output = execSync('ls -la && ps aux | grep node');
console.log(output.toString());`,
};

export function generateLinuxTerminalSteps(): Step<LinuxTerminalState>[] {
  const commands: {
    cmd: string;
    stage: 'terminal' | 'shell' | 'kernel' | 'filesystem' | 'output';
    out: string[];
    log: string;
    lines: number[];
  }[] = [
    {
      cmd: 'pwd && whoami',
      stage: 'terminal',
      out: ['$ pwd', '/home/student', '$ whoami', 'student_dev (uid=1000, gid=1000)'],
      log: 'Terminal stdout prints current working directory path and active shell user ID.',
      lines: [4, 5],
    },
    {
      cmd: 'mkdir -p project_backend && cd project_backend',
      stage: 'shell',
      out: [
        '$ mkdir -p project_backend && cd project_backend',
        'Created directory: /home/student/project_backend',
        'CWD updated to /home/student/project_backend',
      ],
      log: 'Shell parses compound command (&&) and issues sys_mkdir + sys_chdir syscalls to Linux Kernel.',
      lines: [7, 8],
    },
    {
      cmd: 'touch server.py && chmod 755 server.py',
      stage: 'filesystem',
      out: [
        '$ touch server.py && chmod 755 server.py',
        'Allocated Inode #284719 with permissions: -rwxr-xr-x (755)',
      ],
      log: 'Ext4 filesystem assigns new inode. sys_chmod updates permission bits: Read/Write/Exec for owner, Read/Exec for group & others.',
      lines: [8, 9],
    },
    {
      cmd: 'ls -la',
      stage: 'filesystem',
      out: [
        '$ ls -la',
        'total 12',
        'drwxr-xr-x 2 student_dev student_dev 4096 Oct 07 21:00 .',
        'drwxr-xr-x 4 student_dev student_dev 4096 Oct 07 20:55 ..',
        '-rwxr-xr-x 1 student_dev student_dev  512 Oct 07 21:00 server.py',
      ],
      log: 'Kernel reads directory entry table from disk cache and returns file permissions, links, owner, size, and timestamp.',
      lines: [5, 6],
    },
    {
      cmd: 'ps aux | grep python',
      stage: 'kernel',
      out: [
        '$ ps aux | grep python',
        'root        1  0.0  0.1  systemd',
        'student  1428  0.2  1.4  python3 server.py [PID: 1428, Port: 8080]',
      ],
      log: 'Kernel /proc virtual filesystem inspects active processes. Linux pipe (|) redirects stdout of ps to stdin of grep in memory buffer.',
      lines: [11, 12, 13],
    },
    {
      cmd: 'curl -I http://localhost:8080/health',
      stage: 'output',
      out: [
        '$ curl -I http://localhost:8080/health',
        'HTTP/1.1 200 OK',
        'Content-Type: application/json',
        'Status: Healthy (Uptime: 45m)',
      ],
      log: 'Socket request dispatched to loopback interface (127.0.0.1:8080). Server returns HTTP 200 OK.',
      lines: [13, 14],
    },
  ];

  return commands.map((c, idx) => ({
    state: {
      command: c.cmd,
      stageName: c.stage,
      outputLines: c.out,
      logMessage: c.log,
    },
    highlightedLines: c.lines,
    description: `Step ${idx + 1}: Execute "${c.cmd}" — ${c.log}`,
  }));
}

export const linuxTerminalDefinition: AlgorithmDefinition<null, LinuxTerminalState> = {
  meta: {
    id: 'linux-terminal',
    name: 'Linux Shell Commands & OS Architecture',
    category: 'os',
    timeComplexity: { best: 'O(1)', average: 'O(1)', worst: 'O(1)' },
    spaceComplexity: 'O(1)',
    description:
      'Interactive visual simulation of basic to medium Linux terminal commands (pwd, ls -la, mkdir, chmod 755, ps aux | grep, curl) executing across the Shell, VFS, and Kernel.',
    code: LINUX_TERMINAL_CODE,
    defaultInput: null,
    implemented: true,
    conceptType: 'architecture',
  },
  generateSteps: () => generateLinuxTerminalSteps(),
};
