import { NewProductWizard } from "@/components/admin/inventory/new-product-wizard";
import { getCategories } from "@/lib/actions/categories";

export default async function NewProductPage() {
    const { data: categories = [] } = await getCategories();
    return <NewProductWizard availableCategories={categories} />;
}
