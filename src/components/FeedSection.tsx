import React, { useState, useEffect } from 'react';
import { Send, ThumbsUp, MessageSquare, Award, Megaphone, Share2, Pin, Calendar, Briefcase, Plus } from 'lucide-react';
import { FeedPost, Comment, User } from '../types';

interface FeedSectionProps {
  currentUser: User | null;
  onOpenAuth: () => void;
}

export default function FeedSection({ currentUser, onOpenAuth }: FeedSectionProps) {
  const [posts, setPosts] = useState<(FeedPost & { author?: any })[]>([]);
  const [newContent, setNewContent] = useState('');
  const [postType, setPostType] = useState<'update' | 'achievement' | 'ask'>('update');
  const [selectedPostComments, setSelectedPostComments] = useState<string | null>(null);
  const [commentsMap, setCommentsMap] = useState<Record<string, (Comment & { author?: any })[]>>({});
  const [newCommentText, setNewCommentText] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/feed');
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    if (!newContent) return;

    try {
      const res = await fetch('/api/feed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.username}`
        },
        body: JSON.stringify({
          content: newContent,
          post_type: postType,
          tags: [postType, 'tg10x']
        })
      });
      const data = await res.json();
      if (data.success) {
        setNewContent('');
        setPosts(prev => [data.post, ...prev]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async (postId: string) => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    try {
      const res = await fetch(`/api/feed/${postId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentUser.username}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setPosts(prev =>
          prev.map(p => (p.id === postId ? { ...p, likes_count: data.likes_count } : p))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleComments = async (postId: string) => {
    if (selectedPostComments === postId) {
      setSelectedPostComments(null);
      return;
    }
    setSelectedPostComments(postId);
    fetchComments(postId);
  };

  const fetchComments = async (postId: string) => {
    try {
      const res = await fetch(`/api/feed/${postId}/comments`);
      const data = await res.json();
      if (data.success) {
        setCommentsMap(prev => ({ ...prev, [postId]: data.comments }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const nameAbbreviation = (name: string) => {
    return name ? name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : 'TG';
  };

  const handleAddComment = async (postId: string) => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    const text = newCommentText[postId];
    if (!text) return;

    try {
      const res = await fetch(`/api/feed/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.username}`
        },
        body: JSON.stringify({ content: text })
      });
      const data = await res.json();
      if (data.success) {
        setNewCommentText(prev => ({ ...prev, [postId]: '' }));
        // Add to list and incremental updates
        setCommentsMap(prev => ({
          ...prev,
          [postId]: [...(prev[postId] || []), data.comment]
        }));
        setPosts(prev =>
          prev.map(p => (p.id === postId ? { ...p, comments_count: p.comments_count + 1 } : p))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'achievement': return <Award className="w-4.5 h-4.5 text-emerald-500 animate-bounce" />;
      case 'ask': return <Megaphone className="w-4.5 h-4.5 text-rose-500" />;
      default: return <Plus className="w-4.5 h-4.5 text-indigo-500" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Create Post Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/80 p-5 shadow-sm">
        <form onSubmit={handleCreatePost} className="space-y-4">
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-full bg-rose-500 text-white flex items-center justify-center font-extrabold text-xs shadow-sm">
              {currentUser ? nameAbbreviation(currentUser.full_name) : 'TG'}
            </div>
            <textarea
              value={newContent}
              onChange={e => setNewContent(e.target.value)}
              rows={2}
              placeholder="Share an achievement, ask for advice, or announce an opportunity across Noida, Hyderabad, and Telangana..."
              className="flex-1 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-50 border border-slate-150 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-rose-500 dark:text-white"
            />
          </div>

          <div className="flex justify-between items-center pt-2.5 border-t border-slate-100 dark:border-slate-700/50">
            <div className="flex space-x-2">
              {[
                { id: 'update', label: 'General Info', color: 'bg-indigo-50 text-indigo-650 dark:bg-indigo-950/20' },
                { id: 'achievement', label: '🏆 Achievement', color: 'bg-emerald-50 text-emerald-650 dark:bg-emerald-950/20' },
                { id: 'ask', label: '📣 Ask/Help', color: 'bg-rose-50 text-rose-650 dark:bg-rose-950/20' }
              ].map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setPostType(t.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    postType === t.id
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-extrabold'
                      : 'bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-tr from-rose-500 to-rose-600 hover:opacity-95 text-white rounded-xl text-xs font-black uppercase flex items-center gap-1.5 transition shadow-sm cursor-pointer"
            >
              <Send className="w-3 h-3" />
              Post Update
            </button>
          </div>
        </form>
      </div>

      {/* Feed List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">
            Loading ecosystem updates feed...
          </div>
        ) : posts.length === 0 ? (
          <div className="py-16 bg-white border border-slate-200/60 rounded-3xl text-center p-8 max-w-md mx-auto space-y-4 shadow-sm">
            <div className="p-3 bg-rose-50 text-rose-500 rounded-2xl inline-flex items-center justify-center">
              <MessageSquare className="w-5 h-5 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider">Empty Conversation Node</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                No updates have been broadcasted yet. Share your milestones, questions, or ecosystem resources with other verified vectors!
              </p>
            </div>
          </div>
        ) : (
          posts.map(post => (
            <div
              key={post.id}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <img
                    referrerPolicy="no-referrer"
                    src={post.author?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${post.author?.full_name}`}
                    alt="Author"
                    className="w-10 h-10 rounded-xl object-cover bg-slate-50 border border-slate-100 dark:border-slate-700"
                  />
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-800 dark:text-white">
                      {post.author?.full_name || 'Ecosystem Leader'}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-medium">
                      @{post.author?.username || 'member'} • <span className="capitalize">{post.author?.role?.replace('_', ' ')}</span>
                    </p>
                  </div>
                </div>

                <span className="p-1.5 bg-slate-50 dark:bg-slate-700/50 rounded-xl flex items-center justify-center">
                  {getPostTypeIcon(post.post_type)}
                </span>
              </div>

              {/* Content body */}
              <p className="text-xs text-slate-600 dark:text-slate-350 mt-4 leading-relaxed whitespace-pre-line font-medium">
                {post.content}
              </p>

              {/* Tag Badges */}
              <div className="flex flex-wrap gap-1.5 mt-3.5">
                {(post.tags || []).map(tag => (
                  <span key={tag} className="bg-slate-50 dark:bg-slate-700/30 text-[9px] font-bold uppercase tracking-wider text-slate-400 px-2 py-0.5 rounded">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Interactive buttons bar */}
              <div className="flex items-center space-x-6 pt-3.5 mt-4 border-t border-slate-100 dark:border-slate-700/40">
                <button
                  onClick={() => handleLike(post.id)}
                  className="flex items-center space-x-1.5 text-xs font-bold text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{post.likes_count || 0} Likes</span>
                </button>

                <button
                  onClick={() => toggleComments(post.id)}
                  className="flex items-center space-x-1.5 text-xs font-bold text-slate-400 hover:text-indigo-500 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{post.comments_count || 0} Comments</span>
                </button>

                <div className="text-[10px] text-slate-300 dark:text-slate-600 ml-auto font-mono">
                  {new Date(post.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>

              {/* Expanded Comment Thread */}
              {selectedPostComments === post.id && (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 space-y-3.5 bg-slate-50/50 dark:bg-slate-800/10 rounded-xl p-3.5">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Comment Thread</span>
                  
                  {/* Comments lists */}
                  <div className="divide-y divide-slate-100 dark:divide-slate-700 space-y-3.5">
                    {!(commentsMap[post.id]?.length > 0) ? (
                      <p className="text-[11px] text-slate-400 italic text-center py-4">No comments on this post yet. Let's start the dialogue!</p>
                    ) : (
                      commentsMap[post.id].map(comm => (
                        <div key={comm.id} className="pt-3 flex gap-2.5 items-start">
                          <img
                            referrerPolicy="no-referrer"
                            src={comm.author?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${comm.author?.full_name}`}
                            alt="avatar"
                            className="w-7 h-7 rounded-lg object-cover bg-white shadow-sm border"
                          />
                          <div className="flex-1 bg-white dark:bg-slate-705 p-3 rounded-xl border border-slate-100/50">
                            <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200">
                              {comm.author?.full_name || 'Representative'}
                            </span>
                            <span className="text-[9px] text-slate-400 ml-2">@{comm.author?.username || 'user'}</span>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                              {comm.content}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add comment action box */}
                  <div className="flex gap-2 pt-2.5">
                    <input
                      type="text"
                      placeholder="Write your response message..."
                      value={newCommentText[post.id] || ''}
                      onChange={e => setNewCommentText(prev => ({ ...prev, [post.id]: e.target.value }))}
                      onKeyDown={e => e.key === 'Enter' && handleAddComment(post.id)}
                      className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 placeholder-slate-400 rounded-xl px-3 py-1.5 text-xs focus:outline-none dark:text-white"
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      className="px-3 py-1 rounded-xl bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-extrabold text-xs transition"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
}
