# QuizTime

Quiz Time is a web platform for real-time quizzes, featuring live score updates, leaderboards, and integrated backend, frontend, and external services.

## Features
- User Participation: Users can join a quiz using a unique ID and begin answering questions.
- Real-time Score Updates: Scores are updated in real-time as users submit answers. 
- Real-time Leaderboard: A leaderboard displays the current standings of all participants.
## Demo
URL: 

- [﻿quizzes-delta.vercel.app/quizzes](https://quizzes-delta.vercel.app/quizzes) 

Login: 
- Create your own account with any email (no need to verify)
  
## Architecture Diagram
![diagram-export-12-22-2024-7_40_53-PM.png](https://eraser.imgix.net/workspaces/60NV0wDAcjIAYnHSZXgh/CLWONM2TG2fMg9nRZxcFbTBQo1l1/N6xLpVRvK0kpvSTKrdOed.png?ixlib=js-3.7.0 "diagram-export-12-22-2024-7_40_53-PM.png")

### **Component Description**
#### **User**
- Represents the end-users who interact with the quiz platform through requests and receive responses, such as submitting answers and viewing the leaderboard.
#### **Next.js**
A framework for building server-rendered or statically generated React applications. It handles the client and server-side operations in this system:

1. **Client Components**:
    - **Role**: These are React-based components used in the user interface to display quizzes, leaderboards, and live score updates.
    - **Operations**: Handles read operations, such as retrieving quiz questions or leaderboard data, and sends requests for user interactions.
2. **Server APIs**:
    - **Role**: Backend endpoints created with Next.js API routes to process user submissions, such as posting answers with `[POST] /api/answers/submit` endpoint
    - **Operations**: Manages write operations for submitting answers, verifying their correctness, and assigning scores.
3. **Supabase Client Library**
    - **Role**: Acts as the bridge between the Next.js client and server components and Supabase services.
    - **Operations**: Facilitates database interactions, such as reading quiz data for client components and writing user answers.
#### **Supabase**
An open-source backend as a service (BaaS) platform providing database, authentication and real-time features:

1. **Realtime**:
    - **Role**: Enables real-time updates for quiz scores and leaderboard changes.
    - **Operations**: Uses WebSockets to push live updates to client components.
2. **Auth**:
    - **Role**: Manages user authentication and authorization.
    - **Operations**: Uses JSON Web Tokens (JWT) to secure data access and interactions.
3. **APIs**:
    - **Role**: Exposes RESTful endpoints for interacting with the database.
    - **Operations**: Handles CRUD operations for user's answers.
4. **PostgreSQL**:
    - **Role**: The underlying relational database used by Supabase to store data persistently.
    - **Operations**: Holds data such as quiz questions, user information and leaderboard rankings.


### **Data Flow**
1. **User**: Initiates the process by interacting with the platform.
2. **Select Quiz**: The user selects a quiz using its unique ID.
3. **Questions Shown**: The selected quiz's questions are retrieved and displayed to the user.
4. **Answer Questions**: The user submits their answers.
5. **Get Score**: The system evaluates the answers and assigns a score.
6. **Leaderboard Calculated**: The leaderboard is updated based on the user's score and other participants' scores.

![diagram-export-12-22-2024-8_23_09-PM.png](https://eraser.imgix.net/workspaces/60NV0wDAcjIAYnHSZXgh/CLWONM2TG2fMg9nRZxcFbTBQo1l1/Yp8xHDQHNA9rGhDYbF7NA.png?ixlib=js-3.7.0 "diagram-export-12-22-2024-8_23_09-PM.png")

---

### Database Design


![Database Schema.png](https://eraser.imgix.net/workspaces/60NV0wDAcjIAYnHSZXgh/CLWONM2TG2fMg9nRZxcFbTBQo1l1/9LDcUStdGnZiMqiJodEBm.png?ixlib=js-3.7.0 "Database Schema.png")

#### Table Description
**Table Name** `quizzes` 

**Purpose**: Stores information about the quizzes available on the platform.

**Columns**:

- `id` : Unique identifier for the quiz (primary key, UUID).
- `name` : The name of the quiz (required).
- `description` : A detailed explanation of the quiz.
- `number_of_questions` : Total number of questions in the quiz (required).
- `created_at` : Timestamp when the quiz was created (default: `now()` ).
- `updated_at` : Timestamp when the quiz was last updated.
- `deleted_at` : Timestamp when the quiz was deleted.


**Table Name** `questions` 

**Purpose**: Contains the list of questions for each quiz.

**Columns**:

- `id` : Unique identifier for the question (primary key, UUID).
- `text` : The text content of the question.
- `quiz_id` : Foreign key referencing the `quizzes`  table to associate a question with its quiz.
- `created_at` : Timestamp when the question was created (default: `now()` ).
- `updated_at` : Timestamp when the quiz was last updated.
- `deleted_at` : Timestamp when the quiz was deleted.


**Table Name** `question_options` 

**Purpose**: Stores the possible answer options for each question.

**Columns**:

- `id` : Unique identifier for the option (primary key, UUID).
- `question_id` : Foreign key referencing the `questions`  table to associate options with a question.
- `text` : The text content of the option.
- `is_correct` : Indicates whether the option is the correct answer (boolean, required).
- `created_at` : Timestamp when the option was created (default: `now()` ).
- `updated_at` : Timestamp when the quiz was last updated.
- `deleted_at` : Timestamp when the quiz was deleted.


**Table Name** `participants` 

**Purpose**: Contains information about participants in the quizzes.

**Columns**:

- `id` : Unique identifier for the participant (primary key, UUID).
- `name` : The name of the participant (required).
- `created_at` : Timestamp when the participant was added (default: `now()` ).
- `updated_at` : Timestamp when the quiz was last updated.
- `deleted_at` : Timestamp when the quiz was deleted.


**Table Name** `participant_answers` 

**Purpose**: Tracks the answers submitted by participants for each question in a quiz.

**Columns**:

- `id` : Unique identifier for the answer (primary key, UUID).
- `participant_id` : Foreign key referencing the `participants`  table to associate answers with a participant.
- `quiz_id` : Foreign key referencing the `quizzes`  table to associate answers with a quiz.
- `question_id` : Foreign key referencing the `questions`  table to associate answers with a question.
- `question_option_id` : Foreign key referencing the `question_options`  table to associate answers with an option.
- `point` : The score assigned for the answer (required).
- `is_correct` : Indicates whether the answer was correct (boolean, required).
- `question_text` : The text of the question at the time of answering (required).
- `answer_text` : The text of the answer provided by the participant (required).
- `created_at` : Timestamp when the answer was submitted (default: `now()` ).
- `updated_at` : Timestamp when the quiz was last updated.
- `deleted_at` : Timestamp when the quiz was deleted.


**View Name:** `participant_points`

**Purpose**: Provides a leaderboard-like representation of participants, showing their total points and rank based on their performance in quizzes.

**Columns**:

- `id` : The unique identifier of the participant.
- `participant_name` : The name of the participant.
- `total_points` : The total points accumulated by the participant across all quizzes.
- `deleted_at` : Timestamp indicating when the participant was deleted, if applicable.
- `rank` : The ranking of participants based on their total points, with higher scores ranked first.
---

### Technologies and Tools
**Programming Language**

Technology: 

- TypeScript with NextJS as framework.
- Justification: 
    - Powerful static typing.
    - High flexibility and observability.
    - One language for all (frontend and backend)

**Persistent Data Storage**

Technology:

- PostgreSQL, hosted in Supabase
- Justification:
    - PostgreSQL is well-suited for structured data relationships between quizzes, questions, participants, and answers.
    - Supabase provides almost all required backend services, such as API, authentication and real-time functionality from PostgreSQL.
      
**Real-time data communication**

Technology

- Websocket, hosted in Supabase
- Justification:
    - Provides a basic communication channel.
    - Supabase eliminates the need to set up additional infrastructure for real-time communication.
      
**Authentication & Authorization**

Technology:

- JSON Web Token / JWT
- Justification:
    - Easy way to secure user authentication and data access.
    - Works seamlessly with Supabase's authentication system, minimizing the need for additional setup.
      
**Deployment**

Tools:

- Vercel
- Justification:
    - Makes it easy to build, launch, and grow modern web apps, especially with JavaScript frameworks like Next.js.

## Local Setup
- Clone this repository
- Copy and rename `.env.example`  to `.env.local` 
- Add env variables to `.env.local` 
- Run`npm run dev` to access http://localhost:3000
