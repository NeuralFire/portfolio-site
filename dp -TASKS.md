# **Portfolio Web Application Development Specification**

### **Application Purpose and Functionality**

This web application is a decoupled, full-stack portfolio platform designed to showcase advanced data engineering, machine learning pipelines, and end-to-end product development. The architecture utilizes a React frontend, a high-performance FastAPI Python backend, and a PostgreSQL database. The core feature is an interactive D3.js data visualization dashboard on the landing page, demonstrating real-time data processing and analytics capabilities. Additionally, the application serves as a professional hub, featuring dynamic routing for detailed technical case studies, a professional background section, an interactive resume, a technical blog, and a centralized links directory. The system is engineered to be highly scalable, providing a clear demonstration of production-grade software and data architecture.

### **Phase 1: Project Initialization and Infrastructure**

**Goal:** Establish the foundational repositories, environments, and configuration for both frontend and backend systems.

- [x] **1.1 Repository Setup**  
  - [x] Initialize a monolithic repository or two separate repositories (frontend/backend) using Git.  
  - [x] Establish .gitignore files tailored for Node.js, Python, and OS-specific artifacts.  
- [x] **1.2 Backend Environment**  
  - [x] Initialize a Python virtual environment (venv or conda).  
  - [x] Create a requirements.txt or pyproject.toml including: fastapi, uvicorn, sqlalchemy, psycopg2-binary, alembic, pydantic.  
- [x] **1.3 Frontend Environment**  
  - [x] Initialize a React application (using Vite or Create React App).  
  - [x] Install core dependencies: react-router-dom, d3, axios (or fetch wrapper), and styling libraries (e.g., Tailwind CSS or Material-UI).  
- [x] **1.4 Environment Variables**  
  - [x] Create .env templates (.env.example) for both backend (Database URLs, API keys) and frontend (API base URLs).

### **Phase 2: Database Schema & PostgreSQL Setup**

**Goal:** Design and deploy the relational database architecture to support portfolio content and dashboard data.

- [x] **2.1 Database Provisioning**  
  - [x] Initialize a local PostgreSQL instance for development.  
- [x] **2.2 Schema Design (SQLAlchemy Models)**  
  - [x] **Case Studies:** Table for title, summary, problem\_statement, architecture, impact, tech\_stack (array/JSON), date.  
  - [x] **Blog Posts:** Table for title, content (markdown/HTML), publish\_date, tags.  
  - [x] **Dashboard Data:** Tables to store normalized demonstration data (e.g., time-series data, network nodes/edges, or categorical metrics) to be served to the D3.js frontend.  
- [x] **2.3 Migrations**  
  - [x] Initialize Alembic for the FastAPI application.  
  - [x] Generate and apply the initial migration script to create the schema.

### **Phase 3: FastAPI Backend Development**

**Goal:** Develop the RESTful API endpoints required to serve data to the React frontend.

- [x] **3.1 Application Factory & Routing**  
  - [x] Implement the main FastAPI instance.  
  - [x] Configure CORS middleware to accept requests from the local React development server.  
- [x] **3.2 CRUD Endpoints**  
  - [x] GET /api/casestudies: Retrieve all case studies.  
  - [x] GET /api/blog: Retrieve blog post summaries.  
  - [x] GET /api/blog/{id}: Retrieve a specific blog post.  
- [x] **3.3 Dashboard Data Endpoints**  
  - [x] GET /api/dashboard/metrics: Design endpoints specifically optimized for D3.js consumption.  
  - [x] Implement data transformation logic (e.g., aggregating time-series data or calculating summary statistics) within the route before returning the JSON payload.  
- [x] **3.4 Data Seeding**  
  - [x] Create a Python script (seed.py) to populate the PostgreSQL database with initial placeholder content and sample dataset metrics for the dashboard.

### **Phase 4: React Frontend Setup & Routing**

**Goal:** Establish the client-side architecture, state management, and navigation structure.

- [x] **4.1 Router Implementation**  
  - [x] Configure react-router-dom to handle the requested routes: / (Home/Dashboard), /case-studies, /about, /resume, /blog, /links.  
- [x] **4.2 Layout & Global UI Components**  
  - [x] Develop a persistent Navigation Bar and Footer.  
  - [x] Implement a global layout wrapper to ensure consistent styling and responsive behavior across all views.  
- [x] **4.3 API Integration Hook**  
  - [x] Develop a custom React hook (e.g., useApi) or configure Axios instances to handle backend data fetching, loading states, and error handling.

### **Phase 5: D3.js Dashboard Integration (Landing Page)**

**Goal:** Build the interactive centerpiece of the portfolio.

- [x] **5.1 Dashboard Component Structure**  
  - [x] Create a React component specifically for managing the D3.js SVG canvas and lifecycle (useEffect for rendering/updating).  
- [x] **5.2 Data Binding**  
  - [x] Fetch data from GET /api/dashboard/metrics and pass it into the D3 rendering functions.  
- [x] **5.3 Visualization Implementation**  
  - [x] Implement the core visualization (e.g., multi-line chart, scatter plot, or network graph).  
  - [x] Add interactivity requirements: Tooltips on hover, zooming/panning (if applicable), and smooth transitions for data updates.  
  - [x] Ensure the SVG scales responsively with the browser window size.

### **Phase 6: Core Pages Implementation**

**Goal:** Build out the static and dynamic content pages.

- [x] **6.1 Case Studies Page (/case-studies)**  
  - [x] Fetch and render a grid or list of projects from the backend.  
  - [x] Structure each card using the STAR method format (Situation, Task, Action, Result).  
- [x] **6.2 About Me Page (/about)**  
  - [x] Implement static content sections detailing professional narrative, technical transition, and engineering philosophy.  
- [x] **6.3 Resume Page (/resume)**  
  - [x] Develop an HTML/CSS based layout of the CV (allowing text selection).  
  - [x] Include a prominent "Download PDF" button pointing to a static asset.  
- [x] **6.4 Blog Page (/blog)**  
  - [x] Implement a feed of recent posts.  
  - [x] Integrate a markdown parser (e.g., react-markdown) to safely render the content fetched from the database.  
- [x] **6.5 Links Page (/links)**  
  - [x] Create a minimalist, mobile-friendly view listing external professional profiles (LinkedIn, GitHub, Google Scholar, Open Source repositories).

### **Phase 7: Deployment Readiness**

**Goal:** Prepare the application for cloud deployment.

- [x] **7.1 Build Scripts**  
  - [x] Ensure npm run build generates an optimized production build of the React application.  
- [x] **7.2 Containerization (Optional but Recommended)**  
  - [x] Draft a Dockerfile for the FastAPI backend.  
  - [x] Draft a Dockerfile for the React frontend.  
  - [x] Set up a docker-compose.yml configuration for local multi-container development.  
- [x] **7.3 Environment Audit**  
  - [x] Verify all hardcoded localhost URLs are replaced with environment variables referencing production domains.