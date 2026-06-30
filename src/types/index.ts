export interface Policy {
  id: string;
  name: string;
  description: string;
  rules: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Analysis {
  id: string;
  repo: string;
  prNumber: number;
  violations: string;
  createdAt: string;
  policyId: string;
  policy?: Policy;
}

export interface ReviewStat {
  id: string;
  date: string;
  totalReviews: number;
  violationsFound: number;
  policyTriggered: string;
}

export interface DashboardStats {
  totalPolicies: number;
  activePolicies: number;
  totalAnalyses: number;
  totalViolations: number;
  violationsBySeverity: {
    error: number;
    warning: number;
    info: number;
  };
  trends: {
    date: string;
    totalReviews: number;
    violationsFound: number;
    policyTriggered: string;
  }[];
  topPolicies: {
    policy: string;
    count: number;
  }[];
}

export interface MarketplacePolicy {
  id: string;
  name: string;
  description: string;
  rules: string;
  category: string;
  author: string;
  downloads: number;
  rating: number;
}

export type Severity = "error" | "warning" | "info";

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

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
