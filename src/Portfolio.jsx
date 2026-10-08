import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import './styles.css';

const skills = ['Python', 'Java', 'JavaScript', 'React', 'Node.js', 'SQL', 'Firebase', 'AI / ML', 'C++', 'Pandas', 'NumPy', 'Git'];

const education = [
  { title: 'B.Tech Software Engineering', school: 'Bennett University', meta: 'AI & ML · 2024 — ongoing' },
  { title: 'CBSE Board', school: '12th Class (2024) · 10th Class (2022)', meta: '' }
];

const experience = [
  { title: 'AI / ML Developer', place: 'Broskies Hub', meta: 'Internship' },
  { title: 'Full-Stack Development', place: 'Academic & personal projects', meta: 'Project experience' }
];

function Background() {
  return (
    <div className="scene" aria-hidden="true">
      <div className="noise" />
      <div className="grid-plane" />
      <div className="aurora aurora-one" />
      <div className="aurora aurora-two" />
      <div className="orbital orbital-one"><span /></div>
      <div className="orbital orbital-two"><span /></div>
    </div>
  );
}

function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <a className="brand" href="#top" aria-label="Pranav Mahajan home">
        <span className="brand-mark">PM</span>
        <span>
          <strong>Pranav Mahajan</strong>
          <small>Software Engineer · AI/ML</small>
        </span>
      </a>
      <nav className="nav" aria-label="Primary navigation">
        <a href="#work">Work</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
        <a className="nav-cta" href="/Pranav_Mahajan_Resume.docx">Resume ↗</a>
      </nav>
    </header>
  );
}

function SectionHeading({ eyebrow, title, copy }) {
  return (
    <div className="section-heading">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {copy && <p>{copy}</p>}
    </div>
  );
}

function Skill({ name, index }) {
  return (
    <motion.span
      className="skill"
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.025, duration: 0.35 }}
      whileHover={{ y: -4, rotateX: 8 }}
    >
      {name}
    </motion.span>
  );
}

function ProjectCard({ repo, index }) {
  return (
    <motion.a
      className="project-card"
      href={repo.html_url}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delay: index * 0.06, duration: 0.55 }}
      whileHover={{ y: -10, rotateX: 2, rotateY: index % 2 ? -1 : 1 }}
    >
      <div className="project-topline">
        <span className="project-index">0{index + 1}</span>
        <span className="project-arrow">↗</span>
      </div>
      <h3>{repo.name.replace(/[-_]/g, ' ')}</h3>
      <p>{repo.description || 'A project exploring software, data, and intelligent systems.'}</p>
      <div className="project-meta">
        <span>{repo.language || 'Software'}</span>
        <span>★ {repo.stargazers_count}</span>
      </div>
    </motion.a>
  );
}

function ContactForm() {
  const [sent, setSent] = useState(false);

  const submit = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = form.get('email');
    const message = form.get('message');
    window.location.href = `mailto:pranavmahajan.4122005@gmail.com?subject=Portfolio%20enquiry&body=${encodeURIComponent(`From: ${email}\n\n${message}`)}`;
    setSent(true);
  };

  return (
    <form className="contact-form glass-card" onSubmit={submit}>
      <label>
        Email
        <input name="email" type="email" placeholder="you@company.com" required />
      </label>
      <label>
        Message
        <textarea name="message" rows="5" placeholder="Tell me what you're building..." required />
      </label>
      <button className="button button-primary" type="submit">{sent ? 'Opening email…' : 'Start a conversation →'}</button>
    </form>
  );
}

export default function Portfolio() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    fetch('https://api.github.com/users/pranav1237/repos?sort=updated&per_page=8')
      .then((response) => response.ok ? response.json() : [])
      .then((data) => setRepos(Array.isArray(data) ? data : []))
      .catch(() => setRepos([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page" id="top">
      <motion.div className="scroll-progress" style={{ scaleX: progress }} />
      <Background />
      <Header />

      <main>
        <section className="hero">
          <div className="hero-copy">
            <div className="status-pill"><span /> Available for meaningful projects</div>
            <p className="hero-kicker">SOFTWARE ENGINEERING × INTELLIGENT SYSTEMS</p>
            <h1>Building digital experiences with <em>depth.</em></h1>
            <p className="hero-lede">
              I'm Pranav — a software engineering student focused on AI/ML and full-stack development.
              I turn ambitious ideas into clean, useful products.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#work">Explore my work <span>↓</span></a>
              <a className="button button-ghost" href="mailto:pranavmahajan.4122005@gmail.com">Let's talk ↗</a>
            </div>
            <div className="hero-links">
              <a href="https://github.com/pranav1237" target="_blank" rel="noreferrer">GitHub ↗</a>
              <a href="https://www.linkedin.com/in/pranav-mahajan-673283323" target="_blank" rel="noreferrer">LinkedIn ↗</a>
              <span>Greater Noida · India</span>
            </div>
          </div>

          <motion.div className="hero-object" initial={{ opacity: 0, scale: .82, rotate: -8 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}>
            <div className="object-shadow" />
            <div className="cube">
              <div className="cube-face face-front">PM<span>01</span></div>
              <div className="cube-face face-right">AI<span>02</span></div>
              <div className="cube-face face-top">WEB<span>03</span></div>
            </div>
            <div className="orbit orbit-a" />
            <div className="orbit orbit-b" />
            <span className="floating-label label-one">REACT</span>
            <span className="floating-label label-two">ML</span>
            <span className="floating-label label-three">BUILD</span>
          </motion.div>
        </section>

        <section className="intro-strip">
          <span>01 / SELECTED CAPABILITIES</span>
          <p>From interfaces to intelligent systems, I care about the details that make technology feel effortless.</p>
        </section>

        <section className="skills-section" id="skills">
          <SectionHeading eyebrow="Capabilities" title="A practical stack, built to ship." copy="Tools I use to move from an idea to a working product." />
          <div className="skills-grid">{skills.map((skill, i) => <Skill key={skill} name={skill} index={i} />)}</div>
        </section>

        <section className="work-section" id="work">
          <SectionHeading eyebrow="Selected work" title="Projects with a point of view." copy="Live from my GitHub — the work evolves as I keep learning." />
          {loading ? (
            <div className="loading-grid">{[1, 2, 3].map((n) => <div className="skeleton" key={n} />)}</div>
          ) : repos.length ? (
            <div className="project-grid">{repos.map((repo, i) => <ProjectCard key={repo.id} repo={repo} index={i} />)}</div>
          ) : (
            <div className="empty-state">Projects are temporarily unavailable. <a href="https://github.com/pranav1237" target="_blank" rel="noreferrer">Open GitHub ↗</a></div>
          )}
          <a className="text-link" href="https://github.com/pranav1237" target="_blank" rel="noreferrer">View all projects on GitHub <span>↗</span></a>
        </section>

        <section className="about-section" id="about">
          <SectionHeading eyebrow="About me" title="Curious by default. Precise by choice." />
          <div className="about-layout">
            <div className="about-copy glass-card">
              <p className="big-copy">I like building things that are technically thoughtful and genuinely easy to use.</p>
              <p>I'm pursuing a B.Tech in Software Engineering at Bennett University with a specialization in Artificial Intelligence & Machine Learning. My work spans full-stack applications, data, and machine learning.</p>
              <p>Outside the code, I'm driven by experimentation — finding a better interaction, a cleaner architecture, or a more useful way to solve a real problem.</p>
            </div>
            <div className="timeline">
              <div className="timeline-card"><span>EDUCATION</span>{education.map((item) => <div className="timeline-item" key={item.title}><strong>{item.title}</strong><p>{item.school}</p><small>{item.meta}</small></div>)}</div>
              <div className="timeline-card"><span>EXPERIENCE</span>{experience.map((item) => <div className="timeline-item" key={item.title}><strong>{item.title}</strong><p>{item.place}</p><small>{item.meta}</small></div>)}</div>
            </div>
          </div>
        </section>

        <section className="contact-section" id="contact">
          <div className="contact-copy">
            <span className="eyebrow">Have an idea?</span>
            <h2>Let's make something <em>worth remembering.</em></h2>
            <p>Open to internships, collaborations, product ideas, and conversations about AI, software, and the web.</p>
            <a className="email-link" href="mailto:pranavmahajan.4122005@gmail.com">pranavmahajan.4122005@gmail.com ↗</a>
          </div>
          <ContactForm />
        </section>
      </main>

      <footer>
        <span>© {new Date().getFullYear()} Pranav Mahajan</span>
        <span>Designed & built with React · Vite</span>
        <a href="#top">Back to top ↑</a>
      </footer>
    </div>
  );
}
