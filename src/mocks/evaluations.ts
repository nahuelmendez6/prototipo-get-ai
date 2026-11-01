import { Evaluation, Mistake } from '../types';

/**
 * Generates a realistic simulated AI evaluation based on text input.
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
    // Add default feedback if clean
    sampleMistakes.push({
      id: `mst-${Date.now()}-def`,
      original: words[0] || 'Hello',
      correction: words[0] || 'Hello',
      type: 'style',
      explanation: 'Appropriate register and cohesive sentence opening.',
      impactLevel: 'minor'
    });
  }

  const grammarScore = Math.max(6.5, Math.min(9.5, +(8.5 - sampleMistakes.length * 0.4).toFixed(1)));
  const vocabScore = Math.max(7.0, Math.min(9.5, +(8.2 + (wordCount > 100 ? 0.6 : -0.5)).toFixed(1)));
  const spellingScore = 8.8;
  const coherenceScore = 8.5;
  const taskScore = wordCount >= 100 ? 9.0 : 7.0;
  const overall = +((grammarScore + vocabScore + spellingScore + coherenceScore + taskScore) / 5).toFixed(1);

  return {
    id: `eval-${Date.now()}`,
    submissionId,
    originalText: text,
    correctedText,
    mistakes: sampleMistakes,
    scores: {
      grammar: grammarScore,
      vocabulary: vocabScore,
      spellingPunctuation: spellingScore,
      coherenceCohesion: coherenceScore,
      taskAchievement: taskScore,
      overallGrade: overall
    },
    suggestedOverallGrade: overall,
    generalFeedback: `The essay demonstrates a clear communicative intention with ${wordCount} words. Ideas are structured logically across paragraphs. Key focus points: revise subject-verb agreement and formal vocabulary connectors to elevate the overall lexical level.`,
    recommendations: [
      'Expand connective phrases for smoother transitions between paragraphs (e.g. "Consequently", "On the other hand").',
      'Proofread carefully for subject-verb concord with complex or gerund subjects.',
      'Ensure compliance with the required minimum word count.'
    ],
    aiConfidence: 94,
    reviewedByTeacher: false,
    teacherNotes: 'Evaluación preliminar generada por IA. Pendiente de validación y ajuste docente.',
    updatedAt: new Date().toISOString()
  };
}
