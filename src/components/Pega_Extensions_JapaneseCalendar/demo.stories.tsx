/* eslint-disable react/jsx-no-useless-fragment */
import type { Meta, StoryObj } from '@storybook/react';

import { PegaExtensionsJapaneseCalendar } from './index';

const meta: Meta<typeof PegaExtensionsJapaneseCalendar> = {
  title: 'Fields/Japanese Calendar',
  component: PegaExtensionsJapaneseCalendar,
  excludeStories: /.*Data$/
};

export default meta;
type Story = StoryObj<typeof PegaExtensionsJapaneseCalendar>;

const setPCore = () => {
  (window as any).PCore = {
    getComponentsRegistry: () => {
      return {
        getLazyComponent: (f: string) => f
      };
    },
    getEnvironmentInfo: () => {
      return {
        getTimeZone: () => 'local'
      };
    }
  };
};

export const Default: Story = {
  render: args => {
    setPCore();
    const props = {
      ...args,
      getPConnect: () => {
        return {
          getStateProps: () => {
            return {
              value: '.TextInputSample'
            };
          },
          getActionsApi: () => {
            return {
              updateFieldValue: () => {
                /* nothing */
              },
              triggerFieldChange: () => {
                /* nothing */
              }
            };
          },
          ignoreSuggestion: () => {
            /* nothing */
          },
          acceptSuggestion: () => {
            /* nothing */
          },
          setInheritedProps: () => {
            /* nothing */
          },
          resolveConfigProps: () => {
            /* nothing */
          }
        };
      }
    };
    return <PegaExtensionsJapaneseCalendar {...props} />;
  },
  args: {
    label: 'TextInput Sample',
    info: 'TextInput Helper Text',
    placeholder: 'TextInput Placeholder',
    testId: 'TextInput-12345678',
    readOnly: false,
    disabled: false,
    required: false,
    labelHidden: false,
    displayMode: undefined,
    variant: undefined,
    errorMessage: '',
  }
};
