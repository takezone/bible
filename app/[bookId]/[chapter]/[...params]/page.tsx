'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Home from '@/app/page';

export default function BiblePage({
  params,
}: {
  params: { bookId: string; chapter: string; params?: string[] };
}) {
  const router = useRouter();

  useEffect(() => {
    // パスパラメーターをルートページに渡す
    const searchParams = new URLSearchParams();
    searchParams.set('bookId', params.bookId);
    searchParams.set('chapter', params.chapter);

    // params配列の最初の要素が節番号
    if (params.params && params.params.length > 0) {
      searchParams.set('verse', params.params[0]);
    }

    // ルートページにリダイレクト（内部的に）
    router.replace(`/?${searchParams.toString()}`);
  }, [params, router]);

  // リダイレクト中はHomeコンポーネントを表示
  return <Home />;
}
