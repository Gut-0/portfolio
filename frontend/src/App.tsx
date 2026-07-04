import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Stack from "./components/Stack";
import Work from "./components/Work";
import Architecture from "./components/Architecture";
import Dashboard from "./components/Dashboard";
import Certifications from "./components/Certifications";
import Wall from "./components/Wall";
import Footer from "./components/Footer";
import CursorGlow from "./components/CursorGlow";
import { useWall } from "./hooks/useWall";

function App() {
  // Single source of truth: the dashboard is derived from the same notes as the wall.
  const wall = useWall();

  return (
    <>
      <CursorGlow />
      <Header />
      <main>
        <Hero />
        <About />
        <Stack />
        <Work />
        <Architecture />
        <Dashboard wall={wall} />
        <Certifications />
        <Wall wall={wall} />
      </main>
      <Footer />
    </>
  );
}

export default App;
