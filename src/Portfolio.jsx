import React, { useMemo, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import './styles.css';

const skills=['Python','SQL','Java','C++','JavaScript','React','Node.js','Pandas','NumPy','Scikit-learn','Machine Learning','Agentic AI','LangChain','LangGraph','CrewAI','Power BI','Tableau','Excel','Git'];
const experience=[
 {role:'Data Analyst',company:'Bee Skilled',date:'Sep 2026 — Present',text:'Applying Python, SQL and Excel to real-world data analysis work in a collaborative, cross-functional environment.',tags:['Python','SQL','Excel'],tone:'lime'},
 {role:'Machine Learning & AI Intern',company:'Skill Nexis',date:'Sep 2026 — Present',text:'Building practical experience across machine learning, AI workflows, data and applied development.',tags:['ML','AI','Python'],tone:'violet'},
 {role:'Data Analyst · AI Agent Project',company:'Zetheta Algorithms',date:'Aug 2026 — Sep 2026',text:'Analyzed structured financial datasets, built predictive models, and worked on a Convexity Sensitivity AI Agent project.',tags:['Analytics','ML','AI Agents'],tone:'cyan'},
 {role:'Data Science Intern',company:'Yuva Intern by Henry Harvin',date:'Jun 2026 — Jul 2026',text:'Worked across data acquisition, cleaning, EDA, hypothesis testing, visualization and model evaluation using Python.',tags:['Pandas','NumPy','Scikit-learn'],tone:'pink'},
 {role:'AI/ML Developer Intern',company:'BroskiesHub',date:'Sep 2025 — Nov 2025',text:'Designed and integrated AI/ML solutions into software applications inside a startup environment.',tags:['AI/ML','Software','Product'],tone:'lime'}
];
const projects=[
 {name:'Convexity Sensitivity AI Agent',repo:'Zetheta-Internship-Project-1B',label:'AI AGENT',copy:'Financial data + ML + agentic workflow.'},
 {name:'EcoFinds',repo:'EcoFinds---Sustainable-Second-Hand-Marketplace',label:'FULL STACK',copy:'A sustainable second-hand marketplace concept.'},
 {name:'Credit Card Fraud Detection',repo:'Credit-Card-Fraud-Detection_Updated',label:'ML SYSTEM',copy:'Fraud detection using financial transaction data.'},
 {name:'CIFAR-10 CNN',repo:'CIFAR10_Image_Classification_with_CNN',label:'COMPUTER VISION',copy:'CNN image classification across CIFAR-10.'},
 {name:'Internship Recommender',repo:'Internship_recommender',label:'RECOMMENDER',copy:'Matching users with relevant opportunities.'},
 {name:'Movie Recommendation System',repo:'movie-recommendation-system',label:'RECOMMENDER',copy:'Personalized movie recommendation workflow.'}
];

function Header(){return <header className="site-header"><a className="brand" href="#top"><span className="brand-mark">PM</span><span><strong>Pranav Mahajan</strong><small>AI/ML × DATA × SOFTWARE</small></span></a><nav><a href="#experience">Experience</a><a href="#work">Projects</a><a href="#stack">Stack</a><a href="#contact">Contact</a><a className="nav-cta" href="/Pranav_Mahajan_Resume.docx">Resume ↗</a></nav></header>}

function AvatarStage(){
  const [pulse,setPulse]=useState(false);
  const [tilt,setTilt]=useState({x:0,y:0});
  const move=e=>{
    const r=e.currentTarget.getBoundingClientRect();
    const px=(e.clientX-r.left)/r.width-.5, py=(e.clientY-r.top)/r.height-.5;
    setTilt({x:py*-6,y:px*8});
  };
  return <div className={"avatar-stage "+(pulse?'is-pulsed':'')} onPointerMove={move} onPointerLeave={()=>setTilt({x:0,y:0})}>
    <div className="avatar-backdrop"/>
    <div className="avatar-gridlines"/>
    <div className="avatar-photo-wrap" style={{transform:`perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(0)`}}>
      <img className="avatar-media" src="/avatar-standing.webp" alt="Pranav Mahajan standing avatar"/>
      <div className="avatar-vignette"/>
      <div className="avatar-floor-glow"/>
    </div>
    <div className="avatar-ui">
      <button type="button" onClick={()=>setPulse(v=>!v)} className="avatar-button">{pulse?'RESET AVATAR':'INTERACT WITH AVATAR'} <span>↗</span></button>
      <div className="avatar-status"><b>01</b><span>LIVE STANCE</span><i/></div>
    </div>
    <div className="avatar-label label-a">MOVE / TILT</div>
    <div className="avatar-label label-b">REAL-TIME PARALLAX</div>
    <div className="avatar-corner">PM-01 / INTERACTIVE PORTRAIT</div>
  </div>
}

function SectionHeading({kicker,title,copy}){return <div className="section-heading"><span>{kicker}</span><h2>{title}</h2>{copy&&<p>{copy}</p>}</div>}
function ExperienceCard({item,index}){return <motion.article className={'experience-card '+item.tone} initial={{opacity:0,y:22}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-70px'}} transition={{duration:.5,delay:index*.04}}><div className="exp-index">{String(index+1).padStart(2,'0')}</div><div className="exp-body"><div className="exp-meta"><span>{item.date}</span><span>{item.company}</span></div><h3>{item.role}</h3><p>{item.text}</p><div className="tag-row">{item.tags.map(t=><span key={t}>{t}</span>)}</div></div></motion.article>}
function ProjectCard({project,index}){const url='https://github.com/pranav1237/'+project.repo;return <motion.a className="project-card" href={url} target="_blank" rel="noreferrer" initial={{opacity:0,y:22}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-60px'}} transition={{duration:.5,delay:index*.03}} whileHover={{y:-8,rotateX:2,rotateY:index%2?1:-1}}><div className="project-number">0{index+1}</div><span className="project-label">{project.label}</span><div className="project-copy"><h3>{project.name}</h3><p>{project.copy}</p></div><div className="project-foot"><span>GitHub ↗</span><span>Open repo</span></div></motion.a>}
function Ticker(){const loop=useMemo(()=>[...skills,...skills],[]);return <div className="ticker">{loop.map((s,i)=><span key={i}>{s}<b>✦</b></span>)}</div>}

export default function Portfolio(){
  const {scrollYProgress}=useScroll();
  const progress=useSpring(scrollYProgress,{stiffness:150,damping:28});
  const heroY=useTransform(progress,[0,.22],[0,-30]);
  return <div className="page" id="top">
    <motion.div className="scroll-progress" style={{scaleX:progress}}/>
    <Header/>
    <main>
      <section className="hero">
        <motion.div className="hero-copy" style={{y:heroY}}>
          <div className="hero-eyebrow"><span/> PRANAV MAHAJAN <b>OPEN TO OPPORTUNITIES</b></div>
          <p className="hero-kicker">AI / ML × DATA × SOFTWARE ENGINEERING</p>
          <h1>Built to be <em>clicked.</em></h1>
          <p className="hero-lede">Computer Science & Engineering student at Bennett University, working across AI/ML, data analytics and software. Explore the avatar, the work and the experience — everything is one scroll away.</p>
          <div className="hero-actions"><a className="button button-primary" href="#work">See the work <span>↘</span></a><a className="button button-ghost" href="#experience">See experience <span>↘</span></a></div>
          <div className="hero-proof"><span>Greater Delhi Area · India</span><span>Python · SQL · Agentic AI</span><span>Open to internships</span></div>
        </motion.div>
        <AvatarStage/>
        <div className="hero-side-note">SCROLL ↘</div>
      </section>
      <section className="ticker-section"><Ticker/></section>
      <section className="bento">
        <div className="bento-main"><span>WHAT I DO</span><h2>Data in. <em>Systems out.</em></h2><p>Analytics, AI and frontend engineering — with a bias toward work that ships and is easy to understand.</p></div>
        <div className="bento-tile"><strong>01</strong><b>AI / ML</b><span>Models · agents · workflows</span></div>
        <div className="bento-tile violet"><strong>02</strong><b>DATA</b><span>Analysis · dashboards · insight</span></div>
        <div className="bento-tile cyan"><strong>03</strong><b>SOFTWARE</b><span>Web · product · engineering</span></div>
      </section>
      <section className="experience-section" id="experience"><SectionHeading kicker="01 / EXPERIENCE" title="Where I’ve been putting the skills to work." copy="Current internships first, then the strongest applied roles from the profile so a recruiter can scan the story fast."/><div className="experience-list">{experience.map((item,i)=><ExperienceCard key={item.company+item.role} item={item} index={i}/>)}</div></section>
      <section className="work-section" id="work"><SectionHeading kicker="02 / PROJECTS" title="Proof over promises." copy="A focused selection of ML, AI, recommendation and full-stack work from GitHub."/><div className="project-grid">{projects.map((p,i)=><ProjectCard key={p.name} project={p} index={i}/>)}</div><a className="outline-link" href="https://github.com/pranav1237" target="_blank" rel="noreferrer">See all GitHub repositories ↗</a></section>
      <section className="stack-section" id="stack"><SectionHeading kicker="03 / STACK" title="The toolkit behind the build." copy="The frontend uses React, Framer Motion and a lightweight CSS 3D interaction layer built around the standing avatar."/><div className="stack-wrap"><div className="stack-core"><span>R3F</span><b>REACT</b><b>THREE.JS</b><small>DREI · MOTION</small></div><div className="stack-pills">{skills.map((s,i)=><motion.span key={s} whileHover={{y:-5,rotate:i%2?1:-1}} initial={{opacity:0,scale:.94}} whileInView={{opacity:1,scale:1}} viewport={{once:true}} transition={{delay:i*.02}}>{s}</motion.span>)}</div></div></section>
      <section className="about-section" id="about"><SectionHeading kicker="04 / ABOUT" title="A clear path from data to product."/><div className="about-grid"><div className="about-main"><p className="about-big">B.Tech CSE (AI/ML) at Bennett University. Curious about systems, serious about shipping.</p><p>My current work spans data analysis, machine learning, AI/ML development and software-oriented projects. I like building technically interesting work that people can actually use.</p></div><div className="about-panel"><span>EDUCATION</span><strong>Bennett University</strong><p>Bachelor of Technology — Computer Science & Engineering</p><small>2024 — Present · AI / ML</small><hr/><strong>Shiv Jyoti International School</strong><p>Class XII · Science (PCM)</p><small>2023 — 2024</small></div></div></section>
      <section className="contact-section" id="contact"><div><span className="contact-kicker">05 / CONTACT</span><h2>Let’s make something <em>worth opening.</em></h2><p>Open to internships and project opportunities across software engineering, AI/ML and data analytics.</p></div><div className="contact-actions"><a className="button button-primary" href="mailto:pranavmahajan.4122005@gmail.com">Email me ↗</a><a className="button button-ghost" href="https://www.linkedin.com/in/pranav-mahajan-673283323" target="_blank" rel="noreferrer">LinkedIn ↗</a><a className="button button-ghost" href="/Pranav_Mahajan_Resume.docx">Resume ↗</a></div></section>
    </main>
    <footer><span>© {new Date().getFullYear()} Pranav Mahajan</span><span>React · Framer Motion · CSS 3D</span><a href="#top">Back to top ↑</a></footer>
  </div>
}
