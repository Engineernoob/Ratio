import type { Argument, Premise, Conclusion } from "./types";

/**
 * Parse argument text into structured premises and conclusion
 */
export function parseArgument(text: string): Argument {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const premises: Premise[] = [];
  let conclusion: Conclusion | null = null;

  // Look for conclusion indicators
  const conclusionIndicators = [
    "therefore",
    "thus",
    "hence",
    "so",
    "consequently",
    "it follows that",
    "we can conclude",
  ];

  let foundConclusion = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    const hasIndicator = conclusionIndicators.some((indicator) =>
      line.includes(indicator)
    );

    if (hasIndicator || i === lines.length - 1) {
      // This is likely the conclusion
      const conclusionText = lines[i]
        .replace(
          /^(therefore|thus|hence|so|consequently|it follows that|we can conclude)[\s:]*/i,
          ""
        )
        .trim();
      conclusion = { text: conclusionText };
      foundConclusion = true;
    } else {
      // This is a premise
      premises.push({
        id: `premise-${i}`,
        text: lines[i],
      });
    }
  }

  // If no conclusion found, use last line
  if (!conclusion && lines.length > 0) {
    conclusion = { text: lines[lines.length - 1] };
    premises.pop(); // Remove last line from premises
  }

  return {
    premises,
    conclusion: conclusion || { text: "" },
  };
}

/**
 * Extract logical form from argument
 */
export function extractLogicalForm(argument: Argument): string {
  const premiseCount = argument.premises.length;
  if (premiseCount === 0) {
    return "No premises provided";
  }

  // Simple pattern matching for common forms
  const forms: string[] = [];

  argument.premises.forEach((premise, index) => {
    const text = premise.text.toLowerCase();
    if (text.includes("all") || text.includes("every")) {
      forms.push(`P${index + 1}: Universal Affirmative`);
    } else if (text.includes("no") || text.includes("none")) {
      forms.push(`P${index + 1}: Universal Negative`);
    } else if (text.includes("some")) {
      forms.push(`P${index + 1}: Particular Affirmative`);
    } else {
      forms.push(`P${index + 1}: Conditional`);
    }
  });

  return forms.join("; ");
}

/**
 * Find missing premises for invalid arguments
 */
export function findMissingPremises(argument: Argument): string[] {
  const missing: string[] = [];

  if (argument.premises.length < 2) {
    missing.push("Need at least two premises for a valid syllogism");
  }

  // Check for logical gaps
  const conclusionTerms = argument.conclusion.text
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 3);

  const premiseTerms = argument.premises
    .flatMap((p) => p.text.toLowerCase().split(/\s+/))
    .filter((word) => word.length > 3);

  const uniqueConclusionTerms = conclusionTerms.filter(
    (term) => !premiseTerms.includes(term)
  );

  if (uniqueConclusionTerms.length > 0) {
    missing.push(
      `Missing connection for terms: ${uniqueConclusionTerms
        .slice(0, 3)
        .join(", ")}`
    );
  }

  return missing;
}
