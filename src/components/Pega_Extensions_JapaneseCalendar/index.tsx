import { type FC } from 'react';
import { useEffect, useState, useRef } from 'react';
import {
  Input,
  FieldValueList,
  Select,
  Text,
  withConfiguration,
  type InputProps,
  type FormControlProps,
  type TestIdProp,
  useTestIds,
  createTestIds,
  withTestIds,
  FieldGroup
} from '@pega/cosmos-react-core';
import '../create-nonce';
import type { FieldValueVariant } from '@pega/cosmos-react-core/lib/components/FieldValueList/FieldValueList';
import {
  convertJapaneseEraToGregorian
} from './utils';

enum DisplayMode {
  DisplayOnly = 'DISPLAY_ONLY',
  LabelsLeft = 'LABELS_LEFT',
  StackedLargeVal = 'STACKED_LARGE_VAL'
}

// interface for props
export interface PegaExtensionsJapaneseCalendarProps extends InputProps, TestIdProp {
  // If any, enter additional props that only exist on TextInput here
  hasSuggestions?: boolean;
  variant?: FieldValueVariant;
  hiraganaToKatakana: boolean;
  fullToHalf: boolean;
  lowerToUpper: boolean;
  japaneseEraToGregorian: boolean;
  gregorianToJapaneseEra: boolean;
  label: string;
  getPConnect: any;
  errorMessage: string;
  displayMode?: DisplayMode;
}

// interface for StateProps object
export interface StateProps {
  value: string;
  hasSuggestions: boolean;
}

// Test-id configuration
export const getJapaneseCalendarTestIds = createTestIds('japanese-calendar', [] as const);

// Duplicated runtime code from Constellation Design System Component

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
export const PegaExtensionsJapaneseCalendar: FC<PegaExtensionsJapaneseCalendarProps> = ({
  testId,
  getPConnect,
  errorMessage,
  displayMode,
  value,
  label,
  labelHidden,
  info,
  variant,
  hasSuggestions = false,
  ...restProps
}: PegaExtensionsJapaneseCalendarProps) => {
  const pConn = getPConnect();
  const actions = pConn.getActionsApi();
  const stateProps = pConn.getStateProps() as StateProps;
  const propName: string = stateProps.value;
  const testIds = useTestIds(testId, getJapaneseCalendarTestIds);

  const [inputValue, setInputValue] = useState(value);

  const [selectedEra, setSelectedEra] = useState<string>('令和');
  const [japaneseYear, setJapaneseYear] = useState<string>('');
  const [convertedGregorian, setConvertedGregorian] = useState<string>('');

  const [status, setStatus] = useState<FormControlProps['status']>(
    hasSuggestions ? 'pending' : undefined
  );

  const updateGregorianValue = (era: string, year: string) => {
    if (!year) {
      setConvertedGregorian('');
      return;
    }
    const warekiStr = `${era}${year}年`;
    const converted = convertJapaneseEraToGregorian(warekiStr);
    if (converted) {
      setConvertedGregorian(converted);
      actions.updateFieldValue(propName, converted);
    } else {
      setConvertedGregorian('');
    }
  };

  const handleYearChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setJapaneseYear(val);
    updateGregorianValue(selectedEra, val);
  };

  const handleEraChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newEra = e.target.value;
    setSelectedEra(newEra);
    updateGregorianValue(newEra, japaneseYear);
  };

  useEffect(() => setInputValue(value), [value]);

  useEffect(() => {
    if (errorMessage !== '') {
      setStatus('error');
    }
    if (hasSuggestions) {
      setStatus('pending');
    } else if (!hasSuggestions && status !== 'success') {
      setStatus(errorMessage !== '' ? 'error' : undefined);
    }
  }, [errorMessage, hasSuggestions, status]);

  const displayComp = inputValue || ''

  if (displayMode === DisplayMode.DisplayOnly) {
    return <Text>{displayComp}</Text>;
  }

  if (displayMode === DisplayMode.LabelsLeft) {
    return (
      <FieldValueList
        variant={labelHidden ? 'stacked' : variant}
        data-testid={testId}
        fields={[{ id: '1', name: labelHidden ? '' : label, value: displayComp }]}
      />
    );
  }

  if (displayMode === DisplayMode.StackedLargeVal) {
    return (
      <Text variant='h1' as='span'>
        {displayComp}
      </Text>
    );
  }
  return (
    <FieldGroup>
      <Select
        testId={`${testIds.root}-era`}
        label='元号'
        value={selectedEra}
        onChange={handleEraChange}
      >
        <option value='令和'>令和</option>
        <option value='平成'>平成</option>
        <option value='昭和'>昭和</option>
        <option value='大正'>大正</option>
        <option value='明治'>明治</option>
      </Select>

      <Input
        {...restProps}
        testId={`${testIds.root}-japaneseYear`}
        type='text'
        label='和暦年'
        value={japaneseYear}
        onChange={handleYearChange}
      />

      <div style={{ marginTop: '1rem' }}>
        <label style={{ marginRight: '0.5rem' }}>西暦:</label>
        <Text>{convertedGregorian}</Text>
      </div>
    </FieldGroup>
  );
};

export default withTestIds(withConfiguration(PegaExtensionsJapaneseCalendar), getJapaneseCalendarTestIds);
