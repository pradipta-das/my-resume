import Pagination from "@/components/Pagination";
import PostList from "@/components/PostList";
import { getPosts } from "@/lib/wordpress";
import { POSTS_PER_PAGE } from "@/lib/site";

export default async function Home() {
  const { items, totalPages } = await getPosts(1, POSTS_PER_PAGE);

  return (
    <>
      <h1 className="sr-only">Latest posts</h1>
      <PostList posts={items} />
      <Pagination page={1} totalPages={totalPages} />
    </>
  );
}
