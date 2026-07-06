"""
info_router.py
Production-grade information payload router for SRM KTR University Portal.
Returns exhaustive text payloads for every navigation menu slug.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/api/v1/info", tags=["info"])

# ─────────────────────────────────────────────────────────────────────────────
# EXHAUSTIVE CONTENT DATABASE
# ─────────────────────────────────────────────────────────────────────────────
INFO_DB: dict[str, dict] = {

    # ── ACADEMICS ─────────────────────────────────────────────────────────────
    "academics-undergrad": {
        "title": "Undergraduate Programs",
        "overview": (
            "SRM Institute of Science and Technology – Kattankulathur offers a wide array of "
            "undergraduate programs across Engineering, Science, Management, and Humanities. "
            "Our B.Tech programmes span 4 years of rigorous, industry-aligned curriculum that "
            "blends theoretical foundations with hands-on lab experience, live projects, and "
            "mandatory internship semesters. Small class sizes, dedicated faculty mentors, and "
            "access to world-class research labs ensure every student receives personalised "
            "academic attention. The university follows a credit-based grading system (CBCS) "
            "with full flexibility to choose electives and minors across departments."
        ),
        "specs": [
            "Duration: 4 Years (8 Semesters)",
            "Programs: B.Tech in CSE, ECE, Mech, Civil, IT, AIDS, AIML, Cyber Security, Biomedical, Chemical",
            "Total Credits Required: 160 (Core: 120 + Electives: 40)",
            "Grading System: 10-Point CGPA (CBCS)",
            "Mandatory Internship: End of 6th Semester (8 weeks minimum)",
            "Minor Degrees Available: Data Science, IoT, Business Analytics",
            "Lateral Entry (B.Tech 2nd Year): Available for Diploma holders",
            "NBA / NAAC A++ Accredited Programs",
        ],
    },
    "academics-postgrad": {
        "title": "Postgraduate Programs",
        "overview": (
            "SRMIST offers M.Tech, MBA, M.Sc, and MCA programmes designed to deepen specialization "
            "and cultivate leadership and research capabilities. The M.Tech programs are research-intensive, "
            "requiring a dissertation project in the final year. MBA streams cover Finance, Marketing, HR, "
            "Operations, and Business Analytics, with live corporate projects and top-tier placements. "
            "The university has exclusive tie-ups with IIMs and global B-Schools for student exchange programmes."
        ),
        "specs": [
            "Duration: 2 Years (4 Semesters)",
            "M.Tech Streams: CSE, ECE, Structural Engg, Power Systems, Biotechnology",
            "MBA Specialisations: Finance, Marketing, HR, Ops, Business Analytics",
            "MCA: Master of Computer Applications (3-Year Integrated also available)",
            "Research Stipend: ₹12,500/month for full-time M.Tech research scholars",
            "GATE Score: Required for M.Tech (GATE-qualified get fee waiver)",
            "CAT / MAT / XAT / SRMJEEM: Accepted for MBA admissions",
            "Placement Rate: 92% for MBA batch (Avg. CTC ₹8.2 LPA)",
        ],
    },
    "academics-phd": {
        "title": "Ph.D. & Doctoral Research Programs",
        "overview": (
            "The doctoral research program at SRMIST is one of the most vibrant in South India, with over "
            "2,000 active Ph.D. scholars across disciplines. The university hosts 14 dedicated research "
            "centres with state-of-the-art equipment, and has published over 8,000 Scopus-indexed papers "
            "in the last 5 years. Scholars benefit from international collaborations with MIT, NUS, TU Delft, "
            "and the University of Melbourne. Full-time scholars receive monthly fellowships and free hostel accommodation."
        ),
        "specs": [
            "Minimum Duration: 3 Years (Full-time) | 5 Years (Part-time)",
            "Eligibility: PG degree with 55% aggregate in relevant discipline",
            "Entrance: SRMJEEM-PhD / UGC-NET / GATE / CSIR-NET qualified",
            "Fellowship: ₹20,000/month (Full-time, non-GATE) | ₹25,000/month (GATE qualified)",
            "Annual Progression Review by Doctoral Committee",
            "Mandatory International Journal Publication (SCI/Scopus indexed)",
            "14 Active Research Centres including NanoTech, AI, Biomedical Engineering",
            "International Collaborations: MIT, NUS, TU Delft, Univ. of Melbourne",
        ],
    },
    "academics-syllabus": {
        "title": "Curriculum & Syllabus",
        "overview": (
            "SRMIST follows a dynamic, revision-controlled curriculum updated every two years in consultation "
            "with industry advisory boards, alumni, and faculty senates. The curriculum is structured on the "
            "Outcome-Based Education (OBE) framework, ensuring every course maps directly to program outcomes "
            "and graduate attributes. Digital syllabi for all active courses are available in the student portal "
            "under 'My Courses'. Faculty upload course materials, lecture notes, and assessment schedules on "
            "SRM Academia within the first week of each semester."
        ),
        "specs": [
            "Curriculum Revision Cycle: Every 2 Years",
            "Framework: Outcome-Based Education (OBE) + Bloom's Taxonomy",
            "Industry Advisory Board: 40+ CXOs and senior engineers",
            "Course Material Platform: SRM Academia (LMS)",
            "Assessment Pattern: 25 (Cycle Tests) + 25 (Assignments) + 50 (End Sem Exam)",
            "Practical Component: ≥30% of total credits must be lab/project-based",
            "MOOC Integration: 2 NPTEL/Coursera credits mandatory per year",
            "Elective Basket: 4 Professional Electives + 2 Open Electives per program",
        ],
    },
    "academics-timetable": {
        "title": "Academic Timetable & Calendar",
        "overview": (
            "The academic year at SRMIST is divided into two semesters — Odd Semester (July–November) and "
            "Even Semester (December–April) — with a short Summer Term (May–June) for backlog clearance and "
            "value-added courses. The official academic calendar, including examination schedules, holidays, "
            "and registration deadlines, is published on the university website and student portal at the "
            "beginning of each academic year. Class schedules are managed through the Online Time Table "
            "module accessible via SRM Academia."
        ),
        "specs": [
            "Odd Semester: July – November",
            "Even Semester: December – April",
            "Summer Term: May – June (backlog & value-add courses)",
            "Cycle Test I: Weeks 4–5 of each semester",
            "Cycle Test II: Weeks 9–10 of each semester",
            "End Semester Exams: Last 2 weeks of semester",
            "Registration Deadline: Within 2 weeks of semester start",
            "Timetable Access: SRM Academia → My Courses → Timetable",
        ],
    },

    # ── RESEARCH ──────────────────────────────────────────────────────────────
    "research-centers": {
        "title": "Research Centres & Labs",
        "overview": (
            "SRMIST houses 14 state-of-the-art research centres that serve as the nucleus of innovation on "
            "campus. These centres operate with dedicated infrastructure budgets and attract external funding "
            "from DST, DRDO, ISRO, DBT, and international bodies. Multidisciplinary collaboration is encouraged, "
            "with many centres hosting joint projects between Engineering, Medicine, and Management schools. "
            "Students at all levels — UG, PG, and Ph.D. — can apply for research assistant positions in these centres."
        ),
        "specs": [
            "Centre for Nanotechnology & Advanced Biomaterials (CeNTAB)",
            "Artificial Intelligence & Machine Learning Research Lab",
            "Centre for Drug Discovery & Development (CD3)",
            "Robotics & Automation Research Centre",
            "Centre for Environmental Studies & Sustainability",
            "Smart Grid & Renewable Energy Research Lab",
            "VLSI Design & Embedded Systems Centre",
            "Centre for Space Technology Applications",
            "External Funding Sources: DST, DRDO, ISRO, DBT, Indo-US STF",
            "Total Active Projects: 340+ (as of 2024-25)",
        ],
    },
    "research-publications": {
        "title": "Research Publications & Impact",
        "overview": (
            "SRMIST ranks among the top 10 Indian universities in research output, with a consistently high "
            "publication count in top-tier Scopus, SCI, and Web of Science indexed journals. The university "
            "has a dedicated Office of Research & Innovation (ORI) that assists faculty and scholars in "
            "manuscript preparation, journal selection, and patent filing. A centralised institutional "
            "repository (SRMIST IR) archives all publications, theses, and technical reports."
        ),
        "specs": [
            "Scopus-Indexed Publications (2023-24): 4,200+",
            "h-Index (Institutional): 89",
            "Total Citations (Google Scholar): 2.1 Lakh+",
            "Patents Filed: 1,800+ | Patents Granted: 620+",
            "Nature / Science / IEEE Transactions publications: 180+",
            "Research Funding Received (2023-24): ₹45 Crores",
            "SRMIST IR Access: ir.srmist.edu.in",
            "Office of Research & Innovation: ori@srmist.edu.in",
        ],
    },
    "research-funding": {
        "title": "Research Grants & Funding",
        "overview": (
            "SRMIST actively encourages faculty and students to pursue external research grants and industry-funded "
            "projects. The Office of Research & Innovation (ORI) offers end-to-end support — from identifying "
            "funding opportunities and proposal writing workshops to financial management and compliance reporting. "
            "The university has received grants from DST-SERB, CSIR, DRDO, ISRO, the Indo-US Science & Technology "
            "Forum, and bilateral programs with European Research Council (ERC) partners."
        ),
        "specs": [
            "Seed Grant (Internal): Up to ₹5 Lakhs per faculty project",
            "DST-SERB CRG: Up to ₹50 Lakhs for core research projects",
            "DRDO Projects: 25 active grants, avg. ₹1.2 Crore each",
            "ISRO-Respond Program: Satellite tech and remote sensing projects",
            "Indo-US STF: Joint Indo-US research initiatives",
            "Overhead Charges: 20% of grant goes to university overhead",
            "Student Research Fellowships: Available under DST-INSPIRE, CSIR-SRF",
            "ORI Support Email: ori.grants@srmist.edu.in",
        ],
    },
    "research-patents": {
        "title": "Patents & Intellectual Property",
        "overview": (
            "SRMIST has a robust Intellectual Property Rights (IPR) cell that manages the university's growing "
            "patent portfolio. Faculty, scholars, and students are actively encouraged to file patents for "
            "innovations developed on campus. The IPR cell provides free consultation, prior art searches, "
            "and patent drafting assistance. Technology Transfer Office (TTO) facilitates licensing of "
            "patented technologies to industry partners and spin-off companies."
        ),
        "specs": [
            "Total Patents Filed: 1,800+ (Indian + International)",
            "Patents Granted: 620+ (as of 2024)",
            "International Patents: 145 (USPTO, EPO, WIPO)",
            "IPR Cell Support: Full drafting, filing & prosecution assistance",
            "Revenue Sharing: 60% inventor | 20% department | 20% university",
            "Spin-off Companies Incubated: 28 (via SRM TBI)",
            "Technology Transfer Agreements: 35 active licenses",
            "IPR Cell Contact: ipr@srmist.edu.in",
        ],
    },

    # ── ADMISSIONS ────────────────────────────────────────────────────────────
    "admissions-process": {
        "title": "Admission Process",
        "overview": (
            "SRMIST admissions are conducted through SRMJEEE (Joint Engineering Entrance Examination) for "
            "B.Tech programs, SRMJEEM for M.Tech/MBA/MCA, and direct interview for Ph.D. programs. "
            "Applications are submitted online through the official admissions portal. After rank declaration, "
            "seat allotment happens through a centralised counselling process conducted in multiple rounds. "
            "Candidates must be physically present for document verification and fee payment to confirm their seat."
        ),
        "specs": [
            "SRMJEEE Phase I: October – November (Slot-based online exam)",
            "SRMJEEE Phase II: April – May (Slot-based online exam)",
            "Exam Mode: Computer Based Test (CBT) at authorised centres",
            "Subjects: Physics, Chemistry, Mathematics / Biology",
            "Duration: 2 Hours 30 Minutes | 125 Questions",
            "Counselling: Online portal + Physical verification",
            "Seat Acceptance Fee: ₹25,000 (adjusted against tuition)",
            "Admissions Helpline: 1800-102-1525 (Toll-Free)",
        ],
    },
    "admissions-fees": {
        "title": "Fee Structure",
        "overview": (
            "The fee structure at SRMIST varies by program and specialization. Fees are payable semester-wise "
            "through the SRM Fee Portal (online banking, DD, or campus payment counters). Scholarships and "
            "fee waivers are available for meritorious students, economically weaker sections (EWS), "
            "and students with disabilities. All fee-related queries are handled by the Accounts Section "
            "located in the Admin Block, Ground Floor."
        ),
        "specs": [
            "B.Tech (CSE / AIDS / AIML): ₹2,97,000 per year",
            "B.Tech (ECE / Mech / Civil / IT): ₹2,60,000 per year",
            "MBA: ₹2,50,000 per year",
            "M.Tech: ₹1,80,000 per year",
            "Hostel (AC Double): ₹1,20,000 per year",
            "Hostel (Non-AC Triple): ₹80,000 per year",
            "Bus Transport (Chennai routes): ₹30,000–₹45,000 per year",
            "Late Fee Penalty: ₹500/day after due date",
            "Fee Payment Portal: fees.srmist.edu.in",
        ],
    },
    "admissions-scholarships": {
        "title": "Scholarships & Financial Aid",
        "overview": (
            "SRMIST offers a comprehensive scholarship ecosystem to ensure that financial constraints do not "
            "prevent deserving students from pursuing quality education. Scholarships are categorized as "
            "Merit-based, Need-based, Sports, and Differently-Abled. In addition, government scholarships "
            "like the Central Sector Scholarship, Post-Matric SC/ST, and Tamil Nadu State scholarships are "
            "facilitated through the university's Student Welfare Office."
        ),
        "specs": [
            "Chancellor's Scholarship: 100% tuition waiver (top SRMJEEE ranks 1–100)",
            "Merit Scholarship: 25–75% waiver (ranks 101–5000)",
            "Sports Quota: Full fee waiver for national/state level athletes",
            "EWS Scholarship: 50% waiver (family income < ₹8 LPA)",
            "Differently-Abled: 100% fee waiver",
            "Central Sector Scholarship: ₹20,000/year (Govt. of India)",
            "Tamil Nadu Post-Matric (SC/ST): Up to ₹50,000/year",
            "Application Deadline: Within 60 days of admission confirmation",
        ],
    },
    "admissions-international": {
        "title": "International Student Admissions",
        "overview": (
            "SRMIST welcomes students from over 54 countries and has a dedicated International Students Office "
            "to facilitate visa processing, cultural orientation, and academic integration. International "
            "students can apply directly through the International Admissions Portal and are evaluated on "
            "the basis of their secondary/high school transcripts, language proficiency (IELTS/TOEFL/Duolingo), "
            "and in some cases, an online interview. The university provides dedicated hostels for international "
            "students and a 24x7 multicultural student support centre."
        ),
        "specs": [
            "Countries Represented: 54+ nationalities on campus",
            "Application Portal: international.srmist.edu.in",
            "English Proficiency: IELTS 6.0+ / TOEFL 80+ / Duolingo 105+",
            "Visa Type: Student Visa (X Visa) with university sponsorship",
            "Dedicated International Hostel: Block L (Single rooms with attached bath)",
            "Tuition Fees: USD 3,500 – USD 5,000 per year",
            "Scholarship for International Students: Merit-based 25–50% waiver",
            "International Office: intl.admissions@srmist.edu.in",
        ],
    },

    # ── CAMPUS LIFE ──────────────────────────────────────────────────────────
    "campus-hostels": {
        "title": "Hostel & Accommodation",
        "overview": (
            "SRMIST Kattankulathur campus has 22 hostel blocks — 12 for boys and 10 for girls — with a "
            "combined capacity of over 12,000 students. Hostels are fully equipped with 24x7 Wi-Fi (1 Gbps "
            "campus network), RO purified water, 24x7 security with CCTV, in-house laundry, and mess "
            "facilities. Each block has a dedicated Warden and Resident Tutors (RTs) to ensure student "
            "welfare. Room types range from non-AC triple-sharing to fully air-conditioned single rooms."
        ),
        "specs": [
            "Total Capacity: 12,000+ students across 22 blocks",
            "Boys Hostels: Blocks A–L (12 blocks)",
            "Girls Hostels: Blocks M–V (10 blocks)",
            "Room Types: Non-AC Triple / AC Double / AC Single",
            "Wi-Fi: 1 Gbps campus backbone, 24x7",
            "Mess: 5 Dining Halls | Veg & Non-Veg options | ₹4,500/month",
            "Curfew: 9:30 PM (Boys) | 8:30 PM (Girls) — Biometric Entry",
            "Hostel Fees: ₹80,000–₹1,50,000/year depending on room type",
            "Online Booking: hostel.srmist.edu.in",
        ],
    },
    "campus-sports": {
        "title": "Sports & Athletics",
        "overview": (
            "SRMIST has world-class sports infrastructure spread across 80+ acres of the Kattankulathur "
            "campus. The Sports Division is headed by a Director of Physical Education and has produced "
            "national and international level athletes across multiple disciplines. Students can represent "
            "the university in the All-India Inter-University tournaments and the prestigious Khelo India "
            "University Games. Full scholarship is available for sports achievers at the national/state level."
        ),
        "specs": [
            "Cricket: International-standard turf pitch + nets",
            "Football: FIFA-regulation grass ground",
            "Basketball: 4 outdoor + 2 indoor courts",
            "Swimming Pool: Olympic 50m heated pool",
            "Badminton: 8 indoor courts (Sports Complex)",
            "Athletics: 400m IAAF certified synthetic track",
            "Gymnasium: 5,000 sq ft, open 5 AM–10 PM",
            "Chess, Table Tennis, Volleyball, Throwball: Dedicated halls",
            "Annual Sports Day: February (Inter-departmental competitions)",
        ],
    },
    "campus-clubs": {
        "title": "Student Clubs & Organizations",
        "overview": (
            "SRMIST boasts over 130 registered student clubs and chapters, covering technical, cultural, "
            "social, and entrepreneurial domains. Every club is officially recognized by the Student Affairs "
            "division and receives an annual budget allocation. Major technical societies include SRM's chapters "
            "of IEEE, ACM, CSI, and SAE. Cultural clubs include dance, drama, music, and fine arts groups. "
            "The annual cultural fest AARUUSH and tech fest SHAASTRA draw over 50,000 participants each year."
        ),
        "specs": [
            "Total Registered Clubs: 130+",
            "Technical: IEEE SRM, ACM SRM, CSI, SAE, Robotics Club, Coding Club",
            "Cultural: Kalakendra (Dance), Theatrix (Drama), Swaranjali (Music), Artica (Art)",
            "Social: NSS (National Service Scheme), NCC, YRC (Youth Red Cross)",
            "Entrepreneurship: E-Cell, Innovation Hub, StartupSRM",
            "Annual Fest AARUUSH: 50,000+ participants, 100+ events",
            "Annual Tech Fest: SHAASTRA (in collaboration with IIT-M Chapter)",
            "Club Registration: studentaffairs.srmist.edu.in/clubs",
        ],
    },
    "campus-facilities": {
        "title": "Campus Facilities & Infrastructure",
        "overview": (
            "The SRMIST Kattankulathur campus spans 250 acres and is one of the most self-sufficient "
            "university campuses in India. Beyond academic buildings, the campus hosts a 2,000-bed "
            "university hospital (SRM Hospital), a shopping mall (SRM Mall), banks (SBI, HDFC, Axis), "
            "ATMs, a travel desk, supermarkets, food courts, and a 24x7 ambulance service. The campus "
            "is connected to Potheri station on the MRTS railway line, just 2 minutes walk."
        ),
        "specs": [
            "Campus Area: 250 Acres (Kattankulathur)",
            "University Hospital: SRM Medical College & Hospital (2,000 beds)",
            "Banks on Campus: SBI, HDFC, Axis Bank branches + 10 ATMs",
            "Transport: Free shuttle within campus | MRTS Potheri Station (2 min walk)",
            "Food Courts: 8 canteens + 3 food courts + Subway, Domino's, Starbucks",
            "Library: Dr. T.P. Ganesan Library – 5 Lakh+ volumes, e-journal subscriptions",
            "24x7 Power Backup: 100% DG backup for all academic & hostel blocks",
            "Green Campus: ISO 14001 certified, 30% area under green cover",
        ],
    },

    # ── PLACEMENTS ────────────────────────────────────────────────────────────
    "placements-stats": {
        "title": "Placement Statistics",
        "overview": (
            "The SRM Career Development Centre (CDC) consistently delivers one of the best placement records "
            "among private universities in India. In the 2023-24 academic year, over 8,500 students were "
            "placed through the campus recruitment process, with companies from IT, BFSI, Core Engineering, "
            "Consulting, and Analytics sectors participating. The highest domestic package stood at ₹67 LPA "
            "and the highest international offer was USD 1,25,000 per annum."
        ),
        "specs": [
            "Total Students Placed (2023-24): 8,500+",
            "Placement Percentage: 94% (for eligible students)",
            "Highest Package (Domestic): ₹67 LPA",
            "Highest Package (International): USD 1,25,000 PA",
            "Average Package (B.Tech CSE): ₹9.4 LPA",
            "Average Package (All B.Tech): ₹6.8 LPA",
            "Top Recruiter: Amazon (250+ offers), Microsoft (180+ offers)",
            "Companies Visited: 650+ (150 new companies in 2023-24)",
        ],
    },
    "placements-recruiters": {
        "title": "Top Recruiters",
        "overview": (
            "SRMIST attracts Fortune 500 companies, leading Indian conglomerates, and innovative startups for "
            "campus recruitment. IT giants like Amazon, Google, Microsoft, Infosys, TCS, and Wipro are regular "
            "recruiters. Core engineering companies like L&T, Tata Steel, Bosch, Caterpillar, and TVS Motor "
            "recruit from Mechanical and Civil branches. Consulting firms like Deloitte, EY, and McKinsey "
            "recruit from MBA and Analytics programs."
        ),
        "specs": [
            "IT/Product: Amazon, Google, Microsoft, Adobe, Flipkart, Atlassian",
            "IT/Services: TCS, Infosys, Wipro, Cognizant, HCL, Capgemini",
            "BFSI: JP Morgan, Goldman Sachs, HDFC Bank, Kotak Mahindra",
            "Core Engg: L&T, Bosch, Caterpillar, TVS Motor, Tata Steel",
            "Consulting: Deloitte, EY, KPMG, McKinsey (QuantumBlack)",
            "Analytics & Data: Tiger Analytics, Mu Sigma, Fractal AI",
            "Defence PSUs: DRDO, HAL, BEL, BHEL",
            "Startups: 50+ funded startups recruited (avg. ₹12 LPA)",
        ],
    },
    "placements-internships": {
        "title": "Internships & Industrial Training",
        "overview": (
            "SRMIST mandates at least one internship for all B.Tech students, typically completed at the end "
            "of the 6th semester. The CDC facilitates internship placements with over 400 partner companies. "
            "Many internships are 'pre-placement offers' (PPOs), meaning strong performance directly leads to "
            "a full-time job offer. Students may also pursue self-arranged internships pending CDC approval. "
            "A dedicated Internship Portal (internship.srmist.edu.in) manages applications, approvals, and "
            "company feedback throughout the process."
        ),
        "specs": [
            "Mandatory Internship: 8 weeks minimum at end of 6th Semester",
            "Internship Credits: 2 credits (Pass/Fail grading)",
            "PPO Conversion Rate: 38% of interns receive full-time offers",
            "Top Internship Partners: Amazon, Zoho, Freshworks, Hyundai, ISRO",
            "Stipend Range: ₹5,000 – ₹80,000/month",
            "International Internships: Available via IAESTE & Erasmus+ programs",
            "Internship Report Submission: Within 2 weeks of completion",
            "Portal: internship.srmist.edu.in",
        ],
    },
    "placements-training": {
        "title": "Career Development & Skill Training",
        "overview": (
            "The Career Development Centre runs year-round training programs to ensure students are industry-ready "
            "before they appear for campus placements. These include aptitude training, technical skill workshops, "
            "communication and soft skills programs, mock interviews, group discussion sessions, and competitive "
            "coding bootcamps. SRM also has strategic partnerships with AMCAT, CoCubes, Coursera, and AWS Academy "
            "to offer certified training programmes that enhance employability."
        ),
        "specs": [
            "Aptitude Training: Quantitative, Logical, Verbal (Semester 3–5)",
            "Coding Bootcamps: DSA, Competitive Programming (Semester 3–6)",
            "Soft Skills: Communication, Leadership, Group Dynamics (Semester 2–4)",
            "Mock Interviews: Scheduled 4 weeks before placement season",
            "AWS Academy: Cloud Foundations & Architecting certifications",
            "AMCAT / CoCubes: Free assessment vouchers for all students",
            "Coursera Access: 5,000+ courses via institutional license",
            "Training Provider Partners: SkillEdge, Naukri Campus, TalentSprint",
        ],
    },
}


# ─────────────────────────────────────────────────────────────────────────────
# RESPONSE MODEL
# ─────────────────────────────────────────────────────────────────────────────
class InfoPayload(BaseModel):
    slug: str
    title: str
    overview: str
    specs: list[str]


@router.get("/{slug}", response_model=InfoPayload, summary="Get info payload for a nav-menu slug")
async def get_info(slug: str):
    """
    Returns a complete information block for a given navigation menu slug.
    Slugs follow the pattern: <section>-<subsection>
    e.g. academics-undergrad, admissions-fees, campus-hostels, placements-stats
    """
    entry = INFO_DB.get(slug)
    if not entry:
        raise HTTPException(
            status_code=404,
            detail=f"No information found for slug '{slug}'. Valid slugs: {list(INFO_DB.keys())}",
        )
    return InfoPayload(
        slug=slug,
        title=entry["title"],
        overview=entry["overview"],
        specs=entry["specs"],
    )


@router.get("/", summary="List all available info slugs")
async def list_slugs():
    """Returns all valid slugs available in the info database."""
    return {
        "available_slugs": list(INFO_DB.keys()),
        "total": len(INFO_DB),
    }

# ── PROGRAM STREAM CARDS (Section 2 of landing page) ─────────────────────────
INFO_DB["programs-engineering"] = {
    "title": "Engineering & Technology Programs",
    "overview": (
        "SRMIST's School of Engineering & Technology is the flagship division of the university, "
        "housing over 40 undergraduate, postgraduate, and doctoral programs across 15 departments. "
        "From core disciplines like Civil and Mechanical Engineering to cutting-edge streams in "
        "Artificial Intelligence, Machine Learning, Cyber Security, and Quantum Computing, the school "
        "is designed to produce engineers who are industry-ready on day one. Every program is "
        "NBA-accredited and follows an Outcome-Based Education (OBE) framework tied directly to "
        "industry competency benchmarks. Students have access to 80+ specialized laboratories, "
        "collaborative research centres, and a world-class innovation hub."
    ),
    "specs": [
        "Flagship Programs: B.Tech CSE, ECE, Mech, Civil, IT, AIDS, AIML, Cyber Security",
        "Total Programs: 40+ UG + PG + Ph.D. streams",
        "Accreditation: NBA (all B.Tech programs) + NAAC A++",
        "Intake: 6,000+ students per year across Engineering",
        "Average Package (CSE 2024): ₹9.4 LPA",
        "Top Recruiters: Amazon, Google, Microsoft, Infosys, Bosch",
        "Research Output (2023-24): 3,200+ Scopus-indexed papers",
        "Industry Labs: Cisco, IBM, SAP, TCS CoE on campus",
    ],
}

INFO_DB["programs-medicine"] = {
    "title": "Medicine & Health Sciences Programs",
    "overview": (
        "The SRM Medical College, Hospital & Research Centre is one of India's premier medical "
        "institutions, affiliated with SRMIST and accredited by the National Medical Commission (NMC). "
        "The college operates the SRM Hospital — a 2,000-bed tertiary care teaching hospital — giving "
        "students unparalleled clinical exposure from the very first year. Programs span MBBS, BDS, "
        "B.Pharm, B.Sc Nursing, B.Sc Allied Health Sciences, and postgraduate specialisations across "
        "all major medical disciplines. Research is a cornerstone of the medical school, with the "
        "Centre for Drug Discovery & Development (CD3) running 60+ active clinical and preclinical trials."
    ),
    "specs": [
        "Programs: MBBS, BDS, B.Pharm, B.Sc Nursing, B.Sc Allied Health",
        "Hospital: SRM Medical College Hospital — 2,000 beds, 52 specialties",
        "NMC Accredited: All medical programs fully NMC-approved",
        "Annual MBBS Intake: 250 seats",
        "Postgraduate: MD, MS, MDS, M.Pharm (35 specialties)",
        "Active Clinical Trials: 60+ at CD3 Research Centre",
        "NEET Cutoff (2024): UR General 632+ marks",
        "Hospital Footfall: 2,500+ outpatients per day",
    ],
}

INFO_DB["programs-management"] = {
    "title": "Management & Business Programs",
    "overview": (
        "The SRM School of Management (SRMSM) is AACSB-candidate accredited and consistently ranks "
        "among the top 25 business schools in India. The flagship 2-year MBA program offers eight "
        "specialisations and features a live corporate project in every semester, guest lectures from "
        "CXO-level executives, and mandatory international immersion tours. BBA and integrated BBA-MBA "
        "programs are available for students seeking a head start in business education. The placement "
        "record for the 2024 MBA batch stood at 98%, with an average CTC of ₹8.7 LPA."
    ),
    "specs": [
        "Programs: MBA (2yr), BBA (3yr), Integrated BBA-MBA (5yr), Executive MBA",
        "MBA Specialisations: Finance, Marketing, HR, Operations, BA, IB, Entrepreneurship, Healthcare Mgmt",
        "Entrance: CAT / MAT / XAT / SRMJEEM (any accepted)",
        "Placement Rate (MBA 2024): 98%",
        "Average CTC (MBA 2024): ₹8.7 LPA",
        "Highest CTC (MBA 2024): ₹28 LPA (BFSI sector)",
        "Live Corporate Projects: Every semester, 40+ partner companies",
        "International Immersion: Singapore / Dubai (Week-long annual tour)",
    ],
}

INFO_DB["programs-law"] = {
    "title": "Law & Legal Studies Programs",
    "overview": (
        "The SRM School of Law offers one of South India's most progressive legal education curricula, "
        "combining doctrinal legal study with clinical legal practice, moot court competitions, and "
        "real-world internships at top law firms and courts. Flagship programs include the 5-year "
        "integrated BA LLB and BBA LLB degrees. The school has dedicated moot court halls, a legal "
        "aid clinic, and ties with leading law firms for placement. Postgraduate LLM specialisations "
        "in Corporate Law, IPR, and Criminal Law are offered for qualified graduates."
    ),
    "specs": [
        "Programs: BA LLB (5yr), BBA LLB (5yr), LLM (2yr), Ph.D. in Law",
        "LLM Specialisations: Corporate Law, IPR, Criminal Law, Constitutional Law",
        "Moot Court: 3 dedicated moot court halls with live video streaming",
        "Legal Aid Clinic: Free legal assistance to surrounding communities",
        "Bar Council Approved: All LLB programs approved by Bar Council of India",
        "Internship Partners: Cyril Amarchand, AZB & Partners, top district courts",
        "CLAT/LSAT: Accepted for LLB admissions",
        "Annual Intake: 120 seats (BA LLB + BBA LLB combined)",
    ],
}

INFO_DB["programs-science"] = {
    "title": "Science & Humanities Programs",
    "overview": (
        "The College of Science & Humanities at SRMIST offers a rich spectrum of undergraduate and "
        "postgraduate programs spanning pure sciences, social sciences, and arts disciplines. B.Sc "
        "programs in Physics, Chemistry, Mathematics, Biology, Computer Science, and Psychology are "
        "complemented by M.Sc specialisations with strong research components. The humanities wing "
        "offers programs in Economics, English, Journalism & Mass Communication, and Social Work. "
        "All programs feature interdisciplinary elective options, allowing students to combine "
        "scientific rigour with humanistic inquiry."
    ),
    "specs": [
        "B.Sc Programs: Physics, Chemistry, Maths, Biology, CS, Psychology, Microbiology",
        "M.Sc Programs: Data Science, Bioinformatics, Physics, Chemistry, Maths, Psychology",
        "Humanities: BA Economics, BA English, B.Sc Journalism & Mass Comm, BSW",
        "Research: 40+ active projects in pure sciences with DST-SERB funding",
        "Ph.D. Available: Physics, Chemistry, Maths, Psychology, Economics",
        "Total Intake: 1,800+ students per year in Science & Humanities",
        "Industry Tie-ups: ISRO (Astronomy), CSIR (Chemistry), NIMHANS (Psychology)",
        "Scholarship: DST-INSPIRE for top B.Sc students (₹80,000/year)",
    ],
}
