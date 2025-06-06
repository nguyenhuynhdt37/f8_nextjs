import { cookies } from 'next/headers';
import PostById from '@/components/client/post/PostById';
import { redirect } from 'next/navigation';
import { Metadata, ResolvingMetadata } from 'next';
import { generateSlug } from '@/Utils/functions/slugify';

interface Iprops {
    params: { slug: string };
}

// Generate metadata for SEO
export async function generateMetadata(
    { params }: Iprops,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { slug } = params;
    let id: string | undefined;

    // Kiểm tra xem slug có phải là một ID thuần túy không
    if (/^\d+$/.test(slug)) {
        id = slug;
    } else {
        // Trích xuất ID từ slug (phần cuối cùng sau dấu gạch ngang cuối cùng)
        id = slug.split('-').pop();
    }

    if (!id || isNaN(parseInt(id))) {
        return {
            title: 'Post Not Found',
            description: 'The requested post could not be found',
        };
    }

    const cookieHeader = cookies().getAll()
        .map((c) => `${c.name}=${c.value}`)
        .join('; ');

    try {
        // Fetch post data for metadata
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/post/${id}`,
            {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', Cookie: cookieHeader },
            },
        );

        if (!res.ok) {
            throw new Error('Failed to fetch post');
        }

        const result = await res.json();
        const post = result?.data?.post;
        const user = result?.data?.user;

        if (!post) {
            throw new Error('Post not found');
        }

        // Extract plain text content for description (limit to 160 characters)
        const plainTextContent = post.content
            .replace(/<[^>]*>/g, '') // Remove HTML tags
            .slice(0, 160) + (post.content.length > 160 ? '...' : '');

        return {
            title: `${post.title} | F8 Blog`,
            description: plainTextContent,
            authors: [{ name: user?.name || 'F8 Author' }],
            openGraph: {
                title: post.title,
                description: plainTextContent,
                type: 'article',
                publishedTime: post.createdAt,
                modifiedTime: post.updatedAt,
                authors: [user?.name || 'F8 Author'],
                images: [post.banner],
            },
            twitter: {
                card: 'summary_large_image',
                title: post.title,
                description: plainTextContent,
                images: [post.banner],
            },
        };
    } catch (error) {
        console.error('Error generating metadata:', error);
        return {
            title: 'Blog Post | F8',
            description: 'Read our latest blog posts on F8',
        };
    }
}

async function fetchPostData(slug: string, cookieHeader: string) {
    // Extract the ID from the slug
    let id: string | undefined;

    // Check if slug is a pure numeric ID
    if (/^\d+$/.test(slug)) {
        id = slug;
    } else {
        // Extract ID from slug (the last part after the last hyphen)
        id = slug.split('-').pop();
    }

    if (!id || isNaN(parseInt(id))) {
        return null;
    }

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/post/${id}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Cookie: cookieHeader,
                },
                cache: 'no-store',
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch post data');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching post data:', error);
        return null;
    }
}

async function fetchPostTypes(cookieHeader: string) {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/post/all/type`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Cookie: cookieHeader,
                },
                cache: 'no-store',
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch post types');
        }

        const result = await response.json();
        return result?.data || [];
    } catch (error) {
        console.error('Error fetching post types:', error);
        return [];
    }
}

export default async function PostPage({
    params,
}: {
    params: { slug: string };
}) {
    const { slug } = params;

    // Get cookies for authenticated requests
    const cookieStore = cookies();
    const cookieHeader = cookieStore.getAll()
        .map((c) => `${c.name}=${c.value}`)
        .join('; ');

    // Fetch post data
    const postData = await fetchPostData(slug, cookieHeader);
    if (!postData?.data) {
        redirect('/404');
    }

    // Handle SEO-friendly URL redirects
    // If slug is a pure numeric ID and post has title, redirect to SEO-friendly URL
    if (/^\d+$/.test(slug) && postData.data?.post?.title) {
        const id = parseInt(slug);
        const seoSlug = generateSlug(postData.data.post.title, id);
        if (slug !== seoSlug) {
            redirect(`/post/${seoSlug}`);
        }
    }

    // Fetch post types for the editor
    const postTypes = await fetchPostTypes(cookieHeader);

    // Add types to the data object to pass to the PostById component
    const data = {
        ...postData.data,
        types: postTypes
    };

    return <PostById data={data} />;
} 