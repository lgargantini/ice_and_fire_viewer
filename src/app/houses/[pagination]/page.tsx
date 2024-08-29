import { FetchCharactersInBulk, FetchICEAndFireHouses } from "@/data/queries";
import { Suspense } from "react";
import { House } from "@/data/types";
import Link from "next/link";
import Characters from "../../characters/page";

export default async function Houses({ params: { pagination = "1" } }: { params: { pagination: string } }) {
    const houses: House[] = await FetchICEAndFireHouses(parseInt(pagination), 10);
    const housesWithSwornMembers = houses.filter((house: House) => (house.swornMembers.length > 0))
    const charactersLink = housesWithSwornMembers.map((house: House) => {
        return house.swornMembers;
    }).flat(1);
    const characters = await FetchCharactersInBulk(charactersLink).then((data) => {
        //translate response to Character type
        //add data validation and error handling
        //next step: display the data in a table
        if (data?.length === 0) return [];
        if (data) {
            return data;
        }
    }).catch((error) => console.error(error));
    const hasPrevious = parseInt(pagination) > 1;
    const hasNext = houses.length < 0; //no more results to show
    const nextPage = (page: number) => Number(1 + page);

    const PaginationComponent = (page: number, hasPrevious: boolean, hasNext: boolean) => (
        <div className="flex items-center gap-8">
            <Link href={page > 2 ? `/houses/${page - 1}` : '/'}>
                <button disabled={!hasPrevious}
                    className="relative h-8 max-h-[32px] w-8 max-w-[32px] select-none rounded-lg border border-gray-900 text-center align-middle font-sans text-xs font-medium uppercase text-white-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
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
                Page <b className="text-white-900">{page}</b>
            </p>
            <Link href={`/houses/${nextPage(page)}`}>
                <button
                    disabled={!hasNext}
                    className="relative h-8 max-h-[32px] w-8 max-w-[32px] select-none rounded-lg border border-gray-900 text-center align-middle font-sans text-xs font-medium uppercase text-white-900 transition-all hover:opacity-75 focus:ring focus:ring-gray-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    // onClick={() => hasNext && setPage(page + 1)}
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

    return (
        <div className="container mx-auto">
            <div className="flex flex-col gap-4">
                <h1 className="text-4xl font-sans font-bold text-white-900">Game of Thrones Houses</h1>
                <table className="w-full table-auto">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Region</th>
                            <th className="px-4 py-2">Sworn Members</th>
                        </tr>
                    </thead>
                    <tbody>
                        {houses?.map((house: House, index: number) => {
                            return (
                                <tr key={index}>
                                    <td className="border px-4 py-2">{house.name}</td>
                                    <td className="border px-4 py-2">{house.region}</td>
                                    {characters?.length && <td className="border px-4 py-2">
                                        <Suspense fallback={<div>Loading...</div>}>
                                            <Characters charactersLink={house.swornMembers} characters={characters} />
                                        </Suspense>
                                    </td>}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {PaginationComponent(parseInt(pagination), hasPrevious, hasNext)}
            </div>
        </div>
    )
}