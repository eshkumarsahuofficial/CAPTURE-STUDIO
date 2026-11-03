import React from 'react';
import { X, Calendar, Clock, User, Share2 } from 'lucide-react';
import { BlogPost } from '../types/index.ts';

interface BlogModalProps {
  post: BlogPost | null;
  onClose: () => void;
}

export const BlogModal: React.FC<BlogModalProps> = ({ post, onClose }) => {
  if (!post) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 animate-fadeIn">
      <div className="relative max-w-3xl w-full bg-[#0E1016] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Cover Photo */}
        <div className="relative h-64 sm:h-72 w-full shrink-0">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E1016] via-[#0E1016]/40 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6">
            <span className="text-[10px] font-mono tracking-wider px-2.5 py-1 rounded bg-[#D4AF37] text-slate-950 font-bold uppercase">
              {post.category}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white mt-2 leading-tight">
              {post.title}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          <div className="flex items-center gap-4 text-xs font-mono text-slate-400 border-b border-white/10 pb-4">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{post.publishedAt}</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{post.readTime}</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{post.author}</span>
            </span>
          </div>

          <div className="prose prose-invert prose-sm max-w-none space-y-4 text-slate-300 font-body leading-relaxed whitespace-pre-line text-sm">
            {post.content}
          </div>

          <div className="pt-6 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">
              Published by Capture Studio Editorial
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Close Article
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
