import { Card, Input, Button, Popover, Radio, Typography } from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";

const { Text } = Typography;

interface SearchAndFilterProps {
  searchText: string;
  searchType: string;
  showSearchOptions: boolean;
  filteredCount: number;
  totalCount: number;
  onSearchChange: (value: string) => void;
  onSearchTypeChange: (value: string) => void;
  onShowSearchOptionsChange: (value: boolean) => void;
  onClearSearch: () => void;
  t: (key: string) => string;
}

export const SearchAndFilter = ({
  searchText,
  searchType,
  showSearchOptions,
  filteredCount,
  totalCount,
  onSearchChange,
  onSearchTypeChange,
  onShowSearchOptionsChange,
  onClearSearch,
  t,
}: SearchAndFilterProps) => {
  return (
    <Card className="shadow-md rounded-xl mb-6 border border-gray-200 bg-white">
      <div className="flex items-center gap-2">
        <Input
          placeholder={t("searchOrganizers")}
          allowClear
          size="large"
          prefix={<SearchOutlined className="text-gray-400" />}
          value={searchText}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1 rounded-lg"
        />
        <Popover
          content={
            <div className="py-2">
              <Radio.Group
                value={searchType}
                onChange={(e) => {
                  onSearchTypeChange(e.target.value);
                  onShowSearchOptionsChange(false);
                }}
                className="flex flex-col gap-2"
              >
                <Radio value="all">{t("searchAll") || "Search All"}</Radio>
                <Radio value="organizerNationality">{t("organizerNationality") || "Organizer Nationality"}</Radio>
                <Radio value="hajjNationality">{t("hajjNationality") || "Hajj Nationality"}</Radio>
                <Radio value="organizerNumber">{t("organizerNumber") || "Organizer Number"}</Radio>
                <Radio value="licenseNumber">{t("licenseNumber") || "License Number"}</Radio>
              </Radio.Group>
            </div>
          }
          title={t("searchOptions") || "Search Options"}
          trigger="click"
          open={showSearchOptions}
          onOpenChange={onShowSearchOptionsChange}
          placement="bottomRight"
        >
          <Button
            icon={<FilterOutlined />}
            size="large"
            className="rounded-lg border-gray-300 hover:border-mainColor hover:text-mainColor"
          />
        </Popover>
      </div>

      {searchText && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Text className="text-sm text-gray-600">
                {t("showingResults")} <span className="font-semibold text-mainColor">{filteredCount}</span> {t("of")}{" "}
                <span className="font-semibold">{totalCount}</span>
              </Text>
            </div>
            <Button type="link" size="small" onClick={onClearSearch} className="text-gray-600 hover:text-mainColor p-0 h-auto">
              {t("clearFilters")}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

