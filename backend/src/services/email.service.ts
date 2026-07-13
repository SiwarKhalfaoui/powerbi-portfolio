import nodemailer, { Transporter } from 'nodemailer';
import { env, isProduction } from '../config/env';

interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  text: string;
}

interface EmailProvider {
  send(input: SendEmailInput): Promise<void>;
}

/**
 * Fallback provider. Prints the email to the server terminal instead of
 * sending it — useful if EMAIL_PROVIDER is ever unset. Not used when
 * NODE_ENV=production (see getProvider): production must use real SMTP.
 */
class ConsoleEmailProvider implements EmailProvider {
  async send(input: SendEmailInput): Promise<void> {
    console.log('\n📧 ───── Email (console provider — not actually sent) ─────');
    console.log(`To:      ${input.to}`);
    console.log(`Subject: ${input.subject}`);
    console.log('---');
    console.log(input.text);
    console.log('─────────────────────────────────────────────────────────\n');
  }
}

/** Real SMTP delivery via Nodemailer. Configured from SMTP_* env vars. */
class SmtpEmailProvider implements EmailProvider {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE,
      auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASSWORD } : undefined,
    });
  }

  async send(input: SendEmailInput): Promise<void> {
    await this.transporter.sendMail({
      from: env.EMAIL_FROM,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
    });
  }
}

function getProvider(): EmailProvider {
  if (isProduction && env.EMAIL_PROVIDER !== 'smtp') {
    throw new Error('EMAIL_PROVIDER must be "smtp" in production.');
  }
  return env.EMAIL_PROVIDER === 'smtp' ? new SmtpEmailProvider() : new ConsoleEmailProvider();
}

const provider = getProvider();

export async function sendPasswordResetEmail(to: string, resetLink: string): Promise<void> {
  await provider.send({
    to,
    subject: 'Réinitialisez votre mot de passe — Dr.D Portfolio',
    text: `Vous avez demandé la réinitialisation de votre mot de passe.\n\nCliquez sur ce lien (valable 1 heure) pour choisir un nouveau mot de passe :\n${resetLink}\n\nSi vous n'êtes pas à l'origine de cette demande, ignorez simplement cet email.`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #101828;">Réinitialisation de mot de passe</h2>
        <p style="color: #5B6472;">Vous avez demandé la réinitialisation de votre mot de passe sur Dr.D Portfolio.</p>
        <p>
          <a href="${resetLink}" style="display:inline-block;padding:12px 20px;background:#22D3B4;color:#0B1220;border-radius:8px;text-decoration:none;font-weight:600;">
            Choisir un nouveau mot de passe
          </a>
        </p>
        <p style="color: #8A93A6; font-size: 13px;">Ce lien expire dans 1 heure. Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
      </div>
    `,
  });
}