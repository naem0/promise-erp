import BulkProductImport from "@/components/inventory/inventory-items/BulkProductImport";
import PermissionGuard from "@/components/auth/PermissionGuard";
import { getProductCategories, ProductCategory } from "@/apiServices/inventoryCategoriesService";
import { getBrands, Brand } from "@/apiServices/inventoryBrandsService";
import { getUnits, Unit } from "@/apiServices/inventoryUnitsService";
import { getProductItems, ProductItem } from "@/apiServices/inventoryItemsService";

export default async function BulkUploadPage() {
  let categories: ProductCategory[] = [];
  let brands: Brand[] = [];
  let units: Unit[] = [];
  let existingProducts: ProductItem[] = [];

  // Fetch Categories
  try {
    const catRes = await getProductCategories({ per_page: 500 });
    categories = catRes?.data?.categories || [];
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "digest" in error) throw error;
    if (error instanceof Error) {
      console.error("BulkUploadPage: failed to fetch categories:", error.message);
    } else {
      console.error("BulkUploadPage: failed to fetch categories:", error);
    }
  }

  // Fetch Brands
  try {
    const brandRes = await getBrands({ per_page: 500 });
    brands = brandRes?.data?.brands || [];
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "digest" in error) throw error;
    if (error instanceof Error) {
      console.error("BulkUploadPage: failed to fetch brands:", error.message);
    } else {
      console.error("BulkUploadPage: failed to fetch brands:", error);
    }
  }

  // Fetch Units
  try {
    const unitRes = await getUnits({ per_page: 500 });
    units = unitRes?.data?.units || [];
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "digest" in error) throw error;
    if (error instanceof Error) {
      console.error("BulkUploadPage: failed to fetch units:", error.message);
    } else {
      console.error("BulkUploadPage: failed to fetch units:", error);
    }
  }

  // Fetch Products
  try {
    const prodRes = await getProductItems({ per_page: 1000 });
    existingProducts = prodRes?.data?.products || [];
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "digest" in error) throw error;
    if (error instanceof Error) {
      console.error("BulkUploadPage: failed to fetch products:", error.message);
    } else {
      console.error("BulkUploadPage: failed to fetch products:", error);
    }
  }

  return (
    <PermissionGuard requiredPermission="create-products">
      <BulkProductImport
        initialCategories={categories}
        initialBrands={brands}
        initialUnits={units}
        initialExistingProducts={existingProducts}
      />
    </PermissionGuard>
  );
}
