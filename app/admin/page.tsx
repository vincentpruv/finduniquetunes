'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Trash2, Edit, LogOut, Save, X, Disc2, Mic2, PlayCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Video {
  id: string;
  title: string;
  interpreter: string;
  author: string;
  youtube_link: string;
  tags: string[];
}

interface TagInputProps {
  value: string | string[];
  onChange: (value: string) => void;
  onTagsChange: (tags: string[]) => void;
  existingTags: string[];
  placeholder?: string;
}

function TagInput({ value, onChange, onTagsChange, existingTags, placeholder }: TagInputProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (Array.isArray(value)) {
      setTags(value);
    } else if (typeof value === 'string' && value) {
      setTags(value.split(',').map(tag => tag.trim()).filter(Boolean));
    } else {
      setTags([]);
    }
    setInputValue('');
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      const newTags = tags.slice(0, -1);
      setTags(newTags);
      onTagsChange(newTags);
      onChange(newTags.join(', '));
    } else if (e.key === ',' || e.key === 'Enter') {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (newTag && !tags.includes(newTag)) {
        const newTags = [...tags, newTag].sort((a: string, b: string) => a.localeCompare(b));
        setTags(newTags);
        onTagsChange(newTags);
        onChange(newTags.join(', '));
        setInputValue('');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value.includes(',')) {
      setInputValue(value);
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
    onTagsChange(newTags);
    onChange(newTags.join(', '));
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap gap-2 rounded-md border bg-background p-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-sm animate-in fade-in-0 zoom-in-95"
          >
            {tag}
            <button
              onClick={() => removeTag(tag)}
              className="ml-2 rounded-full p-0.5 hover:bg-accent"
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {tag}</span>
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          placeholder={tags.length === 0 ? placeholder : "Add more tags..."}
        />
      </div>
      {inputValue && (
        <div className="absolute left-0 right-0 mt-1 rounded-md border bg-background p-2 shadow-lg">
          {existingTags
            .filter(tag => 
              tag.toLowerCase().includes(inputValue.toLowerCase()) && 
              !tags.includes(tag)
            )
            .map(tag => (
              <button
                key={tag}
                className="block w-full rounded px-2 py-1 text-left hover:bg-accent"
                onClick={() => {
                  const newTags = [...tags, tag].sort((a: string, b: string) => a.localeCompare(b));
                  setTags(newTags);
                  onTagsChange(newTags);
                  onChange(newTags.join(', '));
                  setInputValue('');
                }}
              >
                {tag}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [deletingVideo, setDeletingVideo] = useState<Video | null>(null);
  const [newVideo, setNewVideo] = useState({
    title: '',
    interpreter: '',
    author: '',
    youtube_link: '',
    tags: '',
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [existingTags, setExistingTags] = useState<string[]>([]);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchVideos();
    }
  }, [isAuthenticated]);

  async function checkAuth() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/admin/login');
        return;
      }
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Auth check error:', error);
      router.replace('/admin/login');
    }
  }

  async function fetchVideos() {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const allTags = new Set<string>();
      const sortedData = (data || []).map(video => {
        if (Array.isArray(video.tags)) {
          video.tags.forEach(tag => allTags.add(tag));
          return {
            ...video,
            tags: video.tags.sort((a: string, b: string) => a.localeCompare(b))
          };
        }
        return video;
      });

      setExistingTags(Array.from(allTags).sort((a: string, b: string) => a.localeCompare(b)));
      setVideos(sortedData);
    } catch (error: any) {
      console.error('Error fetching videos:', error);
      toast.error(error.message || 'Failed to load videos');
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      router.push('/admin/login');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error(error.message || 'Failed to log out');
    }
  }

  async function handleAddVideo(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      const trimmedVideo = {
        title: newVideo.title.trim(),
        interpreter: newVideo.interpreter.trim(),
        author: newVideo.author.trim(),
        youtube_link: newVideo.youtube_link.trim(),
        tags: newVideo.tags
      };

      if (!trimmedVideo.title || !trimmedVideo.author || !trimmedVideo.youtube_link) {
        throw new Error('Please fill in all required fields');
      }

      const tagsArray = typeof trimmedVideo.tags === 'string' 
        ? trimmedVideo.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        : [];

      const sortedTags = tagsArray.sort((a: string, b: string) => a.localeCompare(b));

      const { error } = await supabase.from('videos').insert([{
        ...trimmedVideo,
        tags: sortedTags,
      }]);

      if (error) {
        throw error;
      }

      toast.success('Video added successfully');
      setNewVideo({
        title: '',
        interpreter: '',
        author: '',
        youtube_link: '',
        tags: '',
      });
      fetchVideos();
    } catch (error: any) {
      console.error('Error adding video:', error);
      toast.error(error.message || 'Failed to add video');
    }
  }

  async function handleUpdateVideo(e: React.FormEvent) {
    e.preventDefault();
    if (!editingVideo) return;

    try {
      const trimmedVideo = {
        ...editingVideo,
        title: editingVideo.title.trim(),
        interpreter: editingVideo.interpreter.trim(),
        author: editingVideo.author.trim(),
        youtube_link: editingVideo.youtube_link.trim(),
      };

      if (!trimmedVideo.title || !trimmedVideo.author || !trimmedVideo.youtube_link) {
        throw new Error('Please fill in all required fields');
      }

      const tagsArray = Array.isArray(trimmedVideo.tags)
        ? trimmedVideo.tags
        : typeof trimmedVideo.tags === 'string'
          ? trimmedVideo.tags.split(',').map(tag => tag.trim()).filter(Boolean)
          : [];

      const sortedTags = tagsArray.sort((a: string, b: string) => a.localeCompare(b));

      const { error } = await supabase
        .from('videos')
        .update({
          ...trimmedVideo,
          tags: sortedTags,
        })
        .eq('id', trimmedVideo.id);

      if (error) {
        throw error;
      }

      toast.success('Video updated successfully');
      setEditingVideo(null);
      fetchVideos();
    } catch (error: any) {
      console.error('Error updating video:', error);
      toast.error(error.message || 'Failed to update video');
    }
  }

  async function handleDeleteVideo(video: Video) {
    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', video.id);

      if (error) {
        throw error;
      }

      toast.success('Video deleted successfully');
      setDeletingVideo(null);
      fetchVideos();
    } catch (error: any) {
      console.error('Error deleting video:', error);
      toast.error(error.message || 'Failed to delete video');
    }
  }

  if (!isAuthenticated || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="inline-flex items-center space-x-2 rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>

      <div className="mb-8 rounded-lg bg-card p-6 shadow-md">
        <h2 className="mb-4 text-xl">Add New Video</h2>
        <form onSubmit={handleAddVideo} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center space-x-2">
              <Disc2 className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Title"
                value={newVideo.title}
                onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                className="w-full rounded-md border bg-background px-3 py-2"
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Mic2 className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Interpreter (optional)"
                value={newVideo.interpreter}
                onChange={(e) => setNewVideo({ ...newVideo, interpreter: e.target.value })}
                className="w-full rounded-md border bg-background px-3 py-2"
              />
            </div>
            <div className="flex items-center space-x-2">
              <PlayCircle className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Author"
                value={newVideo.author}
                onChange={(e) => setNewVideo({ ...newVideo, author: e.target.value })}
                className="w-full rounded-md border bg-background px-3 py-2"
                required
              />
            </div>
            <input
              type="text"
              placeholder="YouTube Link"
              value={newVideo.youtube_link}
              onChange={(e) => setNewVideo({ ...newVideo, youtube_link: e.target.value })}
              className="w-full rounded-md border bg-background px-3 py-2"
              required
            />
          </div>
          <TagInput
            value={newVideo.tags}
            onChange={(value) => setNewVideo({ ...newVideo, tags: value })}
            onTagsChange={() => {}}
            existingTags={existingTags}
            placeholder="Add tags (press Enter or comma to add)"
          />
          <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          >
            Add Video
          </button>
        </form>
      </div>

      <div className="rounded-lg bg-card p-6 shadow-md">
        <h2 className="mb-4 text-xl">Video List</h2>
        <div className="space-y-4">
          {videos.map((video) => (
            <div
              key={video.id}
              className="rounded-lg border bg-card p-4 shadow-sm"
            >
              {editingVideo?.id === video.id ? (
                <form onSubmit={handleUpdateVideo} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center space-x-2">
                      <Disc2 className="h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Title"
                        value={editingVideo.title}
                        onChange={(e) =>
                          setEditingVideo({ ...editingVideo, title: e.target.value })
                        }
                        className="w-full rounded-md border bg-background px-3 py-2"
                        required
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mic2 className="h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Interpreter (optional)"
                        value={editingVideo.interpreter}
                        onChange={(e) =>
                          setEditingVideo({ ...editingVideo, interpreter: e.target.value })
                        }
                        className="w-full rounded-md border bg-background px-3 py-2"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <PlayCircle className="h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Author"
                        value={editingVideo.author}
                        onChange={(e) =>
                          setEditingVideo({ ...editingVideo, author: e.target.value })
                        }
                        className="w-full rounded-md border bg-background px-3 py-2"
                        required
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="YouTube Link"
                      value={editingVideo.youtube_link}
                      onChange={(e) =>
                        setEditingVideo({
                          ...editingVideo,
                          youtube_link: e.target.value,
                        })
                      }
                      className="w-full rounded-md border bg-background px-3 py-2"
                      required
                    />
                  </div>
                  <TagInput
                    value={editingVideo.tags}
                    onChange={(value) => setEditingVideo({ ...editingVideo, tags: value })}
                    onTagsChange={() => {}}
                    existingTags={existingTags}
                    placeholder="Add tags (press Enter or comma to add)"
                  />
                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      className="inline-flex items-center space-x-2 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingVideo(null)}
                      className="inline-flex items-center space-x-2 rounded-md bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                    >
                      <X className="h-4 w-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{video.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {video.interpreter && `Interpreter: ${video.interpreter}`}
                        {video.interpreter && video.author && ' | '}
                        {video.author && `Author: ${video.author}`}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingVideo(video)}
                        className="rounded-md p-2 hover:bg-accent"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeletingVideo(video)}
                        className="rounded-md p-2 text-red-500 hover:bg-accent"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {video.youtube_link}
                  </p>
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
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deletingVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-lg bg-background p-6 shadow-lg">
            <h3 className="text-lg font-medium">Delete Video</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Are you sure you want to delete &quot;{deletingVideo.title}&quot;? This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setDeletingVideo(null)}
                className="rounded-md bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteVideo(deletingVideo)}
                className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}