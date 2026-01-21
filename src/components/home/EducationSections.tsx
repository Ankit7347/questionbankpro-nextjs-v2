import Image from "next/image";

const sections = [
	{
		title: "B.Tech",
		text: "Bachelor of Technology is an undergraduate academic degree conferred after completion of a three-to-five year program.",
		image: "/images/btech.jpg",
		links: [
			{ label: "AKTU Previous Year Paper Solved / Autonomous (B.Tech)", href: "/exams/undergraduate-programs/btech-cs/pyq/2026" },
			{ label: "Computer Science and Engineering/Information Technology", href: "/exams/undergraduate-programs/btech-cs/pyq/2026" },
			{ label: "Computer System Business System", href: "/exams/undergraduate-programs/btech-cs/pyq/2026" },
			{ label: "Other Branches...", href: "/exams/undergraduate-programs/btech-cs/pyq/2026" },
		],
	},
	{
		title: "CISCE",
		text: "The CISCE is a semi-gov-para privately held board of school education in India that conducts the ICSE and ISC exams.",
		image: "/images/cisce.jpg",
		links: [
			{ label: "12th(ISC) Previous Year Paper", href: "/exams/isc-board/isc-class-12/pyq/2026" },
			{ label: "12th(ISC) Previous Year Solved Papers", href: "/exams/isc-board/isc-class-12/solved-paper" },
			{ label: "10th(ICSE) Previous Year Paper", href: "/exams/icse-board/icse-class-10/pyq/2026" },
			{ label: "10th(ICSE) Previous Year Solved Papers", href: "/exams/icse-board/icse-class-10/solved-paper" },
		],
	},
	{
		title: "CBSE",
		text: "The Central Board of Secondary Education (CBSE) is a national board of education in India, established in 1929 to integrate and cooperate in secondary education.",
		image: "/images/cbse.jpg",
		links: [
			{ label: "12th Previous Year Paper", href: "/exams/cbse-board/cbse-class-12/pyq/2026" },
			{ label: "12th Previous Year Solved Papers", href: "/exams/cbse-board/cbse-class-12/solved-paper" },
			{ label: "10th Previous Year Paper", href: "/exams/cbse-board/cbse-class-10/pyq/2026" },
			{ label: "10th Previous Year Solved Papers", href: "/exams/cbse-board/cbse-class-10/solved-paper" },
		],
	},
	{
		title: "UP Board",
		text: "The Uttar Pradesh State Board of High School and Intermediate Education is an autonomous examining authority.",
		image: "/images/upboard.jpg",
		links: [
			{ label: "12th Previous Year Paper", href: "/exams/up-board/up-board-class-12/pyq/2026" },
			{ label: "12th Previous Year Solved Papers", href: "/exams/up-board/up-board-class-12/solved-paper" },
			{ label: "10th Previous Year Paper", href: "/exams/up-board/up-board-class-10/pyq/2026" },
			{ label: "10th Previous Year Solved Papers", href: "/exams/up-board/up-board-class-10/solved-paper" },
		],
	},
];

export default function EducationSections() {
	return (
		<section className="bg-gray-100 dark:bg-gray-900 py-8 px-4 sm:px-8 md:px-12">
			<div className="max-w-screen-xl mx-auto space-y-12">
				{sections.map((section, i) => {
					const isReversed = i % 2 !== 0;
					return (
						<div
							key={section.title}
							className={`bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow-lg p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-8 ${isReversed ? "sm:flex-row-reverse" : ""}`}
						>
							{/* Text Content */}
							<div className="w-full sm:w-2/3 flex flex-col justify-center space-y-4">
								<h1 className="text-2xl font-bold">{section.title}</h1>
								<p className="text-base">{section.text}</p>

								{/* Link Section with mobile background image */}
								<div className="relative">
									{/* Background image on mobile */}
									<div className="absolute inset-0 sm:hidden">
										<Image
											src={section.image}
											alt={`${section.title} Background`}
											loading="lazy"
											fill
											className="object-contain opacity-60 rounded-lg"
											sizes="(max-width: 768px) 100vw, 50vw"
										/>

										<div className="absolute inset-0 bg-white dark:bg-gray-700 opacity-10 rounded-lg" />
									</div>

									{/* Links */}
									<div className="relative z-10 space-y-2 bg-white/70 dark:bg-gray-800/70 sm:bg-transparent rounded-lg p-2 sm:p-0">
										{section.links.map((link, idx) => (
											<a
												key={idx}
												href={link.href}
												className="block text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm"
											>
												{link.label}
											</a>
										))}
									</div>
								</div>
							</div>

							{/* Desktop Image */}
							<div className="w-full sm:w-1/3 hidden sm:flex justify-center items-center">
								<div className="relative w-[50%] aspect-[1] self-center rounded-lg  border-4 border-gray-300 dark:border-gray-700 p-2 shadow-lg bg-white dark:bg-gray-900">
									<Image
										src={section.image}
										alt={`${section.title} Image`}
										fill
										loading="lazy"
										className="object-contain rounded-md"
									/>

								</div>
							</div>
						</div>
					);
				})}
			</div>
		</section>
	);
}