import { Job } from '../types';

export const MOCK_JOBS: Job[] = [
  {
    id: 'job-1',
    title: 'Senior Full Stack AI Engineer',
    company: 'Anthropic Nexus',
    logo: '✨',
    location: 'San Francisco, CA',
    workplaceType: 'Hybrid',
    experienceLevel: 'Senior',
    salaryMin: 185000,
    salaryMax: 240000,
    currency: 'USD',
    department: 'Core Product & AI Intelligence',
    postedAt: '2 hours ago',
    featured: true,
    applicantsCount: 42,
    tags: ['React', 'TypeScript', 'Node.js', 'LLM Agents', 'Python', 'Vector DBs', 'PostgreSQL'],
    description: 'We are seeking an exceptional Senior Full Stack AI Engineer to architect next-generation generative AI interfaces, autonomous agent orchestration systems, and high-throughput real-time web applications.',
    responsibilities: [
      'Architect and build intuitive, low-latency UI interfaces that harness complex multi-modal LLM reasoning pipelines.',
      'Design resilient backend microservices with Express/Node.js and Python fast-inferencing runtimes.',
      'Collaborate directly with AI research scientists to translate foundation model breakthroughs into consumer-facing features.',
      'Drive high code quality, automated end-to-end testing, and sub-100ms streaming UX benchmarks.'
    ],
    requirements: [
      '5+ years of production experience with TypeScript, modern React, and Node.js or Python backend services.',
      'Deep hands-on experience integrating LLM APIs (Gemini, Claude, OpenAI), embeddings, or vector retrieval (RAG).',
      'Solid foundations in distributed systems, state management, WebSockets, and database query optimization.',
      'B.S. in Computer Science or equivalent demonstrated software craftsmanship.'
    ],
    benefits: [
      'Competitive equity package with annual refreshers',
      'Comprehensive medical, dental, and vision with 100% coverage',
      '$4,000 annual continuous learning & conference budget',
      'Flexible hybrid schedule with catered lunches and wellness stipend'
    ],
    companyInsights: {
      culture: 'Engineering-driven, high autonomy, rapid iteration with strict ethical AI governance.',
      interviewRounds: 4,
      interviewDifficulty: 'High',
      avgResponseDays: 2,
      glassdoorRating: 4.8,
      size: '250 - 500 employees'
    }
  },
  {
    id: 'job-2',
    title: 'Staff Distributed Systems Architect',
    company: 'CloudScale Infrastructure',
    logo: '⚡',
    location: 'Remote (US / Canada)',
    workplaceType: 'Remote',
    experienceLevel: 'Staff / Principal',
    salaryMin: 220000,
    salaryMax: 285000,
    currency: 'USD',
    department: 'Platform Core & Edge Network',
    postedAt: '5 hours ago',
    featured: true,
    applicantsCount: 68,
    tags: ['Distributed Systems', 'Go', 'Kubernetes', 'Kafka', 'Rust', 'gRPC', 'PostgreSQL'],
    description: 'Join our Platform Core team to design and scale zero-downtime global multi-tenant edge infrastructure handling over 40 billion requests daily.',
    responsibilities: [
      'Set technical direction for our globally distributed real-time event streaming and state persistence layers.',
      'Author architectural RFCs, establish SLA/SLO budgets, and mentor senior staff across 6 engineering pods.',
      'Optimize multi-region failover, Raft consensus pipelines, and edge cache replication latencies.',
      'Partner with FinOps and Security to drive high infrastructure efficiency and SOC2 compliance.'
    ],
    requirements: [
      '8+ years building high-concurrency distributed systems in Go, Rust, or C++.',
      'Proven expertise in consensus algorithms (Raft/Paxos), event mesh (Kafka), and Kubernetes internals.',
      'Track record leading complex cross-team technical architecture transformations.'
    ],
    benefits: [
      'Top 1% remote compensation and generous equity pool',
      'Home office setup grant ($3,000) and ergonomic gear',
      'Unlimited PTO with mandatory 4-week minimum policy',
      '401(k) match up to 6% with immediate vesting'
    ],
    companyInsights: {
      culture: 'Asynchronous-first, high documentation rigor, engineering excellence without bureaucracy.',
      interviewRounds: 5,
      interviewDifficulty: 'Very High',
      avgResponseDays: 3,
      glassdoorRating: 4.9,
      size: '1,000+ employees'
    }
  },
  {
    id: 'job-3',
    title: 'Lead Frontend Platform Engineer',
    company: 'Veloce Design Systems',
    logo: '🎨',
    location: 'New York, NY',
    workplaceType: 'Hybrid',
    experienceLevel: 'Lead',
    salaryMin: 175000,
    salaryMax: 225000,
    currency: 'USD',
    department: 'Frontend Experience & Tooling',
    postedAt: '1 day ago',
    featured: false,
    applicantsCount: 31,
    tags: ['React', 'TypeScript', 'Design Systems', 'Vite', 'Tailwind CSS', 'Web Performance', 'Accessibility'],
    description: 'Lead the evolution of our enterprise design system and frontend build platform powering over 80 internal and external web applications.',
    responsibilities: [
      'Architect a modular, accessible WCAG AAA component library and token engine consumed by 120+ engineers.',
      'Improve core web vitals, build times, micro-frontend orchestration, and CI bundle size tracking.',
      'Provide hands-on code reviews, design system governance, and engineering workshops.'
    ],
    requirements: [
      '6+ years specializing in modern frontend architecture, TypeScript, React internals, and CSS/Tailwind.',
      'Strong eye for micro-interactions, animation performance (Framer Motion / CSS), and typography scales.',
      'Experience with Monorepos (Turborepo), npm package publishing, and automated visual regression testing.'
    ],
    benefits: [
      'Hybrid Manhattan office with rooftop terrace',
      'Annual equity grant and discretionary performance bonus (up to 20%)',
      'Comprehensive family healthcare & fertility assistance',
      'Commuter benefit & Citi Bike membership'
    ],
    companyInsights: {
      culture: 'Design-centric, empathetic product culture, collaborative cross-functional synergy.',
      interviewRounds: 4,
      interviewDifficulty: 'Medium',
      avgResponseDays: 1,
      glassdoorRating: 4.7,
      size: '500 - 1,000 employees'
    }
  },
  {
    id: 'job-4',
    title: 'Senior Machine Learning & MLOps Engineer',
    company: 'Hyperion Vision AI',
    logo: '🧠',
    location: 'Seattle, WA',
    workplaceType: 'Hybrid',
    experienceLevel: 'Senior',
    salaryMin: 190000,
    salaryMax: 250000,
    currency: 'USD',
    department: 'Applied Machine Learning',
    postedAt: '1 day ago',
    featured: true,
    applicantsCount: 54,
    tags: ['Python', 'PyTorch', 'MLOps', 'Docker', 'Kubernetes', 'CUDA', 'FastAPI', 'Ray'],
    description: 'Scale our production deep learning inferencing pipeline serving real-time computer vision and multimodal embeddings across thousands of edge and cloud nodes.',
    responsibilities: [
      'Deploy, optimize, and monitor large-scale neural network models using TensorRT, ONNX, and Triton inference servers.',
      'Build automated training workflows, feature stores, and continuous model drift detection systems.',
      'Collaborate with backend teams to integrate low-latency model APIs into customer-facing platforms.'
    ],
    requirements: [
      '4+ years deploying machine learning models into production with PyTorch/TensorFlow.',
      'Proficiency in Docker, Kubernetes, GPU resource scheduling, and distributed model serving.',
      'Solid software engineering discipline (clean code, CI/CD, unit/integration testing).'
    ],
    benefits: [
      'Substantial equity grant in fast-growing Series C startup',
      'Full health, dental, vision, life insurance',
      'Annual hardware refresh (Apple M3 Max / RTX 4090 workstation)',
      'Relocation assistance to Seattle tech corridor'
    ],
    companyInsights: {
      culture: 'Fast-paced, high intellectual honesty, customer-obsessed AI innovators.',
      interviewRounds: 4,
      interviewDifficulty: 'High',
      avgResponseDays: 2,
      glassdoorRating: 4.6,
      size: '100 - 250 employees'
    }
  },
  {
    id: 'job-5',
    title: 'Product Engineering Lead (Growth & AI)',
    company: 'FinTrack Global',
    logo: '📊',
    location: 'Remote (Worldwide)',
    workplaceType: 'Remote',
    experienceLevel: 'Lead',
    salaryMin: 165000,
    salaryMax: 215000,
    currency: 'USD',
    department: 'Growth, Retention & Monetization',
    postedAt: '2 days ago',
    featured: false,
    applicantsCount: 89,
    tags: ['React', 'TypeScript', 'Node.js', 'A/B Testing', 'Analytics', 'GraphQL', 'Fintech'],
    description: 'We are looking for a product-minded Lead Engineer to drive rapid experimentation, AI-assisted onboarding, and conversion funnel optimization.',
    responsibilities: [
      'Lead a fast-shipping squad of 5 engineers conducting weekly A/B tests across web and mobile web.',
      'Build AI-powered financial categorization tools and smart automated budget insights.',
      'Work tightly with Product Managers, Data Scientists, and Growth Marketers to maximize user retention.'
    ],
    requirements: [
      '6+ years of full-stack software development experience with strong product intuition.',
      'Proven track record driving measurable growth metrics (signups, activation, retention, revenue).',
      'Expertise in React, TypeScript, GraphQL/REST, and experimentation telemetry.'
    ],
    benefits: [
      '100% remote with international payroll support in 40+ countries',
      'Flexible working hours across preferred timezones',
      'Co-working stipend & annual company retreats (past: Lisbon, Tokyo, Costa Rica)',
      'Generous parental leave (6 months paid)'
    ],
    companyInsights: {
      culture: 'Metrics-driven, empowered autonomy, transparent executive communication.',
      interviewRounds: 3,
      interviewDifficulty: 'Medium',
      avgResponseDays: 2,
      glassdoorRating: 4.5,
      size: '200 - 500 employees'
    }
  },
  {
    id: 'job-6',
    title: 'Senior Cloud Security & DevSecOps Engineer',
    company: 'CyberShield ZeroTrust',
    logo: '🛡️',
    location: 'Austin, TX',
    workplaceType: 'Hybrid',
    experienceLevel: 'Senior',
    salaryMin: 170000,
    salaryMax: 220000,
    currency: 'USD',
    department: 'Information Security & Infrastructure',
    postedAt: '3 days ago',
    featured: false,
    applicantsCount: 22,
    tags: ['AWS', 'Terraform', 'Kubernetes', 'Zero Trust', 'Python', 'IAM', 'SOC2'],
    description: 'Safeguard next-generation cloud infrastructure through automated security guardrails, vulnerability management, and zero-trust IAM architectures.',
    responsibilities: [
      'Implement automated Infrastructure-as-Code (Terraform) security scanning and cloud posture management.',
      'Lead incident response drills, threat modeling workshops, and external penetration testing audits.',
      'Architect fine-grained IAM policies, secrets management (Vault), and container runtime security.'
    ],
    requirements: [
      '5+ years in cloud security / DevSecOps within AWS or GCP enterprise environments.',
      'Deep knowledge of container security, CI/CD pipeline hardening, and compliance frameworks (SOC2, ISO27001).',
      'Proficiency with Python, Bash scripting, and Terraform.'
    ],
    benefits: [
      'Competitive base + incentive bonus + stock options',
      'Full healthcare coverage including mental wellness therapy',
      'Continuous security certification sponsorships (CISSP, CKS, AWS Security Specialty)',
      'Austin tech hub office with complimentary parking'
    ],
    companyInsights: {
      culture: 'Safety-first, thorough architectural reviews, proactive threat elimination.',
      interviewRounds: 4,
      interviewDifficulty: 'High',
      avgResponseDays: 3,
      glassdoorRating: 4.7,
      size: '300 - 600 employees'
    }
  },
  {
    id: 'job-7',
    title: 'Full Stack Engineer (TypeScript & Next.js)',
    company: 'Pulse Health Technologies',
    logo: '🩺',
    location: 'Boston, MA',
    workplaceType: 'Hybrid',
    experienceLevel: 'Mid',
    salaryMin: 135000,
    salaryMax: 170000,
    currency: 'USD',
    department: 'Patient Care & Clinical Workflows',
    postedAt: '3 days ago',
    featured: false,
    applicantsCount: 76,
    tags: ['React', 'TypeScript', 'Node.js', 'Next.js', 'PostgreSQL', 'Tailwind CSS', 'HIPAA'],
    description: 'Help build compassionate, reliable digital health applications that streamline clinical consultations and telemedicine patient records.',
    responsibilities: [
      'Develop accessible and performant patient-facing portals and doctor scheduling dashboards.',
      'Build secure REST and GraphQL services complying with HIPAA data encryption standards.',
      'Participate in agile sprints, write clean unit tests, and maintain 95%+ test coverage.'
    ],
    requirements: [
      '3+ years full-stack web development experience with React and TypeScript.',
      'Solid database skills in relational schemas (PostgreSQL / MySQL) and ORMs (Prisma / Drizzle).',
      'Strong communication skills and passion for healthcare accessibility.'
    ],
    benefits: [
      'Comprehensive health coverage with low deductibles',
      'Student loan repayment assistance program ($300/month)',
      '401(k) with 5% employer match',
      'Subsidized transit pass in Greater Boston'
    ],
    companyInsights: {
      culture: 'Mission-driven, high empathy, structured work-life balance.',
      interviewRounds: 3,
      interviewDifficulty: 'Medium',
      avgResponseDays: 2,
      glassdoorRating: 4.8,
      size: '150 - 300 employees'
    }
  },
  {
    id: 'job-8',
    title: 'Senior DevOps & Site Reliability Engineer (SRE)',
    company: 'StreamVerse Media',
    logo: '📡',
    location: 'Los Angeles, CA',
    workplaceType: 'On-site',
    experienceLevel: 'Senior',
    salaryMin: 180000,
    salaryMax: 230000,
    currency: 'USD',
    department: 'Live Video CDN & Reliability',
    postedAt: '4 days ago',
    featured: false,
    applicantsCount: 45,
    tags: ['Kubernetes', 'AWS', 'Terraform', 'Prometheus', 'Grafana', 'Go', 'Datadog'],
    description: 'Ensure 99.999% uptime for global interactive live streams and esports broadcasting networks watched by millions of concurrent viewers.',
    responsibilities: [
      'Manage multi-region Kubernetes clusters handling peak live video traffic spikes.',
      'Implement automated canary deployments, progressive rollouts, and chaos engineering experiments.',
      'Refine Prometheus, Grafana, and Datadog monitoring to detect anomalies in sub-second timeframes.'
    ],
    requirements: [
      '5+ years hands-on SRE or DevOps experience with large-scale production cloud platforms.',
      'Expertise in Linux systems tuning, TCP/IP networking, and infrastructure orchestration.',
      'Experience in on-call escalation rotations and post-mortem incident reporting.'
    ],
    benefits: [
      'Competitive salary + annual equity bonus',
      'Free streaming subscriptions & gaming gear allowance',
      'On-site gourmet kitchen and wellness amenities',
      'Generous 401(k) matching plan'
    ],
    companyInsights: {
      culture: 'High energy, passion for interactive entertainment, transparent retrospectives.',
      interviewRounds: 4,
      interviewDifficulty: 'High',
      avgResponseDays: 2,
      glassdoorRating: 4.4,
      size: '1,500+ employees'
    }
  }
];
