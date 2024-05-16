import * as React from "react";
import { TSPListData } from "../../../utils/hooks/useSharePointListData/useSharePointListData";
import { NICESPList } from "../../types";
import FilterIcon from "../FilterIcon";
import styles from "./FilterController.module.scss";
import CancelFilterIcon from "../CancelFilterIcon";

interface FilterControllerProps {
  data: TSPListData;
  onFilterChange: (selectedTags: string[]) => void;
}

const allTags = (data: TSPListData): Set<string> => {
  const temp = new Set<string>();
  data.forEach((item: NICESPList) => {
    if (item.Tags) {
      item.Tags.forEach((tag: string) => {
        temp.add(tag);
      });
    }
  });
  return temp;
};

const FilterController: React.FC<FilterControllerProps> = ({
  data,
  onFilterChange,
}) => {
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [tags, setTags] = React.useState<Set<string> | null>(null);
  const [showTags, setShowTags] = React.useState<boolean>(false);

  const toggleShowTags = () => {
    return setShowTags(!showTags);
  };

  const handleTagToggle = (tag: string) => {
    let updatedTags: string[];
    if (selectedTags.indexOf(tag) !== -1) {
      updatedTags = selectedTags.filter((t) => t !== tag);
    } else {
      updatedTags = selectedTags.concat(tag);
    }
    setSelectedTags(updatedTags);
    onFilterChange(updatedTags);
  };

  React.useEffect(() => {
    const testTags = allTags(data);
    if (testTags.size > 0) {
      setTags(testTags);
    }
  }, [data]);

  if (!tags) return null;
  if (tags.size <= 1) return null;

  // Convert Set to Array using ES5 compatible method
  const tagsArray: string[] = [];
  tags.forEach((tag) => tagsArray.push(tag));

  return (
    <div className={styles.wrapper}>
      {showTags ? (
        <CancelFilterIcon
          onClick={() => {
            toggleShowTags();
            setSelectedTags([]);
            onFilterChange([]);
          }}
        />
      ) : (
        <FilterIcon onClick={toggleShowTags} />
      )}
      <div className={styles.tags}>
        {tagsArray.map((tag) => (
          <button
            className={styles.tag}
            id={tag}
            key={tag}
            onClick={() => handleTagToggle(tag)}
            style={{
              display: showTags ? "flex" : "none",
              opacity: selectedTags.indexOf(tag) === -1 ? "0.5" : "1",
            }}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterController;
