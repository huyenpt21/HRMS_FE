import { Form, Select } from 'antd';
import { NamePath } from 'antd/lib/form/interface';
import { useGetDataOptions } from 'hooks/useGetDataOptions';
import { debounce } from 'lodash';
import { Key, ReactNode, useEffect, useMemo, useRef, useState } from 'react';

type Props = {
  url: string;
  name?: string;
  colon?: boolean;
  disabled?: boolean;
  label?: string | ReactNode;
  className?: string;
  classNameFormItem?: string;
  rules?: object[];
  placeholder?: string;
  initialValueForm?: string;
  dataName: string;
  onChangeHandle?: (event: any) => void;
  allowClear?: boolean;
  defaultValue?: string | string[] | number;
  mode?: 'multiple' | 'tags';
  key?: Key | null | undefined;
  optionFilterProp?: string;
  namePath?: NamePath | undefined;
  maxTagCount?: 'number' | 'responsive';
  size?: 'large' | 'middle' | 'small';
  isGetWholeValue?: boolean;
  params?: any;
  apiName: string;
  isCallApi?: boolean;
  refetchValue?: any;
};

interface option {
  label: string;
  value: string;
  type?: string;
}

function DebounceSelect({
  onChange,
  dataName,
  debounceTimeout = 500,
  dataOpts,
  setValueSearch,
  isFetching,
  mode,
  optionFilterProp,
  maxTagCount,
  ...props
}: any) {
  const [options, setOptions] = useState<option[]>([]);
  const refSearch = useRef(false);
  const refSelect = useRef<any>();
  useEffect(() => {
    if (dataOpts?.data && dataOpts.data[dataName]) {
      setOptions(dataOpts.data[dataName]);
    }
  }, [dataOpts]);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value: string) => {
      refSearch.current = true;
      value && setValueSearch(value);
      !value && setValueSearch(undefined);
    };

    return debounce(loadOptions, debounceTimeout);
  }, [debounceTimeout]);

  return (
    <Select
      onChange={(e, options) => onChange(e, options)}
      filterOption={false}
      onSearch={debounceFetcher}
      loading={isFetching}
      ref={refSelect}
      options={options}
      showSearch
      size="large"
      mode={mode}
      optionFilterProp={optionFilterProp}
      maxTagCount={maxTagCount}
      {...props}
    />
  );
}
const SelectCustomSearch = ({
  url,
  colon,
  label,
  name,
  rules,
  classNameFormItem,
  initialValueForm,
  placeholder,
  onChangeHandle,
  dataName,
  disabled,
  allowClear,
  defaultValue,
  mode,
  key,
  namePath,
  maxTagCount,
  size,
  isGetWholeValue,
  params,
  apiName,
  isCallApi,
  refetchValue,
}: Props) => {
  const [value, setValue] = useState<string | undefined | string[] | number>();
  const [valueSearch, setValueSearch] = useState<string | undefined>(undefined);

  const { data, isFetching, refetch } = useGetDataOptions(
    {
      search: valueSearch,
      ...params,
    },
    url,
    apiName,
    isCallApi,
  );
  useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue);
    }
  }, []);
  useEffect(() => {
    refetch();
  }, [refetchValue]);

  const handleChangeOpt = (value: any, options: any) => {
    onChangeHandle &&
      (isGetWholeValue ? onChangeHandle(options) : onChangeHandle(value));

    setValue(value);
  };
  return (
    <Form.Item
      label={label ? label : ''}
      colon={colon || false}
      name={name ?? namePath}
      rules={rules}
      className={classNameFormItem}
      initialValue={initialValueForm}
      key={key}
    >
      <DebounceSelect
        value={value}
        placeholder={placeholder}
        dataOpts={data || []}
        setValueSearch={setValueSearch}
        onChange={(newValue: any, options: any) => {
          handleChangeOpt(newValue, options);
        }}
        isFetching={isFetching}
        dataName={dataName}
        disabled={disabled}
        allowClear={allowClear}
        mode={mode}
        maxTagCount={maxTagCount}
        defaultValue={defaultValue}
        size={size ? size : 'large'}
      />
    </Form.Item>
  );
};

export default SelectCustomSearch;
