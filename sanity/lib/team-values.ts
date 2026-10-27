import { z } from 'zod';
import { studioPath } from './content-validation';

export const teamValueIcons = ['heart', 'users', 'award'] as const;
const plain = (max: number) => z.string().max(max).refine(value => !/<\/?[A-Za-z][^>]*>/.test(value));
const required = (max: number) => plain(max).refine(value => !!value.trim());
export const teamValuesContent = z.object({
  eyebrow: plain(180).nullish().transform(value => value ?? ''),
  heading: plain(180).nullish().transform(value => value ?? ''),
  subheading: plain(800).nullish().transform(value => value ?? ''),
  cards: z.array(z.object({ _key: required(200), title: required(180), description: required(4000), icon: z.enum(teamValueIcons) })).max(20).nullish().transform(value => value ?? []),
}).superRefine((value, context) => {
  if (value.cards.length && !value.heading.trim()) context.addIssue({ code: 'custom', path: ['heading'], message: 'Add a heading before publishing cards.' });
  const keys = new Set<string>();
  value.cards.forEach((card, index) => {
    if (keys.has(card._key)) context.addIssue({ code: 'custom', path: ['cards', index], message: 'This card has a duplicate identity. Remove it and add it again.' });
    keys.add(card._key);
  });
});
export type TeamValues = z.infer<typeof teamValuesContent>;

// Existing website copy, used only before first publication and for new drafts.
export const teamValuesDefaults: TeamValues = {
  eyebrow: 'Our Values', heading: 'What Drives Our Team', subheading: 'The principles that guide everything we do',
  cards: [
    { _key: 'clinical-excellence', icon: 'heart', title: 'Clinical Excellence', description: 'We use state-of-the-art dental technology to ensure precision in diagnosis, treatment, and long-term oral health management.' },
    { _key: 'specialist-planning', icon: 'users', title: 'Specialist-Led Planning', description: 'Every patient receiving complex treatment benefits from a specialized clinical roadmap and detailed biomechanical planning.' },
    { _key: 'advanced-expertise', icon: 'award', title: 'Advanced Expertise', description: 'From routine scaling to complex dental implants in Pune, our specialized team is meticulously trained in modern, evidence-based dentistry.' },
  ],
};

export function teamValuesErrors(value: unknown) {
  const result = teamValuesContent.safeParse(value);
  if (result.success) return true;
  // Keep heading readiness visible while a different card still has missing fields.
  // The icon selector owns its native required/list check; runtime readers still validate it here.
  const errors = result.error.issues.filter(issue => issue.message !== 'Add a heading before publishing cards.' && issue.path.at(-1) !== 'icon').map(issue => {
    const field = issue.path.at(-1);
    const message = issue.code === 'custom' && issue.message !== 'Invalid input' ? issue.message
      : field === 'icon' ? 'Choose Heart, Users or Award.'
      : field === 'title' ? 'Enter a card title in plain text, up to 180 characters.'
      : field === 'description' ? 'Enter a card description in plain text, up to 4,000 characters.'
      : field === '_key' ? 'Remove this incomplete card and add it again.'
      : field === 'eyebrow' ? 'Use plain text up to 180 characters, or leave this empty.'
      : field === 'heading' ? 'Use a plain-text heading up to 180 characters.'
      : field === 'subheading' ? 'Use plain text up to 800 characters, or leave this empty.'
      : 'Keep up to 20 cards. Complete each card, or remove it.';
    const path = studioPath(value, issue.path);
    if (field === '_key') path.pop();
    return { message, paths: [path] };
  });
  if (value && typeof value === 'object') {
    const cards = Reflect.get(value, 'cards'), heading = Reflect.get(value, 'heading');
    if (Array.isArray(cards) && cards.length && (heading == null || typeof heading === 'string' && !heading.trim())) errors.push({ message: 'Add a heading before publishing cards.', paths: [['heading']] });
  }
  return errors;
}

export function resolveTeamValues(input: unknown) {
  const parsed = z.array(z.object({ _id: z.literal('teamValues'), _type: z.literal('teamValues') }).passthrough()).max(1).safeParse(input);
  if (!parsed.success) return { value: null, status: 'invalid' } as const;
  if (!parsed.data.length) return { value: null, status: 'missing' } as const;
  const content = teamValuesContent.safeParse(parsed.data[0]);
  return content.success ? { value: content.data, status: 'sanity' } as const : { value: null, status: 'invalid' } as const;
}

const initialSources = z.array(z.object({ _id: z.string(), _type: z.string(), values: z.object({ eyebrow: plain(180).nullish(), heading: plain(180).nullish(), intro: plain(800).nullish() }).nullish() }));
export async function initialTeamValues(client: { fetch: (query: string) => Promise<unknown> }) {
  // Throw on failed/malformed reads: a connection error must never seed replacement copy.
  const result = initialSources.safeParse(await client.fetch('*[_id in ["drafts.teamValues","teamValues","drafts.teamPage","teamPage"]]{_id,_type,values}'));
  if (!result.success) throw new Error('Could not read the saved Team page. Check your connection and reopen Team Values.');
  if (result.data.some(doc => ['teamValues', 'drafts.teamValues'].includes(doc._id))) return {};
  const source = result.data.find(doc => doc._id === 'drafts.teamPage' && doc._type === 'teamPage') ?? result.data.find(doc => doc._id === 'teamPage' && doc._type === 'teamPage');
  const defaults = { ...structuredClone(teamValuesDefaults), cards: teamValuesDefaults.cards.map(card => ({ ...card, _type: 'teamValueCard' })) };
  return source ? { ...defaults, eyebrow: source.values?.eyebrow ?? '', heading: source.values?.heading ?? '', subheading: source.values?.intro ?? '' } : defaults;
}
