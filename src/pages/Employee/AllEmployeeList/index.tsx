import { PlusOutlined } from '@ant-design/icons';
import { Col, Row, TablePaginationConfig } from 'antd';
import BasicButton from 'components/BasicButton';
import BasicSelect from 'components/BasicSelect';
import CommonTable from 'components/CommonTable';
import InputDebounce from 'components/InputSearchDedounce/InputSearchDebounce';
import SvgIcon from 'components/SvgIcon';
import { paginationConfig } from 'constants/common';
import { EmployeeListItem } from 'models/allEmployee';
import { HeaderTableFields } from 'models/common';
import { useEffect, useState } from 'react';
import { isEmptyPagination } from 'utils/common';
import dataMock from './dataMock.json';
import { Header } from './header';
import styles from './index.module.less';

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
      <div className={styles.header__title}>Employee List</div>
      <div className={styles.header__container}>
        <Row gutter={10} className={styles.filter__section}>
          <Col span={8}>
            <InputDebounce
              suffix={<SvgIcon icon="search" color="#ccc" size="16" />}
              placeholder="Search..."
              allowClear
              setStateQuery={setStateQuery}
              keyParam="search"
            />
          </Col>
          <Col span={8}>
            <BasicSelect options={[]} placeholder="Department" />
          </Col>
          <Col span={8}>
            <BasicSelect options={[]} placeholder="Position" />
          </Col>
        </Row>
        <BasicButton
          title="Add Employee"
          type="filled"
          icon={<PlusOutlined />}
        />
      </div>
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
