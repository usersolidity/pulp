import styled from 'styled-components/macro';

export const ExternalLink = styled.a`
  color: ${p => p.theme.primary};
  text-decoration: none;

  &:hover {
    text-decoration: none;
    opacity: 0.8;
  }

  &:active {
    opacity: 0.4;
  }
`;
