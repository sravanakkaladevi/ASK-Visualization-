import { AlgorithmDefinition, CodeSnippets, Step } from '../types/algorithm';

export const WATERFALL_CODE_SNIPPETS: CodeSnippets = {
  typescript: `// Waterfall Sequential SDLC Lifecycle
enum WaterfallPhase {
  REQUIREMENTS = 'SRS Document',
  DESIGN = 'HLD + LLD Blueprint',
  IMPLEMENTATION = 'Source Code',
  TESTING = 'QA Test Suite',
  DEPLOYMENT = 'Production Environment',
  MAINTENANCE = 'Patches & Upgrades'
}

class WaterfallProject {
  private currentPhase: WaterfallPhase = WaterfallPhase.REQUIREMENTS;

  transitionToNextPhase(nextPhase: WaterfallPhase) {
    console.log(\`Cascading from \${this.currentPhase} -> \${nextPhase}\`);
    this.currentPhase = nextPhase;
  }
}`,
  python: `# Waterfall Model Sequential Execution
class WaterfallPhase:
    REQUIREMENTS = "1. Requirements Analysis (SRS)"
    DESIGN = "2. System Design (HLD/LLD)"
    IMPLEMENTATION = "3. Coding & Implementation"
    TESTING = "4. System & Integration Testing"
    DEPLOYMENT = "5. Production Deployment"
    MAINTENANCE = "6. Maintenance & Support"

def advance_phase(current, next_phase):
    print(f"Phase Delivered: {current} -> Transitioning to {next_phase}")`,
  java: `public class WaterfallModel {
    public static void main(String[] args) {
        String[] phases = {
            "Requirements (SRS)", "Design (HLD/LLD)", "Coding", "Testing", "Deployment", "Maintenance"
        };
        for (String phase : phases) {
            System.out.println("Executing Waterfall Phase: " + phase);
        }
    }
}`,
  cpp: `#include <iostream>
#include <vector>
#include <string>

int main() {
    std::vector<std::string> waterfallPhases = {
        "Requirements", "Design", "Implementation", "Verification", "Deployment", "Maintenance"
    };
    for (const auto& phase : waterfallPhases) {
        std::cout << "[Waterfall SDLC] Phase Complete: " << phase << "\n";
    }
    return 0;
}`,
};

export function generateWaterfallSteps(): Step<any>[] {
  const steps: Step<any>[] = [];

  const stages = [
    { id: 'wf-1', name: '1. Requirements Analysis', status: 'pending' as const, details: 'Gather business goals & author Software Requirements Specification (SRS).', deliverable: 'SRS Document' },
    { id: 'wf-2', name: '2. System Design', status: 'pending' as const, details: 'Architect High-Level (HLD) & Low-Level (LLD) system blueprints.', deliverable: 'HLD + LLD Specifications' },
    { id: 'wf-3', name: '3. Implementation & Coding', status: 'pending' as const, details: 'Engineers construct codebase based on design specs.', deliverable: 'Source Code Base' },
    { id: 'wf-4', name: '4. Integration & Testing', status: 'pending' as const, details: 'QA team verifies requirements & runs acceptance test suites.', deliverable: 'Verified Test Report' },
    { id: 'wf-5', name: '5. Deployment', status: 'pending' as const, details: 'Release software to production cloud servers.', deliverable: 'Production Software Release' },
    { id: 'wf-6', name: '6. Maintenance', status: 'pending' as const, details: 'Ongoing monitoring, bug fixes, and patch updates.', deliverable: 'Operational Support' },
  ];

  stages.forEach((stage, idx) => {
    const updatedStages = stages.map((s, sIdx) => {
      if (sIdx < idx) return { ...s, status: 'completed' as const, artifacts: [s.deliverable] };
      if (sIdx === idx) return { ...s, status: 'in-progress' as const, artifacts: [s.deliverable] };
      return { ...s, status: 'pending' as const };
    });

    steps.push({
      state: {
        modelName: 'Waterfall',
        stages: updatedStages,
        currentStageId: stage.id,
        activeArtifact: stage.deliverable,
      },
      highlightedLines: [1, 2, 3, 4, 5],
      description: `Waterfall Phase ${idx + 1}: ${stage.name}. Deliverable: "${stage.deliverable}".`,
    });
  });

  // Final Complete Step
  steps.push({
    state: {
      modelName: 'Waterfall',
      stages: stages.map((s) => ({ ...s, status: 'completed' as const, artifacts: [s.deliverable] })),
      currentStageId: 'wf-6',
      activeArtifact: 'Production Software Release',
    },
    highlightedLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    description: 'Waterfall SDLC Complete! Sequential linear project lifecycle delivered to production.',
  });

  return steps;
}

export const waterfallModelDefinition: AlgorithmDefinition<unknown, any> = {
  meta: {
    id: 'waterfall-model',
    name: 'Waterfall SDLC Model',
    category: 'software-engineering',
    timeComplexity: {
      best: 'Sequential Linear Phase',
      average: 'Phase-by-Phase Delivery',
      worst: 'High Cost of Change Late Phase',
    },
    spaceComplexity: 'O(N) SRS Deliverables',
    description: 'Interactive visualization of the classic Waterfall Software Development Life Cycle model (Requirements $\\to$ Design $\\to$ Implementation $\\to$ Testing $\\to$ Deployment $\\to$ Maintenance).',
    code: WATERFALL_CODE_SNIPPETS,
    defaultInput: null,
    implemented: true,
    conceptType: 'sdlc',
  },
  generateSteps: () => generateWaterfallSteps(),
};
