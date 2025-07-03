"use client";
import { useRouter, useSearchParams } from "next/navigation";

type FilterBarProps = {
  categories: { id: string; name: string }[];
  selected: string;
};

export function FilterBar({ categories, selected }: FilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    const page = searchParams.get("page") || "1";
    router.push(`/projects?category=${newCategory}&page=${page}`);
  };
  return (
    <div className="mb-8 flex justify-end">
      <select
        className="rounded-md border px-4 py-2 text-sm"
        value={selected}
        onChange={handleChange}
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
