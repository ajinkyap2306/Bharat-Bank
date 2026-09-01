export function maskRegisteredEmail(email: string): string {
  const trimmed = email.trim();
  const at = trimmed.indexOf('@');
  if (at <= 1) return trimmed;
  const local = trimmed.slice(0, at);
  const domain = trimmed.slice(at + 1);
  const visible = local.slice(0, Math.min(2, local.length));
  return `${visible}${'•'.repeat(Math.max(1, local.length - visible.length))}@${domain}`;
}

export interface SendStatementEmailParams {
  email: string;
  accountLabel: string;
  periodLabel: string;
  format?: 'PDF' | 'CSV';
}

export async function sendStatementToRegisteredEmail({
  email,
  accountLabel,
  periodLabel,
  format = 'PDF',
}: SendStatementEmailParams): Promise<void> {
  if (!email.trim()) {
    throw new Error('No registered email found on your profile.');
  }
  await new Promise((resolve) => setTimeout(resolve, 900));
  void accountLabel;
  void periodLabel;
  void format;
}
