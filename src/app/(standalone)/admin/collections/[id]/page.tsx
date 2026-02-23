import { notFound } from "next/navigation";
import { CollectionDetail } from "@/components/admin/collections/collection-detail";
import { getCollection } from "@/lib/actions/collections";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const data = await getCollection(id);

    if (!data) {
        return notFound();
    }

    return <CollectionDetail initialData={data} id={id} />;
}
