import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { motion } from "motion/react";
import { useAddSweetMutation } from "@/services/sweetApi";
import { SweetFormData, sweetSchema } from "@/types/sweets.types";
import { toast } from "react-toastify";

interface SweetAddFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const SweetAddForm = ({ isOpen, onClose }: SweetAddFormProps) => {
  const [addSweet, { isLoading, error }] = useAddSweetMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SweetFormData>({
    resolver: yupResolver(sweetSchema),
  });

  const onSubmit = async (data: SweetFormData) => {
    try {
      await addSweet(data).unwrap();
      reset();
      toast.success("Sweet added successfully!");
      onClose();
    } catch (err: unknown) {
      console.error("Failed to add sweet:", err);
      toast.error("Failed to add sweet");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="bg-[#1a1a1a] rounded-xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md border border-[#333]"
      >
        <h2 className="text-white text-lg sm:text-xl font-semibold mb-4">
          Add New Sweet
        </h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-3 sm:space-y-4"
        >
          <div>
            <label
              htmlFor="name"
              className="text-white block mb-1 text-sm font-medium"
            >
              Name
            </label>
            <input
              id="name"
              {...register("name")}
              className="w-full bg-[#333] text-white rounded-lg p-2 border border-[#555] focus:outline-none focus:border-green-400 text-sm sm:text-base"
              placeholder="Enter sweet name"
            />
            {errors.name && (
              <p className="text-red-400 text-xs sm:text-sm mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="category"
              className="text-white block mb-1 text-sm font-medium"
            >
              Category
            </label>
            <input
              id="category"
              {...register("category")}
              className="w-full bg-[#333] text-white rounded-lg p-2 border border-[#555] focus:outline-none focus:border-green-400 text-sm sm:text-base"
              placeholder="Enter category (e.g., Indian, Bengali)"
            />
            {errors.category && (
              <p className="text-red-400 text-xs sm:text-sm mt-1">
                {errors.category.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="price"
              className="text-white block mb-1 text-sm font-medium"
            >
              Price (₹)
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              {...register("price")}
              className="w-full bg-[#333] text-white rounded-lg p-2 border border-[#555] focus:outline-none focus:border-green-400 text-sm sm:text-base"
              placeholder="Enter price"
            />
            {errors.price && (
              <p className="text-red-400 text-xs sm:text-sm mt-1">
                {errors.price.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="quantity"
              className="text-white block mb-1 text-sm font-medium"
            >
              Quantity in Stock
            </label>
            <input
              id="quantity"
              type="number"
              {...register("quantity")}
              className="w-full bg-[#333] text-white rounded-lg p-2 border border-[#555] focus:outline-none focus:border-green-400 text-sm sm:text-base"
              placeholder="Enter quantity"
            />
            {errors.quantity && (
              <p className="text-red-400 text-xs sm:text-sm mt-1">
                {errors.quantity.message}
              </p>
            )}
          </div>

          {error && (
            <p className="text-red-400 text-xs sm:text-sm">
              {error instanceof Error ? error.message : "Failed to add sweet"}
            </p>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                reset();
                onClose();
              }}
              className="px-4 py-2 text-[#a9a9a9] hover:text-white transition-colors text-sm sm:text-base"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-400 text-black rounded-lg hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add Sweet"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default SweetAddForm;
