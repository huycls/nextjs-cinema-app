import { getMoviesByParams } from "@/lib/api";
import Films from "./film-list";
import { LinkRouter } from "@/components/ui/linkRouter";

export async function generateStaticParams() {
  try {
    // Fetch first page of movies to generate static pages
    const dataType =  [{slug: "phim-bo"}, {slug: "phim-le"}, {slug:"tv-shows"}, {slug:"hoat-hinh"}, {slug:"phim-vietsub"}, {slug:"phim-thuyet-minh"}, {slug:"phim-long-tieng"}];
    // Filter out any invalid slugs
    return dataType
  } catch (error) {
    console.error('Failed to generate static params:', error);
    // Return at least one valid path to prevent build errors
    return [{ slug: 'placeholder' }];
  }
}

export default async function ListPage({ params }: { params: { slug: string } }) {
  if (!params?.slug) {
    return (
      <main className="min-h-screen bg-transparent py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold">Invalid movie URL</h1>
          <LinkRouter href="/" className="text-primary hover:underline">
            Quay lại trang chủ
          </LinkRouter>
        </div>
      </main>
    );
  }

  try {
    const movie = await getMoviesByParams({type_list: params.slug, page: 1, params: ""});
    
    if (!movie) {
      throw new Error('Không tìm thấy');
    }

    return <>
    <Films data={{ ...movie, slug: params.slug }} />
    </>;
  } catch (error) {
    return (
      <main className="min-h-screen bg-transparent py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold">Không tìm thấy</h1>
          <LinkRouter href="/" className="text-primary hover:underline">
          Quay lại trang chủ
          </LinkRouter>
        </div>
      </main>
    );
  }
}