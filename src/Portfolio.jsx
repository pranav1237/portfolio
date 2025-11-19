import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { auth, signInWithGoogle, signInWithGitHub, signOutUser } from './firebase';
import './styles.css';

// Animated background elements
function AnimatedBg() {
	return (
		<div className="animated-bg">
			<motion.div className="orb orb-1" animate={{ y: [0, -20, 0] }} transition={{ duration: 8, repeat: Infinity }} />
			<motion.div className="orb orb-2" animate={{ y: [0, 20, 0] }} transition={{ duration: 10, repeat: Infinity, delay: 1 }} />
			<motion.div className="orb orb-3" animate={{ y: [0, -15, 0] }} transition={{ duration: 12, repeat: Infinity, delay: 2 }} />
		</div>
	);
}

function Header({ user }) {
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => setScrolled(window.scrollY > 50);
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	return (
		<motion.header className={`site-header ${scrolled ? 'scrolled' : ''}`} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
			<div className="brand">
				<motion.div whileHover={{ scale: 1.05 }}>
					<h1>✨ Pranav Mahajan</h1>
					<p>Full‑Stack Developer | AI/ML Specialist | Web Developer</p>
				</motion.div>
			</div>
			<div className="auth">
				{user ? (
					<motion.div className="user" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
						<img src={user.photoURL} alt={user.displayName} className="avatar" />
						<div className="user-info">
							<div>{user.displayName}</div>
							<button onClick={signOutUser} className="btn small">Sign out</button>
						</div>
					</motion.div>
				) : (
					<motion.div className="auth-buttons" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
						<button onClick={signInWithGoogle} className="btn google">
							<span>🔐</span> Google
						</button>
						<button onClick={signInWithGitHub} className="btn github">
							<span>🐙</span> GitHub
						</button>
					</motion.div>
				)}
			</div>
		</motion.header>
	);
}

function RepoCard({ repo, index }) {
	return (
		<motion.a
			href={repo.html_url}
			target="_blank"
			rel="noreferrer"
			className="repo"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: index * 0.1 }}
			whileHover={{ scale: 1.05, y: -5 }}
			whileTap={{ scale: 0.95 }}
		>
			<div className="repo-header">
				<h3>{repo.name}</h3>
				<span className="lang-badge">{repo.language || 'Unknown'}</span>
			</div>
			<p>{repo.description || 'No description'}</p>
			<div className="repo-footer">
				<span>⭐ {repo.stargazers_count}</span>
				<span>🍴 {repo.forks_count}</span>
			</div>
		</motion.a>
	);
}

function SkillBadge({ skill, index }) {
	return (
		<motion.div
			className="skill-badge"
			initial={{ opacity: 0, scale: 0 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ delay: index * 0.05 }}
			whileHover={{ scale: 1.1, rotate: 5 }}
		>
			{skill}
		</motion.div>
	);
}

function ContactForm() {
	const [email, setEmail] = useState('');
	const [message, setMessage] = useState('');
	const [sent, setSent] = useState(false);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (email && message) {
			console.log('Message:', { email, message });
			setSent(true);
			setEmail('');
			setMessage('');
			setTimeout(() => setSent(false), 3000);
		}
	};

	return (
		<motion.form onSubmit={handleSubmit} className="contact-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
			<input type="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
			<textarea placeholder="Your message" value={message} onChange={(e) => setMessage(e.target.value)} rows={4} required />
			<motion.button type="submit" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn primary">
				{sent ? '✅ Message Sent!' : '📬 Send Message'}
			</motion.button>
		</motion.form>
	);
}

export default function Portfolio() {
	const [repos, setRepos] = useState([]);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsub = auth.onAuthStateChanged(u => setUser(u));

		fetch('https://api.github.com/users/pranav1237/repos?sort=updated&per_page=12')
			.then(r => r.json())
			.then(data => {
				if (Array.isArray(data)) setRepos(data);
			})
			.catch(() => {})
			.finally(() => setLoading(false));

		return () => unsub();
	}, []);

	const skills = ['Python', 'Java', 'JavaScript', 'React', 'Node.js', 'SQL', 'Firebase', 'ML/AI', 'C++', 'Pandas', 'NumPy', 'Git'];
	const education = [
		{ title: 'B.Tech Software Engineering', school: 'Bennett University', year: '2024–ongoing', spec: 'AI & ML' },
		{ title: 'CBSE Board', school: '12th Class (2024) | 10th Class (2022)', year: '', spec: '' }
	];

	return (
		<div className="page">
			<AnimatedBg />
			<Header user={user} />

			<main>
				{/* Hero Section */}
				<motion.section className="hero" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
					<div className="hero-content">
						<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
							<h2>👋 Hello, I'm Pranav</h2>
							<p className="subtitle">
								B.Tech Software Engineering student specializing in AI/ML. I build scalable web applications, 
								machine learning models, and innovative solutions that solve real-world problems.
							</p>
						</motion.div>

						<motion.div className="cta-buttons" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
							<motion.a href="https://www.linkedin.com/in/pranav-mahajan-673283323" target="_blank" className="btn primary" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
								🔗 LinkedIn
							</motion.a>
							<motion.a href="https://github.com/pranav1237" target="_blank" className="btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
								🐙 GitHub
							</motion.a>
							<motion.a href="/Pranav_Mahajan_Resume.docx" className="btn outline" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
								📄 Resume
							</motion.a>
							<motion.a href="mailto:pranavmahajan.4122005@gmail.com" className="btn outline" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
								✉️ Email
							</motion.a>
						</motion.div>

						<motion.div className="hero-canvas" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 60, ease: 'linear' }} />
					</div>
				</motion.section>

				{/* Skills Section */}
				<motion.section className="skills-section" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
					<h2>🛠️ Technical Skills</h2>
					<div className="skills-grid">
						{skills.map((skill, idx) => <SkillBadge key={skill} skill={skill} index={idx} />)}
					</div>
				</motion.section>

				{/* Projects Section */}
				<motion.section className="projects" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
					<h2>🚀 Featured Projects</h2>
					{loading ? (
						<motion.p animate={{ opacity: [0.5, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
							Loading projects…
						</motion.p>
					) : (
						<div className="grid">
							{repos.map((repo, idx) => <RepoCard key={repo.id} repo={repo} index={idx} />)}
						</div>
					)}
					<motion.div className="see-more" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
						<a href="https://github.com/pranav1237" target="_blank" className="btn primary">
							View All Projects on GitHub →
						</a>
					</motion.div>
				</motion.section>

				{/* About Section */}
				<motion.section className="about" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
					<h2>📚 About Me</h2>
					<div className="about-content">
						<div className="about-text">
							<p>
								I'm a passionate developer driven by innovation and problem-solving. With a strong foundation in 
								full-stack development and AI/ML, I create solutions that are both scalable and user-friendly.
							</p>
							<p>
								Currently pursuing my B.Tech in Software Engineering at Bennett University with a specialization in 
								Artificial Intelligence & Machine Learning. I've worked on diverse projects ranging from web applications 
								to machine learning models.
							</p>
						</div>

						<div className="about-grid">
							<div className="about-card">
								<h3>🎓 Education</h3>
								{education.map((edu, idx) => (
									<div key={idx} className="edu-item">
										<strong>{edu.title}</strong>
										<div>{edu.school}</div>
										{edu.spec && <div className="spec">{edu.spec}</div>}
									</div>
								))}
							</div>

							<div className="about-card">
								<h3>💼 Experience</h3>
								<div className="exp-item">
									<strong>AI/ML Developer</strong>
									<div>Broskies Hub</div>
									<div className="muted">Internship</div>
								</div>
								<div className="exp-item">
									<strong>Full-Stack Development</strong>
									<div>Multiple Projects</div>
									<div className="muted">Academic & Personal</div>
								</div>
							</div>

							<div className="about-card">
								<h3>⭐ Key Achievements</h3>
								<ul className="achievements">
									<li>🏆 Participated in hackathons & competitions</li>
									<li>🤖 Built ML models for fraud detection</li>
									<li>🌐 Full-stack web applications</li>
									<li>📊 Data analysis & visualization</li>
								</ul>
							</div>
						</div>
					</div>
				</motion.section>

				{/* Contact Section */}
				<motion.section className="contact" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
					<h2>💬 Get In Touch</h2>
					<div className="contact-container">
						<div className="contact-info">
							<h3>Let's Connect!</h3>
							<p>Interested in collaborating or have questions? Feel free to reach out!</p>
							<div className="contact-links">
								<a href="mailto:pranavmahajan.4122005@gmail.com" className="contact-link">
									<span>📧</span> pranavmahajan.4122005@gmail.com
								</a>
								<a href="https://www.linkedin.com/in/pranav-mahajan-673283323" target="_blank" className="contact-link">
									<span>🔗</span> LinkedIn Profile
								</a>
								<a href="https://github.com/pranav1237" target="_blank" className="contact-link">
									<span>🐙</span> GitHub Profile
								</a>
								<div className="contact-link">
									<span>📱</span> +91 7742091902
								</div>
								<div className="contact-link">
									<span>📍</span> Greater Noida, India
								</div>
							</div>
						</div>
						<ContactForm />
					</div>
				</motion.section>

				{/* CTA Section */}
				<motion.section className="cta-final" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
					<h2>Ready to Start a Project?</h2>
					<p>Let's build something amazing together!</p>
					<motion.a href="mailto:pranavmahajan.4122005@gmail.com" className="btn primary large" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
						💌 Contact Me Today
					</motion.a>
				</motion.section>
			</main>

			{/* Footer */}
			<footer>
				<motion.div className="footer-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
					<div>
						<h4>Pranav Mahajan</h4>
						<p>Full-Stack Developer | AI/ML Enthusiast</p>
					</div>
					<div className="footer-links">
						<a href="https://github.com/pranav1237" target="_blank">🐙 GitHub</a>
						<a href="https://www.linkedin.com/in/pranav-mahajan-673283323" target="_blank">🔗 LinkedIn</a>
						<a href="mailto:pranavmahajan.4122005@gmail.com">📧 Email</a>
					</div>
					<div>
						<p>© {new Date().getFullYear()} Pranav Mahajan. All rights reserved.</p>
						<p className="muted">Deployed on Vercel | Powered by React, Vite & Firebase</p>
					</div>
				</motion.div>
			</footer>
		</div>
	);
}