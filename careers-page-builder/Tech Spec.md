# Tech Spec — Careers Page Builder

## **1. Assumptions**

For the first version of the project, I made a few assumptions.

Each recruiter account is connected to only one company. Each company has its own careers-page settings and jobs, so the data is kept separate.

Only content that has been published is shown to candidates.

There is no candidate application process in this version. Candidates can view the jobs and their details, but applying for a job is not part of the current system.

For the prototype, sample job data is enough.

For production, I planned to use Neon PostgreSQL as the database, while SQLite is used for testing.

## **2. Architecture**

The project is divided into a frontend, backend and database.

I used React for the frontend and FastAPI for the backend REST services.

SQLAlchemy is used for working with the database, and Pydantic is used to validate the data.

For production storage, PostgreSQL/Neon is used.

The recruiter APIs are protected because they contain management features. Public APIs are used to show published careers-page content and open jobs to candidates.

## **3. Database Schema**

The main parts of the database are:

### **User**

The User table stores information such as the user’s ID, email, password hash, company ID and role-related information.

### **Company**

The Company table stores the company ID, company name, slug and branding/configuration information.

### **CareerPage**

This stores the careers page for a company. It contains the company ID, publication state and page configuration.

### **PageSection**

This represents the different sections of a careers page. It stores things like the section type, its content, display order and whether the section is enabled.

### **Job**

The Job table stores information about a job such as its title, location, employment type, department, description and current status.

The company ownership is maintained using foreign keys and authorization checks.

For public pages, the company is found using its slug, and only its published page and open jobs are shown.

## **4. Multi-Tenancy**

The project uses logical multi-tenancy at the application and data level.

In simple terms, when a recruiter is logged in, the queries and changes they make are connected to their `company_id`.

This makes sure that a recruiter can work only with their own company’s data.

If someone tries to access or modify resources belonging to another company, the request is rejected.

## **5. Security**

For recruiter login sessions, I used JWT authentication.

Passwords are stored using bcrypt hashing instead of storing the actual passwords directly.

Protected API endpoints require the user to be authenticated.

Company-level authorization is also used to prevent one company from accessing another company’s data.

Pydantic is used to validate API input and output data.

For production, the application should use HTTPS, a strong JWT secret and restricted CORS. Sensitive information should also be kept outside the source code.

## **6. Page Builder**

The careers page is made using different modular sections instead of creating a separate page implementation for every company.

The recruiter can edit the content of these sections, enable or disable them and change their order.

This makes the page easier to customize for different companies.

## **7. Draft and Published Pages**

When a recruiter makes changes to the careers page, they can first preview those changes.

The published version controls what candidates can see.

So, simply editing something in the recruiter area does not automatically change the public page. The changes need to be published first.

## **8. Candidate Experience**

Candidates can access a company’s public careers page using the company’s slug.

The page shows open job positions using job cards.

Candidates can search for jobs using the **Job Title** and filter them based on **Location** and **Job Type**.

They can select a job to open its individual details page and see the available CTA.

The candidate interface is also designed to work on mobile, tablet and desktop screens.

## **9. REST API**

The backend provides different API endpoints for different parts of the application.

These include:

- Authentication endpoints for login and authentication.
- Company and branding endpoints.
- Endpoints for creating, editing, deleting and reordering sections.
- Recruiter endpoints for managing jobs and their status.
- Public endpoints for careers pages, job search, filters and job details.
- A health endpoint that can be used to check whether the deployed backend is working.

## **10. SEO**

The public careers pages are designed so that search engines can crawl the actual career and job content.

The information is available through backend representations instead of depending only on a client-side page shell.

Metadata and structured-data support are also included to help with SEO.

## **11. Accessibility and Responsive Design**

I used semantic HTML and accessible names for controls so that the interface is easier to understand and use.

Keyboard focus states are visible, which helps users who navigate using a keyboard.

The UI also uses readable typography and considers good contrast.

I checked the application on different mobile, tablet and desktop screen sizes to make sure the layout works properly across them.

## **12. Test Plan**

The testing covers the important parts of the application.

I planned tests for:

- Authentication and invalid login credentials.
- Unauthorized access.
- Making sure companies cannot access each other’s data.
- Branding changes and publication states.
- Creating, editing, deleting and reordering sections.
- Creating, editing, deleting jobs and changing their status.
- Public careers-page content and job filters.
- Successful and unsuccessful job-detail requests.
- Frontend production build.
- Responsive behavior and accessibility checks.

## **13. Scalability and Next Steps**

If the application grows, there are several things that can be improved.

Database indexes can be added for fields such as `company_id`, `slug`, `status` and searchable fields.

Large job and API results can use pagination instead of loading everything at once.

Object storage and a CDN can be used for media files.

Frequently accessed public pages can also use caching to improve performance.

More detailed role-based permissions can be added for recruiters.

Other future improvements include monitoring, rate limiting, CI/CD, backups and disaster recovery.

## **14. Deployment**

The recommended production setup has three main parts.

Neon PostgreSQL is used for the database, Render runs the FastAPI backend, and Vercel hosts the React frontend.

The frontend gets the deployed backend API URL through an environment variable.

Sensitive information and secrets are kept in the environment settings of the hosting platforms instead of putting them directly into the source code.
