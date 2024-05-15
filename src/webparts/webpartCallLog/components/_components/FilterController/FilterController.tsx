// FilterController.tsx
import * as React from "react";
import { TSPListData } from "../../../utils/hooks/useSharePointListData/useSharePointListData";
import { NICESPList } from "../../types";

interface FilterControllerProps {
  data: TSPListData;
  onFilterChange: (selectedTags: string[]) => void;
}

const FilterController: React.FC<FilterControllerProps> = ({
  data,
  onFilterChange,
}) => {
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [availableTags, setAvailableTags] = React.useState<string[]>([]);

  const handleTagToggle = (tag: string) => {
    let updatedTags: string[];
    if (selectedTags.indexOf(tag) !== -1) {
      updatedTags = selectedTags.filter((t) => t !== tag);
    } else {
      updatedTags = [...selectedTags, tag];
    }
    setSelectedTags(updatedTags);
    onFilterChange(updatedTags);
  };

  React.useEffect(() => {
    if (data) {
      const tagsSet: string[] = [];
      data.forEach((item: NICESPList) => {
        if (!item.Tags) return;
        item.Tags.forEach((tag) => tagsSet.push(tag));
      });

      setAvailableTags(tagsSet);
    }
  }, [data]);

  return (
    <div>
      <h4>Filter by tags:</h4>
      <div>
        {availableTags.forEach((tag) => (
          <button
            id={tag}
            key={tag}
            onClick={() => handleTagToggle(tag)}
            style={{
              margin: "5px",
              padding: "5px 10px",
              backgroundColor:
                selectedTags.indexOf(tag) !== -1 ? "lightblue" : "white",
              border: "1px solid black",
              borderRadius: "5px",
              cursor: "pointer",
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
