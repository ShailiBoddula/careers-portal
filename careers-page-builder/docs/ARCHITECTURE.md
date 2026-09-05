# Careers Page Builder Documentation

## Architecture & Workflows

### 1. Recruiter Workflow
1. Recruiter signs in with JWT authentication at `/login`.
2. Identity is securely verified on the backend, resolving to the recruiter's tenant (`company_id`).
3. Recruiter accesses `/:companySlug/edit` to customize branding, page sections, and jobs.
4. Changes are staged in a **Draft** state.
5. Recruiter previews the careers portal in both desktop and mobile viewports.
6. When ready, clicking **Publish** promotes all active sections to live status.

### 2. Candidate Workflow
1. Candidate navigates to public URL `/:companySlug/careers` (no authentication required).
2. Content is rendered dynamically based on published sections.
3. Candidate performs composite searches combining title keywords, location, and employment type.
4. Clicking **View Job Details** directs the candidate to `/:companySlug/careers/jobs/:jobId`.
5. Candidate reviews the full requisition and clicks **Apply Now** to proceed to the company's application system.
