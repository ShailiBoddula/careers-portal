import uuid
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from app.database.base import engine, Base, SessionLocal
from app.models.models import User, Company, CareerPage, PageSection, Job
from app.security.auth import hash_password


def seed():
    print("Recreating database tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db: Session = SessionLocal()
    try:
        now = datetime.now(timezone.utc)

        # ─────────────────────────────────────────────────────────────
        # 1. ACME CORP (Enterprise Cloud & Workflows)
        # ─────────────────────────────────────────────────────────────
        acme = Company(
            id=str(uuid.uuid4()),
            name="Acme Corporation",
            slug="acme",
            logo_url="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=160&auto=format&fit=crop&q=80",
            primary_color="#2563eb",
            secondary_color="#1e40af",
            banner_url="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&auto=format&fit=crop&q=80",
            culture_video_url="https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        )
        db.add(acme)

        recruiter_acme = User(
            id=str(uuid.uuid4()),
            email="recruiter@acme.com",
            password_hash=hash_password("password123"),
            role="recruiter",
            company_id=acme.id,
        )
        db.add(recruiter_acme)

        page_acme = CareerPage(
            id=str(uuid.uuid4()),
            company_id=acme.id,
            headline="Build the Infrastructure that Powers Global Commerce",
            description="Acme builds high-throughput, mission-critical workflow automation used by 10,000+ businesses globally.",
            published=True,
        )
        db.add(page_acme)

        acme_sections = [
            PageSection(
                id=str(uuid.uuid4()),
                career_page_id=page_acme.id,
                section_type="hero",
                title="Do work that moves the world forward",
                content="Join a team of high-agency builders crafting distributed software with obsessive attention to craft.",
                display_order=0,
                is_visible=True,
                is_published=True,
            ),
            PageSection(
                id=str(uuid.uuid4()),
                career_page_id=page_acme.id,
                section_type="about",
                title="About Acme",
                content="Founded in 2018 in San Francisco, Acme provides core infrastructure to Fortune 500 enterprises. We are 100% remote-first with global hubs across North America, Europe, and Asia-Pacific.",
                display_order=1,
                is_visible=True,
                is_published=True,
            ),
            PageSection(
                id=str(uuid.uuid4()),
                career_page_id=page_acme.id,
                section_type="values",
                title="Our Guiding Values",
                content="Extreme Customer Empathy | Bias for Thoughtful Action | Candor and Radical Humility | Long-Term Compounding | Uncompromising Quality",
                display_order=2,
                is_visible=True,
                is_published=True,
            ),
            PageSection(
                id=str(uuid.uuid4()),
                career_page_id=page_acme.id,
                section_type="life",
                title="Life at Acme",
                content="We optimize for deep focus, not endless Zoom meetings. We operate with synchronous focus blocks (4 hours) and asynchronous planning docs. Annual company-wide offsites in Iceland, Portugal, and Japan.",
                display_order=3,
                is_visible=True,
                is_published=True,
            ),
            PageSection(
                id=str(uuid.uuid4()),
                career_page_id=page_acme.id,
                section_type="culture",
                title="Our Engineering Culture",
                content="Engineers own their services from architecture to production telemetry. We review code collaboratively, celebrate blameless post-mortems, and ship continuous improvements daily.",
                display_order=4,
                is_visible=True,
                is_published=True,
            ),
            PageSection(
                id=str(uuid.uuid4()),
                career_page_id=page_acme.id,
                section_type="benefits",
                title="Benefits & Perks",
                content="100% Covered Medical, Dental & Vision | 401(k) 5% Match | Unlimited PTO with $2,500 Vacation Bonus | $3,000 Annual Learning Grant | Ergonomic Home Setup Stipend ($1,500)",
                display_order=5,
                is_visible=True,
                is_published=True,
            ),
            PageSection(
                id=str(uuid.uuid4()),
                career_page_id=page_acme.id,
                section_type="open_positions",
                title="Open Roles",
                content="We are looking for thoughtful engineers, designers, and operators to join us. Search open roles below.",
                display_order=6,
                is_visible=True,
                is_published=True,
            ),
        ]
        db.add_all(acme_sections)

        acme_jobs = [
            Job(
                id=str(uuid.uuid4()),
                company_id=acme.id,
                title="Staff Distributed Systems Engineer",
                location="San Francisco, CA (Hybrid)",
                job_type="Full-time",
                department="Engineering",
                description="Lead the core architecture of our distributed state machine processing 100M events per day.",
                requirements="7+ years building large-scale distributed systems in Go or Rust. Deep understanding of Raft, PostgreSQL, and event streaming architectures.",
                responsibilities="Design fault-tolerant replication protocols. Mentor staff and senior engineers. Collaborate with product on foundational capabilities.",
                benefits="Competitive top-tier base salary ($210k - $270k) + meaningful equity + full family healthcare.",
                application_url="https://acme.com/careers/staff-systems",
                is_active=True,
                posted_at=now,
            ),
            Job(
                id=str(uuid.uuid4()),
                company_id=acme.id,
                title="Senior Product Designer (Design Systems)",
                location="Remote (US / Canada)",
                job_type="Full-time",
                department="Design",
                description="Architect and maintain our multi-product web design system used across 12 product teams.",
                requirements="5+ years in product design and design system architecture. Mastery of Figma, token systems, and web accessibility (WCAG 2.1 AA).",
                responsibilities="Create reusable UI components, craft interaction guidelines, and pair with frontend engineers on implementation.",
                benefits="Competitive salary ($160k - $195k) + equity + $3k home workstation budget.",
                application_url="https://acme.com/careers/sr-designer",
                is_active=True,
                posted_at=now,
            ),
            Job(
                id=str(uuid.uuid4()),
                company_id=acme.id,
                title="Frontend Engineer (React / Tailwind)",
                location="Remote (Global)",
                job_type="Full-time",
                department="Engineering",
                description="Build fast, polished, and responsive web applications for enterprise administrators and candidates.",
                requirements="3+ years of experience with React, Tailwind CSS, and TypeScript. Deep appreciation for UI micro-interactions and web performance.",
                responsibilities="Implement pixel-perfect responsive layouts, optimize rendering lifecycle, and maintain end-to-end test coverage.",
                benefits="Global payroll, stock options, health insurance stipend, flexible working hours.",
                application_url="https://acme.com/careers/frontend-eng",
                is_active=True,
                posted_at=now,
            ),
            Job(
                id=str(uuid.uuid4()),
                company_id=acme.id,
                title="DevOps & Cloud Security Architect",
                location="New York, NY (Hybrid)",
                job_type="Full-time",
                department="Security",
                description="Harden cloud perimeter, automate zero-trust IAM policies, and maintain SOC 2 compliance.",
                requirements="5+ years in cloud security and infrastructure automation (Terraform, AWS, Kubernetes).",
                responsibilities="Conduct security threat modeling, automate CI/CD pipeline scanning, and lead penetration testing remediations.",
                benefits="Generous bonus structure, commuter transit pass, fitness membership, 401(k) match.",
                application_url="https://acme.com/careers/cloud-security",
                is_active=True,
                posted_at=now,
            ),
        ]
        db.add_all(acme_jobs)

        # ─────────────────────────────────────────────────────────────
        # 2. NOVA LABS AI (Frontier AI & Molecular Biology)
        # ─────────────────────────────────────────────────────────────
        nova = Company(
            id=str(uuid.uuid4()),
            name="NovaLabs AI",
            slug="novalabs",
            logo_url="https://images.unsplash.com/photo-1614680376593-902f749f7ffc?w=160&auto=format&fit=crop&q=80",
            primary_color="#7c3aed",
            secondary_color="#5b21b6",
            banner_url="https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&auto=format&fit=crop&q=80",
            culture_video_url="https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        )
        db.add(nova)

        recruiter_nova = User(
            id=str(uuid.uuid4()),
            email="recruiter@novalabs.ai",
            password_hash=hash_password("password123"),
            role="recruiter",
            company_id=nova.id,
        )
        db.add(recruiter_nova)

        page_nova = CareerPage(
            id=str(uuid.uuid4()),
            company_id=nova.id,
            headline="Pioneering Foundation Models for Biological Discovery",
            description="NovaLabs trains generative molecular models on massive GPU clusters to cure hard genetic diseases.",
            published=True,
        )
        db.add(page_nova)

        nova_sections = [
            PageSection(
                id=str(uuid.uuid4()),
                career_page_id=page_nova.id,
                section_type="hero",
                title="Invent the Frontier of Scientific AI",
                content="We operate thousands of GPUs dedicated to generative biophysics and structural biology alongside world-class scientists.",
                display_order=0,
                is_visible=True,
                is_published=True,
            ),
            PageSection(
                id=str(uuid.uuid4()),
                career_page_id=page_nova.id,
                section_type="about",
                title="Our Mission",
                content="NovaLabs is backed by $150M in venture funding from premier science and technology investors. Our models have designed 4 novel therapeutic candidates currently in clinical trials.",
                display_order=1,
                is_visible=True,
                is_published=True,
            ),
            PageSection(
                id=str(uuid.uuid4()),
                career_page_id=page_nova.id,
                section_type="values",
                title="Scientific Integrity & Principles",
                content="Rigorous Scientific Method | Safety First | Extreme Curiosity | Open Publication of Non-Therapeutic Findings | Collaborative Humility",
                display_order=2,
                is_visible=True,
                is_published=True,
            ),
            PageSection(
                id=str(uuid.uuid4()),
                career_page_id=page_nova.id,
                section_type="culture",
                title="Life at NovaLabs",
                content="Based in Kendall Square, Cambridge, MA. Daily scientific colloquiums, catered lunches from local chefs, and generous conference travel budgets to NeurIPS, ICML, and Biophysical Society.",
                display_order=3,
                is_visible=True,
                is_published=True,
            ),
            PageSection(
                id=str(uuid.uuid4()),
                career_page_id=page_nova.id,
                section_type="benefits",
                title="Comprehensive Perks",
                content="Top 1% Compensation | Substantial Founding Equity | Onsite Chef Catered Breakfast & Lunch | Cambridge Relocation Package | $10,000 Annual Conference Grant",
                display_order=4,
                is_visible=True,
                is_published=True,
            ),
            PageSection(
                id=str(uuid.uuid4()),
                career_page_id=page_nova.id,
                section_type="open_positions",
                title="Open Opportunities in Science & Engineering",
                content="Explore open positions in Cambridge and remote below.",
                display_order=5,
                is_visible=True,
                is_published=True,
            ),
        ]
        db.add_all(nova_sections)

        nova_jobs = [
            Job(
                id=str(uuid.uuid4()),
                company_id=nova.id,
                title="Senior AI Research Scientist (Equivariant GNNs)",
                location="Cambridge, MA (Onsite)",
                job_type="Full-time",
                department="Research",
                description="Lead research into geometric deep learning and 3D molecular conformation generation.",
                requirements="Ph.D. in Machine Learning, Computer Science, or Computational Chemistry. Track record of tier-1 publications (NeurIPS, ICML, ICLR).",
                responsibilities="Develop novel neural architectures, train distributed models across thousands of GPUs, and co-author high-impact research.",
                benefits="$240,000 - $310,000 base + significant equity package + relocation support.",
                application_url="https://novalabs.ai/apply/gnn-scientist",
                is_active=True,
                posted_at=now,
            ),
            Job(
                id=str(uuid.uuid4()),
                company_id=nova.id,
                title="HPC Cluster Systems Engineer",
                location="Boston, MA (Hybrid)",
                job_type="Full-time",
                department="Infrastructure",
                description="Ensure maximum GPU cluster utilization across multi-terabyte InfiniBand interconnects.",
                requirements="4+ years administering Slurm clusters, NVIDIA DGX/H100 systems, and high-performance parallel file systems (Lustre / GPFS).",
                responsibilities="Optimize NCCL collective communication, debug kernel-level GPU driver events, and maintain 99.9% compute uptime.",
                benefits="Competitive salary + equity + comprehensive family health benefits.",
                application_url="https://novalabs.ai/apply/hpc-engineer",
                is_active=True,
                posted_at=now,
            ),
            Job(
                id=str(uuid.uuid4()),
                company_id=nova.id,
                title="Bioinformatics Research Intern",
                location="Cambridge, MA (Onsite)",
                job_type="Internship",
                department="Biology",
                description="Partner with experimental biologists to benchmark in-silico binding affinities against wet-lab SPR data.",
                requirements="Enrolled in an MSc/Ph.D. in Computational Biology or Bioinformatics. Proficiency in Python, Pandas, and RDKit.",
                responsibilities="Analyze screening assays, curate training datasets, and present findings in team seminars.",
                benefits="$60/hour compensation + housing assistance in Boston.",
                application_url="https://novalabs.ai/apply/bio-intern",
                is_active=True,
                posted_at=now,
            ),
        ]
        db.add_all(nova_jobs)

        # ─────────────────────────────────────────────────────────────
        # 3. VERTEX HEALTH (Digital Healthcare & Telemedicine)
        # ─────────────────────────────────────────────────────────────
        vertex = Company(
            id=str(uuid.uuid4()),
            name="Vertex Health",
            slug="vertex",
            logo_url="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=160&auto=format&fit=crop&q=80",
            primary_color="#059669",
            secondary_color="#047857",
            banner_url="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1600&auto=format&fit=crop&q=80",
            culture_video_url="https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        )
        db.add(vertex)

        recruiter_vertex = User(
            id=str(uuid.uuid4()),
            email="recruiter@vertexhealth.com",
            password_hash=hash_password("password123"),
            role="recruiter",
            company_id=vertex.id,
        )
        db.add(recruiter_vertex)

        page_vertex = CareerPage(
            id=str(uuid.uuid4()),
            company_id=vertex.id,
            headline="Delivering Compassionate Healthcare Everywhere",
            description="We connect millions of underserved patients with board-certified physicians in under 5 minutes.",
            published=True,
        )
        db.add(page_vertex)

        vertex_sections = [
            PageSection(
                id=str(uuid.uuid4()),
                career_page_id=page_vertex.id,
                section_type="hero",
                title="Transform Patient Lives with Every Line of Code",
                content="Healthcare should be immediate, compassionate, and transparent. Help us expand clinical access nationwide.",
                display_order=0,
                is_visible=True,
                is_published=True,
            ),
            PageSection(
                id=str(uuid.uuid4()),
                career_page_id=page_vertex.id,
                section_type="about",
                title="About Vertex Health",
                content="Founded by doctors and software engineers in Austin, Texas. Vertex serves over 2 million patients across all 50 states.",
                display_order=1,
                is_visible=True,
                is_published=True,
            ),
            PageSection(
                id=str(uuid.uuid4()),
                career_page_id=page_vertex.id,
                section_type="values",
                title="Patient-First Core Values",
                content="Patient Dignity Above All | Clinical Rigor | Transparent Pricing | Uncompromising Privacy & HIPAA Integrity",
                display_order=2,
                is_visible=True,
                is_published=True,
            ),
            PageSection(
                id=str(uuid.uuid4()),
                career_page_id=page_vertex.id,
                section_type="benefits",
                title="Wellness & Benefits for Our Team",
                content="Zero-Deductible Platinum Medical Insurance | Mental Health Coaching App Access | Monthly Wellness Rest Day | 16-Week Paid Parental Leave",
                display_order=3,
                is_visible=True,
                is_published=True,
            ),
            PageSection(
                id=str(uuid.uuid4()),
                career_page_id=page_vertex.id,
                section_type="open_positions",
                title="Current Healthcare & Tech Openings",
                content="Join our mission to democratize healthcare.",
                display_order=4,
                is_visible=True,
                is_published=True,
            ),
        ]
        db.add_all(vertex_sections)

        vertex_jobs = [
            Job(
                id=str(uuid.uuid4()),
                company_id=vertex.id,
                title="Lead HIPAA & Clinical Security Architect",
                location="Austin, TX (Hybrid)",
                job_type="Full-time",
                department="Security",
                description="Oversee end-to-end EHR encryption, zero-trust network policy, and annual SOC 2 Type II compliance.",
                requirements="6+ years leading healthtech information security. CISSP or CISM certification preferred.",
                responsibilities="Conduct continuous vulnerability assessments, lead incident response drills, and interface with medical ethics board.",
                benefits="Excellent compensation ($170k - $210k) + full medical/dental + 401(k) matching.",
                application_url="https://vertexhealth.com/careers/lead-security",
                is_active=True,
                posted_at=now,
            ),
            Job(
                id=str(uuid.uuid4()),
                company_id=vertex.id,
                title="Telehealth Operations Lead",
                location="Remote (US)",
                job_type="Contract",
                department="Operations",
                description="Coordinate multi-state clinician licensing and triage queue logistics for our urgent care providers.",
                requirements="3+ years in clinical operations or hospital administration. Exceptional communication and operational workflow acumen.",
                responsibilities="Manage physician scheduling, monitor SLA response times, and implement clinician feedback loops.",
                benefits="$45 - $55/hour, fully remote, flexible schedule.",
                application_url="https://vertexhealth.com/careers/ops-lead",
                is_active=True,
                posted_at=now,
            ),
            Job(
                id=str(uuid.uuid4()),
                company_id=vertex.id,
                title="Senior React Native Mobile Engineer",
                location="Remote (US)",
                job_type="Full-time",
                department="Engineering",
                description="Develop our patient-facing iOS and Android consultation application supporting encrypted video calls.",
                requirements="4+ years shipping production React Native apps. Experience with WebRTC and offline data sync.",
                responsibilities="Implement appointment booking, real-time video consults, prescription fulfillment tracking.",
                benefits="Competitive salary + equity + home workstation reimbursement.",
                application_url="https://vertexhealth.com/careers/react-native",
                is_active=True,
                posted_at=now,
            ),
        ]
        db.add_all(vertex_jobs)

        db.commit()
        print("Database seeded successfully with 3 companies, 3 recruiter accounts, and 10 realistic jobs!")
    except Exception as e:
        db.rollback()
        print(f"Failed to seed database: {e}")
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    seed()
