# talka

[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/) [![Node.js](https://img.shields.io/badge/Node.js-20.x-green?logo=nodedotjs)](https://nodejs.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/) [![MySQL](https://img.shields.io/badge/MySQL-8.x-orange?logo=mysql)](https://www.mysql.com/) [![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-black?logo=socketdotio)](https://socket.io/)

**talka** is a comprehensive, full-stack social media application designed to mirror the functionality and sleek user experience of modern content-sharing platforms. It features a robust backend powered by Node.js and Express, real-time capabilities with Socket.IO, and a dynamic frontend built with React and TypeScript.

## 🚀 Live Demo

You can access a live, interactive version of this application here:

[👉 **Access the App on Google AI Studio**](https://aistudio.google.com/apps/drive/1KuihIX7VVASmNuBjhw-Tf_1M28nVu2_d?showAssistant=true&showPreview=true)

---

## ✨ Core Features

This application is more than a simple clone; it's a feature-rich platform with a wide array of capabilities, all powered by a live backend and database:

**👤 User & Profile Management:**
*   **Authentication:** Secure session-based login, registration, and session management.
*   **Profiles:** Customizable user profiles with avatars, bios, highlights, and real-time follower/following counts.
*   **Relationships:** Full follow/unfollow, block/unblock, and mute/unmute functionality.
*   **Privacy:** Option for users to set their accounts to private.
*   **Close Friends:** Curate a private list of users for exclusive story sharing.

**📰 Content & Feeds:**
*   **AI-Powered Captions:** Generate contextual caption suggestions for new posts using the Gemini API.
*   **Posts:** Create, edit, delete, and archive posts. Supports multi-image/video carousels and location tagging.
*   **Post Collaborations:** Invite other users to be co-authors on a post.
*   **Pinned Posts:** Pin up to three posts to the top of your profile for added visibility.
*   **Interactive Polls:** Attach polls to posts for community engagement.
*   **Reels:** A dedicated vertical video feed for short-form content.
*   **Stories:** Ephemeral photo and video stories that last for 24 hours, with support for "Close Friends" only sharing.
*   **Highlights:** Save and categorize stories permanently on your profile.
*   **Feeds:** Chronological home feed, an algorithm-free "Explore" page, and dedicated "Saved" (bookmarks) and "Archived" views.

**💬 Real-Time Communication & Engagement:**
*   **Direct Messaging:** Private one-on-one and group chats.
*   **Rich Media Chat:** Share images, files, stickers, and voice notes.
*   **Live Features:** Real-time typing indicators and emoji reactions.
*   **Live Calling:** Peer-to-peer WebRTC-based video and audio calls.
*   **Live Streaming:** Go live to your followers with a real-time chat overlay.
*   **Notifications:** Instant notifications for likes, comments, follows, and mentions.

**💎 Monetization & Status:**
*   **Creator Tipping:** Allow users to send monetary tips to creators on their posts.
*   **Premium Subscriptions:** A complete flow for users to subscribe to a premium tier.
*   **Verification:** An application system for users to request a verified badge.

**🛡️ Moderation & Administration:**
*   **Reporting:** Users can report posts, users, or comments for review.
*   **Full Admin Panel:** A dedicated backend interface for platform management.
    *   **Dashboard:** View key statistics and analytics on user growth and content trends.
    *   **User Management:** View, suspend, ban, verify, or grant admin rights to users.
    *   **Content Moderation:** Review and delete user-generated posts and reels.
    *   **Report Handling:** Manage and resolve user reports.
    *   **Support System:** A complete support ticket system for user issues.
    *   **Platform Curation:** Manage sponsored content, trending topics, and global announcements.
    *   **App Settings:** Globally enable or disable features like registrations or maintenance mode.

---

## 🔧 Technology Stack

*   **Frontend:** React 19, TypeScript, Tailwind CSS, Vite
*   **Backend:** Node.js, Express.js, Helmet, Express-Rate-Limit
*   **AI:** Google Gemini API
*   **Database:** MySQL 8
*   **Real-Time:** Socket.IO 4
*   **Authentication:** Express Sessions, bcrypt
*   **File Storage:** Multer for handling file uploads
*   **Live Calling:** WebRTC for peer-to-peer connections

---

## 🛠️ Local Setup & Installation

To run this project locally, you will need Node.js, npm, and a MySQL server installed.

### 1. Backend Setup

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Set up the database
#  - Start your local MySQL server.
#  - Create a new database (e.g., CREATE DATABASE talka;).
#  - Execute the SQL commands in `schema.txt` to create all tables.

# 4. Create upload directories
#  - Inside the `backend/` directory, create an `uploads` folder.
#  - Inside `uploads`, create the following subfolders: `assets`, `attachments`, `carousel`, `stickers`.
#  - Place your audio files inside `backend/uploads/assets/`:
#    - ringtone.mp3 (for calls)
#    - notification.mp3 (for toast notifications)
#    - message.mp3 (for new messages)

# 5. Configure environment variables
#  - Create a file named `.env` in the `backend/` directory.
#  - Copy the contents of the "Environment Variables" section below into it and fill in your details.
```

### 2. Frontend Setup

The frontend is built with Vite. The provided files are ready to be used in a Vite project.

```bash
# 1. In the project's root directory (where index.html is), install dependencies
# Note: The importmap in index.html is for AI Studio compatibility.
# For local dev, a package.json is recommended. You can create one with `npm init -y`.
npm install react react-dom socket.io-client

# 2. Install Vite and the React plugin as development dependencies
npm install --save-dev vite @vitejs/plugin-react typescript

# 3. Create a `vite.config.ts` file in the root directory and add the provided configuration.
# This sets up the proxy to the backend for seamless development.
```

---

## ▶️ Running the Application Locally

1.  **Start the Backend Server:**
    ```bash
    # From the `backend/` directory
    npm start
    ```
    The backend API will be running at `http://localhost:3001`.

2.  **Start the Frontend Development Server:**
    ```bash
    # From your frontend project root directory
    npx vite
    ```
    The frontend will be accessible at `http://localhost:5173` (or another port specified by Vite). The `vite.config.ts` will automatically proxy API requests to your backend.

---

## 🚀 Deployment

Deploying a full-stack application involves two main parts: building the frontend for production and running the backend server in a stable environment.

### Step 1: Build the Frontend

First, build the static frontend files. This process bundles your React code, minifies it, and prepares it for production.

```bash
# From the frontend project root directory
npx vite build
```

This command will create a `dist` directory in your project root. This directory contains the optimized `index.html`, JavaScript, and CSS files that will be served to your users.

### Step 2: Deploy the Backend

The backend server needs to run continuously. You can deploy it to any cloud provider (like Google Cloud, AWS, Vercel, etc.) or your own server. Using the provided `Dockerfile` is a highly recommended approach for a portable and scalable deployment.

```bash
# From the backend/ directory
# 1. Build the Docker image
docker build -t talka-backend .

# 2. Run the Docker container
# Replace the .env file values with your production secrets
docker run -p 3001:3001 --env-file .env talka-backend
```

### Step 3: Set Up a Reverse Proxy (e.g., Nginx)

In production, you should **not** serve your frontend and backend from different ports directly to the public. A reverse proxy is the standard solution. It sits in front of your application and routes requests to the appropriate service.

**Example Nginx Configuration:**

This configuration serves the static frontend files from the `dist` directory and forwards any request starting with `/api` or `/uploads` to the backend Node.js server.

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Root location for the built frontend files
    location / {
        root   /path/to/your/frontend/dist;
        index  index.html;
        try_files $uri $uri/ /index.html; # Important for single-page apps
    }

    # Proxy API requests to the backend server
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Proxy file uploads to the backend server
    location /uploads {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
    }
    
    # Proxy Socket.IO connections
    location /socket.io/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
    }
}
```

---

## 🤫 Environment Variables

Create a `.env` file in the `backend/` directory with the following content:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=talka

# Session Secret for Authentication
SESSION_SECRET=your_super_secret_string_that_is_long_and_random

# Gemini API Key (Securely stored on the backend)
GEMINI_API_KEY=your_google_gemini_api_key

# Server Port
PORT=3001
```