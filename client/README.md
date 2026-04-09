================================================================================
                    RAKSHIKA – WOMEN'S PERSONAL SAFETY APPLICATION
                           PROJECT REPORT
================================================================================

Submitted in partial fulfillment of the requirements for the award of the degree of
                    Bachelor of Computer Applications / B.Tech (CSE)

Project Title   : Rakshika – Women's Personal Safety Application
Student Name    : [Your Full Name]
Roll Number     : [Your Roll Number]
Department      : [Department Name]
University/College : [University / College Name]
Academic Year   : 2025–2026
Guide Name      : [Guide Name]

================================================================================
                              CERTIFICATE
================================================================================

ORIGINALITY CERTIFICATE

This is to certify that the project entitled "Rakshika – Women's Personal Safety
Application" submitted by [Student Name], Roll No. [Roll No.], is a bonafide record
of work carried out under my supervision and guidance in partial fulfillment of the
requirements for the award of the degree of [Degree Name] from [University Name].

The work embodied in this report is original and has not been submitted for the award
of any other degree or diploma in any institution.

Guide / Supervisor: ___________________________
Name             : [Guide Name]
Designation      : [Designation]
Department       : [Department Name]
Date             : ___________________________

HOD Signature    : ___________________________
Name             : [HOD Name]
Date             : ___________________________

Principal Signature: ___________________________
Name             : [Principal Name]
Date             : ___________________________

================================================================================
                             ACKNOWLEDGMENT
================================================================================

I would like to express my sincere gratitude to my project guide [Guide Name] for
their invaluable guidance, constant encouragement, and constructive suggestions
throughout the development of this project.

I am deeply thankful to the Head of Department, [HOD Name], and the Principal,
[Principal Name], of [College Name] for providing the necessary infrastructure and
support to carry out this work.

I extend my thanks to all the faculty members of the [Department Name] department
for their continuous support and motivation.

I am also grateful to my family and friends for their moral support and
encouragement throughout this journey.

                                                        [Student Name]
                                                        [Roll Number]
                                                        [Date]

================================================================================
                               ABSTRACT
================================================================================

Rakshika is a full-stack web-based women's personal safety application designed to
provide real-time emergency assistance, location sharing, and safety awareness to
women in distress. The application addresses the growing need for accessible,
technology-driven safety tools by integrating multiple emergency response features
into a single, easy-to-use mobile-first platform.

The system enables users to trigger SOS alerts that instantly notify trusted
contacts via SMS, share live GPS location through a secure public link, discover
nearby safe zones such as police stations, hospitals, and bus stops using the
Google Places API, and simulate fake incoming calls to escape unsafe situations.
An AI-powered safety chatbot powered by Google Gemini provides real-time guidance
and can autonomously trigger safety actions based on natural language commands.

The frontend is built using React 19 with Vite, styled with Tailwind CSS, and
features smooth animations via Framer Motion. The backend is a Node.js/Express
REST API connected to a MongoDB database. Authentication is handled via JSON Web
Tokens (JWT). Third-party integrations include Twilio and Fast2SMS for SMS
delivery, Google Gemini AI for the chatbot, Google Maps Places API for safe zone
discovery, and Mapbox GL for interactive maps.

The application is designed with a mobile-first, dark-themed UI and supports
Progressive Web App (PWA) capabilities, making it accessible on any device without
installation.

================================================================================
                           TABLE OF CONTENTS
================================================================================

Chapter 1  – Introduction .................................................. 1
  1.1  Project Background
  1.2  Problem Statement
  1.3  Objectives
  1.4  Scope
  1.5  Purpose

Chapter 2  – Requirement & Analysis ....................................... 2
  2.1  Existing System
  2.2  Proposed System
  2.3  Hardware Requirements
  2.4  Software Requirements
  2.5  Functional Requirements
  2.6  Non-Functional Requirements

Chapter 3  – System Design ................................................. 3
  3.1  System Architecture
  3.2  Data Flow Diagram (DFD)
  3.3  Entity-Relationship (ER) Diagram
  3.4  Database Design
  3.5  Flowcharts

Chapter 4  – Implementation / Coding ...................................... 4
  4.1  Module Overview
  4.2  Authentication Module
  4.3  SOS Alert Module
  4.4  Live Location Module
  4.5  Trusted Contacts Module
  4.6  Safe Zones Module
  4.7  Fake Call Module
  4.8  AI Chat Assistant Module

Chapter 5  – Testing ....................................................... 5
  5.1  Testing Strategy
  5.2  Unit Testing
  5.3  Integration Testing
  5.4  System Testing
  5.5  Test Cases

Chapter 6  – Screenshots ................................................... 6

Chapter 7  – Conclusion & Future Enhancements ............................. 7
  7.1  Conclusion
  7.2  Future Enhancements

Bibliography / References .................................................. 8

================================================================================
                    CHAPTER 1 – INTRODUCTION
================================================================================

1.1 PROJECT BACKGROUND
-----------------------
Women's safety remains a critical concern in India and across the world. Despite
advances in technology, many women lack access to quick, reliable tools that can
help them in emergency situations. Traditional methods such as calling emergency
numbers or sending manual messages are often too slow or impractical in moments
of danger.

Rakshika (meaning "protector" in Sanskrit) is a technology-driven solution that
bridges this gap. It is a Progressive Web Application (PWA) that consolidates
multiple safety features into a single platform accessible from any smartphone
browser without requiring installation.

1.2 PROBLEM STATEMENT
---------------------
Women in unsafe situations often face the following challenges:
- Inability to quickly alert trusted contacts during emergencies
- Lack of awareness about nearby safe locations (police stations, hospitals)
- No discreet way to escape uncomfortable or dangerous situations
- Limited access to safety guidance in real time

1.3 OBJECTIVES
--------------
The primary objectives of the Rakshika application are:
1. To provide a one-tap SOS alert system that notifies trusted contacts via SMS
   with the user's live GPS location.
2. To enable real-time location sharing through a secure, shareable link.
3. To help users discover nearby safe zones including police stations, hospitals,
   and bus stops.
4. To offer a fake call feature that allows users to discreetly exit unsafe
   situations.
5. To provide an AI-powered safety chatbot for real-time guidance and assistance.
6. To maintain a trusted contacts list for emergency notifications.
7. To deliver a mobile-first, accessible, and intuitive user interface.

1.4 SCOPE
---------
The application is scoped for individual women users who require personal safety
tools. It covers:
- User registration and authentication
- Emergency SOS with SMS notification
- Live GPS location sharing
- Nearby safe place discovery
- Fake call simulation
- AI-based safety chat
- Trusted contact management
- Awareness and onboarding content

The application is designed for use in India, with SMS support via Fast2SMS for
Indian mobile numbers, and falls back to Twilio for international numbers.

1.5 PURPOSE
-----------
The purpose of Rakshika is to empower women with technology that can potentially
save lives. By combining real-time communication, location services, and AI
assistance into a single accessible platform, Rakshika aims to reduce response
time in emergencies and increase the sense of security for women in daily life.

================================================================================
                  CHAPTER 2 – REQUIREMENT & ANALYSIS
================================================================================

2.1 EXISTING SYSTEM
-------------------
Currently available safety solutions include:
- Government helpline numbers (112, 100, 108, 1091, 181, 1098) which require
  manual dialing and verbal communication — impractical in silent emergencies.
- Standalone GPS tracking apps that only share location without alerting contacts.
- Basic SOS apps that send alerts but lack AI assistance or safe zone discovery.
- No single platform integrates SOS, live tracking, fake call, AI chat, and safe
  zone discovery together.

Limitations of existing systems:
- Require active internet and manual interaction
- No AI-based guidance
- No fake call feature for discreet escape
- No integrated safe zone map
- Poor UI/UX for emergency scenarios

2.2 PROPOSED SYSTEM
-------------------
Rakshika proposes an integrated safety platform with the following capabilities:
- One-tap SOS with 5-second countdown (to prevent accidental triggers)
- Automatic SMS alerts to all trusted contacts with Google Maps location link
- Live location sharing via a public, shareable URL
- Google Places API integration for nearby police, hospitals, and bus stops
- Fake call simulation with voice message playback in Hindi
- Google Gemini AI chatbot for safety guidance and command execution
- JWT-secured user accounts with encrypted password storage
- Mobile-first PWA design accessible on any device

2.3 HARDWARE REQUIREMENTS
-------------------------
Minimum (Client Device):
- Smartphone or computer with a modern web browser
- GPS/Location services enabled
- Internet connectivity (Wi-Fi or mobile data)
- Microphone (optional, for voice features)
- Speaker/Headphones (for fake call audio)

Server (Deployment):
- CPU: 1 vCPU or higher
- RAM: 512 MB minimum (1 GB recommended)
- Storage: 10 GB SSD
- Network: Stable internet connection with open ports 80/443/5000

2.4 SOFTWARE REQUIREMENTS
-------------------------
Frontend:
- React 19.2.4
- Vite 8.0.0 (build tool)
- React Router DOM 7.13.1
- Tailwind CSS 4.2.1
- Framer Motion 12.36.0
- Mapbox GL 3.20.0
- Lucide React 0.577.0
- Axios 1.13.6
- Howler 2.2.4 (audio)

Backend:
- Node.js (v18+)
- Express 5.2.1
- Mongoose 9.3.0
- MongoDB 6.0+
- bcryptjs 3.0.3
- jsonwebtoken 9.0.3
- Nodemailer 8.0.2
- Twilio SDK 5.13.0
- @google/generative-ai 0.24.1

External APIs:
- Google Maps Places API (safe zone discovery)
- Google Gemini AI API (chatbot)
- Twilio API (SMS/WhatsApp)
- Fast2SMS API (Indian SMS)
- Mapbox API (interactive maps)

Development Tools:
- VS Code / Kiro IDE
- Git & GitHub
- Postman (API testing)
- Vitest + React Testing Library (unit testing)

2.5 FUNCTIONAL REQUIREMENTS
----------------------------
FR-01: Users shall be able to register with name, email, and password.
FR-02: Users shall be able to log in and receive a JWT token valid for 7 days.
FR-03: Users shall be able to add, view, and delete trusted contacts.
FR-04: Users shall be able to trigger an SOS alert with a 5-second countdown.
FR-05: SOS shall send SMS to all trusted contacts with GPS coordinates and a
       live tracking link.
FR-06: Users shall be able to share their live location via a public URL.
FR-07: The live location page shall auto-refresh every 15 seconds.
FR-08: Users shall be able to find nearby police stations, hospitals, and bus
       stops within a 2 km radius.
FR-09: Users shall be able to trigger a fake incoming call with selectable
       caller identity and delay.
FR-10: The AI chatbot shall respond to safety queries and execute commands
       such as SOS trigger, location share, and navigation to safe zones.

2.6 NON-FUNCTIONAL REQUIREMENTS
---------------------------------
NFR-01: The application shall load within 3 seconds on a 4G connection.
NFR-02: Passwords shall be hashed using bcrypt with a salt factor of 10.
NFR-03: All API routes (except /auth and /share) shall require JWT authentication.
NFR-04: The application shall be responsive and mobile-first.
NFR-05: The system shall support a mock mode for development without MongoDB.
NFR-06: SMS delivery shall fall back from Fast2SMS to Twilio if needed.
NFR-07: The application shall function as a PWA and be installable on mobile.

================================================================================
                     CHAPTER 3 – SYSTEM DESIGN
================================================================================

3.1 SYSTEM ARCHITECTURE
------------------------
Rakshika follows a standard three-tier client-server architecture:

  ┌─────────────────────────────────────────────────────────┐
  │                    CLIENT (Browser/PWA)                  │
  │   React 19 + Vite + Tailwind CSS + Mapbox GL            │
  │   Pages: Dashboard, Contacts, SafeZones, FakeCall,      │
  │           Share, Login, Register, Awareness             │
  └──────────────────────┬──────────────────────────────────┘
                         │ HTTPS / REST API (Axios)
  ┌──────────────────────▼──────────────────────────────────┐
  │                  SERVER (Node.js / Express)              │
  │   Routes: /auth  /contacts  /location  /sos             │
  │           /share  /places  /chat                        │
  │   Middleware: JWT Auth                                   │
  └──────┬──────────────┬──────────────────┬────────────────┘
         │              │                  │
  ┌──────▼──────┐ ┌─────▼──────┐  ┌───────▼──────────────┐
  │  MongoDB    │ │ Google     │  │ Twilio / Fast2SMS /   │
  │  (Mongoose) │ │ Gemini AI  │  │ Nodemailer / Maps API │
  └─────────────┘ └────────────┘  └──────────────────────┘

3.2 DATA FLOW DIAGRAM (DFD)
----------------------------

LEVEL 0 – CONTEXT DIAGRAM:

  [User] ──── (inputs/requests) ────► [RAKSHIKA SYSTEM] ────► [Trusted Contacts]
                                              │
                                              ▼
                                    [External Services]
                              (SMS, AI, Maps, Email)

LEVEL 1 – DFD:

  [User]
    │
    ├──► [1.0 Authentication] ──► [User DB]
    │         └── JWT Token ──► User
    │
    ├──► [2.0 SOS Alert]
    │         ├── Read Contacts ──► [Contact DB]
    │         ├── Get Location ──► [Location DB]
    │         └── Send SMS ──► [Twilio/Fast2SMS] ──► [Trusted Contacts]
    │
    ├──► [3.0 Location Sharing]
    │         ├── Save Location ──► [Location DB]
    │         └── Public Share Link ──► [Anyone with link]
    │
    ├──► [4.0 Safe Zone Discovery]
    │         ├── Get GPS ──► User Device
    │         └── Query Places ──► [Google Maps API] ──► Results
    │
    ├──► [5.0 Fake Call]
    │         └── Local browser simulation (no server call)
    │
    └──► [6.0 AI Chat]
              ├── Send Message ──► [Gemini AI API]
              └── Response ──► User

3.3 ENTITY-RELATIONSHIP (ER) DIAGRAM
--------------------------------------

  ┌──────────────┐         ┌──────────────────┐        ┌──────────────────┐
  │    USER      │         │    CONTACT       │        │    LOCATION      │
  ├──────────────┤         ├──────────────────┤        ├──────────────────┤
  │ _id (PK)     │◄────────│ userId (FK)      │        │ _id (PK)         │
  │ name         │  1:N    │ _id (PK)         │        │ userId (FK) ─────┤──► USER
  │ email        │         │ name             │        │ lat              │
  │ password     │         │ phone            │        │ lng              │
  │ createdAt    │         │ createdAt        │        │ accuracy         │
  │ updatedAt    │         │ updatedAt        │        │ isLive           │
  └──────────────┘         └──────────────────┘        │ createdAt        │
                                                        │ updatedAt        │
                                                        └──────────────────┘

  Relationships:
  - One USER has many CONTACTs (1:N)
  - One USER has many LOCATIONs (1:N)

3.4 DATABASE DESIGN
--------------------

Collection: users
┌────────────┬──────────┬──────────────────────────────────────┐
│ Field      │ Type     │ Description                          │
├────────────┼──────────┼──────────────────────────────────────┤
│ _id        │ ObjectId │ Auto-generated primary key           │
│ name       │ String   │ Full name of the user (required)     │
│ email      │ String   │ Unique email address (indexed)       │
│ password   │ String   │ bcrypt hashed password               │
│ createdAt  │ Date     │ Auto timestamp                       │
│ updatedAt  │ Date     │ Auto timestamp                       │
└────────────┴──────────┴──────────────────────────────────────┘

Collection: contacts
┌────────────┬──────────┬──────────────────────────────────────┐
│ Field      │ Type     │ Description                          │
├────────────┼──────────┼──────────────────────────────────────┤
│ _id        │ ObjectId │ Auto-generated primary key           │
│ userId     │ ObjectId │ Reference to User (indexed)          │
│ name       │ String   │ Contact's name (required)            │
│ phone      │ String   │ Contact's phone number (required)    │
│ createdAt  │ Date     │ Auto timestamp                       │
│ updatedAt  │ Date     │ Auto timestamp                       │
└────────────┴──────────┴──────────────────────────────────────┘

Collection: locations
┌────────────┬──────────┬──────────────────────────────────────┐
│ Field      │ Type     │ Description                          │
├────────────┼──────────┼──────────────────────────────────────┤
│ _id        │ ObjectId │ Auto-generated primary key           │
│ userId     │ ObjectId │ Reference to User (indexed)          │
│ lat        │ Number   │ Latitude coordinate (required)       │
│ lng        │ Number   │ Longitude coordinate (required)      │
│ accuracy   │ Number   │ GPS accuracy in meters               │
│ isLive     │ Boolean  │ Whether location is being shared     │
│ createdAt  │ Date     │ Auto timestamp                       │
│ updatedAt  │ Date     │ Auto timestamp                       │
└────────────┴──────────┴──────────────────────────────────────┘

3.5 FLOWCHARTS
--------------

SOS ALERT FLOWCHART:
  START
    │
    ▼
  User taps SOS button
    │
    ▼
  5-second countdown begins
    │
    ▼
  Did user cancel? ──YES──► Cancel SOS ──► END
    │ NO
    ▼
  Get current GPS coordinates
    │
    ▼
  Fetch trusted contacts from DB
    │
    ▼
  Contacts found? ──NO──► Log warning, send email fallback
    │ YES
    ▼
  Send SMS to each contact (Fast2SMS / Twilio)
  Message: "SOS ALERT! I need help. Location: [Google Maps Link] Track: [Live Link]"
    │
    ▼
  Send fallback email (if FALLBACK_ALERT_EMAIL set)
    │
    ▼
  Return success response to client
    │
    ▼
  END

USER AUTHENTICATION FLOWCHART:
  START
    │
    ▼
  User submits login form (email + password)
    │
    ▼
  Find user by email in DB
    │
    ▼
  User exists? ──NO──► Return "Invalid credentials" error
    │ YES
    ▼
  Compare password with bcrypt hash
    │
    ▼
  Password match? ──NO──► Return "Invalid credentials" error
    │ YES
    ▼
  Generate JWT token (expires in 7 days)
    │
    ▼
  Return token + user object to client
    │
    ▼
  Client stores token in localStorage
    │
    ▼
  Redirect to Dashboard
    │
    ▼
  END

================================================================================
                  CHAPTER 4 – IMPLEMENTATION / CODING
================================================================================

4.1 MODULE OVERVIEW
--------------------
The application is divided into the following modules:

Module 1: Authentication (Login / Register)
Module 2: Dashboard (SOS, Location, Chat, Check-in)
Module 3: Trusted Contacts Management
Module 4: Safe Zone Discovery
Module 5: Fake Call Simulation
Module 6: Live Location Sharing
Module 7: AI Chat Assistant
Module 8: Awareness / Onboarding

4.2 AUTHENTICATION MODULE
--------------------------
File: server/routes/auth.js

The authentication module handles user registration and login using bcrypt for
password hashing and JWT for session management.

-- Registration Endpoint --
POST /auth/register

  const { name, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hash });
  const token = jwt.sign(
    { id: user._id, email },
    process.env.JWT_SECRET || 'dev_secret',
    { expiresIn: '7d' }
  );
  res.json({ token, user: { id: user._id, name, email } });

-- Login Endpoint --
POST /auth/login

  const user = await User.findOne({ email });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user._id, email }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user._id, name: user.name, email } });

-- JWT Middleware --
File: server/middleware/auth.js

  const token = req.headers.authorization?.slice(7);
  const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
  req.user = { id: payload.id, email: payload.email };
  next();

4.3 SOS ALERT MODULE
---------------------
File: server/routes/sos.js

The SOS module retrieves all trusted contacts for the authenticated user and
sends an SMS alert with the user's GPS coordinates and a live tracking link.

  router.post('/trigger', async (req, res) => {
    const { lat, lng } = req.body;
    const contacts = await Contact.find({ userId: req.user.id });
    const phones = contacts.map(c => c.phone);
    const liveLink = `${process.env.CLIENT_ORIGIN}/share/${req.user.id}`;
    const googleLink = `https://maps.google.com/?q=${lat},${lng}`;
    const message = `SOS ALERT! I need help. Location: ${googleLink} Track: ${liveLink}`;

    for (const phone of phones) {
      await sendSMS(phone, message);
    }
    res.json({ ok: true, notified: phones.length, liveLink });
  });

-- SMS Utility (Fast2SMS / Twilio fallback) --
File: server/utils/twilio.js

  async function sendSMS(to, body) {
    if (process.env.FAST2SMS_API_KEY) {
      // Send via Fast2SMS (Indian numbers)
      const mobile = toIndianMobile(to);
      await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: { authorization: process.env.FAST2SMS_API_KEY },
        body: JSON.stringify({ message: body, route: 'q', numbers: mobile })
      });
    } else {
      // Fallback to Twilio
      const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      await client.messages.create({ from: process.env.TWILIO_PHONE_NUMBER, to, body });
    }
  }

4.4 LIVE LOCATION MODULE
-------------------------
File: client/src/pages/Dashboard.jsx (useGeolocation hook)
File: server/routes/location.js

The geolocation hook uses the browser's Geolocation API to watch the user's
position in real time and push updates to the server.

  function useGeolocation() {
    const [pos, setPos] = useState(null);
    const watchId = useRef(null);

    function startWatch(onUpdate) {
      watchId.current = navigator.geolocation.watchPosition(
        (p) => {
          const coords = { lat: p.coords.latitude, lng: p.coords.longitude };
          setPos(coords);
          onUpdate?.(coords);
        },
        (e) => setError(e.message),
        { enableHighAccuracy: true, maximumAge: 10000 }
      );
    }
    return { pos, startWatch, stopWatch };
  }

The Share page polls the server every 15 seconds to display the latest location:

  useEffect(() => {
    load();
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
  }, [userId]);

4.5 TRUSTED CONTACTS MODULE
-----------------------------
File: client/src/pages/TrustedContacts.jsx
File: server/routes/contacts.js

Users can add contacts with a name and 10-digit phone number. Contacts are
stored in MongoDB and retrieved on page load.

  // Add contact
  await api.post('/contacts', { name, phone });

  // Delete contact
  await api.delete(`/contacts/${id}`);

  // Load contacts
  const { data } = await api.get('/contacts');
  setItems(data);

4.6 SAFE ZONES MODULE
----------------------
File: client/src/pages/SafeRoute.jsx
File: server/routes/places.js

The safe zones module queries the Google Places API for nearby police stations,
hospitals, and bus stops within a 2 km radius of the user's current location.

  async function loadNearby() {
    for (const type of ['police', 'hospital', 'bus_station']) {
      const { data } = await api.get(
        `/places/nearby?lat=${pos.lat}&lng=${pos.lng}&radius=2000&type=${type}`
      );
      // Map results and calculate distance using Haversine formula
    }
    results.sort((a, b) => a.distance - b.distance);
    setPlaces(results);
  }

  // Haversine distance formula
  function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 +
              Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) *
              Math.sin(dLon/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }

4.7 FAKE CALL MODULE
---------------------
File: client/src/pages/FakeCall.jsx

The fake call module simulates a realistic incoming call entirely in the browser
using the Web Audio API and Web Speech API. No server call is made.

  function triggerCall() {
    setIncoming(true);
    ringtone.current = new Audio('https://www.soundjay.com/phone/phone-calling-1.mp3');
    ringtone.current.loop = true;
    ringtone.current.play();
  }

  function answer() {
    setTalking(true);
    ringtone.current?.pause();
    const script = scripts[callerType][Math.floor(Math.random() * scripts[callerType].length)];
    const u = new SpeechSynthesisUtterance(script);
    u.lang = 'hi-IN';
    window.speechSynthesis.speak(u);
  }

  // Caller scripts (Hindi)
  const scripts = {
    papa:  ['Beta main bahar hoon, 2 minute mein pahunch raha hoon.'],
    mummy: ['Beta main paas hoon, tension mat lo.'],
  };

4.8 AI CHAT ASSISTANT MODULE
------------------------------
File: server/routes/chat.js

The AI chat module uses Google Gemini 1.5 Flash with a custom system prompt
tailored for women's safety guidance.

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const chat = model.startChat({
    history: sanitizedHistory,
    systemInstruction:
      "You are Rakshika, a safety assistant for women. Your goal is to provide " +
      "safety advice and help users in distress. You can understand commands like " +
      "'send SOS', 'share location', 'find safe zones', or 'trigger a fake call'. " +
      "Keep your responses concise, empathetic, and focused on safety."
  });
  const result = await chat.sendMessage(message);
  res.json({ reply: result.response.text() });

The frontend also handles local commands before sending to AI:

  if (lower.includes('sos') || lower.includes('emergency')) {
    onSOS?.();  // Trigger SOS directly
  } else if (lower.includes('fake') || lower.includes('call')) {
    navigate('/fake-call');
  }

================================================================================
                         CHAPTER 5 – TESTING
================================================================================

5.1 TESTING STRATEGY
---------------------
The Rakshika application was tested using a combination of:
- Unit Testing: Individual components and utility functions
- Integration Testing: API endpoints with database interactions
- System Testing: End-to-end user flows
- Manual Testing: UI/UX validation on mobile and desktop browsers

Testing tools used:
- Vitest (test runner)
- React Testing Library (component testing)
- jsdom (DOM simulation)
- Postman (API endpoint testing)

5.2 UNIT TESTING
-----------------
Unit tests were written for critical frontend components using Vitest and
React Testing Library. Tests are located in:
  client/src/pages/Dashboard.bug-exploration.test.jsx
  client/src/pages/Dashboard.preservation.test.jsx

Key areas tested:
- Dashboard renders without crashing
- SOS button is present and clickable
- Geolocation hook returns correct state
- Authentication context provides correct values
- Contact list renders correctly

5.3 INTEGRATION TESTING
------------------------
API endpoints were tested using Postman and automated tests:

POST /auth/register
  - Input: { name, email, password }
  - Expected: 200 OK with JWT token
  - Tested: Duplicate email returns 400 error

POST /auth/login
  - Input: { email, password }
  - Expected: 200 OK with JWT token
  - Tested: Wrong password returns 400 error

POST /sos/trigger
  - Input: { lat, lng } with valid JWT
  - Expected: 200 OK with notified count
  - Tested: Missing token returns 401

GET /contacts
  - Input: Valid JWT header
  - Expected: Array of contacts for user
  - Tested: Returns empty array for new user

POST /contacts
  - Input: { name, phone } with valid JWT
  - Expected: 201 Created with contact object
