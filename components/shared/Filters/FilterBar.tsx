"use client";

type FilterBarProps = {
  categories: { id: string; name: string }[];
  selected: string;
  onChange: (newCategory: string) => void;
};

export function FilterBar({ categories, selected, onChange }: FilterBarProps) {
  return (
    <div className="mb-8 flex justify-start">
      <select
        className="rounded-md border px-4 py-2 text-sm"
        value={selected}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">همه دسته‌بندی‌ها</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
    </div>
  );
}
