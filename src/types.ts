export type ExtinguisherType = 'water' | 'foam' | 'drypowder' | 'co2';

export type FireClass = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

export interface ExtinguisherData {
  id: ExtinguisherType;
  name: string;
  labelColorMalay: string;
  labelHex: string;
  tagColor: string;
  principle: string;
  classes: FireClass[];
  suitableDesc: string;
  dangerDesc: string;
  coolingCapacity: string;
  components: {
    name: string;
    desc: string;
  }[];
  passSteps: {
    letter: 'P' | 'A' | 'S';
    title: string;
    detail: string;
  }[];
}

export interface Scenario {
  id: string;
  title: string;
  location: string;
  fuelType: string;
  fireClass: FireClass;
  description: string;
  correctExtinguisher: ExtinguisherType;
  acceptableAlternative?: ExtinguisherType;
  explanation: string;
  warningNote: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
}
