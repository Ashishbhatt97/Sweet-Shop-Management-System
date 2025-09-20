import { useState, useMemo } from "react";
import { Search, Filter, Plus } from "lucide-react";
import { motion } from "motion/react";
import {
  useGetSweetsQuery,
  useGetFilteredSweetsQuery,
} from "@/services/sweetApi";
import { useMeQuery } from "@/services/api";
import { SweetCard } from "../SweetCard";
import SweetAddForm from "../SweetAddForm";
import { userRoles } from "@/types/user.types";
import { useDebounce } from "@/utils/useDebouncing";

const Homepage = () => {
  const { data: allData, isLoading: isSweetsLoading } = useGetSweetsQuery();
  const { data: userData, isLoading: isUserLoading } = useMeQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const debouncedMin = useDebounce(priceRange.min, 500);
  const debouncedMax = useDebounce(priceRange.max, 500);

  const minVal = debouncedMin ? parseFloat(debouncedMin) : NaN;
  const maxVal = debouncedMax ? parseFloat(debouncedMax) : NaN;

  const queryFilters = {
    search: debouncedSearchTerm || undefined,
    category: selectedCategory || undefined,
    minPrice: debouncedMin && !isNaN(minVal) ? minVal : undefined,
    maxPrice: debouncedMax && !isNaN(maxVal) ? maxVal : undefined,
  };

  const { data: filteredData } = useGetFilteredSweetsQuery(queryFilters);

  const sweets = filteredData?.data || [];
  const totalSweets = allData?.data?.length || 0;

  const categories = useMemo(() => {
    return [...new Set((allData?.data || []).map((sweet) => sweet.category))];
  }, [allData]);

  if (isSweetsLoading || isUserLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loader"></span>
      </div>
    );
  }

  if (!allData?.data) {
    return (
      <div className="text-red-400 text-center mt-8">
        Error: Unable to load sweets
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center items-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500">
            Sweet Treats Collection
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 space-y-4"
        >
          <div className="relative w-full max-w-md mx-auto">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#a9a9a9]"
              size={20}
            />
            <input
              type="text"
              placeholder="Search sweets by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#1a1a1a]/80 border border-[#333] rounded-xl text-white placeholder-[#a9a9a9] focus:border-[#555] focus:outline-none backdrop-blur-xl text-sm sm:text-base"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter size={16} className="text-[#a9a9a9]" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full sm:w-auto bg-[#1a1a1a]/80 border border-[#333] rounded-lg px-3 py-2 text-white focus:border-[#555] focus:outline-none backdrop-blur-xl text-sm sm:text-base"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-[#a9a9a9] text-sm">Price:</span>
              <input
                type="number"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) =>
                  setPriceRange((prev) => ({ ...prev, min: e.target.value }))
                }
                className="w-20 bg-[#1a1a1a]/80 border border-[#333] rounded px-2 py-1 text-white text-sm focus:border-[#555] focus:outline-none"
              />
              <span className="text-[#a9a9a9]">-</span>
              <input
                type="number"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) =>
                  setPriceRange((prev) => ({ ...prev, max: e.target.value }))
                }
                className="w-20 bg-[#1a1a1a]/80 border border-[#333] rounded px-2 py-1 text-white text-sm focus:border-[#555] focus:outline-none"
              />
            </div>

            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("");
                setPriceRange({ min: "", max: "" });
              }}
              className="text-[#a9a9a9] hover:text-white text-sm transition-colors w-full sm:w-auto text-left sm:text-center"
            >
              Clear All
            </button>
          </div>
          {userData?.data?.role === userRoles.ADMIN && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex justify-center sm:justify-start items-center gap-2 px-4 py-2 bg-green-400 text-black rounded-lg hover:bg-green-500 transition-colors w-full sm:w-auto"
            >
              <Plus size={16} />
              Add Sweet
            </button>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-6"
        >
          <span className="text-[#a9a9a9] text-sm sm:text-base">
            Showing {sweets.length} of {totalSweets} sweets
          </span>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {sweets.map((sweet, index) => (
            <SweetCard key={sweet.id} sweet={sweet} index={index} />
          ))}
        </div>

        {sweets.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-4xl sm:text-6xl mb-4">🔍</div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">
              No sweets found
            </h3>
            <p className="text-[#a9a9a9] text-sm sm:text-base">
              Try adjusting your search or filters
            </p>
          </motion.div>
        )}

        <SweetAddForm
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default Homepage;
