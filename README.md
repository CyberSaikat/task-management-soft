# 📋 Task Management App

<p align="center">
  <img src="https://raw.githubusercontent.com/sculptorofcode/task-management-app/main/public/images/banner.png" alt="Leading Image" width="100%">
</p>

A robust Task Management application built with **Next.js**, **MongoDB**, and **NextAuth**. This application empowers users to efficiently manage tasks, view insightful statistics, and update task statuses in real-time. Admin users benefit from advanced features, including comprehensive statistics on task distribution and user assignments.

## 📚 Table of Contents

- [✨ Features](#-features)
- [🛠️ Technologies](#️-technologies)
- [🚀 Getting Started](#-getting-started)
  - [📋 Prerequisites](#-prerequisites)
  - [⚙️ Installation](#️-installation)
- [🔧 Configuration](#-configuration)
- [📘 Usage](#-usage)
  - [👤 User Role](#-user-role)
  - [👑 Admin Role](#-admin-role)
  - [🔑 Admin Credentials](#-admin-credentrials)
- [🔌 API Endpoints](#-api-endpoints)
- [🏗️ Project Structure](#️-project-structure)
- [🎨 Customizing the App](#-customizing-the-app)
- [🧪 Testing](#-testing)
- [🚢 Deployment](#-deployment)
- [🔮 Future Improvements](#-future-improvements)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [🙏 Acknowledgements](#-acknowledgements)

## ✨ Features

### For All Users

- 🔐 Secure user authentication via NextAuth
- ➕ Intuitive task creation, viewing, updating, and deletion
- 🔄 Real-time task status management (Completed, In Progress, Not Started, Overdue)
- 📊 Personal task statistics dashboard

### Admin-Exclusive Features

- 📈 Comprehensive admin statistics dashboard
  - 🥧 Task distribution visualization (Pie chart)
  - 📊 User task assignment overview (Bar chart)
- 👥 User management capabilities

## 🛠️ Technologies

- 🖥️ **Frontend**: Next.js (React framework), TypeScript
- 🔙 **Backend**: Next.js API routes
- 🗄️ **Database**: MongoDB
- 🔑 **Authentication**: NextAuth.js
- 📊 **Data Visualization**: Recharts
- 🎨 **Styling**: Tailwind CSS
- 🔄 **State Management**: React Context API
- 📝 **Form Handling**: React Hook Form
- 🌐 **API Requests**: Axios

## 🚀 Getting Started

### 📋 Prerequisites

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)
- MongoDB instance (local or cloud-based)

### ⚙️ Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/sculptorofcode/task-management-app.git
   ```

2. Navigate to the project directory:

   ```bash
   cd task-management-app
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up your environment variables (see [Configuration](#-configuration) section).

5. Run the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🔧 Configuration

Create a `.env.local` file in the root directory and add the following environment variables:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/mydatabase?retryWrites=true&w=majority
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
RESEND_API_KEY=your_resend_api_key
```

Replace the placeholder values with your actual MongoDB connection string, NextAuth secret, and Resend API key.

## 📘 Usage

### 👤 User Role

After signing in, regular users can:

- 👀 View and manage their assigned tasks
- ➕ Create new tasks
- 🔄 Update task status
- 🗑️ Delete their own tasks
- 📊 Access personal task statistics

### 👑 Admin Role

Admin users have additional capabilities:

- 🖥️ Access to an advanced dashboard showing:
  - 🥧 Overall task distribution by status (Pie Chart)
  - 📊 Task count per user (Bar Chart)
- 🔧 Ability to manage all users' tasks
- 👥 Access to user management features

### 🔑 Admin Credentials

- **Username / Email ID:** <admin@tasksoft.com>
- **Password:** tasksoft

## 🔌 API Endpoints

| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/api/tasks/my-tasks` | GET | Fetch tasks for the logged-in user | 👤 User |
| `/api/tasks/:id/status` | PUT | Update the status of a specific task | 👤 User |
| `/api/tasks/:id` | GET | Fetch a single task by ID | 👤 User |
| `/api/tasks` | POST | Create a new task | 👤 User |
| `/api/tasks/:id` | DELETE | Delete a task by ID | 👤 User |
| `/api/statistics` | GET | Fetch task statistics | 👑 Admin |

🏗️ Project Structure

```
task-management-app/
│
├── public/
│   └── [Static files]
│
├── src/
│   ├── abstract/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── forgot-password/
│   │   │   ├── login/
│   │   │   └── reset-password/
│   │   ├── (backend)/
│   │   │   └── soft/
│   │   │       ├── dashboard/
│   │   │       ├── my-tasks/
│   │   │       ├── statistics/
│   │   │       ├── task/
│   │   │       ├── task-list/
│   │   │       └── users/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   ├── statistics/
│   │   │   ├── task-lists/
│   │   │   ├── tasks/
│   │   │   └── users/
│   │   ├── fonts/
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── assets/
│   │   ├── css/
│   │   ├── images/
│   │   └── scss/
│   ├── components/
│   ├── context/
│   ├── database/
│   ├── hooks/
│   ├── lib/
│   ├── models/
│   └── [Other project-specific directories]
│
├── .env.local
├── .gitignore
├── next.config.js
├── package.json
├── README.md
└── tsconfig.json
```

## 🎨 Customizing the App

### 🔐 User Authentication

The app uses NextAuth.js for authentication. To add or customize providers, modify the `authOptions` in `src/app/api/auth/[...nextauth]/options.tsx`.

### 📝 Task Model

The `Task` model is defined in `src/models/Task.tsx`. Modify this file to adjust the task schema according to your needs.

## 🧪 Testing

Run the test suite with:

```bash
npm test
```

To run tests in watch mode:

```bash
npm run test:watch
```

## 🚢 Deployment

1. Build the application:

   ```bash
   npm run build
   ```

2. Start the production server:

   ```bash
   npm start
   ```

For platform-specific deployment instructions, refer to the [Next.js deployment documentation](https://nextjs.org/docs/deployment).

## 🔮 Future Improvements

- 🔍 Implement task filtering and search functionality
- 🔔 Add notification system for task deadlines
- 📱 Enhance mobile responsiveness
- 📈 Expand admin reporting capabilities
- 📅 Integrate with external calendar services (e.g., Google Calendar, Apple Calendar)
- 🖱️ Implement drag-and-drop task management interface
- 👥 Add team collaboration features

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure your code adheres to our coding standards and includes appropriate tests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [MongoDB](https://www.mongodb.com/)
- [NextAuth.js](https://next-auth.js.org/)
- [Recharts](https://recharts.org/)
- [Tailwind CSS](https://tailwindcss.com/)

---

For any questions or support, please [open an issue](https://github.com/sculptorofcode/task-management-app/issues) or contact the maintainers.
