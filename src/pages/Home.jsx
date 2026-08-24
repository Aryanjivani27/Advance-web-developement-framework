import About from '../components/about';
import Skills from '../components/skills';

export default function Home({ profile, skills }) {
  return (
    <>
      {/* About / Hero Section */}
      <About profile={profile} />

      {/* Skills Section */}
      <Skills skills={skills} />
    </>
  );
}
