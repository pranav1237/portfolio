import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { auth, signInWithGoogle, signInWithGitHub, signOutUser } from './firebase';
import './styles.css';

function Header({ user }) {
	return (
		<header className="site-header">
			<div className="brand">
				<h1>Pranav Mahajan</h1>
				<p>Full‑stack developer — Projects, Resume & Contact</p>
			</div>
			<div className="auth">
				{user ? (
					<div className="user">
						<img src={user.photoURL} alt={user.displayName} className="avatar" />
						<div className="user-info">
							<div>{user.displayName}</div>
							<button onClick={signOutUser} className="btn small">Sign out</button>
						</div>
					</div>
				) : (
					<>
						<button onClick={signInWithGoogle} className="btn">Sign in with Google</button>
						<button onClick={signInWithGitHub} className="btn outline">Sign in with GitHub</button>
					</>
				)}
			</div>
		</header>
	);
}

function RepoCard({ repo }) {
	return (
		<motion.a
			whileHover={{ scale: 1.03 }}
			whileTap={{ scale: 0.98 }}
			className="repo"
			href={repo.html_url}
			target="_blank"
			rel="noreferrer"
		>
			<h3>{repo.name}</h3>
			<p>{repo.description}</p>
			<div className="meta">⭐ {repo.stargazers_count} • {repo.language}</div>
		</motion.a>
	);
}

export default function Portfolio() {
	const [repos, setRepos] = useState([]);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// auth state
		const unsub = auth.onAuthStateChanged(u => {
			setUser(u);
		});

		// fetch GitHub repos
		fetch('https://api.github.com/users/pranav1237/repos?sort=updated')
			.then(r => r.json())
			.then(data => {
				if (Array.isArray(data)) setRepos(data.slice(0, 12));
			})
			.catch(() => {})
			.finally(() => setLoading(false));

		return () => unsub();
	}, []);

	return (
		<div className="page">
			<Header user={user} />

			<main>
				<motion.section
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="hero"
				>
					<div className="hero-inner">
						<h2>Hello — I'm Pranav</h2>
						<p>
							I'm a passionate software developer building modern web experiences. Browse my
							projects, download my resume, or contact me via LinkedIn.
						</p>
						<div className="actions">
							<a className="btn primary" href="/Pranav_Mahajan_Resume.docx" target="_blank">Download Resume</a>
							<a className="btn outline" href="https://www.linkedin.com/in/pranav-mahajan-673283323" target="_blank">LinkedIn</a>
							<a className="btn" href="https://github.com/pranav1237" target="_blank">GitHub</a>
						</div>
					</div>
					<motion.div className="hero-canvas" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 60, ease: 'linear' }} />
				</motion.section>

				<section className="projects">
					<h2>Selected Projects</h2>
					{loading ? <p>Loading projects…</p> : (
						<div className="grid">
							{repos.map(r => <RepoCard key={r.id} repo={r} />)}
						</div>
					)}
					<div className="more">
						<a href="https://github.com/pranav1237" target="_blank" className="btn">See all on GitHub</a>
					</div>
				</section>

				<section className="about">
					<h2>About Me</h2>
					<p>
						I'm a passionate <strong>B.Tech Software Engineering student</strong> at <strong>Bennett University</strong>, 
						specializing in <strong>AI & Machine Learning</strong>. I build scalable applications and solve real-world 
						problems using Python, Java, React, and cloud technologies.
					</p>
					<div className="about-grid">
						<div>
							<h3>Technical Skills</h3>
							<ul>
								<li><strong>Programming:</strong> Python, Java, C/C++, SQL, HTML, CSS</li>
								<li><strong>AI/ML:</strong> Machine Learning, Data Analysis, NumPy, Pandas, Scikit-learn</li>
								<li><strong>Web:</strong> React, Vite, JavaScript, Firebase</li>
								<li><strong>Tools:</strong> Git/GitHub, Jupyter, VS Code</li>
							</ul>
						</div>
						<div>
							<h3>Education & Certs</h3>
							<ul>
								<li><strong>B.Tech Software Engineering</strong> — Bennett University</li>
								<li>Python, Java, MATLAB Basics</li>
								<li>Data Structures & Algorithms</li>
								<li>JP Morgan Chase Program</li>
								<li><strong>Internship:</strong> AI/ML at Broskies Hub</li>
							</ul>
						</div>
						<div>
							<h3>Key Projects</h3>
							<ul>
								<li><strong>Hospital Management System</strong> — Java & SQL</li>
								<li><strong>ML Library</strong> — Custom algorithms</li>
								<li><strong>Chat System</strong> — Socket programming</li>
								<li><strong>Fraud Detection</strong> — ML models</li>
								<li><strong>Crypto Tracker</strong> — API integration</li>
							</ul>
						</div>
					</div>
					<p style={{marginTop: '16px', fontSize: '13px', color: '#9aa4b2'}}>
						📍 Greater Noida, India | 📧 pranavmahajan.4122005@gmail.com | 📱 7742091902
					</p>
				</section>
			</main>

			<footer>
				<div>© {new Date().getFullYear()} Pranav Mahajan</div>
				<div className="footer-links">
					<a href="https://github.com/pranav1237" target="_blank">GitHub</a>
					<a href="https://www.linkedin.com/in/pranav-mahajan-673283323" target="_blank">LinkedIn</a>
					<a href="mailto:pranavmahajan.4122005@gmail.com">Email</a>
				</div>
			</footer>
		</div>
	);
}