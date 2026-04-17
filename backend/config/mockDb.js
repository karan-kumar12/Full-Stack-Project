import bcrypt from 'bcryptjs';

// the database
export let mockDatabase = { users: [], interviews: [], questions: [], responses: [], feedback: [] };

export const initializeSampleData = () => {
  let sampleUsers = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'demo123',
      targetRole: 'Software Engineer',
      bio: 'Aspiring full-stack developer',
      completedInterviews: 3,
      averageScore: 82,
      createdAt: new Date(),
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      password: 'demo123',
      targetRole: 'Product Manager',
      bio: 'Preparing for PM interviews',
      completedInterviews: 5,
      averageScore: 78,
      createdAt: new Date(),
    },
    {
      id: '3',
      name: 'Mike Chen',
      email: 'mike@example.com',
      password: 'demo123',
      targetRole: 'Data Scientist',
      bio: 'ML engineer looking to transition',
      completedInterviews: 2,
      averageScore: 88,
      createdAt: new Date(),
    },
    {
      id: '4',
      name: 'Emily Williams',
      email: 'emily@example.com',
      password: 'demo123',
      targetRole: 'Frontend Developer',
      bio: 'React specialist',
      completedInterviews: 7,
      averageScore: 85,
      createdAt: new Date(),
    },
    {
      id: '5',
      name: 'Alex Kumar',
      email: 'alex@example.com',
      password: 'demo123',
      targetRole: 'DevOps Engineer',
      bio: 'Cloud infrastructure specialist',
      completedInterviews: 4,
      averageScore: 81,
      createdAt: new Date(),
    },
  ];

  // hash the passwords
  sampleUsers.forEach((user) => {
    let salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(user.password, salt);
  });

  mockDatabase.users = sampleUsers;

  console.log('data loaded');
};

// find user by email
export const findUserByEmail = (email) => {
  return mockDatabase.users.find(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );
};

// find user by id
export const findUserById = (id) => {
  return mockDatabase.users.find((user) => user.id === id);
};

// make a new user
export const createUser = (name, email, password, targetRole) => {
  let salt = bcrypt.genSaltSync(10);
  let hashedPassword = bcrypt.hashSync(password, salt);

  let newUser = {
    id: String(mockDatabase.users.length + 1),
    name: name,
    email: email.toLowerCase(),
    password: hashedPassword,
    targetRole: targetRole || 'Software Engineer',
    bio: '',
    completedInterviews: 0,
    averageScore: 0,
    profileImage: null,
    interviewHistory: [],
    createdAt: new Date(),
  };

  mockDatabase.users.push(newUser);
  return newUser;
};

// update a user
export const updateUser = (id, updates) => {
  let user = findUserById(id);
  if (user) {
    Object.assign(user, updates);
  }
  return user;
};

// Interview operations
export const createInterview = (
  userId,
  jobRole,
  experienceLevel,
  duration,
  totalQuestions
) => {
  const interview = {
    id: String(mockDatabase.interviews.length + 1),
    userId,
    jobRole,
    experienceLevel,
    duration,
    totalQuestions,
    questions: [],
    status: 'ongoing',
    createdAt: new Date(),
    completedAt: null,
  };

  mockDatabase.interviews.push(interview);
  return interview;
};

export const getInterviewById = (id) => {
  return mockDatabase.interviews.find((interview) => interview.id === id);
};

export const getUserInterviews = (userId) => {
  return mockDatabase.interviews.filter(
    (interview) => interview.userId === userId
  );
};

export const completeInterview = (id) => {
  const interview = getInterviewById(id);
  if (interview) {
    interview.status = 'completed';
    interview.completedAt = new Date();
  }
  return interview;
};

// MCQ Questions Bank organized by experience level
export const mcqQuestionsBank = {
  Fresher: [
    {
      questionText: 'What does HTTP stand for?',
      options: ['HyperText Transfer Protocol', 'High Transfer Text Protocol', 'Home Tool Transfer Program', 'Hyperlinks and Text Transfer Page'],
      correctAnswer: 'HyperText Transfer Protocol',
      difficulty: 'Easy',
      timeLimit: 45,
    },
    {
      questionText: 'Which of the following is NOT a programming language?',
      options: ['Python', 'HTML', 'Java', 'JavaScript'],
      correctAnswer: 'HTML',
      difficulty: 'Easy',
      timeLimit: 45,
    },
    {
      questionText: 'What is the time complexity of binary search?',
      options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
      correctAnswer: 'O(log n)',
      difficulty: 'Easy',
      timeLimit: 45,
    },
    {
      questionText: 'Which data structure uses LIFO (Last In First Out)?',
      options: ['Queue', 'Stack', 'Linked List', 'Array'],
      correctAnswer: 'Stack',
      difficulty: 'Easy',
      timeLimit: 45,
    },
    {
      questionText: 'What is the main purpose of a database?',
      options: ['To run applications', 'To store and retrieve data', 'To manage networks', 'To create websites'],
      correctAnswer: 'To store and retrieve data',
      difficulty: 'Easy',
      timeLimit: 45,
    },
    {
      questionText: 'Which protocol is used for secure data transmission?',
      options: ['HTTP', 'HTTPS', 'FTP', 'SMTP'],
      correctAnswer: 'HTTPS',
      difficulty: 'Easy',
      timeLimit: 45,
    },
    {
      questionText: 'What does CSS stand for?',
      options: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style System', 'Code Style Syntax'],
      correctAnswer: 'Cascading Style Sheets',
      difficulty: 'Easy',
      timeLimit: 45,
    },
    {
      questionText: 'Which one is a relational database?',
      options: ['MongoDB', 'MySQL', 'Redis', 'Cassandra'],
      correctAnswer: 'MySQL',
      difficulty: 'Easy',
      timeLimit: 45,
    },
    {
      questionText: 'What is the purpose of version control?',
      options: ['To manage project budgets', 'To track code changes', 'To compile code', 'To deploy applications'],
      correctAnswer: 'To track code changes',
      difficulty: 'Easy',
      timeLimit: 45,
    },
    {
      questionText: 'Which of these is a frontend framework?',
      options: ['Django', 'React', 'Flask', 'Spring'],
      correctAnswer: 'React',
      difficulty: 'Easy',
      timeLimit: 45,
    },
    {
      questionText: 'What does API stand for?',
      options: ['Application Programming Interface', 'Advanced Program Integration', 'Application Process Interface', 'Automated Programming Input'],
      correctAnswer: 'Application Programming Interface',
      difficulty: 'Easy',
      timeLimit: 45,
    },
    {
      questionText: 'Which sorting algorithm has O(n log n) average time complexity?',
      options: ['Bubble Sort', 'Merge Sort', 'Selection Sort', 'Insertion Sort'],
      correctAnswer: 'Merge Sort',
      difficulty: 'Easy',
      timeLimit: 45,
    },
    {
      questionText: 'What is a REST API?',
      options: ['Representational State Transfer API', 'Real-time Execution Service Transfer', 'Remote Server Transmission API', 'Resource Exchange System Tool'],
      correctAnswer: 'Representational State Transfer API',
      difficulty: 'Easy',
      timeLimit: 45,
    },
    {
      questionText: 'Which is NOT an OOP concept?',
      options: ['Inheritance', 'Polymorphism', 'Encapsulation', 'Iteration'],
      correctAnswer: 'Iteration',
      difficulty: 'Easy',
      timeLimit: 45,
    },
    {
      questionText: 'What does JSON stand for?',
      options: ['JavaScript Object Notation', 'Java Serial Object Network', 'JavaScript Online Notation', 'JSON Object New Type'],
      correctAnswer: 'JavaScript Object Notation',
      difficulty: 'Easy',
      timeLimit: 45,
    },
  ],
  Junior: [
    {
      questionText: 'What is the time complexity of quicksort in the worst case?',
      options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2^n)'],
      correctAnswer: 'O(n²)',
      difficulty: 'Medium',
      timeLimit: 45,
    },
    {
      questionText: 'Which design pattern is used for creating objects without specifying their exact classes?',
      options: ['Singleton', 'Factory', 'Observer', 'Strategy'],
      correctAnswer: 'Factory',
      difficulty: 'Medium',
      timeLimit: 45,
    },
    {
      questionText: 'What is the difference between var, let, and const in JavaScript?',
      options: ['No difference', 'Scope and reassignment behavior differ', 'Only performance differs', 'Only naming convention differs'],
      correctAnswer: 'Scope and reassignment behavior differ',
      difficulty: 'Medium',
      timeLimit: 45,
    },
    {
      questionText: 'What does ACID stand for in databases?',
      options: ['Atomicity, Consistency, Isolation, Durability', 'Availability, Consistency, Isolation, Distribution', 'Atomicity, Consistency, Integrity, Durability', 'Authenticity, Consistency, Isolation, Durability'],
      correctAnswer: 'Atomicity, Consistency, Isolation, Durability',
      difficulty: 'Medium',
      timeLimit: 45,
    },
    {
      questionText: 'What is the purpose of middleware in Express.js?',
      options: ['To connect frontend and backend', 'To process requests and responses', 'To store data', 'To manage databases'],
      correctAnswer: 'To process requests and responses',
      difficulty: 'Medium',
      timeLimit: 45,
    },
    {
      questionText: 'Which of these is a NoSQL database?',
      options: ['PostgreSQL', 'Oracle', 'MongoDB', 'SQL Server'],
      correctAnswer: 'MongoDB',
      difficulty: 'Medium',
      timeLimit: 45,
    },
    {
      questionText: 'What is a closure in JavaScript?',
      options: ['A function that closes a connection', 'A function that has access to variables from its outer scope', 'A way to end a program', 'A type of loop'],
      correctAnswer: 'A function that has access to variables from its outer scope',
      difficulty: 'Medium',
      timeLimit: 45,
    },
    {
      questionText: 'What does CORS stand for?',
      options: ['Cross-Origin Request Security', 'Cross-Origin Resource Sharing', 'Client-Origin Request System', 'Cross-Origin Response Security'],
      correctAnswer: 'Cross-Origin Resource Sharing',
      difficulty: 'Medium',
      timeLimit: 45,
    },
    {
      questionText: 'What is the difference between == and === in JavaScript?',
      options: ['No difference', '== checks value, === checks value and type', '=== checks value, == checks type', 'Only available in older JavaScript'],
      correctAnswer: '== checks value, === checks value and type',
      difficulty: 'Medium',
      timeLimit: 45,
    },
    {
      questionText: 'What is a webhook?',
      options: ['A web hook for hanging items', 'A method for sending real-time data to a URL', 'A type of web framework', 'A security protocol'],
      correctAnswer: 'A method for sending real-time data to a URL',
      difficulty: 'Medium',
      timeLimit: 45,
    },
    {
      questionText: 'What is the purpose of Redis?',
      options: ['A relational database', 'An in-memory data store for caching', 'A machine learning library', 'A web server'],
      correctAnswer: 'An in-memory data store for caching',
      difficulty: 'Medium',
      timeLimit: 45,
    },
    {
      questionText: 'What is a hash table/hash map?',
      options: ['A linear data structure', 'A data structure that maps keys to values using a hash function', 'A type of sorting algorithm', 'A network protocol'],
      correctAnswer: 'A data structure that maps keys to values using a hash function',
      difficulty: 'Medium',
      timeLimit: 45,
    },
    {
      questionText: 'What is the difference between SQL and NoSQL?',
      options: ['No difference', 'SQL is relational, NoSQL is non-relational', 'NoSQL is faster in all cases', 'SQL is never used anymore'],
      correctAnswer: 'SQL is relational, NoSQL is non-relational',
      difficulty: 'Medium',
      timeLimit: 45,
    },
    {
      questionText: 'What is JWT authentication?',
      options: ['A Java-based testing tool', 'A token-based authentication method', 'A JavaScript web framework', 'A JSON web template'],
      correctAnswer: 'A token-based authentication method',
      difficulty: 'Medium',
      timeLimit: 45,
    },
    {
      questionText: 'What is memoization?',
      options: ['Writing memos in code', 'Caching function results to optimize performance', 'Managing memory usage', 'Creating backup copies'],
      correctAnswer: 'Caching function results to optimize performance',
      difficulty: 'Medium',
      timeLimit: 45,
    },
  ],
  'Mid-level': [
    {
      questionText: 'What is the difference between horizontal and vertical scaling?',
      options: ['Only direction differs', 'Horizontal adds more machines, vertical adds more power to a machine', 'Vertical is faster', 'Horizontal is more expensive'],
      correctAnswer: 'Horizontal adds more machines, vertical adds more power to a machine',
      difficulty: 'Hard',
      timeLimit: 45,
    },
    {
      questionText: 'Explain the concept of eventual consistency in distributed systems',
      options: ['Data is always consistent', 'System will eventually have consistent data across nodes', 'Consistency is impossible', 'Only applies to SQL databases'],
      correctAnswer: 'System will eventually have consistent data across nodes',
      difficulty: 'Hard',
      timeLimit: 45,
    },
    {
      questionText: 'What is a microservice architecture?',
      options: ['One large monolithic application', 'Breaking an application into small, independent services', 'A single database approach', 'Old architecture pattern'],
      correctAnswer: 'Breaking an application into small, independent services',
      difficulty: 'Hard',
      timeLimit: 45,
    },
    {
      questionText: 'What is container orchestration?',
      options: ['Managing music containers', 'Automating deployment and management of containers like Docker', 'A database concept', 'A frontend framework'],
      correctAnswer: 'Automating deployment and management of containers like Docker',
      difficulty: 'Hard',
      timeLimit: 45,
    },
    {
      questionText: 'What is the CAP theorem?',
      options: ['Consistency, Availability, Partition tolerance - a distributed system can guarantee only 2 of 3', 'A database indexing strategy', 'A caching mechanism', 'A sorting algorithm'],
      correctAnswer: 'Consistency, Availability, Partition tolerance - a distributed system can guarantee only 2 of 3',
      difficulty: 'Hard',
      timeLimit: 45,
    },
    {
      questionText: 'What is load balancing?',
      options: ['Balancing server load visually', 'Distributing network traffic across multiple servers', 'A database optimization technique', 'A caching strategy'],
      correctAnswer: 'Distributing network traffic across multiple servers',
      difficulty: 'Hard',
      timeLimit: 45,
    },
    {
      questionText: 'What is a circuit breaker pattern?',
      options: ['Electrical component simulation', 'Preventing cascading failures by temporarily stopping requests to a failing service', 'A database pattern', 'A front-end design pattern'],
      correctAnswer: 'Preventing cascading failures by temporarily stopping requests to a failing service',
      difficulty: 'Hard',
      timeLimit: 45,
    },
    {
      questionText: 'What is the difference between SQL injection and XSS?',
      options: ['Both are the same', 'SQL injection targets databases, XSS targets client-side', 'XSS is more dangerous', 'Both only affect frontend'],
      correctAnswer: 'SQL injection targets databases, XSS targets client-side',
      difficulty: 'Hard',
      timeLimit: 45,
    },
    {
      questionText: 'What is message queuing?',
      options: ['Creating long lines of messages', 'Asynchronously processing messages using queue systems', 'Sorting messages alphabetically', 'A database feature'],
      correctAnswer: 'Asynchronously processing messages using queue systems',
      difficulty: 'Hard',
      timeLimit: 45,
    },
    {
      questionText: 'What is the difference between sharding and replication?',
      options: ['No difference', 'Sharding splits data horizontally, replication copies data to multiple nodes', 'Replication is faster', 'Both are the same concept'],
      correctAnswer: 'Sharding splits data horizontally, replication copies data to multiple nodes',
      difficulty: 'Hard',
      timeLimit: 45,
    },
    {
      questionText: 'What is GraphQL?',
      options: ['A database query language', 'A query language for APIs allowing clients to request exact data they need', 'A type of graph database', 'A visualization library'],
      correctAnswer: 'A query language for APIs allowing clients to request exact data they need',
      difficulty: 'Hard',
      timeLimit: 45,
    },
    {
      questionText: 'What is the N+1 query problem?',
      options: ['Mathematical problem', 'Making multiple database queries when one optimized query would suffice', 'A programming language', 'A sorting issue'],
      correctAnswer: 'Making multiple database queries when one optimized query would suffice',
      difficulty: 'Hard',
      timeLimit: 45,
    },
    {
      questionText: 'What is a distributed transaction?',
      options: ['A transaction in multiple databases ensuring ACID properties', 'A money transaction', 'A simple database transaction', 'A frontend operation'],
      correctAnswer: 'A transaction in multiple databases ensuring ACID properties',
      difficulty: 'Hard',
      timeLimit: 45,
    },
    {
      questionText: 'What is the difference between stateless and stateful architectures?',
      options: ['No difference', 'Stateless tracks no user state, stateful maintains user session data', 'Both are identical', 'Stateful is always better'],
      correctAnswer: 'Stateless tracks no user state, stateful maintains user session data',
      difficulty: 'Hard',
      timeLimit: 45,
    },
    {
      questionText: 'What is serverless computing?',
      options: ['Computing without servers', 'Executing code without managing infrastructure, paying only for execution', 'A local computing approach', 'Old programming paradigm'],
      correctAnswer: 'Executing code without managing infrastructure, paying only for execution',
      difficulty: 'Hard',
      timeLimit: 45,
    },
  ],
  Senior: [
    {
      questionText: 'Explain eventual consistency and how it differs from strong consistency',
      options: ['They are the same', 'Eventual consistency allows temporary inconsistency across nodes; strong consistency maintains immediate consistency everywhere', 'Strong consistency is always better', 'Eventual consistency is obsolete'],
      correctAnswer: 'Eventual consistency allows temporary inconsistency across nodes; strong consistency maintains immediate consistency everywhere',
      difficulty: 'Hard',
      timeLimit: 45,
    },
    {
      questionText: 'What is the difference between pessimistic and optimistic locking?',
      options: ['Only terminology differs', 'Pessimistic locks before modifications, optimistic checks for conflicts at commit time', 'Both approaches identical', 'Pessimistic is obsolete'],
      correctAnswer: 'Pessimistic locks before modifications, optimistic checks for conflicts at commit time',
      difficulty: 'Hard',
      timeLimit: 45,
    },
    {
      questionText: 'What is rate limiting and why is it important?',
      options: ['Limiting speed of code execution', 'Controlling request frequency to prevent abuse, DDoS attacks, and ensure fair resource usage', 'A database optimization', 'Frontend performance metric'],
      correctAnswer: 'Controlling request frequency to prevent abuse, DDoS attacks, and ensure fair resource usage',
      difficulty: 'Hard',
      timeLimit: 45,
    },
    {
      questionText: 'Explain the SOLID principles concept',
      options: ['Physical material property', 'Five design principles for maintainable OOP code: Single responsibility, Open-closed, Liskov substitution, Interface segregation, Dependency inversion', 'Database indexing strategy', 'JSON format specification'],
      correctAnswer: 'Five design principles for maintainable OOP code: Single responsibility, Open-closed, Liskov substitution, Interface segregation, Dependency inversion',
      difficulty: 'Hard',
      timeLimit: 45,
    },
    {
      questionText: 'What is the difference between process and thread?',
      options: ['No difference', 'Process is independent with own memory; thread shares memory within a process', 'Threads always faster', 'Processes are obsolete'],
      correctAnswer: 'Process is independent with own memory; thread shares memory within a process',
      difficulty: 'Hard',
      timeLimit: 45,
    },
    {
      questionText: 'Explain idempotency in API design',
      options: ['Making same request multiple times', 'Making the same API request multiple times produces the same result as once, critical for safe retries', 'A naming convention', 'Database consistency feature'],
      correctAnswer: 'Making the same API request multiple times produces the same result as once, critical for safe retries',
      difficulty: 'Hard',
      timeLimit: 45,
    },
    {
      questionText: 'What is the difference between authentication and authorization?',
      options: ['They are the same', 'Authentication verifies identity; authorization determines permissions', 'Both are frontend concerns', 'Only backend needs authentication'],
      correctAnswer: 'Authentication verifies identity; authorization determines permissions',
      difficulty: 'Hard',
      timeLimit: 45,
    },
    {
      questionText: 'What is a bloom filter and its use case?',
      options: ['A type of flower', 'Probabilistic data structure for efficient membership testing with false positives but no false negatives', 'A filtering algorithm', 'A caching strategy'],
      correctAnswer: 'Probabilistic data structure for efficient membership testing with false positives but no false negatives',
      difficulty: 'Hard',
      timeLimit: 45,
    },
    {
      questionText: 'Explain two-phase commit protocol in distributed systems',
      options: ['Committing twice', 'Protocol for ensuring atomicity in distributed transactions across multiple databases', 'Simple transaction approach', 'A caching mechanism'],
      correctAnswer: 'Protocol for ensuring atomicity in distributed transactions across multiple databases',
      difficulty: 'Hard',
      timeLimit: 45,
    },
    {
      questionText: 'What is the difference between data replication and data partitioning?',
      options: ['No difference', 'Replication copies data across nodes; partitioning splits data into subsets on different nodes', 'Both are same concept', 'Partitioning is outdated'],
      correctAnswer: 'Replication copies data across nodes; partitioning splits data into subsets on different nodes',
      difficulty: 'Hard',
      timeLimit: 45,
    },
    {
      questionText: 'Explain the concept of eventual consistency patterns like Read-your-writes',
      options: ['Writing then reading data', 'Session consistency ensuring reads see all writes from same session even in eventually consistent systems', 'A database feature', 'Frontend caching concept'],
      correctAnswer: 'Session consistency ensuring reads see all writes from same session even in eventually consistent systems',
      difficulty: 'Hard',
      timeLimit: 45,
    },
    {
      questionText: 'What is the purpose of API versioning?',
      options: ['Managing API numbering', 'Maintaining backward compatibility while introducing new API changes', 'A REST convention', 'Database version tracking'],
      correctAnswer: 'Maintaining backward compatibility while introducing new API changes',
      difficulty: 'Hard',
      timeLimit: 45,
    },
    {
      questionText: 'Explain the difference between pull-based and push-based architectures',
      options: ['No difference', 'Pull: clients request data; Push: server sends data to clients proactively', 'Both identical', 'Pull is old approach'],
      correctAnswer: 'Pull: clients request data; Push: server sends data to clients proactively',
      difficulty: 'Hard',
      timeLimit: 45,
    },
    {
      questionText: 'What is the difference between vertical and horizontal data partitioning?',
      options: ['Only direction differs', 'Vertical: split columns, Horizontal: split rows into subsets', 'Both are identical concepts', 'Horizontal partitioning obsolete'],
      correctAnswer: 'Vertical: split columns, Horizontal: split rows into subsets',
      difficulty: 'Hard',
      timeLimit: 45,
    },
    {
      questionText: 'Explain consensus algorithms and their role in distributed systems',
      options: ['Agreement on opinions', 'Algorithms ensuring distributed nodes reach agreement on state (e.g., Raft, Paxos)', 'A voting system', 'Database synchronization'],
      correctAnswer: 'Algorithms ensuring distributed nodes reach agreement on state (e.g., Raft, Paxos)',
      difficulty: 'Hard',
      timeLimit: 45,
    },
  ],
};

// Get MCQ questions based on experience level
export const getMCQquestionsByLevel = (experienceLevel, count = 5) => {
  let questions = mcqQuestionsBank[experienceLevel] || mcqQuestionsBank.Junior;
  let selected = [];
  
  // Shuffle and select random questions
  let shuffled = [...questions].sort(() => 0.5 - Math.random());
  for (let i = 0; i < Math.min(count, shuffled.length); i++) {
    selected.push(shuffled[i]);
  }
  
  return selected;
};

// Question operations
export const createQuestion = (interviewId, questionText, questionType = 'technical', mcqData = null) => {
  const isMCQ = mcqData !== null;
  const question = {
    id: String(mockDatabase.questions.length + 1),
    interviewId,
    questionText,
    questionType: isMCQ ? 'mcq' : questionType,
    difficulty: mcqData?.difficulty || 'Medium',
    expectedKeyPoints: [],
    timeLimit: mcqData?.timeLimit || 120,
    isMCQ: isMCQ,
    mcqOptions: mcqData?.options || [],
    correctAnswer: mcqData?.correctAnswer || null,
    position: mockDatabase.questions.filter((q) => q.interviewId === interviewId).length + 1,
  };

  mockDatabase.questions.push(question);
  return question;
};

export const getInterviewQuestions = (interviewId) => {
  return mockDatabase.questions.filter((q) => q.interviewId === interviewId);
};

// Response operations
export const createResponse = (interviewId, questionId, userId, responseText) => {
  try {
    // Find the question to check if it's MCQ
    let question = mockDatabase.questions.find((q) => q.id === questionId);
    
    let isMCQ = question?.isMCQ || false;
    let isCorrect = null;
    let score = 0;
    
    // Check answer correctness if MCQ
    if (isMCQ && question) {
      isCorrect = responseText?.trim() === question.correctAnswer?.trim();
      score = isCorrect ? 100 : 0;
    } else {
      // For open-ended questions, give partial scores based on length and content
      let trimmedResponse = responseText?.trim() || '';
      let words = trimmedResponse.split(/\s+/).filter((w) => w.length > 0);
      let wordCount = words.length;
      let hasContent = trimmedResponse.length > 20;
      
      if (wordCount > 100 && hasContent) {
        score = 85;
      } else if (wordCount > 50 && hasContent) {
        score = 70;
      } else if (wordCount > 20 && hasContent) {
        score = 50;
      } else {
        score = 25;
      }
    }

    const response = {
      id: String(mockDatabase.responses.length + 1),
      interviewId,
      questionId,
      userId,
      responseText,
      isMCQ,
      isCorrect,
      score: score,
      clarity: isMCQ ? (isCorrect ? 100 : 0) : Math.round(score * 0.9),
      completeness: isMCQ ? (isCorrect ? 100 : 0) : score,
      technicalAccuracy: score,
      confidenceScore: isMCQ ? (isCorrect ? 95 : 20) : score,
      createdAt: new Date(),
    };

    mockDatabase.responses.push(response);
    return response;
  } catch (error) {
    console.error('Error in createResponse:', error);
    throw new Error('Failed to create response');
  }
};

export const getInterviewResponses = (interviewId) => {
  return mockDatabase.responses.filter((r) => r.interviewId === interviewId);
};

// Feedback operations
export const createFeedback = (interviewId, userId) => {
  let responses = getInterviewResponses(interviewId);
  let interview = getInterviewById(interviewId);
  
  let score = 0;
  let clarity = 0;
  let completeness = 0;
  let technical = 0;
  let mcqCorrect = 0;
  let totalMCQ = 0;
  let totalResponses = responses.length;

  if (responses.length > 0) {
    responses.forEach((r) => {
      score += r.score;
      clarity += r.clarity;
      completeness += r.completeness;
      technical += r.technicalAccuracy;
      
      if (r.isMCQ) {
        totalMCQ++;
        if (r.isCorrect) {
          mcqCorrect++;
        }
      }
    });

    const count = responses.length;
    score = Math.round(score / count);
    clarity = Math.round(clarity / count);
    completeness = Math.round(completeness / count);
    technical = Math.round(technical / count);
  }

  // Determine performance level
  let performanceLevel = 'Excellent';
  if (score < 40) {
    performanceLevel = 'Needs Improvement';
  } else if (score < 60) {
    performanceLevel = 'Good';
  } else if (score < 80) {
    performanceLevel = 'Very Good';
  }

  // Generate dynamic feedback
  let strengths = [];
  let weaknesses = [];

  if (technical > 75) strengths.push('Strong technical knowledge');
  else weaknesses.push('Improve technical depth');

  if (clarity > 75) strengths.push('Clear communication');
  else weaknesses.push('Work on clarity of expression');

  if (completeness > 75) strengths.push('Complete answers');
  else weaknesses.push('Provide more detailed responses');

  if (mcqCorrect / Math.max(totalMCQ, 1) > 0.7) {
    strengths.push(`Good MCQ performance (${mcqCorrect}/${totalMCQ} correct)`);
  } else if (totalMCQ > 0) {
    weaknesses.push(`Review MCQ answers (${mcqCorrect}/${totalMCQ} correct)`);
  }

  if (strengths.length === 0) strengths = ['Good effort', 'Room for improvement'];

  const feedback = {
    id: String(mockDatabase.feedback.length + 1),
    interviewId,
    userId,
    communicationScore: clarity,
    technicalScore: technical,
    behavioralScore: completeness,
    overallScore: score,
    performanceLevel,
    totalResponses,
    mcqStats: {
      correct: mcqCorrect,
      total: totalMCQ,
      percentage: totalMCQ > 0 ? Math.round((mcqCorrect / totalMCQ) * 100) : 0,
    },
    strengths: strengths,
    weaknesses: weaknesses,
    overallAnalysis: `Your performance was ${performanceLevel}! You achieved an overall score of ${score}/100.`,
    improvements: [
      'Focus on areas of weakness identified',
      'Practice similar questions regularly',
      'Work on detailed explanations',
    ],
    nextSteps: [
      'Review incorrect MCQ answers',
      'Practice more interviews at similar difficulty level',
      'Study weak topics thoroughly',
    ],
    createdAt: new Date(),
  };

  mockDatabase.feedback.push(feedback);
  return feedback;
};

export const getFeedbackById = (id) => {
  return mockDatabase.feedback.find((f) => f.id === id);
};

export default {
  mockDatabase,
  initializeSampleData,
  findUserByEmail,
  findUserById,
  createUser,
  updateUser,
  createInterview,
  getInterviewById,
  getUserInterviews,
  completeInterview,
  createQuestion,
  getInterviewQuestions,
  createResponse,
  getInterviewResponses,
  createFeedback,
  getFeedbackById,
};
