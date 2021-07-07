import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'types';
import { initialState } from '.';
import { themes } from '../themes';

export const selectTheme = createSelector([(state: RootState) => state], state => {
  const theme = state.theme || initialState;
  const publication_theme = state.adminState?.publication?.entity?.properties?.theme || {};
  // if (theme.selected === 'system') {
  //   return isSystemDark ? themes.dark : themes.light;
  // } TODO: does a dark theme make any sense if we let publishers choose theme? probably not

  return {
    ...themes[theme.selected],
    ...publication_theme,
  };
});

export const selectThemeKey = createSelector([(state: RootState) => state.theme || initialState], theme => theme.selected);
