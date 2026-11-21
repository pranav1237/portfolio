import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import './styles.css';

const portrait = '/WhatsApp%20Image%202026-11-21%20at%2012.17.19.jpeg';
const skills = ['Python','SQL','Java','C++','JavaScript','React','Node.js','Pandas','NumPy','Scikit-learn','Machine Learning','Agentic AI','LangChain','LangGraph','CrewAI','Power BI','Tableau','Excel','Git'];
const roles = [
  { title: 'Data Analyst', company: 'Bee Skilled', start: '2026-09', end: null, description: 'Applying Python, SQL and Excel to real-world data analysis work.', tags: ['Python','SQL','Excel'] },
  { title: 'Machine Learning & AI Intern', company: 'Skill Nexis', start: '2026-09', end: null, description: 'Building practical experience across machine learning, AI workflows and applied development.', tags: ['ML','AI','Python'] },
  { title: 'Data Analyst · AI Agent Project', company: 'Zetheta Algorithms', start: '2026-08', end: '2026-09', description: 'Analyzed financial datasets, built predictive models and worked on a Convexity Sensitivity AI Agent.', tags: ['Analytics','ML','AI Agents'] },
  { title: 'Data Science Intern', company: 'Yuva Intern by Henry Harvin', start: '2026-06', end: '2026-07', description: 'Worked across data cleaning, EDA, hypothesis testing, visualization and model evaluation.', tags: ['Pandas','NumPy','Scikit-learn'] },
  { title: 'AI/ML Developer Intern', company: 'BroskiesHub', start: '2025-09', end: '2025-11', description: 'Designed and integrated AI/ML solutions into software applications.', tags: ['AI/ML','Software','Product'] }
];
const certificates = []; // Add verified credentials here; no certificates have been supplied yet.
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
  const links = ['Experience','Projects','Stack','About','Contact'];
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

function Reveal({ children, className = '', id }) {
  return <motion.section id={id} className={className} initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.section>;
}

function LinkedInConnection() {
  const [connection, setConnection] = useState({ loading: true, connected: false, profile: null });
  const [busy, setBusy] = useState(false);

  const refresh = async () => {
    try {
      const response = await fetch('/api/linkedin/profile', { credentials: 'same-origin' });
      const data = await response.json();
      setConnection({ loading: false, connected: Boolean(data.connected), profile: data.profile || null });
    } catch {
      setConnection({ loading: false, connected: false, profile: null });
    }
  };

  useEffect(() => {
    refresh();
    const params = new URLSearchParams(window.location.search);
    if (params.has('linkedin')) {
      params.delete('linkedin');
      params.delete('reason');
      const query = params.toString();
      window.history.replaceState({}, '', window.location.pathname + (query ? '?' + query : '') + window.location.hash);
    }
  }, []);

  const disconnect = async () => {
    setBusy(true);
    try {
      await fetch('/api/linkedin/disconnect', { method: 'POST', credentials: 'same-origin' });
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  return <div className="linkedin-card">
    <div><span className="eyebrow-mini">LINKEDIN / PROFILE CONNECTION</span><h3>{connection.connected ? 'LinkedIn connected.' : 'Connect your LinkedIn.'}</h3>
      <p>{connection.connected ? `Authenticated as ${connection.profile?.name || 'your LinkedIn account'}. Basic profile data is available to this browser session.` : 'Securely connect your account to verify your basic profile details. This does not grant access to your posts or employment history.'}</p>
    </div>
    {connection.connected
      ? <button className="linkedin-action" disabled={busy} onClick={disconnect}>{busy ? 'DISCONNECTING…' : 'DISCONNECT'}</button>
      : <a className="linkedin-action" href="/api/linkedin/login">{connection.loading ? 'CHECKING…' : 'CONNECT LINKEDIN ↗'}</a>}
  </div>;
}

export default function Portfolio() {
  const { scrollYProgress } = useScroll();
  const scale = useSpring(scrollYProgress, { stiffness: 140, damping: 28 });
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
        <motion.div className="hero-copy" initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
          <span className="eyebrow"><i className="status-dot" /> PRANAV MAHAJAN <i>OPEN TO OPPORTUNITIES</i></span>
          <small className="kicker">AI / ML × DATA × SOFTWARE ENGINEERING</small>
          <h1>Curious mind.<br/><em>Clear intent.</em></h1>
          <p>Computer Science & Engineering student at Bennett University, exploring AI/ML, data analytics and software. I like building technically interesting work that people can actually use.</p>
          <div className="actions"><a className="primary" href="#projects">Explore my work <span>↘</span></a><a className="secondary" href="#contact">Get in touch <span>↗</span></a></div>
          <div className="meta">GREATER DELHI AREA · INDIA　 /　 PYTHON · SQL · AGENTIC AI</div>
        </motion.div>
        <motion.div className="portrait" initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: .15 }}>
          <img src={portrait} alt="Portrait of Pranav Mahajan" fetchPriority="high"/>
          <span>PORTRAIT / 001</span><small>COMPUTER SCIENCE & ENGINEERING</small>
          <div className="portrait-mark">PM<span>— 01</span></div>
        </motion.div>
      </section>

      <div className="ticker" aria-label="Technology toolkit">{[...skills,...skills].map((s,i)=><span key={i}>{s}　✳　</span>)}</div>

      <Reveal className="intro"><span>01 / APPROACH</span><div><h2>Data in.<br/><em>Systems out.</em></h2><p>Analytics, AI and frontend engineering — with a bias toward useful work, clear thinking and thoughtful execution.</p></div></Reveal>

      <Reveal id="experience" className="section">
        <header><span>02 / EXPERIENCE</span><h2>Putting skills<br/><em>to work.</em></h2><p>A snapshot of internships and applied experience.</p></header>
        <div className="roles">{roles.map((r,i)=><motion.article className="role" key={r.company} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * .07 }}><small>0{i+1}</small><div><label>{roleDate(r)}　·　{r.company} <span className={roleIsCurrent(r) ? 'role-status current' : 'role-status'}>{roleIsCurrent(r) ? 'CURRENT' : 'COMPLETED'}</span></label><h3>{r.title}</h3><p>{r.description}</p><div className="tags">{r.tags.map(t=><span key={t}>{t}</span>)}</div></div><b aria-hidden="true">↗</b></motion.article>)}</div>
      </Reveal>

      <Reveal id="projects" className="section">
        <header><span>03 / SELECTED WORK</span><h2>Proof over<br/><em>promises.</em></h2><p>A selection of machine learning, AI, recommendation and full-stack projects.</p></header>
        <div className="project-toolbar"><div className="filters" role="group" aria-label="Filter projects">{filters.map(x=><button aria-pressed={filter===x} className={filter===x?'active':''} onClick={()=>setFilter(x)} key={x}>{x}</button>)}</div><button className="sync-button" onClick={syncProjects} disabled={projectsLoading}>{projectsLoading ? 'SYNCING…' : '↻ REFRESH'}</button></div>
        <div className="project-count">{String(visibleProjects.length).padStart(2,'0')} PROJECTS / {liveProjects.length ? 'LIVE FROM GITHUB' : 'FEATURED PROJECTS'}{projectsUpdatedAt && <span> · SYNCED {formatUpdated(projectsUpdatedAt)}</span>}</div>
        {projectsError && <p className="sync-note">Live GitHub sync is temporarily unavailable. Showing the featured project list instead.</p>}
        {projectsLoading && !liveProjects.length && <p className="sync-note">Connecting to GitHub and loading your latest repositories…</p>}
        <motion.div layout className="projects"><AnimatePresence mode="popLayout">{visibleProjects.map((p,i)=><motion.a layout initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: .25 }} whileHover={{ y: -5 }} className="project" key={p.id} href={p.url} target="_blank" rel="noreferrer"><div className="project-top"><span>{String(i+1).padStart(2,'0')} / {p.language || 'PROJECT'}</span><b>↗</b></div><label>{categoryFor(p)}</label><h3>{p.title}</h3><p>{p.description}</p><footer><span>{p.stars !== null && p.stars !== undefined ? '★ ' + p.stars + ' STARS' : 'VIEW SOURCE'}</span><span>{p.updatedAt ? 'UPDATED ' + formatUpdated(p.updatedAt) : 'VIEW REPOSITORY'} ↗</span></footer></motion.a>)}</AnimatePresence></motion.div>
        <a className="all-link" href="https://github.com/pranav1237" target="_blank" rel="noreferrer">ALL REPOSITORIES ↗</a>
      </Reveal>

      <Reveal id="stack" className="section"><header><span>04 / TOOLKIT</span><h2>Tools for<br/><em>the curious.</em></h2></header><div className="skills">{skills.map(s=><span key={s}>{s}</span>)}</div></Reveal>

      <Reveal id="about" className="section about"><header><span>05 / ABOUT</span><h2>A little context.</h2></header><div><h3>B.Tech · Computer Science & Engineering</h3><p>Bennett University · 2024 — Present · AI / ML</p><hr/><h3>Shiv Jyoti International School</h3><p>Class XII · Science (PCM) · 2023 — 2024</p><LinkedInConnection /></div></Reveal>

      <Reveal id="certificates" className="section"><header><span>06 / CERTIFICATIONS</span><h2>Proof of<br/><em>curiosity.</em></h2><p>Verified learning, credentials and milestones.</p></header>
        {certificates.length ? <div className="certificate-grid">{certificates.map((certificate,i)=><article className="certificate" key={certificate.id || certificate.name}><span>0{i+1} / CREDENTIAL</span><h3>{certificate.name}</h3><p>{certificate.issuer} · {certificate.date}</p>{certificate.credentialUrl && <a href={certificate.credentialUrl} target="_blank" rel="noreferrer">VERIFY CREDENTIAL ↗</a>}{certificate.image && <a href={certificate.image} target="_blank" rel="noreferrer">VIEW CERTIFICATE ↗</a>}</article>)}</div> : <div className="certificate-empty"><span>YOUR NEXT MILESTONE</span><h3>Credentials coming soon.</h3><p>Your certificate gallery is ready. Add verified certificate details and images to the certificates data in <code>src/Portfolio.jsx</code> to publish them here. No credentials have been invented or added.</p><a href="mailto:pranavmahajan.4122005@gmail.com?subject=Portfolio%20certificates">SHARE CERTIFICATES ↗</a></div>}
      </Reveal>

      <Reveal id="contact" className="contact"><div><span>07 / CONTACT</span><h2>Let’s make<br/><em>something matter.</em></h2><p>Open to internships and project opportunities across software engineering, AI/ML and data analytics.</p></div><div className="contact-links"><a href="mailto:pranavmahajan.4122005@gmail.com">EMAIL ME <span>↗</span></a><a href="https://www.linkedin.com/in/pranav-mahajan-673283323" target="_blank" rel="noreferrer">LINKEDIN <span>↗</span></a><a href="https://github.com/pranav1237" target="_blank" rel="noreferrer">GITHUB <span>↗</span></a><a href="/Pranav_Mahajan_Resume.docx">RESUME <span>↗</span></a></div></Reveal>
    </main>
    <footer className="site-footer"><span>© {new Date().getFullYear()} PRANAV MAHAJAN</span><a href="#top">BACK TO TOP ↑</a></footer>
  </div>;
}