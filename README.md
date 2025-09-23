
# talka

[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/) [![Node.js](https://img.shields.io/badge/Node.js-20.x-green?logo=nodedotjs)](https://nodejs.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/) [![MySQL](https://img.shields.io/badge/MySQL-8.x-orange?logo=mysql)](https://www.mysql.com/) [![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-black?logo=socketdotio)](https://socket.io/)

**talka** is a comprehensive, full-stack social media application designed to mirror the functionality and sleek user experience of modern content-sharing platforms. It features a robust backend powered by Node.js and Express, real-time capabilities with Socket.IO, and a dynamic frontend built with React and TypeScript.

## 🚀 Live Demo / Quick Start

You can access a live, interactive version of this application here:

[👉 **Access the App on Google AI Studio**](https://aistudio.google.com/apps/drive/1KuihIX7VVASmNuBjhw-Tf_1M28nVu2_d?showAssistant=true&showPreview=true)

> **Note:** The setup instructions below are for running the application on your local machine. When run locally, the backend API will be on `http://localhost:3001` and the frontend on a port like `5173` (e.g., using Vite).

---

## ✨ Core Features

This application is more than a simple clone; it's a feature-rich platform with a wide array of capabilities, all powered by a live backend and database:

**👤 User & Profile Management:**
*   **Authentication:** Secure session-based login, registration, and session management.
*   **Profiles:** Customizable user profiles with avatars, bios, highlights, and real-time follower/following counts.
*   **Relationships:** Full follow/unfollow, block/unblock, and mute/unmute functionality.
*   **Privacy:** Option for users to set their accounts to private.

**📰 Content & Feeds:**
*   **Posts:** Create, edit, delete, and archive posts. Supports multi-image/video carousels and location tagging.
*   **Interactive Polls:** Attach polls to posts for community engagement.
*   **Reels:** A dedicated vertical video feed for short-form content.
*   **Stories:** Ephemeral photo and video stories that last for 24 hours.
*   **Highlights:** Save and categorize stories permanently on your profile.
*   **Feeds:** Chronological home feed, an algorithm-free "Explore" page, and dedicated "Saved" (bookmarks) and "Archived" views.

**💬 Real-Time Communication & Engagement:**
*   **Direct Messaging:** Private one-on-one and group chats.
*   **Rich Media Chat:** Share images, files, stickers, and voice notes.
*   **Live Features:** Real-time typing indicators, read receipts, and emoji reactions.
*   **Live Calling:** Peer-to-peer WebRTC-based video and audio calls.
*   **Live Streaming:** Go live to your followers with a real-time chat overlay.
*   **Notifications:** Instant notifications for likes, comments, follows, and mentions.

**💎 Monetization & Status:**
*   **Premium Subscriptions:** A complete flow for users to subscribe to a premium tier.
*   **Verification:** An application system for users to request a verified badge.
*   **Tipping:** Allow users to tip creators on their posts.

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

*   **Frontend:** React 19, TypeScript, Tailwind CSS
*   **Backend:** Node.js, Express.js
*   **Database:** MySQL 8
*   **Real-Time:** Socket.IO 4
*   **Authentication:** Express Sessions, bcrypt
*   **File Storage:** Multer for handling file uploads
*   **Live Calling:** WebRTC for peer-to-peer connections

---

## 🛠️ Setup & Installation

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

The frontend is built to run with a modern development server like Vite.

```bash
# 1. Install Vite (if you don't have it)
npm create vite@latest my-talka-frontend -- --template react-ts

# 2. Replace the contents of the `src` and `public` folders in your new Vite project
#    with the frontend files from this repository (e.g., App.tsx, index.tsx, components/, etc.).

# 3. Copy `index.html` to the root of your Vite project.

# 4. Install dependencies (React will be included by Vite, add socket.io-client)
npm install socket.io-client

# 5. Run the frontend development server
npm run dev
```

---

## ▶️ Running the Application

1.  **Start the Backend Server:**
    ```bash
    # From the `backend/` directory
    npm start
    ```
    The backend API will be running at `http://localhost:3001`.

2.  **Start the Frontend Server:**
    ```bash
    # From your frontend project directory (created in the setup step)
    npm run dev
    ```
    The frontend will be accessible at `http://localhost:5173` (or another port specified by Vite).

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

# Server Port
PORT=3001
```

---

## 🚀 Future Roadmap

*   **Advanced Content Feeds:** Implement algorithmic "For You" feeds and topic-based content channels.
*   **E-commerce Integration:** Allow verified brands to tag and sell products directly through posts.
*   **Group & Community Features:** Dedicated spaces for users to form communities around specific interests.
*   **Enhanced Analytics:** Provide creators with detailed analytics on their post performance and audience engagement.
*   **Mobile App:** Develop native iOS and Android applications for a seamless mobile experience.
