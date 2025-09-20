import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { createResponse } from "../common/helper/response.helper";
import * as sweetServices from "./sweets.services";

export const createSweet = asyncHandler(async (req: Request, res: Response) => {
  const result = await sweetServices.createSweet(req.body);
  res.send(createResponse(result, "Sweet created successfully"));
});

export const getAllSweets = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await sweetServices.getAllSweets();
    res.send(createResponse(result));
  }
);

export const searchSweets = asyncHandler(
  async (req: Request, res: Response) => {
    const { search, category, minPrice, maxPrice } = req.query;

    const minPriceNum = minPrice ? parseFloat(minPrice as string) : undefined;
    const maxPriceNum = maxPrice ? parseFloat(maxPrice as string) : undefined;

    const result = await sweetServices.searchSweets({
      search: (search as string) || undefined,
      category: (category as string) || undefined,
      minPrice: isNaN(minPriceNum!) ? undefined : minPriceNum,
      maxPrice: isNaN(maxPriceNum!) ? undefined : maxPriceNum,
    });
    res.send(createResponse(result));
  }
);

export const updateSweet = asyncHandler(async (req: Request, res: Response) => {
  const result = await sweetServices.updateSweet(req.params.id, req.body);
  res.send(createResponse(result, "Sweet updated successfully"));
});

export const deleteSweet = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user || req.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required");
  }

  await sweetServices.deleteSweet(req.params.id);
  res.send(createResponse(null, "Sweet deleted successfully"));
});

export const purchaseSweet = asyncHandler(
  async (req: Request, res: Response) => {
    const { quantity } = req.body;
    const sweetId = req.params.id;

    const result = await sweetServices.purchaseSweet(sweetId, quantity);
    res.send(createResponse(result, "Sweet purchased successfully"));
  }
);

export const restockSweet = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.user || req.user.role !== "ADMIN") {
      throw new Error("Unauthorized: Admin access required");
    }

    const { quantity } = req.body;
    const sweetId = req.params.id;

    const result = await sweetServices.restockSweet(sweetId, quantity);
    res.send(createResponse(result, "Sweet restocked successfully"));
  }
);
