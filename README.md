# AlgoCraft — Interactive Algorithms & System Architecture Visualizer 🚀

An interactive, educational visualization platform crafted for students, freshers, and software engineers to intuitively learn **Data Structures & Algorithms**, **Computer Networks**, **Software Engineering**, **Operating Systems / Linux**, and **System Design**.

![AlgoCraft Banner](https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1400&q=80)

---

## ✨ Features & Capabilities

- 🎯 **Visual Step-by-Step Execution Engine**: Step forward, step backward, scrub with an interactive timeline slider, adjust playback speeds ($0.5\times$ to $4\times$), and observe real-time state transitions.
- 🔍 **Interactive Canvas Zoom (Zoom In / Zoom Out / Fit)**: Scale and fit complex diagrams from $60\%$ to $150\%$ for any screen resolution.
- 💻 **Multi-Language Code Sync**: View synchronized reference code in **Python** (default), **C++**, and **Java** with real-time active line highlighting.
- 🖥️ **Full-Screen Focus Mode (`F`)**: Maximize visual workspace with a toggleable side code panel (**Show Code** / **Hide Code**) and zero vertical clipping.
- 🌓 **Theme Persistence**: Sleek Dark Mode and Light Mode with seamless `localStorage` persistence.
- 🎛️ **Custom Interactive Inputs**:
  - Custom arrays and target search keys for sorting & searching.
  - Multi-topology graph presets and vertex selectors for graph algorithms.
  - Interactive board size selectors for N-Queens ($4 \times 4$, $8 \times 8$, $16 \times 16$).
  - O(1) interactive Front/Rear controls for Deque & Stacks.

---

## 📚 Comprehensive Curriculum

### 1. Data Structures & Algorithms (DSA)
- **Sorting Algorithms**: Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, Quick Sort (Lomuto Partition).
- **Searching Algorithms**: Binary Search ($O(\log N)$) and Linear Search ($O(N)$).
- **Linear Data Structures**: 
  - Stack (LIFO operations: Push, Pop, Peek).
  - Queue (FIFO operations: Enqueue, Dequeue).
  - Deque (Double-Ended Queue with front/rear operations).
  - Singly Linked List (Traversal, head/tail insertion, deletion).
- **Tree Structures**: Binary Search Tree (BST insertion, search, and in-order traversal).
- **Graph Algorithms**: 
  - Dijkstra’s Shortest Path Algorithm with priority queue relaxation.
  - Breadth-First Search (BFS) level-order traversal.
  - Depth-First Search (DFS) recursive traversal.
- **Dynamic Programming & Backtracking**:
  - Tower of Hanoi ($O(2^N)$ recursion).
  - 0/1 Knapsack Problem ($O(N \times W)$ DP Matrix Grid).
  - N-Queens Backtracking Problem ($4$, $8$, and $16$ Queens).

---

### 2. Computer Networks
- **OSI 7-Layer Model Architecture**:
  - Dual-column interactive stage: **Sender (PC A)** encapsulation ($L7 \to L1$), **Physical Medium Channel** (animated binary bitstream `0101...`), and **Receiver (PC B)** decapsulation ($L1 \to L7$).
  - Protocol Data Unit (PDU) color-coded chips: `ETH`, `IP`, `TCP`, `DATA`, `FCS`, `BITS`.
  - Layer-by-layer inspection of protocols (`HTTP`, `TLS`, `TCP`, `IP`, `Ethernet`) and headers.
- **TCP 3-Way Handshake**: Connection establishment (`SYN` $\to$ `SYN-ACK` $\to$ `ACK`) and sequence numbering.
- **Socket & FTP File Transfer**: Control vs Data connection channels and packet transmission.
- **DNS Resolution Pipeline**: Step-by-step query flow from Browser Cache $\to$ Recursive Resolver $\to$ Root Server $\to$ TLD Server $\to$ Authoritative Server.

---

### 3. Software Engineering & OOP
- **SDLC Waterfall Model**: Sequential phase transitions (Requirements $\to$ Design $\to$ Implementation $\to$ Verification $\to$ Maintenance).
- **Agile Scrum Sprint Cycle**: Sprint Planning $\to$ Daily Standup $\to$ Development $\to$ Sprint Review $\to$ Retrospective.
- **CI/CD Deployment Pipeline**: Source Commit $\to$ Automated Test Suite $\to$ Containerization (Docker) $\to$ Staging $\to$ Production Deployment.
- **Git Workflow & Version Control**: Working Tree $\to$ Staging Area (`git add`) $\to$ Local Repository (`git commit`) $\to$ Remote (`git push`).
- **Compilation Flow**: Preprocessor $\to$ Compiler $\to$ Assembler $\to$ Linker $\to$ Binary Executable.
- **Low-Level Design (LLD) & OOP**: Object-oriented class hierarchy, encapsulation, polymorphism, and Ride-Booking system architecture.

---

### 4. Operating Systems & Linux Architecture
- **Interactive Linux Terminal**: Visual execution of essential Linux commands (`pwd`, `mkdir`, `chmod 755`, `ps aux | grep`, `curl`) linked to Kernel system calls and Virtual File System (VFS).

---

### 5. System Design & Cloud Architecture
- **Load Balancer & Reverse Proxy**: Round Robin, Weighted, and Least Connection traffic distribution.
- **Cache-Aside Strategy**: Cache Hit / Cache Miss flows with Redis and Database synchronization.
- **MERN Full-Stack Request Flow**: Client Browser $\to$ React Frontend $\to$ Express REST API $\to$ Node.js Runtime $\to$ MongoDB Database $\to$ JWT Authentication.
- **Cloud Product Deployment Architecture**: Global DNS (Route 53) $\to$ CDN (CloudFront) $\to$ Application Load Balancer $\to$ Auto-scaling Compute $\to$ Multi-AZ Database.

---

## 🛠️ Technology Stack

- **Frontend Core**: React 18, TypeScript, Vite
- **Styling & Design System**: TailwindCSS, Lucide Icons, Glassmorphism, CSS Grid/Flexbox
- **State Management**: Zustand
- **Animations**: Framer Motion, HTML5 Canvas, SVG Paths & Animations
- **Routing**: React Router v6

---

## 🚀 Getting Started Locally

### Prerequisites
- **Node.js** (v18.0 or higher recommended)
- **npm** or **yarn** / **pnpm**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sravanakkaladevi/ASK-Visualization-.git
   cd ASK-Visualization-
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in your browser**:
   Navigate to `http://localhost:5173` (or the port specified in terminal).

---

## 📦 Building for Production

To create an optimized production build:
```bash
npm run build
```
Preview the production build locally:
```bash
npm run preview
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| <kbd>Space</kbd> | Play / Pause animation |
| <kbd>→</kbd> | Step forward |
| <kbd>←</kbd> | Step backward |
| <kbd>R</kbd> | Restart animation to Step 0 |
| <kbd>F</kbd> | Toggle Full-Screen Focus Mode |
| <kbd>Esc</kbd> | Exit Full-Screen Focus Mode |

---

## 🤝 Contributing

Contributions, feedback, and suggestions are welcome!
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/awesome-feature`)
3. Commit your changes (`git commit -m 'Add awesome feature'`)
4. Push to the branch (`git push origin feature/awesome-feature`)
5. Open a Pull Request

---

## 👨‍💻 Developer & Author

Developed with ❤️ by **Sravan Akkaladevi**  
- **GitHub**: [@sravanakkaladevi](https://github.com/sravanakkaladevi)
- **Repository**: [https://github.com/sravanakkaladevi/ASK-Visualization-](https://github.com/sravanakkaladevi/ASK-Visualization-)

---

## 📄 License

This project is licensed under the MIT License — feel free to use it for learning, teaching, and building!

