import type { Argument } from "./types";

/**
 * Evaluate argument validity
 */
export function evaluateValidity(
  argument: Argument
): "valid" | "invalid" | "unknown" {
  if (argument.premises.length < 2) {
    return "invalid";
  }

  // Check for categorical syllogism structure
  const isCategorical = argument.premises.every((p) => {
    const text = p.text.toLowerCase();
    return (
      text.includes("all") ||
      text.includes("no") ||
      text.includes("some") ||
      text.includes("every")
    );
  });

  if (isCategorical) {
    return evaluateCategoricalSyllogism(argument);
  }

  // Check for modus ponens/tollens
  if (argument.premises.length === 1) {
    const premise = argument.premises[0].text.toLowerCase();
    if (premise.includes("if") && premise.includes("then")) {
      // This is a conditional, check if conclusion follows
      return "unknown"; // Would need more sophisticated logic
    }
  }

  return "unknown";
}

/**
 * Evaluate categorical syllogism validity
 */
function evaluateCategoricalSyllogism(argument: Argument): "valid" | "invalid" {
  // Simplified validity check
  // In a real system, this would use formal logic rules

  const majorPremise = argument.premises[0]?.text?.toLowerCase() || "";
  const minorPremise = argument.premises[1]?.text?.toLowerCase() || "";
  const conclusion = argument.conclusion?.text?.toLowerCase() || "";

  // Check for valid patterns
  const validPatterns = [
    // All A are B, All B are C, therefore All A are C
    majorPremise.includes("all") &&
      minorPremise.includes("all") &&
      conclusion.includes("all"),
    // No A are B, All C are A, therefore No C are B
    majorPremise.includes("no") &&
      minorPremise.includes("all") &&
      conclusion.includes("no"),
  ];

  return validPatterns.some(Boolean) ? "valid" : "invalid";
}

/**
 * Generate truth table for logical expression
 */
export function generateTruthTable(expression: string): any {
  // Extract variables
  const variables = [...new Set(expression.match(/[A-Z]/g) || [])].sort();

  if (variables.length === 0) {
    return { variables: [], rows: [] };
  }

  // Generate all combinations
  const rows: Array<{ values: Record<string, boolean>; result: boolean }> = [];
  const numRows = Math.pow(2, variables.length);

  for (let i = 0; i < numRows; i++) {
    const values: Record<string, boolean> = {};
    variables.forEach((varName, index) => {
      values[varName] = (i & (1 << (variables.length - 1 - index))) !== 0;
    });

    // Evaluate expression (simplified - would need proper parser)
    const result = evaluateExpression(expression, values);
    rows.push({ values, result });
  }

  return { variables, rows };
}

/**
 * Evaluate logical expression with given variable values
 */
function evaluateExpression(
  expression: string,
  values: Record<string, boolean>
): boolean {
  // Simplified evaluator - replace variables and evaluate
  let evalExpr = expression;
  Object.entries(values).forEach(([varName, value]) => {
    evalExpr = evalExpr.replace(
      new RegExp(varName, "g"),
      value ? "true" : "false"
    );
  });

  // Replace logical operators
  evalExpr = evalExpr.replace(/AND/g, "&&");
  evalExpr = evalExpr.replace(/OR/g, "||");
  evalExpr = evalExpr.replace(/NOT/g, "!");
  evalExpr = evalExpr.replace(/→/g, "=>");

  try {
    // Use Function constructor for safe evaluation
    return new Function(`return ${evalExpr}`)();
  } catch {
    return false;
  }
}
