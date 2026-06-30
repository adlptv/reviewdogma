import crypto from "crypto";

export function verifyGithubWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  if (!signature || !signature.startsWith("sha256=")) {
    return false;
  }

  const expectedSignature = "sha256=" +
    crypto.createHmac("sha256", secret).update(payload).digest("hex");

  try {
    const a = Buffer.from(signature);
    const b = Buffer.from(expectedSignature);
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export interface GitHubFile {
  filename: string;
  status: string;
  additions: number;
  deletions: number;
  patch?: string;
}

export interface GitHubPRData {
  number: number;
  title: string;
  body: string | null;
  headSha: string;
  baseSha: string;
  repo: string;
  files: GitHubFile[];
}

export function buildDiffFromFiles(files: GitHubFile[]): string {
  let diff = "";
  for (const file of files) {
    diff += `diff --git a/${file.filename} b/${file.filename}\n`;
    diff += `--- a/${file.filename}\n`;
    diff += `+++ b/${file.filename}\n`;
    if (file.patch) {
      diff += file.patch + "\n";
    }
  }
  return diff;
}

export function parseRepoFullName(fullName: string): { owner: string; repo: string } {
  const [owner, repo] = fullName.split("/");
  return { owner, repo };
}
