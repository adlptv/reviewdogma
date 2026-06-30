import { parse as parseYaml } from "yaml";

export type Severity = "error" | "warning" | "info";

export interface PolicyRule {
  pattern: string;
  message: string;
  fileTypes?: string[];
  maxLines?: number;
  order?: string[];
}

export interface PolicyDefinition {
  name: string;
  description: string;
  severity: Severity;
  rules: PolicyRule[];
}

export interface Violation {
  rule: string;
  file: string;
  line: number;
  column: number;
  match: string;
  message: string;
  severity: Severity;
}

export interface AnalysisResult {
  totalViolations: number;
  violationsBySeverity: {
    error: number;
    warning: number;
    info: number;
  };
  violations: Violation[];
  filesAnalyzed: number;
}

export function parsePolicy(rulesYaml: string): PolicyDefinition {
  const parsed = parseYaml(rulesYaml);
  if (!parsed) {
    throw new Error("Invalid YAML: empty or null");
  }
  if (!parsed.name || typeof parsed.name !== "string") {
    throw new Error("Policy must have a 'name' field");
  }
  if (!parsed.rules || !Array.isArray(parsed.rules)) {
    throw new Error("Policy must have a 'rules' array");
  }
  for (const rule of parsed.rules) {
    if (!rule.pattern || typeof rule.pattern !== "string") {
      throw new Error("Each rule must have a 'pattern' field");
    }
    if (!rule.message || typeof rule.message !== "string") {
      throw new Error("Each rule must have a 'message' field");
    }
  }
  return parsed as PolicyDefinition;
}

export function validatePolicyYaml(rulesYaml: string): {
  valid: boolean;
  errors: string[];
  definition?: PolicyDefinition;
} {
  const errors: string[] = [];
  try {
    const definition = parsePolicy(rulesYaml);
    if (!["error", "warning", "info"].includes(definition.severity)) {
      errors.push(`Invalid severity: ${definition.severity}. Must be error, warning, or info`);
    }
    for (let i = 0; i < definition.rules.length; i++) {
      const rule = definition.rules[i];
      try {
        new RegExp(rule.pattern);
      } catch {
        errors.push(`Rule ${i + 1}: Invalid regex pattern: ${rule.pattern}`);
      }
    }
    return { valid: errors.length === 0, errors, definition };
  } catch (err) {
    errors.push(err instanceof Error ? err.message : "Unknown parsing error");
    return { valid: false, errors };
  }
}

function getFileExtension(filename: string): string {
  const idx = filename.lastIndexOf(".");
  return idx >= 0 ? filename.slice(idx) : "";
}

export function analyzeDiff(diff: string, policies: PolicyDefinition[]): AnalysisResult {
  const violations: Violation[] = [];
  const filesAnalyzed = new Set<string>();

  const files = diff.split(/^diff --git /m).filter(Boolean);

  for (const fileDiff of files) {
    const lines = fileDiff.split("\n");
    let currentFile = "";
    let lineNumber = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      const fileMatch = line.match(/^a\/(.+?) b\/(.+)$/);
      if (fileMatch) {
        currentFile = fileMatch[2];
        filesAnalyzed.add(currentFile);
        continue;
      }

      const hunkMatch = line.match(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
      if (hunkMatch) {
        lineNumber = parseInt(hunkMatch[1], 10) - 1;
        continue;
      }

      if (line.startsWith("+") && !line.startsWith("+++")) {
        lineNumber++;
        const content = line.slice(1);

        for (const policy of policies) {
          for (const rule of policy.rules) {
            if (rule.fileTypes && rule.fileTypes.length > 0) {
              const ext = getFileExtension(currentFile);
              if (!rule.fileTypes.includes(ext)) continue;
            }

            try {
              const regex = new RegExp(rule.pattern, "g");
              let match;
              while ((match = regex.exec(content)) !== null) {
                violations.push({
                  rule: policy.name,
                  file: currentFile,
                  line: lineNumber,
                  column: match.index + 1,
                  match: match[0],
                  message: rule.message,
                  severity: policy.severity,
                });
                if (match.index === regex.lastIndex) regex.lastIndex++;
              }
            } catch {
              // Skip invalid regex
            }
          }
        }
      } else if (line.startsWith("-") && !line.startsWith("---")) {
        // Removed line — don't increment
      } else {
        lineNumber++;
      }
    }
  }

  const violationsBySeverity = {
    error: violations.filter((v) => v.severity === "error").length,
    warning: violations.filter((v) => v.severity === "warning").length,
    info: violations.filter((v) => v.severity === "info").length,
  };

  return {
    totalViolations: violations.length,
    violationsBySeverity,
    violations,
    filesAnalyzed: filesAnalyzed.size,
  };
}
