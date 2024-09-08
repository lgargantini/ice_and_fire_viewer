"use client";
import React from "react";
import { Character } from "@/data/types";

interface ICharactersProps {
    characterIds: string[];
    allCharacters: Character[];
}

export default function Characters({ characterIds, allCharacters }: ICharactersProps): React.JSX.Element {
    //get unique characters EXPENSIVE OPERATIONS, I RECOMMEND TO DO THIS IN THE BACKEND
    const characters = allCharacters?.filter((character: Character) => characterIds.includes(character.url));
    const uniqueCharacters = characters?.filter((character, index, self) =>
        index === self.findIndex((t) => (
            t.url === character.url
        ))
    )

    if (characterIds.length === 0) {
        return (
            <ul id="default_response_not_found">
                <li className="flex flex-row gap-2">
                    <p className="text-sm font-sans font-normal text-white-900">
                        This house has no sworn members
                    </p>
                </li>
            </ul>)
    }

    const getNameOrFirstAlias = (character: Character): string => {
        //attempt to get the name, if not available get the first alias
        if (character.name) {
            return character.name;
        }
        if (character.aliases.length > 0) {
            return character.aliases[0];
        }
        //if no name or alias is available, return unknown as the name
        return "Unknown";
    }

    const getStatus = (character: Character): string => {
        return character.died ? `Deceased: ${character.died}` : "Alive"
    }

    return (
        <ul className="flex flex-col gap-2">
            {uniqueCharacters?.map((character: Character) => (
                <li key={character.url} className="flex flex-row gap-2">
                    <p className="text-sm font-sans font-normal text-white-900">
                        {getNameOrFirstAlias(character)}
                    </p>
                    <p className="text-sm font-sans font-normal text-white-900"> - </p>
                    <p className="text-sm font-sans font-normal text-white-900">
                        {getStatus(character)}
                    </p>
                </li>
            ))
            }
        </ul >
    )
}