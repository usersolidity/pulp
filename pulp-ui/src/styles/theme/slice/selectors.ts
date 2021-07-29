import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'types';
import { initialState } from '.';
import { themes } from '../themes';

export const selectTheme = createSelector([(state: RootState) => state.theme || initialState], theme => {
  // TODO: theme per publication
  return themes.light;
});

export const selectThemeKey = createSelector([(state: RootState) => state.theme || initialState], theme => theme.selected);
