'use client';

import React, { useState, useEffect } from 'react';
import { fetchPostBySlug } from '../lib/wordpress';

interface BlogPost {
  id: number;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  modified: string;
  slug: string;
  featured_media: number;
  _embedded?: {
    'wp:featuredmedia'?: Array<{
      source_url: string;
    }>;
  };
  author: number;
  _links?: {
    author?: Array<{ href: string }>;
  };
}

export default function WordPressPostDetail({ slug }: { slug: string }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
        const postData = await fetchPostBySlug(slug);
        setPost(postData);
      } catch (err) {
        setError('Failed to fetch blog post. Please try again later.');
        console.error('Error fetching blog post:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="blog-post-detail py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-200 h-64 w-full animate-pulse"></div>
            <div className="p-8">
              <div className="h-8 bg-gray-200 rounded mb-6 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded mb-3 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded mb-3 animate-pulse w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded mb-3 animate-pulse w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded mb-3 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded mb-3 animate-pulse w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="blog-post-detail py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="blog-post-detail py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white rounded-lg shadow-md overflow-hidden p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-700">Post not found</h2>
            <p className="text-gray-500 mt-2">The requested blog post could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  // Get featured image URL if available
  const featuredImageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';

  return (
    <div className="blog-post-detail py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {featuredImageUrl && (
            <img 
              src={featuredImageUrl} 
              alt={post.title.rendered} 
              className="w-full h-64 object-cover"
            />
          )}
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">{post.title.rendered}</h1>
            <div className="text-sm text-gray-500 mb-6">
              Published on {new Date(post.date).toLocaleDateString()}
            </div>
            <div 
              className="prose max-w-none" 
              dangerouslySetInnerHTML={{ __html: post.content.rendered }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}