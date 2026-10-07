import { AlgorithmDefinition, MernState, CodeSnippets, Step } from '../types/algorithm';

export const MERN_STACK_CODE_SNIPPETS: CodeSnippets = {
  typescript: `// MERN Full Stack Lifecycle (React -> Express -> Node -> MongoDB)

// 1. React Frontend Component (UI)
const handleLogin = async (email, password) => {
  // 2. HTTP POST Request via Axios/Fetch
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  // 7. React UI State Update
  const data = await res.json();
  setUserToken(data.token);
};

// 3. Express Route & 4. Node Controller
app.post('/api/auth/login', async (req, res) => {
  // 5. MongoDB Query
  const user = await User.findOne({ email: req.body.email });
  
  // 6. JWT Sign & HTTP Response
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ success: true, token });
});`,
  python: `# Full Stack Web Request Lifecycle
# Frontend: React Fetch Request -> Backend: Express / Node -> DB: MongoDB
import requests

response = requests.post("http://localhost:5000/api/auth/login", json={
    "email": "user@example.com",
    "password": "secretpassword"
})
print("MERN Stack Response:", response.json())`,
  java: `// MERN Stack Architecture (React -> Express -> Node -> MongoDB)
public class MernRequest {
    public static void main(String[] args) {
        System.out.println("1. React UI Event Handler Triggered");
        System.out.println("2. HTTP POST /api/auth/login");
        System.out.println("3. Express Middleware & Node Controller Execution");
        System.out.println("4. MongoDB Query Execution: db.users.findOne()");
        System.out.println("5. Return JWT Token Response to React Client");
    }
}`,
  cpp: `#include <iostream>

int main() {
    std::cout << "[MERN Full-Stack Flow] React UI -> Express API -> Node Async -> MongoDB BSON -> React State\n";
    return 0;
}`,
};

export function generateMernStackSteps(): Step<MernState>[] {
  const steps: Step<MernState>[] = [];

  const baseComponents = [
    { id: 'react', name: 'React UI (Browser)', type: 'react' as const, status: 'default' as const, subText: 'Component State' },
    { id: 'express', name: 'Express Router', type: 'express' as const, status: 'default' as const, subText: 'POST /api/login' },
    { id: 'node', name: 'Node.js Runtime', type: 'node' as const, status: 'default' as const, subText: 'Async Event Loop' },
    { id: 'mongo', name: 'MongoDB Database', type: 'mongodb' as const, status: 'default' as const, subText: 'BSON Collection' },
  ];

  // Step 1: User Clicks Login
  steps.push({
    state: {
      components: [
        { ...baseComponents[0], status: 'active' as const },
        ...baseComponents.slice(1).map((c) => ({ ...c, status: 'unvisited' as const })),
      ],
      activeStepIndex: 0,
      requestPayload: 'user@example.com',
      logMessage: '1. User clicks "Login" button in React UI. Form event handler triggered.',
    },
    highlightedLines: [4, 5],
    description: 'React Frontend: User submits login form. Event handler captures credentials.',
  });

  // Step 2: HTTP POST Request
  steps.push({
    state: {
      components: [
        { ...baseComponents[0], status: 'visited' as const },
        { ...baseComponents[1], status: 'comparing' as const },
        { ...baseComponents[2], status: 'unvisited' as const },
        { ...baseComponents[3], status: 'unvisited' as const },
      ],
      activeStepIndex: 1,
      requestPayload: 'POST /api/auth/login HTTP/1.1',
      logMessage: '2. React dispatches async fetch request over HTTP to Express backend API.',
    },
    highlightedLines: [6, 7, 8, 9, 10],
    description: 'HTTP Network Layer: Axios/Fetch transmits POST request payload over TCP/TLS.',
  });

  // Step 3: Express Router & Node Controller
  steps.push({
    state: {
      components: [
        { ...baseComponents[0], status: 'visited' as const },
        { ...baseComponents[1], status: 'visited' as const },
        { ...baseComponents[2], status: 'active' as const },
        { ...baseComponents[3], status: 'unvisited' as const },
      ],
      activeStepIndex: 2,
      requestPayload: 'Express Router match -> Controller Exec',
      logMessage: '3. Express routes request to controller. Node.js processes async logic in Event Loop.',
    },
    highlightedLines: [17, 18],
    description: 'Node.js/Express Backend: Middleware parses JSON body and invokes authentication controller.',
  });

  // Step 4: MongoDB Query
  steps.push({
    state: {
      components: [
        { ...baseComponents[0], status: 'visited' as const },
        { ...baseComponents[1], status: 'visited' as const },
        { ...baseComponents[2], status: 'active' as const },
        { ...baseComponents[3], status: 'comparing' as const },
      ],
      activeStepIndex: 3,
      requestPayload: 'db.users.findOne({ email: "user@example.com" })',
      logMessage: '4. Mongoose ORM executes BSON query against MongoDB "users" collection.',
    },
    highlightedLines: [19, 20],
    description: 'MongoDB Database: Driver queries indexed BSON collection and returns user record.',
  });

  // Step 5: JWT Token & HTTP 200 Response
  steps.push({
    state: {
      components: [
        { ...baseComponents[0], status: 'visited' as const },
        { ...baseComponents[1], status: 'sorted' as const },
        { ...baseComponents[2], status: 'sorted' as const },
        { ...baseComponents[3], status: 'visited' as const },
      ],
      activeStepIndex: 4,
      responsePayload: 'HTTP 200 OK { token: "eyJhbGciOi...", user: { ... } }',
      logMessage: '5. Node signs JWT authentication token and responds with HTTP 200 OK JSON.',
    },
    highlightedLines: [22, 23],
    description: 'Express Backend: Password verified. Server signs JWT token and transmits JSON response.',
  });

  // Step 6: React State Update & UI Render
  steps.push({
    state: {
      components: [
        { ...baseComponents[0], status: 'sorted' as const },
        { ...baseComponents[1], status: 'sorted' as const },
        { ...baseComponents[2], status: 'sorted' as const },
        { ...baseComponents[3], status: 'sorted' as const },
      ],
      activeStepIndex: 5,
      responsePayload: 'User Authenticated! Navigating to Dashboard.',
      logMessage: '6. React updates state, stores JWT token in localStorage/Zustand, and re-renders UI.',
    },
    highlightedLines: [11, 12, 13],
    description: 'MERN Request Cycle Complete! React updates component state and renders authenticated UI.',
  });

  return steps;
}

export const mernStackDefinition: AlgorithmDefinition<unknown, MernState> = {
  meta: {
    id: 'mern-stack',
    name: 'MERN Full-Stack Request Journey',
    category: 'full-stack',
    timeComplexity: {
      best: '15-40ms Full Trip',
      average: '30ms End-to-End',
      worst: 'O(1) DB Index Query',
    },
    spaceComplexity: 'O(1) Memory JSON Buffer',
    description: 'Interactive visualization of a full-stack MERN application request lifecycle: React UI $\\to$ HTTP POST $\\to$ Express Router $\\to$ Node.js Controller $\\to$ MongoDB BSON Query $\\to$ JWT Response $\\to$ React State Render.',
    code: MERN_STACK_CODE_SNIPPETS,
    defaultInput: null,
    implemented: true,
    conceptType: 'architecture',
  },
  generateSteps: () => generateMernStackSteps(),
};
