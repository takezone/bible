'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Home from '@/app/page';

export default function BiblePage() {
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const book = params.bookId as string;
    const chapter = params.chapter as string;
    const paramsArray = params.params as string[] | undefined;

    // パスパラメーターをクエリパラメータに変換してリダイレクト
    const searchParams = new URLSearchParams();
    searchParams.set('book', book);
    searchParams.set('chapter', chapter);

    // params配列の最初の要素が節番号
    if (paramsArray && paramsArray.length > 0) {
      searchParams.set('verse', paramsArray[0]);
    }

    // ルートページにリダイレクト（内部的に）
    router.replace(`/?${searchParams.toString()}`);
  }, [params, router]);

  // リダイレクト中はHomeコンポーネントを表示
  return <Home />;
}
