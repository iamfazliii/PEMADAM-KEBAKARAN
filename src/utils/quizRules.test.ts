import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateScenarioAnswer, calculateQuizScore, isExtinguisherSuitableForClass } from './quizRules';
import { SCENARIOS, QUIZ_QUESTIONS } from './extinguisherData';

test('isExtinguisherSuitableForClass correctly checks fire classifications', () => {
  assert.equal(isExtinguisherSuitableForClass('water', 'A'), true);
  assert.equal(isExtinguisherSuitableForClass('water', 'B'), false);
  assert.equal(isExtinguisherSuitableForClass('water', 'E'), false);

  assert.equal(isExtinguisherSuitableForClass('foam', 'A'), true);
  assert.equal(isExtinguisherSuitableForClass('foam', 'B'), true);
  assert.equal(isExtinguisherSuitableForClass('foam', 'E'), false);

  assert.equal(isExtinguisherSuitableForClass('drypowder', 'A'), true);
  assert.equal(isExtinguisherSuitableForClass('drypowder', 'B'), true);
  assert.equal(isExtinguisherSuitableForClass('drypowder', 'C'), true);

  assert.equal(isExtinguisherSuitableForClass('co2', 'B'), true);
  assert.equal(isExtinguisherSuitableForClass('co2', 'E'), true);
  assert.equal(isExtinguisherSuitableForClass('co2', 'A'), false);
});

test('evaluateScenarioAnswer flags hazardous water on electrical fires', () => {
  const electricalScenario = SCENARIOS.find((s) => s.fireClass === 'E')!;
  const result = evaluateScenarioAnswer(electricalScenario, 'water');
  assert.equal(result.isCorrect, false);
  assert.equal(result.isHazardous, true);
  assert.match(result.title, /AMARAN BAHAYA/);
});

test('evaluateScenarioAnswer rewards correct primary extinguisher', () => {
  const paperScenario = SCENARIOS.find((s) => s.fireClass === 'A')!;
  const result = evaluateScenarioAnswer(paperScenario, 'water');
  assert.equal(result.isCorrect, true);
  assert.equal(result.isAcceptableAlternative, false);
  assert.equal(result.score, 2);
  assert.equal(result.isHazardous, false);
});

test('evaluateScenarioAnswer acknowledges acceptable alternative extinguisher', () => {
  const paperScenario = SCENARIOS.find((s) => s.fireClass === 'A')!;
  const result = evaluateScenarioAnswer(paperScenario, 'foam');
  assert.equal(result.isCorrect, true);
  assert.equal(result.isAcceptableAlternative, true);
  assert.equal(result.score, 1);
});

test('calculateQuizScore computes accurate percentages and pass grades', () => {
  // Perfect score
  const perfectAnswers: Record<number, number> = {};
  QUIZ_QUESTIONS.forEach((q) => {
    perfectAnswers[q.id] = q.correctIndex;
  });
  const perfectResult = calculateQuizScore(perfectAnswers);
  assert.equal(perfectResult.score, 10);
  assert.equal(perfectResult.percentage, 100);
  assert.equal(perfectResult.hasPassed, true);
  assert.equal(perfectResult.grade, 'Cemerlang');

  // 7 out of 10 (70% - Kepujian)
  const passAnswers: Record<number, number> = {};
  QUIZ_QUESTIONS.forEach((q, idx) => {
    passAnswers[q.id] = idx < 7 ? q.correctIndex : (q.correctIndex + 1) % 4;
  });
  const passResult = calculateQuizScore(passAnswers);
  assert.equal(passResult.score, 7);
  assert.equal(passResult.percentage, 70);
  assert.equal(passResult.hasPassed, true);
  assert.equal(passResult.grade, 'Kepujian');

  // Failing score
  const failAnswers: Record<number, number> = {};
  QUIZ_QUESTIONS.forEach((q) => {
    failAnswers[q.id] = (q.correctIndex + 1) % 4; // all wrong
  });
  const failResult = calculateQuizScore(failAnswers);
  assert.equal(failResult.score, 0);
  assert.equal(failResult.percentage, 0);
  assert.equal(failResult.hasPassed, false);
  assert.equal(failResult.grade, 'Perlu Mengulang');
});
