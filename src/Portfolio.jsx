import React, { useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import './styles.css';

const portrait = '/WhatsApp%20Image%202026-11-21%20at%2012.17.19.jpeg';
const skills = ['Python','SQL','Java','C++','JavaScript','React','Node.js','Pandas','NumPy','Scikit-learn','Machine Learning','Agentic AI','LangChain','LangGraph','CrewAI','Power BI','Tableau','Excel','Git'];
const roles = [
  ['Data Analyst','Bee Skilled','Sep 2026 — Present','Applying Python, SQL and Excel to real-world data analysis work.',['Python','SQL','Excel']],
  ['Machine Learning & AI Intern','Skill Nexis','Sep 2026 — Present','Building practical experience across machine learning, AI workflows and applied development.',['ML','AI','Python']],
  ['Data Analyst · AI Agent Project','Zetheta Algorithms','Aug 2026 — Sep 2026','Analyzed financial datasets, built predictive models and worked on a Convexity Sensitivity AI Agent.',['Analytics','ML','AI Agents']],
  ['Data Science Intern','Yuva Intern by Henry Harvin','Jun 2026 — Jul 2026','Worked across data cleaning, EDA, hypothesis testing, visualization and model evaluation.',['Pandas','NumPy','Scikit-learn']],
  ['AI/ML Developer Intern','BroskiesHub','Sep 2025 — Nov 2025','Designed and integrated AI/ML solutions into software applications.',['AI/ML','Software','Product']]
];
const projects = [
  ['Convexity Sensitivity AI Agent','Zetheta-Internship-Project-1B','AI AGENT','Financial data, machine learning and agentic workflows.'],
  ['EcoFinds','EcoFinds---Sustainable-Second-Hand-Marketplace','FULL STACK','A sustainable second-hand marketplace concept.'],
  ['Credit Card Fraud Detection','Credit-Card-Fraud-Detection_Updated','ML SYSTEM','Fraud detection using financial transaction data.'],
  ['CIFAR-10 CNN','CIFAR10_Image_Classification_with_CNN','COMPUTER VISION','CNN image classification across CIFAR-10.'],
  ['Internship Recommender','Internship_recommender','RECOMMENDER','Matching users with relevant opportunities.'],
  ['Movie Recommendation System','movie-recommendation-system','RECOMMENDER','A personalized movie recommendation workflow.']
];
const filters = ['ALL','AI','ML','FULL STACK','RECOMMENDER'];

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

export default function Portfolio() {
  const { scrollYProgress } = useScroll();
  const scale = useSpring(scrollYProgress, { stiffness: 140, damping: 28 });
  const [filter, setFilter] = useState('ALL');
  const [light, setLight] = useState(false);
  const visibleProjects = projects.filter(p => filter === 'ALL' || (filter === 'AI' ? p[2].includes('AI') : filter === 'ML' ? p[2].includes('ML') || p[2].includes('VISION') : p[2] === filter));

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
        <div className="roles">{roles.map((r,i)=><motion.article className="role" key={r[1]} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * .07 }}><small>0{i+1}</small><div><label>{r[2]}　·　{r[1]}</label><h3>{r[0]}</h3><p>{r[3]}</p><div className="tags">{r[4].map(t=><span key={t}>{t}</span>)}</div></div><b aria-hidden="true">↗</b></motion.article>)}</div>
      </Reveal>

      <Reveal id="projects" className="section">
        <header><span>03 / SELECTED WORK</span><h2>Proof over<br/><em>promises.</em></h2><p>A selection of machine learning, AI, recommendation and full-stack projects.</p></header>
        <div className="filters" role="group" aria-label="Filter projects">{filters.map(x=><button aria-pressed={filter===x} className={filter===x?'active':''} onClick={()=>setFilter(x)} key={x}>{x}</button>)}</div>
        <div className="project-count">{String(visibleProjects.length).padStart(2,'0')} PROJECTS / {filter}</div>
        <motion.div layout className="projects"><AnimatePresence mode="popLayout">{visibleProjects.map((p,i)=><motion.a layout initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: .25 }} whileHover={{ y: -5 }} className="project" key={p[0]} href={'https://github.com/pranav1237/'+p[1]} target="_blank" rel="noreferrer"><div className="project-top"><span>0{i+1} / PROJECT</span><b>↗</b></div><label>{p[2]}</label><h3>{p[0]}</h3><p>{p[3]}</p><footer>VIEW REPOSITORY <span>↗</span></footer></motion.a>)}</AnimatePresence></motion.div>
        <a className="all-link" href="https://github.com/pranav1237" target="_blank" rel="noreferrer">ALL REPOSITORIES ↗</a>
      </Reveal>

      <Reveal id="stack" className="section"><header><span>04 / TOOLKIT</span><h2>Tools for<br/><em>the curious.</em></h2></header><div className="skills">{skills.map(s=><span key={s}>{s}</span>)}</div></Reveal>

      <Reveal id="about" className="section about"><header><span>05 / ABOUT</span><h2>A little context.</h2></header><div><h3>B.Tech · Computer Science & Engineering</h3><p>Bennett University · 2024 — Present · AI / ML</p><hr/><h3>Shiv Jyoti International School</h3><p>Class XII · Science (PCM) · 2023 — 2024</p></div></Reveal>

      <Reveal id="contact" className="contact"><div><span>06 / CONTACT</span><h2>Let’s make<br/><em>something matter.</em></h2><p>Open to internships and project opportunities across software engineering, AI/ML and data analytics.</p></div><div className="contact-links"><a href="mailto:pranavmahajan.4122005@gmail.com">EMAIL ME <span>↗</span></a><a href="https://www.linkedin.com/in/pranav-mahajan-673283323" target="_blank" rel="noreferrer">LINKEDIN <span>↗</span></a><a href="https://github.com/pranav1237" target="_blank" rel="noreferrer">GITHUB <span>↗</span></a><a href="/Pranav_Mahajan_Resume.docx">RESUME <span>↗</span></a></div></Reveal>
    </main>
    <footer className="site-footer"><span>© {new Date().getFullYear()} PRANAV MAHAJAN</span><a href="#top">BACK TO TOP ↑</a></footer>
  </div>;
}