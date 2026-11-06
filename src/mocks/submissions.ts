import { Submission } from '../types';

// Handwritten notebook mockup SVG as data URL
const HANDWRITTEN_SAMPLE_SVG_1 = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1100" viewBox="0 0 800 1100" style="background:%23faf8f2;font-family:'Caveat', 'Segoe Script', cursive, sans-serif;">
  <defs>
    <pattern id="lines" width="100" height="32" patternUnits="userSpaceOnUse">
      <line x1="0" y1="31" x2="100" y2="31" stroke="%23d6e2e9" stroke-width="1.5" />
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="%23fdfbf7" />
  <rect x="60" y="40" width="700" height="1020" fill="url(%23lines)" />
  <line x1="120" y1="40" x2="120" y2="1060" stroke="%23fca5a5" stroke-width="2" />
  
  <text x="140" y="70" font-size="22" font-weight="bold" fill="%231e3a8a">Carlos Gomez - FCE B2 Essay</text>
  <text x="560" y="70" font-size="16" fill="%2364748b">Date: 28/10/2026</text>
  
  <text x="140" y="135" font-size="20" fill="%231e293b">Nowadays, remote working is becoming more popular everyday.</text>
  <text x="140" y="167" font-size="20" fill="%231e293b">In my opinion, working from home have many positive aspects,</text>
  <text x="140" y="199" font-size="20" fill="%231e293b">although it also brings some serious disadvantages for workers.</text>
  <text x="140" y="231" font-size="20" fill="%231e293b">Firstly, people save a lot of time because they don't must commute</text>
  <text x="140" y="263" font-size="20" fill="%231e293b">to the office in crowded trains. This allow them to spend more</text>
  <text x="140" y="295" font-size="20" fill="%231e293b">valuable time with their families and avoid unnecessary stress.</text>
  
  <text x="140" y="359" font-size="20" fill="%231e293b">On the other hand, workers can feel isolated from their colleagues.</text>
  <text x="140" y="391" font-size="20" fill="%231e293b">Communication is often slow, and it is more difficult to create a</text>
  <text x="140" y="423" font-size="20" fill="%231e293b">strong teamwork culture when people don't see each other face to face.</text>
  
  <text x="140" y="487" font-size="20" fill="%231e293b">To conclude, despite the lack of social interaction, I truly believe</text>
  <text x="140" y="519" font-size="20" fill="%231e293b">that flexible hybrid models are the best solution for modern society.</text>
</svg>`;

const HANDWRITTEN_SAMPLE_SVG_2 = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="950" viewBox="0 0 800 950" style="background:%23faf8f2;font-family:'Caveat', 'Segoe Script', cursive, sans-serif;">
  <defs>
    <pattern id="lines2" width="100" height="32" patternUnits="userSpaceOnUse">
      <line x1="0" y1="31" x2="100" y2="31" stroke="%23e2e8f0" stroke-width="1.5" />
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="%23fffdfa" />
  <rect x="50" y="40" width="700" height="880" fill="url(%23lines2)" />
  <line x1="110" y1="40" x2="110" y2="920" stroke="%23f87171" stroke-width="1.5" />
  
  <text x="130" y="70" font-size="22" font-weight="bold" fill="%23334155">Sofia Rossi - Cambridge B2</text>
  <text x="560" y="70" font-size="16" fill="%2364748b">Date: 29/10/2026</text>
  
  <text x="130" y="135" font-size="20" fill="%231e293b">Working from home is a topic that divide opinions across the world.</text>
  <text x="130" y="167" font-size="20" fill="%231e293b">There are several benefits, like flexible schedules and no traffic.</text>
  <text x="130" y="199" font-size="20" fill="%231e293b">However, many employees complaints about working extra hours.</text>
  <text x="130" y="231" font-size="20" fill="%231e293b">In conclusion, I think companies should find a good balance.</text>
</svg>`;

export const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: 'sub-1',
    assignmentId: 'asg-1',
    assignmentTitle: 'FCE Essay: Advantages and Disadvantages of Remote Working',
    courseId: 'course-1',
    courseName: 'Cambridge B2 First (FCE) - Preparation',
    studentId: 'user-student-1',
    studentName: 'Carlos Gómez',
    studentEmail: 'student@demo.com',
    studentAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    submissionType: 'handwritten',
    imageUrl: HANDWRITTEN_SAMPLE_SVG_1,
    extractedText: `Nowadays, remote working is becoming more popular everyday. In my opinion, working from home have many positive aspects, although it also brings some serious disadvantages for workers.

Firstly, people save a lot of time because they don't must commute to the office in crowded trains. This allow them to spend more valuable time with their families and avoid unnecessary stress.

On the other hand, workers can feel isolated from their colleagues. Communication is often slow, and it is more difficult to create a strong teamwork culture when people don't see each other face to face.

To conclude, despite the lack of social interaction, I truly believe that flexible hybrid models are the best solution for modern society.`,
    originalText: `Nowadays, remote working is becoming more popular everyday. In my opinion, working from home have many positive aspects, although it also brings some serious disadvantages for workers.

Firstly, people save a lot of time because they don't must commute to the office in crowded trains. This allow them to spend more valuable time with their families and avoid unnecessary stress.

On the other hand, workers can feel isolated from their colleagues. Communication is often slow, and it is more difficult to create a strong teamwork culture when people don't see each other face to face.

To conclude, despite the lack of social interaction, I truly believe that flexible hybrid models are the best solution for modern society.`,
    wordCount: 154,
    submittedAt: '2026-10-28T16:20:00Z',
    status: 'PENDING_REVIEW', // Ready for teacher to review and approve
    evaluation: {
      id: 'eval-1',
      submissionId: 'sub-1',
      originalText: `Nowadays, remote working is becoming more popular everyday. In my opinion, working from home have many positive aspects, although it also brings some serious disadvantages for workers.

Firstly, people save a lot of time because they don't must commute to the office in crowded trains. This allow them to spend more valuable time with their families and avoid unnecessary stress.

On the other hand, workers can feel isolated from their colleagues. Communication is often slow, and it is more difficult to create a strong teamwork culture when people don't see each other face to face.

To conclude, despite the lack of social interaction, I truly believe that flexible hybrid models are the best solution for modern society.`,
      correctedText: `Nowadays, remote working is becoming more popular every day. In my opinion, working from home has many positive aspects, although it also brings some serious disadvantages for workers.

Firstly, people save a lot of time because they do not have to commute to the office in crowded trains. This allows them to spend more valuable time with their families and avoid unnecessary stress.

On the other hand, workers can feel isolated from their colleagues. Communication is often slow, and it is more difficult to create a strong teamwork culture when people do not see each other face-to-face.

To conclude, despite the lack of social interaction, I truly believe that flexible hybrid models are the best solution for modern society.`,
      mistakes: [
        {
          id: 'mst-1',
          original: 'everyday',
          correction: 'every day',
          type: 'spelling',
          explanation: '"Everyday" is an adjective meaning ordinary or daily (e.g., everyday life). Use the two-word adverbial phrase "every day" when describing frequency.',
          impactLevel: 'minor'
        },
        {
          id: 'mst-2',
          original: 'working from home have',
          correction: 'working from home has',
          type: 'grammar',
          explanation: 'Subject-verb agreement: The gerund subject phrase "working from home" is singular and requires the 3rd person singular verb "has".',
          impactLevel: 'moderate'
        },
        {
          id: 'mst-3',
          original: "don't must",
          correction: 'do not have to',
          type: 'grammar',
          explanation: 'Modal verb error: "Must" cannot be negated with "don\'t". To express lack of obligation in English, use "do not have to". Also, avoid contractions in formal FCE essays.',
          impactLevel: 'major'
        },
        {
          id: 'mst-4',
          original: 'This allow',
          correction: 'This allows',
          type: 'grammar',
          explanation: 'Subject-verb agreement: The demonstrative pronoun "This" is singular, so the verb requires 3rd person singular "-s" ("allows").',
          impactLevel: 'minor'
        },
        {
          id: 'mst-5',
          original: "don't see",
          correction: 'do not see',
          type: 'style',
          explanation: 'In Cambridge B2 academic essays, full forms ("do not") are strongly preferred over colloquial contractions ("don\'t").',
          impactLevel: 'minor'
        },
        {
          id: 'mst-6',
          original: 'face to face',
          correction: 'face-to-face',
          type: 'punctuation',
          explanation: 'Compound adverbial or adjectival expression should be hyphenated as "face-to-face".',
          impactLevel: 'minor'
        }
      ],
      scores: {
        content: 4.5,
        communicativeAchievement: 4.0,
        organisation: 4.0,
        language: 4.0,
        totalMarks: 16.5,
        overallGrade: 8.3,
        grammar: 7.5,
        vocabulary: 8.5,
        spellingPunctuation: 8.0,
        coherenceCohesion: 8.5,
        taskAchievement: 9.0,
      },
      suggestedOverallGrade: 8.3,
      generalFeedback: `Very solid B2 essay structure with well-organized paragraphs and clear topic sentences. Your arguments on work-life balance and team isolation are convincing and directly answer the prompt.

Key areas to refine:
1. Pay closer attention to subject-verb agreement with singular subjects (gerunds and demonstratives).
2. Practice modal verb negation: remember that "don't must" is grammatically invalid in English; use "don't have to" or "do not have to".
3. Maintain a formal register by avoiding informal contractions like "don't".`,
      recommendations: [
        'Review modal verbs of obligation and absence of obligation (must vs have to vs need to).',
        'Revise subject-verb agreement rules when clauses begin with gerunds (e.g. "Eating vegetables is...", "Studying languages helps...").',
        'Perform a final proofreading pass specifically checking for informal contractions in Cambridge B2/C1 essays.'
      ],
      aiConfidence: 95,
      reviewedByTeacher: false,
      teacherNotes: 'Strong attempt by Carlos. AI criteria suggestions match FCE Band 4/5 descriptors, especially regarding "don\'t must".',
      updatedAt: '2026-10-28T16:22:15Z'
    }
  },
  {
    id: 'sub-2',
    assignmentId: 'asg-3',
    assignmentTitle: 'Formal Email: Hotel Service Complaint',
    courseId: 'course-3',
    courseName: 'General Intermediate English (B1 Preliminary)',
    studentId: 'user-student-1',
    studentName: 'Carlos Gómez',
    studentEmail: 'student@demo.com',
    studentAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    submissionType: 'virtual',
    extractedText: `Dear Hotel Manager,

I am writing to express my dissatisfaction with my recent stay at the Grand Regency Hotel from October 12th to October 14th (Room 304).

Unfortunately, my experience was far below expectations. The room was extremely noisy during both nights due to ongoing construction work. Furthermore, the Wi-Fi connection was completely down, which prevented me from attending an important business video conference. To make matters worse, breakfast was unavailable on Sunday morning.

Given these circumstances, I would appreciate a partial refund for the inconvenience caused. I look forward to your prompt response.

Yours sincerely,
Carlos Gomez`,
    originalText: `Dear Hotel Manager,

I am writing to express my dissatisfaction with my recent stay at the Grand Regency Hotel from October 12th to October 14th (Room 304).

Unfortunately, my experience was far below expectations. The room was extremely noisy during both nights due to ongoing construction work. Furthermore, the Wi-Fi connection was completely down, which prevented me from attending an important business video conference. To make matters worse, breakfast was unavailable on Sunday morning.

Given these circumstances, I would appreciate a partial refund for the inconvenience caused. I look forward to your prompt response.

Yours sincerely,
Carlos Gomez`,
    wordCount: 118,
    submittedAt: '2026-10-22T11:15:00Z',
    status: 'PUBLISHED',
    evaluation: {
      id: 'eval-2',
      submissionId: 'sub-2',
      originalText: `Dear Hotel Manager, ...`,
      correctedText: `Dear Hotel Manager,

I am writing to express my dissatisfaction with my recent stay at the Grand Regency Hotel from October 12th to October 14th (Room 304).

Unfortunately, my experience was far below expectations. The room was extremely noisy during both nights due to ongoing construction work. Furthermore, the Wi-Fi connection was completely down, which prevented me from attending an important business video conference. To make matters worse, breakfast was unavailable on Sunday morning.

Given these circumstances, I would appreciate a partial refund for the inconvenience caused. I look forward to your prompt response.

Yours sincerely,
Carlos Gomez`,
      mistakes: [
        {
          id: 'mst-201',
          original: 'Dear Hotel Manager',
          correction: 'Dear Hotel Manager, / Dear Sir or Madam,',
          type: 'style',
          explanation: 'In formal British English letters when the recipient name is unknown, "Dear Sir or Madam," is standard, followed by "Yours faithfully," instead of "Yours sincerely,".',
          impactLevel: 'minor'
        }
      ],
      scores: {
        content: 5.0,
        communicativeAchievement: 4.5,
        organisation: 4.5,
        language: 4.8,
        totalMarks: 18.8,
        overallGrade: 9.4,
        grammar: 9.5,
        vocabulary: 9.0,
        spellingPunctuation: 9.5,
        coherenceCohesion: 9.5,
        taskAchievement: 9.5,
      },
      suggestedOverallGrade: 9.2,
      generalFeedback: `Excellent work Carlos! This is an exemplary formal complaint email. Your tone is polite, assertive, and professional. The use of connectors ("Furthermore", "To make matters worse", "Given these circumstances") is accurate and natural.`,
      recommendations: [
        'Remember the convention: If starting with "Dear Sir or Madam" (name unknown), close with "Yours faithfully". If using the person\'s surname ("Dear Mr. Smith"), close with "Yours sincerely".',
        'Keep expanding your formal correspondence phrase bank for B2 preparation.'
      ],
      aiConfidence: 98,
      reviewedByTeacher: true,
      teacherNotes: 'Exemplary production. Approved without substantial modifications. Final grade: 9.4.',
      approvedAt: '2026-10-23T14:00:00Z',
      publishedAt: '2026-10-23T14:05:00Z',
      updatedAt: '2026-10-23T14:05:00Z'
    }
  },
  {
    id: 'sub-3',
    assignmentId: 'asg-1',
    assignmentTitle: 'FCE Essay: Advantages and Disadvantages of Remote Working',
    courseId: 'course-1',
    courseName: 'Cambridge B2 First (FCE) - Preparation',
    studentId: 'user-student-2',
    studentName: 'Sofía Rossi',
    studentEmail: 'sofia.rossi@students.edu',
    studentAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    submissionType: 'handwritten',
    imageUrl: HANDWRITTEN_SAMPLE_SVG_2,
    extractedText: `Working from home is a topic that divide opinions across the world. There are several benefits, like flexible schedules and no traffic. However, many employees complaints about working extra hours. In conclusion, I think companies should find a good balance.`,
    originalText: `Working from home is a topic that divide opinions across the world. There are several benefits, like flexible schedules and no traffic. However, many employees complaints about working extra hours. In conclusion, I think companies should find a good balance.`,
    wordCount: 42,
    submittedAt: '2026-10-29T18:00:00Z',
    status: 'SUBMITTED', // Ready to simulate AI processing
  },
  {
    id: 'sub-4',
    assignmentId: 'asg-2',
    assignmentTitle: 'Film Review: An Unforgettable Cinema Experience',
    courseId: 'course-1',
    courseName: 'Cambridge B2 First (FCE) - Preparation',
    studentId: 'user-student-3',
    studentName: 'Mateo Benítez',
    studentEmail: 'mateo.benitez@students.edu',
    studentAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    submissionType: 'virtual',
    extractedText: `Yesterday I went to cinema for watch the new Sci-Fi movie "Interstellar Journey". The film was directed by an extraordinary director and the special effects was incredible. However, the plot had some confusing scenes. The soundtrack created a tense atmosphere throughout the whole movie. I strongly recommend this film to fans of science fiction.`,
    originalText: `Yesterday I went to cinema for watch the new Sci-Fi movie "Interstellar Journey". The film was directed by an extraordinary director and the special effects was incredible. However, the plot had some confusing scenes. The soundtrack created a tense atmosphere throughout the whole movie. I strongly recommend this film to fans of science fiction.`,
    wordCount: 56,
    submittedAt: '2026-10-30T10:45:00Z',
    status: 'NEEDS_REVISION',
    evaluation: {
      id: 'eval-4',
      submissionId: 'sub-4',
      originalText: `Yesterday I went to cinema for watch the new Sci-Fi movie "Interstellar Journey"...`,
      correctedText: `Yesterday I went to the cinema to watch the new Sci-Fi film "Interstellar Journey". The film was directed by an extraordinary director and the special effects were incredible. However, the plot had some confusing scenes. The soundtrack created a tense atmosphere throughout the whole film. I strongly recommend this film to fans of science fiction.`,
      mistakes: [
        {
          id: 'mst-401',
          original: 'went to cinema',
          correction: 'went to the cinema',
          type: 'grammar',
          explanation: 'Definite article missing: Use "the cinema" when referring to the cinema as an activity or venue.',
          impactLevel: 'minor'
        },
        {
          id: 'mst-402',
          original: 'for watch',
          correction: 'to watch',
          type: 'grammar',
          explanation: 'Infinitive of purpose: In English, express purpose with "to + infinitive" ("to watch"), never "for + bare infinitive".',
          impactLevel: 'moderate'
        },
        {
          id: 'mst-403',
          original: 'special effects was',
          correction: 'special effects were',
          type: 'grammar',
          explanation: 'Subject-verb agreement: "Effects" is plural, requiring "were".',
          impactLevel: 'minor'
        }
      ],
      scores: {
        content: 3.0,
        communicativeAchievement: 3.5,
        organisation: 3.5,
        language: 3.5,
        totalMarks: 13.5,
        overallGrade: 6.8,
        grammar: 6.5,
        vocabulary: 7.0,
        spellingPunctuation: 8.0,
        coherenceCohesion: 7.0,
        taskAchievement: 5.5,
      },
      suggestedOverallGrade: 6.8,
      generalFeedback: 'Good start with appropriate review vocabulary. However, your review is only 56 words, which is well below the minimum requirement of 150 words. Please expand your analysis of the actors\' performances and the plot.',
      recommendations: [
        'Expand word count to meet Cambridge FCE requirements (150-200 words).',
        'Review the infinitive of purpose (to + verb vs for + noun/gerund).'
      ],
      aiConfidence: 94,
      reviewedByTeacher: true,
      teacherNotes: 'Requires student revision due to not reaching the required minimum word count.',
      updatedAt: '2026-10-30T15:00:00Z'
    }
  },
  {
    id: 'sub-5',
    assignmentId: 'asg-4',
    assignmentTitle: 'Academic Article: Artificial Intelligence in Higher Education',
    courseId: 'course-2',
    courseName: 'Cambridge C1 Advanced (CAE) - Writing Masterclass',
    studentId: 'user-student-4',
    studentName: 'Elena Álvarez',
    studentEmail: 'elena.alvarez@students.edu',
    studentAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    submissionType: 'virtual',
    extractedText: `The proliferation of artificial intelligence in higher education has ignited intense debate among educators and policymakers alike. While skeptics voice valid concerns regarding academic dishonesty, it would be short-sighted to dismiss the transformative potential of these cognitive technologies.

First and foremost, AI-driven adaptive platforms can provide personalized learning trajectories tailored to each student's pace and cognitive style. Far from rendering educators obsolete, this technological shift allows professors to transition from information providers to mentors and critical thinking facilitators.

Nevertheless, institutional safeguards remain essential. Academic integrity cannot be compromised, and universities must formulate clear ethical frameworks.

In conclusion, higher education must embrace artificial intelligence proactively rather than resist it fruitlessly.`,
    originalText: `The proliferation of artificial intelligence in higher education has ignited intense debate among educators and policymakers alike. While skeptics voice valid concerns regarding academic dishonesty, it would be short-sighted to dismiss the transformative potential of these cognitive technologies.

First and foremost, AI-driven adaptive platforms can provide personalized learning trajectories tailored to each student's pace and cognitive style. Far from rendering educators obsolete, this technological shift allows professors to transition from information providers to mentors and critical thinking facilitators.

Nevertheless, institutional safeguards remain essential. Academic integrity cannot be compromised, and universities must formulate clear ethical frameworks.

In conclusion, higher education must embrace artificial intelligence proactively rather than resist it fruitlessly.`,
    wordCount: 146,
    submittedAt: '2026-10-31T09:30:00Z',
    status: 'PUBLISHED',
    evaluation: {
      id: 'eval-5',
      submissionId: 'sub-5',
      originalText: `The proliferation of artificial intelligence...`,
      correctedText: `The proliferation of artificial intelligence in higher education has ignited intense debate among educators and policymakers alike. While skeptics voice valid concerns regarding academic dishonesty, it would be short-sighted to dismiss the transformative potential of these cognitive technologies.

First and foremost, AI-driven adaptive platforms can provide personalized learning trajectories tailored to each student's pace and cognitive style. Far from rendering educators obsolete, this technological shift allows professors to transition from information providers to mentors and critical thinking facilitators.

Nevertheless, institutional safeguards remain essential. Academic integrity cannot be compromised, and universities must formulate clear ethical frameworks.

In conclusion, higher education must embrace artificial intelligence proactively rather than resist it fruitlessly.`,
      mistakes: [],
      scores: {
        content: 5.0,
        communicativeAchievement: 5.0,
        organisation: 4.8,
        language: 5.0,
        totalMarks: 19.8,
        overallGrade: 9.9,
        grammar: 9.8,
        vocabulary: 9.9,
        spellingPunctuation: 10.0,
        coherenceCohesion: 9.6,
        taskAchievement: 9.7,
      },
      suggestedOverallGrade: 9.9,
      generalFeedback: `Outstanding C1 writing piece. Sophisticated vocabulary ("proliferation", "ignited intense debate", "transformative potential", "obsolete"). Clear paragraph cohesion and impeccable formal register.`,
      recommendations: [
        'Consistently maintain this high standard for the upcoming Cambridge CAE examination.'
      ],
      aiConfidence: 99,
      reviewedByTeacher: true,
      teacherNotes: 'Exceptional work by Elena. Meets all Band 5 descriptors for CAE.',
      approvedAt: '2026-10-31T12:00:00Z',
      publishedAt: '2026-10-31T12:10:00Z',
      updatedAt: '2026-10-31T12:10:00Z'
    }
  }
];
