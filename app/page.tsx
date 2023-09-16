"use client";
import {trpc} from "@/app/trpc";
import ProductCard from "@/components/product-card";

export default function Home() {
	const products = trpc.getProducts.useQuery();
	if (products.isLoading) {
		return <h1>Loading</h1>
	}
	return (
		<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
			<div className="grid md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-4 gap-4">
				{(products.data && products.data.length > 0) ? products.data?.map((product, index) => (
					<ProductCard
						key={index}
						{...product}
					/>
				)): <h1>Loading</h1>}
			</div>
		</section>
	);
}
