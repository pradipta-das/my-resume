import { siteConfig } from "../seo";
import { WORDPRESS_API_URL } from "../wordpress";
import { oneLine, sendMail, siteMailbox } from "../mail";
import { labelAnswers, type ConsultationRequest } from "./schema";

type Entry = Omit<ConsultationRequest, "honeypot">;

/**
 * Tells the visitor their request arrived.
 *
 * Anyone can type any address into the form, so this email repeats nothing
 * they wrote except a short first name: echoing their message would let the
 * form be used to send arbitrary text to strangers from this address.
 */
export async function sendConsultationAcknowledgement(entry: Entry): Promise<void> {
  const first = oneLine(entry.name.trim().split(/\s+/)[0] ?? "", 40);

  const text = [
    `Hi ${first},`,
    "",
    "Thank you for booking a free consultation. This is just a quick note to say your request arrived safely.",
    "",
    "It's also the only automatic email you'll get from me. I'll read what you shared properly and reply personally within one working day, with a few times for our call.",
    "",
    "If you think of anything else in the meantime, just reply to this email. It comes straight to me.",
    "",
    "Speak soon,",
    "Pradipta Das",
    siteConfig.url,
  ].join("\n");

  await sendMail({ to: entry.email, subject: `Thanks, ${first}. Your consultation request arrived`, text });
}

/**
 * Emails me the request so it can be answered quickly. Goes to
 * MAIL_NOTIFY_TO, or to the sending mailbox; replying answers the visitor.
 */
export async function sendConsultationNotification(entry: Entry, postId: number): Promise<void> {
  const to = process.env.MAIL_NOTIFY_TO || siteMailbox();
  const admin = WORDPRESS_API_URL.replace(/\/wp-json\/?$/, "/wp-admin");

  const lines = [`${oneLine(entry.name)} (${entry.audience})`, entry.email];
  if (entry.phone) lines.push(entry.phone);
  lines.push("");
  for (const [question, answer] of Object.entries(labelAnswers(entry.answers))) {
    lines.push(`${question}: ${Array.isArray(answer) ? answer.join(", ") : answer}`);
  }
  lines.push("", `View in WordPress: ${admin}/post.php?post=${postId}&action=edit`);

  await sendMail({
    to,
    subject: `New consultation request: ${oneLine(entry.name)}`,
    text: lines.join("\n"),
    replyTo: { name: oneLine(entry.name), address: entry.email },
  });
}
