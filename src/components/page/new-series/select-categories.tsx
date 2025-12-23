import { Card } from "@/components/ui/card";

const CATEGORIES = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Fantasy",
  "Horror",
  "Mystery",
  "Romance",
  "School Life",
  "Sci-Fi",
  "Slice of Life",
  "Supernatural",
  "Thriller",
  "Wuxia",
  "Martial Arts",
  "Adult",
  "Ecchi",
  "Gender Bender",
  "Harem",
  "Historical",
  "Josei",
  "Mature",
  "Mecha",
  "Psychological",
  "Seinen",
  "Shoujo",
  "Shoujo Ai",
  "Shounen",
  "Shounen Ai",
  "Smut",
  "Sports",
  "Tragedy",
  "Xianxia",
  "Xuanhuan",
  "Yaoi",
  "Yuri",
];

export default function SelectCategories({
  formData,
  handleCategoryToggle,
}: {
  formData: { categories: string[] };
  handleCategoryToggle: (category: string) => void;
}) {
  return (
    <Card className="p-6 border border-border/50 backdrop-blur-sm bg-[#27272A]/30">
      <h2 className="text-xl font-semibold mb-6 text-foreground flex items-center gap-2">
        <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">
          3
        </span>
        Categories
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => handleCategoryToggle(category)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              formData.categories.includes(category)
                ? "bg-primary text-primary-foreground border border-primary"
                : "bg-card border border-[#27272A] hover:border-primary hover:bg-card/80"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </Card>
  );
}
