import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const seedPolicies = [
  {
    name: "No Console Logs",
    description: "Prevents committing console.log statements to production code",
    rules: `name: no-console-log
description: Prevents console.log in production code
severity: warning
rules:
  - pattern: "console\\\\.log"
    message: "Remove console.log before committing"
    fileTypes: [".ts", ".tsx", ".js", ".jsx"]
  - pattern: "console\\\\.debug"
    message: "Remove console.debug before committing"
    fileTypes: [".ts", ".tsx", ".js", ".jsx"]`,
    enabled: true,
  },
  {
    name: "No TODO Comments",
    description: "Flags TODO comments that should be resolved before merge",
    rules: `name: no-todo-comments
description: Flags TODO comments in code
severity: info
rules:
  - pattern: "TODO"
    message: "Resolve TODO before merging"
    fileTypes: [".ts", ".tsx", ".js", ".jsx", ".py", ".go"]
  - pattern: "FIXME"
    message: "Resolve FIXME before merging"
    fileTypes: [".ts", ".tsx", ".js", ".jsx", ".py", ".go"]`,
    enabled: true,
  },
  {
    name: "No Hardcoded Secrets",
    description: "Detects potential hardcoded secrets and API keys",
    rules: `name: no-hardcoded-secrets
description: Detects hardcoded secrets and API keys
severity: error
rules:
  - pattern: "(api|secret|password|token|key)[\"']?\\\\s*[:=]\\\\s*[\"'][^\"']{16,}"
    message: "Potential hardcoded secret detected"
    fileTypes: [".ts", ".tsx", ".js", ".jsx", ".py", ".go", ".env"]
  - pattern: "AKIA[0-9A-Z]{16}"
    message: "AWS Access Key ID detected"
    fileTypes: [".ts", ".tsx", ".js", ".jsx", ".py", ".go"]`,
    enabled: true,
  },
  {
    name: "Function Length Limit",
    description: "Enforces maximum function length of 50 lines",
    rules: `name: function-length-limit
description: Enforces max function length of 50 lines
severity: warning
rules:
  - pattern: "function\\\\s+\\\\w+\\\\s*\\\\([^)]*\\\\)\\\\s*\\\\{[\\\\s\\\\S]{0,}}"
    message: "Function exceeds 50 lines — consider refactoring"
    fileTypes: [".ts", ".tsx", ".js", ".jsx"]
    maxLines: 50`,
    enabled: false,
  },
  {
    name: "No Inline Styles",
    description: "Prevents inline styles in React components",
    rules: `name: no-inline-styles
description: Prevents inline styles in React components
severity: warning
rules:
  - pattern: "style=\\\\{"
    message: "Avoid inline styles — use CSS classes instead"
    fileTypes: [".tsx", ".jsx"]`,
    enabled: true,
  },
  {
    name: "Import Order Enforcement",
    description: "Enforces consistent import ordering in TypeScript files",
    rules: `name: import-order
description: Enforces import ordering convention
severity: info
rules:
  - pattern: "import.*from.*\\\\.\\\\./"
    message: "Relative imports should come after absolute imports"
    fileTypes: [".ts", ".tsx"]
    order: ["external", "internal", "relative"]`,
    enabled: false,
  },
];

async function main() {
  console.log("Seeding database...");

  for (const policy of seedPolicies) {
    await prisma.policy.upsert({
      where: { name: policy.name },
      update: {},
      create: policy,
    });
  }

  const reviewStats = [
    { totalReviews: 12, violationsFound: 8, policyTriggered: "no-console-log" },
    { totalReviews: 15, violationsFound: 3, policyTriggered: "no-todo-comments" },
    { totalReviews: 20, violationsFound: 5, policyTriggered: "no-hardcoded-secrets" },
    { totalReviews: 18, violationsFound: 12, policyTriggered: "no-console-log" },
    { totalReviews: 25, violationsFound: 7, policyTriggered: "no-inline-styles" },
    { totalReviews: 22, violationsFound: 4, policyTriggered: "no-todo-comments" },
    { totalReviews: 30, violationsFound: 2, policyTriggered: "no-hardcoded-secrets" },
  ];

  for (let i = 0; i < reviewStats.length; i++) {
    await prisma.reviewStat.create({
      data: {
        ...reviewStats[i],
        date: new Date(Date.now() - (reviewStats.length - i) * 86400000),
      },
    });
  }

  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
