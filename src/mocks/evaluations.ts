import { Evaluation, Mistake } from '../types';

/**
 * Generates a realistic simulated AI evaluation based on text input and Cambridge criteria.
 */
export function generateMockAIEvaluation(submissionId: string, text: string): Evaluation {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const sampleMistakes: Mistake[] = [];
  let correctedText = text;

  // Detect common simulated errors or generate plausible ones
  if (text.toLowerCase().includes('everyday') && !text.toLowerCase().includes('everyday life')) {
    sampleMistakes.push({
      id: `mst-${Date.now()}-1`,
      original: 'everyday',
      correction: 'every day',
      type: 'spelling',
      explanation: 'Use the two-word phrase "every day" as an adverbial time expression. "Everyday" is an adjective.',
      impactLevel: 'minor'
    });
    correctedText = correctedText.replace(/everyday/gi, 'every day');
  }

  if (text.toLowerCase().includes('have many') && (text.toLowerCase().includes('working from home have') || text.toLowerCase().includes('technology have'))) {
    sampleMistakes.push({
      id: `mst-${Date.now()}-2`,
      original: 'have many',
      correction: 'has many',
      type: 'grammar',
      explanation: 'Subject-verb agreement error with singular noun/gerund phrase.',
      impactLevel: 'moderate'
    });
    correctedText = correctedText.replace(/have many/gi, 'has many');
  }

  if (text.toLowerCase().includes("don't must") || text.toLowerCase().includes("doesn't must")) {
    sampleMistakes.push({
      id: `mst-${Date.now()}-3`,
      original: "don't must",
      correction: 'do not have to',
      type: 'grammar',
      explanation: 'Grammar error: In English, negation of obligation uses "do not have to", never "don\'t must".',
      impactLevel: 'major'
    });
    correctedText = correctedText.replace(/don't must/gi, 'do not have to');
  }

  if (text.toLowerCase().includes('for watch') || text.toLowerCase().includes('for to')) {
    sampleMistakes.push({
      id: `mst-${Date.now()}-4`,
      original: 'for watch',
      correction: 'to watch',
      type: 'grammar',
      explanation: 'Infinitive of purpose: Use "to + verb" instead of "for + base form".',
      impactLevel: 'moderate'
    });
    correctedText = correctedText.replace(/for watch/gi, 'to watch');
  }

  if (sampleMistakes.length === 0) {
    sampleMistakes.push({
      id: `mst-${Date.now()}-def`,
      original: words[0] || 'Hello',
      correction: words[0] || 'Hello',
      type: 'style',
      explanation: 'Appropriate register and cohesive sentence opening.',
      impactLevel: 'minor'
    });
  }

  // Cambridge scale (0 to 5) for each criterion
  const contentScore = wordCount >= 120 ? 4.5 : wordCount >= 70 ? 3.5 : 2.5;
  const commScore = wordCount >= 100 ? 4.0 : 3.0;
  const orgScore = 4.0;
  const langScore = Math.max(2.0, Math.min(5.0, +(4.5 - sampleMistakes.length * 0.4).toFixed(1)));

  const totalMarks = +(contentScore + commScore + orgScore + langScore).toFixed(1);
  const overallGrade = +(totalMarks / 2).toFixed(1); // Scaled to / 10

  return {
    id: `eval-${Date.now()}`,
    submissionId,
    originalText: text,
    correctedText,
    mistakes: sampleMistakes,
    scores: {
      content: contentScore,
      communicativeAchievement: commScore,
      organisation: orgScore,
      language: langScore,
      totalMarks,
      overallGrade,
      // Legacy compat
      grammar: +(langScore * 2).toFixed(1),
      vocabulary: +(langScore * 2).toFixed(1),
      spellingPunctuation: 8.5,
      coherenceCohesion: +(orgScore * 2).toFixed(1),
      taskAchievement: +(contentScore * 2).toFixed(1),
    },
    suggestedOverallGrade: overallGrade,
    generalFeedback: `The writing demonstrates a clear communicative intention with ${wordCount} words. Ideas are structured logically across paragraphs. Key focus points: revise subject-verb agreement and formal vocabulary connectors to elevate the overall lexical level according to Cambridge marking standards.`,
    recommendations: [
      'Expand connective phrases for smoother transitions between paragraphs (e.g. "Consequently", "On the other hand").',
      'Proofread carefully for subject-verb concord with complex or gerund subjects.',
      'Ensure compliance with the required minimum word count.'
    ],
    aiConfidence: 94,
    reviewedByTeacher: false,
    teacherNotes: 'Preliminary AI evaluation. Pending teacher review and grading validation.',
    updatedAt: new Date().toISOString()
  };
}
