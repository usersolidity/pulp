import { ArticleForm } from 'app/pages/admin/NewArticle/ArticleForm';
import { ArticlePreview } from 'app/pages/admin/NewArticle/ArticlePreview';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useRouteMatch } from 'react-router-dom';
import { selectArticle, selectPublication, useAppSlice } from 'store/app-state';

export function NewArticle() {
  const { t } = useTranslation();
  let { url } = useRouteMatch();
  let { publication_slug } = useParams<{ publication_slug?: string }>();
  // const showPreview = () => setShowPreview(true);
  const { actions } = useAppSlice();
  const article = useSelector(selectArticle);
  const publication = useSelector(selectPublication);
  const dispatch = useDispatch();

  return <div>{article?.application?.preview ? <ArticlePreview /> : <ArticleForm />}</div>;
}
