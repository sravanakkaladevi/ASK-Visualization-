import { AlgorithmDefinition, CodeSnippets, Step } from '../types/algorithm';

export const AGILE_SPRINT_CODE_SNIPPETS: CodeSnippets = {
  typescript: `// Agile Scrum Sprint Execution Model
interface UserStory {
  id: string;
  title: string;
  points: number;
  status: 'backlog' | 'in-progress' | 'review' | 'done';
}

class ScrumSprint {
  private backlog: UserStory[] = [];
  private activeSprint: UserStory[] = [];

  startSprint(storyIds: string[]) {
    this.activeSprint = this.backlog.filter(s => storyIds.includes(s.id));
    console.log(\`Sprint Started with \${this.activeSprint.length} user stories.\`);
  }

  completeStory(storyId: string) {
    const story = this.activeSprint.find(s => s.id === storyId);
    if (story) story.status = 'done';
  }
}`,
  python: `# Agile Scrum Sprint Model
class UserStory:
    def __init__(self, story_id, title, points):
        self.id = story_id
        self.title = title
        self.points = points
        self.status = "backlog"

class ScrumSprint:
    def __init__(self, sprint_number):
        self.sprint_number = sprint_number
        self.stories = []

    def add_story(self, story):
        story.status = "in-progress"
        self.stories.append(story)
        print(f"Added '{story.title}' to Sprint {self.sprint_number}")`,
  java: `import java.util.ArrayList;
import java.util.List;

public class ScrumSprint {
    enum Status { BACKLOG, IN_PROGRESS, IN_REVIEW, DONE }

    static class UserStory {
        String title;
        int points;
        Status status = Status.BACKLOG;
        UserStory(String title, int points) { this.title = title; this.points = points; }
    }

    public static void main(String[] args) {
        UserStory story = new UserStory("Implement Auth", 5);
        story.status = Status.IN_PROGRESS;
        System.out.println("Sprint Story Status: " + story.status);
    }
}`,
  cpp: `#include <iostream>
#include <vector>
#include <string>

enum class StoryStatus { Backlog, InProgress, CodeReview, Done };

struct UserStory {
    std::string title;
    int points;
    StoryStatus status = StoryStatus::Backlog;
};

int main() {
    UserStory feature{"Dark Mode Theme", 3, StoryStatus::InProgress};
    std::cout << "Story initialized in Sprint backlog.\n";
    return 0;
}`,
};

export function generateAgileSprintSteps(): Step<any>[] {
  const steps: Step<any>[] = [];

  const initialStages = [
    { id: 's1', name: '1. Product Backlog Refinement', status: 'pending' as const, details: 'Prioritize epic features & estimate story points with Product Owner.' },
    { id: 's2', name: '2. Sprint Planning', status: 'pending' as const, details: 'Select stories into Sprint Backlog & define Sprint Goal.' },
    { id: 's3', name: '3. Daily Standup & Development', status: 'pending' as const, details: 'Execute tasks, pair program, update burndown chart & clear blockers.' },
    { id: 's4', name: '4. Code Review & QA Testing', status: 'pending' as const, details: 'Peer pull request review, automated unit tests & QA acceptance.' },
    { id: 's5', name: '5. Sprint Review & Retrospective', status: 'pending' as const, details: 'Demo increment to stakeholders & reflect on team velocity.' },
  ];

  // Step 1: Backlog Refinement
  steps.push({
    state: {
      modelName: 'Agile/Scrum',
      stages: [
        { ...initialStages[0], status: 'in-progress' as const, artifacts: ['Epic: User Auth', 'Feature: Audio FX', 'Bug: Dark Theme'] },
        ...initialStages.slice(1),
      ],
      currentStageId: 's1',
      sprintNumber: 14,
    },
    highlightedLines: [1, 2, 3, 4, 5, 6, 7],
    description: 'Phase 1: Product Backlog Refinement. Product Owner prioritizes requirements into user stories with story point estimations.',
  });

  // Step 2: Sprint Planning
  steps.push({
    state: {
      modelName: 'Agile/Scrum',
      stages: [
        { ...initialStages[0], status: 'completed' as const },
        { ...initialStages[1], status: 'in-progress' as const, artifacts: ['Sprint Commitment: 34 Points', 'Sprint Goal: Release Phase 2'] },
        ...initialStages.slice(2),
      ],
      currentStageId: 's2',
      sprintNumber: 14,
    },
    highlightedLines: [9, 10, 11, 12, 13],
    description: 'Phase 2: Sprint Planning. Team commits to 34 story points for Sprint 14 and establishes the Definition of Done (DoD).',
  });

  // Step 3: Daily Standup & Active Dev
  steps.push({
    state: {
      modelName: 'Agile/Scrum',
      stages: [
        { ...initialStages[0], status: 'completed' as const },
        { ...initialStages[1], status: 'completed' as const },
        { ...initialStages[2], status: 'in-progress' as const, artifacts: ['In-Progress: 3 Stories', 'Blockers: 0', 'Burndown: On Track'] },
        ...initialStages.slice(3),
      ],
      currentStageId: 's3',
      sprintNumber: 14,
    },
    highlightedLines: [14, 15, 16, 17],
    description: 'Phase 3: Development & Daily Standup. Engineers collaborate on feature tasks in 2-week iterations with continuous feedback.',
  });

  // Step 4: Code Review & QA
  steps.push({
    state: {
      modelName: 'Agile/Scrum',
      stages: [
        { ...initialStages[0], status: 'completed' as const },
        { ...initialStages[1], status: 'completed' as const },
        { ...initialStages[2], status: 'completed' as const },
        { ...initialStages[3], status: 'in-progress' as const, artifacts: ['PR #142 Approved', 'Unit Tests: 100% Pass', 'QA Verified'] },
        ...initialStages.slice(4),
      ],
      currentStageId: 's4',
      sprintNumber: 14,
    },
    highlightedLines: [14, 15, 16],
    description: 'Phase 4: Code Review & Quality Assurance. Peer reviews run alongside automated test suites to ensure zero regression.',
  });

  // Step 5: Sprint Review & Retrospective
  steps.push({
    state: {
      modelName: 'Agile/Scrum',
      stages: [
        { ...initialStages[0], status: 'completed' as const },
        { ...initialStages[1], status: 'completed' as const },
        { ...initialStages[2], status: 'completed' as const },
        { ...initialStages[3], status: 'completed' as const },
        { ...initialStages[4], status: 'completed' as const, artifacts: ['Shipped Increment', 'Velocity: 34 Points', 'Action Items Saved'] },
      ],
      currentStageId: 's5',
      sprintNumber: 14,
    },
    highlightedLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
    description: 'Phase 5: Sprint Review & Retrospective. Working software is demonstrated to stakeholders. Team holds retro to continuously improve process.',
  });

  return steps;
}

export const agileSprintDefinition: AlgorithmDefinition<unknown, any> = {
  meta: {
    id: 'agile-sprint',
    name: 'Agile / Scrum Sprint Lifecycle',
    category: 'software-engineering',
    timeComplexity: {
      best: '1-2 Weeks Iteration',
      average: '2 Weeks per Sprint',
      worst: 'Extended Release Cycle',
    },
    spaceComplexity: 'O(N) Backlog Items',
    description: 'Visualizes the end-to-end Agile Scrum lifecycle: Backlog Refinement $\\to$ Sprint Planning $\\to$ Daily Dev $\\to$ Code Review/QA $\\to$ Sprint Review & Retrospective.',
    code: AGILE_SPRINT_CODE_SNIPPETS,
    defaultInput: null,
    implemented: true,
  },
  generateSteps: () => generateAgileSprintSteps(),
};
