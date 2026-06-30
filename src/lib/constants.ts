export const SEVERITY_COLORS: Record<string, string> = {
  error: "text-red-400 bg-red-500/10 border-red-500/20",
  warning: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  info: "text-blue-400 bg-blue-500/10 border-blue-500/20",
};

export const SEVERITY_ORDER: Record<string, number> = {
  error: 0,
  warning: 1,
  info: 2,
};

export const NAV_LINKS = [
  { href: "/", label: "Home", icon: "Home" },
  { href: "/dashboard", label: "Dashboard", icon: "BarChart3" },
  { href: "/policies", label: "Policies", icon: "Shield" },
  { href: "/github", label: "GitHub", icon: "Github" },
  { href: "/marketplace", label: "Marketplace", icon: "Store" },
  { href: "/settings", label: "Settings", icon: "Settings" },
];

export const POLICY_TEMPLATES = [
  {
    name: "Basic Quality",
    category: "quality",
    description: "Basic code quality checks — console logs, TODOs, and debug statements",
    rules: `name: basic-quality
description: Basic code quality checks
severity: warning
rules:
  - pattern: "console\\\\.log"
    message: "Remove console.log before committing"
    fileTypes: [".ts", ".tsx", ".js", ".jsx"]
  - pattern: "debugger"
    message: "Remove debugger statement"
    fileTypes: [".ts", ".tsx", ".js", ".jsx"]
  - pattern: "TODO"
    message: "Resolve TODO before merging"
    fileTypes: [".ts", ".tsx", ".js", ".jsx", ".py", ".go"]`,
  },
  {
    name: "Security Audit",
    category: "security",
    description: "Security-focused checks — hardcoded secrets, SQL injection patterns, and unsafe eval",
    rules: `name: security-audit
description: Security-focused code checks
severity: error
rules:
  - pattern: "(api|secret|password|token|key)[\"']?\\\\s*[:=]\\\\s*[\"'][^\"']{16,}"
    message: "Potential hardcoded secret detected"
    fileTypes: [".ts", ".tsx", ".js", ".jsx", ".py", ".go", ".env"]
  - pattern: "eval\\\\s*\\\\("
    message: "Avoid using eval() — security risk"
    fileTypes: [".ts", ".tsx", ".js", ".jsx"]
  - pattern: "innerHTML\\\\s*="
    message: "Avoid innerHTML assignment — XSS risk"
    fileTypes: [".ts", ".tsx", ".js", ".jsx"]`,
  },
  {
    name: "React Best Practices",
    category: "frontend",
    description: "React best practices — inline styles, missing keys, and direct DOM manipulation",
    rules: `name: react-best-practices
description: React best practices enforcement
severity: warning
rules:
  - pattern: "style=\\\\{"
    message: "Avoid inline styles — use CSS classes"
    fileTypes: [".tsx", ".jsx"]
  - pattern: "key=\\\\{index\\\\}"
    message: "Avoid using array index as key"
    fileTypes: [".tsx", ".jsx"]
  - pattern: "document\\\\.getElementById"
    message: "Avoid direct DOM manipulation in React"
    fileTypes: [".tsx", ".jsx"]`,
  },
  {
    name: "Python Linting",
    category: "python",
    description: "Python code quality — bare excepts, mutable default arguments, and print statements",
    rules: `name: python-linting
description: Python code quality checks
severity: warning
rules:
  - pattern: "except\\\\s*:"
    message: "Avoid bare except — catch specific exceptions"
    fileTypes: [".py"]
  - pattern: "def\\\\s+\\\\w+\\\\s*\\\\([^)]*\\\\b\\\\[\\\\]\\\\b"
    message: "Avoid mutable default arguments"
    fileTypes: [".py"]
  - pattern: "print\\\\s*\\\\("
    message: "Remove print statement — use logging"
    fileTypes: [".py"]`,
  },
  {
    name: "Go Conventions",
    category: "go",
    description: "Go code conventions — error handling, unused variables, and panic usage",
    rules: `name: go-conventions
description: Go code convention checks
severity: warning
rules:
  - pattern: "_\\\\s*=\\\\s*err"
    message: "Do not ignore errors"
    fileTypes: [".go"]
  - pattern: "panic\\\\s*\\\\("
    message: "Avoid panic in production code — use error returns"
    fileTypes: [".go"]
  - pattern: "fmt\\\\.Println"
    message: "Remove fmt.Println — use structured logging"
    fileTypes: [".go"]`,
  },
  {
    name: "Accessibility Checks",
    category: "accessibility",
    description: "Accessibility checks — missing alt text, aria labels, and semantic HTML",
    rules: `name: accessibility-checks
description: Accessibility enforcement
severity: error
rules:
  - pattern: "<img[^>]*(?!alt=)[^>]*>"
    message: "Images must have alt text"
    fileTypes: [".tsx", ".jsx", ".html"]
  - pattern: "<button[^>]*(?!aria-label)[^>]*>"
    message: "Buttons should have aria-label when text is absent"
    fileTypes: [".tsx", ".jsx", ".html"]
  - pattern: "onClick[^>]*>[^<]*</div>"
    message: "Use <button> instead of <div> with onClick"
    fileTypes: [".tsx", ".jsx"]`,
  },
];

export const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
