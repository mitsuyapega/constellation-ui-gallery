import {
  withConfiguration,
  Card,
  CardContent,
  Progress,
  Flex,
  Icon,
  registerIcon,
  ExpandCollapse,
  Text
} from '@pega/cosmos-react-core';
import * as caretRightIcon from '@pega/cosmos-react-core/lib/components/Icon/icons/caret-right.icon';
import type { ColumnProps } from '@pega/cosmos-react-core/lib/components/Table/Table';

import '../create-nonce';
import { useEffect, useMemo, useState, Fragment } from 'react';
import { StyledExpandButton, StyledCardHeader, StyledRecordGroup, StyledTable } from './styles';

registerIcon(caretRightIcon);

type RepeatingViewProps = {
  source?: 'property' | 'datapage';
  parentDatapage?: string | { referenceList: string };
  childDatapage?: string | { referenceList: string };
  parentProperty?: string;
  childProperty?: string;
  childColumns?: string;
  parentColumns?: string;
  parentKey?: string;
  childKey?: string;
  targetViews?: any;
  getPConnect: any;
};

interface RowData {
  id: string | number;
  [key: string]: any;
}

interface ColumnDef {
  label: string;
  renderer: string;
}

export const PegaExtensionsRepeatingView = (props: RepeatingViewProps) => {
  const {
    source = 'datapage',
    parentDatapage,
    childDatapage,
    parentProperty,
    childProperty,
    childColumns = '',
    parentColumns = '',
    parentKey = 'id',
    childKey = 'parentId',
    targetViews,
    getPConnect
  } = props;
  const localizedVal = (window as any).PCore.getLocaleUtils().getLocaleValue;
  const effectiveParentDataPage =
    typeof parentDatapage === 'object' && parentDatapage?.referenceList
      ? parentDatapage.referenceList
      : parentDatapage;
  const effectiveChildDataPage =
    typeof childDatapage === 'object' && childDatapage?.referenceList
      ? childDatapage.referenceList
      : childDatapage;

  const [parentData, setParentData] = useState<any[]>([]);
  const [childData, setChildData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [collapsedState, setCollapsedState] = useState<Record<string | number, boolean>>({});

  const dataPageUtils = useMemo(() => (window as any).PCore.getDataPageUtils(), []);

  useEffect(() => {
    setLoading(true);

    if (source === 'datapage' && effectiveParentDataPage) {
      (async () => {
        try {
          const dataPageResult = await dataPageUtils.getDataAsync(effectiveParentDataPage);
          setParentData(Array.isArray(dataPageResult.data) ? dataPageResult.data : []);
        } finally {
          setLoading(false);
        }
      })();
    } else if (source === 'property' && parentProperty) {
      try {
        const propertyData = getPConnect().getValue(parentProperty);
        setParentData(Array.isArray(propertyData) ? propertyData : []);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [source, effectiveParentDataPage, parentProperty, dataPageUtils, getPConnect]);

  useEffect(() => {
    if (source === 'datapage' && effectiveChildDataPage) {
      (async () => {
        const dataPageResult = await dataPageUtils.getDataAsync(effectiveChildDataPage);
        setChildData(Array.isArray(dataPageResult.data) ? dataPageResult.data : []);
      })();
    }
  }, [source, effectiveChildDataPage, dataPageUtils, getPConnect]);

  const parentRecords: RowData[] = useMemo(() => {
    return parentData.map((item: any, index: number) => ({
      id: item[parentKey] || `parent-${index}`,
      ...item
    }));
  }, [parentData, parentKey]);

  const childDataByParentKey = useMemo(() => {
    if (source === 'property') {
      const grouped: { [key: string]: RowData[] } = {};
      parentData.forEach((parentItem: any, parentIndex: number) => {
        const parentId = parentItem[parentKey] || `parent-${parentIndex}`;
        const nestedChildren = parentItem[childProperty as string];
        if (Array.isArray(nestedChildren)) {
          grouped[parentId] = nestedChildren.map((childItem: any, childIndex: number) => ({
            id: `child-${parentId}-${childIndex}`,
            ...childItem
          }));
        }
      });
      return grouped;
    }
    if (Array.isArray(childData)) {
      const grouped: { [key: string]: RowData[] } = {};
      childData.forEach((item: any, index: number) => {
        const parentKeyValue = item[childKey];
        if (parentKeyValue !== undefined) {
          if (!grouped[parentKeyValue]) {
            grouped[parentKeyValue] = [];
          }
          grouped[parentKeyValue].push({
            id: `child-${parentKeyValue}-${index}`,
            ...item
          });
        }
      });
      return grouped;
    }

    return {};
  }, [source, parentData, childData, childKey, parentKey, childProperty]);

  const getColumns = (columnsString: string, recordsData: RowData[]): ColumnDef[] => {
    if (columnsString.trim() !== '') {
      return columnsString
        .split(',')
        .map(col => col.trim())
        .filter(Boolean)
        .map(field => ({ label: field, renderer: field }));
    }

    if (recordsData.length > 0) {
      return Object.keys(recordsData[0])
        .filter(key => key !== 'id')
        .map(key => ({ label: key, renderer: key }));
    }

    return [];
  };

  const childTableColumnsFormatted = useMemo(() => {
    const allChildRecords = Object.values(childDataByParentKey).flat();

    return getColumns(childColumns, allChildRecords).map(col => ({
      label: col.label,
      renderer: (row: any) => row[col.renderer]
    })) as ColumnProps<any>[];
  }, [childColumns, childDataByParentKey]);

  const formatParentRecordDisplay = (record: RowData): string => {
    const columnsToShow = getColumns(parentColumns, [record]);
    return columnsToShow.map(col => `${col.label}: ${record[col.renderer] || ''}`).join(', ');
  };

  const toggleCollapsed = (recordId: string | number) => {
    setCollapsedState(prevState => ({
      ...prevState,
      [recordId]: !(prevState[recordId] ?? true)
    }));
  };

  const renderedTargetViews = useMemo(() => {
    if (!targetViews || !Array.isArray(targetViews) || targetViews.length === 0) {
      return null;
    }

    return targetViews.map(viewItem => {
      if (viewItem.type === 'reference' && viewItem.config) {
        try {
          const viewComponent = getPConnect().createComponent(viewItem);

          return <Fragment key={viewItem.config.name}>{viewComponent}</Fragment>;
        } catch (error) {
          return null;
        }
      }
      return null;
    });
  }, [targetViews, getPConnect]);

  const renderChildRecords = (parentRecord: Record<string, any>) => {
    const childRows = childDataByParentKey[parentRecord.id] || [];

    return (
      <CardContent>
        {childRows.length === 0 ? (
          <p>{localizedVal('No related records found', 'Generic')}</p>
        ) : (
          <StyledTable data={childRows} columns={childTableColumnsFormatted} />
        )}
        {renderedTargetViews}
      </CardContent>
    );
  };

  if (loading) {
    return <Progress placement='local' message={localizedVal('Loading content...', 'Generic')} />;
  }

  if (parentRecords.length === 0) {
    return (
      <Card>
        <CardContent>
          <p>{localizedVal('No records available', 'Generic')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Flex container={{ direction: 'column', gap: 1 }}>
      {parentRecords.map(record => (
        <StyledRecordGroup key={record.id}>
          <StyledCardHeader>
            <StyledExpandButton
              variant='text'
              onClick={() => toggleCollapsed(record.id)}
              aria-expanded={!(collapsedState[record.id] ?? true)}
            >
              <Flex container={{ alignItems: 'center', gap: 0.25 }}>
                <Icon name='caret-right' />
                <Text variant='h3'>{formatParentRecordDisplay(record)}</Text>
              </Flex>
            </StyledExpandButton>
          </StyledCardHeader>
          <ExpandCollapse collapsed={collapsedState[record.id] ?? true}>
            {renderChildRecords(record)}
          </ExpandCollapse>
        </StyledRecordGroup>
      ))}
    </Flex>
  );
};

export default withConfiguration(PegaExtensionsRepeatingView);
