"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { Item } from "@/types/tft";
import {
  ItemPageCategory,
  ITEM_PAGE_CATEGORIES,
  filterItemsByCategory,
} from "../categories/itemCategoryMapper";
import { cn } from "@/utils/cn";

interface ItemsTableViewProps {
  initialItems: Item[];
  activeCategory?: ItemPageCategory;
}

export function ItemsTableView({
  initialItems,
  activeCategory = "basic",
}: ItemsTableViewProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<ItemPageCategory>(activeCategory);
  const [search, setSearch] = useState("");

  const itemsById = useMemo(() => {
    const map = new Map<string, Item>();
    for (const item of initialItems) {
      map.set(item.id, item);
      map.set(item.id.toLowerCase(), item);
    }
    return map;
  }, [initialItems]);

  const categoryItems = useMemo(() => {
    return filterItemsByCategory(initialItems, selectedCategory);
  }, [initialItems, selectedCategory]);

  const filteredItems = useMemo(() => {
    if (!search.trim()) return categoryItems;
    const query = search.toLowerCase();
    return categoryItems.filter(
      (it) =>
        it.name.toLowerCase().includes(query) ||
        it.description.toLowerCase().includes(query)
    );
  }, [categoryItems, search]);

  return (
    <div className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6 space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#20293b] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight">
            TFT Items Database
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Component items, recipes, seasonal emblems, radiant equipment, and artifacts.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items or stats..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#151f33] border border-[#24344d] rounded text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>
      </div>

      {/* Categories Bar */}
      <div className="flex items-center gap-1 overflow-x-auto bg-[#101726] border border-[#1e2a3f] rounded-lg p-1">
        {ITEM_PAGE_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <Link
              key={cat.id}
              href={cat.href}
              onClick={() => {
                // If on client page, switch state smoothly
                setSelectedCategory(cat.id);
              }}
              className={cn(
                "px-3.5 py-1.5 rounded text-xs font-bold transition-all select-none whitespace-nowrap",
                isSelected
                  ? "bg-amber-500 text-slate-950 shadow-xs"
                  : "text-slate-300 hover:text-white hover:bg-[#182338]"
              )}
            >
              {cat.label}
            </Link>
          );
        })}
      </div>

      {/* Table view */}
      <div className="bg-[#101624] border border-[#1e2a3f] rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0d131f] border-b border-[#1c2738] text-slate-400 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-2.5 px-4 w-60">Item</th>
                <th className="py-2.5 px-4">Bonus / Effect</th>
                <th className="py-2.5 px-4 w-44 text-center">Recipe</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#182233]">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-12 text-center text-slate-500 text-xs">
                    No items found matching the current category or search.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-[#141c2c] transition-colors"
                    >
                      {/* Col 1: Item icon + name */}
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded bg-slate-900 border border-[#233148] overflow-hidden flex-shrink-0 relative shadow-xs">
                            <Image
                              src={item.imageUrl || "/placeholder.png"}
                              alt={item.name}
                              width={36}
                              height={36}
                              className="w-full h-full object-cover"
                              unoptimized
                            />
                          </div>
                          <div>
                            <span className="font-bold text-white text-xs block">
                              {item.name}
                            </span>
                            <span className="text-[10px] uppercase font-semibold text-amber-500/80">
                              {item.type}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Col 2: Bonus & Description */}
                      <td className="py-2.5 px-4 text-slate-300 text-xs leading-relaxed max-w-xl">
                        {item.description}
                      </td>

                      {/* Col 3: Recipe components */}
                      <td className="py-2.5 px-4 text-center">
                        {item.composition && item.composition.length === 2 ? (
                          <div className="inline-flex items-center gap-1.5 justify-center">
                            {item.composition.map((compId, idx) => {
                              const compItem = itemsById.get(compId);
                              return (
                                <React.Fragment key={idx}>
                                  {idx > 0 && (
                                    <span className="text-slate-500 font-bold text-xs">+</span>
                                  )}
                                  <div
                                    className="w-6 h-6 rounded bg-slate-900 border border-[#233148] overflow-hidden relative shadow-xs"
                                    title={compItem?.name || compId}
                                  >
                                    {compItem?.imageUrl ? (
                                      <Image
                                        src={compItem.imageUrl}
                                        alt={compItem.name}
                                        width={24}
                                        height={24}
                                        className="w-full h-full object-cover"
                                        unoptimized
                                      />
                                    ) : (
                                      <span className="text-[9px] text-slate-400">?</span>
                                    )}
                                  </div>
                                </React.Fragment>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="text-slate-600 font-mono text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
