import { Space, TablePaginationConfig } from 'antd';
import CommonTable from 'components/CommonTable';
import { HeaderTableFields } from 'models/common';
import { useEffect, useState } from 'react';
import { Header } from './header';
import dataMock from './dataMock.json';
import { EmployeeListItem } from 'models/allEmployee';
import { isEmptyPagination } from 'utils/common';
import { paginationConfig } from 'constants/common';

export default function AllEmployeeList() {
  const [columnsHeader, setColumnsHeader] = useState<HeaderTableFields[]>([]);
  const [records, setRecords] = useState<EmployeeListItem[]>([]);
  const [pagination, setPagination] = useState(paginationConfig);
  const header: HeaderTableFields[] = Header;
  // const dataTable = dataMock;
  useEffect(() => {
    const columns = header.map((el: HeaderTableFields) => {
      return {
        ...el,
        render: (data: any) => {
          return <div>{data}</div>;
        },
      };
    });
    setColumnsHeader(columns);
  }, []);

  useEffect(() => {
    if (dataMock && dataMock.data) {
      let {
        metadata: { pagination },
        data: { items: recordsTable },
      } = dataMock;
      setRecords(recordsTable);
      if (!isEmptyPagination(pagination)) {
        setPagination((prevPagination: TablePaginationConfig) => ({
          ...prevPagination,
          current: pagination.page,
          pageSize: pagination.limit,
          total: pagination.totalRecords,
        }));
      }
    }
  }, [dataMock]);
  const extraHeader = (
    <>
      <Space>
        <div>Header</div>
      </Space>
    </>
  );
  return (
    <CommonTable
      columns={columnsHeader}
      data={records}
      onChange={() => {}}
      pagination={pagination}
      extra={extraHeader}
    />
  );
}
