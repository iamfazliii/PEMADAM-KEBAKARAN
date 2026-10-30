import { ExtinguisherType, FireClass, Scenario } from '../types';
import { EXTINGUISHERS, QUIZ_QUESTIONS } from './extinguisherData';

export interface ScenarioEvaluation {
  isCorrect: boolean;
  isAcceptableAlternative: boolean;
  score: number; // 0, 1, or 2 (bonus for primary)
  title: string;
  feedbackText: string;
  isHazardous: boolean;
}

export function evaluateScenarioAnswer(
  scenario: Scenario,
  chosenExtinguisher: ExtinguisherType
): ScenarioEvaluation {
  const chosenInfo = EXTINGUISHERS[chosenExtinguisher];
  const isPrimary = scenario.correctExtinguisher === chosenExtinguisher;
  const isAlternative = scenario.acceptableAlternative === chosenExtinguisher;

  // Detect hazardous choices:
  // Water on Electrical (Class E) or Oil (Class F or B)
  const isDangerousWater =
    chosenExtinguisher === 'water' && (scenario.fireClass === 'E' || scenario.fireClass === 'B' || scenario.fireClass === 'F');
  // Foam on Electrical (Class E)
  const isDangerousFoam = chosenExtinguisher === 'foam' && scenario.fireClass === 'E';

  if (isPrimary) {
    return {
      isCorrect: true,
      isAcceptableAlternative: false,
      score: 2,
      title: 'TINDAKAN TEPAT & CEMERLANG!',
      feedbackText: `${chosenInfo.name} merupakan pilihan paling optimum untuk situasi ini. ${scenario.explanation}`,
      isHazardous: false
    };
  }

  if (isAlternative) {
    return {
      isCorrect: true,
      isAcceptableAlternative: true,
      score: 1,
      title: 'PILIHAN BOLEH DITERIMA',
      feedbackText: `${chosenInfo.name} boleh digunakan untuk memadamkan punca api ini, namun pilihan yang lebih optimum ialah ${EXTINGUISHERS[scenario.correctExtinguisher].name}. ${scenario.explanation}`,
      isHazardous: false
    };
  }

  if (isDangerousWater || isDangerousFoam) {
    return {
      isCorrect: false,
      isAcceptableAlternative: false,
      score: 0,
      title: 'AMARAN BAHAYA MAUT / TIDAK SESUAI!',
      feedbackText: `Pilihan ${chosenInfo.name} sangat berbahaya! ${scenario.warningNote} Pilihan yang tepat ialah ${EXTINGUISHERS[scenario.correctExtinguisher].name}.`,
      isHazardous: true
    };
  }

  return {
    isCorrect: false,
    isAcceptableAlternative: false,
    score: 0,
    title: 'PILIHAN KURANG TEPAT',
    feedbackText: `${chosenInfo.name} tidak sesuai untuk kelas kebakaran ${scenario.fireClass}. Pilihan selamat dan tepat ialah ${EXTINGUISHERS[scenario.correctExtinguisher].name}. ${scenario.explanation}`,
    isHazardous: false
  };
}

export interface QuizResult {
  score: number;
  total: number;
  percentage: number;
  hasPassed: boolean;
  grade: 'Cemerlang' | 'Kepujian' | 'Lulus' | 'Perlu Mengulang';
  gradeBadgeColor: string;
}

export function calculateQuizScore(answers: Record<number, number>): QuizResult {
  const total = QUIZ_QUESTIONS.length;
  let score = 0;

  QUIZ_QUESTIONS.forEach((q) => {
    if (answers[q.id] === q.correctIndex) {
      score += 1;
    }
  });

  const percentage = Math.round((score / total) * 100);
  const hasPassed = percentage >= 70;

  let grade: 'Cemerlang' | 'Kepujian' | 'Lulus' | 'Perlu Mengulang' = 'Perlu Mengulang';
  let gradeBadgeColor = '#ef4444';

  if (percentage >= 90) {
    grade = 'Cemerlang';
    gradeBadgeColor = '#10b981';
  } else if (percentage >= 70) {
    grade = 'Kepujian';
    gradeBadgeColor = '#06b6d4';
  } else if (percentage >= 50) {
    grade = 'Lulus';
    gradeBadgeColor = '#f59e0b';
  }

  return {
    score,
    total,
    percentage,
    hasPassed,
    grade,
    gradeBadgeColor
  };
}

export function isExtinguisherSuitableForClass(extinguisher: ExtinguisherType, fireClass: FireClass): boolean {
  const data = EXTINGUISHERS[extinguisher];
  return data.classes.includes(fireClass);
}
