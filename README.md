# Student Productivity Manager

A full-stack, production-ready Student Productivity Manager application that includes Task Management, a Daily Planner, and a Pomodoro Timer.

## ⚙️ Tech Stack

**Frontend:**
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- ShadCN UI
- Zustand (State Management)

**Backend:**
- Java Spring Boot (17+)
- Spring Web
- Spring Data MongoDB
- Maven

**Database:**
- MongoDB

## 📁 Folder Structure
- `/backend`: Contains the Spring Boot Java project.
- `/frontend`: Contains the Next.js React project.

---

## 🚀 Setup Instructions

### 1. Database Setup (MongoDB)
Ensure you have MongoDB installed and running locally on the default port `27017`.
The backend expects the URI: `mongodb://localhost:27017/productivity_db`.
If you are using Docker, you can run:
```bash
docker run -d -p 27017:27017 --name mongodb mongo
```

### 2. Backend Setup (Spring Boot)
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Build the project using Maven:
   ```bash
   ./mvnw clean install
   # or if you have maven installed globally
   mvn clean install
   ```
3. Run the application:
   ```bash
   ./mvnw spring-boot:run
   # or
   mvn spring-boot:run
   ```
*(The backend will start running on http://localhost:8080)*

### 3. Frontend Setup (Next.js)
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
*(The frontend will start running on http://localhost:3000)*

---

## 📌 Features Included

1. **Dashboard Overview**: See your task completion statistics and priority distributions.
2. **Task Management**: Create, read, update, delete, and search tasks. Custom fields include priority, due date, and description.
3. **Pomodoro Timer**: A 25-minute focus timer and a 5-minute break timer with visual indicators, persisted across sessions via local storage.
4. **API Integration**: Frontend tightly bound via Axios to the Spring Boot backend REST endpoints using proper CORS configuration.
5. **Modern UI**: Polished, minimalistic dark-theme user interface built securely with Tailwind CSS and ShadCN components.
# student-productivity-manager
