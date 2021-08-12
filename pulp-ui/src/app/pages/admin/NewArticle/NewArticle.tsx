import { ArticleForm } from 'app/pages/admin/NewArticle/ArticleForm';
import { ArticlePreview } from 'app/pages/admin/NewArticle/ArticlePreview';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { selectArticle } from 'store/app-state';

export function NewArticle() {
  const article = useSelector(selectArticle);

  return <div>{article?.application?.preview ? <ArticlePreview /> : <ArticleForm />}</div>;
}
