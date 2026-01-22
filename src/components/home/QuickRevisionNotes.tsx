import Image from "next/image";

const QuickRevisionNotes = () => {
  return (
    <section className="w-full min-h-[40vh] md:min-h-[40vh] flex justify-center items-center bg-green-400 dark:bg-green-600 px-3 sm:px-6 md:px-12 py-10 md:py-0">
      <div className="w-full max-w-screen-xl flex flex-col md:flex-row justify-between items-center gap-4 md:gap-8">
        {/* Left Side */}
        <div className="flex flex-col justify-center w-full md:w-1/2 text-center md:text-left">
          <h1 className="text-2xl sm:text-3xl text-gray-800 dark:text-gray-100 font-semibold mt-5">
            Quick Revision Notes
          </h1>
          <p className="text-sm sm:text-lg mt-2 sm:mt-4 text-gray-900 dark:text-gray-300">
            Easy to learn and Easy to Study.
          </p>
          <div className="mt-4 sm:mt-6 space-x-2 flex justify-center md:justify-start">
            <a
              href="https://www.youtube.com/channel/UCeCtZG6ZLtU-8M8P7__0L6Q?sub_confirmation=1"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="text-white bg-gray-800 rounded-full py-1.5 px-4 text-sm sm:text-base hover:scale-105 transition-transform dark:bg-gray-700">
                Subscribe
              </button>
            </a>
            <a
              href="https://www.youtube.com/channel/UCeCtZG6ZLtU-8M8P7__0L6Q"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="text-white bg-gray-800 rounded-full py-1.5 px-4 text-sm sm:text-base hover:scale-105 transition-transform dark:bg-gray-700">
                Watch
              </button>
            </a>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="w-28 sm:w-40 aspect-square relative">
            <Image
              src="/images/logo.png"
              alt="Logo"
              fill
              className="object-contain rounded-lg border-2 dark:border-gray-600"
              sizes="(max-width: 768px) 40vw, 20vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuickRevisionNotes;