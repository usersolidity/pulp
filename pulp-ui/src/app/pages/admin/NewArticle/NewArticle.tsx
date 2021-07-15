import { selectArticle, selectPublication, useAdminSlice } from 'app/pages/admin/admin-redux';
import { ArticleForm } from 'app/pages/admin/NewArticle/ArticleForm';
import { ArticlePreview } from 'app/pages/admin/NewArticle/ArticlePreview';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useRouteMatch } from 'react-router-dom';

export function NewArticle() {
  const { t } = useTranslation();
  let { url } = useRouteMatch();
  let { p_slug } = useParams<{ p_slug?: string }>();
  // const showPreview = () => setShowPreview(true)
  const { actions } = useAdminSlice();
  const article = useSelector(selectArticle);
  const publication = useSelector(selectPublication);
  const dispatch = useDispatch();

  return <div>{article?.application?.preview ? <ArticlePreview /> : <ArticleForm />}</div>;
}
