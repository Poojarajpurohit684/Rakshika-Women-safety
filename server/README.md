================================================================================
                    RAKSHIKA – WOMEN'S PERSONAL SAFETY APPLICATION
                           FULL PROJECT REPORT
================================================================================

Submitted in partial fulfillment of the requirements for the award of the degree of
                    Bachelor of Computer Applications / B.Tech (CSE)

Project Title      : Rakshika – Women's Personal Safety Application
Student Name       : [Your Full Name]
Roll Number        : [Your Roll Number]
Department         : [Department Name]
University/College : [University / College Name]
Academic Year      : 2025–2026
Guide Name         : [Guide Name]

================================================================================
                              CERTIFICATE
================================================================================

ORIGINALITY CERTIFICATE

This is to certify that the project entitled "Rakshika – Women's Personal Safety
Application" submitted by [Student Name], Roll No. [Roll No.], is a bonafide
record of original work carried out under my supervision and guidance in partial
fulfillment of the requirements for the award of the degree of [Degree Name] from
[University Name].

The work embodied in this report is original and has not been submitted for the
award of any other degree or diploma in any institution, university, or college.
To the best of my knowledge and belief, the matter presented in this report has
not been copied from any source. Wherever information has been derived from other
sources, it has been duly acknowledged.

Guide / Supervisor  : ___________________________
Name                : [Guide Name]
Designation         : Assistant Professor / Professor
Department          : [Department Name]
Institution         : [College Name]
Date                : ___________________________

Head of Department  : ___________________________
Name                : [HOD Name]
Department          : [Department Name]
Date                : ___________________________

Principal           : ___________________________
Name                : [Principal Name]
Institution         : [College Name]
Date                : ___________________________

(Official Seal / Stamp of the Institution)

================================================================================
                             ACKNOWLEDGMENT
================================================================================

I take this opportunity to express my profound gratitude and deep regards to my
project guide, [Guide Name], [Designation], Department of [Department Name],
[College Name], for their exemplary guidance, monitoring, and constant
encouragement throughout the course of this project. The blessing, help, and
guidance given by them from time to time shall carry me a long way in the journey
of life on which I am about to embark.

I also take this opportunity to express a deep sense of gratitude to the Head of
Department, [HOD Name], for their cordial support, valuable information, and
guidance, which helped me in completing this task through various stages.

I am obliged to the staff members of the [Department Name] Department for the
valuable information provided by them in their respective fields. I am grateful
for their cooperation during the period of my project work.

I would like to thank the Principal, [Principal Name], of [College Name], for
providing the necessary infrastructure, laboratory facilities, and a conducive
environment for the successful completion of this project.

I am also thankful to my parents, family members, and friends for their
unwavering moral support, patience, and encouragement throughout the duration
of this project.

Last but not least, I thank the Almighty for giving me the strength, wisdom, and
perseverance to complete this project successfully.

                                                        [Student Name]
                                                        Roll No: [Roll Number]
                                                        [Department Name]
                                                        [College Name]
                                                        Date: [Date]

================================================================================
                               ABSTRACT
================================================================================

Women's safety is one of the most pressing social challenges in contemporary
India. Despite the proliferation of smartphones and internet connectivity, women
in distress often lack access to fast, reliable, and discreet tools that can help
them during emergencies. Existing solutions are fragmented — some offer only GPS
tracking, others only helpline numbers — and none provide a unified, intelligent
safety platform.

Rakshika (Sanskrit: "Protector") is a full-stack, mobile-first Progressive Web
Application (PWA) designed to address this gap. The application integrates seven
core safety features into a single, intuitive platform: (1) one-tap SOS emergency
alerts with real-time GPS coordinates sent via SMS to trusted contacts, (2) live
location sharing through a secure, publicly accessible URL, (3) nearby safe zone
discovery using the Google Places API to locate police stations, hospitals, and
bus stops within a 2 km radius, (4) a fake incoming call simulator to help users
discreetly exit unsafe situations, (5) an AI-powered safety chatbot using Google
Gemini 1.5 Flash that provides real-time guidance and can autonomously execute
safety commands, (6) a trusted contacts management system, and (7) an awareness
and onboarding carousel with safety education content.

The frontend is developed using React 19 with Vite as the build tool, styled with
Tailwind CSS 4, and enhanced with Framer Motion animations and Mapbox GL for
interactive maps. The backend is a RESTful API built with Node.js and Express 5,
connected to a MongoDB database via Mongoose 9. User authentication is secured
using JSON Web Tokens (JWT) with bcrypt password hashing. SMS notifications are
delivered via Fast2SMS (primary, for Indian numbers) with Twilio as a fallback.
Email alerts are sent via Nodemailer. The application supports a mock/development
mode with in-memory storage, eliminating the need for a live database during
testing.

The system was tested using Vitest and React Testing Library for unit and
integration tests, and manually validated across mobile and desktop browsers.
The application is designed to be installable as a PWA, making it accessible
without requiring an app store download.

Keywords: Women Safety, SOS Alert, Live Location Sharing, React, Node.js,
MongoDB, Google Gemini AI, Twilio, Fast2SMS, Progressive Web App, GPS Tracking,
Safe Zone Discovery, Fake Call, JWT Authentication.

================================================================================
                           TABLE OF CONTENTS
================================================================================

Chapter 1  – Introduction .................................................. 1
  1.1  Project Background .................................................. 1
  1.2  Problem Statement ................................................... 2
  1.3  Objectives .......................................................... 2
  1.4  Scope of the Project ................................................ 3
  1.5  Purpose and Significance ............................................ 3
  1.6  Organization of the Report .......................................... 4

Chapter 2  – Literature Survey / Review .................................... 5
  2.1  Existing Safety Applications ........................................ 5
  2.2  Limitations of Existing Systems ..................................... 6
  2.3  Research Gap ........................................................ 6

Chapter 3  – Requirement & Analysis ........................................ 7
  3.1  Existing System ..................................................... 7
  3.2  Proposed System ..................................................... 7
  3.3  Hardware Requirements ............................................... 8
  3.4  Software Requirements ............................................... 8
  3.5  Functional Requirements ............................................. 9
  3.6  Non-Functional Requirements ......................................... 10

Chapter 4  – System Design ................................................. 11
  4.1  System Architecture ................................................. 11
  4.2  Data Flow Diagram (DFD) – Level 0 ................................... 12
  4.3  Data Flow Diagram (DFD) – Level 1 ................................... 12
  4.4  Entity-Relationship (ER) Diagram .................................... 13
  4.5  Database Design ..................................................... 14
  4.6  API Design .......................................................... 15
  4.7  Flowcharts .......................................................... 16

Chapter 5  – Implementation / Coding ....................................... 18
  5.1  Module Overview ..................................................... 18
  5.2  Project Structure ................................................... 18
  5.3  Authentication Module ............................................... 19
  5.4  Dashboard & SOS Alert Module ........................................ 21
  5.5  Live Location Module ................................................ 24
  5.6  Trusted Contacts Module ............................................. 25
  5.7  Safe Zones Module ................................................... 27
  5.8  Fake Call Module .................................................... 29
  5.9  AI Chat Assistant Module ............................................ 31
  5.10 Live Share Module ................................................... 33
  5.11 Awareness / Onboarding Module ....................................... 34
  5.12 Frontend Routing & Auth Context ..................................... 34

Chapter 6  – Testing ....................................................... 36
  6.1  Testing Strategy .................................................... 36
  6.2  Unit Testing ........................................................ 36
  6.3  Integration Testing ................................................. 37
  6.4  System Testing ...................................................... 39
  6.5  Test Cases .......................................................... 40
  6.6  Test Results Summary ................................................ 43

Chapter 7  – Screenshots ................................................... 44
  7.1  Login / Register Screen ............................................. 44
  7.2  Dashboard / Home Screen ............................................. 44
  7.3  SOS Alert Trigger ................................................... 44
  7.4  Trusted Contacts Screen ............................................. 44
  7.5  Safe Zones Screen ................................................... 44
  7.6  Fake Call Screen .................................................... 44
  7.7  AI Chat Assistant ................................................... 44
  7.8  Live Location Share Screen .......................................... 44
  7.9  Awareness Carousel .................................................. 44

Chapter 8  – Conclusion & Future Enhancements .............................. 45
  8.1  Conclusion .......................................................... 45
  8.2  Limitations ......................................................... 45
  8.3  Future Enhancements ................................................. 46

Bibliography / References .................................................. 47

================================================================================
                    CHAPTER 1 – INTRODUCTION
================================================================================

1.1 PROJECT BACKGROUND
-----------------------
India ranks among the countries with the highest reported incidents of crimes
against women. According to the National Crime Records Bureau (NCRB), crimes
against women in India have been consistently rising, with over 4.45 lakh cases
registered in 2022 alone. Despite the widespread availability of smartphones —
with over 750 million smartphone users in India as of 2024 — there is a
significant lack of accessible, integrated, and intelligent safety tools designed
specifically for women.

The existing landscape of women's safety technology is fragmented. Government
helplines such as 112 (Emergency), 100 (Police), 108 (Ambulance), 1091 (Women
Helpline), 181 (Women in Distress), and 1098 (Child Helpline) require the user
to make a voice call — which is often impossible in situations where silence is
critical. Standalone GPS tracking apps share location but do not alert contacts.
Basic SOS apps send alerts but lack AI guidance, safe zone discovery, or discreet
escape mechanisms.

Rakshika was conceived to address all these gaps in a single, unified platform.
The name "Rakshika" is derived from Sanskrit, meaning "one who protects." The
application is built as a Progressive Web App (PWA), meaning it can be accessed
from any modern smartphone browser without requiring installation from an app
store, making it immediately accessible to anyone with a smartphone and internet
connection.

The project was developed using modern web technologies: React 19 on the frontend,
Node.js/Express on the backend, MongoDB as the database, and integrations with
Google Gemini AI, Google Maps Places API, Twilio, Fast2SMS, and Mapbox GL.

1.2 PROBLEM STATEMENT
---------------------
Women in unsafe or threatening situations face the following critical challenges:

1. Speed of Response: Traditional emergency methods (calling 112, sending a
   manual WhatsApp message) require multiple steps and are too slow in a crisis.

2. Silence Requirement: In many dangerous situations, making a phone call or
   speaking is not possible. A discreet, one-tap solution is needed.

3. Location Awareness: Victims and their contacts often do not know the exact
   location of the person in distress, delaying rescue.

4. Lack of Nearby Help Information: Women are often unaware of the nearest
   police station, hospital, or safe public space.

5. No Discreet Escape Mechanism: There is no widely available tool that allows
   a woman to create a believable excuse (such as a fake phone call) to exit
   an uncomfortable situation.

6. Fragmented Tools: No single application combines SOS alerts, live tracking,
   safe zone discovery, fake calls, and AI guidance in one place.

1.3 OBJECTIVES
--------------
The primary objectives of the Rakshika application are:

Objective 1: Emergency SOS System
  - Implement a one-tap SOS button with a 5-second countdown to prevent
    accidental triggers.
  - Automatically send SMS alerts to all trusted contacts containing the user's
    GPS coordinates as a Google Maps link and a live tracking URL.
  - Support email fallback alerts via Nodemailer.

Objective 2: Live Location Sharing
  - Enable real-time GPS location tracking using the browser's Geolocation API.
  - Generate a unique, publicly accessible URL for each user that displays their
    live location on an interactive map, refreshing every 15 seconds.

Objective 3: Safe Zone Discovery
  - Integrate the Google Places API to find nearby police stations, hospitals,
    and bus stops within a configurable radius (default: 2 km).
  - Display results on an interactive Mapbox GL map with distance, rating, and
    direct navigation links to Google Maps.

Objective 4: Fake Call Simulator
  - Provide a realistic fake incoming call interface with selectable caller
    identity (Papa / Mummy) and configurable delay (0s, 10s, 30s, 1 min).
  - Play a pre-scripted Hindi voice message using the Web Speech API upon
    answering the call.

Objective 5: AI Safety Chatbot
  - Integrate Google Gemini 1.5 Flash with a custom safety-focused system prompt.
  - Enable the chatbot to understand natural language safety commands and
    autonomously trigger SOS, location sharing, navigation, or fake call.

Objective 6: Trusted Contacts Management
  - Allow users to add, view, and delete trusted emergency contacts with name
    and phone number.
  - Store contacts securely in MongoDB, associated with the authenticated user.

Objective 7: User Authentication
  - Implement secure user registration and login with bcrypt password hashing
    and JWT-based session management.

Objective 8: Awareness & Onboarding
  - Provide an educational story carousel that introduces users to the app's
    features and safety best practices.

1.4 SCOPE OF THE PROJECT
------------------------
The Rakshika application is scoped as follows:

IN SCOPE:
- Web-based application accessible on any modern browser (Chrome, Firefox,
  Safari, Edge) on mobile and desktop devices.
- User registration, login, and profile management.
- SOS alert system with SMS delivery via Fast2SMS (India) and Twilio (global).
- Real-time GPS location tracking and sharing.
- Nearby safe zone discovery using Google Places API.
- Fake call simulation using browser-native Web Audio and Web Speech APIs.
- AI-powered safety chatbot using Google Gemini 1.5 Flash.
- Trusted contacts management (add, view, delete).
- Dark-themed, mobile-first responsive UI.
- PWA support for installability on mobile devices.
- Mock/development mode with in-memory storage (no MongoDB required).

OUT OF SCOPE:
- Native Android/iOS mobile application (this is a PWA, not a native app).
- Video calling or live video streaming.
- Integration with government emergency dispatch systems.
- Offline functionality (requires internet connection).
- Multi-language UI (currently English with Hindi voice scripts).
- Payment gateway or subscription model.

1.5 PURPOSE AND SIGNIFICANCE
-----------------------------
The purpose of Rakshika is to empower women with a technology tool that is:

ACCESSIBLE: As a PWA, it requires no installation and works on any smartphone
with a browser and internet connection, making it available to the widest
possible audience.

FAST: The SOS system is designed for speed — a single tap initiates a 5-second
countdown, after which alerts are automatically sent without any further
interaction from the user.

DISCREET: The fake call feature and AI chat allow users to take safety actions
without drawing attention to themselves.

INTELLIGENT: The Google Gemini AI integration means users can describe their
situation in natural language and receive contextual guidance, rather than
having to navigate menus under stress.

COMPREHENSIVE: By combining SOS, live tracking, safe zone discovery, fake calls,
and AI guidance in one platform, Rakshika eliminates the need for multiple apps.

The significance of this project lies in its potential to reduce emergency
response time, increase situational awareness for both the user and their trusted
contacts, and provide a discreet, intelligent safety companion for women in their
daily lives.

1.6 ORGANIZATION OF THE REPORT
--------------------------------
This report is organized as follows:
- Chapter 2 presents a literature survey of existing safety applications.
- Chapter 3 covers requirements analysis including hardware, software, functional,
  and non-functional requirements.
- Chapter 4 describes the system design including architecture, DFDs, ER diagrams,
  database design, and flowcharts.
- Chapter 5 details the implementation with key code snippets for each module.
- Chapter 6 covers the testing strategy, test cases, and results.
- Chapter 7 presents screenshots of the application.
- Chapter 8 concludes the report and discusses future enhancements.

================================================================================
               CHAPTER 2 – LITERATURE SURVEY / REVIEW
================================================================================

2.1 EXISTING SAFETY APPLICATIONS
----------------------------------
Several women's safety applications have been developed and deployed in India
and globally. A brief review of notable existing systems is presented below:

1. Nirbhaya App (Government of India):
   - Launched by the Ministry of Women and Child Development.
   - Features: SOS button, GPS tracking, fake call.
   - Limitations: Requires installation, outdated UI, limited AI features,
     no live location sharing link.

2. Himmat App (Delhi Police):
   - Developed by Delhi Police for women's safety.
   - Features: SOS alert to police control room, GPS tracking.
   - Limitations: Only available in Delhi, requires registration with police,
     no trusted contacts management, no AI chatbot.

3. bSafe:
   - International safety app with SOS, live GPS, and fake call features.
   - Limitations: Subscription-based, not optimized for Indian SMS providers,
     no AI integration, requires native app installation.

4. Shake2Safety:
   - Triggers SOS by shaking the phone.
   - Limitations: Single feature, no location sharing, no AI, no safe zones.

5. Google Maps (Safe Routing):
   - Provides navigation but not specifically designed for emergency scenarios.
   - No SOS, no trusted contacts, no AI safety guidance.

6. WhatsApp Live Location:
   - Allows sharing live location with contacts.
   - Limitations: Requires the contact to have WhatsApp, manual process,
     no SOS, no safe zone discovery, no AI.

2.2 LIMITATIONS OF EXISTING SYSTEMS
-------------------------------------
After reviewing existing solutions, the following common limitations were
identified:

1. Fragmentation: No single app combines SOS + live tracking + safe zones +
   fake call + AI chatbot in one platform.

2. Installation Barrier: Most apps require installation from an app store,
   which takes time and storage space.

3. No AI Integration: None of the reviewed apps use conversational AI to
   provide real-time guidance or execute commands via natural language.

4. Indian SMS Compatibility: Most international apps use Twilio, which requires
   a paid upgrade to send SMS to Indian numbers. Rakshika uses Fast2SMS as the
   primary provider, which works natively with Indian numbers.

5. Poor UI/UX for Emergency: Many existing apps have complex interfaces that
   are difficult to navigate under stress. Rakshika uses a minimal, one-tap
   design optimized for emergency use.

6. No Public Live Tracking Link: Most apps require the recipient to also have
   the app installed to view the location. Rakshika generates a public URL
   that anyone can open in a browser.

2.3 RESEARCH GAP
-----------------
The research gap addressed by Rakshika is the absence of a unified, intelligent,
accessible, and India-optimized women's safety platform that:
- Works as a PWA (no installation required)
- Integrates AI for natural language safety guidance
- Uses Indian SMS providers (Fast2SMS) for reliable delivery
- Provides a public live location link (no app required for recipients)
- Combines all major safety features in a single, fast, mobile-first interface

================================================================================
                  CHAPTER 3 – REQUIREMENT & ANALYSIS
================================================================================

3.1 EXISTING SYSTEM
-------------------
The existing approach to women's safety in India relies on:

1. Government Helplines: 112 (Emergency), 100 (Police), 108 (Ambulance),
   1091 (Women Helpline), 181 (Women in Distress), 1098 (Child Helpline).
   These require the user to make a voice call, which is impractical in
   situations requiring silence or when the user is unable to speak.

2. Manual Messaging: Sending location via WhatsApp or SMS manually. This
   requires multiple steps (open app, find contact, type message, send) which
   is too slow in an emergency.

3. Standalone GPS Apps: Apps like Google Maps Live Location share GPS but do
   not send alerts, do not notify contacts automatically, and require the
   recipient to have the same app.

4. Basic SOS Apps: Apps like Nirbhaya or bSafe send alerts but lack AI
   guidance, safe zone discovery, and discreet escape features.

Drawbacks of the Existing System:
- Requires multiple manual steps during an emergency
- No AI-based guidance or command execution
- No integrated safe zone discovery
- No fake call feature for discreet escape
- Fragmented — multiple apps needed for different features
- Poor performance on Indian SMS networks
- Requires app installation (not PWA)

3.2 PROPOSED SYSTEM
-------------------
Rakshika proposes a unified, intelligent, mobile-first safety platform with the
following key improvements over existing systems:

Feature Comparison:
┌─────────────────────────┬──────────────┬──────────────┬──────────────┐
│ Feature                 │ Existing Apps│ Govt Helpline│ Rakshika     │
├─────────────────────────┼──────────────┼──────────────┼──────────────┤
│ One-tap SOS             │ Partial      │ No           │ Yes          │
│ SMS to trusted contacts │ Partial      │ No           │ Yes          │
│ Live location link      │ No           │ No           │ Yes          │
│ Safe zone discovery     │ No           │ No           │ Yes          │
│ Fake call               │ Partial      │ No           │ Yes          │
│ AI chatbot              │ No           │ No           │ Yes          │
│ No installation (PWA)   │ No           │ N/A          │ Yes          │
│ Indian SMS (Fast2SMS)   │ No           │ N/A          │ Yes          │
│ Public tracking URL     │ No           │ No           │ Yes          │
│ Mock/dev mode           │ No           │ N/A          │ Yes          │
└─────────────────────────┴──────────────┴──────────────┴──────────────┘

3.3 HARDWARE REQUIREMENTS
-------------------------
Client Device (Minimum):
- Device       : Any smartphone, tablet, or computer
- Browser      : Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- RAM          : 2 GB minimum
- Storage      : 50 MB free (for PWA cache)
- GPS          : Required for location features
- Internet     : 3G/4G/Wi-Fi connection
- Microphone   : Optional (for voice input)
- Speaker      : Required for fake call audio

Server (Development):
- CPU          : Intel Core i3 or equivalent
- RAM          : 4 GB minimum
- Storage      : 20 GB HDD/SSD
- OS           : Windows 10 / Ubuntu 20.04 / macOS 11+
- Network      : Stable internet connection

Server (Production Deployment):
- CPU          : 1 vCPU (2 vCPU recommended)
- RAM          : 512 MB minimum (1 GB recommended)
- Storage      : 10 GB SSD
- OS           : Ubuntu 20.04 LTS or later
- Network      : Open ports 80 (HTTP), 443 (HTTPS), 5000 (API)
- Database     : MongoDB Atlas (cloud) or self-hosted MongoDB 6.0+

3.4 SOFTWARE REQUIREMENTS
-------------------------
Frontend Technologies:
┌──────────────────────────┬─────────────────┬──────────────────────────────┐
│ Technology               │ Version         │ Purpose                      │
├──────────────────────────┼─────────────────┼──────────────────────────────┤
│ React                    │ 19.2.4          │ UI component framework       │
│ Vite                     │ 8.0.0           │ Build tool and dev server    │
│ React Router DOM         │ 7.13.1          │ Client-side routing          │
│ Tailwind CSS             │ 4.2.1           │ Utility-first CSS framework  │
│ Framer Motion            │ 12.36.0         │ Animation library            │
│ Mapbox GL                │ 3.20.0          │ Interactive maps             │
│ Lucide React             │ 0.577.0         │ Icon library                 │
│ Axios                    │ 1.13.6          │ HTTP client                  │
│ Howler                   │ 2.2.4           │ Audio playback               │
│ clsx                     │ 2.1.1           │ Conditional class names      │
│ tailwind-merge           │ 3.5.0           │ Tailwind class merging       │
│ vite-plugin-pwa          │ 1.2.0           │ PWA support                  │
└──────────────────────────┴─────────────────┴──────────────────────────────┘

Backend Technologies:
┌──────────────────────────┬─────────────────┬──────────────────────────────┐
│ Technology               │ Version         │ Purpose                      │
├──────────────────────────┼─────────────────┼──────────────────────────────┤
│ Node.js                  │ 18+             │ JavaScript runtime           │
│ Express                  │ 5.2.1           │ Web framework                │
│ Mongoose                 │ 9.3.0           │ MongoDB ODM                  │
│ MongoDB                  │ 6.0+            │ NoSQL database               │
│ bcryptjs                 │ 3.0.3           │ Password hashing             │
│ jsonwebtoken             │ 9.0.3           │ JWT authentication           │
│ Nodemailer               │ 8.0.2           │ Email alerts                 │
│ Twilio SDK               │ 5.13.0          │ SMS/WhatsApp messaging       │
│ @google/generative-ai    │ 0.24.1          │ Gemini AI integration        │
│ axios                    │ 1.13.6          │ HTTP requests (server-side)  │
│ cors                     │ 2.8.6           │ Cross-origin resource sharing│
│ dotenv                   │ 17.3.1          │ Environment variable loading │
│ nodemon                  │ 3.1.14          │ Development auto-restart     │
└──────────────────────────┴─────────────────┴──────────────────────────────┘

External APIs & Services:
┌──────────────────────────┬──────────────────────────────────────────────┐
│ Service                  │ Purpose                                      │
├──────────────────────────┼──────────────────────────────────────────────┤
│ Google Maps Places API   │ Nearby safe zone discovery                   │
│ Google Gemini AI API     │ AI safety chatbot (gemini-1.5-flash)         │
│ Fast2SMS API             │ Primary SMS provider for Indian numbers      │
│ Twilio API               │ Fallback SMS and WhatsApp messaging          │
│ Mapbox API               │ Interactive map rendering                    │
│ Nodemailer / SMTP        │ Email fallback alerts                        │
└──────────────────────────┴──────────────────────────────────────────────┘

Testing Tools:
┌──────────────────────────┬──────────────────────────────────────────────┐
│ Tool                     │ Purpose                                      │
├──────────────────────────┼──────────────────────────────────────────────┤
│ Vitest                   │ Unit and integration test runner             │
│ React Testing Library    │ Component testing                            │
│ @testing-library/dom     │ DOM query utilities                          │
│ @testing-library/jest-dom│ Custom Jest matchers                         │
│ jsdom                    │ DOM simulation for Node.js                   │
│ fast-check               │ Property-based testing                       │
│ Postman                  │ Manual API endpoint testing                  │
└──────────────────────────┴──────────────────────────────────────────────┘

3.5 FUNCTIONAL REQUIREMENTS
----------------------------
FR-01: User Registration
  The system shall allow new users to register with a full name, email address,
  and password. The email must be unique. The password shall be hashed using
  bcrypt before storage.

FR-02: User Login
  The system shall authenticate users with email and password. On successful
  login, a JWT token valid for 7 days shall be issued and returned to the client.

FR-03: JWT Authentication
  All API routes except /auth/register, /auth/login, and /share/:userId shall
  require a valid JWT Bearer token in the Authorization header.

FR-04: Trusted Contacts Management
  Authenticated users shall be able to:
  - Add a trusted contact with name and 10-digit phone number.
  - View all their trusted contacts.
  - Delete a trusted contact.
  - Search contacts by name or phone number.
  - Mark a contact as priority (client-side).

FR-05: SOS Alert Trigger
  The system shall provide a one-tap SOS button with a 5-second countdown.
  On confirmation, the system shall:
  - Retrieve the user's current GPS coordinates.
  - Fetch all trusted contacts for the authenticated user.
  - Send an SMS to each contact containing a Google Maps link and a live
    tracking URL.
  - Send a fallback email alert if FALLBACK_ALERT_EMAIL is configured.
  - Return the number of contacts notified and the live tracking link.

FR-06: Live Location Sharing
  The system shall allow users to start and stop live location sharing.
  When active, the user's GPS coordinates shall be periodically saved to the
  database. A unique public URL (/share/:userId) shall display the user's
  latest location on an interactive map, auto-refreshing every 15 seconds.

FR-07: Safe Zone Discovery
  The system shall query the Google Places API for nearby police stations,
  hospitals, and bus stops within a 2 km radius of the user's current location.
  Results shall be displayed on a map and as a sorted list with distance,
  rating, and a navigation link to Google Maps.

FR-08: Fake Call Simulation
  The system shall simulate a realistic incoming phone call with:
  - Selectable caller identity (Papa / Mummy).
  - Configurable delay before the call appears (0s, 10s, 30s, 1 min).
  - Ringtone audio playback.
  - Accept/Decline buttons.
  - On answering: a pre-scripted Hindi voice message via Web Speech API.
  - Call timer display.

FR-09: AI Safety Chatbot
  The system shall provide an AI chatbot powered by Google Gemini 1.5 Flash.
  The chatbot shall:
  - Respond to safety-related queries with empathetic, concise guidance.
  - Recognize commands: "send SOS", "share location", "find safe zones",
    "trigger fake call" and execute the corresponding app action.
  - Maintain conversation history for contextual responses.
  - Support text-to-speech output (voice mode).
  - Fall back to mock responses if the Gemini API key is unavailable.

FR-10: Awareness / Onboarding
  The system shall provide an educational story carousel that introduces users
  to the app's features and safety best practices on first use.

FR-11: Emergency Helplines Display
  The dashboard shall display quick-access buttons for national emergency
  helplines: 112, 100, 108, 1091, 181, 1098.

FR-12: Check-in Timer
  The system shall provide a check-in timer feature. If the user does not
  check in within the set time, an automatic SOS alert shall be triggered.

3.6 NON-FUNCTIONAL REQUIREMENTS
---------------------------------
NFR-01: Performance
  The application shall load within 3 seconds on a 4G mobile connection.
  API responses shall be returned within 2 seconds under normal load.

NFR-02: Security
  - Passwords shall be hashed using bcrypt with a minimum salt factor of 10.
  -
