import { InterviewQuestion } from '../types';

export const QUESTION_BANK: Record<string, InterviewQuestion[]> = {
  'Behavioral STAR': [
    {
      id: 'q-beh-1',
      question: 'Tell me about a time you led a technically complex project with significant ambiguity and tight deadlines. How did you break down the problem and ensure on-time delivery?',
      context: 'Assesses architectural leadership, cross-team scoping, ruthless prioritization, and execution rigor.',
      idealKeyPoints: [
        'Situation: High-stakes project with unclear requirements or high technical risk',
        'Task: Clear ownership of architectural blueprint, milestones, and deliverables',
        'Action: Technical spikes, incremental prototyping, transparent RFC reviews, unblocking teammates',
        'Result: Quantifiable metric outcome (e.g. delivered 2 weeks ahead of schedule, zero production defects)'
      ]
    },
    {
      id: 'q-beh-2',
      question: 'Describe a situation where you had a strong technical disagreement with a senior teammate or product manager. How did you navigate the conflict and what was the outcome?',
      context: 'Evaluates intellectual honesty, data-driven negotiation, empathy, and disagree-and-commit maturity.',
      idealKeyPoints: [
        'Situation: Conflicting technical opinions (e.g., microservices vs monolith, choice of database/framework)',
        'Task: Finding optimal long-term solution without compromising sprint momentum or team morale',
        'Action: Running objective benchmarks/POCs, focusing on user impact and SLA constraints rather than personal preference',
        'Result: Reaching consensus or gracefully committing with clear rollback/contingency criteria'
      ]
    },
    {
      id: 'q-beh-3',
      question: 'Can you share an experience where a critical production outage or severe bug occurred under your watch? How did you respond during the incident and prevent recurrence?',
      context: 'Measures calm triage under pressure, post-mortem blameless culture, and proactive observability hardening.',
      idealKeyPoints: [
        'Situation: Unexpected severity-1 outage affecting customer transactions or latency',
        'Task: Immediate containment, stakeholder communication, and root cause diagnosis',
        'Action: Fast rollback or hotfix deployment, systematic log/metric investigation, authoring a blameless post-mortem',
        'Result: Implementation of automated regression tests, circuit breakers, and alert thresholds eliminating repeat incidents'
      ]
    }
  ],
  'System Architecture': [
    {
      id: 'q-sys-1',
      question: 'Design a globally distributed, real-time notifications service supporting 50 million daily active users with push, email, and in-app feeds. How do you handle fan-out spikes and deduplication?',
      context: 'Tests understanding of message brokers (Kafka/RabbitMQ), partitioned databases, idempotency keys, and push gateways (APNs/FCM).',
      idealKeyPoints: [
        'High-level architecture: API Gateway, User Preference Service, Event Ingestion Stream (Kafka), Dispatch Workers, WebSockets Gateway',
        'Scalability: Partitioning by userId, priority queues for urgent vs bulk notifications',
        'Reliability: Distributed idempotency using Redis TTL locks + database unique constraints',
        'Tradeoffs: Eventual consistency for in-app history vs immediate low-latency push'
      ]
    },
    {
      id: 'q-sys-2',
      question: 'How would you architect a low-latency Distributed Rate Limiting service capable of evaluating 500,000 requests per second across multi-region edge nodes?',
      context: 'Examines algorithm tradeoffs (Token Bucket, Sliding Window Log, Leaky Bucket), Redis clustering, and edge synchronization.',
      idealKeyPoints: [
        'Algorithm selection: Sliding Window Counter using Redis Lua scripts for atomic increments',
        'Distributed coordination: Local in-memory edge token buffers with periodic batch synchronization to reduce cross-region latency',
        'Graceful degradation: Fail-open strategy when rate limiter cluster is unreachable to protect core customer availability',
        'Security: Client IP, API Key, and route-based tiering'
      ]
    }
  ],
  'Coding & Algorithms': [
    {
      id: 'q-code-1',
      question: 'How does the JavaScript event loop handle microtasks vs macrotasks, and how can unoptimized async state changes cause UI frame drops or memory leaks in React 19?',
      context: 'Probes deep runtime mastery, Promise scheduling, microtask queues, closure retention, and render cycle efficiency.',
      idealKeyPoints: [
        'Event loop execution phases: Call stack, Microtask queue (Promises, queueMicrotask), Macrotask queue (setTimeout, setInterval, I/O)',
        'Microtask starvation: Infinite promise chains blocking DOM repaint',
        'React render concurrency: Concurrent batching, memoization traps, and event listener cleanup in effects'
      ]
    }
  ],
  'Engineering Leadership': [
    {
      id: 'q-lead-1',
      question: 'How do you balance paying down accumulated technical debt against high-pressure feature requests from executive leadership?',
      context: 'Evaluates business acumen, quantification of tech debt cost (developer velocity, MTTR, cloud spend), and sustainable roadmapping.',
      idealKeyPoints: [
        'Translating tech debt into financial and risk metrics: developer onboarding time, customer-impacting latency, outage frequency',
        'Allocating dedicated sprint capacity (e.g. 20% engineering tax) or embedding refactors directly into feature epics',
        'Securing buy-in through transparent metrics and before/after velocity demonstrations'
      ]
    }
  ]
};
