import { Metadata } from 'next';

const defaultMetadata: Metadata = {
  title: {
    default: 'Find Unique Tunes - Discover Rare and Beautiful Music',
    template: '%s | Find Unique Tunes',
  },
  description: 'Discover rare and beautiful musical pieces for your content creation needs. Free-to-use curated collection of unique music for films, vlogs, podcasts, and more.',
  keywords: [
    'music discovery',
    'content creation',
    'background music',
    'royalty free music',
    'film music',
    'vlog music',
    'podcast music',
    'game development music',
    'unique music',
    'free music',
  ],
  authors: [{ name: 'Vincent Pruv' }],
  creator: 'Vincent Pruv',
  publisher: 'Find Unique Tunes',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://finduniquetunes.com',
    siteName: 'Find Unique Tunes',
    title: 'Find Unique Tunes - Discover Rare and Beautiful Music',
    description: 'Discover rare and beautiful musical pieces for your content creation needs. Free-to-use curated collection of unique music.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Find Unique Tunes - Discover Rare and Beautiful Music',
    description: 'Discover rare and beautiful musical pieces for your content creation needs. Free-to-use curated collection of unique music.',
    creator: '@vincentpruv',
  },
};

export default defaultMetadata;