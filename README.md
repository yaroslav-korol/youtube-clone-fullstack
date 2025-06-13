# YouTube Clone — Full Stack Project

A full-stack video-sharing web application inspired by YouTube. This project integrates modern technologies across frontend, backend, and cloud services to support video uploading, transcoding, and playback.

<!-- 🔗 Live Demo: https://your-live-app-link.com  -->

<br>

## Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture Overview](#-architecture-overview)
- [Project Structure](#-project-structure)
- [Purpose](#-purpose)

<br>

### 🔧 Features:
- **List Videos** – Browse uploaded videos with thumbnails and metadata

- **Watch Video** – Stream transcoded videos in the browser

- **Authentication** – Sign in/out using Firebase Auth

- **Upload Video** – Upload raw video files

- **Transcoding** – Automatically convert uploaded videos using FFmpeg

- **Cloud-Based** – Scalable architecture using Google Cloud services

<br>
<br>

### 🧱 Tech Stack

| Layer        | Technology                                          |
|--------------|------------------------------------------------------|
| Frontend     | TypeScript, Next.js                                  |
| Backend API  | Firebase Functions, Express.js                       |
| Auth         | Firebase Authentication                              |
| Storage      | Google Cloud Storage                                 |
| Video Processing | FFmpeg, Node.js, Google Cloud Run                |
| Messaging    | Google Cloud Pub/Sub                                 |
| Metadata     | Firebase Firestore                                   |
| Containerization | Docker                                          |

<br>
<br>

### 🏗 Architecture Overview

```mathematica

User → Next.js Web Client → Firebase Functions → Firestore & GCS
                                         ↓
                                Google Cloud Pub/Sub
                                         ↓
                               Video Processing Service (Cloud Run + FFmpeg)
                                         ↓
                            Transcoded Video → GCS (Processed)
                                 Metadata → Firestore


```

- Frontend (Next.js) handles user interface, video listing, upload, playback, and authentication via Firebase.

- Firebase Functions serve as an API layer between the frontend and backend services.

- Firestore stores video metadata (title, URL, timestamp, etc.).

- Google Cloud Storage (GCS) stores raw uploaded videos and the processed (transcoded) versions.

- Cloud Pub/Sub triggers the processing pipeline asynchronously.

- Cloud Run hosts a containerized FFmpeg service that listens for Pub/Sub events and handles video transcoding.

<br>
<br>

### 🗂 Project Structure
```pgsql
.
├── utils/
│   └── gcs-cors.json               # CORS config for GCS buckets
├── video-processing-service/       # FFmpeg-based transcoding service
│   ├── src/
│   │   ├── firestore.ts            # Firestore metadata handling
│   │   ├── index.ts                # Pub/Sub entry point
│   │   └── storage.ts              # GCS interaction
├── yt-api-service/                 # Firebase Functions (Express API)
│   └── functions/
│       └── src/index.ts            # Endpoints: upload video, list videos, etc.
└── yt-web-client/                  # Frontend app (Next.js)
    ├── app/
    │   ├── navbar/                 # Upload form, auth buttons
    │   ├── firebase/               # Firebase config & functions wrapper
    │   ├── watch/                  # Video player page
    │   └── layout.tsx, page.tsx    # Main layout & homepage
```

<br>
<br>

### 🎯 Purpose  
This project is built for learning and portfolio demonstration. It showcases full-stack development with:

- Integration across cloud-native services

- Scalable async job architecture using Pub/Sub and Cloud Run

- Real-world implementation of video transcoding with FFmpeg

- Clean separation of responsibilities across services

- Modular and readable TypeScript codebase
