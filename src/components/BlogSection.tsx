import React, { useState } from 'react';
import { BookOpen, ArrowRight, Calendar, Clock } from 'lucide-react';
import { BlogPost } from '../types/index.ts';
import { BlogModal } from './BlogModal.tsx';

interface BlogSectionProps {
  posts: BlogPost[];
}

export const BlogSection: React.FC<BlogSectionProps> = ({ posts }) => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const publishedPosts = posts.filter((p) => p.published);

  return (
    <section id="blog" className="py-24 bg-[#08090C] border-t border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="text-xs font-mono tracking-widest text-[#D4AF37] uppercase flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>THE CAPTURE JOURNAL</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white tracking-tight">
              Photography Tips & <span className="text-gold-gradient">Inspiration</span>
            </h2>
            <p className="text-slate-400 text-sm max-w-xl font-body">
              Expert wedding guidance, pre-wedding destination concepts, and archival album care insights from our seasoned camera crew.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {publishedPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="group bg-[#111319] border border-white/10 rounded-2xl overflow-hidden hover:border-[#D4AF37]/40 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="relative h-52 w-full overflow-hidden bg-black/40">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono text-[#E5C05B] border border-white/10 uppercase">
                  {post.category}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#D4AF37]" />
                      <span>{post.publishedAt}</span>
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#D4AF37]" />
                      <span>{post.readTime}</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-bold font-display text-white group-hover:text-[#D4AF37] transition-colors leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-3 font-body leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-[#D4AF37] font-semibold">
                  <span>Read Full Article</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BlogModal post={selectedPost} onClose={() => setSelectedPost(null)} />
    </section>
  );
};
