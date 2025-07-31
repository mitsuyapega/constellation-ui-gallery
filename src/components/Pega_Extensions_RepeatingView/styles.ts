import { type themeDefinition } from '@pega/cosmos-react-core';
import styled, { css } from 'styled-components';
import { Card, CardHeader, Button, Table } from '@pega/cosmos-react-core';
import { useDirection } from '@pega/cosmos-react-core/lib/hooks';

export const StyledExpandButton = styled(Button)(({
  theme: {
    base: { animation }
  }
}) => {
  const { rtl } = useDirection();
  return css`
    svg {
      transition: transform ${animation.speed} ${animation.timing.ease};
    }
    &[aria-expanded='true'] svg {
      transform: rotate(90deg);
    }
    &[aria-expanded='false'] svg {
      transform: rotate(${rtl ? 180 : 0}deg);
    }
  `;
});

export const StyledCardHeader = styled(CardHeader)`
  align-items: center;
`;

export const StyledRecordGroup = styled(Card)(
  ({ theme }: { theme: typeof themeDefinition }) => css`
    border: 1px solid ${theme.base.palette['border-line']};
  `
);

export const StyledTable = styled(Table)`
  min-width: 600px;
  width: max-content;
  table-layout: fixed;
`;
