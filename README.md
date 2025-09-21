# talka 🎬

**talka** is a feature-rich, full-stack social media powerhouse inspired by modern content-sharing platforms. It's built with a robust backend, a dynamic frontend, and real-time capabilities to deliver a seamless and engaging user experience. This isn't just a demo; it's a comprehensive blueprint for a production-grade social network, complete with stories, posts, reels, live streaming, real-time messaging, video/audio calls, a full-fledged admin panel, and monetization features.

---

## ✨ Core Philosophy

The goal of **talka** is to provide a complete, scalable, and modern social media solution that is ready for deployment. It emphasizes:

-   **Feature Completeness**: From basic social interactions to advanced real-time communication and administrative oversight.
-   **Robust Architecture**: A clean separation between the React frontend, Node.js backend, and MySQL database ensures maintainability and scalability.
-   **Real-time Interactivity**: At its heart, `talka` is about live connection, powered by WebSockets for instant messaging, notifications, and calls.
-   **User Empowerment & Safety**: Features like user reporting, blocking, and a comprehensive admin panel provide the tools to build a safe and thriving community.

---

## 📚 Table of Contents

-   [Features](#-features)
    -   [Core Social Features](#-core-social-features)
    -   [Real-time Communication](#-real-time-communication)
    -   [Monetization & Status](#-monetization--status)
    -   [Full-Featured Admin Panel](#-full-featured-admin-panel)
-   [Tech Stack](#-tech-stack)
-   [Getting Started](#-getting-started)
    -   [Prerequisites](#prerequisites)
    -   [Backend Setup](#-backend-setup)
    -   [Frontend Setup](#-frontend-setup)
-   [Environment Variables](#-environment-variables)
-   [Project Structure](#-project-structure)
-   [Future Roadmap](#-future-roadmap)
-   [Contributing](#-contributing)
-   [License](#-license)

---

## 🚀 Features

### ⭐ Core Social Features

-   **📸 Posts**: Create, edit, and delete posts with captions, locations, and multi-image/video carousels.
-   **📝 Polls**: Add interactive polls to posts for community engagement.
-   **👥 Collaborators**: Tag other users as collaborators on posts.
-   **🎬 Reels**: A vertical video feed for short-form content.
-   **📚 Stories**: Share ephemeral photo and video stories that last 24 hours.
-   **🌟 Story Highlights**: Pin stories to your profile permanently.
-   **❤️ Engagement**: Like, comment on, and share posts and reels.
-   **🔖 Bookmarking**: Save posts to a private collection.
-   **🔐 Post Archiving**: Hide posts from your profile without deleting them.
-   **👤 User Profiles**: Comprehensive profiles with bio, website, follower/following counts, and content grids.
-   **🔍 Explore Page**: Discover new content and creators through a dynamic explore feed.
-   **🤝 Follow System**: Follow and unfollow users to customize your feed.

### ⚡ Real-time Communication

-   **💬 Live Messaging**: Real-time private and group chats powered by Socket.IO.
-   **- Media Sharing**: Send images, videos, and file attachments in chats.
-   **- Rich Messaging**: Includes emoji reactions, stickers, typing indicators, and read receipts.
-   **- Vanish Mode**: A chat setting for ephemeral messages that disappear after being seen.
-   **📞 Video & Audio Calls**: Peer-to-peer real-time calls using WebRTC for high-quality, low-latency communication.
-   **📡 Live Streaming**: Go live to broadcast video to your followers in real-time. Includes live chat for viewers.
-   **🔔 Instant Notifications**: Receive real-time push notifications for likes, comments, follows, and more.

### 💰 Monetization & Status

-   **💎 Premium Subscriptions**: A complete flow for users to subscribe to a premium tier, unlocking exclusive features.
-   **✔️ Verification System**: Users can apply for a verified badge, which admins can approve or deny.
-   **💸 Tipping**: Allow users to send monetary tips to creators on their posts as a form of appreciation.

### 🛡️ Full-Featured Admin Panel

-   **📊 Dashboard**: At-a-glance overview of platform statistics, including user growth and content trends with interactive charts.
-   **👥 User Management**: View, search, and manage all users. Admins can ban, suspend, verify, or grant admin privileges.
-   **🎬 Content Moderation**: View and delete any post or reel on the platform.
-   **🚩 Report Management**: Review and act on user-submitted reports for content and users.
-   **📨 Support Tickets**: A complete ticketing system for users to submit support requests and for admins to reply and resolve issues.
-   **📢 Announcements**: Create and manage global banners to display important information to all users.
-   **📈 Trending Topics**: Manually curate a list of trending topics that appear on the sidebar.
-   **📢 Sponsored Content**: Manage advertisements and sponsored posts that are displayed to users.
-   **⚙️ App Settings**: Globally enable or disable major features like new registrations or maintenance mode.

---

## 💻 Tech Stack

-   **Frontend**: React, TypeScript, Tailwind CSS
-   **Backend**: Node.js, Express.js
-   **Database**: MySQL
-   **Real-time Communication**: Socket.IO, WebRTC
-   **Authentication**: JWT (JSON Web Tokens), bcrypt
-   **File Storage**: Multer for handling multipart/form-data uploads.

---

## 🏁 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

-   **Node.js**: v18.x or higher
-   **npm**: v9.x or higher
-   **MySQL**: A running instance of MySQL server.

### 🛠️ Backend Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-folder>
    ```

2.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Set up the database:**
    -   Connect to your local MySQL server.
    -   Create a new database. e.g., `CREATE DATABASE talka;`
    -   Execute the entire `backend/schema.txt` file against your new database to create all the necessary tables.

5.  **Configure environment variables:**
    -   In the `backend/` directory, create a file named `.env`.
    -   Copy the contents from the [Environment Variables](#-environment-variables) section below into your `.env` file and fill in your database credentials.

6.  **Run the backend server:**
    ```bash
    npm start
    ```
    The server should now be running, typically on `http://localhost:3001`.

### 🌐 Frontend Setup

The frontend is a static application that connects to the backend API.

1.  **Serve the root directory:**
    -   You can use any simple HTTP server. If you have Node.js, you can use `serve`:
        ```bash
        # If you don't have serve, install it globally
        npm install -g serve
        
        # Run from the project's root directory
        serve
        ```
    -   Alternatively, you can use a VS Code extension like "Live Server".

2.  **Open the application:**
    -   Navigate to the local URL provided by your server (e.g., `http://localhost:3000`) in your web browser. The app should load and connect to your running backend.

---

## 🔑 Environment Variables

Create a `.env` file in the `backend/` directory and add the following variables.

```env
# MySQL Database Connection
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=talka

# JWT Secret for Authentication
# Use a long, random, and secure string
JWT_SECRET=your_super_secret_jwt_key

# Port for the backend server
PORT=3001
```

---

## 📂 Project Structure
```
/
├── backend/
│   ├── uploads/          # Static assets (avatars, media)
│   ├── middleware/       # Express middleware (e.g., auth)
│   ├── *.js              # Route handlers (auth, posts, users, etc.)
│   ├── db.js             # Database connection setup
│   ├── server.js         # Express server and Socket.IO initialization
│   ├── socket.js         # Socket.IO event handlers
│   ├── package.json
│   └── schema.txt        # The complete database schema
│
├── components/
│   ├── admin/            # Components for the admin panel
│   └── *.tsx             # Reusable React components
│
├── services/
│   ├── apiService.ts     # Centralized API fetching logic
│   ├── socketService.ts  # Socket.IO client service
│   └── WebRTCManager.ts  # WebRTC connection management
│
├── App.tsx               # Main application component, state management
├── index.html            # Entry point for the frontend
├── index.tsx             # React root renderer
└── README.md             # You are here!
```
---

## 🗺️ Future Roadmap

`talka` is built to grow. Here are some potential features for future development:

-   **🛍️ E-commerce Integration**: A "Shop" tab where verified brands can list products.
-   **📈 Advanced Creator Analytics**: In-depth analytics for users on post reach, engagement rates, and audience demographics.
-   **🔐 End-to-End Encryption**: Implement E2EE for private conversations.
-   **🤖 AI-Powered Moderation**: Integrate AI to automatically flag inappropriate content for admin review.
-   **🎮 Gamification**: Introduce badges, points, and leaderboards to reward user engagement.
-   **🌐 Accessibility (a11y)**: Full WCAG 2.1 compliance to make the app usable for everyone.
-   **📱 Mobile Applications**: Develop native iOS and Android apps using React Native.
-   **🔗 NFT/Digital Collectibles**: Allow users to showcase verified digital collectibles on their profiles.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
```