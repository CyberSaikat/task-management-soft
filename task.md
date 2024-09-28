# Task Management System

## Overview
The Task Management System allows users to create task lists, add tasks, assign tasks to users, and manage tasks based on user roles. It implements role-based access control (RBAC) to ensure users only view and manage tasks that are relevant to them.

## User Roles

### Admin:
- Full access to all task lists and tasks.
- Can create, update, and delete task lists and tasks.
- Can manage user accounts.

### Task Owner:
- Can create and manage their own task lists and tasks.
- Can assign tasks to any user.
- Has control over tasks and task lists they own.

### Assigned User:
- Can view and update tasks assigned to them.
- Cannot modify task lists or tasks they do not own.

## Core Features

### 1. Task List Management:
- Users can create task lists with meaningful names.
- Users can view task lists they created or are assigned to.
- Task lists the user does not have access to will be hidden.

### 2. Task Management:
Each task in a task list includes:
- **Title**: Concise title for the task.
- **Description**: Detailed description of the task.
- **Due Date**: The deadline for task completion.
- **Status**: Predefined values like "Not Started", "In Progress", "Completed".
- **Assigned User**: A user responsible for the task.

Task owners can:
- Add tasks to their lists.
- Assign tasks to any user in the system.
  Assigned users can:
- View their tasks and update the task status.

### 3. Viewing Tasks:
- Users can view task lists and tasks they are either the owner of or assigned to.
- Assigned users can see task details:
    - Task owner's name
    - Task title
    - Task description
    - Due date
    - Current status

### 4. Updating Tasks:
- Assigned users can update task status.
- Task owners can update task details such as title, description, due date, and assigned user.

### 5. Email Notifications (Optional):
- Notify users 30 minutes before their task deadline.
- Notify users when a new task is assigned to them.

## Technical Requirements

### Frontend:
- Built with a modern JavaScript framework (React, Vue, Angular, etc.).
- Includes forms for:
    - Creating new task lists.
    - Adding tasks to a task list.
    - Assigning tasks to users.
- Views allow users to:
    - See summaries of all task lists they own or are assigned to.
    - View detailed task lists and tasks.

### Backend:
- Handles task list creation, task addition, assignment, and retrieval.
- Implements user authentication and role-based access control.
- Stores data in a robust database like PostgreSQL, MySQL, SQLite, or MongoDB.

### API Development:
- A RESTful API to handle:
    - Task list creation, retrieval, and modification.
    - Task assignment and status updates.
    - User authentication and authorization.
- API Documentation includes request/response formats and authentication mechanisms.

### Security:
- Implements authentication and authorization to restrict access based on user roles.
- Strict enforcement of role-based access control (RBAC):
    - Admins have full access.
    - Task Owners have access to their task lists and tasks.
    - Assigned Users can view and update only tasks assigned to them.
- Ensures password protection and encryption of sensitive data.

## Documentation

### Setup and Installation Guide:
1. Clone the repository.
2. Install the necessary dependencies using `npm install`.
3. Set up the required environment variables (e.g., database URL, authentication keys).
4. Run the application locally with `npm start`.

### API Documentation:
- **Authentication**: Token-based authentication for API access.
- **Endpoints**:
    - `POST /task-lists`: Create a new task list.
    - `GET /task-lists`: Retrieve all task lists for the authenticated user.
    - `POST /tasks`: Add a new task to a task list.
    - `PATCH /tasks/:id`: Update task status or details.
    - `POST /assign-task`: Assign a task to a user.

Each endpoint includes:
- Required parameters.
- Response structure.
- Authentication details.

### User Guide:
1. **Creating Task Lists**:
    - Navigate to the Task List page.
    - Click the "Create Task List" button.
    - Enter a name for the list and save.

2. **Adding Tasks**:
    - Select a task list.
    - Click "Add Task" and fill in the task details (title, description, due date, etc.).
    - Save the task.

3. **Assigning Tasks**:
    - From the task list, select a task.
    - Assign the task to a user.

4. **Updating Tasks**:
    - Assigned users can view their tasks from the dashboard.
    - Click the task and update its status.

## Testing Requirements

### Integration Testing:
- Ensure smooth interaction between frontend and backend components.
- Test task creation, assignment, and retrieval based on user roles.

### Security Testing:
- Verify that users cannot access or modify tasks or task lists they do not have permission to view.

## Deliverables

### Source Code:
- The repository contains the complete codebase for the frontend, backend, and database schemas.
- The code is clean, modular, and well-commented.

### Documentation:
- **Setup Guide**: Instructions for running the application locally.
- **API Documentation**: Details of available endpoints, parameters, and responses.
- **User Guide**: Step-by-step instructions for using the system.

### Demo:
- Provide a live demo link to the deployed application or a video showcasing the core functionality.

### Optional: Testing Report:
- Summary of integration and security testing, including any edge cases discovered.

