import { defineArrayMember, defineField, defineType, getPublishedId } from 'sanity';
import { initialTeamValues, teamValueIcons, teamValuesErrors } from '../lib/team-values';
import { requireSanityEnvironment } from '../env';

export const teamValues = defineType({
  name: 'teamValues', title: 'Team Values', type: 'document',
  description: 'The Values section on the Team page. Publish to update the website. Remove all cards and publish to hide the section.',
  initialValue: (_, context) => initialTeamValues(context.getClient({ apiVersion: requireSanityEnvironment().apiVersion }).withConfig({ perspective: 'raw' })),
  fields: [
    defineField({ name: 'eyebrow', title: 'Small label (optional)', type: 'string', description: 'Above the heading. Up to 180 characters.' }),
    defineField({ name: 'heading', title: 'Section heading', type: 'string', description: 'Required when you add cards. Up to 180 characters.' }),
    defineField({ name: 'subheading', title: 'Introduction (optional)', type: 'text', rows: 3, description: 'Below the heading. Up to 800 characters.' }),
    defineField({ name: 'cards', title: 'Value cards', type: 'array', description: 'Add up to 20 cards. Drag to change their order. An empty list hides this section.', of: [defineArrayMember({
      name: 'teamValueCard', title: 'Value card', type: 'object', fields: [
        defineField({ name: 'title', title: 'Card title', type: 'string', description: 'Required. Up to 180 characters.' }),
        defineField({ name: 'description', title: 'Card description', type: 'text', rows: 3, description: 'Required. Up to 4,000 characters.' }),
        defineField({ name: 'icon', title: 'Icon', type: 'string', options: { list: teamValueIcons.map(value => ({ value, title: value[0].toUpperCase() + value.slice(1) })) }, description: 'Choose an icon for this card.', validation: rule => rule.required().error('Choose Heart, Users or Award.') }),
      ], preview: { select: { title: 'title', subtitle: 'description' } },
    })] }),
  ],
  validation: rule => rule.custom((value, context) => context.document?._id && getPublishedId(context.document._id) !== 'teamValues' ? 'Open Team Values from the Studio sidebar.' : teamValuesErrors(value)),
  preview: { prepare: () => ({ title: 'Team Values', subtitle: '/doctor · Values section' }) },
});
