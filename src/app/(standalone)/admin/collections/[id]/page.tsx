import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { CollectionDetail } from "@/components/admin/collections/collection-detail";
import { getCollection } from "@/lib/actions/collections";

export default async function Page({ params }: { params: { id: string } }) {
    const data = await getCollection(params.id);

    if (!data) {
        return notFound();
    }

    return <CollectionDetail initialData={data} id={params.id} />;
}
