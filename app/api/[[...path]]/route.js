import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

// Legacy endpoints. No current frontend calls them: the intake form hands off to
// WhatsApp and the contact form POST was removed (see app/contact/ContactClient.js).
// They stay in place so no write contract disappears silently, but nothing here
// may list stored patient data, and responses are same-origin only (no CORS).

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'aesthedent_db';

let client = null;

async function getDatabase() {
  if (!client) {
    // Cache only after a successful connect so one failure is not reused forever.
    const connecting = new MongoClient(MONGO_URL);
    await connecting.connect();
    client = connecting;
  }
  return client.db(DB_NAME);
}

function methodNotAllowed(allow) {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405, headers: { Allow: allow } });
}

// Health check endpoint
async function handleHealthCheck() {
  try {
    const db = await getDatabase();
    await db.command({ ping: 1 });
    return NextResponse.json({
      status: 'healthy',
      message: 'Aesthedent Dental Clinic API is running',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    // Upstream messages can carry hostnames or credentials; keep them server-side.
    console.error('API health check failed:', error?.name ?? 'Error');
    return NextResponse.json({ status: 'unhealthy' }, { status: 500 });
  }
}

// Appointment endpoints. Listing was an unauthenticated read of names, phones and
// schedules, so only creation remains, and it is refused before touching the database.
async function handleAppointments(request, method) {
  if (method !== 'POST') return methodNotAllowed('POST');

  const db = await getDatabase();
  const collection = db.collection('appointments');
  const body = await request.json();
  const appointment = {
    id: uuidv4(),
    name: body.name,
    phone: body.phone,
    email: body.email || null,
    service: body.service,
    preferredDate: body.preferredDate,
    preferredTime: body.preferredTime,
    message: body.message || '',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  await collection.insertOne(appointment);
  return NextResponse.json({ success: true, appointment }, { status: 201 });
}

// Contact form endpoint
async function handleContact(request) {
  const db = await getDatabase();
  const collection = db.collection('contacts');

  const body = await request.json();
  const contact = {
    id: uuidv4(),
    name: body.name,
    phone: body.phone,
    email: body.email || null,
    message: body.message,
    createdAt: new Date().toISOString(),
  };

  await collection.insertOne(contact);
  return NextResponse.json({ success: true, message: 'Thank you for contacting us!' }, { status: 201 });
}

// Main route handler
async function handleRequest(request, { params }) {
  const { path } = await params;
  const pathString = path ? path.join('/') : '';
  const method = request.method;

  try {
    if (pathString === 'health' || pathString === '') {
      return await handleHealthCheck();
    }

    if (pathString === 'appointments') {
      return await handleAppointments(request, method);
    }

    if (pathString === 'contact' && method === 'POST') {
      return await handleContact(request);
    }

    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  } catch (error) {
    // Name only: request bodies and driver messages may contain personal data.
    console.error('API Error:', pathString, error?.name ?? 'Error');
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request, context) {
  return handleRequest(request, context);
}

export async function POST(request, context) {
  return handleRequest(request, context);
}

export async function PUT(request, context) {
  return handleRequest(request, context);
}

export async function DELETE(request, context) {
  return handleRequest(request, context);
}
