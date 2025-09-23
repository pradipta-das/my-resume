

import React from 'react';
import WordPressPostDetail from '../../components/WordPressPostDetail';

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
const {slug} = await params;

  return (
    <div className="blog-post-page">
      <WordPressPostDetail slug={slug} />
    </div>
  );
}