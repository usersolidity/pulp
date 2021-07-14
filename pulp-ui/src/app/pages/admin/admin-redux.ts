import { createSelector, PayloadAction } from '@reduxjs/toolkit';
import { pnlp_client } from 'app/pnlp-client';
import { ArticleDto, ArticleEntity, ArticleMetadata, EnsAlias, PnlpError, PublicationDto, PublicationEntity, PublicationMetadata, PublicationSettingsEntity } from 'pnlp/domain';
import { PnlpIdentity } from 'pnlp/identity';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { RootState } from 'types';
import { createSlice } from 'utils/@reduxjs/toolkit';
import history from 'utils/history';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';

export interface PublicationState {
  requested_slug: string;

  loading: boolean;
  load_error?: PnlpError;

  writing: boolean;
  write_error?: PnlpError;

  awaiting_tx: boolean;
  tx_error?: PnlpError;

  entity: PublicationEntity;
  metadata?: PublicationMetadata;
}

export interface PublicationSettingsState {
  requested_slug: string;

  loading: boolean;
  load_error?: PnlpError;

  writing: boolean;
  write_error?: PnlpError;

  entity: PublicationSettingsEntity;
}

export interface ArticleApplicationState {
  preview: boolean;
}

export interface ArticleState {
  requested_slug: string;

  application: ArticleApplicationState;

  awaiting_tx: boolean;
  tx_error?: PnlpError;

  loading: boolean;
  load_error?: PnlpError;

  writing: boolean;
  write_error?: PnlpError;

  entity: ArticleEntity;
  metadata?: ArticleMetadata;
}

export interface IdentityState {
  loading?: boolean;
  load_error?: PnlpError;

  state?: PnlpIdentity;

  ens_alias?: string;
}

export interface CatalogueState {
  loading: boolean;
  load_error?: PnlpError;

  entities: string[];
}

export interface AdminState {
  publication: PublicationState;
  settings: PublicationSettingsState;
  article: ArticleState;
  identity: IdentityState;
  catalogue: CatalogueState;
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
      theme: {},
      tags: {},
    },
  },
};

export const initialSettingsState: PublicationSettingsState = {
  requested_slug: '',
  loading: false,
  writing: false,
  entity: {},
};

export const initialArticleState: ArticleState = {
  requested_slug: '',

  application: {
    preview: false,
  },

  awaiting_tx: false,
  loading: false,
  writing: false,

  entity: {
    publication_slug: '',
    slug: '',
  },
};

export const initialCatalogueState: CatalogueState = {
  loading: false,

  entities: [],
};

export const initialIdentityState: IdentityState = {
  loading: false,
};

export const initialState: AdminState = {
  publication: initialPublicationState,
  settings: initialSettingsState,
  article: initialArticleState,
  identity: initialIdentityState,
  catalogue: initialCatalogueState,
};

const slice = createSlice({
  name: 'adminState',
  initialState,
  reducers: {
    listPublications(state) {
      state.catalogue.loading = true;
      state.catalogue.load_error = undefined;
    },
    listPublicationsSuccess(state, action: PayloadAction<string[]>) {
      state.catalogue.loading = false;
      state.catalogue.load_error = undefined;
      state.catalogue.entities = action.payload;
    },
    listPublicationsError(state, action: PayloadAction<PnlpError>) {
      state.catalogue.loading = false;
      state.catalogue.load_error = action.payload;
    },
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
    createPublicationError(state, action: PayloadAction<PnlpError>) {
      state.publication.awaiting_tx = false;
      state.publication.tx_error = action.payload;
    },
    loadPublication(state, action: PayloadAction<string>) {
      state.publication.requested_slug = action.payload;
      state.publication.loading = true;
      state.publication.load_error = undefined;
    },
    loadPublicationSuccess(state, action: PayloadAction<PublicationEntity>) {
      state.publication.loading = true;
      state.publication.load_error = undefined;
      state.publication.entity = action.payload;
    },
    loadPublicationError(state, action: PayloadAction<PnlpError>) {
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
    updatePublicationError(state, action: PayloadAction<PnlpError>) {
      state.publication.writing = false;
      state.publication.write_error = action.payload;
    },
    setArticle(state, action: PayloadAction<ArticleEntity>) {
      state.article.entity = action.payload;
    },
    setArticleContent(state, action: PayloadAction<string | undefined>) {
      // this action only required because markdown component is outside of redux context
      state.article.entity.content = action.payload;
    },
    setArticleApplicationState(state, action: PayloadAction<ArticleApplicationState>) {
      state.article.application = action.payload;
    },
    loadArticle(state, action: PayloadAction<string>) {
      state.article.requested_slug = action.payload;
      state.article.loading = true;
      state.article.load_error = undefined;
    },
    loadArticleSuccess(state, action: PayloadAction<ArticleEntity>) {
      state.article.loading = true;
      state.article.load_error = undefined;
      state.article.entity = action.payload;
    },
    loadArticleError(state, action: PayloadAction<PnlpError>) {
      state.article.loading = false;
      state.article.load_error = action.payload;
    },
    publishArticle(state) {
      state.article.awaiting_tx = true;
      state.article.tx_error = undefined;
    },
    publishArticleSuccess(state, action: PayloadAction<ArticleDto>) {
      state.article.awaiting_tx = true;
      state.article.tx_error = undefined;
      state.article.entity = action.payload.article;
      state.article.metadata = action.payload.metadata;
    },
    publishArticleError(state, action: PayloadAction<PnlpError>) {
      state.article.awaiting_tx = false;
      state.article.tx_error = action.payload;
    },
    setSettings(state, action: PayloadAction<PublicationSettingsEntity>) {
      state.settings.entity = action.payload;
    },
    loadSettings(state, action: PayloadAction<string>) {
      state.settings.requested_slug = action.payload;
      state.settings.loading = true;
      state.settings.load_error = undefined;
    },
    loadSettingsSuccess(state, action: PayloadAction<PublicationSettingsEntity>) {
      state.settings.loading = false;
      state.settings.load_error = undefined;
      state.settings.entity = action.payload;
    },
    loadSettingsError(state, action: PayloadAction<PnlpError>) {
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
    updateSettingsError(state, action: PayloadAction<PnlpError>) {
      state.settings.writing = false;
      state.settings.write_error = action.payload;
    },
    loadIdentity(state) {
      state.identity.loading = true;
      state.identity.load_error = undefined;
    },
    loadIdentitySuccess(state, action: PayloadAction<PnlpIdentity>) {
      state.identity.loading = false;
      state.identity.load_error = undefined;
      state.identity.state = action.payload;
    },
    loadEnsSuccess(state, action: PayloadAction<EnsAlias | undefined>) {
      state.identity.ens_alias = action.payload;
    },
    loadIdentityError(state, action: PayloadAction<PnlpError>) {
      state.identity.loading = false;
      state.identity.load_error = action.payload;
    },
    clearIdentity(state) {
      state.identity.loading = false;
      state.identity.load_error = undefined;
      state.identity.state = undefined;
    },
  },
});

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.adminState || initialState;

export const selectPublication = createSelector([selectDomain], adminState => adminState.publication);

export const selectArticle = createSelector([selectDomain], adminState => adminState.article);

export const selectSettings = createSelector([selectDomain], adminState => adminState.settings);

export const selectIdentity = createSelector([selectDomain], adminState => adminState.identity);

export const selectCatalogue = createSelector([selectDomain], adminState => adminState.catalogue);

export const { actions: adminActions, reducer } = slice;

export function throwIfUnauthorized(identity: PnlpIdentity | undefined) {
  if (!identity?.ethereum_address || !identity?.ipns_key) {
    throw new Error('Unauthorized');
  }
}

/**
 * Begin Sagas
 */
export function* listPublications() {
  const identity: IdentityState = yield select(selectIdentity);
  throwIfUnauthorized(identity?.state);

  try {
    const response: string[] = yield pnlp_client.listPublications(identity!.state!.ipns_key);
    yield put(adminActions.listPublicationsSuccess(response));
  } catch (err) {
    yield put(adminActions.listPublicationsError({ message: err.message }));
  }
}

export function* createPublication() {
  const publication: PublicationState = yield select(selectPublication);
  const identity: IdentityState = yield select(selectIdentity);
  throwIfUnauthorized(identity?.state);

  try {
    const response: PublicationDto = yield pnlp_client.createPublication(publication.entity, identity!.state!.ipns_key);
    yield put(adminActions.setPublicationMetadata(response.metadata));
    yield pnlp_client.awaitTransaction(response.metadata.tx);
    yield put(adminActions.createPublicationSuccess(response.publication));
  } catch (err) {
    yield put(adminActions.createPublicationError({ message: err.message }));
  }
}

export function* updatePublication() {
  const publication: PublicationState = yield select(selectPublication);
  const identity: IdentityState = yield select(selectIdentity);
  throwIfUnauthorized(identity?.state);

  try {
    const response: PublicationEntity = yield pnlp_client.updatePublication(publication.entity, identity!.state!.ipns_key);
    yield put(adminActions.updatePublicationSuccess(response));
  } catch (err) {
    yield put(adminActions.updatePublicationError({ message: err.message }));
  }
}

export function* loadPublication() {
  const publication: PublicationState = yield select(selectPublication);
  const identity: IdentityState = yield select(selectIdentity);
  throwIfUnauthorized(identity?.state);

  try {
    const response: PublicationEntity = yield pnlp_client.loadPublication(publication.requested_slug, identity!.state!.ipns_key);
    yield put(adminActions.loadPublicationSuccess(response));
  } catch (err) {
    yield put(adminActions.loadPublicationError({ message: err.message }));
  }
}

export function* publishArticle() {
  const article: ArticleState = yield select(selectArticle);
  const identity: IdentityState = yield select(selectIdentity);

  try {
    const response: ArticleDto = yield pnlp_client.publishArticle(article.entity, identity!.state!.ipns_key);
    yield put(adminActions.publishArticleSuccess(response));
  } catch (err) {
    yield put(adminActions.publishArticleError({ message: err.message }));
  }
}

export function* loadArticle() {
  const article: ArticleState = yield select(selectArticle);
  const publication: PublicationState = yield select(selectPublication);
  const identity: IdentityState = yield select(selectIdentity);
  throwIfUnauthorized(identity?.state);

  try {
    const response: ArticleDto = yield pnlp_client.loadArticle(publication.entity.slug, article.requested_slug, identity!.state!.ipns_key);
    yield put(adminActions.publishArticleSuccess(response));
  } catch (err) {
    yield put(adminActions.publishArticleError({ message: err.message }));
  }
}

export function* updateSettings() {
  const settings: PublicationSettingsState = yield select(selectSettings);
  const publication: PublicationState = yield select(selectPublication);
  const identity: IdentityState = yield select(selectIdentity);
  throwIfUnauthorized(identity?.state);

  try {
    const response: PublicationSettingsEntity = yield pnlp_client.updatePublicationSettings(publication.entity.slug, settings.entity, identity!.state!.ipns_key);
    yield put(adminActions.updateSettingsSuccess(response));
  } catch (err) {
    yield put(adminActions.updateSettingsError({ message: err.message }));
  }
}

export function* loadSettings() {
  const settings: PublicationSettingsState = yield select(selectSettings);
  const identity: IdentityState = yield select(selectIdentity);
  throwIfUnauthorized(identity?.state);

  try {
    const response: PublicationSettingsEntity = yield pnlp_client.loadPublicationSettings(settings.requested_slug, identity!.state!.ipns_key);
    yield put(adminActions.loadSettingsSuccess(response));
  } catch (err) {
    yield put(adminActions.loadSettingsError({ message: err.message }));
  }
}

export function* loadIdentity() {
  try {
    const response: PnlpIdentity = yield pnlp_client.establishIdentity();
    yield put(adminActions.loadIdentitySuccess(response));
    const alias: EnsAlias | undefined = yield pnlp_client.lookupEns(response.ethereum_address);
    yield put(adminActions.loadEnsSuccess(alias));
    yield call([history, history.push], '/account');
  } catch (err) {
    yield put(adminActions.loadIdentityError({ message: err.message }));
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
  yield takeLatest(adminActions.loadIdentity.type, loadIdentity);
  yield takeLatest(adminActions.listPublications.type, listPublications);
}

export const useAdminSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: adminSaga });
  return { actions: slice.actions };
};
