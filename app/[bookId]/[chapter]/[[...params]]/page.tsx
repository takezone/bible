'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Home from '@/app/page';

export default function BiblePage() {
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const bookId = params.bookId as string;
    const chapter = params.chapter as string;
    const paramsArray = params.params as string[] | undefined;

    console.log('BiblePage useParams:', { bookId, chapter, paramsArray });

    // パスパラメーターをルートページに渡す
    const searchParams = new URLSearchParams();
    searchParams.set('bookId', bookId);
    searchParams.set('chapter', chapter);

    // params配列の最初の要素が節番号
    if (paramsArray && paramsArray.length > 0) {
      searchParams.set('verse', paramsArray[0]);
    }

    console.log('Redirecting to:', `/?${searchParams.toString()}`);

    // ルートページにリダイレクト（内部的に）
    router.replace(`/?${searchParams.toString()}`);
  }, [params, router]);

  // リダイレクト中はHomeコンポーネントを表示
  return <Home />;
}
