import { AlgorithmDefinition, CodeSnippets, Step } from '../types/algorithm';

export const CICD_PIPELINE_CODE_SNIPPETS: CodeSnippets = {
  typescript: `// GitHub Actions CI/CD Automation Script
import { execSync } from 'child_process';

function runPipeline() {
  console.log('1. Fetching source code commit...');
  
  console.log('2. Running TypeScript build...');
  execSync('npm run build');

  console.log('3. Executing automated Vitest suite...');
  execSync('npm run test');

  console.log('4. Deploying to Staging cluster...');
  execSync('kubectl apply -f staging.yaml');

  console.log('5. Promoting to Production!');
}
runPipeline();`,
  python: `# CI/CD Deployment Script
import subprocess
import sys

def run_step(command, description):
    print(f"--> {description}")
    result = subprocess.run(command, shell=True)
    if result.returncode != 0:
        print(f"Pipeline Failed at {description}!")
        sys.exit(1)

run_step("git pull origin main", "Code Checkout")
run_step("python -m pytest", "Unit Tests")
run_step("docker build -t app:v1 .", "Container Build")
print("CI/CD Deployment Succeeded!")`,
  java: `public class PipelineRunner {
    public static void main(String[] args) {
        System.out.println("Stage 1: Git Push Triggered");
        System.out.println("Stage 2: Maven Clean Package Build");
        System.out.println("Stage 3: JUnit 5 Automated Tests");
        System.out.println("Stage 4: Kubernetes Blue/Green Deploy");
    }
}`,
  cpp: `#include <iostream>
#include <cstdlib>

int main() {
    std::cout << "[CI/CD] Triggering automated build pipeline...\n";
    int res = std::system("cmake --build build && ctest");
    if (res == 0) {
        std::cout << "[CI/CD] Build & Test Succeeded. Deploying artifact!\n";
    }
    return 0;
}`,
};

export function generateCicdPipelineSteps(): Step<any>[] {
  const steps: Step<any>[] = [];

  const initialStages = [
    { id: 'c1', name: '1. Source Commit', status: 'pending' as const, details: 'Git Push commit triggered webhook event.' },
    { id: 'c2', name: '2. Build & Lint', status: 'pending' as const, details: 'Compile TypeScript assets & build Docker container image.' },
    { id: 'c3', name: '3. Automated Testing', status: 'pending' as const, details: 'Execute unit tests, integration tests & static analysis.' },
    { id: 'c4', name: '4. Staging Deployment', status: 'pending' as const, details: 'Deploy container image to Staging environment for verification.' },
    { id: 'c5', name: '5. Production Release', status: 'pending' as const, details: 'Zero-downtime Blue/Green deployment with health check monitoring.' },
  ];

  // Step 1: Source Commit
  steps.push({
    state: {
      modelName: 'CI/CD Pipeline',
      stages: [
        { ...initialStages[0], status: 'in-progress' as const, artifacts: ['Commit: a8f92b', 'Branch: main', 'Author: dev@company.com'] },
        ...initialStages.slice(1),
      ],
      currentStageId: 'c1',
    },
    highlightedLines: [4, 5, 6],
    description: 'Stage 1: Code Commit. Developer pushes new feature code to main branch. GitHub Actions webhook triggers CI pipeline.',
  });

  // Step 2: Build & Lint
  steps.push({
    state: {
      modelName: 'CI/CD Pipeline',
      stages: [
        { ...initialStages[0], status: 'completed' as const },
        { ...initialStages[1], status: 'in-progress' as const, artifacts: ['Vite Build: OK', 'Docker Image: app:v2.4.0 (120MB)'] },
        ...initialStages.slice(2),
      ],
      currentStageId: 'c2',
    },
    highlightedLines: [7, 8],
    description: 'Stage 2: Build & Lint. Compiler verifies TypeScript strict mode and builds optimized bundle inside Docker image.',
  });

  // Step 3: Automated Testing
  steps.push({
    state: {
      modelName: 'CI/CD Pipeline',
      stages: [
        { ...initialStages[0], status: 'completed' as const },
        { ...initialStages[1], status: 'completed' as const },
        { ...initialStages[2], status: 'in-progress' as const, artifacts: ['Unit Tests: 15/15 Passed', 'Coverage: 98%', 'Security Audit: 0 Alerts'] },
        ...initialStages.slice(3),
      ],
      currentStageId: 'c3',
    },
    highlightedLines: [10, 11],
    description: 'Stage 3: Automated Testing. Vitest unit tests and vulnerability scanners run automatically.',
  });

  // Step 4: Staging Deployment
  steps.push({
    state: {
      modelName: 'CI/CD Pipeline',
      stages: [
        { ...initialStages[0], status: 'completed' as const },
        { ...initialStages[1], status: 'completed' as const },
        { ...initialStages[2], status: 'completed' as const },
        { ...initialStages[3], status: 'in-progress' as const, artifacts: ['K8s Pods: 3 Active', 'End-to-End Test: Passed'] },
        ...initialStages.slice(4),
      ],
      currentStageId: 'c4',
    },
    highlightedLines: [13, 14],
    description: 'Stage 4: Staging Deployment. Artifact is deployed to Kubernetes staging namespace for automated E2E smoke tests.',
  });

  // Step 5: Production Release
  steps.push({
    state: {
      modelName: 'CI/CD Pipeline',
      stages: [
        { ...initialStages[0], status: 'completed' as const },
        { ...initialStages[1], status: 'completed' as const },
        { ...initialStages[2], status: 'completed' as const },
        { ...initialStages[3], status: 'completed' as const },
        { ...initialStages[4], status: 'completed' as const, artifacts: ['Prod Cluster: Live', 'Traffic Switch: 100% Blue', 'Latency: 24ms'] },
      ],
      currentStageId: 'c5',
    },
    highlightedLines: [16, 17, 18],
    description: 'Stage 5: Production Blue/Green Release. Production router switches 100% traffic to new green release with 0 downtime!',
  });

  return steps;
}

export const cicdPipelineDefinition: AlgorithmDefinition<unknown, any> = {
  meta: {
    id: 'cicd-pipeline',
    name: 'CI/CD Deployment Pipeline',
    category: 'software-engineering',
    timeComplexity: {
      best: '2-5 Minutes',
      average: '5 Minutes per Deployment',
      worst: 'Rollback on failure',
    },
    spaceComplexity: 'O(1) Immutable Container Image',
    description: 'Visualizes continuous integration and continuous deployment pipeline stages: Commit $\\to$ Build $\\to$ Test $\\to$ Staging $\\to$ Zero-Downtime Production Deploy.',
    code: CICD_PIPELINE_CODE_SNIPPETS,
    defaultInput: null,
    implemented: true,
  },
  generateSteps: () => generateCicdPipelineSteps(),
};
