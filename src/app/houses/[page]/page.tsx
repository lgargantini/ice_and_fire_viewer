// import { useEffect, useMemo, useState } from "react";
import { FetchCharactersInBulk, FetchICEAndFireHouses } from "@/data/queries";
import { House } from "@/data/types";
import Characters from "./_ui/characters/characters";
import Pagination from "./_ui/houses/pagination";
import { API_BASE_URL, HOUSE_DEFAULT_ID, HOUSES_TABLE_HEADER_ATTRIBUTES } from "@/data/constants";

export default async function Houses({ params: { page = "1" } }: { params: { page?: string } }) {
    const houses: House[] = await FetchICEAndFireHouses(parseInt(page), 10);
    const housesWithSwornMembers: House[] = houses.filter((house: House) => (house.swornMembers.length > 0))
    //flatten the array to get all the characters links
    const characterId: string[] = housesWithSwornMembers.map((house: House) => house.swornMembers).flat(1);
    const characters = await FetchCharactersInBulk(characterId).then((data) => {
        if (data?.length === 0) return [];
        if (data) {
            return data;
        }
    }).catch((error) => console.error(error));

    const LoadingCharacters = () => {
        return (
            <ul id="default_response_not_found">
                <li className="flex flex-row gap-2">
                    <p className="text-sm font-sans font-normal text-white-900">
                        Loading...
                    </p>
                </li>
            </ul>)
    }

    const hasNext: boolean = houses?.length > 0 && houses.length === 10; //assumption: if the length of the response is 10, there is a next page

    //function to get the house id from the url
    function getHouseID(House: House): string | undefined {
        try {
            const url = new URL(House.url);
            if (url.origin !== API_BASE_URL || !url.pathname.startsWith("/api/houses/")) {
                console.error("Invalid URL", url.href);
                return HOUSE_DEFAULT_ID;
            }
            const hasID = url.pathname.split("/").length > 3;
            return hasID ? url.pathname.split("/").pop() : HOUSE_DEFAULT_ID;
        } catch (e) {
            console.log("Error parsing URL", e);
            return HOUSE_DEFAULT_ID;
        }
    }

    //houses found
    return (
        <div className="flex flex-col gap-4">
            <h1 className="flex justify-center text-4xl font-sans font-bold text-white-900">Game of Thrones Houses</h1>
            <table className="w-full table-auto">
                <thead>
                    <tr>
                        {HOUSES_TABLE_HEADER_ATTRIBUTES.map((header: string) => (
                            <th key={header} className="text-white-900 px-4 py-2">{header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {houses?.map((house: House) => {
                        const characterId = getHouseID(house)//get house id
                        return (
                            <tr key={characterId}>
                                <td className="border px-4 py-2" data-testid={`house_name_${characterId}`}>{house.name}</td>
                                <td className="border px-4 py-2" data-testid={`house_region_${characterId}`}>{house.region}</td>
                                <td className="border px-4 py-2" data-testid={`house_sworn_members_${characterId}`}>
                                    {characters?.length ?
                                        <Characters characterIds={house.swornMembers} allCharacters={characters} />
                                        : <LoadingCharacters />
                                    }
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <Pagination page={parseInt(page)} hasNext={hasNext} />
        </div>
    )
}