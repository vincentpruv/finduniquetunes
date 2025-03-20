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

export default function AdminPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [newVideo, setNewVideo] = useState({
    title: '',
    interpreter: '',
    author: '',
    youtube_link: '',
    tags: '',
  });

  useEffect(() => {
    checkSession();
    fetchVideos();
  }, []);

  async function checkSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      
      if (!session) {
        await handleLogout();
        return;
      }
    } catch (error) {
      console.error('Session check error:', error);
      await handleLogout();
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

      setVideos(data || []);
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
      router.refresh();
    } catch (error: any) {
      console.error('Logout error:', error);
      // Force redirect to login even if there's an error
      router.push('/admin/login');
      router.refresh();
    }
  }

  async function handleAddVideo(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      if (!newVideo.title || !newVideo.author || !newVideo.youtube_link) {
        throw new Error('Please fill in all required fields');
      }

      const { error } = await supabase.from('videos').insert([
        {
          ...newVideo,
          tags: newVideo.tags ? newVideo.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
        },
      ]);

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
      if (!editingVideo.title || !editingVideo.author || !editingVideo.youtube_link) {
        throw new Error('Please fill in all required fields');
      }

      const { error } = await supabase
        .from('videos')
        .update({
          ...editingVideo,
          tags: typeof editingVideo.tags === 'string'
            ? editingVideo.tags.split(',').map(tag => tag.trim()).filter(Boolean)
            : editingVideo.tags,
        })
        .eq('id', editingVideo.id);

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

  async function handleDeleteVideo(id: string) {
    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      toast.success('Video deleted successfully');
      fetchVideos();
    } catch (error: any) {
      console.error('Error deleting video:', error);
      toast.error(error.message || 'Failed to delete video');
    }
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
          <input
            type="text"
            placeholder="Tags (comma-separated)"
            value={newVideo.tags}
            onChange={(e) => setNewVideo({ ...newVideo, tags: e.target.value })}
            className="w-full rounded-md border bg-background px-3 py-2"
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
        {loading ? (
          <p>Loading videos...</p>
        ) : (
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
                    <input
                      type="text"
                      placeholder="Tags (comma-separated)"
                      value={
                        Array.isArray(editingVideo.tags)
                          ? editingVideo.tags.join(', ')
                          : editingVideo.tags
                      }
                      onChange={(e) =>
                        setEditingVideo({ ...editingVideo, tags: e.target.value })
                      }
                      className="w-full rounded-md border bg-background px-3 py-2"
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
                          onClick={() => handleDeleteVideo(video.id)}
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
        )}
      </div>
    </div>
  );
}