import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import './styles.css';

const portrait = '/WhatsApp%20Image%202026-11-21%20at%2012.17.19.jpeg';
const skills = ['Python','SQL','Java','C++','JavaScript','React','Node.js','Pandas','NumPy','Scikit-learn','Machine Learning','Agentic AI','LangChain','LangGraph','CrewAI','Power BI','Tableau','Excel','Git'];
const roles = [
  { title: 'AI Developer Intern', company: 'NEXVORA', start: '2026-11', end: null, description: 'Working on applied AI development as an intern, contributing to practical product and engineering work.', tags: ['AI','Python','Development'] },
  { title: 'Agentic AI Role', company: 'Zetheta Algorithms Private Limited', start: '2026-11', end: null, description: 'Designing production-grade autonomous and multi-agent AI systems for financial services use cases, including investment research, regulatory compliance, customer service and portfolio management.', tags: ['Agentic AI','LLMs','Multi-agent systems'] },
  { title: 'Student · B.Tech Computer Science & Engineering (AI/ML)', company: 'Bennett University', start: '2024-08', end: null, description: 'Pursuing a B.Tech in Computer Science and Engineering with an AI/ML specialization; actively building projects and developing practical engineering skills.', tags: ['AI/ML','Computer Science','Engineering'] },
  { title: 'Data Analyst', company: 'Bee Skilled', start: '2026-09', end: '2026-11', description: 'Applied Python, SQL and Excel to real-world data analysis projects in a collaborative, cross-functional environment.', tags: ['Python','SQL','Excel'] },
  { title: 'Machine Learning & AI Intern', company: 'Skill Nexis', start: '2026-09', end: '2026-11', description: 'Completed an internship focused on practical machine learning and AI development.', tags: ['Machine Learning','AI','Python'] },
  { title: 'AI Pioneers Intern · Machine Learning', company: 'Yuva Intern by Henry Harvin', start: '2026-07', end: '2026-10', description: 'Completed a machine learning internship in the AI Pioneers program.', tags: ['Machine Learning','AI','Python'] },
  { title: 'Data Science with Python Apprentice Intern', company: 'Yuva Intern by Henry Harvin', start: '2026-06', end: '2026-07', description: 'Completed hands-on work across data acquisition, cleaning, preprocessing, exploratory data analysis, hypothesis testing, visualization and predictive model development. Used Scikit-learn, Matplotlib and Seaborn to evaluate models and communicate findings.', tags: ['Python','Pandas','NumPy','Scikit-learn','EDA'] },
  { title: 'Data Analyst · Convexity Sensitivity AI Agent', company: 'Zetheta Algorithms Private Limited', start: '2026-09', end: '2026-09', description: 'Built a project combining machine learning and data analysis: Convexity Sensitivity AI Agent.', tags: ['Data Analysis','Machine Learning','AI Agents'], link: 'https://github.com/pranav1237/Zetheta-Internship-Project-1B' },
  { title: 'Data Analyst', company: 'Zetheta Algorithms Private Limited', start: '2026-08', end: '2026-09', description: 'Analyzed structured financial datasets related to securitization and built and tested predictive models using training and test data splits to evaluate performance.', tags: ['Financial Analytics','Python','Predictive Modeling'] },
  { title: 'Software Engineering Job Simulation', company: 'Wells Fargo · Forage', start: '2026-06', end: '2026-06', description: 'Completed a software engineering simulation, practicing feature development, coding standards and collaborative software delivery workflows in an enterprise banking context.', tags: ['Software Engineering','Development'] },
  { title: 'Software Engineer at a Startup · Job Simulation', company: 'Y Combinator · Forage', start: '2026-06', end: '2026-06', description: 'Simulated startup engineering work by prioritizing features, writing production-oriented code and adapting to changing requirements.', tags: ['Software Engineering','Startups'] },
  { title: 'Operations Job Simulation', company: 'Goldman Sachs · Forage', start: '2026-05', end: '2026-05', description: 'Practiced trade lifecycle management, fund services workflows and reconciliation tasks in a financial services context.', tags: ['Operations','Financial Services'] },
  { title: 'Software Engineering Job Simulation', company: 'Commonwealth Bank · Forage', start: '2026-04', end: '2026-04', description: 'Extended a C#/.NET backend with MongoDB, tested APIs using Postman, updated a React/Redux TypeScript frontend, added xUnit tests and practiced Git/GitHub branching and pull requests.', tags: ['C#/.NET','MongoDB','React','TypeScript','Postman'] },
  { title: 'Quantitative Research Job Simulation', company: 'J.P. Morgan · Forage', start: '2026-02', end: '2026-02', description: 'Applied statistical and quantitative techniques to financial datasets, built predictive models and communicated data-driven insights.', tags: ['Quantitative Research','Statistics','Finance'] },
  { title: 'Program Specialist · Job Simulation', company: 'J.P. Morgan · Forage', start: '2025-11', end: '2025-12', description: 'Completed a structured program covering software engineering best practices and financial technology concepts; built and tested interfaces for internal data visualization tools in a simulated trading environment.', tags: ['Software Engineering','FinTech','Data Visualization'] },
  { title: 'Data Analyst · Job Simulation', company: 'Tata Group · Forage', start: '2025-09', end: '2025-10', description: 'Explored generative AI and large language models for business data analysis, analyzed datasets with Python and developed AI-assisted business insight reports using prompt engineering.', tags: ['Generative AI','LLMs','Python','Pandas'] },
  { title: 'Data Specialist · Job Simulation', company: 'Deloitte · Forage', start: '2025-08', end: '2025-09', description: 'Performed statistical analysis and data-driven decision-making on business datasets; built dashboards and visualizations with Tableau and Power BI and practiced data wrangling and feature engineering.', tags: ['Data Analytics','Tableau','Power BI','Statistics'] },
  { title: 'AI/ML Developer Intern', company: 'BroskiesHub', start: '2025-09', end: '2025-11', description: 'Designed and implemented AI/ML solutions for product development, collaborated with cross-functional teams to integrate models into software applications and contributed to workflow and risk-management improvements.', tags: ['AI/ML','Model Integration','Teamwork'] }
];
const certificates = [
  { id: 'foundations-data-science', name: 'Foundations of Data Science', issuer: 'Issuer not specified on LinkedIn', date: 'Date not specified', category: 'DATA SCIENCE' },
  { id: 'data-fundamentals', name: 'Data Fundamentals', issuer: 'Issuer not specified on LinkedIn', date: 'Date not specified', category: 'DATA' },
  { id: 'prepare-data-exploration', name: 'Prepare Data for Exploration', issuer: 'Issuer not specified on LinkedIn', date: 'Date not specified', category: 'DATA ANALYTICS' },
  { id: 'introduction-statistics', name: 'Introduction to Statistics', issuer: 'Issuer not specified on LinkedIn', date: 'Date not specified', category: 'STATISTICS' },
  { id: 'analyze-data-answer-questions', name: 'Analyze Data to Answer Questions', issuer: 'Issuer not specified on LinkedIn', date: 'Date not specified', category: 'DATA ANALYTICS' }
];
const formatMonth = value => new Date(value + '-01T00:00:00').toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
const roleIsCurrent = role => !role.end || new Date(role.end + '-01T00:00:00') > new Date(new Date().getFullYear(), new Date().getMonth(), 1);
const roleDate = role => `${formatMonth(role.start)} — ${roleIsCurrent(role) ? 'Present' : formatMonth(role.end)}`;
const projects = [
  ['Convexity Sensitivity AI Agent','Zetheta-Internship-Project-1B','AI AGENT','Financial data, machine learning and agentic workflows.'],
  ['EcoFinds','EcoFinds---Sustainable-Second-Hand-Marketplace','FULL STACK','A sustainable second-hand marketplace concept.'],
  ['Credit Card Fraud Detection','Credit-Card-Fraud-Detection_Updated','ML SYSTEM','Fraud detection using financial transaction data.'],
  ['CIFAR-10 CNN','CIFAR10_Image_Classification_with_CNN','COMPUTER VISION','CNN image classification across CIFAR-10.'],
  ['Internship Recommender','Internship_recommender','RECOMMENDER','Matching users with relevant opportunities.'],
  ['Movie Recommendation System','movie-recommendation-system','RECOMMENDER','A personalized movie recommendation workflow.']
];
const filters = ['ALL','AI','ML','FULL STACK','RECOMMENDER'];
const categoryFor = repo => { const words = [repo.language, ...(repo.topics || []), repo.name].join(' ').toLowerCase(); if (/agent|llm|langchain|ai/.test(words)) return 'AI'; if (/machine|learning|model|cnn|classification|fraud|data science/.test(words)) return 'ML'; if (/recommend/.test(words)) return 'RECOMMENDER'; if (/react|javascript|typescript|web|marketplace|full.?stack/.test(words)) return 'FULL STACK'; return (repo.language || 'SOFTWARE').toUpperCase(); };
const formatUpdated = value => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

function Header({ light, setLight }) {
  const [open, setOpen] = useState(false);
  const links = ['Experience','Projects','Stack','About','Certificates','Contact'];
  return <header className="header">
    <a className="brand" href="#top" aria-label="Pranav Mahajan home">
      <b>PM</b><span>PRANAV MAHAJAN<small>AI/ML × DATA × SOFTWARE</small></span>
    </a>
    <button className="menu" aria-expanded={open} aria-label="Toggle navigation" onClick={() => setOpen(!open)}>{open ? 'CLOSE −' : 'MENU +'}</button>
    <nav className={open ? 'open' : ''} aria-label="Main navigation">
      {links.map(x => <a onClick={() => setOpen(false)} href={'#' + x.toLowerCase()} key={x}>{x}</a>)}
      <button onClick={() => setLight(!light)} className="theme" aria-label="Toggle color theme">{light ? 'DARK' : 'LIGHT'} MODE <span>↗</span></button>
    </nav>
  </header>;
}

function useSafeReveal() {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(reduceMotion === true);

  useEffect(() => {
    if (reduceMotion) {
      setVisible(true);
      return;
    }
    const node = ref.current;
    if (!node || typeof window === 'undefined' || typeof window.IntersectionObserver !== 'function') {
      setVisible(true);
      return;
    }

    let observer;
    const fallback = window.setTimeout(() => setVisible(true), 4000);
    try {
      observer = new window.IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
          window.clearTimeout(fallback);
        }
      }, { threshold: 0, rootMargin: '0px 0px -4% 0px' });
      observer.observe(node);
    } catch {
      window.clearTimeout(fallback);
      setVisible(true);
    }

    return () => {
      observer?.disconnect();
      window.clearTimeout(fallback);
    };
  }, [reduceMotion]);

  return { ref, visible, reduceMotion };
}

function Reveal({ children, className = '', id }) {
  const { ref, visible, reduceMotion } = useSafeReveal();
  return <motion.section ref={ref} id={id} className={className} initial={reduceMotion ? false : { opacity: 0, y: 26 }} animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }} transition={{ duration: reduceMotion ? 0 : 0.65, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.section>;
}

function RevealItem({ children, className = '', delay = 0 }) {
  const { ref, visible, reduceMotion } = useSafeReveal();
  return <motion.article ref={ref} className={className} initial={reduceMotion ? false : { opacity: 0, y: 15 }} animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }} transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : delay }}>{children}</motion.article>;
}

function LinkedInConnection() {
  return <div className="linkedin-card">
    <div><span className="eyebrow-mini">LINKEDIN / PUBLIC PROFILE</span><h3>Find me on LinkedIn.</h3>
      <p>Visit my LinkedIn profile to see my professional background, experience and updates.</p>
      <a className="linkedin-action" href="https://www.linkedin.com/in/pranav-mahajan-673283323/" target="_blank" rel="noopener noreferrer">VIEW LINKEDIN PROFILE ↗</a>
    </div>
  </div>;
}

export default function Portfolio() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const springScale = useSpring(scrollYProgress, { stiffness: shouldReduceMotion ? 10000 : 140, damping: shouldReduceMotion ? 1000 : 28 });
  const scale = shouldReduceMotion ? scrollYProgress : springScale;
  const [filter, setFilter] = useState('ALL');
  const [light, setLight] = useState(false);
  const [liveProjects, setLiveProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState(false);
  const [projectsUpdatedAt, setProjectsUpdatedAt] = useState(null);
  const syncProjects = async () => {
    try {
      const response = await fetch('/api/github/repos', { headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error('GitHub sync unavailable');
      const data = await response.json();
      setLiveProjects(Array.isArray(data.items) ? data.items : []);
      setProjectsUpdatedAt(data.updatedAt || new Date().toISOString());
      setProjectsError(false);
    } catch {
      setProjectsError(true);
    } finally {
      setProjectsLoading(false);
    }
  };
  useEffect(() => {
    syncProjects();
    const refresh = window.setInterval(syncProjects, 5 * 60 * 1000);
    return () => window.clearInterval(refresh);
  }, []);
  const projectItems = liveProjects.length ? liveProjects : projects.map(p => ({ id: p[1], title: p[0], name: p[1], language: p[2], topics: [p[2].toLowerCase()], description: p[3], url: 'https://github.com/pranav1237/' + p[1], stars: null, forks: null, updatedAt: null }));
  const visibleProjects = projectItems.filter(p => filter === 'ALL' || categoryFor(p) === filter);

  return <div className={light ? 'page light-theme' : 'page'} id="top">
    <motion.div className="progress" style={{ scaleX: scale }} />
    <Header light={light} setLight={setLight} />
    <main>
      <section className="hero">
        <motion.div className="hero-copy" initial={shouldReduceMotion ? false : { opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: shouldReduceMotion ? 0 : 0.8 }}>
          <span className="eyebrow"><i className="status-dot" /> PRANAV MAHAJAN <i>OPEN TO OPPORTUNITIES</i></span>
          <small className="kicker">AI / ML × DATA × SOFTWARE ENGINEERING</small>
          <h1>Curious mind.<br/><em>Clear intent.</em></h1>
          <p>Computer Science & Engineering student at Bennett University, exploring AI/ML, data analytics and software. I like building technically interesting work that people can actually use.</p>
          <div className="actions"><a className="primary" href="#projects">Explore my work <span>↘</span></a><a className="secondary" href="#contact">Get in touch <span>↗</span></a></div>
          <div className="meta">GREATER DELHI AREA · INDIA　 /　 PYTHON · SQL · AGENTIC AI</div>
        </motion.div>
        <motion.div className="portrait" initial={shouldReduceMotion ? false : { opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: shouldReduceMotion ? 0 : 1, delay: shouldReduceMotion ? 0 : .15 }}>
          <img src={portrait} alt="Portrait of Pranav Mahajan" fetchPriority="high"/>
          <span>PORTRAIT / 001</span><small>COMPUTER SCIENCE & ENGINEERING</small>
          <div className="portrait-mark">PM<span>— 01</span></div>
        </motion.div>
      </section>

      <div className="ticker" aria-label="Technology toolkit">{[...skills,...skills].map((s,i)=><span key={i}>{s}　✳　</span>)}</div>

      <Reveal className="intro"><span>01 / APPROACH</span><div><h2>Data in.<br/><em>Systems out.</em></h2><p>Analytics, AI and frontend engineering — with a bias toward useful work, clear thinking and thoughtful execution.</p></div></Reveal>

      <Reveal id="experience" className="section">
        <header><span>02 / EXPERIENCE</span><h2>Putting skills<br/><em>to work.</em></h2><p>A snapshot of internships and applied experience.</p></header>
        <div className="roles">{roles.map((r,i)=><RevealItem className="role" key={`${r.company}-${r.title}-${r.start}`} delay={i * .07}><small>0{i+1}</small><div><label>{roleDate(r)}　·　{r.company} <span className={roleIsCurrent(r) ? 'role-status current' : 'role-status'}>{roleIsCurrent(r) ? 'CURRENT' : 'COMPLETED'}</span></label><h3>{r.title}</h3><p>{r.description}</p><div className="tags">{r.tags.map(t=><span key={t}>{t}</span>)}</div></div><b aria-hidden="true">↗</b></RevealItem>)}</div>
      </Reveal>

      <Reveal id="projects" className="section">
        <header><span>03 / SELECTED WORK</span><h2>Proof over<br/><em>promises.</em></h2><p>A selection of machine learning, AI, recommendation and full-stack projects.</p></header>
        <div className="project-toolbar"><div className="filters" role="group" aria-label="Filter projects">{filters.map(x=><button aria-pressed={filter===x} className={filter===x?'active':''} onClick={()=>setFilter(x)} key={x}>{x}</button>)}</div><button className="sync-button" onClick={syncProjects} disabled={projectsLoading}>{projectsLoading ? 'SYNCING…' : '↻ REFRESH'}</button></div>
        <div className="project-count">{String(visibleProjects.length).padStart(2,'0')} PROJECTS / {liveProjects.length ? 'LIVE FROM GITHUB' : 'FEATURED PROJECTS'}{projectsUpdatedAt && <span> · SYNCED {formatUpdated(projectsUpdatedAt)}</span>}</div>
        {projectsError && <p className="sync-note">Live GitHub sync is temporarily unavailable. Showing the featured project list instead.</p>}
        {projectsLoading && !liveProjects.length && <p className="sync-note">Connecting to GitHub and loading your latest repositories…</p>}
        <motion.div layout={!shouldReduceMotion} className="projects"><AnimatePresence mode="popLayout">{visibleProjects.map((p,i)=><motion.a layout={!shouldReduceMotion} initial={shouldReduceMotion ? false : { opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={shouldReduceMotion ? undefined : { opacity: 0, y: -10 }} transition={{ duration: shouldReduceMotion ? 0 : .25 }} whileHover={shouldReduceMotion ? undefined : { y: -5 }} className="project" key={p.id} href={p.url} target="_blank" rel="noreferrer"><div className="project-top"><span>{String(i+1).padStart(2,'0')} / {p.language || 'PROJECT'}</span><b>↗</b></div><label>{categoryFor(p)}</label><h3>{p.title}</h3><p>{p.description}</p><footer><span>{p.stars !== null && p.stars !== undefined ? '★ ' + p.stars + ' STARS' : 'VIEW SOURCE'}</span><span>{p.updatedAt ? 'UPDATED ' + formatUpdated(p.updatedAt) : 'VIEW REPOSITORY'} ↗</span></footer></motion.a>)}</AnimatePresence></motion.div>
        <a className="all-link" href="https://github.com/pranav1237" target="_blank" rel="noreferrer">ALL REPOSITORIES ↗</a>
      </Reveal>

      <Reveal id="stack" className="section"><header><span>04 / TOOLKIT</span><h2>Tools for<br/><em>the curious.</em></h2></header><div className="skills">{skills.map(s=><span key={s}>{s}</span>)}</div></Reveal>

      <Reveal id="about" className="section about"><header><span>05 / ABOUT</span><h2>A little context.</h2></header><div><h3>B.Tech · Computer Science & Engineering</h3><p>Bennett University · 2024 — Present · AI / ML</p><hr/><h3>Shiv Jyoti International School</h3><p>Class XII · Science (PCM) · 2023 — 2024</p><LinkedInConnection /></div></Reveal>

      <Reveal id="certificates" className="section"><header><span>06 / CERTIFICATIONS</span><h2>Proof of<br/><em>curiosity.</em></h2><p>Verified learning, credentials and milestones.</p></header>
        {certificates.length ? <div className="certificate-grid">{certificates.map((certificate,i)=><article className={`certificate${i === 2 ? " certificate-featured" : ""}`} key={certificate.id || certificate.name}><span>{String(i+1).padStart(2, "0")} / {certificate.category || 'CERTIFICATE'}</span><h3>{certificate.name}</h3><p>{certificate.issuer} · {certificate.date}</p>{certificate.credentialUrl && <a href={certificate.credentialUrl} target="_blank" rel="noreferrer">VERIFY CREDENTIAL ↗</a>}{certificate.image && <a href={certificate.image} target="_blank" rel="noreferrer">VIEW CERTIFICATE ↗</a>}</article>)}</div> : <div className="certificate-empty"><span>LEARNING & CREDENTIALS</span><h3>More certificates on the way.</h3><p>These five certificate titles are listed on your LinkedIn profile. Issuers, dates and verification links were not included in the profile text you shared, so they are intentionally left unverified.</p></div>}
      </Reveal>

      <Reveal id="contact" className="contact"><div><span>07 / CONTACT</span><h2>Let’s make<br/><em>something matter.</em></h2><p>Open to internships and project opportunities across software engineering, AI/ML and data analytics.</p></div><div className="contact-links"><a href="mailto:pranavmahajan.4122005@gmail.com">EMAIL ME <span>↗</span></a><a href="https://www.linkedin.com/in/pranav-mahajan-673283323/" target="_blank" rel="noreferrer">LINKEDIN <span>↗</span></a><a href="https://github.com/pranav1237" target="_blank" rel="noreferrer">GITHUB <span>↗</span></a><a href="/Pranav_Mahajan_Resume.docx">RESUME <span>↗</span></a></div></Reveal>
    </main>
    <footer className="site-footer"><span>© {new Date().getFullYear()} PRANAV MAHAJAN</span><a href="#top">BACK TO TOP ↑</a></footer>
  </div>;
}