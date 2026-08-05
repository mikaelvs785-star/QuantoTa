import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { ApiError } from "@/components/ui/ApiError";
import { Button } from "@/components/ui/Button";
import { ProductDetails } from "@/components/products/ProductDetails";
import { ProductSkeleton } from "@/components/products/ProductSkeleton";
import { useProduto } from "@/hooks/useProduto";
export function ProductDetailsPage() { const { id = "" } = useParams(); const productQuery = useProduto(id); if (productQuery.isLoading) return <ProductSkeleton />; if (productQuery.isError || !productQuery.data) return <ApiError onRetry={() => void productQuery.refetch()} />; return <div className="mx-auto max-w-5xl"><Button asChild variant="ghost" className="mb-5"><Link to="/admin/produtos"><ArrowLeft className="size-4" /> Voltar para produtos</Link></Button><ProductDetails product={productQuery.data} /></div>; }

