import { Assignment } from '../types';

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-1',
    courseId: 'course-1',
    courseName: 'Cambridge B2 First (FCE) - Preparation',
    teacherId: 'user-teacher-1',
    teacherName: 'Prof. Laura Morales',
    title: 'FCE Essay: Advantages and Disadvantages of Remote Working',
    description: 'Write an opinion essay analyzing the impact of working from home on employees and companies.',
    instructions: `In your English class, you have been talking about modern work trends. Now your English teacher has asked you to write an essay.

Write an essay using all the notes and give reasons for your point of view:
Is remote working beneficial for both employees and companies?

Notes:
1. Work-life balance and commuting time
2. Communication and teamwork
3. (Your own idea)

Write your essay in 140 - 190 words in an appropriate formal style.`,
    writingType: 'Essay',
    cefrLevel: 'B2',
    minWords: 140,
    maxWords: 190,
    dueDate: '2026-11-15',
    rubric: {
      contentWeight: 25,
      communicativeAchievementWeight: 25,
      organisationWeight: 25,
      languageWeight: 25,
      examType: 'FCE',
      grammarWeight: 20,
      vocabularyWeight: 20,
      spellingPunctuationWeight: 20,
      coherenceCohesionWeight: 20,
      taskAchievementWeight: 20,
      customGuidelines: 'Focus on linking words (Furthermore, On the other hand, Consequently) and modal verbs of obligation.'
    },
    status: 'active',
    createdAt: '2026-10-25T10:00:00Z',
  },
  {
    id: 'asg-2',
    courseId: 'course-1',
    courseName: 'Cambridge B2 First (FCE) - Preparation',
    teacherId: 'user-teacher-1',
    teacherName: 'Prof. Laura Morales',
    title: 'Film Review: An Unforgettable Cinema Experience',
    description: 'Write an engaging review for a student magazine evaluating a recently watched movie.',
    instructions: `You see this announcement in an international student magazine:

"Have you watched an exceptional or disappointing movie recently? Write a review telling us about the plot without giving away spoilers, evaluate the actors' performances, and explain whether you would recommend it to other young adults."

Write your review in 150 - 200 words. Use descriptive adjectives and structured paragraphs.`,
    writingType: 'Review',
    cefrLevel: 'B2',
    minWords: 150,
    maxWords: 200,
    dueDate: '2026-11-20',
    rubric: {
      contentWeight: 25,
      communicativeAchievementWeight: 25,
      organisationWeight: 25,
      languageWeight: 25,
      examType: 'FCE',
      grammarWeight: 20,
      vocabularyWeight: 25,
      spellingPunctuationWeight: 15,
      coherenceCohesionWeight: 20,
      taskAchievementWeight: 20,
      customGuidelines: 'Check for varied descriptive adjectives (gripping, tedious, breathtaking).'
    },
    status: 'active',
    createdAt: '2026-10-28T14:30:00Z',
  },
  {
    id: 'asg-3',
    courseId: 'course-3',
    courseName: 'General Intermediate English (B1 Preliminary)',
    teacherId: 'user-teacher-2',
    teacherName: 'Prof. David Miller',
    title: 'Formal Email: Hotel Service Complaint',
    description: 'Write a polite but firm complaint email to a hotel customer service manager regarding a disappointing stay.',
    instructions: `You recently stayed at the Grand Regency Hotel during a weekend trip. Several things went wrong: the room was noisy, the Wi-Fi did not work, and the breakfast buffet was not available.

Write an email to the hotel manager explaining:
- The details of your stay (dates and room number)
- The specific problems you encountered
- What compensation or resolution you expect

Write 100 - 130 words in an appropriate semi-formal tone.`,
    writingType: 'Email',
    cefrLevel: 'B1',
    minWords: 100,
    maxWords: 130,
    dueDate: '2026-11-10',
    rubric: {
      contentWeight: 25,
      communicativeAchievementWeight: 25,
      organisationWeight: 25,
      languageWeight: 25,
      examType: 'FCE',
      grammarWeight: 25,
      vocabularyWeight: 20,
      spellingPunctuationWeight: 20,
      coherenceCohesionWeight: 20,
      taskAchievementWeight: 15,
      customGuidelines: 'Check correct email opening and closing formulas (Dear Mr./Ms., Yours sincerely).'
    },
    status: 'active',
    createdAt: '2026-10-20T09:00:00Z',
  },
  {
    id: 'asg-4',
    courseId: 'course-2',
    courseName: 'Cambridge C1 Advanced (CAE) - Writing Masterclass',
    teacherId: 'user-teacher-1',
    teacherName: 'Prof. Laura Morales',
    title: 'Academic Article: Artificial Intelligence in Higher Education',
    description: 'Critical analysis of opportunities and ethical risks in university environments.',
    instructions: `Write an article for an educational journal evaluating how generative AI is transforming evaluation methods in universities. Consider academic integrity, personalized learning, and the future role of educators.

Write 220 - 260 words using advanced lexical resources and inversions/cleft sentences.`,
    writingType: 'Article',
    cefrLevel: 'C1',
    minWords: 220,
    maxWords: 260,
    dueDate: '2026-11-25',
    rubric: {
      contentWeight: 25,
      communicativeAchievementWeight: 25,
      organisationWeight: 25,
      languageWeight: 25,
      examType: 'CAE',
      grammarWeight: 25,
      vocabularyWeight: 25,
      spellingPunctuationWeight: 15,
      coherenceCohesionWeight: 20,
      taskAchievementWeight: 15,
      customGuidelines: 'Expect C1 sophisticated structures (e.g., Not only did..., It is argued that...).'
    },
    status: 'active',
    createdAt: '2026-10-29T16:00:00Z',
  }
];
