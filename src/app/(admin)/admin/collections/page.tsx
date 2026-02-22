import Link from "next/link";
import { Plus, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import {
    MoreHorizontal,
    Trash2,
    Edit3,
    ExternalLink,
    Loader2,
    AlertCircle
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteCollection } from "@/lib/actions/collections";
import { toast } from "@/hooks/use-toast";
import * as motion from "framer-motion/client";
import { ClientCollectionsList } from "@/components/admin/collections/client-collections-list";

export default async function CollectionsPage() {
    const supabase = await createClient();
    const { data: collections } = await supabase
        .from('collections')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        <ClientCollectionsList initialCollections={collections || []} />
    );
}
