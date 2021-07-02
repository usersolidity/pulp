import MDEditor from '@uiw/react-md-editor';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useRouteMatch } from "react-router-dom";

export function NewArticle() {
  const { t } = useTranslation();
  let { url } = useRouteMatch();
  let { p_slug } = useParams<{ p_slug?: string }>();
  const [showPreview, setShowPreview] = React.useState<boolean | undefined>(false)
  // const showPreview = () => setShowPreview(true)

  const [value, setValue] = React.useState<string | undefined>("**Hello world!!!**");

  return (
    <div>
      <div>

      </div>
      <MDEditor.Markdown source={value} />
    </div>
  );
}
