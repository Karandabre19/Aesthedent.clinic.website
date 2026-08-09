// scratch/check-message.mjs -verification scratch, not committed.
// Imports the real .ts module so a broken shipped function fails these checks.
import assert from 'node:assert/strict';
import { isValidPhone, normalisePhone, assembleMessage } from '../lib/intake-form-message.ts';

// Accepts the forms a real patient types.
for (const good of ['9309816336', '+919309816336', '93098 16336', '93098-16336', '919309816336']) {
  assert.equal(isValidPhone(good), true, `should accept ${good}`);
}

// Rejects what it must.
for (const bad of ['5309816336', '930981633', '93098163361', '', 'abcdefghij']) {
  assert.equal(isValidPhone(bad), false, `should reject "${bad}"`);
}

assert.equal(normalisePhone('+91 93098-16336'), '9309816336', 'strips +91, space and dash');

const full = {
  name: '  Asha Kulkarni  ', patientFor: 'Myself', reason: 'Tooth pain or sensitivity',
  duration: 'A few weeks', comfort: 1, contactMethod: 'WhatsApp', phone: '+919309816336',
  day: 'Thu', time: 'Morning (10 – 1)', notes: 'Upper right molar aches with cold water.',
};

const body = assembleMessage(full, 'A little nervous');
assert.ok(body.startsWith('Hello Aesthedent Dental Clinic,\nI\'d like to book an appointment.\n\n'), 'greeting block');
assert.ok(body.includes('Name: Asha Kulkarni'), 'name is trimmed');
assert.ok(body.includes('Mobile: 9309816336'), 'phone is normalised in the message');
assert.ok(body.includes('Comfort level: A little nervous'), 'comfort label passed through');

// Empty optional fields must not produce dangling label lines.
const sparse = assembleMessage({ ...full, notes: '   ', day: '', time: '' }, 'Calm');
assert.ok(!sparse.includes('Notes:'), 'blank Notes line must be omitted');
assert.ok(!sparse.includes('Preferred day:'), 'blank day line must be omitted');
assert.ok(sparse.includes('Name: Asha Kulkarni'), 'filled rows survive');

console.log('OK -all message/phone assertions passed');
