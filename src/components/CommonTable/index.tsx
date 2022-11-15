import { Card, Table } from 'antd';
import { ExpandableConfig } from 'antd/lib/table/interface';
import { isEmpty } from 'lodash';
import { ReactNode, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { removeEmptyValueInObject } from 'utils/common';

type Size = 'large' | 'middle' | 'small';

interface TableProps {
  loading?: boolean;
  size?: Size;
  rowSelection?: any;
  columns: object[];
  data: object[];
  pagination: any;
  onChange?: (pagination: any, filters: any, sorter: any) => void;
  id?: string;
  extra?: ReactNode;
  onRow?: any;
  refreshAction?: () => void;
  stateQuery?: object;
  className?: string;
  scroll?: object;
  rowKey?: any;
  components?: any;
  rowClassName?: any;
  defaultExpandAllRows?: boolean;
  expandable?: ExpandableConfig<object>;
  isShowScroll?: boolean;
}

const CommonTable = (tb: TableProps) => {
  const [, setSearchParams] = useSearchParams();
  const [maxHeightTable, setMaxHeightTable] = useState<number | undefined>();
  const isShowScroll =
    tb.isShowScroll ||
    (Number(tb.pagination?.pageSize) > 10 &&
      Number(tb.pagination?.total) > 10 &&
      maxHeightTable);

  useEffect(() => {
    if (tb.stateQuery && !isEmpty(tb.stateQuery)) {
      setSearchParams(removeEmptyValueInObject(tb.stateQuery));
    }
  }, [tb.stateQuery]);

  useEffect(() => {
    const viewHeight = window.innerHeight;
    const elmTable = document.querySelector('table');
    const elmFooter = document.querySelector('footer');
    const rect = elmTable?.getBoundingClientRect();
    const heightFooter = elmFooter?.clientHeight || 0;

    if (viewHeight && rect?.top) {
      const scrollY = viewHeight - rect.top - heightFooter - 130;
      setMaxHeightTable(scrollY);
    }
  }, []);

  return (
    <Card
      className={tb.className ? `table-card  ${tb.className}` : 'table-card'}
      bordered={false}
      extra={tb.extra}
    >
      <Table
        scroll={tb.scroll || isShowScroll ? { x: true, y: maxHeightTable } : {}}
        id={tb.id}
        loading={tb.loading}
        size={tb.size || 'middle'}
        rowSelection={tb.rowSelection}
        columns={tb.columns}
        dataSource={tb.data}
        pagination={tb.pagination}
        onChange={tb.onChange}
        sortDirections={['ascend', 'descend', 'ascend']}
        onRow={tb.onRow}
        rowKey={tb.rowKey}
        components={tb.components}
        rowClassName={tb.rowClassName}
        defaultExpandAllRows={tb.defaultExpandAllRows}
        expandable={tb.expandable}
      />
    </Card>
  );
};

export default CommonTable;
