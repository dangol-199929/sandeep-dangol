import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { SkillsSection } from "@/components/skills-section"
import { ProjectsSection } from "@/components/projects-section"
import { ExperienceSection } from "@/components/experience-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <meta property="og:image" content="/og.png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:image" content="/og.png" />
      <meta name="linkedin:image" content="/og.png" />
      <meta name="instagram:image" content="/og.png" />
      <meta name="facebook:image" content="/og.png" />
      <meta name="youtube:image" content="/og.png" />
      <meta name="tiktok:image" content="/og.png" />
      <meta name="pinterest:image" content="/og.png" />
      <meta name="reddit:image" content="/og.png" />
      <meta name="snapchat:image" content="/og.png" />
      <Navigation />
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <ExperienceSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
