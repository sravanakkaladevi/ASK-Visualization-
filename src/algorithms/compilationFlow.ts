import { AlgorithmDefinition, CompFundState, CodeSnippets, Step } from '../types/algorithm';

export const COMPILATION_FLOW_CODE_SNIPPETS: CodeSnippets = {
  typescript: `// C++ / High Level Code Compilation Flow to Hardware Machine Code
int main() {
  int a = 5;
  int b = 10;
  int sum = a + b;
  return sum;
}`,
  python: `# Source Code -> Compiler / Interpreter -> CPU Execution
def main():
    a = 5
    b = 10
    return a + b`,
  java: `public class CompilerPipeline {
    public static void main(String[] args) {
        int a = 5, b = 10;
        int sum = a + b;
    }
}`,
  cpp: `int main() {
    int a = 5, b = 10;
    return a + b;
}`,
};

export function generateCompilationFlowSteps(): Step<CompFundState>[] {
  const steps: Step<CompFundState>[] = [];

  const stages = [
    { id: 'source', name: '1. Source Code', type: 'source' as const, status: 'default' as const, codeSnippet: 'int a = 5;\nint b = 10;\nint sum = a + b;' },
    { id: 'lexer', name: '2. Lexer & AST Parser', type: 'lexer' as const, status: 'default' as const, codeSnippet: 'Tokens: [INT, IDENT("a"), ASSIGN, NUM(5)]\nAST: BinaryExpr(+ a b)' },
    { id: 'compiler', name: '3. Compiler Optimizer', type: 'compiler' as const, status: 'default' as const, codeSnippet: 'Intermediate Representation (IR):\n%1 = load i32 5\n%2 = load i32 10\n%3 = add i32 %1, %2' },
    { id: 'bytecode', name: '4. Machine Bytecode', type: 'bytecode' as const, status: 'default' as const, codeSnippet: 'Assembly x86-64:\nMOV EAX, 5\nMOV EBX, 10\nADD EAX, EBX' },
    { id: 'cpu', name: '5. CPU Registers & RAM', type: 'cpu' as const, status: 'default' as const, registerState: 'RAX: 0x0000000F (15)\nRIP: 0x400080\nRAM Addr 0x7FFF4: 15' },
  ];

  stages.forEach((stage, idx) => {
    const updatedStages = stages.map((s, sIdx) => {
      if (sIdx < idx) return { ...s, status: 'completed' as const };
      if (sIdx === idx) return { ...s, status: 'in-progress' as const };
      return { ...s, status: 'pending' as const };
    });

    steps.push({
      state: {
        stages: updatedStages,
        currentStageId: stage.id,
        logMessage: `Compilation Stage ${idx + 1}: ${stage.name}. Transforming code representation.`,
      },
      highlightedLines: [1, 2, 3, 4, 5],
      description: `Stage ${idx + 1}: ${stage.name}. Data passes through compiler pipeline into execution hardware.`,
    });
  });

  // Final Complete Step
  steps.push({
    state: {
      stages: stages.map((s) => ({ ...s, status: 'completed' as const })),
      currentStageId: 'cpu',
      logMessage: 'Compilation & CPU Hardware Execution Complete! Result 15 stored in CPU Register RAX.',
    },
    highlightedLines: [1, 2, 3, 4, 5, 6],
    description: 'Source Code -> Compiler -> Assembly -> CPU Execution Pipeline Completed!',
  });

  return steps;
}

export const compilationFlowDefinition: AlgorithmDefinition<unknown, CompFundState> = {
  meta: {
    id: 'compilation-flow',
    name: 'Source Code to CPU Compilation Pipeline',
    category: 'computer-fundamentals',
    timeComplexity: { best: 'O(N) Tokens', average: 'O(N) AST Traverse', worst: 'O(N) Code Gen' },
    spaceComplexity: 'O(N) AST Node Tree',
    description: 'Interactive visualization of Computer Fundamentals: Source Code $\\to$ Lexer/AST Parser $\\to$ Compiler Optimizer $\\to$ x86-64 Assembly Bytecode $\\to$ CPU Registers & RAM execution.',
    code: COMPILATION_FLOW_CODE_SNIPPETS,
    defaultInput: null,
    implemented: true,
    conceptType: 'process',
  },
  generateSteps: () => generateCompilationFlowSteps(),
};
