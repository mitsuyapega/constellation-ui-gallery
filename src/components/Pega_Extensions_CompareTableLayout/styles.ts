import styled, { css, type DefaultTheme } from 'styled-components';

export default styled.div(
  ({ displayFormat, theme }: { displayFormat: string; theme: DefaultTheme }) => {
    switch (displayFormat) {
      case 'radio-button-card':
        return css`
          & > fieldset > div {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
            grid-gap: 0.5rem;
            overflow: hidden;
            padding: 0.2rem;
          }
          & > fieldset > div > label {
            display: block;
          }
          & > fieldset > div > label > div {
            align-items: start !important;
          }
        `;
      case 'financialreport':
        return css`
          & table {
            border-collapse: collapse;
            width: 100%;
            table-layout: fixed;
          }

          & td,
          & th {
            border-bottom: 0.0625rem solid rgb(207, 207, 207);
            padding: 0.25rem 0.5rem;
          }

          & td,
          & thead th {
            text-align: end;
            font-weight: 400;
          }

          & caption {
            padding: 0.5rem;
          }

          & tbody th {
            font-weight: 400;
            text-align: start;
          }

          & thead > tr > th:first-child {
            opacity: 0;
          }

          & thead > tr > th > span {
            font-weight: 800;
          }

          tr.total.cat-2 {
            background-color: rgba(207, 207, 207, 0.3);
          }

          & tbody tr.total > th {
            font-weight: 600;
            text-align: start;
          }
          & tbody tr.cat-1 > th {
            padding: 1rem 0.5rem;
            font-size: 1.1rem;
          }
        `;
      case 'spreadsheet':
      default:
        return css`
          & table {
            border-collapse: collapse;
            border: 0.125rem solid rgb(207, 207, 207);
            width: 100%;
            table-layout: fixed;
          }

          & td,
          & th {
            border: 0.125rem solid rgb(190, 190, 190);
            padding: 0.5rem 1rem;
          }

          & thead th,
          & tbody tr.total {
            background-color: rgba(207, 207, 207, 0.3);
          }

          & tbody tr.cat-1 > th {
            padding: 1rem 0.5rem;
            font-size: 1.1rem;
          }
          & tbody tr.cat-2 > th {
            padding-left: 1rem;
            text-align: left;
          }

          & tbody tr {
            text-align: center;
          }

          & caption {
            padding: 0.5rem;
          }

          & thead > tr > th > span {
            font-weight: 800;
          }

          & .selection label {
            border: 0.125rem solid ${theme.components.button.color};
            border-radius: ${`${theme.components.button['border-radius']}rem`};
            background: ${theme.components.button.color};
            display: block;
          }

          & .selection label > div {
            font-size: 1rem;
            width: 100%;
            display: flex;
            justify-content: center;
            text-align: center;
            min-width: unset;
            max-width: unset;
            color: #ffffff;
          }
          & .selection label > div > div {
            color: #ffffff;
          }
          & .selection :not(input:checked) + div > div {
            display: none;
          }
        `;
    }
  }
);
