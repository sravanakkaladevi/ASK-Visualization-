import { AlgorithmDefinition, SystemDesignState, CodeSnippets, Step } from '../types/algorithm';

export const CACHE_ASIDE_CODE_SNIPPETS: CodeSnippets = {
  typescript: `import { createClient } from 'redis';
import { Pool } from 'pg';

const redis = createClient();
const db = new Pool();

async function getUserProfile(userId: string) {
  const cacheKey = \`user:\${userId}\`;

  // 1. Check Redis Cache
  const cachedData = await redis.get(cacheKey);
  if (cachedData) {
    console.log('CACHE HIT! Returning cached profile from Redis.');
    return JSON.parse(cachedData);
  }

  // 2. CACHE MISS! Query Database
  console.log('CACHE MISS! Querying PostgreSQL database...');
  const dbResult = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
  const user = dbResult.rows[0];

  // 3. Write-Back to Redis Cache with 1 hour TTL
  await redis.setEx(cacheKey, 3600, JSON.stringify(user));
  return user;
}`,
  python: `import redis
import psycopg2
import json

r = redis.Redis(host='localhost', port=6379, db=0)

def get_user_profile(user_id):
    cache_key = f"user:{user_id}"
    
    # 1. Check Cache
    cached_data = r.get(cache_key)
    if cached_data:
        print("CACHE HIT!")
        return json.loads(cached_data)
        
    # 2. Cache Miss -> Query Database
    print("CACHE MISS! Querying DB...")
    # ... Fetch from Postgres ...
    user_data = {"id": user_id, "name": "Alice", "role": "Engineer"}
    
    # 3. Save to Cache
    r.setex(cache_key, 3600, json.dumps(user_data))
    return user_data`,
  java: `import redis.clients.jedis.Jedis;

public class CacheAsideService {
    private Jedis redis = new Jedis("localhost", 6379);

    public String getUser(String userId) {
        String cacheKey = "user:" + userId;
        // 1. Check Cache
        String cached = redis.get(cacheKey);
        if (cached != null) {
            System.out.println("CACHE HIT!");
            return cached;
        }
        // 2. Query DB & Populate Cache
        System.out.println("CACHE MISS! Reading DB...");
        String dbData = "{'id':'" + userId + "'}";
        redis.setex(cacheKey, 3600, dbData);
        return dbData;
    }
}`,
  cpp: `#include <iostream>
#include <string>

std::string getUser(const std::string& userId) {
    std::string cacheKey = "user:" + userId;
    // 1. Check Redis Cache
    bool isCached = false;
    if (isCached) {
        return "Cached User Data";
    }
    // 2. Cache Miss: Fetch from DB & Populate Redis
    std::cout << "Cache Miss! Querying SQL DB and populating Redis...\n";
    return "DB User Data";
}`,
};

export function generateCacheAsideSteps(): Step<SystemDesignState>[] {
  const steps: Step<SystemDesignState>[] = [];

  const baseNodes = [
    { id: 'client-1', label: 'Client App', type: 'client' as const, status: 'default' as const },
    { id: 'lb', label: 'API Gateway', type: 'load-balancer' as const, status: 'default' as const },
    { id: 'server-a', label: 'App Server', type: 'server' as const, status: 'default' as const },
    { id: 'db', label: 'PostgreSQL DB', type: 'database' as const, status: 'default' as const },
  ];

  // System nodes including Redis Cache
  const nodesWithCache = [
    ...baseNodes,
    { id: 'server-b', label: 'Redis Cache', type: 'cache' as const, status: 'default' as const },
  ];

  const baseEdges = [
    { from: 'client-1', to: 'lb', label: 'HTTP GET /user/42', status: 'default' as const },
    { from: 'lb', to: 'server-a', label: 'Route Request', status: 'default' as const },
    { from: 'server-a', to: 'server-b', label: 'GET user:42', status: 'default' as const },
    { from: 'server-a', to: 'db', label: 'SELECT * FROM users', status: 'default' as const },
    { from: 'server-b', to: 'server-a', label: 'Set Cache (TTL 3600)', status: 'default' as const },
  ];

  // Step 0: Idle State
  steps.push({
    state: {
      nodes: nodesWithCache.map((n) => ({ ...n, status: 'unvisited' as const })),
      edges: baseEdges.map((e) => ({ ...e, status: 'default' as const })),
    },
    highlightedLines: [1, 2, 3, 4, 5, 6, 7],
    description: 'System Idle. Client prepares to request profile for User #42.',
  });

  // Step 1: Client Request -> App Server -> Cache Check
  steps.push({
    state: {
      nodes: [
        { ...nodesWithCache[0], status: 'visited' as const },
        { ...nodesWithCache[1], status: 'visited' as const },
        { ...nodesWithCache[2], status: 'active' as const },
        { ...nodesWithCache[3], status: 'unvisited' as const },
        { ...nodesWithCache[4], status: 'comparing' as const },
      ],
      edges: [
        { ...baseEdges[0], status: 'visited' as const },
        { ...baseEdges[1], status: 'visited' as const },
        { ...baseEdges[2], status: 'active' as const },
        { ...baseEdges[3], status: 'default' as const },
        { ...baseEdges[4], status: 'default' as const },
      ],
    },
    highlightedLines: [10, 11, 12, 13],
    description: '1. App Server checks Redis Cache for key "user:42".',
  });

  // Step 2: CACHE MISS! Query PostgreSQL DB
  steps.push({
    state: {
      nodes: [
        { ...nodesWithCache[0], status: 'visited' as const },
        { ...nodesWithCache[1], status: 'visited' as const },
        { ...nodesWithCache[2], status: 'active' as const },
        { ...nodesWithCache[3], status: 'comparing' as const },
        { ...nodesWithCache[4], status: 'deleted' as const }, // Cache miss indicator
      ],
      edges: [
        { ...baseEdges[0], status: 'visited' as const },
        { ...baseEdges[1], status: 'visited' as const },
        { ...baseEdges[2], status: 'visited' as const },
        { ...baseEdges[3], status: 'active' as const },
        { ...baseEdges[4], status: 'default' as const },
      ],
    },
    highlightedLines: [17, 18, 19],
    description: '2. CACHE MISS! Redis returns null. App Server queries PostgreSQL primary database.',
  });

  // Step 3: DB Returns Data -> Populate Cache (Write-Back)
  steps.push({
    state: {
      nodes: [
        { ...nodesWithCache[0], status: 'visited' as const },
        { ...nodesWithCache[1], status: 'visited' as const },
        { ...nodesWithCache[2], status: 'active' as const },
        { ...nodesWithCache[3], status: 'visited' as const },
        { ...nodesWithCache[4], status: 'inserted' as const }, // Cache populated
      ],
      edges: [
        { ...baseEdges[0], status: 'visited' as const },
        { ...baseEdges[1], status: 'visited' as const },
        { ...baseEdges[2], status: 'visited' as const },
        { ...baseEdges[3], status: 'visited' as const },
        { ...baseEdges[4], status: 'active' as const },
      ],
    },
    highlightedLines: [22, 23],
    description: '3. DB returns user row. App Server asynchronously populates Redis with 1-hour TTL (SETEX user:42 3600).',
  });

  // Step 4: Subsequent Request -> CACHE HIT!
  steps.push({
    state: {
      nodes: [
        { ...nodesWithCache[0], status: 'sorted' as const },
        { ...nodesWithCache[1], status: 'sorted' as const },
        { ...nodesWithCache[2], status: 'sorted' as const },
        { ...nodesWithCache[3], status: 'visited' as const },
        { ...nodesWithCache[4], status: 'sorted' as const }, // Fast cache hit
      ],
      edges: [
        { ...baseEdges[0], status: 'sorted' as const },
        { ...baseEdges[1], status: 'sorted' as const },
        { ...baseEdges[2], status: 'sorted' as const },
        { ...baseEdges[3], status: 'visited' as const },
        { ...baseEdges[4], status: 'sorted' as const },
      ],
    },
    highlightedLines: [12, 13, 14, 15],
    description: '4. Subsequent Request: CACHE HIT! Data is returned directly from Redis memory in under <1ms.',
  });

  return steps;
}

export const cacheAsideDefinition: AlgorithmDefinition<unknown, SystemDesignState> = {
  meta: {
    id: 'cache-aside',
    name: 'Distributed Redis Cache-Aside Pattern',
    category: 'system-design',
    timeComplexity: {
      best: '<1ms (Cache Hit)',
      average: '2ms (Hit) / 25ms (Miss)',
      worst: 'O(1) Memory lookup',
    },
    spaceComplexity: 'O(N) Cached In-Memory Keys',
    description: 'Visualizes the Cache-Aside (Lazy Loading) architecture pattern: Read from Redis $\\to$ On Miss read from DB $\\to$ Populate Redis with TTL $\\to$ Subsequent sub-ms Cache Hits.',
    code: CACHE_ASIDE_CODE_SNIPPETS,
    defaultInput: null,
    implemented: true,
  },
  generateSteps: () => generateCacheAsideSteps(),
};
