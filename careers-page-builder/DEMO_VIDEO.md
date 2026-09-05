# Demonstration Video Walkthrough Script

**Project**: Multi-Tenant ATS Careers Page Builder  
**Duration**: 3 Minutes (180 Seconds)  
**Tone**: Professional, crisp, product-oriented  

---

### Timeline & Narration Script

#### [0:00 - 0:10] Introduction & Recruiter Sign-In
- **Screen**: `/login` portal with clean dark background, ATS branding, and one-click demo selectors.
- **Action**: Click the "Acme Corporation" quick-fill button (`recruiter@acme.com`), then click **Sign In to Builder**.
- **Audio / Narration**: *"Welcome to the Multi-Tenant ATS Careers Page Builder. We begin at the recruiter login portal, where recruiters authenticate using secure JWTs derived strictly from server credentials."*

#### [0:10 - 0:20] Recruiter Dashboard & Studio Overview
- **Screen**: `/acme/edit` showing split-pane workspace (Editor sidebar on left, Live Interactive Preview on right).
- **Action**: Highlight the company name, published status badge ("Published"), and the 3 editor tabs: Page Sections, Branding & Media, and Jobs.
- **Audio / Narration**: *"Upon sign-in, recruiters land in their dedicated tenant workspace. The left pane provides controls for modular sections, branding, and jobs, while the right pane renders an instant live preview."*

#### [0:20 - 0:35] Brand Identity & Dynamic Styling
- **Screen**: Click **Branding & Media** tab.
- **Action**: Change primary brand color from Blue (`#2563eb`) to Indigo or Emerald using the color picker. Observe the live preview immediately updating buttons, badges, and accents to match the brand color.
- **Audio / Narration**: *"Recruiters can update brand identities on the fly. Adjusting primary or secondary colors immediately flows through all candidate buttons, badges, and accents in the live preview."*

#### [0:35 - 0:50] Section Management & Editing
- **Screen**: Click **Page Sections** tab.
- **Action**: Click the Edit icon on the "Core Values" section. Modify the copy to add a new principle. Click **Save Changes**. Then, click the "+ Culture" button to add a new pre-built section.
- **Audio / Narration**: *"Sections can be added, customized, or hidden with a single click. Supported sections include Hero, About Us, Core Values, Life at Company, Culture, Benefits, and Open Positions."*

#### [0:50 - 1:10] Accessible Section Reordering (Keyboard-Ready)
- **Screen**: Section list.
- **Action**: Click the Up Arrow (↑) button on the "Benefits & Perks" section. Watch it shift above the "Culture" section in both the editor and the live preview canvas.
- **Audio / Narration**: *"Notice that section reordering uses accessible button controls with semantic ARIA labels, eliminating brittle third-party drag-and-drop libraries while ensuring full keyboard accessibility."*

#### [1:10 - 1:20] Responsive Device Previews (Desktop / Mobile)
- **Screen**: Preview frame top bar.
- **Action**: Click the **Mobile** toggle button. Watch the preview frame smoothly transform into a mobile device viewport (390px width) demonstrating clean responsive layout without horizontal overflow. Then toggle back to **Desktop**.
- **Audio / Narration**: *"Recruiters can preview their careers board across both desktop and mobile viewports with a single click, ensuring a flawless mobile candidate experience."*

#### [1:20 - 1:30] Safe Editing: Draft vs. Published Model
- **Screen**: Top navigation bar.
- **Action**: Point to the "Unsaved changes" indicator. Click **Save Draft** (status shows "Draft Saved"). Then click **Unpublish** followed by **Publish to Web**.
- **Audio / Narration**: *"Edits are saved as drafts first, ensuring candidate-facing portals never experience broken states. Publishing is an intentional act that promotes draft configurations to live public status."*

#### [1:30 - 1:45] Live Public Candidate Board
- **Screen**: Open new tab navigating to `/acme/careers`.
- **Action**: Scroll smoothly through the page showing the custom banner, Hero section, About Us, Values cards, Benefits grid, and Open Positions list.
- **Audio / Narration**: *"Navigating to the public URL—with no authentication required—candidates experience a fast, responsive, beautifully styled careers page reflecting the company's brand."*

#### [1:45 - 2:20] Candidate Search, Location & Job Type Filtering
- **Screen**: Open positions filter bar on `/acme/careers`.
- **Action**:
  1. Type `Backend` into the search box — list updates instantly to 1 role.
  2. Clear search, select **Remote (Global)** from the Location dropdown.
  3. Select **Full-time** from the Employment Type dropdown.
  4. Click the **Reset** button to restore all active open positions.
- **Audio / Narration**: *"Candidates can filter open opportunities in real time. Search keywords, locations, and employment types can be combined freely, backed by empty states and one-click resets."*

#### [2:20 - 2:40] Job Requisition Details & Google JobPosting SEO
- **Screen**: Click **View Job Details** on a job card, landing on `/acme/careers/jobs/:jobId`.
- **Action**: Show job overview, responsibilities, requirements, compensation, and the **Apply Now** CTA. Open browser DevTools to highlight the injected Google `JobPosting` JSON-LD structured data.
- **Audio / Narration**: *"Each requisition features a dedicated view with structured qualifications and an Apply CTA. Automatic JSON-LD schema injection ensures immediate discoverability on Google Jobs."*

#### [2:40 - 3:00] Multi-Tenant Isolation & Architecture Summary
- **Screen**: Show terminal running `pytest backend/tests -v` with all 12 tests passing.
- **Action**: Highlight the test suite confirming that cross-company modifications return 403 Forbidden.
- **Audio / Narration**: *"Behind the scenes, FastAPI and SQLAlchemy guarantee strict multi-tenant isolation. All tests pass with zero flakiness. Thank you for watching!"*
