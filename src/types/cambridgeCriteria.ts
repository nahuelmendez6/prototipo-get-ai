export type CambridgeExam = 'FCE' | 'CAE';

export type CambridgeCriterionKey = 'content' | 'communicativeAchievement' | 'organisation' | 'language';

export interface BandDescriptor {
  score: number;
  description: string;
}

export interface CriterionDefinition {
  key: CambridgeCriterionKey;
  name: string;
  shortName: string;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  description: string;
  bands: {
    5: string;
    3: string;
    1: string;
  };
}

export const CAMBRIDGE_CRITERIA: Record<CambridgeExam, Record<CambridgeCriterionKey, CriterionDefinition>> = {
  CAE: {
    content: {
      key: 'content',
      name: 'Content',
      shortName: 'Content',
      color: 'bg-emerald-600',
      badgeBg: 'bg-emerald-50 text-emerald-800',
      badgeBorder: 'border-emerald-200',
      description: 'Focuses on how well the candidate has fulfilled the task, in other words, if they have done what they were asked to do.',
      bands: {
        5: 'Task fully answered with support and solution, all ideas relevant to task.',
        3: 'Task fully answered with support, ideas relevant to task.',
        1: 'Misinterpretation and minimum information, task not complete.'
      }
    },
    communicativeAchievement: {
      key: 'communicativeAchievement',
      name: 'Communicative Achievement',
      shortName: 'Comm. Achievement',
      color: 'bg-indigo-600',
      badgeBg: 'bg-indigo-50 text-indigo-800',
      badgeBorder: 'border-indigo-200',
      description: 'Focuses on how appropriate the writing is for the task and whether the candidate has used the appropriate register.',
      bands: {
        5: 'Communicates complex ideas effectively and with ease.',
        3: "Communicates complex and straightforward ideas appropriately. Handwriting clear, style and register (eg formal, persuasive, friendly) appropriate to task. Uses conventions of type of task to hold TR's attention.",
        1: 'Communicates straightforward ideas.'
      }
    },
    organisation: {
      key: 'organisation',
      name: 'Organisation',
      shortName: 'Organisation',
      color: 'bg-sky-600',
      badgeBg: 'bg-sky-50 text-sky-800',
      badgeBorder: 'border-sky-200',
      description: 'Focuses on the way the candidate puts together the piece of writing, in other words, if it is logical and ordered.',
      bands: {
        5: 'Well organised, coherent, using a variety of linkers and cohesive devices appropriately and easily.',
        3: 'Organised, coherent, uses a variety of linkers and cohesive devices, layout appropriate to type of writing. Punctuation appropriate and clear.',
        1: 'Text is generally well organised, uses linking words and cohesive devices with some repetition.'
      }
    },
    language: {
      key: 'language',
      name: 'Language',
      shortName: 'Language',
      color: 'bg-amber-600',
      badgeBg: 'bg-amber-50 text-amber-800',
      badgeBorder: 'border-amber-200',
      description: 'Focuses on vocabulary and grammar, including the range of language and precision.',
      bands: {
        5: 'Uses a variety of sophisticated grammar and vocabulary, errors are slips.',
        3: 'Less common vocabulary used appropriately, uses a variety of simple and complex grammar with control. Spelling accurate.',
        1: 'Everyday vocabulary used appropriately, attempts less common vocabulary and grammar, errors do not impede communication.'
      }
    }
  },
  FCE: {
    content: {
      key: 'content',
      name: 'Content',
      shortName: 'Content',
      color: 'bg-emerald-600',
      badgeBg: 'bg-emerald-50 text-emerald-800',
      badgeBorder: 'border-emerald-200',
      description: 'Focuses on task fulfillment and informing the Target Reader (TR).',
      bands: {
        5: 'Answers question and supports ideas, TR fully informed, all parts of task included and relevant to task',
        3: 'Answers question with some support, TR on the whole informed, all parts of task included.',
        1: 'misinterpretations present, TR minimally informed, parts of task missing.'
      }
    },
    communicativeAchievement: {
      key: 'communicativeAchievement',
      name: 'Communicative Achievement',
      shortName: 'Comm. Achievement',
      color: 'bg-indigo-600',
      badgeBg: 'bg-indigo-50 text-indigo-800',
      badgeBorder: 'border-indigo-200',
      description: 'Focuses on clarity, handwriting, register, and holding the Target Reader attention.',
      bands: {
        5: 'Communicates straightforward and complex ideas appropriately.',
        3: 'Communicates straightforward ideas, easy to follow. Handwriting clear, style and register leg formal letter or review) appropriate to task.',
        1: 'Communicates basic ideas, not very easy to follow.'
      }
    },
    organisation: {
      key: 'organisation',
      name: 'Organisation',
      shortName: 'Organisation',
      color: 'bg-sky-600',
      badgeBg: 'bg-sky-50 text-sky-800',
      badgeBorder: 'border-sky-200',
      description: 'Focuses on cohesive devices, paragraphing, and structural patterns.',
      bands: {
        5: 'Organised, coherent, uses a variety of linkers, devices and organizational patterns, layout and paragraphing appropriate to type of writing.',
        3: 'Organised, coherent, uses some linkers and cohesive devices, appropriate to task, layout, paragraphing and punctuation appropriate to type of writing.',
        1: 'Uses only basic linkers (and, but), and/or not appropriate to the task.'
      }
    },
    language: {
      key: 'language',
      name: 'Language',
      shortName: 'Language',
      color: 'bg-amber-600',
      badgeBg: 'bg-amber-50 text-amber-800',
      badgeBorder: 'border-amber-200',
      description: 'Focuses on control of simple and complex grammar, range of vocabulary, and spelling accuracy.',
      bands: {
        5: 'Less common vocabulary used appropriately, uses simple and complex grammar with control.',
        3: 'Everyday vocabulary used appropriately, attempts less common vocabulary and grammar, errors do not impede communication. Spelling accurate.',
        1: 'Noticeable errors, although the reader can understand, repetition of language.'
      }
    }
  }
};

/**
 * Returns the relevant Cambridge exam type ('CAE' or 'FCE') based on CEFR level or exam string.
 */
export function getExamTypeFromLevel(cefrLevel?: string): CambridgeExam {
  if (!cefrLevel) return 'FCE';
  const upper = cefrLevel.toUpperCase();
  if (upper === 'C1' || upper === 'C2' || upper.includes('CAE') || upper.includes('ADVANCED')) {
    return 'CAE';
  }
  return 'FCE';
}

/**
 * Get band description for a given score (0 to 5)
 */
export function getBandDescription(exam: CambridgeExam, criterionKey: CambridgeCriterionKey, score: number): string {
  const crit = CAMBRIDGE_CRITERIA[exam][criterionKey];
  if (!crit) return '';

  if (score >= 4.5) {
    return crit.bands[5];
  } else if (score >= 3.5) {
    return `Band 4: Performance shares features of Band 3 and Band 5.`;
  } else if (score >= 2.5) {
    return crit.bands[3];
  } else if (score >= 1.5) {
    return `Band 2: Performance shares features of Band 1 and Band 3.`;
  } else if (score >= 0.5) {
    return crit.bands[1];
  } else {
    return 'Band 0: Below Band 1 / Content not attempted or totally unreadable.';
  }
}
