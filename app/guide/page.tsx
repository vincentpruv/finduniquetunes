'use client';

import { Disc3, Filter, RefreshCw, Tags, Play } from 'lucide-react';

export default function GuidePage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-4xl font-medium">How to Use Find Unique Tunes</h1>
      
      <div className="mt-8 space-y-12">
        <section className="space-y-4">
          <div className="flex items-center space-x-3">
            <Disc3 className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-medium">Discover Mode</h2>
          </div>
          <p className="text-lg text-muted-foreground">
            The Discover mode is your gateway to finding unique and inspiring music. Each time you visit, you'll be presented with a randomly selected piece from our curated collection. Perfect for those moments when you want to be surprised and inspired.
          </p>
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-medium">How to use Discover mode:</h3>
            <ul className="mt-2 space-y-2 text-muted-foreground">
              <li className="flex items-center space-x-2">
                <RefreshCw className="h-4 w-4" />
                <span>Click the "Load Another" button to get a new random selection</span>
              </li>
              <li className="flex items-center space-x-2">
                <Play className="h-4 w-4" />
                <span>Watch the video directly on the page</span>
              </li>
              <li className="flex items-center space-x-2">
                <Tags className="h-4 w-4" />
                <span>View tags to understand the style and genre</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center space-x-3">
            <Filter className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-medium">Filter Mode</h2>
          </div>
          <p className="text-lg text-muted-foreground">
            Filter mode allows you to search for specific types of music based on your needs. We distinguish between authors (composers) and interpreters (performers) to help you find exactly what you're looking for.
          </p>
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-medium">Understanding Authors and Interpreters:</h3>
            <ul className="mt-2 space-y-2 text-muted-foreground">
              <li>• <strong>Authors</strong> are the composers or original creators of the music:
                <ul className="ml-4 mt-1 space-y-1">
                  <li>- For classical music: the composer (e.g., Mozart, Bach)</li>
                  <li>- For modern music: the songwriter or producer</li>
                </ul>
              </li>
              <li>• <strong>Interpreters</strong> are those who perform the music:
                <ul className="ml-4 mt-1 space-y-1">
                  <li>- For classical music: soloists, quartets, orchestras</li>
                  <li>- For modern music: singers, bands, performers</li>
                </ul>
              </li>
              <li>• You can search for different interpretations of the same piece!</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-medium">How to use Filter mode:</h3>
            <ul className="mt-2 space-y-2 text-muted-foreground">
              <li>1. Search for authors or interpreters:
                <ul className="ml-4 mt-1 space-y-1">
                  <li>• Type in the search box to find specific authors</li>
                  <li>• Click on an author to see their works</li>
                </ul>
              </li>
              <li>2. Add tags to refine your search:
                <ul className="ml-4 mt-1 space-y-1">
                  <li>• Type to search available tags</li>
                  <li>• Click to add tags to your filter</li>
                  <li>• Combine multiple tags for more specific results</li>
                  <li>• Remove tags by clicking the X button</li>
                </ul>
              </li>
              <li>3. Clear all filters using the "Clear Filters" button to start fresh</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-medium">Tips for Best Results</h2>
          <ul className="space-y-2 text-lg text-muted-foreground">
            <li>• Start with broader searches and then add more filters to narrow down results</li>
            <li>• Use the Discover mode when you're open to new musical experiences</li>
            <li>• Check the tags on videos you like to find similar content</li>
            <li>• Try searching for different interpretations of classical pieces</li>
            <li>• Remember that all music is free to use in your projects</li>
          </ul>
        </section>
      </div>
    </div>
  );
}