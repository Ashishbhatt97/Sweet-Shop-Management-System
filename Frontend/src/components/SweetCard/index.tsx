import {
  usePurchaseSweetMutation,
  useUpdateSweetMutation,
  useDeleteSweetMutation,
  useRestockSweetMutation,
} from "@/services/sweetApi";
import { Sweet } from "@/types/navlinks.types";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Trash2, Pencil, Plus } from "lucide-react";
import { useMeQuery } from "@/services/api";
import { userRoles } from "@/types/user.types";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SweetEditFormData, sweetEditSchema } from "@/types/sweets.types";
import { toast } from "react-toastify";

export const SweetCard = ({
  sweet,
  index,
}: {
  sweet: Sweet;
  index: number;
}) => {
  const { data: userData } = useMeQuery();
  const isAdmin = userData?.data?.role === userRoles.ADMIN;

  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [restockQuantity, setRestockQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const [purchaseSweet, { isLoading: isPurchasing }] =
    usePurchaseSweetMutation();
  const [updateSweet, { isLoading: isUpdating }] = useUpdateSweetMutation();
  const [deleteSweet, { isLoading: isDeleting }] = useDeleteSweetMutation();
  const [restockSweet, { isLoading: isRestocking }] = useRestockSweetMutation();

  const {
    register,
    handleSubmit,
    formState: { errors: editErrors },
    reset: editReset,
  } = useForm<SweetEditFormData>({
    resolver: yupResolver(sweetEditSchema),
    defaultValues: {
      name: sweet.name,
      category: sweet.category,
      price: sweet.price,
      quantity: sweet.quantity,
    },
  });

  useEffect(() => {
    editReset({
      name: sweet.name,
      category: sweet.category,
      price: sweet.price,
      quantity: sweet.quantity,
    });
  }, [sweet, editReset]);

  const handlePurchase = async () => {
    if (quantity < 1 || quantity > sweet.quantity) {
      setError(`Please enter a quantity between 1 and ${sweet.quantity}`);
      return;
    }

    try {
      await purchaseSweet({ id: sweet.id, quantity }).unwrap();
      toast.success("Sweet purchased successfully");
      setIsPurchaseModalOpen(false);
      setQuantity(1);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to purchase sweet");
      toast.error("Failed to purchase sweet");
    }
  };

  const handleEdit = async (data: SweetEditFormData) => {
    try {
      await updateSweet({ ...data, id: sweet.id }).unwrap();
      toast.success("Sweet updated successfully");
      setIsEditModalOpen(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update sweet");
      toast.error("Failed to update sweet");
    }
  };

  const handleRestock = async () => {
    if (restockQuantity < 1) {
      setError("Please enter a positive quantity to restock");
      return;
    }

    try {
      await restockSweet({ id: sweet.id, quantity: restockQuantity }).unwrap();
      toast.success("Sweet restocked successfully");
      setIsRestockModalOpen(false);
      setRestockQuantity(1);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to restock sweet");
      toast.error("Failed to restock sweet");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteSweet(sweet.id).unwrap();
      toast.success("Sweet deleted successfully");
      setIsDeleteConfirmOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete sweet");
      toast.error("Failed to delete sweet");
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.3 }}
        className="bg-[#1a1a1a]/80 backdrop-blur-xl border border-[#333] rounded-xl p-4 sm:p-6 hover:border-[#555] transition-all group hover:scale-[1.02] sm:hover:scale-105"
      >
        <div className="text-3xl sm:text-4xl mb-4 text-center">
          {sweet.image}
        </div>
        <h3 className="text-white font-semibold text-base sm:text-lg mb-2">
          {sweet.name}
        </h3>
        <div className="flex justify-between items-center mb-3">
          <span className="text-[#a9a9a9] text-xs sm:text-sm bg-[#333]/50 px-2 py-1 rounded-full">
            {sweet.category}
          </span>
          <span className="text-green-400 font-bold text-sm sm:text-base">
            ₹ {sweet.price}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[#a9a9a9] text-xs sm:text-sm">
            Stock: {sweet.quantity}
          </span>
          <div className="flex gap-2">
            {isAdmin ? (
              <>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="text-blue-400 hover:text-blue-300"
                  disabled={isUpdating}
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => setIsRestockModalOpen(true)}
                  className="text-green-400 hover:text-green-300"
                  disabled={isRestocking}
                >
                  <Plus size={16} />
                </button>
                <button
                  onClick={() => setIsDeleteConfirmOpen(true)}
                  className="text-red-400 hover:text-red-300"
                  disabled={isDeleting}
                >
                  <Trash2 size={16} />
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsPurchaseModalOpen(true)}
                className="bg-[#f2f2f2] text-black px-3 py-1 cursor-pointer rounded-full text-xs sm:text-sm font-medium hover:bg-white transition-colors group-hover:translate-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={sweet.quantity === 0 || isPurchasing}
              >
                Purchase
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {isPurchaseModalOpen && (
        <div className="fixed inset-0 backdrop-blur-xl bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-[#1a1a1a] rounded-xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md border border-[#333]"
          >
            <h2 className="text-white text-lg sm:text-xl font-semibold mb-4">
              Purchase {sweet.name}
            </h2>
            <p className="text-[#a9a9a9] mb-4 text-sm sm:text-base">
              Available stock: {sweet.quantity}
            </p>
            <div className="mb-4">
              <label
                htmlFor="purchase-quantity"
                className="text-white block mb-2 text-sm font-medium"
              >
                Quantity
              </label>
              <input
                type="number"
                id="purchase-quantity"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                min="1"
                max={sweet.quantity}
                className="w-full bg-[#333] text-white rounded-lg p-2 border border-[#555] focus:outline-none focus:border-green-400 text-sm sm:text-base"
                disabled={isPurchasing}
              />
              {error && (
                <p className="text-red-400 text-xs sm:text-sm mt-2">{error}</p>
              )}
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsPurchaseModalOpen(false);
                  setError(null);
                  setQuantity(1);
                }}
                className="px-4 py-2 text-[#a9a9a9] hover:text-white transition-colors text-sm sm:text-base"
                disabled={isPurchasing}
              >
                Cancel
              </button>
              <button
                onClick={handlePurchase}
                className="px-4 py-2 bg-green-400 text-black rounded-lg hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                disabled={isPurchasing}
              >
                {isPurchasing ? "Processing..." : "Confirm Purchase"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 backdrop-blur-xl bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-[#1a1a1a] rounded-xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md border border-[#333]"
          >
            <h2 className="text-white text-lg sm:text-xl font-semibold mb-4">
              Edit {sweet.name}
            </h2>
            <form
              onSubmit={handleSubmit(handleEdit)}
              className="space-y-3 sm:space-y-4"
            >
              <div>
                <label
                  htmlFor="edit-name"
                  className="text-white block mb-1 text-sm font-medium"
                >
                  Name
                </label>
                <input
                  id="edit-name"
                  {...register("name")}
                  className="w-full bg-[#333] text-white rounded-lg p-2 border border-[#555] focus:outline-none focus:border-green-400 text-sm sm:text-base"
                />
                {editErrors.name && (
                  <p className="text-red-400 text-xs sm:text-sm mt-1">
                    {editErrors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="edit-category"
                  className="text-white block mb-1 text-sm font-medium"
                >
                  Category
                </label>
                <input
                  id="edit-category"
                  {...register("category")}
                  className="w-full bg-[#333] text-white rounded-lg p-2 border border-[#555] focus:outline-none focus:border-green-400 text-sm sm:text-base"
                />
                {editErrors.category && (
                  <p className="text-red-400 text-xs sm:text-sm mt-1">
                    {editErrors.category.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="edit-price"
                  className="text-white block mb-1 text-sm font-medium"
                >
                  Price (₹)
                </label>
                <input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  {...register("price")}
                  className="w-full bg-[#333] text-white rounded-lg p-2 border border-[#555] focus:outline-none focus:border-green-400 text-sm sm:text-base"
                />
                {editErrors.price && (
                  <p className="text-red-400 text-xs sm:text-sm mt-1">
                    {editErrors.price.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="edit-quantity"
                  className="text-white block mb-1 text-sm font-medium"
                >
                  Quantity
                </label>
                <input
                  id="edit-quantity"
                  type="number"
                  {...register("quantity")}
                  className="w-full bg-[#333] text-white rounded-lg p-2 border border-[#555] focus:outline-none focus:border-green-400 text-sm sm:text-base"
                />
                {editErrors.quantity && (
                  <p className="text-red-400 text-xs sm:text-sm mt-1">
                    {editErrors.quantity.message}
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-[#a9a9a9] hover:text-white transition-colors text-sm sm:text-base"
                  disabled={isUpdating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-400 text-black rounded-lg hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Updating..." : "Update Sweet"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {isRestockModalOpen && (
        <div className="fixed inset-0 backdrop-blur-xl bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-[#1a1a1a] rounded-xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md border border-[#333]"
          >
            <h2 className="text-white text-lg sm:text-xl font-semibold mb-4">
              Restock {sweet.name}
            </h2>
            <p className="text-[#a9a9a9] mb-4 text-sm sm:text-base">
              Current stock: {sweet.quantity}
            </p>
            <div className="mb-4">
              <label
                htmlFor="restock-quantity"
                className="text-white block mb-2 text-sm font-medium"
              >
                Quantity to Add
              </label>
              <input
                type="number"
                id="restock-quantity"
                value={restockQuantity}
                onChange={(e) =>
                  setRestockQuantity(parseInt(e.target.value) || 1)
                }
                min="1"
                className="w-full bg-[#333] text-white rounded-lg p-2 border border-[#555] focus:outline-none focus:border-green-400 text-sm sm:text-base"
                disabled={isRestocking}
              />
              {error && (
                <p className="text-red-400 text-xs sm:text-sm mt-2">{error}</p>
              )}
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsRestockModalOpen(false);
                  setError(null);
                  setRestockQuantity(1);
                }}
                className="px-4 py-2 text-[#a9a9a9] hover:text-white transition-colors text-sm sm:text-base"
                disabled={isRestocking}
              >
                Cancel
              </button>
              <button
                onClick={handleRestock}
                className="px-4 py-2 bg-green-400 text-black rounded-lg hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                disabled={isRestocking}
              >
                {isRestocking ? "Restocking..." : "Confirm Restock"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 backdrop-blur-xl bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-[#1a1a1a] rounded-xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md border border-[#333]"
          >
            <h2 className="text-white text-lg sm:text-xl font-semibold mb-4">
              Delete {sweet.name}?
            </h2>
            <p className="text-[#a9a9a9] mb-4 text-sm sm:text-base">
              This action cannot be undone. Are you sure you want to delete this
              sweet?
            </p>
            {error && (
              <p className="text-red-400 text-xs sm:text-sm mb-4">{error}</p>
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="px-4 py-2 text-[#a9a9a9] hover:text-white transition-colors text-sm sm:text-base"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-400 text-white rounded-lg hover:bg-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};
