# Task Management App

A Task Management application built with **Next.js**, **MongoDB**, and **NextAuth**. This application allows users to manage tasks, view statistics, and update task statuses. Admin users can view additional statistics such as task distributions and tasks assigned to different users.

## Features

- User authentication using **NextAuth**
- Admin and user roles
- View, add, update, and delete tasks
- Task status management (e.g., Completed, In Progress, Not Started, Overdue)
- Admin statistics dashboard
    - Task distribution chart (Pie chart)
    - Tasks per user (Bar chart)
- Responsive UI with **React** and **Recharts**

## Technologies

- **Next.js** (React framework)
- **MongoDB** (Database)
- **NextAuth.js** (User authentication)
- **Recharts** (Charts and graphs)
- **TypeScript** for static typing

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/CyberSaikat/task-management-app.git
    ```
   
2. Install dependencies:
    ```bash
    cd task-management-app
    npm install
    ```
3. Set up your environment variables by creating a .env file in the root of the project. Add the following variables:

    ```bash
    MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/mydatabase?retryWrites=true&w=majority
    NEXTAUTH_URL=http://localhost:3000
    NEXTAUTH_SECRET=your_nextauth_secret
    RESEND_API_KEY=your_sendgrid_api_key
    ```

4. Run the development server:

    ```bash
    npm run dev
    ```

The app will be available at http://localhost:3000.

## API Endpoints
Here are the key API endpoints for managing tasks and viewing statistics:

### Tasks
1. GET `/api/tasks/my-tasks` - Fetch tasks for the logged-in user.
2. PUT `/api/tasks/:id/status` - Update the status of a specific task.
3. GET `/api/tasks/:id` - Fetch a single task by ID.
4. POST `/api/tasks` - Create a new task.
5. DELETE `/api/tasks/:id` - Delete a task by ID.
### Statistics
GET `/api/statistics` - Fetch task statistics, including total tasks, completed tasks, and tasks per user.

## Usage

### User Role
- After signing in, a regular user can:
    - View tasks assigned to them
    - Add new tasks
    - Update task status
    - Delete tasks
    - View their own tasks statistics
    - View their own tasks
- Admin Role
    - Admin users have access to a dashboard that shows:
        - Task distribution by status (Pie Chart)
        - Task count per user (Bar Chart)
## Customizing the App

### User Authentication
The app uses NextAuth.js for authentication. You can configure different authentication providers like Google, GitHub, etc. Currently, it supports credentials-based authentication.

Modify the `authOptions` in `src\app\api\auth\[...nextauth]\options.tsx` to add or customize providers.

### Task Model
The task data is stored in MongoDB and represented by the `Task` model, which contains fields like `title`, `description`, `dueDate`, `status`, and `owner`. You can modify the schema as needed in `src\models\Task.tsx`.

## Future Improvements
- Add filters and search functionality for tasks
- Implement notifications for task deadlines
- Improve mobile responsiveness
- Add additional statistics and reports for admins
- Integrate with external calendar services (e.g., Google Calendar)

## Contributing

Feel free to submit a pull request or open an issue if you find any bugs or have feature requests.

- Fork the project
- Create your feature branch (`git checkout -b feature/my-new-feature`)
- Commit your changes (`git commit -am 'Add some feature'`)
- Push to the branch (`git push origin feature/my-new-feature`)
- Create a new Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.


### Key Points:
1. **Project Overview**: Brief introduction about the project and its purpose.
2. **Features**: List the main features, both for regular users and admin users.
3. **Technologies**: Outline the tech stack.
4. **Installation**: Detailed steps to set up the project.
5. **API Endpoints**: Explanation of the API routes, highlighting the endpoints users and admins can interact with.
6. **Usage**: Explanation of how to use the app depending on the user's role.
7. **Customization**: Guide on how to customize user authentication or the task model.
8. **Contributing**: Steps on how to contribute to the project.

This README template should give any developer a good starting point to understand and work with your project.
