import { Form, Select } from 'antd';
import { NamePath } from 'antd/lib/form/interface';
import { useGetDataOptions } from 'hooks/useGetDataOptions/insex';
import { debounce, isEqual } from 'lodash';
import { Key, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  url: string;
  apiUrl?: string;
  name?: string;
  colon?: boolean;
  useLabel?: boolean;
  disabled?: boolean;
  label?: string | ReactNode;
  className?: string;
  classNameFormItem?: string;
  rules?: object[];
  placeholder?: string;
  isRequired?: boolean;
  initialValueForm?: string;
  dataName: string;
  onChangeHandle?: (event: any) => void;
  allowClear?: boolean;
  defaultValue?: string | string[];
  mode?: 'multiple' | 'tags';
  key?: Key | null | undefined;
  optionFilterProp?: string;
  namePath?: NamePath | undefined;
  maxTagCount?: 'number' | 'responsive';
  size?: 'large' | 'middle' | 'small';
  isGetWholeValue?: boolean;
  params?: any;
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
  setValuePage,
  valuePage,
  isFetching,
  mode,
  optionFilterProp,
  maxTagCount,
  ...props
}: any) {
  const [options, setOptions] = useState<option[]>([]);
  const refSearch = useRef(false);
  const refSelect = useRef<any>();
  const totalOpts = useRef<number>(0);
  let totalRecords: number = 0;
  useEffect(() => {
    if (dataOpts?.data && dataOpts.data[dataName]) {
      setOptions((prevState) => {
        const compareDataOptions = isEqual(prevState, dataOpts.data[dataName]);
        if (compareDataOptions) {
          return dataOpts.data[dataName];
        }
        if (refSearch.current) {
          refSearch.current = false;
          refSelect?.current && refSelect.current.scrollTo(0);
          totalOpts.current = dataOpts.data[dataName].length;
          return dataOpts.data[dataName];
        }
        if (!refSearch.current) {
          totalOpts.current = [...prevState, ...dataOpts.data[dataName]].length;
          return [...prevState, ...dataOpts.data[dataName]];
        }
      });
    }
    if (dataOpts?.metadata && dataOpts?.metadata?.pagination?.totalRecords) {
      totalRecords = dataOpts.metadata.pagination.totalRecords;
    }
  }, [dataOpts]);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value: string) => {
      setValuePage(1);
      refSearch.current = true;
      setValueSearch(value);
    };

    return debounce(loadOptions, debounceTimeout);
  }, [debounceTimeout]);

  const handleScroll = useMemo(() => {
    const handleScroll = (e: any) => {
      let count = e.target.clientHeight + e.target.scrollTop;
      let scrollHeight = e.target.scrollHeight;
      if (
        count === scrollHeight &&
        !refSearch.current &&
        totalOpts.current < totalRecords
      ) {
        refSearch.current = false;
        setValuePage(valuePage + 1);
      }
    };

    return debounce(handleScroll, debounceTimeout);
  }, [debounceTimeout, valuePage]);

  return (
    <Select
      onChange={(e, options) => onChange(e, options)}
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      loading={isFetching}
      ref={refSelect}
      options={options}
      showSearch
      style={{ width: '100%', minWidth: 200 }}
      size="large"
      onPopupScroll={handleScroll}
      mode={mode}
      optionFilterProp={optionFilterProp}
      maxTagCount={maxTagCount}
      {...props}
    />
  );
}
const SelectCustomSearch = ({
  url,
  useLabel,
  colon,
  label,
  name,
  isRequired,
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
  apiUrl,
  key,
  namePath,
  maxTagCount,
  size,
  isGetWholeValue,
  params,
}: Props) => {
  const { t } = useTranslation();
  const [value, setValue] = useState<string | undefined | string[]>();
  const [valueSearch, setValueSearch] = useState<string>('');
  const [valuePage, setValuePage] = useState<number>(1);

  const { data, isFetching } = useGetDataOptions({
    label: valueSearch,
    url: url,
    limit: 20,
    page: valuePage,
    apiUrl,
    ...params,
  });
  useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue);
    }
  }, []);

  const handleChangeOpt = (e: any, options: any) => {
    let values: string[] = [];
    if (Array.isArray(e)) {
      values = e.map((el) => el.value);
    } else {
      values = e?.value ? e.value : undefined;
    }
    onChangeHandle &&
      (isGetWholeValue ? onChangeHandle(options) : onChangeHandle(values));

    setValue(values);
  };
  return (
    <Form.Item
      label={useLabel ? label : ''}
      colon={colon || false}
      name={name ?? namePath}
      required={isRequired}
      rules={rules}
      className={classNameFormItem}
      initialValue={initialValueForm}
      normalize={(value) => {
        if (!value) {
          return undefined;
        }
        let values: string[] = [];
        if (Array.isArray(value)) {
          values = value.map((el) => el.value);
        } else {
          values = value?.value ? value.value : undefined;
        }
        return values;
      }}
      key={key}
    >
      <DebounceSelect
        value={value}
        placeholder={placeholder ? placeholder : t('selectOption')}
        dataOpts={data || []}
        setValueSearch={setValueSearch}
        valuePage={valuePage}
        setValuePage={setValuePage}
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
