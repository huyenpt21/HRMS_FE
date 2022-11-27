import { Form, TablePaginationConfig } from 'antd';
import BasicInput from 'components/BasicInput';
import CommonTable from 'components/CommonTable';
import { paginationConfig } from 'constants/common';
import { DeviceTypeHeader } from 'constants/header';
import { EditableCellProps, HeaderTableFields } from 'models/common';
import { DeviceListQuery, DeviceModel } from 'models/device';
import ExtraHeaderDeviceType from 'pages/device/components/extraHeader';
import MenuTableDeviceType from 'pages/device/components/menuTable';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { isEmptyPagination, removeEmptyValueInObject } from 'utils/common';
import DeviceTypeDetailModal from '../detailModalDeviceType';
import dataMock from './dataMock.json';

export default function DeviceTypeList() {
  const [deviceTypeForm] = Form.useForm();
  const [searchParams] = useSearchParams();
  const [columnsHeader, setColumnsHeader] = useState<HeaderTableFields[]>([]);
  const [records, setRecords] = useState<DeviceModel[]>([]);
  const [pagination, setPagination] = useState(paginationConfig);
  const [isShowDetailModal, setIsShowDetailModal] = useState(false);
  const [editingKey, setEditingKey] = useState<number>(-1);
  const deviceTypeId = useRef<number | undefined>();

  // * defailt filters
  const defaultFilter: DeviceListQuery = {
    page: searchParams.get('page')
      ? Number(searchParams.get('page'))
      : paginationConfig.current,
    limit: searchParams.get('limit')
      ? Number(searchParams.get('limit'))
      : paginationConfig.pageSize,
    sort: searchParams.get('sort') ?? undefined,
    dir: searchParams.get('dir') ?? undefined,
  };
  // * state query
  const [stateQuery, setStateQuery] = useState(
    removeEmptyValueInObject(defaultFilter),
  );

  //  * get data header and content table
  const header: HeaderTableFields[] = DeviceTypeHeader;
  // const { isError, data: dataTable } = useDeviceTypeList(stateQuery);

  // * render header and data in table
  useEffect(() => {
    const columns = header.map((el: HeaderTableFields) => {
      return {
        ...el,
        render: (data: any, record: DeviceModel) => {
          if (data) {
            return <div>{data}</div>;
          }
          return <span>-</span>;
        },
      };
    });
    columns.push({
      title: 'Action',
      key: 'action',
      dataIndex: 'action',
      width: 100,
      align: 'center',
      render: (_, record: DeviceModel) => {
        return (
          <MenuTableDeviceType
            record={record}
            form={deviceTypeForm}
            editingKey={editingKey}
            setEditingKey={setEditingKey}
            stateQuery={stateQuery}
          />
        );
      },
    });
    setColumnsHeader(columns);
  }, [stateQuery, editingKey]);
  // * get data source from API and set to state that store records for table
  useEffect(() => {
    // if (dataTable && dataTable.data) {
    const {
      metadata: { pagination },
      data: { items: recordsTable },
    } = dataMock;
    setRecords(recordsTable);
    if (!isEmptyPagination(pagination)) {
      // * set the pagination data from API
      setPagination((prevPagination: TablePaginationConfig) => ({
        ...prevPagination,
        current: pagination.page,
        pageSize: pagination.limit,
        total: pagination.totalRecords,
      }));
    }
    // }
    // }, [dataTable, stateQuery, isError]);
  }, [stateQuery]);
  const cancelModalHandler = () => {
    setIsShowDetailModal(false);
    deviceTypeId.current = undefined;
  };

  const EditableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    return (
      <td {...restProps}>
        {editing ? (
          <BasicInput
            name={dataIndex}
            classNameFormItem="mr-0"
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`,
              },
            ]}
            allowClear
          />
        ) : (
          children
        )}
      </td>
    );
  };
  const mergedColumns = columnsHeader.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DeviceModel) => ({
        record,
        inputType: 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: record.id === editingKey,
      }),
    };
  });
  return (
    <>
      <Form form={deviceTypeForm} component={false}>
        <CommonTable
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          columns={mergedColumns}
          data={records}
          pagination={pagination}
          extra={
            <ExtraHeaderDeviceType
              setStateQuery={setStateQuery}
              setIsShowDetailModal={setIsShowDetailModal}
            />
          }
          stateQuery={stateQuery}
          rowKey={(record: DeviceModel) => record.id}
          // loading={isLoading}
          isShowScroll
        />
      </Form>
      {isShowDetailModal && (
        <DeviceTypeDetailModal
          isVisible={isShowDetailModal}
          onCancel={cancelModalHandler}
        />
      )}
    </>
  );
}
