import Header from "@/components/header"
import ParticleBackground from "@/components/particle-background"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <ParticleBackground />
      <Header />

      <main className="flex-1 container py-4 px-4 md:py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-primary">About</h1>

          <div className="prose prose-invert max-w-none">
            <p>
              Welcome to the Quranic Audio Player, a platform designed to provide easy access to beautiful recitations
              of the Holy Quran.
            </p>

            <p>
              Our mission is to make the recitations of the Quran accessible to everyone around the world. We provide a
              user-friendly interface to browse through different reciters and surahs.
            </p>

            <h2>Features</h2>
            <ul>
              <li>Browse through different categories of recitations</li>
              <li>Search for specific reciters</li>
              <li>Listen to high-quality audio of Quranic recitations</li>
              <li>Dark theme with beautiful particle animations</li>
              <li>Responsive design that works on all devices</li>
            </ul>

            <h2>Data Source</h2>
            <p>
              The audio files and data are sourced from the QuranicAudio.com API. We are grateful for their service in
              making these beautiful recitations available.
            </p>

            <h2>Technology</h2>
            <p>
              This application is built using Next.js, React, and Tailwind CSS. The particle animations are created
              using HTML5 Canvas.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <div className="container">
          <p>© {new Date().getFullYear()} Quranic Audio Player. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

