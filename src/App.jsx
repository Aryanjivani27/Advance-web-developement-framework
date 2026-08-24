import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header';
import Footer from './components/footer';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import avatarImg from './assets/avatar.png';
import './App.css';

function App() {
  // Global configurations & data
  const brandName = "My Portfolio";

  const profileData = {
    name: 'Aryan Dev',
    tagline: 'Creative Full-Stack Engineer',
    bio: 'I build high-performance, visually stunning web applications that defy expectation. Combining engineering precision with pixel-perfect design aesthetics to create interfaces that feel alive, premium, and seamless.',
    avatarUrl: avatarImg,
    stats: [
      { value: '3+', label: 'Years Exp' },
      { value: '25+', label: 'Projects' },
      { value: '99%', label: 'Happy Clients' }
    ]
  };

  const skillsList = [
    { name: 'React', level: 95, category: 'Frontend' },
    { name: 'JavaScript', level: 92, category: 'Frontend' },
    { name: 'HTML & CSS', level: 90, category: 'Frontend' },
    { name: 'Node.js', level: 85, category: 'Backend' },
    { name: 'Express / Fastify', level: 80, category: 'Backend' },
    { name: 'MongoDB / SQL', level: 75, category: 'Backend' },
    { name: 'Vite & Bundlers', level: 88, category: 'Tools' },
    { name: 'Git & Deployment', level: 85, category: 'Tools' }
  ];

  const projectsList = [
    {
      id: 1,
      title: 'Holographic Portfolio',
      description: 'A cutting-edge developer portfolio built with React, Vite, and custom CSS keyframes. Features smooth HashRouter navigation, responsive grids, and clean visual structures.',
      tech: ['React', 'Vite', 'CSS Gradients', 'React Router'],
      link: 'https://github.com'
    },
    {
      id: 2,
      title: 'DeFi Analytics Dashboard',
      description: 'A premium real-time dashboard tracking automated market makers, trade volumes, and current wallet portfolios on cross-chain assets.',
      tech: ['React', 'Chart.js', 'REST API', 'CSS Grid'],
      link: 'https://github.com'
    },
    {
      id: 3,
      title: 'Live Collaborative Canvas',
      description: 'An interactive virtual whiteboard allowing collaborative sketch sessions, code highlights, and mock design diagrams with instant socket sync.',
      tech: ['React', 'WebSockets', 'Canvas API', 'Node.js'],
      link: 'https://github.com'
    }
  ];

  const socialLinks = [
    { name: 'GitHub', url: 'https://github.com' },
    { name: 'Discord', url: 'https://discord.com' },
    { name: 'Twitter', url: 'https://twitter.com' }
  ];

  const copyrightText = `© ${new Date().getFullYear()} Aryan Dev. Built with React, Vite & Router.`;

  return (
    <Router>
      {/* Header Component */}
      <Header brandName={brandName} />

      {/* Main Pages rendered via Routes */}
      <main className="content-container">
        <Routes>
          <Route
            path="/"
            element={<Home profile={profileData} skills={skillsList} />}
          />
          <Route
            path="/projects"
            element={<Projects />}
          />
          <Route
            path="/contact"
            element={<Contact />}
          />
        </Routes>
      </main>

      {/* Footer Component */}
      <Footer socials={socialLinks} copyright={copyrightText} />
    </Router>
  );
}

export default App;
