import { AlgorithmDefinition, CodeSnippets, Step, CpuArchitectureState, MemoryCell } from '../types/algorithm';

export const CPU_ARCHITECTURE_CODE: CodeSnippets = {
  python: `# Von Neumann CPU & RAM Architecture Simulator
class ComputerSystem:
    def __init__(self):
        # Primary Memory (RAM)
        self.RAM = {
            "0x00": "LOAD R1, [0x05]",  # Instruction 1
            "0x01": "ADD R1, [0x06]",   # Instruction 2
            "0x02": "STORE [0x07], ACC",# Instruction 3
            "0x05": 42,                 # Data A
            "0x06": 15,                 # Data B
            "0x07": 0                   # Output Result
        }
        # Non-Volatile ROM Firmware
        self.ROM = {"0xFFF0": "BIOS POST & Bootloader"}
        # CPU Internal Registers
        self.PC = "0x00"   # Program Counter
        self.IR = ""       # Instruction Register
        self.MAR = ""      # Memory Address Register
        self.MDR = ""      # Memory Data Register
        self.ACC = 0       # Accumulator
        self.R1 = 0        # General Purpose Register

    def fetch_decode_execute(self):
        # 1. FETCH
        self.MAR = self.PC
        self.MDR = self.RAM[self.MAR]
        self.IR = self.MDR
        # 2. DECODE & EXECUTE
        # ALU performs arithmetic and stores result
        pass`,
  java: `public class CpuArchitecture {
    int PC = 0x00, MAR = 0, MDR = 0, ACC = 0, R1 = 0;
    String IR = "";
    int[] RAM = new int[256];
    
    void cycle() {
        // Fetch -> Decode -> Execute -> Store Cycle
        MAR = PC;
        IR = "LOAD / ADD / STORE";
        ACC = R1 + RAM[MAR];
    }
}`,
  cpp: `struct VonNeumannCPU {
    uint16_t PC, MAR, MDR, ACC, R1, R2;
    char IR[32];
    uint8_t RAM[1024];
    const char* ROM = "BIOS POST Firmware";
};`,
  typescript: `interface CPUState {
  PC: string;
  IR: string;
  MAR: string;
  MDR: string;
  ACC: number;
  RAM: Record<string, number | string>;
  ROM: Record<string, string>;
}`,
};

const INITIAL_RAM: MemoryCell[] = [
  { address: '0x00', value: 'LOAD R1, [0x05]', label: 'Instr 1', type: 'code' },
  { address: '0x01', value: 'ADD R1, [0x06]', label: 'Instr 2', type: 'code' },
  { address: '0x02', value: 'STORE [0x07], ACC', label: 'Instr 3', type: 'code' },
  { address: '0x03', value: 'HALT', label: 'Instr 4', type: 'code' },
  { address: '0x04', value: '0x00', label: 'Reserved', type: 'data' },
  { address: '0x05', value: '42', label: 'Var A', type: 'data' },
  { address: '0x06', value: '15', label: 'Var B', type: 'data' },
  { address: '0x07', value: '0', label: 'Result', type: 'data' },
];

const INITIAL_ROM: MemoryCell[] = [
  { address: '0xFF00', value: 'POST (Power-On Self-Test)', label: 'BIOS 1', type: 'rom' },
  { address: '0xFF01', value: 'INIT CPU & RAM Hardware', label: 'BIOS 2', type: 'rom' },
  { address: '0xFF02', value: 'LOAD MBR / OS Bootloader -> RAM', label: 'BIOS 3', type: 'rom' },
  { address: '0xFF03', value: 'JUMP 0x00 (Handover to OS)', label: 'BIOS 4', type: 'rom' },
];

export function generateCpuArchitectureSteps(): Step<CpuArchitectureState>[] {
  const steps: Step<CpuArchitectureState>[] = [];

  // 1. Initial State: ROM BIOS Boot
  steps.push({
    state: {
      activeUnit: 'ROM',
      cyclePhase: 'BOOT',
      registers: { PC: '0xFF00', IR: 'BOOTSTRAP', MAR: '0xFF00', MDR: 'POST_OK', ACC: '0', R1: '0', R2: '0' },
      buses: {
        controlBus: { active: true, signal: 'SYSTEM_BOOT' },
        addressBus: { active: true, address: '0xFF00' },
        dataBus: { active: true, data: 'ROM_BOOTLOADER', direction: 'to-cpu' },
      },
      ram: INITIAL_RAM,
      rom: INITIAL_ROM.map((c, i) => ({ ...c, highlight: i === 0 })),
      cache: [
        { line: 0, tag: '0x00', data: 'LOAD R1, [0x05]', hit: false },
        { line: 1, tag: '0x01', data: 'ADD R1, [0x06]', hit: false },
      ],
      logMessage: 'ROM Firmware (BIOS/UEFI) executes POST: Initializes CPU registers, verifies RAM, and loads OS bootloader.',
    },
    highlightedLines: [15, 16],
    description: 'System Boot: Non-Volatile ROM executes firmware to check hardware and hand over execution to RAM at 0x00.',
  });

  // 2. Fetch Instruction 1 (LOAD R1, [0x05])
  steps.push({
    state: {
      activeUnit: 'PC',
      cyclePhase: 'FETCH',
      registers: { PC: '0x00', IR: 'NOP', MAR: '0x00', MDR: 'FETCHING', ACC: '0', R1: '0', R2: '0' },
      buses: {
        controlBus: { active: true, signal: 'MEMORY_READ' },
        addressBus: { active: true, address: '0x00' },
        dataBus: { active: true, data: 'LOAD R1, [0x05]', direction: 'to-cpu' },
      },
      ram: INITIAL_RAM.map((c) => ({ ...c, highlight: c.address === '0x00' })),
      rom: INITIAL_ROM,
      cache: [{ line: 0, tag: '0x00', data: 'LOAD R1, [0x05]', hit: true }, { line: 1, tag: '0x01', data: 'ADD R1, [0x06]', hit: false }],
      logMessage: 'Fetch Step 1: Program Counter (PC=0x00) copied to MAR. Address Bus sends 0x00 to RAM with MEMORY_READ signal.',
    },
    highlightedLines: [24, 25],
    description: 'Fetch: PC (0x00) → MAR → Address Bus. RAM reads memory at 0x00.',
  });

  // 3. MDR to IR and PC increment
  steps.push({
    state: {
      activeUnit: 'IR',
      cyclePhase: 'FETCH',
      registers: { PC: '0x01', IR: 'LOAD R1, [0x05]', MAR: '0x00', MDR: 'LOAD R1, [0x05]', ACC: '0', R1: '0', R2: '0' },
      buses: {
        controlBus: { active: false, signal: 'IDLE' },
        addressBus: { active: false, address: '0x00' },
        dataBus: { active: true, data: 'LOAD R1, [0x05]', direction: 'to-cpu' },
      },
      ram: INITIAL_RAM.map((c) => ({ ...c, highlight: c.address === '0x00' })),
      rom: INITIAL_ROM,
      cache: [{ line: 0, tag: '0x00', data: 'LOAD R1, [0x05]', hit: true }, { line: 1, tag: '0x01', data: 'ADD R1, [0x06]', hit: false }],
      logMessage: 'Fetch Step 2: RAM delivers opcode to MDR across Data Bus. MDR loads Instruction Register (IR). PC increments to 0x01.',
    },
    highlightedLines: [26, 27],
    description: 'Fetch Complete: Instruction placed in IR. PC increments to 0x01 ready for next cycle.',
  });

  // 4. Decode & Execute LOAD
  steps.push({
    state: {
      activeUnit: 'CU',
      cyclePhase: 'DECODE',
      registers: { PC: '0x01', IR: 'LOAD R1, [0x05]', MAR: '0x05', MDR: '42', ACC: '0', R1: '42', R2: '0' },
      buses: {
        controlBus: { active: true, signal: 'MEMORY_READ' },
        addressBus: { active: true, address: '0x05' },
        dataBus: { active: true, data: '42', direction: 'to-cpu' },
      },
      ram: INITIAL_RAM.map((c) => ({ ...c, highlight: c.address === '0x05' })),
      rom: INITIAL_ROM,
      cache: [{ line: 0, tag: '0x05', data: '42', hit: true }, { line: 1, tag: '0x01', data: 'ADD R1, [0x06]', hit: false }],
      logMessage: 'Decode & Execute: Control Unit decodes LOAD. Address Bus reads RAM at 0x05 (value 42) into Register R1.',
    },
    highlightedLines: [28, 29],
    description: 'Execute LOAD: RAM address 0x05 value (42) transferred into General Purpose Register R1.',
  });

  // 5. Fetch Instruction 2 (ADD R1, [0x06])
  steps.push({
    state: {
      activeUnit: 'PC',
      cyclePhase: 'FETCH',
      registers: { PC: '0x01', IR: 'LOAD R1, [0x05]', MAR: '0x01', MDR: 'ADD R1, [0x06]', ACC: '0', R1: '42', R2: '0' },
      buses: {
        controlBus: { active: true, signal: 'MEMORY_READ' },
        addressBus: { active: true, address: '0x01' },
        dataBus: { active: true, data: 'ADD R1, [0x06]', direction: 'to-cpu' },
      },
      ram: INITIAL_RAM.map((c) => ({ ...c, highlight: c.address === '0x01' })),
      rom: INITIAL_ROM,
      cache: [{ line: 0, tag: '0x05', data: '42', hit: true }, { line: 1, tag: '0x01', data: 'ADD R1, [0x06]', hit: true }],
      logMessage: 'Fetch Step: PC (0x01) points to Instruction 2. RAM returns ADD R1, [0x06] across Data Bus to MDR → IR.',
    },
    highlightedLines: [24, 25, 26],
    description: 'Fetch: PC (0x01) fetches ADD instruction from RAM into IR. PC increments to 0x02.',
  });

  // 6. Decode & Execute ADD in ALU
  steps.push({
    state: {
      activeUnit: 'ALU',
      cyclePhase: 'EXECUTE',
      registers: { PC: '0x02', IR: 'ADD R1, [0x06]', MAR: '0x06', MDR: '15', ACC: '57', R1: '42', R2: '15' },
      buses: {
        controlBus: { active: true, signal: 'ALU_EXECUTE' },
        addressBus: { active: true, address: '0x06' },
        dataBus: { active: true, data: '15', direction: 'to-cpu' },
      },
      ram: INITIAL_RAM.map((c) => ({ ...c, highlight: c.address === '0x06' })),
      rom: INITIAL_ROM,
      cache: [{ line: 0, tag: '0x05', data: '42', hit: true }, { line: 1, tag: '0x06', data: '15', hit: true }],
      aluOperation: { op: 'ADD', operandA: 'R1 (42)', operandB: 'RAM[0x06] (15)', result: 'ACC = 57' },
      logMessage: 'ALU Computation: ALU adds Register R1 (42) and Memory operand (15). Result 57 stored in Accumulator (ACC).',
    },
    highlightedLines: [28, 29],
    description: 'Execute ADD: Arithmetic Logic Unit computes 42 + 15 = 57, result loaded into Accumulator (ACC).',
  });

  // 7. Fetch Instruction 3 (STORE [0x07], ACC)
  steps.push({
    state: {
      activeUnit: 'IR',
      cyclePhase: 'FETCH',
      registers: { PC: '0x02', IR: 'STORE [0x07], ACC', MAR: '0x02', MDR: 'STORE [0x07], ACC', ACC: '57', R1: '42', R2: '15' },
      buses: {
        controlBus: { active: true, signal: 'MEMORY_READ' },
        addressBus: { active: true, address: '0x02' },
        dataBus: { active: true, data: 'STORE [0x07], ACC', direction: 'to-cpu' },
      },
      ram: INITIAL_RAM.map((c) => ({ ...c, highlight: c.address === '0x02' })),
      rom: INITIAL_ROM,
      cache: [{ line: 0, tag: '0x02', data: 'STORE', hit: true }, { line: 1, tag: '0x06', data: '15', hit: true }],
      logMessage: 'Fetch Step: PC (0x02) fetches STORE opcode into IR. PC increments to 0x03.',
    },
    highlightedLines: [24, 25, 26],
    description: 'Fetch: Next instruction (STORE [0x07], ACC) fetched into IR.',
  });

  // 8. Execute STORE back into RAM
  const updatedRam = INITIAL_RAM.map((c) => (c.address === '0x07' ? { ...c, value: '57', highlight: true } : c));

  steps.push({
    state: {
      activeUnit: 'RAM',
      cyclePhase: 'STORE',
      registers: { PC: '0x03', IR: 'STORE [0x07], ACC', MAR: '0x07', MDR: '57', ACC: '57', R1: '42', R2: '15' },
      buses: {
        controlBus: { active: true, signal: 'MEMORY_WRITE' },
        addressBus: { active: true, address: '0x07' },
        dataBus: { active: true, data: '57', direction: 'to-memory' },
      },
      ram: updatedRam,
      rom: INITIAL_ROM,
      cache: [{ line: 0, tag: '0x07', data: '57 (Dirty)', hit: true }, { line: 1, tag: '0x06', data: '15', hit: true }],
      logMessage: 'Store Step: Control Unit triggers MEMORY_WRITE. Accumulator value (57) written to RAM cell 0x07 over Data Bus.',
    },
    highlightedLines: [28, 29],
    description: 'Store / Writeback: Result 57 written into volatile RAM memory address 0x07.',
  });

  // 9. Completion & Architecture Overview
  steps.push({
    state: {
      activeUnit: 'COMPLETE',
      cyclePhase: 'COMPLETE',
      registers: { PC: '0x03', IR: 'HALT', MAR: '0x07', MDR: '57', ACC: '57', R1: '42', R2: '15' },
      buses: {
        controlBus: { active: false, signal: 'HALTED' },
        addressBus: { active: false, address: '0x07' },
        dataBus: { active: false, data: 'IDLE', direction: 'idle' },
      },
      ram: updatedRam,
      rom: INITIAL_ROM,
      cache: [{ line: 0, tag: '0x07', data: '57', hit: true }, { line: 1, tag: '0x05', data: '42', hit: true }],
      logMessage: 'Von Neumann Architecture Cycle Complete: Program executed successfully with full CPU, RAM, ROM & Bus coordination! ✔',
    },
    highlightedLines: [1, 2, 3, 4, 15, 16],
    description: 'Done: Complete Fetch-Decode-Execute-Store cycle finished with CPU, Cache, RAM, ROM, and Tri-Bus synchronized ✔',
  });

  return steps;
}

export const cpuArchitectureDefinition: AlgorithmDefinition<unknown, CpuArchitectureState> = {
  meta: {
    id: 'cpu-ram-architecture',
    name: 'Computer Architecture: CPU, RAM & ROM',
    category: 'computer-fundamentals',
    timeComplexity: {
      best: '1 Clock Cycle (Cache Hit)',
      average: 'Fetch → Decode → Execute → Store',
      worst: 'Memory Latency (RAM Bus Access)',
    },
    spaceComplexity: 'Registers (PC, IR, MAR, MDR, ACC) + RAM/ROM',
    description: 'Interactive visualization of Von Neumann Computer Architecture: CPU (Control Unit, ALU, Registers), Primary Memory (RAM, ROM BIOS, Cache), and Tri-Bus System (Address, Data, Control).',
    code: CPU_ARCHITECTURE_CODE,
    defaultInput: null,
    implemented: true,
    conceptType: 'architecture',
  },
  generateSteps: () => generateCpuArchitectureSteps(),
};
