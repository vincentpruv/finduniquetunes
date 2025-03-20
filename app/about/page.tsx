import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-4xl font-medium">About Find Unique Tunes</h1>
      <div className="mt-6 space-y-6">
        <p className="text-lg text-muted-foreground">
          Find Unique Tunes is a platform dedicated to helping content creators discover rare and beautiful musical pieces from around the world. Born from a need to improve the quality of background music in digital content, our platform serves as a curated collection of unique and artistic pieces.
        </p>

        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-2xl font-medium">Perfect For Your Projects</h2>
          <ul className="mt-4 space-y-3">
            <li className="flex items-center space-x-2">
              <span className="text-primary">•</span>
              <span className="text-muted-foreground">Films and Short Movies</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-primary">•</span>
              <span className="text-muted-foreground">Vlogs and YouTube Content</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-primary">•</span>
              <span className="text-muted-foreground">Podcasts and Audio Content</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-primary">•</span>
              <span className="text-muted-foreground">Game Development</span>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-primary">•</span>
              <span className="text-muted-foreground">Social Media Content</span>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-medium">Free to Use</h2>
          <p className="text-lg text-muted-foreground">
            This service is totally free-to-use! We believe in supporting content creators by providing access to high-quality, unique music without the burden of licensing fees. Enjoy!
          </p>
        </div>

        <div className="flex justify-center space-x-4">
          <Link
            href="https://x.com/vincentpruv"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 rounded-full bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span>Follow on X</span>
          </Link>
        </div>
      </div>
    </div>
  );
}