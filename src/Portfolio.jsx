import React, { useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import './styles.css';

const skills = ['Python','SQL','Java','C++','JavaScript','React','Node.js','Pandas','NumPy','Scikit-learn','Machine Learning','Agentic AI','LangChain','LangGraph','CrewAI','Power BI','Tableau','Excel','Git'];

const experience = [
  { role:'Data Analyst', company:'Bee Skilled', date:'September 2026 — Present', text:'Applying Python, SQL and Excel to real-world data analysis projects in a collaborative, cross-functional environment.', tags:['Python','SQL','Excel'] },
  { role:'Machine Learning & AI Intern', company:'Skill Nexis', date:'September 2026 — Present', text:'Current internship focused on practical machine learning and AI work, building experience across models, data and applied development.', tags:['Machine Learning','AI','Python'] },
  { role:'Data Science Intern', company:'Yuva Intern by Henry Harvin', date:'June 2026 — July 2026', text:'Worked through the end-to-end data science workflow: acquisition, cleaning, preprocessing, EDA, hypothesis testing, visualization and machine-learning model evaluation.', tags:['Python','Pandas','NumPy','Scikit-learn'] },
  { role:'Data Analyst · AI Agent Project', company:'Zetheta Algorithms Private Limited', date:'August 2026 — September 2026', text:'Analyzed structured financial datasets for data-driven decision-making, built predictive models, and developed a Convexity Sensitivity AI Agent project.', tags:['Data Analytics','ML','AI Agents'] },
  { role:'AI/ML Developer Intern', company:'BroskiesHub', date:'September 2025 — November 2025', text:'Designed and implemented AI/ML solutions for product development, collaborated across teams, and integrated machine-learning models into software applications.', tags:['AI/ML','Software','Product'] },
  { role:'Software Engineering Simulation', company:'Wells Fargo · Forage', date:'June 2026', text:'Practiced feature development, coding standards and collaborative software delivery workflows in an enterprise banking technology simulation.', tags:['Software Engineering','Enterprise'] },
  { role:'Software Engineering Simulation', company:'Commonwealth Bank · Forage', date:'April 2026', text:'Extended a C#.NET backend with MongoDB, tested APIs with Postman, updated a React/Redux TypeScript frontend, added xUnit validation tests, and practiced Git workflows.', tags:['C#/.NET','MongoDB','React','TypeScript'] },
  { role:'Quantitative Research Simulation', company:'J.P. Morgan · Forage', date:'February 2026', text:'Applied statistical and quantitative techniques to financial datasets, built predictive models, and communicated data-driven insights.', tags:['Python','Statistics','Finance'] },
  { role:'Data & AI Simulations', company:'Tata Group · Deloitte · Forage', date:'August 2025 — October 2025', text:'Worked with business datasets, Generative AI and LLM workflows, statistical analysis, data wrangling, feature engineering and interactive dashboards using Tableau and Power BI.', tags:['GenAI','LLMs','Tableau','Power BI'] }
];

const projects = [
  {name:'Zetheta Convexity Sensitivity AI Agent', repo:'Zetheta-Internship-Project-1B', focus:'Data-analysis and machine-learning project built around a financial convexity-sensitivity use case.', stack:'Python · ML · Data Analytics'},
  {name:'EcoFinds', repo:'EcoFinds---Sustainable-Second-Hand-Marketplace', focus:'Full-stack marketplace concept for sustainable second-hand commerce.', stack:'Web · Product · Full Stack'},
  {name:'Credit Card Fraud Detection', repo:'Credit-Card-Fraud-Detection_Updated', focus:'Machine-learning project focused on identifying fraudulent transactions from financial data.', stack:'Python · ML · Data'},
  {name:'CIFAR-10 Image Classification', repo:'CIFAR10_Image_Classification_with_CNN', focus:'Computer-vision project using a CNN to classify images across the CIFAR-10 dataset.', stack:'Python · CNN · Deep Learning'},
  {name:'Internship Recommender', repo:'Internship_recommender', focus:'Recommendation-focused ML project for matching users with relevant internship opportunities.', stack:'Python · Recommendation'},
  {name:'Movie Recommendation System', repo:'movie-recommendation-system', focus:'Recommendation-system project exploring personalized movie suggestions.', stack:'Python · ML · Recommendation'},
  {name:'Hospital Management System', repo:'Hospital_Management_System', focus:'Software project centered on managing hospital records and operational workflows.', stack:'Java · Software'}
];

function Header(){
  return <header className="site-header">
    <a className="brand" href="#top"><span className="brand-mark">PM</span><span><strong>Pranav Mahajan</strong><small>AI/ML · Data · Software</small></span></a>
    <nav><a href="#experience">Experience</a><a href="#work">Projects</a><a href="#about">About</a><a href="#contact">Contact</a><a className="nav-cta" href="/Pranav_Mahajan_Resume.docx">Resume ↗</a></nav>
  </header>;
}

function SectionHeading({eyebrow,title,copy}){ return <div className="section-heading"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{copy&&<p>{copy}</p>}</div>; }

function AvatarStage(){
  const [tilt,setTilt]=useState({x:0,y:0});
  const move=e=>{const r=e.currentTarget.getBoundingClientRect();setTilt({x:((e.clientY-r.top)/r.height-.5)*-7,y:((e.clientX-r.left)/r.width-.5)*9});};
  return <div className="avatar-stage" onPointerMove={move} onPointerLeave={()=>setTilt({x:0,y:0})}>
    <div className="avatar-halo"/><div className="avatar-orbit orbit-a"/><div className="avatar-orbit orbit-b"/>
    <motion.div className="avatar-card" animate={{rotateX:tilt.x,rotateY:tilt.y,y:[0,-8,0]}} transition={{rotateX:{duration:.2},rotateY:{duration:.2},y:{duration:5,repeat:Infinity,ease:'easeInOut'}}}>
      <div className="avatar-glass">
        <div className="identity-avatar" aria-label="Interactive Pranav Mahajan avatar">
          <div className="identity-grid"/>
          <div className="identity-head"><span>PM</span></div>
          <div className="identity-ring ring-one"/><div className="identity-ring ring-two"/>
          <div className="identity-label"><span>PRANAV</span><strong>MAHAJAN</strong></div>
        </div>
      </div>
    </motion.div>
    <span className="avatar-tag tag-ai">AI / ML</span><span className="avatar-tag tag-data">DATA</span><span className="avatar-tag tag-build">BUILD</span>
    <div className="avatar-caption"><strong>Interactive profile</strong><span>Move around the card · explore the portfolio below</span></div>
  </div>;
}

function ExperienceCard({item,index}){ return <motion.article className="experience-card" initial={{opacity:0,y:22}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-60px'}} transition={{delay:index*.05,duration:.45}}><div className="experience-marker">{String(index+1).padStart(2,'0')}</div><div className="experience-main"><div className="experience-top"><span>{item.date}</span><span>{item.company}</span></div><h3>{item.role}</h3><p>{item.text}</p><div className="tag-row">{item.tags.map(t=><span key={t}>{t}</span>)}</div></div></motion.article>; }

function ProjectCard({project,index}){ const url=`https://github.com/pranav1237/${project.repo}`; return <motion.a className="project-card" href={url} target="_blank" rel="noreferrer" initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-60px'}} transition={{delay:index*.05,duration:.45}} whileHover={{y:-8}}><div className="project-topline"><span>0{index+1}</span><span>GitHub ↗</span></div><div><h3>{project.name}</h3><p>{project.focus}</p></div><div className="project-meta"><span>{project.stack}</span><span>View project</span></div></motion.a>; }

export default function Portfolio(){
  const {scrollYProgress}=useScroll(); const progress=useSpring(scrollYProgress,{stiffness:120,damping:30,restDelta:.001});
  return <div className="page" id="top"><motion.div className="scroll-progress" style={{scaleX:progress}}/><Header/>
    <main>
      <section className="hero">
        <div className="hero-copy">
          <div className="status-pill"><span/> Open to internships & meaningful projects</div>
          <p className="hero-kicker">AI / ML × DATA × SOFTWARE ENGINEERING</p>
          <h1>Pranav Mahajan — <em>building with purpose.</em></h1>
          <p className="hero-lede">Computer Science & Engineering student at Bennett University, focused on AI/ML, data analytics and software development. I build practical systems, analyze data for decisions, and explain the work clearly enough for a recruiter to understand the value.</p>
          <div className="hero-actions"><a className="button button-primary" href="#experience">See my experience ↓</a><a className="button button-ghost" href="#work">View projects ↗</a></div>
          <div className="hero-links"><a href="https://github.com/pranav1237" target="_blank" rel="noreferrer">GitHub ↗</a><a href="https://www.linkedin.com/in/pranav-mahajan-673283323" target="_blank" rel="noreferrer">LinkedIn ↗</a><span>Greater Delhi Area · India</span></div>
          <div className="recruiter-snapshot"><div><strong>AI / ML</strong><span>Model building & intelligent systems</span></div><div><strong>Data</strong><span>Analysis, visualization & insight</span></div><div><strong>Software</strong><span>Web apps & practical engineering</span></div></div>
        </div>
        <AvatarStage/>
      </section>

      <section className="intro-strip"><span>01 / RECRUITER SNAPSHOT</span><p>One page, one story: what I do, where I’ve worked, what I’ve built, and the technologies behind it.</p></section>

      <section className="experience-section" id="experience"><SectionHeading eyebrow="Experience" title="Where I’ve built real experience." copy="Current internships first, then hands-on internship projects and selected industry simulations — each with the work, tools and context visible at a glance."/><div className="experience-list">{experience.map((item,i)=><ExperienceCard item={item} index={i} key={item.role+item.company}/>)}</div></section>

      <section className="work-section" id="work"><SectionHeading eyebrow="Selected projects" title="Projects that show the work." copy="A focused selection from my GitHub, with the problem area and technical direction visible before you open the repository."/><div className="project-grid">{projects.map((p,i)=><ProjectCard project={p} index={i} key={p.name}/>)}</div><a className="text-link" href="https://github.com/pranav1237" target="_blank" rel="noreferrer">View all repositories on GitHub ↗</a></section>

      <section className="skills-section" id="skills"><SectionHeading eyebrow="Toolkit" title="Technologies I work with." copy="A practical mix across programming, data, machine learning, AI and product development."/><div className="skills-grid">{skills.map((s,i)=><motion.span className="skill" key={s} initial={{opacity:0,y:12}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-30px'}} transition={{delay:i*.02}} whileHover={{y:-4,rotateX:7}}>{s}</motion.span>)}</div></section>

      <section className="about-section" id="about"><SectionHeading eyebrow="About" title="A clear path from data to product."/><div className="about-layout"><div className="about-copy glass-card"><p className="big-copy">I’m interested in the space where data, AI and software engineering meet.</p><p>I’m pursuing a B.Tech in Computer Science & Engineering with an AI/ML specialization at Bennett University. My experience includes data analysis, machine learning, AI/ML development and software-oriented projects.</p><p>I care about explaining the work as clearly as I build it — what the problem is, what I did, which tools I used, and where the result fits.</p></div><div className="timeline"><div className="timeline-card"><span>EDUCATION</span><div className="timeline-item"><strong>Bennett University</strong><p>Bachelor of Technology — Computer Science & Engineering</p><small>2024 — Present · AI / ML</small></div><div className="timeline-item"><strong>Shiv Jyoti International School</strong><p>Class XII · Science (PCM)</p><small>April 2023 — May 2024</small></div></div><div className="timeline-card"><span>CERTIFICATION FOCUS</span><div className="timeline-item"><strong>Data & AI foundations</strong><p>Data science, statistics, data preparation, LLMs, RAG and prompt engineering.</p><small>Google · IBM · Anthropic learning ecosystem</small></div></div></div></div></section>

      <section className="contact-section" id="contact"><div className="contact-copy"><span className="eyebrow">Contact</span><h2>Have a role, project or idea? <em>Let’s talk.</em></h2><p>I’m currently open to internships and opportunities across software engineering, AI/ML and data analytics.</p><a className="email-link" href="mailto:pranavmahajan.4122005@gmail.com">pranavmahajan.4122005@gmail.com ↗</a></div><div className="contact-actions glass-card"><a className="button button-primary" href="mailto:pranavmahajan.4122005@gmail.com">Email me</a><a className="button button-ghost" href="https://www.linkedin.com/in/pranav-mahajan-673283323" target="_blank" rel="noreferrer">Connect on LinkedIn ↗</a><a className="button button-ghost" href="/Pranav_Mahajan_Resume.docx">Open resume ↗</a></div></section>
    </main>
    <footer><span>© {new Date().getFullYear()} Pranav Mahajan</span><span>React · Vite · Framer Motion</span><a href="#top">Back to top ↑</a></footer>
  </div>;
}
