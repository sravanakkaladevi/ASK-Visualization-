import { AlgorithmDefinition, LinuxGitDevOpsState, CodeSnippets, Step } from '../types/algorithm';

export const GIT_WORKFLOW_CODE_SNIPPETS: CodeSnippets = {
  typescript: `// Git Architecture Workflow
// 1. Working Directory -> git add . -> 2. Staging Area -> git commit -> 3. Local Repo -> git push -> 4. GitHub Remote

// Command 1: Stage modified files
// git add src/App.tsx src/index.css

// Command 2: Commit staged snapshot
// git commit -m "feat: Add interactive visualizer"

// Command 3: Push commits to remote GitHub repository
// git push origin main`,
  python: `# Git Visual Workflow
# Working Directory -> Staging Area -> Local Repository -> Remote GitHub

# 1. Stage changes
subprocess.run("git add .", shell=True)

# 2. Commit snapshot
subprocess.run('git commit -m "feat: complete visualizer"', shell=True)

# 3. Push to GitHub
subprocess.run("git push origin main", shell=True)`,
  java: `public class GitWorkflow {
    public static void main(String[] args) {
        System.out.println("Working Directory -> Staging Area -> Local Repo -> GitHub Remote");
    }
}`,
  cpp: `#include <iostream>

int main() {
    std::cout << "[Git Architecture] Working Directory -> Staging -> Local Commit -> GitHub Remote\n";
    return 0;
}`,
};

export function generateGitWorkflowSteps(): Step<LinuxGitDevOpsState>[] {
  const steps: Step<LinuxGitDevOpsState>[] = [];

  // Step 1: Working Directory changes
  steps.push({
    state: {
      mode: 'git-workflow',
      command: 'git status',
      output: 'Modified: src/App.tsx, src/index.css (Untracked in Working Directory)',
      gitBranch: 'main',
      stagingFiles: [],
      committedFiles: [],
      logMessage: '1. Working Directory: Developer modifies source code files locally.',
    },
    highlightedLines: [1, 2, 3, 4],
    description: 'Working Directory: Code edits exist on disk but are not yet staged.',
  });

  // Step 2: git add .
  steps.push({
    state: {
      mode: 'git-workflow',
      command: 'git add .',
      output: 'Changes staged for commit: src/App.tsx, src/index.css',
      gitBranch: 'main',
      stagingFiles: ['src/App.tsx', 'src/index.css'],
      committedFiles: [],
      logMessage: '2. Staging Area: "git add ." copies file snapshots into index staging area.',
    },
    highlightedLines: [5, 6],
    description: 'Staging Area (Index): Files prepared and indexed for the next commit snapshot.',
  });

  // Step 3: git commit
  steps.push({
    state: {
      mode: 'git-workflow',
      command: 'git commit -m "feat: add interactive visualizer"',
      output: '[main 8a9f2b1] feat: add interactive visualizer (2 files changed)',
      gitBranch: 'main',
      stagingFiles: [],
      committedFiles: ['Commit 8a9f2b1 (HEAD -> main)'],
      logMessage: '3. Local Repository: "git commit" saves immutable DAG commit snapshot with SHA-1 hash.',
    },
    highlightedLines: [8, 9],
    description: 'Local Repository (.git): Commit graph node created locally with author metadata and parent pointer.',
  });

  // Step 4: git push origin main
  steps.push({
    state: {
      mode: 'git-workflow',
      command: 'git push origin main',
      output: 'To github.com:company/algocraft.git -> 8a9f2b1..main (100% Pushed)',
      gitBranch: 'main',
      stagingFiles: [],
      committedFiles: ['Commit 8a9f2b1 (origin/main)'],
      logMessage: '4. GitHub Remote: "git push" uploads local commits to GitHub cloud repository.',
    },
    highlightedLines: [11, 12],
    description: 'Remote Repository (GitHub): Remote ref "origin/main" updated to match local branch HEAD.',
  });

  return steps;
}

export const gitWorkflowDefinition: AlgorithmDefinition<unknown, LinuxGitDevOpsState> = {
  meta: {
    id: 'git-workflow',
    name: 'Git & GitHub Version Control Workflow',
    category: 'devops',
    timeComplexity: { best: 'O(1) SHA Hash', average: 'O(N) Files Staged', worst: 'O(1) Delta Push' },
    spaceComplexity: 'O(N) Object Store (.git/objects)',
    description: 'Visualizes the core Git architecture: Working Directory $\\to$ Staging Area (`git add`) $\\to$ Local Repository (`git commit`) $\\to$ Remote GitHub (`git push`).',
    code: GIT_WORKFLOW_CODE_SNIPPETS,
    defaultInput: null,
    implemented: true,
    conceptType: 'terminal',
  },
  generateSteps: () => generateGitWorkflowSteps(),
};
