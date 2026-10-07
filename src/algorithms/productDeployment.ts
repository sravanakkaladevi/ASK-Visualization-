import { AlgorithmDefinition, LinuxGitDevOpsState, CodeSnippets, Step } from '../types/algorithm';

export const PRODUCT_DEPLOYMENT_CODE_SNIPPETS: CodeSnippets = {
  typescript: `// DevOps Product Deployment Pipeline Automation
import { execSync } from 'child_process';

function deployProduct() {
  console.log('1. Dev pushes commit to GitHub...');
  execSync('git push origin main');

  console.log('2. GitHub Actions CI pipeline triggered');
  execSync('npm run build && vitest run');

  console.log('3. Building Docker image...');
  execSync('docker build -t registry.company.com/app:v3.0 .');

  console.log('4. Pushing to Container Registry');
  execSync('docker push registry.company.com/app:v3.0');

  console.log('5. Deploying to Cloud Server via Nginx Proxy');
  execSync('kubectl set image deployment/prod-app app=registry.company.com/app:v3.0');
}
deployProduct();`,
  python: `# DevOps Product Deployment Script
import subprocess

stages = [
    "git push origin main",
    "npm run build && pytest",
    "docker build -t app:v3.0 .",
    "docker push registry/app:v3.0",
    "ansible-playbook deploy.yml"
]

for stage in stages:
    print(f"--> Executing Stage: {stage}")
    subprocess.run(stage, shell=True, check=True)
print("Production Deployment Live!")`,
  java: `public class ProductDeployer {
    public static void main(String[] args) {
        System.out.println("Developer VS Code -> Git -> GitHub -> CI -> Build -> Test -> Docker -> Registry -> Cloud Server -> Nginx -> User");
    }
}`,
  cpp: `#include <iostream>

int main() {
    std::cout << "[DevOps Deployment] VSCode -> Git -> GitHub -> CI -> Docker -> Cloud Server -> Nginx -> User\n";
    return 0;
}`,
};

export function generateProductDeploymentSteps(): Step<LinuxGitDevOpsState>[] {
  const steps: Step<LinuxGitDevOpsState>[] = [];

  const stages = [
    { id: 'dev', label: '1. Developer (VS Code)', type: 'vscode' as const, status: 'default' as const, subText: 'Feature Code' },
    { id: 'git', label: '2. Git & GitHub', type: 'github' as const, status: 'default' as const, subText: 'Push main' },
    { id: 'ci', label: '3. CI Runner', type: 'ci' as const, status: 'default' as const, subText: 'GitHub Actions' },
    { id: 'build', label: '4. Build & Test', type: 'build' as const, status: 'default' as const, subText: 'Vite & Vitest' },
    { id: 'docker', label: '5. Docker Container', type: 'docker' as const, status: 'default' as const, subText: 'Image Build' },
    { id: 'registry', label: '6. Image Registry', type: 'registry' as const, status: 'default' as const, subText: 'ECR / Docker Hub' },
    { id: 'server', label: '7. Cloud Server', type: 'server' as const, status: 'default' as const, subText: 'AWS / K8s' },
    { id: 'nginx', label: '8. Nginx Proxy', type: 'nginx' as const, status: 'default' as const, subText: 'Port 80/443' },
    { id: 'user', label: '9. End User', type: 'user' as const, status: 'default' as const, subText: 'Browser Live' },
  ];

  stages.forEach((stage, idx) => {
    const updatedStages = stages.map((s, sIdx) => {
      if (sIdx < idx) return { ...s, status: 'completed' as const };
      if (sIdx === idx) return { ...s, status: 'in-progress' as const };
      return { ...s, status: 'pending' as const };
    });

    steps.push({
      state: {
        mode: 'product-deployment',
        stages: updatedStages,
        activeStageId: stage.id,
        logMessage: `DevOps Deployment Stage ${idx + 1}: ${stage.label} - ${stage.subText}`,
      },
      highlightedLines: [1, 2, 3, 4, 5],
      description: `Product Deployment Pipeline Stage ${idx + 1}: ${stage.label}. Transmitting build artifact forward.`,
    });
  });

  // Final Complete Step
  steps.push({
    state: {
      mode: 'product-deployment',
      stages: stages.map((s) => ({ ...s, status: 'completed' as const })),
      activeStageId: 'user',
      logMessage: 'Product Deployment Complete! Live website serving production users with zero downtime.',
    },
    highlightedLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    description: 'DevOps End-to-End Product Deployment Complete! CODE -> BUILD -> TEST -> DOCKER -> CLOUD -> USER.',
  });

  return steps;
}

export const productDeploymentDefinition: AlgorithmDefinition<unknown, LinuxGitDevOpsState> = {
  meta: {
    id: 'product-deployment',
    name: 'DevOps Product Deployment Pipeline',
    category: 'cloud-deployment',
    timeComplexity: {
      best: '3-5 Minutes',
      average: '5 Minutes',
      worst: 'Rollback on failure',
    },
    spaceComplexity: 'O(1) Immutable Docker Image',
    description: 'Interactive visualization of the complete DevOps Product Deployment journey: Developer (VS Code) $\\to$ Git/GitHub $\\to$ CI Webhook $\\to$ Build & Vitest Test $\\to$ Docker Image $\\to$ Registry $\\to$ Cloud Server $\\to$ Nginx Proxy $\\to$ Live Production User.',
    code: PRODUCT_DEPLOYMENT_CODE_SNIPPETS,
    defaultInput: null,
    implemented: true,
    conceptType: 'sdlc',
  },
  generateSteps: () => generateProductDeploymentSteps(),
};
