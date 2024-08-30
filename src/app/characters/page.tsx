import { Character } from "@/data/types";

interface ICharactersProps {
    charactersLink: string[];
    characters: Character[];
}

export default function Characters({ charactersLink, characters: allCharacters }: ICharactersProps) {
    const characters = allCharacters.filter((character: Character) => charactersLink.includes(character.url));

    if (charactersLink.length === 0) {
        return (
            <ul>
                <li className="flex flex-row gap-2">
                    <p className="text-sm font-sans font-normal text-white-900">This house has no sworn members
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
        return "Unknown";
    }

    const getStatus = (character: Character): string => {
        return character.died ? `Deceased: ${character.died}` : "Alive"
    }

    return (
        <ul className="flex flex-col gap-2">
            {characters.map((character: Character) => (
                <li key={character.url} className="flex flex-row gap-2">
                    <p className="text-sm font-sans font-normal text-white-900">{getNameOrFirstAlias(character)}</p>
                    <p className="text-sm font-sans font-normal text-white-900">- </p>
                    <p className="text-sm font-sans font-normal text-white-900">
                        {getStatus(character)}
                    </p>
                </li>
            ))
            }
        </ul >
    )
}