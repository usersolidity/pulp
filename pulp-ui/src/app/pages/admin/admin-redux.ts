import { createSelector, PayloadAction } from '@reduxjs/toolkit';
import { pnlp_client } from 'app/pnlp-client';
import { ArticleDto, ArticleEntity, ArticleMetadata, PublicationDto, PublicationEntity, PublicationMetadata, PublicationSettingsEntity, PulpError } from 'pnlp/domain';
import { put, select, takeLatest } from 'redux-saga/effects';
import { RootState } from 'types';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';

export interface PublicationState {
  requested_slug: string;

  loading: boolean;
  load_error?: PulpError;

  writing: boolean;
  write_error?: PulpError;

  awaiting_tx: boolean;
  tx_error?: PulpError;

  entity: PublicationEntity;
  metadata?: PublicationMetadata;
}

export interface PublicationSettingsState {
  loading: boolean;
  load_error?: PulpError;

  writing: boolean;
  write_error?: PulpError;

  entity: PublicationSettingsEntity;
}

export interface ArticleState {
  requested_slug: string;

  draft: boolean;
  preview: boolean; // preview == true should simply show default article view page. draft == true should add annotations to that page.

  awaiting_tx: boolean;
  tx_error?: PulpError;

  loading: boolean;
  load_error?: PulpError;

  writing: boolean;
  write_error?: PulpError;

  entity: ArticleEntity;
  metadata?: ArticleMetadata;
}

export interface AdminState {
  publication: PublicationState;
  settings: PublicationSettingsState;
  article: ArticleState;
}

export const initialPublicationState: PublicationState = {
  requested_slug: '',
  loading: false,
  awaiting_tx: false,
  writing: false,
  entity: {
    slug: '',
    publisher: '',
    articles: {},
    properties: {
      title: '',
      tagline: '',
      img_url: '',
      header_url: '',
      primary_color: '',
      secondary_color: '',
      tags: {},
    },
  },
}

export const initialSettingsState: PublicationSettingsState = {
  loading: false,
  writing: false,
  entity: {},
};

export const initialArticleState: ArticleState = {
  requested_slug: '',

  draft: true,
  preview: false,

  awaiting_tx: false,
  loading: false,
  writing: false,

  entity: {
    publication_slug: '',
    slug: '',
  },
};

export const initialState: AdminState = {
  publication: initialPublicationState,
  settings: initialSettingsState,
  article: initialArticleState,
};

const slice = createSlice({
  name: 'adminState',
  initialState,
  reducers: {
    setPublication(state, action: PayloadAction<PublicationEntity>) {
      state.publication.entity = action.payload;
    },
    createPublication(state) {
      state.publication.awaiting_tx = true;
      state.publication.tx_error = undefined;
    },
    setPublicationMetadata(state, action: PayloadAction<PublicationMetadata>) {
      state.publication.metadata = action.payload;
    },
    createPublicationSuccess(state, action: PayloadAction<PublicationEntity>) {
      state.publication.awaiting_tx = false;
      state.publication.tx_error = undefined;
      state.publication.entity = action.payload;
    },
    createPublicationError(state, action: PayloadAction<PulpError>) {
      state.publication.awaiting_tx = false;
      state.publication.tx_error = action.payload;
    },
    loadPublication(state) {
      state.publication.loading = true;
      state.publication.load_error = undefined;
    },
    loadPublicationSuccess(state, action: PayloadAction<PublicationEntity>) {
      state.publication.loading = true;
      state.publication.load_error = undefined;
      state.publication.entity = action.payload;
    },
    loadPublicationError(state, action: PayloadAction<PulpError>) {
      state.publication.loading = false;
      state.publication.load_error = action.payload;
    },
    updatePublication(state) {
      state.publication.loading = true;
      state.publication.load_error = undefined;
    },
    updatePublicationSuccess(state, action: PayloadAction<PublicationEntity>) {
      state.publication.loading = false;
      state.publication.load_error = undefined;
      state.publication.entity = action.payload;
    },
    updatePublicationError(state, action: PayloadAction<PulpError>) {
      state.publication.writing = false;
      state.publication.write_error = action.payload;
    },
    setArticle(state, action: PayloadAction<ArticleEntity>) {
      state.article.entity = action.payload;
    },
    loadArticle(state) {
      state.article.loading = true;
      state.article.load_error = undefined;
    },
    loadArticleSuccess(state, action: PayloadAction<ArticleEntity>) {
      state.article.loading = true;
      state.article.load_error = undefined;
      state.article.entity = action.payload;
    },
    loadArticleError(state, action: PayloadAction<PulpError>) {
      state.article.loading = false;
      state.article.load_error = action.payload;
    },
    publishArticle(state) {
      state.article.draft = false;
      state.article.preview = true;
      state.article.awaiting_tx = true;
      state.article.tx_error = undefined;
    },
    publishArticleSuccess(state, action: PayloadAction<ArticleDto>) {
      state.article.draft = false;
      state.article.preview = true;
      state.article.awaiting_tx = true;
      state.article.tx_error = undefined;
      state.article.entity = action.payload.article;
      state.article.metadata = action.payload.metadata;
    },
    publishArticleError(state, action: PayloadAction<PulpError>) {
      state.article.draft = true;
      state.article.preview = false;
      state.article.awaiting_tx = false;
      state.article.tx_error = action.payload;
    },
    setSettings(state, action: PayloadAction<PublicationSettingsEntity>) {
      state.settings.entity = action.payload;
    },
    loadSettings(state) {
      state.settings.loading = true;
      state.settings.load_error = undefined;
    },
    loadSettingsSuccess(state, action: PayloadAction<PublicationSettingsEntity>) {
      state.settings.loading = true;
      state.settings.load_error = undefined;
      state.settings.entity = action.payload;
    },
    loadSettingsError(state, action: PayloadAction<PulpError>) {
      state.settings.loading = false;
      state.settings.load_error = action.payload;
    },
    updateSettings(state) {
      state.settings.loading = true;
      state.settings.load_error = undefined;
    },
    updateSettingsSuccess(state, action: PayloadAction<PublicationSettingsEntity>) {
      state.settings.loading = false;
      state.settings.load_error = undefined;
    },
    updateSettingsError(state, action: PayloadAction<PulpError>) {
      state.settings.writing = false;
      state.settings.write_error = action.payload;
    },
  },
});

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.adminState || initialState;

export const selectPublication = createSelector(
  [selectDomain],
  adminState => adminState.publication,
);

export const selectArticle = createSelector(
  [selectDomain],
  adminState => adminState.article,
);

export const selectSettings = createSelector(
  [selectDomain],
  adminState => adminState.settings,
);


export const { actions: adminActions, reducer } = slice;

/**
 * Begin Sagas
 */
export function* createPublication() {
  const publication: PublicationState = yield select(selectPublication);
  try {
    const response: PublicationDto = yield pnlp_client.createPublication(publication.entity);
    yield put(adminActions.setPublicationMetadata(response.metadata));
    yield pnlp_client.awaitTransaction(response.metadata.tx);
    yield put(adminActions.createPublicationSuccess(response.publication));
  } catch (err) {
    yield put(adminActions.createPublicationError(err));
  }
}

export function* updatePublication() {
  const publication: PublicationState = yield select(selectPublication);

  try {
    const response: PublicationEntity = yield pnlp_client.updatePublication(publication.entity);
    yield put(adminActions.updatePublicationSuccess(response));
  } catch (err) {
    yield put(adminActions.updatePublicationError(err));
  }
}

export function* loadPublication() {
  const publication: PublicationState = yield select(selectPublication);

  try {
    const response: PublicationEntity = yield pnlp_client.loadPublication(publication.requested_slug);
    yield put(adminActions.loadPublicationSuccess(response));
  } catch (err) {
    yield put(adminActions.loadPublicationError(err));
  }
}

export function* publishArticle() {
  const article: ArticleState = yield select(selectArticle);

  try {
    const response: ArticleDto = yield pnlp_client.publishArticle(article.entity);
    yield put(adminActions.publishArticleSuccess(response));
  } catch (err) {
    yield put(adminActions.publishArticleError(err));
  }
}

export function* loadArticle() {
  const article: ArticleState = yield select(selectArticle);
  const publication: PublicationState = yield select(selectPublication);

  try {
    const response: ArticleDto = yield pnlp_client.loadArticle(publication.entity.slug, article.requested_slug);
    yield put(adminActions.publishArticleSuccess(response));
  } catch (err) {
    yield put(adminActions.publishArticleError(err));
  }
}

export function* updateSettings() {
  const settings: PublicationSettingsState = yield select(selectSettings);
  const publication: PublicationState = yield select(selectPublication);

  try {
    const response: PublicationSettingsEntity = yield pnlp_client.updatePublicationSettings(publication.entity.slug, settings.entity);
    yield put(adminActions.updateSettingsSuccess(response));
  } catch (err) {
    yield put(adminActions.updateSettingsError(err));
  }
}

export function* loadSettings() {
  const publication: PublicationState = yield select(selectPublication);

  try {
    const response: PublicationSettingsEntity = yield pnlp_client.loadPublicationSettings(publication.entity.slug);
    yield put(adminActions.loadSettingsSuccess(response));
  } catch (err) {
    yield put(adminActions.loadSettingsError(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* adminSaga() {
  // Watches for loadRepos actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest(adminActions.updatePublication.type, updatePublication);
  yield takeLatest(adminActions.createPublication.type, createPublication);
  yield takeLatest(adminActions.updatePublication.type, updatePublication);
  yield takeLatest(adminActions.loadPublication.type, loadPublication);
  yield takeLatest(adminActions.publishArticle.type, publishArticle);
  yield takeLatest(adminActions.loadArticle.type, loadArticle);
  yield takeLatest(adminActions.updateSettings.type, updateSettings);
  yield takeLatest(adminActions.loadSettings.type, loadSettings);
}

export const useAdminSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: adminSaga });
  return { actions: slice.actions };
};
