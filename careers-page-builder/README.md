# Careers Page Builder

**Production Live Link:** https://frontend-henna-ten-wg02ufviqk.vercel.app/  
**GitHub:** https://github.com/ShailiBoddula/careers-portal

## **1. Project Overview**

The Careers Page Builder is a website that helps companies create and manage their careers page. It is mainly made for companies that use an Applicant Tracking System (ATS).

A recruiter can log in and select their company. After that, they can change the branding of the careers page, add different sections, manage job postings, preview the page and publish it.

Candidates can use the public careers page to see information about the company and available jobs. They can also search for a particular job and filter jobs based on location and job type.

## **2. What I Built**

In this project, I worked on both the recruiter side and the candidate side.

For recruiters, I added login and authentication using JWT. The management pages are protected, so only authorized recruiters can access them.

The data of different companies is kept separate. This means one company should not be able to access another company’s data.

Recruiters can also customize the careers page using a branding editor. The page can have different sections like Hero, About, Values, Life at Company, Culture, Perks/Benefits and Open Jobs.

These sections can be added, edited, deleted, enabled or disabled, and their order can also be changed.

For jobs, recruiters can create new jobs, edit them, delete them and change whether a job is open or closed.

The careers page also has draft, preview and published states. This allows the recruiter to check the page before making it public.

For candidates, I created public company career pages and individual job-detail pages. Candidates can search jobs by title and filter them by location and job type.

The website is also responsive, so it can work on mobile, tablet and desktop screens.

I also included some accessibility features like semantic HTML, labels and visible keyboard focus.

The public content is also prepared for SEO with metadata and structured-data support.

## **3. Technology Used**

For the frontend, I used React 18 along with HTML, CSS, Tailwind CSS, Vite and Lucide Icons.

For the backend, I used Python and FastAPI. REST APIs are used for communication between the frontend and backend. SQLAlchemy is used for database operations and Pydantic is used for validation.

For the database, PostgreSQL/Neon is used for production and SQLite is used for isolated testing.

For authentication, I used JWT with HS256 along with python-jose and bcrypt/passlib.

For deployment and infrastructure, the project uses Docker, Docker Compose, Nginx, Vercel, Railway and Neon.

Git and GitHub are used for version control.

## **4. Architecture**

The project mainly has three parts: frontend, backend and database.

React handles the user interface for both recruiters and candidates.

FastAPI handles things like authentication, company data, page configuration, sections, jobs, publishing and public data.

PostgreSQL/Neon is used to store the production data.

So the basic flow is:

**Recruiter/Candidate → React → FastAPI REST API → PostgreSQL/Neon**

## **5. How to Run the Project**

For the backend, first go into the `backend` folder and create a Python virtual environment. Then install the required packages from `backend/requirements.txt`.

After that, copy `.env.example` to `.env` and configure the database and JWT settings.

The backend can then be started using the Uvicorn command.

For the frontend, go into the `frontend` folder and run `npm install`. Then configure the API URL using the frontend environment file and start the development server.

## **6. Demo Accounts**

There are three demo companies available:

- Acme
- NovaLabs
- Vertex Health

Each company has a recruiter account that can be used to test the recruiter features.

## **7. How the Website is Used**

### **Recruiter**

A recruiter first opens the login page and signs in.

Then they select their company and can change the branding, add or edit sections, change the section order and manage jobs.

After making the changes, they can preview the page and publish it.

### **Candidate**

A candidate opens the company’s public careers page.

They can look through the company information, search for jobs and use filters such as location and job type.

After selecting a job, they can see the job details and the available CTA.

## **8. Testing**

I tested the important backend features such as authentication, authorization, company data isolation, branding, publishing, section management, job management, job filtering and job details.

The final local testing showed **49 tests passing, with 0 failures and 0 warnings**.

I also checked that the frontend production build was completed successfully.

The responsive design was tested on different screen sizes, including mobile, tablet and desktop sizes.

## **9. Future Improvements**

There are still some things that can be improved in the project.

One improvement would be adding better drag-and-drop editing and page templates.

Media files like logos, banners and videos could also be stored using production storage and a CDN.

Recruiter permissions could be made more detailed by adding different roles.

Another useful feature would be analytics to see things like page views, job views, searches and conversions.

For companies with many jobs, pagination and better database indexing would also be useful.

The project could also be improved with CI/CD, monitoring, logging, rate limiting and stronger production security.

Finally, automated browser testing and accessibility testing could be added.

## **10. Submission**

The submission contains the GitHub repository with the working code and sample data, the production link after deployment, the Tech Spec document, README, AGENT_LOG and a demo video of maximum 3 minutes.
