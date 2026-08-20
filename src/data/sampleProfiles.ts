import { CandidateProfile } from '../types';

export const SAMPLE_PROFILES: CandidateProfile[] = [
  {
    id: 'profile-senior-fullstack',
    fullName: 'Alex Morgan',
    title: 'Senior Full Stack & AI Systems Engineer',
    email: 'alex.morgan.dev@gmail.com',
    phone: '+1 (415) 890-3412',
    location: 'San Francisco, CA',
    githubUrl: 'https://github.com/alexmorgandev',
    linkedinUrl: 'https://linkedin.com/in/alexmorgan-eng',
    portfolioUrl: 'https://alexmorgan.design',
    summary: 'Senior Full Stack Engineer with 6+ years building high-concurrency cloud systems, modern React/TypeScript frontends, and AI-enabled product microservices. Proven success leading microservice migrations that cut p99 latencies by 45% and scaling SaaS platforms to 4M+ active users.',
    skills: [
      'TypeScript',
      'React',
      'Node.js',
      'Express',
      'Python',
      'PostgreSQL',
      'Docker',
      'AWS',
      'GraphQL',
      'Tailwind CSS',
      'Redis',
      'Vector DBs (Pinecone/Chroma)',
      'LLM Integration (Gemini / OpenAI)',
      'CI/CD Pipelines'
    ],
    yearsExperience: 6,
    targetRole: 'Senior Full Stack AI Engineer / Staff Engineer',
    targetSalary: 210000,
    preferredWorkplace: 'Hybrid',
    experiences: [
      {
        id: 'exp-1',
        company: 'Aura Cloud Technologies',
        role: 'Senior Full Stack Engineer',
        location: 'San Francisco, CA',
        startDate: '2022-03',
        endDate: 'Present',
        current: true,
        bullets: [
          'Spearheaded architectural redesign of core dashboard using React, TypeScript, and server-side streaming, reducing page load latency by 48% across 1.2M monthly users.',
          'Engineered autonomous AI workflow assistants with Gemini API and vector retrieval (RAG), automating 35,000+ support ticket resolutions monthly.',
          'Designed distributed caching strategy with Redis cluster and PostgreSQL partitions, dropping database compute load by 38% while sustaining 99.99% uptime.',
          'Mentored 4 junior and mid-level engineers, implemented automated PR review checks, and boosted sprint velocity by 25%.'
        ]
      },
      {
        id: 'exp-2',
        company: 'Veloce Data Systems',
        role: 'Full Stack Software Engineer',
        location: 'San Jose, CA',
        startDate: '2019-06',
        endDate: '2022-02',
        current: false,
        bullets: [
          'Developed responsive analytics visualization portal using React, D3.js, and TypeScript for enterprise financial customers.',
          'Built scalable REST and GraphQL API microservices in Node.js and Go that processed $150M+ in quarterly transactions.',
          'Constructed automated end-to-end CI/CD test suites with Playwright and Jest, increasing deployment frequency from bi-weekly to daily.'
        ]
      }
    ],
    education: [
      {
        id: 'edu-1',
        institution: 'University of California, Berkeley',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        year: '2019'
      }
    ],
    projects: [
      {
        id: 'proj-1',
        title: 'NeuralSearch - Semantic Document Engine',
        description: 'Open-source multimodal document retrieval engine with hybrid BM25 + dense vector search and sub-50ms query latency.',
        techStack: ['TypeScript', 'Python', 'FastAPI', 'ChromaDB', 'React', 'Tailwind'],
        link: 'https://github.com/alexmorgandev/neuralsearch',
        impactMetrics: '1.4k GitHub Stars, 200k+ package downloads'
      },
      {
        id: 'proj-2',
        title: 'Distributed Cron Orchestrator',
        description: 'Fault-tolerant job scheduler supporting dynamic retries, leader election via Raft consensus, and real-time execution dashboards.',
        techStack: ['Go', 'Docker', 'Redis', 'WebSockets', 'React'],
        impactMetrics: 'Processed 50M+ scheduled tasks with 0 dropped events'
      }
    ],
    certifications: [
      'AWS Certified Solutions Architect - Associate',
      'DeepLearning.AI Generative AI for Developers'
    ]
  },
  {
    id: 'profile-aiml-engineer',
    fullName: 'Elena Rostova',
    title: 'Senior Machine Learning & AI Engineer',
    email: 'elena.rostova.ai@gmail.com',
    phone: '+1 (206) 450-8192',
    location: 'Seattle, WA',
    githubUrl: 'https://github.com/elenarostova-ml',
    linkedinUrl: 'https://linkedin.com/in/elena-rostova-ai',
    portfolioUrl: 'https://elenarostova.ai',
    summary: 'Machine Learning Engineer with 5+ years of production experience in foundation model fine-tuning, computer vision architectures, MLOps, and scalable model serving pipelines.',
    skills: [
      'Python',
      'PyTorch',
      'TensorRT',
      'FastAPI',
      'Docker',
      'Kubernetes',
      'MLflow',
      'CUDA',
      'LangChain',
      'Hugging Face',
      'GCP Vertex AI',
      'SQL'
    ],
    yearsExperience: 5,
    targetRole: 'Senior Machine Learning & MLOps Engineer',
    targetSalary: 225000,
    preferredWorkplace: 'Hybrid',
    experiences: [
      {
        id: 'exp-ml-1',
        company: 'VisionTech Labs',
        role: 'Senior Machine Learning Engineer',
        location: 'Seattle, WA',
        startDate: '2021-08',
        endDate: 'Present',
        current: true,
        bullets: [
          'Deployed large vision-language transformer models on Triton inference clusters, reducing model inference latency from 180ms to 42ms with TensorRT quantization.',
          'Built automated model retraining pipelines with Kubeflow and MLflow, cutting model deployment cycles from weeks to 2 days.',
          'Authored 2 patent-pending algorithms for real-time video anomaly detection.'
        ]
      }
    ],
    education: [
      {
        id: 'edu-ml-1',
        institution: 'University of Washington',
        degree: 'Master of Science',
        field: 'Artificial Intelligence & Robotics',
        year: '2021'
      }
    ],
    projects: [
      {
        id: 'proj-ml-1',
        title: 'EdgeLLM - 4-bit Quantized Inferencer',
        description: 'Ultra-lightweight inferencing framework optimized for consumer GPUs and edge Apple Silicon chips.',
        techStack: ['Python', 'C++', 'PyTorch', 'Metal/CUDA'],
        impactMetrics: '4.2k GitHub Stars'
      }
    ],
    certifications: [
      'Google Cloud Professional Machine Learning Engineer',
      'NVIDIA Deep Learning Institute Certified'
    ]
  }
];
