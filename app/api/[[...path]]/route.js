import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { v4 as uuidv4 } from 'uuid';

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'aesthedent_db';

let client = null;

async function getDatabase() {
  if (!client) {
    client = new MongoClient(MONGO_URL);
    await client.connect();
  }
  return client.db(DB_NAME);
}

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Health check endpoint
async function handleHealthCheck() {
  try {
    const db = await getDatabase();
    await db.command({ ping: 1 });
    return NextResponse.json(
      { 
        status: 'healthy', 
        message: 'Aesthedent Dental Clinic API is running',
        timestamp: new Date().toISOString()
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    return NextResponse.json(
      { status: 'unhealthy', error: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Appointment endpoints
async function handleAppointments(request, method) {
  const db = await getDatabase();
  const collection = db.collection('appointments');

  if (method === 'GET') {
    const appointments = await collection.find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ appointments }, { headers: corsHeaders });
  }

  if (method === 'POST') {
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
      updatedAt: new Date().toISOString()
    };

    await collection.insertOne(appointment);
    return NextResponse.json(
      { success: true, appointment },
      { status: 201, headers: corsHeaders }
    );
  }

  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405, headers: corsHeaders }
  );
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
    createdAt: new Date().toISOString()
  };

  await collection.insertOne(contact);
  return NextResponse.json(
    { success: true, message: 'Thank you for contacting us!' },
    { status: 201, headers: corsHeaders }
  );
}

// Main route handler
async function handleRequest(request, { params }) {
  const { path } = await params;
  const pathString = path ? path.join('/') : '';
  const method = request.method;

  try {
    // Health check
    if (pathString === 'health' || pathString === '') {
      return handleHealthCheck();
    }

    // Appointments
    if (pathString === 'appointments') {
      return handleAppointments(request, method);
    }

    // Contact
    if (pathString === 'contact' && method === 'POST') {
      return handleContact(request);
    }

    // 404 for unknown routes
    return NextResponse.json(
      { error: 'Not found' },
      { status: 404, headers: corsHeaders }
    );
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500, headers: corsHeaders }
    );
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

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}
