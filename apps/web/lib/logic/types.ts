export interface Premise {
  id: string;
  text: string;
  truthValue?: boolean;
}

export interface Conclusion {
  text: string;
  truthValue?: boolean;
}

export interface Argument {
  premises: Premise[];
  conclusion: Conclusion;
  logicalForm?: string;
  validity?: "valid" | "invalid" | "unknown";
}

export interface Fallacy {
  id: string;
  name: string;
  description: string;
  example: string;
  correction: string;
  category: string;
}

export interface Syllogism {
  id: string;
  majorPremise: string;
  minorPremise: string;
  conclusion: string;
  figure: number;
  mood: string;
  validity: "valid" | "invalid";
  explanation?: string;
}

export interface ArgumentNode {
  id: string;
  type: "premise" | "conclusion" | "objection" | "support";
  text: string;
  x: number;
  y: number;
  connections: string[];
}

export interface ArgumentMap {
  nodes: ArgumentNode[];
  edges: Array<{
    from: string;
    to: string;
    type: "support" | "attack";
  }>;
  clarityScore?: number;
}

export interface TruthTable {
  variables: string[];
  rows: Array<{
    values: Record<string, boolean>;
    result: boolean;
  }>;
}
