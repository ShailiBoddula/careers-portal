# AGENT_LOG — Careers Page Builder

## **1. AI / Development Tools Used**

For developing this project, I mainly used **Antigravity** as an AI-assisted development environment. I used it for implementation, reviewing the project, testing and making improvements.

I used **GitHub** to manage the source code and keep the project repository.

For deployment, the platforms planned for the project are **Vercel, Railway and Neon**.

## **2. Initial Requirements**

The main requirement was to build a multi-tenant ATS Careers Page Builder.

The project needed to allow recruiters to customize their company’s branding and edit the careers page. It also needed different sections that could be managed separately.

Other important requirements were job management, job searching and filtering for candidates, responsive design, accessibility, SEO support, sample data, deployment and proper documentation.

The required technologies included **React, HTML5, CSS3, Tailwind CSS, Python, FastAPI, REST APIs, PostgreSQL/Neon and JWT**.

Git and GitHub were used for version control, and Docker, Vercel, Railway and Neon were part of the deployment setup.

## **3. Changes and Improvements During Development**

While developing the project, I made some changes based on what was needed.

I kept the backend using **Python and FastAPI** instead of adding another backend framework.

For multi-tenancy, I organized the data around company ownership. This helps keep each company’s data separate.

Instead of creating one fixed company page, I used modular sections. This makes it possible to add, edit, remove and reorder different parts of the careers page.

I also kept recruiter routes separate from public candidate routes. Recruiter features are protected, while candidates can access the public pages.

For job searching, I added search by job title and filters for location and job type.

I also checked the application on different screen sizes and checked some accessibility features.

For deployment, I worked with the setup of:

**GitHub → Railway → Vercel → Neon**

## **4. Testing and Verification**

I tested the backend features that are important for the application.

This included login and authentication, invalid credentials, authorization, company data isolation, and checking that one company cannot modify another company’s jobs or sections.

I also tested branding, publishing and unpublishing, section creation and editing, section reordering, job creation and editing, public job filtering and job details.

The final local testing showed **49 tests passing, with 0 failures and 0 warnings**.

I also checked the frontend production build using `npm run build`.

For responsive testing, I checked different screen sizes from mobile to desktop.

I also checked that interactive elements show visible focus for accessibility.

After the final checks, the stress-test status was reported as **READY**.

## **5. Documentation**

The project has different documents for different purposes.

The **README** explains how to set up and use the project. It also covers the features, architecture, demo accounts, recruiter and candidate guides, testing and possible improvements.

The **Tech Spec** explains the technical side in more detail, including the architecture, database schema, multi-tenancy, security, page builder, candidate experience, SEO, accessibility, testing, scalability and deployment.

The **AGENT_LOG** records how AI-assisted development was used during the project and what testing and validation was done.

## **6. What I Learned**

One important thing I understood from this project is that keeping company data separate is very important when one platform is being used by multiple companies.

I also learned that keeping public APIs and recruiter APIs separate makes authorization easier and reduces the chance of exposing data accidentally.

Using a modular section system is also useful because it gives companies more flexibility when customizing their careers pages.

Another thing I learned is that just testing the UI is not enough for security. We also need tests for authorization and tenant isolation to make sure one company cannot access another company’s data.

I also understood that planning things like environment variables, CORS, routing, database settings and the connection between different services early in the project can make deployment much easier.

## **7. Security Note**

Production secrets such as API keys, database passwords, credentials and private tokens should never be added to the GitHub repository.

The credentials provided for the demo accounts are only sample credentials for testing.

For the actual production application, sensitive values should be stored using environment variables provided by the hosting platform.
