import Link from "next/link";

export interface IPagination {
    page: number;
    hasNext: boolean;
}

const nextPage = (page: number) => Number(1 + page);

export default function Pagination({ page, hasNext }: IPagination) {
    const hasPrevious = page > 1; //assumption: if the page is greater than 1, there is a previous page

    return (
        <div className="flex justify-center items-center gap-8">
            <Link href={page > 2 ? `/houses/${page - 1}` : '/'} passHref legacyBehavior prefetch={true}>
                <button
                    disabled={hasPrevious ? false : true}
                    className="relative h-8 max-h-[32px] w-8 max-w-[32px] select-none rounded-lg border border-gray-900 text-center align-middle font-sans text-xs font-medium uppercase text-white-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    data-testid="prev_button"
                    type="button">
                    <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"
                            aria-hidden="true" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"></path>
                        </svg>
                    </span>
                </button>
            </Link>
            <p className="block font-sans text-base antialiased font-normal leading-relaxed text-white-700">
                <b className="text-white-900" data-testid="page_number">Page {page}</b>
            </p>
            <Link href={`/houses/${nextPage(page)}`} passHref legacyBehavior prefetch={true}>
                <button
                    disabled={hasNext ? false : true}
                    className="relative h-8 max-h-[32px] w-8 max-w-[32px] select-none rounded-lg border border-gray-900 text-center align-middle font-sans text-xs font-medium uppercase text-white-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    data-testid="next_button"
                    type="button">
                    <span className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"
                            aria-hidden="true" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"></path>
                        </svg>
                    </span>
                </button>
            </Link>
        </div>
    )
};