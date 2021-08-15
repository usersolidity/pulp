import { createSelector, PayloadAction } from '@reduxjs/toolkit';
import { pnlp_client } from 'app/pnlp-client';
import {
  ArticleDto,
  ArticleEntity,
  ArticleMetadata,
  ArticleSlug,
  DAIx_CONTRACT_ADDRESS,
  DEFAULT_FLOW,
  EnsAlias,
  friendlyName,
  PnlpError,
  PublicationDto,
  PublicationEntity,
  PublicationMetadata,
  PublicationSettingsEntity,
  ReviewEntity,
  ReviewRequestEntity,
  SubscriberList,
  SubscriptionEntity
} from 'pnlp/domain';
import { PnlpIdentity } from 'pnlp/identity';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { RootState } from 'types';
import { createSlice } from 'utils/@reduxjs/toolkit';
import history from 'utils/history';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';

export interface SubscriptionState {
  enrolled: boolean;
  loading: boolean;
  error?: PnlpError;
  entity: SubscriptionEntity;
}

export interface ReviewRequestState {
  requested_address?: string;

  loading: boolean;
  error?: PnlpError;

  list: ReviewRequestEntity[];
}

export interface ReviewState {
  loading: boolean;
  error?: PnlpError;
  entity: ReviewEntity;
}

export interface PublicationState {
  requested_slug: string;

  loading: boolean;
  load_error?: PnlpError;

  writing: boolean;
  write_error?: PnlpError;

  awaiting_tx: boolean;
  tx_error?: PnlpError;

  founder_ens_alias?: EnsAlias;

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
  requested_slug?: ArticleSlug;

  application: ArticleApplicationState;

  awaiting_tx: boolean;
  tx_error?: PnlpError;

  loading: boolean;
  load_error?: PnlpError;

  writing: boolean;
  write_error?: PnlpError;

  author_ens_alias?: EnsAlias;

  entity: ArticleEntity;
  metadata?: ArticleMetadata;

  reviews: ReviewEntity[];
}

export interface IdentityState {
  loading?: boolean;
  load_error?: PnlpError;

  state?: PnlpIdentity;

  ens_alias?: EnsAlias;
}

export interface CatalogueState {
  loading: boolean;
  load_error?: PnlpError;

  entities: string[];
}

export interface SubscriberListState {
  loading: boolean;
  requested_token: string;

  load_error?: PnlpError;

  entity?: SubscriberList;
}

export interface AppState {
  publication: PublicationState;
  settings: PublicationSettingsState;
  subscribers: SubscriberListState;
  article: ArticleState;
  identity: IdentityState;
  catalogue: CatalogueState;
  subscription: SubscriptionState;
  review_requests: ReviewRequestState;
  review: ReviewState;
}

export const initialSubscriptionState: SubscriptionState = {
  enrolled: false,
  loading: false,
  entity: {
    subscriber: '',
    recipient: '',
    amount: DEFAULT_FLOW,
    token: DAIx_CONTRACT_ADDRESS,
  },
};

export const initialPublicationState: PublicationState = {
  requested_slug: '',
  loading: false,
  awaiting_tx: false,
  writing: false,
  entity: {
    slug: 'the-pulp-dev-blog',
    founder: '',
    articles: {},
    properties: {
      title: 'The Pulp Dev Blog',
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
  application: {
    preview: false,
  },

  awaiting_tx: false,
  loading: false,
  writing: false,

  entity: {
    publication_slug: '',
    slug: '',
    title: '',
    subtitle: '',
    content: '',
  },

  reviews: [],
};

export const initialCatalogueState: CatalogueState = {
  loading: false,

  entities: [],
};

export const initialSubscriberList: SubscriberListState = {
  loading: false,
  requested_token: DAIx_CONTRACT_ADDRESS,

  entity: {
    subscribers: [],
  },
};

export const initialIdentityState: IdentityState = {
  loading: false,
};

export const initialReviewRequestsState: ReviewRequestState = {
  loading: false,
  list: [],
};

export const initialReviewState: ReviewState = {
  loading: false,
  entity: {
    approved: false,
    rating: 5,
    article: '',
    reviewer: '',
  },
};

export const initialState: AppState = {
  publication: initialPublicationState,
  settings: initialSettingsState,
  subscribers: initialSubscriberList,
  article: initialArticleState,
  identity: initialIdentityState,
  catalogue: initialCatalogueState,
  subscription: initialSubscriptionState,
  review_requests: initialReviewRequestsState,
  review: initialReviewState,
};

const slice = createSlice({
  name: 'appState',
  initialState,
  reducers: {
    createSubscription(state) {
      state.subscription.loading = true;
      state.subscription.error = undefined;
    },
    setSubscription(state, action: PayloadAction<SubscriptionEntity>) {
      state.subscription.entity = action.payload;
    },
    createSubscriptionSuccess(state, action: PayloadAction<SubscriptionEntity>) {
      state.subscription.loading = false;
      state.subscription.error = undefined;
      state.subscription.entity = action.payload;
    },
    createSubscriptionError(state, action: PayloadAction<PnlpError>) {
      state.subscription.enrolled = false;
      state.subscription.error = action.payload;
    },
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
    createPublicationSuccess(state, action: PayloadAction<PublicationDto>) {
      state.publication.awaiting_tx = false;
      state.publication.tx_error = undefined;
      state.publication.entity = action.payload.publication;
      state.publication.metadata = action.payload.metadata;
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
    loadPublicationSuccess(state, action: PayloadAction<PublicationDto>) {
      state.publication.loading = false;
      state.publication.load_error = undefined;
      state.publication.entity = action.payload.publication;
      state.publication.metadata = action.payload.metadata;
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
    setArticleMetadata(state, action: PayloadAction<ArticleMetadata>) {
      state.article.metadata = action.payload;
    },
    loadArticle(state, action: PayloadAction<ArticleSlug>) {
      state.article.requested_slug = action.payload;
      state.article.loading = true;
      state.article.load_error = undefined;
    },
    loadArticleSuccess(state, action: PayloadAction<ArticleDto>) {
      state.article.loading = true;
      state.article.load_error = undefined;
      state.article.entity = action.payload.article;
      state.article.metadata = action.payload.metadata;
      state.article.reviews = action.payload.reviews;
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
    publishArticleWriteError(state, action: PayloadAction<PnlpError>) {
      state.article.awaiting_tx = false;
      state.article.write_error = action.payload;
    },
    publishArticleTxError(state, action: PayloadAction<PnlpError>) {
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
    listReviewRequests(state, action: PayloadAction<string>) {
      state.review_requests.loading = true;
      state.review_requests.error = undefined;
      state.review_requests.requested_address = action.payload;
    },
    listReviewRequestsSuccess(state, action: PayloadAction<ReviewRequestEntity[]>) {
      state.review_requests.loading = false;
      state.review_requests.list = action.payload;
    },
    listReviewRequestsError(state, action: PayloadAction<PnlpError>) {
      state.review_requests.loading = false;
      state.review_requests.error = action.payload;
    },
    setReview(state, action: PayloadAction<ReviewEntity>) {
      state.review.entity = action.payload;
    },
    requestReview(state) {
      state.review.loading = true;
      state.review.error = undefined;
    },
    requestReviewSuccess(state, action: PayloadAction<ReviewEntity>) {
      state.review_requests.loading = false;
      state.review.entity = action.payload;
    },
    requestReviewError(state, action: PayloadAction<PnlpError>) {
      state.review_requests.loading = false;
      state.review_requests.error = action.payload;
    },
    reviewArticle(state) {
      state.review.loading = true;
      state.review.error = undefined;
    },
    reviewArticleSuccess(state, action: PayloadAction<ReviewEntity>) {
      state.review.loading = false;
      state.review.entity = action.payload;
    },
    reviewArticleError(state, action: PayloadAction<PnlpError>) {
      state.review.loading = false;
      state.review.error = action.payload;
    },
    listSubscribers(state) {
      state.subscribers.loading = true;
      state.subscribers.load_error = undefined;
    },
    listSubscribersSuccess(state, action: PayloadAction<SubscriberList>) {
      state.subscribers.loading = false;
      state.subscribers.load_error = undefined;
      state.subscribers.entity = action.payload;
    },
    listSubscribersError(state, action: PayloadAction<PnlpError>) {
      state.subscribers.loading = false;
      state.subscribers.load_error = action.payload;
    },
  },
});

// First select the relevant part from the state
const selectDomain = (state: RootState) => state.appState || initialState;

export const selectSubscription = createSelector([selectDomain], appState => appState.subscription);

export const selectSubscriberList = createSelector([selectDomain], appState => appState.subscribers);

export const selectReview = createSelector([selectDomain], appState => appState.review);

export const selectReviewRequests = createSelector([selectDomain], appState => appState.review_requests);

export const selectPublication = createSelector([selectDomain], appState => appState.publication);

export const selectArticle = createSelector([selectDomain], appState => appState.article);

export const selectSettings = createSelector([selectDomain], appState => appState.settings);

export const selectIdentity = createSelector([selectDomain], appState => appState.identity);

export const selectCatalogue = createSelector([selectDomain], appState => appState.catalogue);

export const selectNewAccount = createSelector([selectDomain], appState => !appState.catalogue?.loading && !appState.catalogue.entities?.length);

export const selectIpfsLoading = createSelector([selectDomain], appState => {
  return appState.catalogue.loading || appState.publication.loading || appState.article.loading;
});

export const selectIpfsWriting = createSelector([selectDomain], appState => {
  return appState.publication.writing || appState.article.writing;
});

export const selectAwaitingTransaction = createSelector([selectDomain], appState => {
  return appState.publication.awaiting_tx || appState.article.awaiting_tx;
});

export const selectUserFriendlyName = createSelector([selectDomain], appState => friendlyName(appState?.identity?.state?.ethereum_address, appState?.identity?.ens_alias));

export const selectAuthorFriendlyName = createSelector([selectDomain], appState => friendlyName(appState?.article?.entity?.author, appState?.article?.author_ens_alias));

export const selectFounderFriendlyName = createSelector([selectDomain], appState => friendlyName(appState?.publication?.entity?.founder, appState?.publication?.founder_ens_alias));

export const selectArticleUrl = createSelector([selectDomain], appState => `pnlp://${appState.publication.entity.slug}/${appState.article.entity.slug}`);

export const { actions: appActions, reducer } = slice;

export function throwIfUnauthorized(identity: PnlpIdentity | undefined) {
  if (!identity?.ethereum_address || !identity?.ipns_key) {
    throw new Error('Unauthorized');
  }
}

/**
 * Begin Sagas
 */
export function* reviewArticle() {
  const review: ReviewState = yield select(selectReview);
  try {
    yield pnlp_client.reviewArticle(review.entity);
    yield put(appActions.reviewArticleSuccess(review.entity));
  } catch (err) {
    yield put(appActions.reviewArticleError({ message: err.message }));
  }
}

export function* createSubscription() {
  const subscription: SubscriptionState = yield select(selectSubscription);
  const publication: PublicationState = yield select(selectPublication);
  try {
    yield pnlp_client.subscribe(publication.entity.slug, subscription.entity.token, parseInt(subscription.entity.amount));
    yield put(appActions.createSubscriptionSuccess(subscription.entity));
  } catch (err) {
    yield put(appActions.createSubscriptionError({ message: JSON.stringify(err) }));
  }
}

export function* listSubscribers() {
  const identity: IdentityState = yield select(selectIdentity);
  const subscribers: SubscriberListState = yield select(selectSubscriberList);
  throwIfUnauthorized(identity?.state);

  try {
    const subscriberList: SubscriberList = yield pnlp_client.listSubscribers(subscribers.requested_token);
    yield put(appActions.listSubscribersSuccess(subscriberList));
  } catch (err) {
    yield put(appActions.listSubscribersError({ message: err.message }));
  }
}

export function* listPublications() {
  const identity: IdentityState = yield select(selectIdentity);
  throwIfUnauthorized(identity?.state);

  try {
    const response: string[] = yield pnlp_client.listPublications(identity!.state!.ipns_key);
    yield put(appActions.listPublicationsSuccess(response));
  } catch (err) {
    yield put(appActions.listPublicationsError({ message: err.message }));
  }
}

export function* createPublication() {
  const publication: PublicationState = yield select(selectPublication);
  const identity: IdentityState = yield select(selectIdentity);
  throwIfUnauthorized(identity?.state);

  try {
    const response: PublicationDto = yield pnlp_client.createPublication(publication.entity, identity!.state!.ipns_key);
    yield put(appActions.setPublicationMetadata(response.metadata));
    yield pnlp_client.awaitTransaction(response.metadata.tx);
    yield put(appActions.createPublicationSuccess(response));
  } catch (err) {
    yield put(appActions.createPublicationError({ message: err.message }));
  }
}

export function* updatePublication() {
  const publication: PublicationState = yield select(selectPublication);
  const identity: IdentityState = yield select(selectIdentity);
  throwIfUnauthorized(identity?.state);

  try {
    const response: PublicationEntity = yield pnlp_client.updatePublication(publication.entity, identity!.state!.ipns_key);
    yield put(appActions.updatePublicationSuccess(response));
  } catch (err) {
    yield put(appActions.updatePublicationError({ message: err.message }));
  }
}

export function* loadPublication() {
  const publication: PublicationState = yield select(selectPublication);

  try {
    const response: PublicationDto = yield pnlp_client.loadPublication(publication.requested_slug);
    yield put(appActions.loadPublicationSuccess(response));
  } catch (err) {
    yield put(appActions.loadPublicationError({ message: err.message }));
  }
}

export function* publishArticle() {
  const publication: PublicationState = yield select(selectPublication);
  const article: ArticleState = yield select(selectArticle);
  const identity: IdentityState = yield select(selectIdentity);
  throwIfUnauthorized(identity?.state);

  try {
    const response: ArticleDto = yield pnlp_client.publishArticle(article.entity, identity!.state!.ipns_key);
    yield put(appActions.setArticleMetadata(response.metadata));
    console.log(response.metadata.tx);
    yield pnlp_client.awaitTransaction(response.metadata.tx);
    yield put(appActions.publishArticleSuccess(response));
    yield call([history, history.push], `/read/${publication.entity.slug}/on/${article.entity.slug}`);
  } catch (err) {
    console.log(err);
    yield put(appActions.publishArticleTxError({ message: JSON.stringify(err) }));
  }
}

export function* loadArticle() {
  const article: ArticleState = yield select(selectArticle);
  if (!article.requested_slug) {
    throw new Error('Cannot load article without article and publication slug');
  }

  try {
    const response: ArticleDto = yield pnlp_client.loadArticle(article.requested_slug.publication_slug, article.requested_slug.article_slug);
    yield put(appActions.loadArticleSuccess(response));
  } catch (err) {
    yield put(appActions.loadArticleError({ message: err.message }));
  }
}

export function* updateSettings() {
  const settings: PublicationSettingsState = yield select(selectSettings);
  const publication: PublicationState = yield select(selectPublication);
  const identity: IdentityState = yield select(selectIdentity);
  throwIfUnauthorized(identity?.state);

  try {
    const response: PublicationSettingsEntity = yield pnlp_client.updatePublicationSettings(publication.entity.slug, settings.entity, identity!.state!.ipns_key);
    yield put(appActions.updateSettingsSuccess(response));
  } catch (err) {
    yield put(appActions.updateSettingsError({ message: err.message }));
  }
}

export function* loadSettings() {
  const settings: PublicationSettingsState = yield select(selectSettings);

  try {
    const response: PublicationSettingsEntity = yield pnlp_client.loadPublicationSettings(settings.requested_slug);
    yield put(appActions.loadSettingsSuccess(response));
  } catch (err) {
    yield put(appActions.loadSettingsError({ message: err.message }));
  }
}

export function* loadIdentity() {
  try {
    const response: PnlpIdentity = yield pnlp_client.establishIdentity();
    yield put(appActions.loadIdentitySuccess(response));
    const alias: EnsAlias | undefined = yield pnlp_client.lookupEns(response.ethereum_address);
    yield put(appActions.loadEnsSuccess(alias));
    yield call([history, history.push], '/account');
  } catch (err) {
    yield put(appActions.loadIdentityError({ message: err.message }));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* appSaga() {
  // Watches for loadRepos actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest(appActions.updatePublication.type, updatePublication);
  yield takeLatest(appActions.createPublication.type, createPublication);
  yield takeLatest(appActions.updatePublication.type, updatePublication);
  yield takeLatest(appActions.loadPublication.type, loadPublication);
  yield takeLatest(appActions.publishArticle.type, publishArticle);
  yield takeLatest(appActions.loadArticle.type, loadArticle);
  yield takeLatest(appActions.updateSettings.type, updateSettings);
  yield takeLatest(appActions.loadSettings.type, loadSettings);
  yield takeLatest(appActions.loadIdentity.type, loadIdentity);
  yield takeLatest(appActions.listPublications.type, listPublications);
  yield takeLatest(appActions.createSubscription.type, createSubscription);
  yield takeLatest(appActions.listSubscribers.type, listSubscribers);
  yield takeLatest(appActions.reviewArticle.type, reviewArticle);
}

export const useAppSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer });
  useInjectSaga({ key: slice.name, saga: appSaga });
  return { actions: slice.actions };
};
