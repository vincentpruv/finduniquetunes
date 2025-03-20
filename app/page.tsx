'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { RefreshCw, Play, X, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Combobox } from '@/components/ui/combobox';

interface Video {
  id: string;
  title: string;
  interpreter: string;
  author: string;
  youtube_link: string;
  tags: string[];
}

export default function Home() {
  const [view, setView] = useState<'discover' | 'filter'>('discover');
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [authors, setAuthors] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedAuthor, setSelectedAuthor] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [hasAppliedFilter, setHasAppliedFilter] = useState(false);
  const supabase = createClientComponentClient();

  useEffect(() => {
    loadRandomVideo();
    loadFilters();
  }, []);

  const loadFilters = async () => {
    try {
      const { data, error } = await supabase.from('videos').select('author, tags');
      if (error) throw error;

      // Extract unique authors
      const uniqueAuthors = Array.from(new Set(data.map(video => video.author))).sort();
      setAuthors(uniqueAuthors);

      // Extract unique tags
      const uniqueTags = Array.from(new Set(
        data.flatMap(video => video.tags).filter(Boolean)
      )).sort();
      setTags(uniqueTags);
    } catch (error: any) {
      console.error('Error loading filters:', error);
      toast.error(error.message || 'Failed to load filters');
    }
  };

  const loadRandomVideo = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*');
      
      if (error) throw error;
      if (!data || data.length === 0) {
        toast.error('No videos available');
        return;
      }

      const randomIndex = Math.floor(Math.random() * data.length);
      const newVideo = data[randomIndex];
      
      // Keep loading state true until video is ready
      setCurrentVideo(newVideo);
    } catch (error: any) {
      console.error('Error loading video:', error);
      toast.error(error.message || 'Failed to load video');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    try {
      let query = supabase.from('videos').select('*');

      if (selectedAuthor) {
        query = query.eq('author', selectedAuthor);
      }
      if (selectedTags.length > 0) {
        // Filter videos that contain ALL selected tags
        query = query.contains('tags', selectedTags);
      }

      const { data, error } = await query;
      if (error) throw error;

      setFilteredVideos(data || []);
      setHasAppliedFilter(true);
    } catch (error: any) {
      console.error('Error filtering videos:', error);
      toast.error(error.message || 'Failed to filter videos');
    }
  };

  const handleAddTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = selectedTags.filter(tag => tag !== tagToRemove);
    setSelectedTags(newTags);
    if (newTags.length === 0 && !selectedAuthor) {
      clearFilters();
    }
  };

  const clearFilters = () => {
    setSelectedAuthor('');
    setSelectedTags([]);
    setFilteredVideos([]);
    setHasAppliedFilter(false);
  };

  useEffect(() => {
    if (view === 'filter' && (selectedAuthor || selectedTags.length > 0)) {
      handleFilter();
    }
  }, [selectedAuthor, selectedTags, view]);

  const getVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-center">
        <div className="rounded-full bg-secondary p-1">
          <button
            onClick={() => setView('discover')}
            className={`rounded-full px-4 py-2 text-sm transition-colors ${
              view === 'discover' && 'bg-white text-black shadow dark:bg-gray-800 dark:text-white'
            }`}
          >
            Discover
          </button>
          <button
            onClick={() => setView('filter')}
            className={`rounded-full px-4 py-2 text-sm transition-colors ${
              view === 'filter' && 'bg-white text-black shadow dark:bg-gray-800 dark:text-white'
            }`}
          >
            Filter
          </button>
        </div>
      </div>

      {view === 'discover' ? (
        <div className="flex flex-col items-center">
          <div className="mb-6 min-h-[600px] w-full max-w-3xl">
            {currentVideo && !loading ? (
              <div className="space-y-4">
                <div className="aspect-video w-full">
                  <iframe
                    src={`https://www.youtube.com/embed/${getVideoId(currentVideo.youtube_link)}`}
                    className="h-full w-full rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold">{currentVideo.title}</h2>
                  <p className="text-muted-foreground">
                    {currentVideo.interpreter && `${currentVideo.interpreter} • `}
                    {currentVideo.author}
                  </p>
                  {currentVideo.tags && currentVideo.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {currentVideo.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-secondary px-3 py-1 text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              </div>
            )}
          </div>
          <button
            onClick={loadRandomVideo}
            className="inline-flex items-center space-x-2 rounded-full bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Load Another</span>
          </button>
        </div>
      ) : (
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Search Filters</h2>
              <button
                onClick={clearFilters}
                className="inline-flex items-center space-x-2 rounded-full bg-secondary px-3 py-1.5 text-sm hover:bg-secondary/80"
              >
                <Trash2 className="h-4 w-4" />
                <span>Clear Filters</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Filter by Author</label>
                <Combobox
                  options={authors}
                  value={selectedAuthor}
                  placeholder="Select an author"
                  onChange={setSelectedAuthor}
                  emptyMessage="No authors found"
                />
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="mb-2 block text-sm font-medium">Filter by Tags</label>
                  <Combobox
                    options={tags.filter(tag => !selectedTags.includes(tag))}
                    placeholder="Select tags"
                    onChange={handleAddTag}
                    emptyMessage="No tags found"
                  />
                </div>

                {selectedTags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-sm"
                      >
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 rounded-full p-0.5 hover:bg-accent"
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove {tag} tag</span>
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {!hasAppliedFilter ? (
              <p className="text-center text-lg text-muted-foreground">
                Select filters above to start searching
              </p>
            ) : filteredVideos.length > 0 ? (
              filteredVideos.map((video) => (
                <div
                  key={video.id}
                  className="rounded-lg border bg-card p-4 shadow-sm transition-colors hover:bg-accent"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold">{video.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {video.interpreter && `${video.interpreter} • `}
                        {video.author}
                      </p>
                    </div>
                    <a
                      href={video.youtube_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-primary p-2 text-primary-foreground hover:bg-primary/90"
                    >
                      <Play className="h-4 w-4" />
                    </a>
                  </div>
                  {video.tags && video.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {video.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-secondary px-2 py-1 text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground">
                No videos found matching your filters
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}