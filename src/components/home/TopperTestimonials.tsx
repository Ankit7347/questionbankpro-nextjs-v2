import Image from "next/image";

const testimonials = [
	{
		name: "Ashwani",
		message: "This is very useful website.",
		image: "/images/topperimg11.jpg",
	},
	{
		name: "Divyanshu",
		message: "There are good collection of ISC paper.",
		image: "/images/topperimg22.jpg",
	},
	{
		name: "Sawan",
		message: "Helpful for Engineering student.",
		image: "/images/topperimg33.jpg",
	},
	{
		name: "Prateek",
		message: "Knowledge js the key to success and this page bridge the gap between you and knowledge",
		image: "/images/topperimg44.jpg",
	},
];

export default function TopperTestimonials() {
	return (
		<section className="bg-white dark:bg-gray-900 py-6">
			<div className="container mx-auto px-4">
				<div className="flex flex-wrap justify-center gap-6">
					{testimonials.map((t, i) => (
						<div
							key={i}
							className="w-[220px] sm:w-[200px] md:w-[180px] lg:w-[160px] bg-white dark:bg-gray-800 rounded-md shadow-md p-3 flex flex-col justify-between h-[290px]"
						>
							<div className="h-[200px] relative mb-2">
								<Image
									src={t.image}
									alt="topper"
									loading="lazy" // Important!
									fill
									className="rounded-md object-cover"
								/>

							</div>
							<div>
								<h3 className="font-semibold text-sm text-gray-100">{t.name}</h3>
								<p className="text-xs text-gray-400 italic mt-1">&ldquo;{t.message}&rdquo;</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>


	);
}