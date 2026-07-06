import { useState, useEffect, useCallback, useRef } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// BRAND TOKENS
// ─────────────────────────────────────────────────────────────────────────────
const SRM_BLUE = "#003B8E";
const SRM_GOLD = "#F5A623";

// ─────────────────────────────────────────────────────────────────────────────
// NAV MENUS — 5 headers, 21 sub-slugs, all emojis removed (text-only labels)
// ─────────────────────────────────────────────────────────────────────────────
const NAV_MENUS = {
  Academics: [
    { label: "Undergraduate Programs", slug: "academics-undergrad"  },
    { label: "Postgraduate Programs",  slug: "academics-postgrad"   },
    { label: "Ph.D. & Research",       slug: "academics-phd"        },
    { label: "Curriculum & Syllabus",  slug: "academics-syllabus"   },
    { label: "Academic Timetable",     slug: "academics-timetable"  },
  ],
  Research: [
    { label: "Research Centres & Labs", slug: "research-centers"      },
    { label: "Publications & Impact",   slug: "research-publications"  },
    { label: "Grants & Funding",        slug: "research-funding"       },
    { label: "Patents & IP",            slug: "research-patents"       },
  ],
  "Campus Life": [
    { label: "Hostel & Accommodation", slug: "campus-hostels"    },
    { label: "Sports & Athletics",     slug: "campus-sports"     },
    { label: "Student Clubs",          slug: "campus-clubs"      },
    { label: "Campus Facilities",      slug: "campus-facilities" },
  ],
  International: [
    { label: "Admission Process",            slug: "admissions-process"       },
    { label: "Fee Structure",                slug: "admissions-fees"          },
    { label: "Scholarships & Financial Aid", slug: "admissions-scholarships"  },
    { label: "International Students",       slug: "admissions-international" },
  ],
  About: [
    { label: "Placement Statistics", slug: "placements-stats"       },
    { label: "Top Recruiters",       slug: "placements-recruiters"  },
    { label: "Internships",          slug: "placements-internships" },
    { label: "Skill Training",       slug: "placements-training"    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// RESEARCH HIGHLIGHTS — professional production photography
// ─────────────────────────────────────────────────────────────────────────────
const RESEARCH_HIGHLIGHTS = [
  {
    slug:     "research-centers",
    label:    "Academic Research",
    sublabel: "Cutting-edge science across 14 dedicated centres",
    image:    "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=700&q=85",
    imgAlt:   "Researcher operating a microscope in advanced laboratory",
    stat:     "340+",
    statSub:  "Active Projects",
  },
  {
    slug:     "research-publications",
    label:    "Central Research Laboratories",
    sublabel: "Sir C.V. Raman Research Block & specialised facilities",
    image:    "https://images.unsplash.com/photo-1562774053-701939374585?w=700&q=85",
    imgAlt:   "Modern research building exterior on university campus",
    stat:     "4,200+",
    statSub:  "Scopus Publications",
  },
  {
    slug:     "research-funding",
    label:    "Recent Projects",
    sublabel: "Core engineering, defence, and industry-funded R&D",
    image:    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=700&q=85",
    imgAlt:   "Engineers working on core machinery assembly",
    stat:     "₹45 Cr",
    statSub:  "Funding (2023-24)",
  },
  {
    slug:     "research-patents",
    label:    "Innovation Hub",
    sublabel: "Collaborative design sprints, prototyping, and startup incubation",
    image:    "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=700&q=85",
    imgAlt:   "Students collaborating at innovation hub desks",
    stat:     "1,800+",
    statSub:  "Patents Filed",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// AUDIENCE PORTALS — LOCAL public-folder images ONLY (exclusive per spec)
// ─────────────────────────────────────────────────────────────────────────────
const AUDIENCE_PORTALS = {
  "Students": {
    key:      "Students",
    image:    "/students-class.jpg",
    fallback: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=900&q=85",
    alt:      "Students in classroom at Viji University",
    heading:  "Student Hub",
    intro:    "Everything you need for a successful academic journey at Viji University — from timetables and grades to hostel bookings and career support.",
    links: [
      { label: "eVarsity Student Portal",     desc: "Access grades, attendance, timetable, and fee receipts online." },
      { label: "Library & Digital Resources", desc: "5 Lakh+ volumes, IEEE/Elsevier/Springer e-journal subscriptions." },
      { label: "Hostel Booking",              desc: "Apply for hostel accommodation online via the student services portal." },
      { label: "Career Development Centre",   desc: "Register for placement drives, aptitude tests, and mock interviews." },
      { label: "Student Clubs & AARUUSH",     desc: "130+ registered clubs, events, and the annual cultural mega-fest." },
    ],
  },
  "Faculty & Staff": {
    key:      "Faculty & Staff",
    image:    "/faculty-lab.jpg",
    fallback: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=85",
    alt:      "Faculty member working in research laboratory",
    heading:  "Faculty & Staff Resources",
    intro:    "Administrative tools, research support, HR systems, and academic management platforms for Viji University faculty and staff members.",
    links: [
      { label: "Faculty Research Portal",  desc: "Submit publications, track citations, and manage funded research projects." },
      { label: "Viji Academia (LMS)",       desc: "Manage course content, upload materials, and grade student assignments." },
      { label: "HR Self-Service",          desc: "Access payroll, leave management, and personal service records." },
      { label: "Patent & IPR Filing",      desc: "File patents with full IPR Cell support — drafting and prosecution included." },
      { label: "Professional Development", desc: "FDP workshops, conference grants, and Coursera institutional license access." },
    ],
  },
  "Parents": {
    key:      "Parents",
    image:    "/parents-view.jpg",
    fallback: "https://images.unsplash.com/photo-1511895426328-dc8714191011?w=900&q=85",
    alt:      "Parents viewing campus performance area at Viji University",
    heading:  "Parent & Guardian Portal",
    intro:    "Stay informed about your child's academic progress, fees, hostel status, and campus life at Viji University Chennai.",
    links: [
      { label: "Attendance & Grade Tracker", desc: "Monitor real-time attendance percentage and semester grade sheet." },
      { label: "Fee Payment Portal",         desc: "Pay tuition and hostel fees online and view full payment history." },
      { label: "Hostel Status",              desc: "Check room allotment, mess plan, and hostel warden contact details." },
      { label: "Parent-Faculty Connect",     desc: "Schedule meetings with faculty advisors through the dedicated portal." },
      { label: "Campus Safety & Security",   desc: "24x7 CCTV surveillance — Emergency helpline: +91-44-2745-9999." },
    ],
  },
  "Visitors": {
    key:      "Visitors",
    image:    "/visitors-gate.jpg",
    fallback: "https://images.unsplash.com/photo-1562774053-701939374585?w=900&q=85",
    alt:      "Viji University main campus gate and infrastructure",
    heading:  "Visitor Information",
    intro:    "Plan your visit to the Viji University Chennai Main Campus. Open days, guided tours, and event passes are available through the Visitor Relations desk.",
    links: [
      { label: "Campus Tour Schedule",   desc: "Book a guided tour of academic blocks, research labs, and sports facilities." },
      { label: "Open Day Registrations", desc: "Register for upcoming open days — next event: 15 August 2026." },
      { label: "Event Passes",           desc: "Get passes for AARUUSH, SHAASTRA, and public lecture series events." },
      { label: "Directions & Parking",   desc: "GPS: 13.0827° N, 80.2707° E · Chennai Metro Rail / Local Station — 2-minute walk." },
      { label: "Visitor Code of Conduct",desc: "All visitors must register at the main gate with valid government photo ID." },
    ],
  },
  "Alumni": {
    key:      "Alumni",
    image:    "/alumni-network.jpg",
    fallback: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=900&q=85",
    alt:      "Viji University alumni at graduation convocation ceremony",
    heading:  "Alumni Network",
    intro:    "Connect with 2 Lakh+ Viji University alumni across the globe. Access mentorship programs, career services, chapter events, and reunion activities.",
    links: [
      { label: "Alumni Directory",     desc: "Search and connect with 2 Lakh+ graduates across 90+ countries globally." },
      { label: "Mentorship Program",   desc: "Guide current students with career insights and industry experience." },
      { label: "Job Board",            desc: "Post openings at your company or explore alumni-exclusive job listings." },
      { label: "Chapter Events",       desc: "Join alumni chapters in Chennai, Bangalore, Mumbai, Dubai, USA, and UK." },
      { label: "Give Back — Endowment",desc: "Support scholarships, labs, and research through alumni donations and endowments." },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// PROGRAM CARDS — row layout, professional production photography
// ─────────────────────────────────────────────────────────────────────────────
const PROGRAM_CARDS = [
  {
    slug:    "academics-undergrad",
    image:   "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=480&q=80",
    alt:     "Engineering students in lab",
    college: "College of Engineering & Technology",
    tagline: "CSE · ECE · Mechanical · Civil · AIML · Cyber Security · Biomedical",
    count:   "40+ programs",
    color:   SRM_BLUE,
    icon:    "⚙️",
  },
  {
    slug:    "campus-facilities",
    image:   "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=480&q=80",
    alt:     "Medical students in clinical setting",
    college: "College of Medicine & Health Sciences",
    tagline: "MBBS · BDS · Nursing · Pharmacy · Allied Health · Physiotherapy",
    count:   "12+ programs",
    color:   "#B91C1C",
    icon:    "🩺",
  },
  {
    slug:    "academics-postgrad",
    image:   "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=480&q=80",
    alt:     "Business students in management class",
    college: "School of Management",
    tagline: "MBA · BBA · Finance · Marketing · HR · Business Analytics · IB",
    count:   "15+ programs",
    color:   "#B45309",
    icon:    "📊",
  },
  {
    slug:    "admissions-process",
    image:   "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=480&q=80",
    alt:     "Law students in moot court",
    college: "School of Law",
    tagline: "BA LLB · BBA LLB · LLM · Corporate Law · IPR · Constitutional Law",
    count:   "6+ programs",
    color:   "#065F46",
    icon:    "⚖️",
  },
  {
    slug:    "academics-phd",
    image:   "https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=480&q=80",
    alt:     "Science students conducting experiments",
    college: "College of Science & Humanities",
    tagline: "B.Sc · M.Sc · Psychology · Economics · Journalism · Social Work",
    count:   "22+ programs",
    color:   "#6D28D9",
    icon:    "🔬",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// LOCAL_TOPIC_DATA — 21 slugs. ALL images are premium production URLs matched
// precisely to topic. Local /public paths are reserved exclusively for
// AUDIENCE_PORTALS, per the separation rule.
// ─────────────────────────────────────────────────────────────────────────────
const LOCAL_TOPIC_DATA = {
  "academics-undergrad": {
    title:    "Undergraduate Programs",
    image:    "https://images.unsplash.com/photo-1577412647305-991150c7d163?w=1000&q=85",
    alt:      "Modern university lecture hall with students attending a science class",
    overview: "Viji University Chennai offers a wide array of undergraduate programs across Engineering, Science, Management, and Humanities. B.Tech programs span four rigorous, industry-aligned years blending theory with hands-on lab work, live projects, and mandatory internship semesters. Every program is NBA-accredited and follows an Outcome-Based Education (OBE) framework.",
    specs: [
      "Duration: 4 Years (8 Semesters)",
      "Programs: CSE, ECE, Mech, Civil, IT, AIDS, AIML, Cyber Security, Biomedical",
      "Total Credits Required: 160 (Core 120 + Electives 40)",
      "Grading System: 10-Point CGPA (CBCS)",
      "Mandatory Internship: End of 6th Semester (8 weeks minimum)",
      "Minor Degrees: Data Science, IoT, Business Analytics",
      "Lateral Entry: Available for Diploma holders (2nd Year direct entry)",
      "Accreditation: NBA / NAAC A++",
    ],
  },
  "academics-postgrad": {
    title:    "Postgraduate Programs",
    image:    "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1000&q=85",
    alt:      "Graduate students in advanced seminar discussion",
    overview: "Viji University offers M.Tech, MBA, M.Sc, and MCA programs designed to deepen specialization and cultivate leadership. M.Tech programs are research-intensive with a dissertation final year. MBA streams include Finance, Marketing, HR, Operations, and Business Analytics with live corporate projects every semester.",
    specs: [
      "Duration: 2 Years (4 Semesters)",
      "M.Tech Streams: CSE, ECE, Structural Engg, Power Systems, Biotechnology",
      "MBA Specialisations: Finance, Marketing, HR, Ops, Business Analytics",
      "MCA: 3-Year Integrated program also available",
      "Research Stipend: ₹12,500/month for M.Tech research scholars",
      "GATE Score: Required for M.Tech (GATE-qualified get fee waiver)",
      "Entrance Accepted: CAT / MAT / XAT / SRMJEEM for MBA",
      "Placement Rate: 92% MBA batch · Avg. CTC ₹8.2 LPA",
    ],
  },
  "academics-phd": {
    title:    "Ph.D. & Doctoral Research",
    image:    "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=1000&q=85",
    alt:      "Doctoral researcher analysing samples in advanced cleanroom laboratory",
    overview: "The doctoral research program at Viji University is among the most vibrant in South India, with over 2,000 active scholars. The university hosts 14 dedicated research centres with state-of-the-art equipment and has published over 8,000 Scopus-indexed papers in five years.",
    specs: [
      "Minimum Duration: 3 Years (Full-time) · 5 Years (Part-time)",
      "Eligibility: PG degree with 55% aggregate in relevant discipline",
      "Entrance: SRMJEEM-PhD / UGC-NET / GATE / CSIR-NET",
      "Fellowship: ₹20,000/month (non-GATE) · ₹25,000/month (GATE)",
      "Annual Progression Review by Doctoral Committee",
      "Mandatory SCI/Scopus Journal Publication required for award",
      "14 Active Research Centres: NanoTech, AI, Biomedical, Robotics",
      "International Collaborations: MIT, NUS, TU Delft, Univ. of Melbourne",
    ],
  },
  "academics-syllabus": {
    title:    "Curriculum & Syllabus",
    image:    "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=1000&q=85",
    alt:      "Open academic textbooks and curriculum planning materials in modern library",
    overview: "Viji University follows a dynamic curriculum updated every two years in consultation with industry advisory boards, alumni, and faculty senates. The OBE framework ensures every course maps to program outcomes and graduate attributes validated by real industry benchmarks.",
    specs: [
      "Curriculum Revision Cycle: Every 2 Years",
      "Framework: Outcome-Based Education (OBE) + Bloom's Taxonomy",
      "Industry Advisory Board: 40+ CXOs and senior engineers",
      "LMS Platform: Viji Academia",
      "Assessment: 25 (Cycle Tests) + 25 (Assignments) + 50 (End Sem Exam)",
      "Practical Component: ≥30% of total credits must be lab/project-based",
      "MOOC Integration: 2 NPTEL/Coursera credits mandatory per year",
      "Elective Basket: 4 Professional + 2 Open Electives per program",
    ],
  },
  "academics-timetable": {
    title:    "Academic Timetable & Calendar",
    image:    "https://images.unsplash.com/photo-1517842645767-c639042777db?w=1000&q=85",
    alt:      "University campus clock tower and academic calendar planning",
    overview: "The academic year is divided into two semesters — Odd (July–November) and Even (December–April) — with a Summer Term (May–June) for backlog clearance. The full academic calendar is published on the official website before each year begins.",
    specs: [
      "Odd Semester: July – November",
      "Even Semester: December – April",
      "Summer Term: May – June (backlog & value-added courses)",
      "Cycle Test I: Weeks 4–5 of each semester",
      "Cycle Test II: Weeks 9–10 of each semester",
      "End Semester Exams: Last 2 weeks of each semester",
      "Registration Deadline: Within 2 weeks of semester commencement",
      "Timetable Access: Viji Academia → My Courses → Timetable",
    ],
  },
  "research-centers": {
    title:    "Research Centres & Labs",
    image:    "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1000&q=85",
    alt:      "Scientists in advanced cleanroom laboratory wearing protective bunny suits",
    overview: "Viji University houses 14 state-of-the-art research centres that serve as the nucleus of campus innovation. These centres attract external funding from DST, DRDO, ISRO, DBT, and international bodies. Students at all levels can apply for paid research assistant positions.",
    specs: [
      "Centre for Nanotechnology & Advanced Biomaterials (CeNTAB)",
      "Artificial Intelligence & Machine Learning Research Lab",
      "Centre for Drug Discovery & Development (CD3)",
      "Robotics & Automation Research Centre",
      "Centre for Environmental Studies & Sustainability",
      "Smart Grid & Renewable Energy Research Lab",
      "VLSI Design & Embedded Systems Centre",
      "Total Active Projects: 340+ (2024-25 academic year)",
    ],
  },
  "research-publications": {
    title:    "Research Publications & Impact",
    image:    "https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?w=1000&q=85",
    alt:      "Stack of academic journals and peer-reviewed research papers",
    overview: "Viji University ranks among the top 10 Indian universities in research output, with consistently high publication counts in Scopus, SCI, and Web of Science journals. A centralised institutional repository archives all publications, theses, and technical reports.",
    specs: [
      "Scopus-Indexed Publications (2023-24): 4,200+",
      "Institutional h-Index: 89",
      "Total Google Scholar Citations: 2.1 Lakh+",
      "Patents Filed: 1,800+ · Patents Granted: 620+",
      "Nature / IEEE Transactions publications: 180+",
      "Research Funding Received (2023-24): ₹45 Crores",
      "Institutional Repository: ir.viji.edu.in",
      "ORI Contact: ori@viji.edu.in",
    ],
  },
  "research-funding": {
    title:    "Research Grants & Funding",
    image:    "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1000&q=85",
    alt:      "Financial analytics dashboard with funding allocation charts",
    overview: "Viji University actively encourages faculty and students to pursue external research grants. The Office of Research & Innovation (ORI) offers end-to-end support from identifying funding opportunities to proposal writing, financial management, and compliance reporting.",
    specs: [
      "Seed Grant (Internal): Up to ₹5 Lakhs per faculty project",
      "DST-SERB CRG: Up to ₹50 Lakhs for core research projects",
      "DRDO Projects: 25 active grants, avg. ₹1.2 Crore each",
      "ISRO-Respond Program: Satellite tech and remote sensing projects",
      "Indo-US STF: Joint Indo-US research collaboration initiatives",
      "Overhead Rate: 20% of total grant goes to university overhead",
      "Student Fellowships: DST-INSPIRE, CSIR-SRF, NBHM available",
      "ORI Grants Email: ori.grants@viji.edu.in",
    ],
  },
  "research-patents": {
    title:    "Patents & Intellectual Property",
    image:    "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1000&q=85",
    alt:      "Legal patent documents and intellectual property filings on desk",
    overview: "Viji University has a robust IPR cell managing the university's growing patent portfolio. Faculty, scholars, and students are encouraged to file patents for innovations developed on campus. The Technology Transfer Office facilitates licensing of patented technologies.",
    specs: [
      "Total Patents Filed: 1,800+ (Indian + International combined)",
      "Patents Granted: 620+ (as of 2024)",
      "International Patents: 145 (USPTO, EPO, WIPO)",
      "IPR Cell: Full drafting, filing & prosecution assistance provided",
      "Revenue Sharing: 60% inventor · 20% dept · 20% university",
      "Spin-off Companies Incubated via Viji TBI: 28",
      "Technology Transfer Agreements: 35 active licenses",
      "IPR Cell Email: ipr@viji.edu.in",
    ],
  },
  "admissions-process": {
    title:    "Admission Process",
    image:    "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=1000&q=85",
    alt:      "Prospective students completing university admission application forms",
    overview: "Viji University admissions are conducted through SRMJEEE for B.Tech programs. Applications are submitted online through the admissions portal. After rank declaration, seat allotment happens through a centralised counselling process conducted in multiple rounds.",
    specs: [
      "SRMJEEE Phase I: October – November (Slot-based online CBT)",
      "SRMJEEE Phase II: April – May (Slot-based online CBT)",
      "Exam Mode: Computer Based Test at authorised centres nationwide",
      "Subjects: Physics, Chemistry, Mathematics / Biology",
      "Duration: 2 Hours 30 Minutes · 125 Questions",
      "Counselling: Online portal + Physical document verification",
      "Seat Acceptance Fee: ₹25,000 (adjusted against semester tuition)",
      "Admissions Helpline: 1800-102-1525 (Toll-Free, all days)",
    ],
  },
  "admissions-fees": {
    title:    "Fee Structure",
    image:    "https://images.unsplash.com/photo-1554224154-22dec7ec8818?w=1000&q=85",
    alt:      "Financial calculator and fee structure planning documents",
    overview: "The fee structure at Viji University varies by program and specialization. Fees are payable semester-wise through the SRM Fee Portal. Scholarships and fee waivers are available for meritorious students, EWS students, and students with disabilities.",
    specs: [
      "B.Tech CSE / AIDS / AIML: ₹2,97,000 per year",
      "B.Tech ECE / Mech / Civil / IT: ₹2,60,000 per year",
      "MBA: ₹2,50,000 per year",
      "M.Tech: ₹1,80,000 per year",
      "Hostel AC Double Occupancy: ₹1,20,000 per year",
      "Hostel Non-AC Triple Occupancy: ₹80,000 per year",
      "Bus Transport (Chennai routes): ₹30,000–₹45,000 per year",
      "Late Fee Penalty: ₹500/day after the due date",
    ],
  },
  "admissions-scholarships": {
    title:    "Scholarships & Financial Aid",
    image:    "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=1000&q=85",
    alt:      "University students celebrating scholarship awards at a formal ceremony",
    overview: "Viji University offers a comprehensive scholarship ecosystem to ensure financial constraints never prevent deserving students from pursuing quality education. Scholarships span Merit, Need-based, Sports, Differently-Abled, and Government-facilitated categories.",
    specs: [
      "Chancellor's Scholarship: 100% tuition waiver (SRMJEEE ranks 1–100)",
      "Merit Scholarship: 25–75% waiver (ranks 101–5000)",
      "Sports Quota: Full fee waiver for national/state level athletes",
      "EWS Scholarship: 50% waiver (family income < ₹8 LPA)",
      "Differently-Abled: 100% full fee waiver",
      "Central Sector Scholarship: ₹20,000/year (Govt. of India scheme)",
      "Tamil Nadu Post-Matric SC/ST: Up to ₹50,000/year",
      "Application Deadline: Within 60 days of admission confirmation",
    ],
  },
  "admissions-international": {
    title:    "International Student Admissions",
    image:    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1000&q=85",
    alt:      "Diverse group of international students collaborating on university campus",
    overview: "Viji University welcomes students from over 95 countries and has a dedicated International Students Office to facilitate visa processing, cultural orientation, and academic integration. Dedicated hostels and a 24x7 multicultural student support centre are available.",
    specs: [
      "Countries Represented: 95+ nationalities on campus",
      "Application Portal: international.viji.edu.in",
      "English Proficiency: IELTS 6.0+ / TOEFL 80+ / Duolingo 105+",
      "Visa Type: Student Visa (X Visa) with university sponsorship letter",
      "Dedicated International Hostel Block: Single rooms, attached bath",
      "Tuition Fees: USD 3,500 – USD 5,000 per year",
      "Merit Scholarship: 25–50% waiver for international students",
      "International Office: intl.admissions@viji.edu.in",
    ],
  },
  "campus-hostels": {
    title:    "Hostel & Accommodation",
    image:    "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1000&q=85",
    alt:      "Modern, clean university dormitory room with study desk",
    overview: "Viji University Chennai has 22 hostel blocks — 12 for boys and 10 for girls — with capacity for over 12,000 students. Hostels are equipped with 24x7 Wi-Fi, RO water, CCTV security, in-house laundry, and dedicated mess facilities.",
    specs: [
      "Total Capacity: 12,000+ students across 22 residential blocks",
      "Boys Hostels: Blocks A–L (12 blocks)",
      "Girls Hostels: Blocks M–V (10 blocks)",
      "Room Types: Non-AC Triple · AC Double · AC Single",
      "Wi-Fi: 1 Gbps campus backbone, available 24x7",
      "Mess: 5 Dining Halls · Veg & Non-Veg · ₹4,500/month",
      "Curfew: 9:30 PM Boys · 8:30 PM Girls · Biometric Entry system",
      "Online Booking: hostel.viji.edu.in",
    ],
  },
  "campus-sports": {
    title:    "Sports & Athletics",
    image:    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1000&q=85",
    alt:      "IAAF certified synthetic running track at university sports complex",
    overview: "Viji University has world-class sports infrastructure spread across 80+ acres. The Sports Division has produced national and international level athletes. Students can represent the university in All-India Inter-University tournaments and Khelo India University Games.",
    specs: [
      "Cricket: International-standard turf pitch + practice nets",
      "Football: FIFA-regulation full-size grass ground",
      "Basketball: 4 outdoor + 2 indoor courts",
      "Swimming Pool: Olympic 50m heated pool",
      "Badminton: 8 indoor courts (dedicated Sports Complex)",
      "Athletics: 400m IAAF certified synthetic track",
      "Gymnasium: 5,000 sq ft · open 5 AM–10 PM daily",
      "Annual Sports Day: February (inter-departmental competitions)",
    ],
  },
  "campus-clubs": {
    title:    "Student Clubs & Organizations",
    image:    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1000&q=85",
    alt:      "Students gathered at a vibrant university club activity fair",
    overview: "Viji University boasts over 130 registered student clubs and chapters covering technical, cultural, social, and entrepreneurial domains. Every club is officially recognized by the Student Affairs division and receives an annual budget allocation for activities.",
    specs: [
      "Total Registered Clubs: 130+",
      "Technical: IEEE SRM, ACM SRM, CSI, SAE, Robotics Club, Coding Club",
      "Cultural: Kalakendra (Dance), Theatrix (Drama), Swaranjali (Music)",
      "Social: NSS (National Service Scheme), NCC, YRC (Youth Red Cross)",
      "Entrepreneurship: E-Cell, Innovation Hub, StartupViji",
      "Annual Fest AARUUSH: 50,000+ participants across 100+ events",
      "Annual Tech Fest: SHAASTRA (joint IIT-M × Viji University collaboration)",
      "Club Registration Portal: studentaffairs.viji.edu.in/clubs",
    ],
  },
  "campus-facilities": {
    title:    "Campus Facilities & Infrastructure",
    image:    "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1000&q=85",
    alt:      "Spacious modern university library reading hall with rows of bookshelves",
    overview: "The Viji University Chennai Main Campus spans 250 acres and is one of the most self-sufficient university campuses in India. Beyond academic buildings, the campus hosts a 2,000-bed university hospital, Viji Mall, banks, ATMs, food courts, and 24x7 emergency ambulance service.",
    specs: [
      "Campus Area: 250 Acres (Chennai, Chennai Dist.)",
      "University Hospital: Viji Medical College — 2,000 beds, 52 specialties",
      "Banks on Campus: SBI, HDFC, Axis Bank branches + 10 ATMs",
      "Transport: Free shuttle within campus · MRTS Potheri Station 2-min walk",
      "Food Courts: 8 canteens + 3 food courts + Subway, Domino's, Starbucks",
      "Library: Dr. T.P. Ganesan Library — 5 Lakh+ volumes, digital access",
      "24x7 Power Backup: 100% DG backup for all academic and hostel blocks",
      "Green Campus: ISO 14001 certified · 30% campus area under green cover",
    ],
  },
  "placements-stats": {
    title:    "Placement Statistics",
    image:    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1000&q=85",
    alt:      "Business professionals shaking hands at corporate recruitment event",
    overview: "The SRM Career Development Centre consistently delivers one of the best placement records among private universities in India. In 2023-24, over 8,500 students were placed through campus recruitment across IT, BFSI, Core Engineering, Consulting, and Analytics sectors.",
    specs: [
      "Total Students Placed (2023-24): 8,500+",
      "Placement Percentage: 94% for eligible registered students",
      "Highest Package (Domestic): ₹67 LPA",
      "Highest Package (International): USD 1,25,000 per annum",
      "Average Package B.Tech CSE: ₹9.4 LPA",
      "Average Package All B.Tech Branches: ₹6.8 LPA",
      "Top Recruiter: Amazon (250+ offers) · Microsoft (180+ offers)",
      "Companies Participated: 650+ (150 new companies in 2023-24)",
    ],
  },
  "placements-recruiters": {
    title:    "Top Recruiters",
    image:    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1000&q=85",
    alt:      "Modern corporate office towers of leading technology companies",
    overview: "Viji University attracts Fortune 500 companies, leading Indian conglomerates, and innovative startups for campus recruitment. IT giants, core engineering companies, consulting firms, and BFSI sector leaders all recruit actively from the Chennai Main Campus.",
    specs: [
      "IT/Product: Amazon, Google, Microsoft, Adobe, Flipkart, Atlassian",
      "IT/Services: TCS, Infosys, Wipro, Cognizant, HCL, Capgemini",
      "BFSI: JP Morgan, Goldman Sachs, HDFC Bank, Kotak Mahindra Bank",
      "Core Engineering: L&T, Bosch, Caterpillar, TVS Motor, Tata Steel",
      "Consulting: Deloitte, EY, KPMG, McKinsey QuantumBlack",
      "Analytics & Data: Tiger Analytics, Mu Sigma, Fractal AI",
      "Defence PSUs: DRDO, HAL, BEL, BHEL",
      "Startups: 50+ funded startups recruited (avg. package ₹12 LPA)",
    ],
  },
  "placements-internships": {
    title:    "Internships & Industrial Training",
    image:    "https://images.unsplash.com/photo-1542744095-291d1f67b221?w=1000&q=85",
    alt:      "Young professionals collaborating in a modern startup office",
    overview: "Viji University mandates at least one internship for all B.Tech students, completed at the end of 6th semester. The CDC facilitates internship placements with over 400 partner companies. Many internships convert to valuable pre-placement offers (PPOs).",
    specs: [
      "Mandatory Internship: 8 weeks minimum at end of 6th Semester",
      "Internship Credits: 2 credits (Pass/Fail grading mode)",
      "PPO Conversion Rate: 38% of interns receive full-time job offers",
      "Top Internship Partners: Amazon, Zoho, Freshworks, Hyundai, ISRO",
      "Stipend Range: ₹5,000 – ₹80,000/month depending on company",
      "International Internships: Available via IAESTE & Erasmus+ programs",
      "Report Submission Deadline: Within 2 weeks of internship completion",
      "Internship Portal: internship.viji.edu.in",
    ],
  },
  "placements-training": {
    title:    "Career Development & Skill Training",
    image:    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1000&q=85",
    alt:      "Professional skill development training workshop with engaged participants",
    overview: "The Career Development Centre runs year-round training programs to ensure students are industry-ready before campus placements. Programs include aptitude training, technical workshops, communication and soft skills, mock interviews, and competitive coding bootcamps.",
    specs: [
      "Aptitude Training: Quantitative, Logical, Verbal (Semesters 3–5)",
      "Coding Bootcamps: DSA, Competitive Programming (Semesters 3–6)",
      "Soft Skills: Communication, Leadership, Group Dynamics (Semesters 2–4)",
      "Mock Interviews: Scheduled 4 weeks before the placement season opens",
      "AWS Academy: Cloud Foundations & Architecting certifications",
      "AMCAT / CoCubes: Free assessment vouchers provided to all students",
      "Coursera Access: 5,000+ courses via institutional license",
      "Training Partners: SkillEdge, Naukri Campus, TalentSprint",
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// PROGRAM_DETAILS — standalone inline data for each College "Explore" button.
// Fully decoupled from NAV_MENUS / LOCAL_TOPIC_DATA, keyed by PROGRAM_CARDS slug.
// ─────────────────────────────────────────────────────────────────────────────
const PROGRAM_DETAILS = {
  "academics-undergrad": {
    heading: "Engineering & Technology — Full Program Profile",
    image:   "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1000&q=85",
    alt:     "Students working in a high-tech computing laboratory",
    columns: [
      {
        title: "Next-Gen Labs",
        body:  "Dedicated laboratories for VLSI design, embedded systems, robotics, and IoT prototyping span 18,000 sq ft across the engineering blocks. Each lab is refreshed on a 3-year equipment cycle to keep pace with industry tooling, including FPGA boards, 3D printers, and CNC prototyping stations available for undergraduate project work from the second year onward.",
      },
      {
        title: "Supercomputing Grid Facilities",
        body:  "The Centre for High Performance Computing operates a 512-core GPU cluster used for AI/ML training, computational fluid dynamics, and large-scale simulation coursework. Students enrolled in AIML, Data Science, and core CSE electives receive scheduled cluster time allocations each semester, with priority queuing for final-year capstone projects.",
      },
      {
        title: "Tier-1 Collegiate Hackathons",
        body:  "Viji University hosts and competes in tier-1 hackathons including Smart India Hackathon, HackSRM, and the IEEE Xtreme 24-Hour Programming Challenge. The Engineering faculty runs a dedicated hackathon prep bootcamp each August, and winning teams receive seed funding consideration through the campus Innovation Hub for further development.",
      },
    ],
  },
  "campus-facilities": {
    heading: "Medicine & Health Sciences — Full Program Profile",
    image:   "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1000&q=85",
    alt:     "Medical students in clinical training session at hospital",
    columns: [
      {
        title: "2,000-Bed Clinical Rotations",
        body:  "MBBS and allied health students complete structured clinical rotations across all 52 specialties at Viji Medical College Hospital, beginning in the third academic year. Rotation blocks run 4–8 weeks per department, with attending physician supervision and a logged case minimum required before rotation sign-off.",
      },
      {
        title: "Hands-On Nursing & Pharmacy Tracks",
        body:  "B.Sc Nursing and B.Pharm students train in dedicated simulation wards equipped with mannequin-based vital monitoring systems and a working dispensary lab. Practical assessments are conducted each semester by senior faculty, with mandatory hospital floor placements totaling 1,200+ hours across the program.",
      },
      {
        title: "Advanced Surgical Simulators",
        body:  "The Skills & Simulation Centre houses laparoscopic trainers, a virtual-reality surgical simulation suite, and a cadaver lab for anatomy and surgical technique training. Fourth and fifth-year MBBS students log simulator hours as part of their pre-clinical surgical readiness assessment.",
      },
    ],
  },
  "academics-postgrad": {
    heading: "School of Management — Full Program Profile",
    image:   "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1000&q=85",
    alt:     "Business students presenting case study in modern boardroom",
    columns: [
      {
        title: "Specialized Case Study Blueprints",
        body:  "The MBA curriculum integrates over 150 Harvard Business School and Ivey-licensed case studies across core and elective modules. Each specialization track (Finance, Marketing, Operations, Business Analytics) maintains its own annually refreshed case library, with faculty-led case discussion sessions held weekly.",
      },
      {
        title: "Executive Corporate Mentorship Mixers",
        body:  "Quarterly mentorship mixers connect MBA students with CXO-level executives from partner companies for structured 1-on-1 mentoring across a 6-month cycle. Past mixer partners have included leadership from Deloitte, HDFC Bank, and Tiger Analytics, with mentee selection based on academic standing and stated career track.",
      },
      {
        title: "Strategic Global Business Incubator Tie-Ups",
        body:  "The School of Management partners with incubators in Singapore and Dubai to offer a 4-week global business immersion track for top-performing MBA students, including site visits, joint venture case competitions, and direct introductions to regional startup ecosystems.",
      },
    ],
  },
  "admissions-process": {
    heading: "School of Law — Full Program Profile",
    image:   "https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=1000&q=85",
    alt:     "Law students in formal moot court proceedings",
    columns: [
      {
        title: "Local Moot Court Calendar Schedules",
        body:  "The School of Law runs an internal moot court calendar with monthly competitions rotating through Constitutional, Criminal, Corporate, and International Law tracks. Each moot round is judged by a panel of practicing advocates and faculty, with the top two teams from each track advancing to the Annual SRM Moot Court Championship.",
      },
      {
        title: "International Legal Framework Structures",
        body:  "BA LLB and LLM students complete a mandatory International Law module covering WTO dispute resolution, cross-border arbitration, and comparative constitutional structures. The program includes simulated UN General Assembly sessions and a semester-long elective on International Humanitarian Law taught by visiting faculty.",
      },
      {
        title: "Corporate Legal Firm Placements",
        body:  "Final-year law students are placed for mandatory internships at corporate law firms including Cyril Amarchand Mangaldas, AZB & Partners, and Khaitan & Co, alongside district court clerkships. Placement coordination runs through the School of Law's dedicated Career Services desk, separate from the central CDC.",
      },
    ],
  },
  "academics-phd": {
    heading: "College of Science & Humanities — Full Program Profile",
    image:   "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1000&q=85",
    alt:     "Media editing suite with broadcast equipment and monitors",
    columns: [
      {
        title: "Media Communication Editing Suites",
        body:  "The Journalism & Mass Communication program operates three fully equipped editing suites with broadcast-grade cameras, Adobe Premiere and DaVinci Resolve workstations, and a working campus radio studio. Students produce a weekly campus news bulletin as part of their practical coursework requirement.",
      },
      {
        title: "Psychological Testing Facilities",
        body:  "The Psychology department maintains a dedicated testing lab with standardized assessment batteries (WAIS, MMPI, Rorschach protocols) for clinical and counseling psychology coursework. Supervised testing sessions with volunteer subjects are a required component of the M.Sc Clinical Psychology practicum.",
      },
      {
        title: "Specialized Economics Data Labs",
        body:  "Economics students access a dedicated data lab with Bloomberg Terminal access, STATA and R licenses, and curated macroeconomic datasets for thesis research. The lab also hosts a monthly econometrics workshop series led by visiting faculty from partner institutions.",
      },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// RESEARCH_DETAILS — standalone inline data for each Research Highlight tile.
// Fully decoupled from NAV_MENUS / LOCAL_TOPIC_DATA, keyed by RESEARCH_HIGHLIGHTS slug.
// ─────────────────────────────────────────────────────────────────────────────
const RESEARCH_DETAILS = {
  "research-centers": {
    heading: "Academic Research — Full Engagement Profile",
    image:   "https://images.unsplash.com/photo-1581093458791-9d09b1c3f0c3?w=1000&q=85",
    alt:     "Student researcher presenting findings to faculty advisor",
    columns: [
      {
        title: "Student-Led Research Stipends",
        body:  "Undergraduate students accepted into a faculty research group receive a monthly stipend of ₹3,000–₹6,000 depending on project scope and time commitment. Stipends are disbursed through the Office of Research & Innovation and require a minimum 10 hours/week lab commitment with quarterly progress reporting.",
      },
      {
        title: "Research Advisor Matching System",
        body:  "A centralized matching portal pairs interested students with faculty advisors based on stated research interests, prior coursework, and advisor capacity. Matching rounds run twice yearly (September and February), with most students placed within 3 weeks of application submission.",
      },
      {
        title: "Peer Group Networks",
        body:  "Active student researchers are grouped into discipline-specific peer cohorts that meet biweekly for informal progress sharing, troubleshooting, and cross-pollination of methods. The largest cohorts currently run in AI/ML, Biomedical Engineering, and Renewable Energy research tracks.",
      },
    ],
  },
  "research-publications": {
    heading: "Central Research Laboratories — Full Infrastructure Profile",
    image:   "https://images.unsplash.com/photo-1582719201676-1bb5b53d4ce1?w=1000&q=85",
    alt:     "Cleanroom laboratory with researchers in protective suits operating equipment",
    columns: [
      {
        title: "Specialized Testing Infrastructure Availability",
        body:  "Central labs house electron microscopy, X-ray diffraction, and mass spectrometry equipment shared across departments on a booking-slot basis. Equipment access is scheduled through the lab management portal, with priority given to Ph.D. scholars and funded project teams during peak demand periods.",
      },
      {
        title: "Cleanroom Parameters",
        body:  "The Class 1000 cleanroom facility supports semiconductor fabrication and nanomaterial synthesis work, maintaining particle counts below 1,000 per cubic foot at 0.5 microns. Access requires cleanroom certification training, available each semester through the Centre for Nanotechnology & Advanced Biomaterials.",
      },
      {
        title: "Cross-Disciplinary Laboratory Access",
        body:  "Researchers from any department can apply for cross-disciplinary lab access through a simple internal request form, enabling, for example, a biomedical engineering student to use the materials science lab's tensile testing equipment. Approval typically takes 5–7 working days.",
      },
    ],
  },
  "research-funding": {
    heading: "Recent Projects — Full Active Portfolio",
    image:   "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=1000&q=85",
    alt:     "Engineers testing renewable energy prototype equipment outdoors",
    columns: [
      {
        title: "Current Defence Contracts (ISRO & DRDO)",
        body:  "Viji University currently holds 14 active contracts with DRDO covering UAV avionics, composite materials for armor applications, and signal processing for radar systems, alongside 3 ISRO-Respond projects in satellite remote sensing and propulsion system thermal analysis. Combined active defence research value exceeds ₹18 Crores.",
      },
      {
        title: "Active Green Energy Testbeds",
        body:  "The Centre for Renewable Energy Research operates two live testbeds on campus: a 50kW perovskite-silicon tandem solar array and a small-scale wind-solar hybrid microgrid feeding the Engineering Block annex. Both testbeds are instrumented for continuous data logging used in ongoing efficiency optimization research.",
      },
      {
        title: "Mechanical Prototyping Milestones",
        body:  "The Mechanical Engineering research wing recently completed prototype testing on a low-cost prosthetic knee joint (Phase II clinical trials pending) and a campus-deployed autonomous delivery cart currently in its third design iteration, with full campus pilot deployment targeted for the next academic year.",
      },
    ],
  },
  "research-patents": {
    heading: "Innovation Hub — Full Incubation Profile",
    image:   "https://images.unsplash.com/photo-1542744173-05336fcc7ad4?w=1000&q=85",
    alt:     "Students pitching startup idea to panel of judges",
    columns: [
      {
        title: "Student Pitch-Deck Schedules",
        body:  "The Innovation Hub runs monthly pitch sessions where student founders present a 7-minute deck to a rotating panel of faculty mentors and alumni investors. Sessions are held on the first Friday of every month, with sign-ups opening two weeks in advance through the StartupViji portal.",
      },
      {
        title: "Seed Capital Disbursements for Student Founders",
        body:  "Selected student ventures receive seed grants ranging from ₹50,000 to ₹3,00,000, disbursed in two tranches tied to milestone completion. The fund has supported 28 spin-off companies to date through Viji TBI, with disbursement decisions made by an internal investment committee meeting quarterly.",
      },
      {
        title: "Pre-Incubation Workspace Tracks",
        body:  "Early-stage teams not yet ready for seed funding can join the 8-week pre-incubation track, which provides dedicated co-working desks, mentor office hours, and a structured curriculum on market validation and MVP development before formal pitch eligibility.",
      },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// RAMAN_BLOCK_DETAIL — standalone data for "Explore All Research Centres →"
// Anchored to /raman-block.jpg per spec
// ─────────────────────────────────────────────────────────────────────────────
const RAMAN_BLOCK_DETAIL = {
  heading: "Sir C.V. Raman Block — Complete Research Centre Directory",
  image:   "/raman-block.jpg",
  fallback:"https://images.unsplash.com/photo-1562774053-701939374585?w=1100&q=85",
  alt:     "Sir C.V. Raman Block research building at Viji University campus",
  intro:   "The Sir C.V. Raman Block is Viji University's flagship research facility, housing all 14 specialized engineering, biotechnology, and nanotechnology centres under one roof. The building operates extended research hours and maintains a unified cross-disciplinary project registry accessible to all affiliated scholars.",
  centres: [
    { name: "Centre for Nanotechnology & Advanced Biomaterials (CeNTAB)", floor: "Floor 2", hours: "8 AM – 9 PM" },
    { name: "Artificial Intelligence & Machine Learning Research Lab",     floor: "Floor 3", hours: "24x7 (Badge Access)" },
    { name: "Centre for Drug Discovery & Development (CD3)",               floor: "Floor 1", hours: "8 AM – 8 PM" },
    { name: "Robotics & Automation Research Centre",                       floor: "Floor 4", hours: "8 AM – 10 PM" },
    { name: "Centre for Environmental Studies & Sustainability",           floor: "Floor 1", hours: "9 AM – 6 PM" },
    { name: "Smart Grid & Renewable Energy Research Lab",                  floor: "Floor 4", hours: "8 AM – 9 PM" },
    { name: "VLSI Design & Embedded Systems Centre",                       floor: "Floor 3", hours: "24x7 (Badge Access)" },
    { name: "Centre for Space Technology Applications",                    floor: "Floor 5", hours: "9 AM – 6 PM" },
    { name: "Biomedical Signal Processing Lab",                            floor: "Floor 2", hours: "8 AM – 8 PM" },
    { name: "Advanced Composite Materials Lab",                            floor: "Floor 4", hours: "8 AM – 7 PM" },
    { name: "Centre for Wireless Communication Research",                  floor: "Floor 3", hours: "8 AM – 9 PM" },
    { name: "Structural Health Monitoring Lab",                            floor: "Floor 4", hours: "9 AM – 6 PM" },
    { name: "Computational Fluid Dynamics Research Unit",                  floor: "Floor 5", hours: "9 AM – 7 PM" },
    { name: "Centre for IoT & Embedded Intelligence",                      floor: "Floor 3", hours: "24x7 (Badge Access)" },
  ],
  registry: [
    { label: "Cross-Disciplinary Project Registry", value: "All active projects are logged in the unified Raman Block registry, searchable by department, PI, and funding source." },
    { label: "Equipment Booking System",             value: "Shared instrumentation across centres is reserved through a single building-wide booking portal to prevent scheduling conflicts." },
    { label: "Visiting Researcher Access",            value: "External and visiting researchers can request building access for up to 90 days via sponsorship from any centre's Principal Investigator." },
    { label: "Building Operating Hours",              value: "General building access runs 7 AM – 11 PM; badge-holders in 24x7 centres retain round-the-clock entry to their specific floor." },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// SAP_DETAIL — full Semester Abroad Program console data
// ─────────────────────────────────────────────────────────────────────────────
const SAP_DETAIL = {
  heading: "Semester Abroad Program (SAP) — Full Details",
  intro:   "The Semester Abroad Program allows high-performing Viji University students to spend one full semester at a globally ranked partner university, earning fully transferable credits while gaining an international academic and cultural experience.",
  timeline: [
    { phase: "January Cycle", detail: "Applications open 1st–31st January for the Odd Semester abroad placement starting July." },
    { phase: "July Cycle",    detail: "Applications open 1st–31st July for the Even Semester abroad placement starting December." },
    { phase: "Review Window", detail: "Department panel interviews are conducted within 3 weeks of the application deadline." },
    { phase: "Final Offer",   detail: "Selected students receive their institutional placement letter 6–8 weeks before semester start." },
  ],
  partners: [
    { name: "MIT",      full: "Massachusetts Institute of Technology", seats: "6 seats/year",  focus: "AI, Robotics & Advanced Computing",     flag: "US" },
    { name: "CMU",      full: "Carnegie Mellon University",            seats: "8 seats/year",  focus: "Software Engineering & ML Research",    flag: "US" },
    { name: "UC Davis", full: "University of California, Davis",       seats: "10 seats/year", focus: "Biotechnology & Environmental Science", flag: "US" },
    { name: "NUS",      full: "National University of Singapore",     seats: "12 seats/year", focus: "Data Science & Urban Innovation",       flag: "SG" },
  ],
  selection: [
    { label: "Minimum CGPA",         value: "7.5 / 10.0 or higher, verified at time of application" },
    { label: "Disciplinary Record",  value: "Zero active disciplinary actions or unresolved conduct cases" },
    { label: "Department Interview", value: "Mandatory panel interview clearance with home department faculty" },
    { label: "English Proficiency",  value: "IELTS 6.5+ / TOEFL 88+ required for non-English assessed applicants" },
  ],
  financial: [
    { label: "Tuition Fee Waiver", value: "40% to 60% of host university tuition, fully covered by the Viji University International Directorate budget" },
    { label: "Funding Source",     value: "Disbursed directly from the Viji University International Directorate annual mobility fund" },
    { label: "Travel & Living",    value: "Airfare, accommodation, and living expenses remain the student's responsibility" },
    { label: "Loan Assistance",    value: "Interest-free SBI education loan facilitation up to ₹5 Lakhs for SAP-related costs" },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// CAMPUS_LIFE_DETAILS — standalone rich data for each "Learn more →" card
// ─────────────────────────────────────────────────────────────────────────────
const CAMPUS_LIFE_DETAILS = {
  "campus-sports": {
    heading: "Athletics & Fitness — Full Facility Details",
    image:   "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=1000&q=85",
    alt:     "Olympic swimming pool with lane markers at university sports complex",
    sections: [
      {
        title: "Olympic 50m Pool — Booking System",
        body:  "The heated Olympic-standard 50m pool operates on a slot-booking system through the Sports Office portal. Students reserve 45-minute lane slots up to 3 days in advance. Open swim sessions run 6 AM–8 AM and 5 PM–7 PM daily; competitive swim team training is reserved 8 AM–10 AM on weekdays.",
      },
      {
        title: "5,000 sq ft Conditioning Gym — Training Hours",
        body:  "The gymnasium operates 5:00 AM to 10:00 PM every day of the week. Certified trainers are on-site 6 AM–9 AM and 4 PM–9 PM for personalised conditioning programs. Off-peak hours (10 AM–4 PM) are reserved for varsity athlete strength training blocks.",
      },
      {
        title: "IAAF 400m Track — Running Clubs",
        body:  "The certified synthetic track hosts three official running clubs: the Early Birds Club (5:30 AM daily), the Marathon Prep Group (Tue/Thu/Sat evenings), and the Sprint & Relay squad (varsity-only, by trial). All clubs are coordinated through the Sports Division office in Block 12.",
      },
    ],
  },
  "campus-hostels": {
    heading: "Housing & Dining — Full Residential Details",
    image:   "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1000&q=85",
    alt:     "Clean modern single-occupancy air-conditioned dorm room",
    sections: [
      {
        title: "Room Configurations",
        body:  "Single AC rooms (Blocks D, H, and L) offer private occupancy with attached bath and air conditioning at a premium tier. Triple Non-AC rooms (Blocks A, B, C, E, F, G) house three students per room with shared corridor bathrooms and ceiling fans, representing the standard allotment tier for first-year students.",
      },
      {
        title: "Laundry Token Collection Schedule",
        body:  "Laundry tokens are distributed every Monday and Thursday between 4 PM and 6 PM at each block's ground-floor utility counter. Each resident receives 8 tokens per week; unused tokens do not carry over to the following week. Express same-day service is available for an additional token at the central laundry facility.",
      },
      {
        title: "Biometric Gate Curfews",
        body:  "All hostel entry/exit is tracked via biometric fingerprint scanners at block gates. Boys' hostels enforce a 9:30 PM curfew with gates locking automatically; girls' hostels enforce an 8:30 PM curfew. Late entry requires written warden approval and is logged for parental notification after the second occurrence.",
      },
    ],
  },
  "campus-facilities": {
    heading: "Green Campus — Full Sustainability Details",
    image:   "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1000&q=85",
    alt:     "Solar panel array installed on green university campus rooftop",
    sections: [
      {
        title: "Solar Grid Capacity & Output",
        body:  "Viji University operates a 4.2 MW rooftop and ground-mounted solar grid spanning academic blocks, hostels, and the central library. The installation generates approximately 18,000 units of clean energy daily, offsetting roughly 35% of total campus electricity demand and reducing annual carbon emissions by an estimated 3,800 tonnes.",
      },
      {
        title: "Rainwater Collection Reservoirs",
        body:  "Two primary rainwater harvesting reservoirs sit adjacent to the Sir C.V. Raman Block, with a combined storage capacity of 2.5 million litres. Monsoon runoff from rooftops across 40+ buildings is channelled through a filtration network into these reservoirs, supplying non-potable water for landscaping and cooling systems campus-wide.",
      },
      {
        title: "Zero-Plastic Penalty Code",
        body:  "Single-use plastic is prohibited campus-wide under the Zero-Plastic Initiative. First-time violations result in a written warning logged with Student Affairs; repeat violations carry a ₹500 fine per instance, with proceeds directed to the campus sustainability fund. Reusable bottle refill stations are installed in every academic block.",
      },
    ],
  },
  "admissions-scholarships": {
    heading: "Scholarships Disbursements — Full Application Details",
    image:   "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=1000&q=85",
    alt:     "Student reviewing scholarship application documents at a desk",
    sections: [
      {
        title: "Chancellor's Waiver — Document Submission Process",
        body:  "Eligible students (SRMJEEE ranks 1–100) submit a signed waiver acceptance form, original rank card, and a notarised income declaration to the Scholarships Office within 15 days of seat confirmation. Documents are verified within 7 working days, after which the 100% tuition waiver is auto-applied to the student's fee ledger for all subsequent semesters, subject to maintaining a minimum 8.5 CGPA.",
      },
      {
        title: "Need-Based EWS Application Deadlines",
        body:  "Economically Weaker Section (EWS) applicants must submit family income certificates (issued within the last 6 months), a notarised affidavit, and academic transcripts through the online Scholarships Portal. The primary deadline is 60 days after admission confirmation; a secondary late-window deadline exists 90 days post-confirmation but carries a reduced waiver tier of 35% instead of the standard 50%.",
      },
      {
        title: "Renewal & Compliance Requirements",
        body:  "All scholarship recipients must re-submit updated income documentation annually by 30th June and maintain the minimum CGPA threshold specified for their scholarship tier. Failure to meet renewal deadlines results in automatic suspension of the waiver for the following semester until documentation is resubmitted and re-verified.",
      },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// OTHER STATIC DATA
// ─────────────────────────────────────────────────────────────────────────────
const ACCREDITATIONS = [
  { badge: "NAAC A++",        sub: "Highest Grade Awarded",    icon: "🏆" },
  { badge: "NIRF Rank 4",     sub: "Private Universities",     icon: "📊" },
  { badge: "Category I UGC",  sub: "Deemed University Status", icon: "🎓" },
  { badge: "QS World Ranked", sub: "Top 1000 Globally",        icon: "🌍" },
  { badge: "NBA Accredited",  sub: "All B.Tech Programs",      icon: "✅" },
  { badge: "ISO 14001",       sub: "Green Campus Certified",   icon: "🌿" },
];

const NEWS_ITEMS = [
  {
    tag: "Culture",   tagColor: "bg-pink-100 text-pink-700",   date: "Mar 2026", icon: "🎭",
    title:   "Viji University Celebrates the Spirit of Youth and Creativity with Milan 2026",
    excerpt: "The annual cultural extravaganza Milan 2026 lit up the Chennai Main Campus with live performances, art installations, and competitions drawing over 18,000 students across three vibrant days.",
  },
  {
    tag: "Defence",   tagColor: "bg-green-100 text-green-700", date: "Feb 2026", icon: "🛡️",
    title:   "Viji University Trains 350 OTA Officer Cadets in IT and Cyber Security",
    excerpt: "In a landmark initiative with the Officers' Training Academy (OTA), Viji University faculty delivered an intensive 3-week cyber security and IT infrastructure training module for 350 defence cadets.",
  },
  {
    tag: "Sports",    tagColor: "bg-orange-100 text-orange-700",date: "Jan 2026", icon: "🏆",
    title:   "Team Camber Racing Claims National Collegiate Karting Championship Title",
    excerpt: "Viji University's formula-style racing team, Team Camber Racing, clinched first place at the National Collegiate Karting Championship held in Coimbatore, beating 42 teams from 18 universities.",
  },
  {
    tag: "Innovation",tagColor: "bg-blue-100 text-blue-700",   date: "Dec 2025", icon: "☀️",
    title:   "Viji University Signs ₹1 Crore Solar Technology Licensing Accord with Greenova Energy",
    excerpt: "Viji University's Centre for Renewable Energy Research signed a landmark ₹1 Crore technology licensing agreement with Greenova Energy Ltd for a proprietary high-efficiency perovskite solar cell design.",
  },
];

const EVENTS = [
  { dates: "15 – 16 Jun", month: "2026", title: "AARUUSH Tech Fest Prelims",        type: "Technical", border: "#3B82F6", bg: "#EFF6FF" },
  { dates: "6 – 7 Jul",   month: "2026", title: "International Research Symposium", type: "Research",  border: "#8B5CF6", bg: "#F5F3FF" },
  { dates: "19 Jul",      month: "2026", title: "Odd Semester 2026 Commencement",   type: "Academic",  border: "#10B981", bg: "#ECFDF5" },
  { dates: "2 – 5 Aug",   month: "2026", title: "SHAASTRA 2026 — IIT-M × Viji University",  type: "Technical", border: "#F59E0B", bg: "#FFFBEB" },
  { dates: "22 Aug",      month: "2026", title: "Campus Placement Season Opens",    type: "Career",    border: "#EF4444", bg: "#FEF2F2" },
  { dates: "10 Sep",      month: "2026", title: "Cycle Test I — All Departments",   type: "Exam",      border: "#6B7280", bg: "#F9FAFB" },
];

const INTL_STATS = [
  { value: "900+",  label: "International Students",  icon: "🎓" },
  { value: "170+",  label: "International MoUs",      icon: "🤝" },
  { value: "95+",   label: "Nationalities",            icon: "🌍" },
  { value: "60+",   label: "Global Collaborations",   icon: "🔬" },
];

const PARTNER_UNIVERSITIES = [
  { name: "Massachusetts Institute of Technology", short: "MIT",       country: "USA",         focus: "AI, Robotics & Advanced Computing"    },
  { name: "Carnegie Mellon University",            short: "CMU",       country: "USA",         focus: "Software Engineering & ML Research"    },
  { name: "University of California, Davis",       short: "UC Davis",  country: "California",  focus: "Biotechnology & Environmental Science" },
  { name: "National University of Singapore",      short: "NUS",       country: "Singapore",   focus: "Data Science & Urban Innovation"       },
  { name: "TU Delft",                              short: "TU Delft",  country: "Netherlands", focus: "Civil, Aerospace & Water Technology"   },
  { name: "University of Melbourne",               short: "Melbourne", country: "Australia",   focus: "Medicine, Law & Liberal Arts"          },
];

const CAMPUS_AMENITIES = [
  {
    slug: "campus-sports",
    title: "Athletics & Fitness",
    subtitle: "World-class sports infrastructure",
    desc: "Dedicated courts for basketball, tennis, and badminton. IAAF-certified 400m synthetic athletics track, Olympic 50m heated pool, and a 5,000 sq ft gymnasium open 5 AM–10 PM daily.",
    tags: ["Basketball", "Swimming", "Cricket", "Football", "Athletics"],
  },
  {
    slug: "campus-hostels",
    title: "Housing & Dining Towers",
    subtitle: "12,000+ beds across 22 residential blocks",
    desc: "Non-AC triple, AC double, and AC single room footprints — each with 24x7 Wi-Fi and biometric entry. Five dedicated dining halls serving vegetarian and non-vegetarian meals daily.",
    tags: ["AC Rooms", "24x7 Wi-Fi", "5 Mess Halls", "Laundry", "RO Water"],
  },
  {
    slug: "campus-facilities",
    title: "Green Campus",
    subtitle: "250 acres · ISO 14001 certified",
    desc: "Lush lawns and decades-old trees coexist with modern academic infrastructure. 30% of campus area is under green cover, with solar panels, rainwater harvesting, and a zero-plastic initiative.",
    tags: ["Solar Energy", "Zero Plastic", "Rainwater Harvesting", "30% Green"],
  },
  {
    slug: "admissions-scholarships",
    title: "Scholarships Disbursements",
    subtitle: "₹50 Crore+ disbursed annually",
    desc: "Chancellor's scholarships, merit waivers, sports quotas, EWS grants, and government scholarships — Viji University disburses over ₹50 Crore in financial aid every year to deserving students.",
    tags: ["Chancellor's Waiver", "Merit-Based", "EWS Grant", "Sports Quota"],
  },
];

const CONTACTS = [
  { dept: "Admissions Central Desk",    tel: "+91-44-2745 6100", email: "admissions@viji.edu.in" },
  { dept: "Hostel Oversight Office",    tel: "+91-44-2745 6500", email: "hostel@viji.edu.in"     },
  { dept: "Placement Hub (CDC)",        tel: "+91-44-2745 6200", email: "cdc@viji.edu.in"        },
  { dept: "International Relations",    tel: "+91-44-2745 6300", email: "intl@viji.edu.in"       },
  { dept: "Research & Innovation (ORI)",tel: "+91-44-2745 6400", email: "ori@viji.edu.in"        },
  { dept: "Campus Security (24x7)",     tel: "+91-44-2745 9999", email: "security@viji.edu.in"   },
];

// ─────────────────────────────────────────────────────────────────────────────
// HOOKS — top-level scope before any component
// ─────────────────────────────────────────────────────────────────────────────
function useCountUp(target, duration, active) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p    = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(ease * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, active]);
  return count;
}

function useInView(threshold) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold: threshold || 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// ─────────────────────────────────────────────────────────────────────────────
// IMAGE PRELOADER — pre-fetches all assets on boot, zero render lag
// ─────────────────────────────────────────────────────────────────────────────
function ImagePreloader() {
  useEffect(() => {
    const urls = [
      "/srm-ktr.jpg", "/logo.png",
      "/students-class.jpg", "/faculty-lab.jpg", "/parents-view.jpg",
      "/visitors-gate.jpg", "/alumni-network.jpg",
      "/raman-block.jpg",
      ...Object.values(LOCAL_TOPIC_DATA).map(d => d.image),
      ...Object.values(AUDIENCE_PORTALS).map(d => d.fallback),
      ...PROGRAM_CARDS.map(c => c.image),
      ...RESEARCH_HIGHLIGHTS.map(r => r.image),
      ...Object.values(CAMPUS_LIFE_DETAILS).map(d => d.image),
      ...Object.values(PROGRAM_DETAILS).map(d => d.image),
      ...Object.values(RESEARCH_DETAILS).map(d => d.image),
    ];
    urls.forEach(src => { const img = new Image(); img.src = src; });
  }, []);
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// SMART IMAGE — tries primary src, optional fallback, then gradient
// ─────────────────────────────────────────────────────────────────────────────
function SmartImage({ src, fallback, alt, className }) {
  const [triedFallback, setTriedFallback] = useState(false);
  const [failed, setFailed] = useState(false);
  const actualSrc = !triedFallback ? src : fallback;

  if (failed) {
    return (
      <div className={`${className} flex items-center justify-center`}
        style={{ background: `linear-gradient(135deg, ${SRM_BLUE} 0%, #1a56c4 100%)` }}>
        <span className="text-white/30 text-5xl">🎓</span>
      </div>
    );
  }
  return (
    <img
      src={actualSrc}
      alt={alt}
      className={`${className} object-cover`}
      onError={() => {
        if (!triedFallback && fallback) { setTriedFallback(true); }
        else { setFailed(true); }
      }}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NAVIGATION — white bar, /logo.png, text-only audience ribbon, search panel
// ─────────────────────────────────────────────────────────────────────────────
function Navigation({
  activeAudience, setActiveAudience,
  activeSlug, setActiveSlug,
  setSapOpen, setCampusLifeSlug,
  setProgramSlug, setResearchSlug, setRamanOpen,
}) {
  const [openMenu, setOpenMenu] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const audienceKeys = Object.keys(AUDIENCE_PORTALS);

  const clearAll = () => {
    setSapOpen(false);
    setCampusLifeSlug(null);
    setProgramSlug(null);
    setResearchSlug(null);
    setRamanOpen(false);
  };

  const handleAudience = (key) => {
    clearAll();
    setActiveSlug(null);
    setActiveAudience(prev => prev === key ? null : key);
    setTimeout(() => document.getElementById("audience-panel")?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  };

  const handleSlug = (slug) => {
    setOpenMenu(null);
    setActiveAudience(null);
    clearAll();
    setActiveSlug(prev => prev === slug ? null : slug);
    setTimeout(() => document.getElementById("topic-panel")?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  };

  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* Blue utility ribbon — text-only labels, no emojis */}
      <div style={{ backgroundColor: SRM_BLUE }}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-9">
          <div className="flex items-center gap-0.5">
            <span className="text-yellow-300 text-xs font-bold mr-2">For:</span>
            {audienceKeys.map(key => (
              <button
                key={key}
                onClick={() => handleAudience(key)}
                className="px-2.5 py-0.5 rounded text-xs font-medium transition-all text-white/90 hover:bg-white/20"
                style={activeAudience === key ? { backgroundColor: "rgba(255,255,255,0.25)", fontWeight: 700 } : {}}
              >
                {key}
              </button>
            ))}
          </div>
          <div className="hidden sm:flex items-center gap-4 text-white/70 text-[11px]">
            <span>1800-102-1525</span>
            <span>admissions@viji.edu.in</span>
          </div>
        </div>
      </div>

      {/* White main nav */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <a href="#hero" className="flex items-center gap-3 flex-shrink-0">
            <img
              src="/logo.png"
              alt="Viji University"
              className="h-14 object-contain"
              onError={e => { e.currentTarget.style.display = "none"; }}
            />
            <div className="hidden sm:block">
              <div className="font-black text-sm leading-tight" style={{ color: SRM_BLUE }}>
                Viji University
              </div>
              <div className="text-xs font-bold tracking-widest" style={{ color: SRM_GOLD }}>
                LEARN · LEAP · LEAD
              </div>
            </div>
          </a>

          <div className="hidden lg:flex items-center gap-0.5">
            {Object.entries(NAV_MENUS).map(([section, items]) => (
              <div
                key={section}
                className="relative"
                onMouseEnter={() => setOpenMenu(section)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <button
                  className="px-3 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-1"
                  style={{ color: openMenu === section ? SRM_BLUE : "#374151" }}
                >
                  {section}
                  <svg className="w-3 h-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openMenu === section && (
                  <div className="absolute top-full left-0 pt-2 z-50 min-w-[230px]">
                    <div className="bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
                      <div className="p-1.5">
                        {items.map(({ label, slug }) => (
                          <button
                            key={slug}
                            onClick={() => handleSlug(slug)}
                            className="w-full text-left px-4 py-2.5 text-sm rounded-lg font-medium transition-colors"
                            style={activeSlug === slug ? { backgroundColor: SRM_BLUE, color: "#fff" } : { color: "#374151" }}
                            onMouseEnter={e => { if (activeSlug !== slug) e.currentTarget.style.backgroundColor = "#EEF3FF"; }}
                            onMouseLeave={e => { if (activeSlug !== slug) e.currentTarget.style.backgroundColor = ""; }}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 relative">
            <button
              onClick={() => setSearchOpen(prev => !prev)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Search"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            {searchOpen && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 p-3 z-50">
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search programs, admissions, facilities…"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
                />
              </div>
            )}
            <a
              href="#contact"
              className="hidden lg:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold text-white shadow-md transition-opacity hover:opacity-90"
              style={{ backgroundColor: SRM_BLUE }}
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AUDIENCE PANEL — inline, local images exclusively
// ─────────────────────────────────────────────────────────────────────────────
function AudiencePanel({ activeAudience }) {
  if (!activeAudience) return null;
  const data = AUDIENCE_PORTALS[activeAudience];
  if (!data) return null;
  return (
    <section id="audience-panel" className="border-b-4" style={{ borderColor: SRM_GOLD }}>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="rounded-2xl overflow-hidden h-72 shadow-lg bg-gray-100">
            <SmartImage src={data.image} fallback={data.fallback} alt={data.alt} className="w-full h-full" />
          </div>
          <div>
            <h2 className="text-2xl font-black mb-2" style={{ color: SRM_BLUE }}>{data.heading}</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-5 border-l-4 pl-4" style={{ borderColor: SRM_GOLD }}>
              {data.intro}
            </p>
            <ul className="space-y-2.5">
              {data.links.map(({ label, desc }) => (
                <li key={label} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-200 transition-colors">
                  <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ backgroundColor: SRM_GOLD }} />
                  <div>
                    <div className="font-bold text-sm" style={{ color: SRM_BLUE }}>{label}</div>
                    <div className="text-gray-500 text-xs">{desc}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TOPIC PANEL — inline, premium production photography (navbar sub-menu hits)
// ─────────────────────────────────────────────────────────────────────────────
function TopicPanel({ activeSlug }) {
  if (!activeSlug) return null;
  const data = LOCAL_TOPIC_DATA[activeSlug];
  if (!data) return null;
  return (
    <section id="topic-panel" className="border-b-4" style={{ borderColor: SRM_BLUE }}>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="rounded-2xl overflow-hidden h-72 shadow-lg bg-gray-100">
            <SmartImage src={data.image} fallback={data.image} alt={data.alt} className="w-full h-full" />
          </div>
          <div>
            <span className="inline-block text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-3" style={{ backgroundColor: SRM_BLUE }}>
              VIJI · CHENNAI
            </span>
            <h2 className="text-2xl font-black mb-3 leading-tight" style={{ color: SRM_BLUE }}>{data.title}</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-5 border-l-4 pl-4" style={{ borderColor: SRM_GOLD }}>
              {data.overview}
            </p>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Key Specifications</h4>
              <ul className="space-y-1.5">
                {data.specs.map((spec, i) => {
                  const ci  = spec.indexOf(":");
                  const key = ci > -1 ? spec.slice(0, ci) : null;
                  const val = ci > -1 ? spec.slice(ci + 1).trim() : spec;
                  return (
                    <li key={i} className="flex items-start gap-2.5 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ backgroundColor: SRM_GOLD }} />
                      {key
                        ? <span><span className="font-semibold text-gray-800">{key}:</span> <span className="text-gray-600">{val}</span></span>
                        : <span className="text-gray-700">{spec}</span>
                      }
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PROGRAM DETAIL PANEL — standalone inline panel for College "Explore" buttons
// ─────────────────────────────────────────────────────────────────────────────
function ProgramDetailPanel({ slug }) {
  if (!slug) return null;
  const data = PROGRAM_DETAILS[slug];
  if (!data) return null;
  return (
    <section id="program-detail-panel" className="border-b-4 bg-white" style={{ borderColor: SRM_BLUE }}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <span className="inline-block text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-3" style={{ backgroundColor: SRM_BLUE }}>
            College Profile · Full Details
          </span>
          <h2 className="text-2xl font-black leading-tight" style={{ color: SRM_BLUE }}>{data.heading}</h2>
        </div>
        <div className="grid lg:grid-cols-5 gap-8 mb-8">
          <div className="lg:col-span-2 rounded-2xl overflow-hidden h-56 shadow-lg bg-gray-100">
            <SmartImage src={data.image} fallback={data.image} alt={data.alt} className="w-full h-full" />
          </div>
          <div className="lg:col-span-3 grid sm:grid-cols-3 gap-4">
            {data.columns.map(({ title, body }) => (
              <div key={title} className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <h4 className="font-black text-sm mb-2" style={{ color: SRM_BLUE }}>{title}</h4>
                <p className="text-gray-600 text-xs leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RESEARCH DETAIL PANEL — standalone inline panel for Research Highlight tiles
// ─────────────────────────────────────────────────────────────────────────────
function ResearchDetailPanel({ slug }) {
  if (!slug) return null;
  const data = RESEARCH_DETAILS[slug];
  if (!data) return null;
  return (
    <section id="research-detail-panel" className="border-b-4 bg-white" style={{ borderColor: SRM_GOLD }}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <span className="inline-block text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-3" style={{ backgroundColor: SRM_GOLD, color: "#1a1a1a" }}>
            Research Profile · Full Details
          </span>
          <h2 className="text-2xl font-black leading-tight" style={{ color: SRM_BLUE }}>{data.heading}</h2>
        </div>
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 rounded-2xl overflow-hidden h-56 shadow-lg bg-gray-100">
            <SmartImage src={data.image} fallback={data.image} alt={data.alt} className="w-full h-full" />
          </div>
          <div className="lg:col-span-3 grid sm:grid-cols-3 gap-4">
            {data.columns.map(({ title, body }) => (
              <div key={title} className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                <h4 className="font-black text-sm mb-2" style={{ color: SRM_BLUE }}>{title}</h4>
                <p className="text-gray-600 text-xs leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RAMAN BLOCK PANEL — standalone showcase for "Explore All Research Centres →"
// Uses /raman-block.jpg as the central visual anchor per spec
// ─────────────────────────────────────────────────────────────────────────────
function RamanBlockPanel({ open }) {
  if (!open) return null;
  const d = RAMAN_BLOCK_DETAIL;
  return (
    <section id="raman-panel" className="border-b-4 bg-white" style={{ borderColor: SRM_BLUE }}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-bold tracking-widest uppercase mb-2" style={{ color: SRM_GOLD }}>
            — Research Infrastructure —
          </span>
          <h2 className="text-3xl font-black mb-3" style={{ color: SRM_BLUE }}>{d.heading}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm leading-relaxed">{d.intro}</p>
        </div>

        {/* Central visual anchor — /raman-block.jpg */}
        <div className="rounded-2xl overflow-hidden h-64 shadow-xl mb-10 bg-gray-100">
          <SmartImage src={d.image} fallback={d.fallback} alt={d.alt} className="w-full h-full" />
        </div>

        {/* 14-centre directory table */}
        <div className="mb-10">
          <h3 className="font-black text-base mb-4 flex items-center gap-2" style={{ color: SRM_BLUE }}>
            Complete Centre Directory — 14 Specialised Units
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {d.centres.map(({ name, floor, hours }) => (
              <div key={name} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-blue-200 transition-colors">
                <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ backgroundColor: SRM_BLUE }} />
                <div>
                  <div className="font-semibold text-gray-800 text-sm leading-snug">{name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{floor} &nbsp;·&nbsp; {hours}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Registry details */}
        <div className="rounded-2xl p-6 text-white" style={{ backgroundColor: SRM_BLUE }}>
          <h3 className="font-black text-base mb-4">Cross-Disciplinary Project Registry &amp; Building Policies</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {d.registry.map(({ label, value }) => (
              <div key={label} className="bg-white/10 rounded-xl p-4">
                <div className="font-bold text-sm mb-1" style={{ color: SRM_GOLD }}>{label}</div>
                <div className="text-blue-100 text-xs leading-relaxed">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SAP DETAIL CONSOLE
// ─────────────────────────────────────────────────────────────────────────────
function SapDetailPanel({ open }) {
  if (!open) return null;
  const d = SAP_DETAIL;
  return (
    <section id="sap-panel" className="border-b-4 bg-white" style={{ borderColor: SRM_GOLD }}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-bold tracking-widest uppercase mb-2" style={{ color: SRM_GOLD }}>
            — Global Engagement —
          </span>
          <h2 className="text-3xl font-black mb-3" style={{ color: SRM_BLUE }}>{d.heading}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm leading-relaxed">{d.intro}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <h3 className="font-black text-base mb-4 flex items-center gap-2" style={{ color: SRM_BLUE }}>
              Application Timeline
            </h3>
            <div className="space-y-3">
              {d.timeline.map(({ phase, detail }) => (
                <div key={phase} className="flex items-start gap-3 pb-3 border-b border-gray-200 last:border-0 last:pb-0">
                  <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ backgroundColor: SRM_GOLD }} />
                  <div>
                    <div className="font-bold text-sm text-gray-800">{phase}</div>
                    <div className="text-gray-500 text-xs leading-relaxed">{detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <h3 className="font-black text-base mb-4 flex items-center gap-2" style={{ color: SRM_BLUE }}>
              Selection Metrics
            </h3>
            <div className="space-y-3">
              {d.selection.map(({ label, value }) => (
                <div key={label} className="flex items-start gap-3 pb-3 border-b border-gray-200 last:border-0 last:pb-0">
                  <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ backgroundColor: SRM_GOLD }} />
                  <div>
                    <div className="font-bold text-sm text-gray-800">{label}</div>
                    <div className="text-gray-500 text-xs leading-relaxed">{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="font-black text-base mb-4" style={{ color: SRM_BLUE }}>Partner Institutional Mapping</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {d.partners.map(({ name, full, seats, focus, flag }) => (
              <div key={name} className="rounded-2xl p-5 border-2" style={{ borderColor: SRM_BLUE + "30", backgroundColor: "#F0F4FF" }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: SRM_BLUE, color: "#fff" }}>{flag}</span>
                  <span className="font-black text-lg" style={{ color: SRM_BLUE }}>{name}</span>
                </div>
                <div className="text-gray-700 text-xs font-medium mb-2">{full}</div>
                <div className="text-xs font-bold mb-1.5" style={{ color: SRM_GOLD }}>{seats}</div>
                <div className="text-gray-500 text-xs">{focus}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-2xl p-6 text-white" style={{ backgroundColor: SRM_BLUE }}>
          <h3 className="font-black text-base mb-4">Financial Framework</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {d.financial.map(({ label, value }) => (
              <div key={label} className="bg-white/10 rounded-xl p-4">
                <div className="font-bold text-sm mb-1" style={{ color: SRM_GOLD }}>{label}</div>
                <div className="text-blue-100 text-xs leading-relaxed">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CAMPUS LIFE DETAIL PANEL
// ─────────────────────────────────────────────────────────────────────────────
function CampusLifeDetailPanel({ slug }) {
  if (!slug) return null;
  const data = CAMPUS_LIFE_DETAILS[slug];
  if (!data) return null;
  return (
    <section id="campus-life-panel" className="border-b-4 bg-white" style={{ borderColor: SRM_BLUE }}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 rounded-2xl overflow-hidden h-64 lg:h-full shadow-lg bg-gray-100">
            <SmartImage src={data.image} fallback={data.image} alt={data.alt} className="w-full h-full" />
          </div>
          <div className="lg:col-span-3">
            <span className="inline-block text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-3" style={{ backgroundColor: SRM_BLUE }}>
              Campus Life · Full Profile
            </span>
            <h2 className="text-2xl font-black mb-5 leading-tight" style={{ color: SRM_BLUE }}>{data.heading}</h2>
            <div className="space-y-4">
              {data.sections.map(({ title, body }) => (
                <div key={title} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                  <h4 className="font-bold text-sm mb-2" style={{ color: SRM_BLUE }}>{title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO SECTION
// ─────────────────────────────────────────────────────────────────────────────
function HeroSection() {
  const [ref, inView] = useInView(0.1);
  const students = useCountUp(50000, 2000, inView);
  return (
    <section id="hero" ref={ref}>
      <div className="w-full overflow-hidden" style={{ maxHeight: "520px" }}>
        <img
          src="/srm-ktr.jpg"
          alt="Viji University, Chennai Main Campus"
          className="w-full object-cover object-center"
          style={{ maxHeight: "520px" }}
        />
      </div>
      <div className="h-2" style={{ backgroundColor: SRM_GOLD }} />
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
            {[
              { value: "1985",                          label: "Established",       sub: "Four decades of academic excellence" },
              { value: "250+ Acres",                    label: "Green Campus",      sub: "ISO 14001 certified, 30% green cover" },
              { value: students.toLocaleString() + "+", label: "Enrolled Students", sub: "Across all programs and disciplines"  },
            ].map(({ value, label, sub }) => (
              <div key={label} className="py-4 sm:py-2 px-4">
                <div className="text-4xl font-black mb-1" style={{ color: SRM_BLUE }}>{value}</div>
                <div className="font-bold text-gray-800 text-base">{label}</div>
                <div className="text-gray-500 text-xs mt-0.5">{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PROGRAMS MATRIX — Explore buttons open ProgramDetailPanel, NOT nav slugs
// ─────────────────────────────────────────────────────────────────────────────
function ProgramsSection({ activeProgramSlug, onProgramToggle }) {
  return (
    <section id="programs" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-xs font-bold tracking-widest uppercase block mb-2" style={{ color: SRM_GOLD }}>
            — Colleges & Schools —
          </span>
          <h2 className="text-4xl font-black mb-3" style={{ color: SRM_BLUE }}>
            Explore Diverse Programs for Every Career
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm">
            Five foundational colleges offering rigorous, industry-aligned education from engineering to law and health sciences.
          </p>
        </div>
        <div className="space-y-4">
          {PROGRAM_CARDS.map(({ slug, image, alt, college, tagline, count, color, icon }) => {
            const isOpen = activeProgramSlug === slug;
            return (
              <div key={slug}>
                {/* Card row */}
                <div
                  className="group w-full text-left bg-white rounded-2xl border-2 transition-all duration-300 overflow-hidden flex"
                  style={{ borderColor: isOpen ? SRM_BLUE : "#F3F4F6", boxShadow: isOpen ? "0 4px 24px rgba(0,59,142,0.10)" : "none" }}
                >
                  <div className="w-40 sm:w-56 flex-shrink-0 overflow-hidden">
                    <SmartImage
                      src={image}
                      fallback={image}
                      alt={alt}
                      className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                      style={{ minHeight: "120px" }}
                    />
                  </div>
                  <div className="flex-1 p-5 sm:p-6 flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 shadow-sm text-white"
                      style={{ backgroundColor: color }}
                    >
                      {icon}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-black text-gray-900 text-base sm:text-lg mb-1 leading-snug">{college}</h3>
                      <p className="text-gray-500 text-sm mb-2">{tagline}</p>
                      <span className="inline-block text-white text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: color }}>
                        {count}
                      </span>
                    </div>
                    <div className="ml-auto flex-shrink-0">
                      <button
                        onClick={() => onProgramToggle(slug)}
                        className="flex items-center gap-1 text-sm font-bold px-4 py-2 rounded-lg transition-colors"
                        style={{ color: isOpen ? "#fff" : color, backgroundColor: isOpen ? color : color + "18" }}
                      >
                        {isOpen ? "Close ↑" : "Explore →"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Inline detail panel — expands below the card */}
                {isOpen && (
                  <div className="mt-2">
                    <ProgramDetailPanel slug={slug} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ACCREDITATIONS
// ─────────────────────────────────────────────────────────────────────────────
function AccreditationsSection() {
  return (
    <section id="accreditations" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-xs font-bold tracking-widest uppercase block mb-2" style={{ color: SRM_GOLD }}>
            — Ranked & Recognised —
          </span>
          <h2 className="text-4xl font-black mb-3" style={{ color: SRM_BLUE }}>
            Rankings &amp; National Accreditations Legacy
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm">
            NAAC A++ Accreditation, Category I UGC status, complete Tier-1 NBA Compliance, and global QS World ranking recognition.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {ACCREDITATIONS.map(({ badge, sub, icon }) => (
            <div
              key={badge}
              className="rounded-2xl p-5 text-center border-2 hover:shadow-md transition-shadow"
              style={{ borderColor: SRM_BLUE + "22", backgroundColor: SRM_BLUE + "08" }}
            >
              <div className="text-3xl mb-2">{icon}</div>
              <div className="font-black text-sm mb-1" style={{ color: SRM_BLUE }}>{badge}</div>
              <div className="text-gray-500 text-[11px]">{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NEWS & EVENTS
// ─────────────────────────────────────────────────────────────────────────────
function NewsSection() {
  const [active, setActive] = useState(0);
  return (
    <section id="news" className="py-20" style={{ backgroundColor: "#F8F9FB" }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-xs font-bold tracking-widest uppercase block mb-2" style={{ color: SRM_GOLD }}>
            — What's Happening —
          </span>
          <h2 className="text-4xl font-black" style={{ color: SRM_BLUE }}>
            Campus News &amp; Events Timetable
          </h2>
        </div>
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Latest News</h3>
            {NEWS_ITEMS.map((item, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className="w-full text-left rounded-2xl border-2 p-5 transition-all flex gap-4"
                style={{ backgroundColor: "#fff", borderColor: active === i ? SRM_BLUE : "transparent", boxShadow: active === i ? "0 4px 24px rgba(0,59,142,0.10)" : "none" }}
              >
                <div className="text-3xl flex-shrink-0">{item.icon}</div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.tagColor}`}>{item.tag}</span>
                    <span className="text-gray-400 text-xs">{item.date}</span>
                  </div>
                  <h4 className="font-bold text-sm leading-snug" style={{ color: active === i ? SRM_BLUE : "#111827" }}>
                    {item.title}
                  </h4>
                  {active === i && <p className="text-gray-500 text-xs leading-relaxed mt-2">{item.excerpt}</p>}
                </div>
              </button>
            ))}
          </div>
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Upcoming Happenings</h3>
            <div className="space-y-3">
              {EVENTS.map((ev, i) => (
                <div key={i} className="rounded-2xl border-l-4 p-4 flex items-start gap-4" style={{ borderColor: ev.border, backgroundColor: ev.bg }}>
                  <div className="flex-shrink-0 min-w-[64px] text-center">
                    <div className="font-black text-gray-800 text-sm leading-tight">{ev.dates}</div>
                    <div className="text-gray-400 text-[10px]">{ev.month}</div>
                  </div>
                  <div>
                    <div className="font-bold text-gray-800 text-sm">{ev.title}</div>
                    <span className="text-xs text-gray-500">{ev.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RESEARCH SECTION — tiles open ResearchDetailPanel; CTA opens RamanBlockPanel
// Both fully decoupled from NAV_MENUS
// ─────────────────────────────────────────────────────────────────────────────
function ResearchSection({ activeResearchSlug, onResearchToggle, ramanOpen, onRamanToggle }) {
  return (
    <section id="research" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-xs font-bold tracking-widest uppercase block mb-2" style={{ color: SRM_GOLD }}>
            — Research & Innovation —
          </span>
          <h2 className="text-4xl font-black mb-3" style={{ color: SRM_BLUE }}>
            Excellent Research &amp; Innovation Culture
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm">
            14 dedicated research centres, 340+ active projects, and ₹45 Crores in annual funding driving discovery at every level.
          </p>
        </div>

        {/* Tiles — each one toggles its own ResearchDetailPanel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {RESEARCH_HIGHLIGHTS.map(({ slug, label, sublabel, image, imgAlt, stat, statSub }) => {
            const isOpen = activeResearchSlug === slug;
            return (
              <div key={slug}>
                <button
                  onClick={() => onResearchToggle(slug)}
                  className="group w-full rounded-2xl overflow-hidden border-2 transition-all duration-300 text-left"
                  style={{ borderColor: isOpen ? SRM_BLUE : "#F3F4F6", boxShadow: isOpen ? "0 4px 24px rgba(0,59,142,0.10)" : "none" }}
                >
                  <div className="h-44 overflow-hidden bg-gray-100">
                    <SmartImage src={image} fallback={image} alt={imgAlt} className="w-full h-full group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4">
                    <div className="text-2xl font-black mb-0.5" style={{ color: SRM_BLUE }}>{stat}</div>
                    <div className="text-xs text-gray-500 mb-2">{statSub}</div>
                    <div className="font-bold text-gray-900 text-sm leading-snug">{label}</div>
                    <div className="text-gray-500 text-xs mt-1 mb-3">{sublabel}</div>
                    <span
                      className="inline-block text-xs font-bold px-3 py-1 rounded-full transition-colors"
                      style={{ backgroundColor: isOpen ? SRM_BLUE : SRM_BLUE + "18", color: isOpen ? "#fff" : SRM_BLUE }}
                    >
                      {isOpen ? "Close ↑" : "View Details →"}
                    </span>
                  </div>
                </button>
                {isOpen && (
                  <div className="mt-2">
                    <ResearchDetailPanel slug={slug} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Partner badges */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {["MIT", "NUS Singapore", "TU Delft", "Univ. Melbourne", "ISRO", "DRDO"].map(p => (
            <span key={p} className="text-xs font-bold px-3 py-1.5 rounded-full border-2" style={{ color: SRM_BLUE, borderColor: SRM_BLUE, backgroundColor: "#EEF3FF" }}>
              {p}
            </span>
          ))}
        </div>

        {/* Explore All CTA — opens RamanBlockPanel, NOT a nav slug */}
        <div className="text-center">
          <button
            onClick={onRamanToggle}
            className="text-white font-bold px-8 py-3 rounded-xl text-sm shadow-md transition-opacity hover:opacity-90"
            style={{ backgroundColor: SRM_BLUE }}
          >
            {ramanOpen ? "Hide Research Centre Directory ↑" : "Explore All Research Centres →"}
          </button>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL ALLIANCES
// ─────────────────────────────────────────────────────────────────────────────
function GlobalSection({ sapOpen, onToggleSap }) {
  return (
    <section id="global" className="py-20" style={{ backgroundColor: "#F0F4FF" }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-xs font-bold tracking-widest uppercase block mb-2" style={{ color: SRM_GOLD }}>
            — Global Reach —
          </span>
          <h2 className="text-4xl font-black mb-3" style={{ color: SRM_BLUE }}>
            Global Alliances &amp; International Linkages
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-12">
          {INTL_STATS.map(({ value, label, icon }) => (
            <div key={label} className="bg-white rounded-2xl p-6 text-center shadow-sm border border-blue-100">
              <div className="text-3xl mb-2">{icon}</div>
              <div className="text-3xl font-black mb-1" style={{ color: SRM_BLUE }}>{value}</div>
              <div className="text-gray-500 text-sm font-medium">{label}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {PARTNER_UNIVERSITIES.map(({ name, short, country, focus }) => (
            <div key={short} className="bg-white rounded-2xl p-5 border-2 border-blue-100 hover:border-blue-300 hover:shadow-md transition-all">
              <div className="mb-3">
                <div className="font-black text-gray-900">{short}</div>
                <div className="text-gray-500 text-xs">{country}</div>
              </div>
              <p className="text-gray-600 text-xs font-medium mb-2">{name}</p>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: "#EEF3FF", color: SRM_BLUE }}>{focus}</span>
            </div>
          ))}
        </div>
        <div className="rounded-2xl p-8 text-center text-white" style={{ backgroundColor: SRM_BLUE }}>
          <h3 className="font-black text-xl mb-2">Semester Abroad Program (SAP)</h3>
          <p className="text-blue-200 text-sm mb-4 max-w-xl mx-auto">
            Spend a full semester at MIT, CMU, UC Davis, or NUS with 40–60% tuition coverage from Viji University. Open to all B.Tech students with CGPA 7.5+.
          </p>
          <button onClick={onToggleSap} className="font-bold px-6 py-2.5 rounded-xl text-sm transition-opacity hover:opacity-90" style={{ backgroundColor: SRM_GOLD, color: "#1a1a1a" }}>
            {sapOpen ? "Hide SAP Details ↑" : "Learn About SAP →"}
          </button>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CAMPUS LIFE GRID
// ─────────────────────────────────────────────────────────────────────────────
function CampusLifeSection({ activeCampusLifeSlug, onToggle }) {
  return (
    <section id="campus-life" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-xs font-bold tracking-widest uppercase block mb-2" style={{ color: SRM_GOLD }}>
            — Life on Campus —
          </span>
          <h2 className="text-4xl font-black mb-3" style={{ color: SRM_BLUE }}>Campus Life Grid</h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm">
            Housing blocks, dining towers, athletics, and lush green spaces — everything in one self-contained campus.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {CAMPUS_AMENITIES.map(({ slug, title, subtitle, desc, tags }) => {
            const isOpen = activeCampusLifeSlug === slug;
            return (
              <div key={slug} className="bg-gray-50 rounded-2xl p-8 border-2 transition-all duration-300" style={{ borderColor: isOpen ? SRM_BLUE : "#F3F4F6" }}>
                <h3 className="font-black text-gray-900 text-xl mb-1">{title}</h3>
                <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: SRM_GOLD }}>{subtitle}</p>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{desc}</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {tags.map(t => (
                    <span key={t} className="text-xs font-semibold bg-white text-gray-700 px-2.5 py-1 rounded-full border border-gray-200">{t}</span>
                  ))}
                </div>
                <button onClick={() => onToggle(slug)} className="text-sm font-bold transition-colors" style={{ color: SRM_BLUE }}>
                  {isOpen ? "Hide details ↑" : "Learn more →"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTACT & DIRECTORY
// ─────────────────────────────────────────────────────────────────────────────
function ContactSection() {
  const contactIcons = ["🎓", "🏠", "💼", "🌍", "🔬", "🚨"];
  return (
    <section id="contact" className="py-20" style={{ backgroundColor: "#F8F9FB" }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-xs font-bold tracking-widest uppercase block mb-2" style={{ color: SRM_GOLD }}>
            — Get In Touch —
          </span>
          <h2 className="text-4xl font-black mb-3" style={{ color: SRM_BLUE }}>
            Comprehensive Central Directory Hub
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm">
            Direct telephone lines and electronic mail routes for every department. All offices operate Monday–Saturday, 9 AM–5 PM IST.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {CONTACTS.map(({ dept, tel, email }, idx) => (
            <div key={dept} className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-blue-200 hover:shadow-md transition-all">
              <div className="text-3xl mb-3">{contactIcons[idx]}</div>
              <h3 className="font-bold text-gray-900 text-base mb-3">{dept}</h3>
              <div className="space-y-2">
                <a href={`tel:${tel}`} className="flex items-center gap-2 text-sm font-semibold hover:underline" style={{ color: SRM_BLUE }}>
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                  </svg>
                  {tel}
                </a>
                <a href={`mailto:${email}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors truncate">
                  <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  {email}
                </a>
              </div>
            </div>
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          <div className="rounded-2xl p-8 text-white flex flex-col justify-between" style={{ backgroundColor: SRM_BLUE }}>
            <div>
              <h3 className="font-black text-2xl mb-2">Chennai Main Campus</h3>
              <p className="text-blue-200 text-sm leading-relaxed mb-5">
                Viji Nagar, Chennai<br/>
                Chennai District<br/>
                Tamil Nadu – 600 001, India
              </p>
              <div className="space-y-2 text-sm text-blue-200">
                <div>Chennai Metro Rail / Local Station — 2-minute walk</div>
                <div>Chennai International Airport — 15 km</div>
                <div>Viji University Bus Services from Chennai city</div>
                <div>Toll-Free: 1800-102-1525</div>
              </div>
            </div>
            <div className="mt-6 pt-5 border-t border-blue-700">
              <div className="text-blue-300 text-xs">GPS Coordinates</div>
              <div className="text-white font-mono text-sm font-bold">13.0827° N, 80.2707° E</div>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl border-2 border-gray-200" style={{ minHeight: "320px" }}>
            <iframe
              title="Viji University Chennai Google Maps"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.3!2d80.2707!3d13.0827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5265ea560960d1%3A0x6f4e97f0b4f0f5d7!2sAnna%20Salai%2C%20Chennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000001"
              width="100%"
              height="100%"
              style={{ border: 0, display: "block", minHeight: "320px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────────────────────────
function Footer({ onSlug }) {
  const cols = [
    { heading: "Academics", items: [
      { label: "Undergraduate", slug: "academics-undergrad" },
      { label: "Postgraduate",  slug: "academics-postgrad"  },
      { label: "Ph.D. Programs",slug: "academics-phd"       },
      { label: "Syllabus",      slug: "academics-syllabus"  },
    ]},
    { heading: "Admissions", items: [
      { label: "Apply Now",     slug: "admissions-process"      },
      { label: "Fee Structure", slug: "admissions-fees"         },
      { label: "Scholarships",  slug: "admissions-scholarships" },
      { label: "International", slug: "admissions-international"},
    ]},
    { heading: "Quick Links", items: [
      { label: "Placements",    slug: "placements-stats"      },
      { label: "Research",      slug: "research-centers"      },
      { label: "Campus Life",   slug: "campus-facilities"     },
      { label: "Top Recruiters",slug: "placements-recruiters" },
    ]},
  ];
  return (
    <footer className="text-white pt-14 pb-8" style={{ backgroundColor: "#001D57" }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-10 mb-10">
          <div>
            <img src="/logo.png" alt="Viji University" className="h-14 object-contain mb-3" onError={e => { e.currentTarget.style.display = "none"; }} />
            <p className="text-blue-300 text-sm leading-relaxed">
              Viji Nagar, Chennai<br/>
              Tamil Nadu – 600 001, India<br/>
              1800-102-1525 (Toll-Free)
            </p>
          </div>
          {cols.map(({ heading, items }) => (
            <div key={heading}>
              <h4 className="font-bold text-sm mb-4 uppercase tracking-wider" style={{ color: SRM_GOLD }}>{heading}</h4>
              <ul className="space-y-2.5">
                {items.map(({ label, slug }) => (
                  <li key={slug}>
                    <button onClick={() => onSlug(slug)} className="text-blue-300 hover:text-white text-sm transition-colors text-left">
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-blue-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-blue-400 text-xs">
            © 2026 Viji University, Chennai. All rights reserved.
          </p>
          <a href="#hero" className="text-xs font-medium hover:underline" style={{ color: SRM_GOLD }}>↑ Back to top</a>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [activeAudience,       setActiveAudience]       = useState(null);
  const [activeSlug,           setActiveSlug]           = useState(null);
  const [sapOpen,               setSapOpen]              = useState(false);
  const [activeCampusLifeSlug,  setActiveCampusLifeSlug] = useState(null);
  const [activeProgramSlug,     setActiveProgramSlug]    = useState(null);
  const [activeResearchSlug,    setActiveResearchSlug]   = useState(null);
  const [ramanOpen,             setRamanOpen]            = useState(false);

  // Clear all non-nav panels when navbar slug is used
  const handleNavSlug = useCallback((slug) => {
    setActiveAudience(null);
    setSapOpen(false);
    setActiveCampusLifeSlug(null);
    setActiveProgramSlug(null);
    setActiveResearchSlug(null);
    setRamanOpen(false);
    setActiveSlug(prev => prev === slug ? null : slug);
    setTimeout(() => document.getElementById("topic-panel")?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  }, []);

  // Program tile toggle — decoupled from nav
  const handleProgramToggle = useCallback((slug) => {
    setActiveSlug(null);
    setActiveAudience(null);
    setSapOpen(false);
    setActiveCampusLifeSlug(null);
    setActiveResearchSlug(null);
    setRamanOpen(false);
    setActiveProgramSlug(prev => prev === slug ? null : slug);
  }, []);

  // Research tile toggle — decoupled from nav
  const handleResearchToggle = useCallback((slug) => {
    setActiveSlug(null);
    setActiveAudience(null);
    setSapOpen(false);
    setActiveCampusLifeSlug(null);
    setActiveProgramSlug(null);
    setRamanOpen(false);
    setActiveResearchSlug(prev => {
      const next = prev === slug ? null : slug;
      if (next) setTimeout(() => document.getElementById("research-detail-panel")?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
      return next;
    });
  }, []);

  // Raman block CTA toggle — decoupled from nav
  const handleRamanToggle = useCallback(() => {
    setActiveSlug(null);
    setActiveAudience(null);
    setSapOpen(false);
    setActiveCampusLifeSlug(null);
    setActiveProgramSlug(null);
    setActiveResearchSlug(null);
    setRamanOpen(prev => {
      const next = !prev;
      if (next) setTimeout(() => document.getElementById("raman-panel")?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
      return next;
    });
  }, []);

  const handleToggleSap = useCallback(() => {
    setActiveSlug(null);
    setActiveAudience(null);
    setActiveCampusLifeSlug(null);
    setActiveProgramSlug(null);
    setActiveResearchSlug(null);
    setRamanOpen(false);
    setSapOpen(prev => {
      const next = !prev;
      if (next) setTimeout(() => document.getElementById("sap-panel")?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
      return next;
    });
  }, []);

  const handleToggleCampusLife = useCallback((slug) => {
    setActiveSlug(null);
    setActiveAudience(null);
    setSapOpen(false);
    setActiveProgramSlug(null);
    setActiveResearchSlug(null);
    setRamanOpen(false);
    setActiveCampusLifeSlug(prev => {
      const next = prev === slug ? null : slug;
      if (next) setTimeout(() => document.getElementById("campus-life-panel")?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
      return next;
    });
  }, []);

  return (
    <div className="overflow-y-auto min-h-screen w-full flex flex-col font-sans">
      <ImagePreloader />

      <Navigation
        activeAudience={activeAudience}
        setActiveAudience={setActiveAudience}
        activeSlug={activeSlug}
        setActiveSlug={setActiveSlug}
        setSapOpen={setSapOpen}
        setCampusLifeSlug={setActiveCampusLifeSlug}
        setProgramSlug={setActiveProgramSlug}
        setResearchSlug={setActiveResearchSlug}
        setRamanOpen={setRamanOpen}
      />

      {/* Inline audience and navbar topic panels stay at the top */}
      <AudiencePanel activeAudience={activeAudience} />
      <TopicPanel    activeSlug={activeSlug} />

      {/* Landing page sections */}
      <HeroSection />

      <ProgramsSection
        activeProgramSlug={activeProgramSlug}
        onProgramToggle={handleProgramToggle}
      />

      <AccreditationsSection />
      <NewsSection />

      <ResearchSection
        activeResearchSlug={activeResearchSlug}
        onResearchToggle={handleResearchToggle}
        ramanOpen={ramanOpen}
        onRamanToggle={handleRamanToggle}
      />

      {/* Raman block panel sits directly below the Research section */}
      <RamanBlockPanel open={ramanOpen} />

      <GlobalSection sapOpen={sapOpen} onToggleSap={handleToggleSap} />
      <SapDetailPanel open={sapOpen} />

      <CampusLifeSection
        activeCampusLifeSlug={activeCampusLifeSlug}
        onToggle={handleToggleCampusLife}
      />
      <CampusLifeDetailPanel slug={activeCampusLifeSlug} />

      <ContactSection />
      <Footer onSlug={handleNavSlug} />
    </div>
  );
}
