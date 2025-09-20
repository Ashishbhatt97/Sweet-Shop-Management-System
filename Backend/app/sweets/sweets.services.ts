import prisma from "../config/prismaClient";
import { ISweet } from "./sweets.dto";

export const createSweet = async (data: ISweet) => {
  const isSweetExists = await sweetExists(data.name);

  if (isSweetExists) {
    throw new Error("Sweet already exists");
  }

  const result = await prisma.sweet.create({
    data: {
      name: data.name,
      category: data.category,
      price: data.price,
      quantity: data.quantity,
      isActive: data.isActive ?? true,
    },
  });

  return result;
};

export const getAllSweets = async () => {
  const result = await prisma.sweet.findMany({
    where: { isActive: true },
  });
  return result;
};

export const searchSweets = async (filters: {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}) => {
  const { search, category, minPrice, maxPrice } = filters;

  const priceFilter: any = {};
  if (minPrice !== undefined) priceFilter.gte = minPrice;
  if (maxPrice !== undefined) priceFilter.lte = maxPrice;

  const result = await prisma.sweet.findMany({
    where: {
      isActive: true,
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { category: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(category && { category: { equals: category, mode: "insensitive" } }),
      ...(Object.keys(priceFilter).length > 0 && { price: priceFilter }),
    },
  });

  return result;
};

export const updateSweet = async (id: string, data: Partial<ISweet>) => {
  const result = await prisma.sweet.update({
    where: { id },
    data,
  });
  return result;
};

export const deleteSweet = async (id: string) => {
  console.log(id);
  const result = await prisma.sweet.update({
    where: { id },
    data: { isActive: false },
  });
  return result;
};

export const sweetExists = async (name: string) => {
  const result = await prisma.sweet.findUnique({
    where: { name },
  });
  return result;
};

export const purchaseSweet = async (id: string, quantity: number) => {
  const sweet = await prisma.sweet.findUnique({
    where: { id, isActive: true },
  });

  if (!sweet) {
    throw new Error("Sweet not found or not available");
  }

  if (sweet.quantity < quantity) {
    throw new Error("Insufficient stock available");
  }

  const result = await prisma.sweet.update({
    where: { id },
    data: {
      quantity: {
        decrement: quantity,
      },
    },
  });

  return result;
};

export const restockSweet = async (id: string, quantity: number) => {
  const sweet = await prisma.sweet.findUnique({
    where: { id },
  });

  if (!sweet) {
    throw new Error("Sweet not found");
  }

  const result = await prisma.sweet.update({
    where: { id },
    data: {
      quantity: {
        increment: quantity,
      },
    },
  });

  return result;
};
