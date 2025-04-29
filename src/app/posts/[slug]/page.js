// app/posts/[slug]/page.js
import { notFound } from 'next/navigation'

export default async function Post({ params }) {
  const post = await getPost(params.slug)

  if (!post) {
    notFound() // Triggers app/not-found.js
  }

  return <div>{post.title}</div>
}
