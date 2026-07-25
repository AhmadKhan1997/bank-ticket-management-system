import { useState } from "react";
import { updateCounterAsAdmin } from "../services/adminApi";

export default function CounterSettings({ counters, categories, onCountersChanged }) {
  const [errorMessage, setErrorMessage] = useState("");

  function isCategoryBound(counter, categoryId) {
    for (let i = 0; i < counter.categories.length; i++) {
      if (counter.categories[i] === categoryId) {
        return true;
      }
    }
    return false;
  }

  async function handleToggleCategory(counter, categoryId) {
    const currentlyBound = isCategoryBound(counter, categoryId);
    let newCategoryIds = [];

    if (currentlyBound === true) {
      for (let i = 0; i < counter.categories.length; i++) {
        if (counter.categories[i] !== categoryId) {
          newCategoryIds.push(counter.categories[i]);
        }
      }
    } else {
      for (let i = 0; i < counter.categories.length; i++) {
        newCategoryIds.push(counter.categories[i]);
      }
      newCategoryIds.push(categoryId);
    }

    try {
      await updateCounterAsAdmin(counter.id, newCategoryIds);
      onCountersChanged();
    } catch (error) {
      setErrorMessage("Could not update counter categories.");
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <p className="text-sm font-medium text-slate-700 mb-4">Counter category settings</p>

      {errorMessage !== "" && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {errorMessage}
        </div>
      )}

      <div className="space-y-4">
        {counters.map((counter) => (
          <div key={counter.id} className="border border-slate-100 rounded-lg p-3">
            <p className="text-sm font-medium text-slate-700 mb-2">Counter {counter.number}</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const bound = isCategoryBound(counter, category.id);
                let badgeClass = "text-xs px-3 py-1 rounded-full border cursor-pointer ";

                if (bound === true) {
                  badgeClass = badgeClass + "bg-blue-50 border-blue-200 text-blue-700";
                } else {
                  badgeClass = badgeClass + "bg-slate-50 border-slate-200 text-slate-500";
                }

                return (
                  <span
                    key={category.id}
                    onClick={() => handleToggleCategory(counter, category.id)}
                    className={badgeClass}
                  >
                    {category.name}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}