import { Character } from "@/data/types";

interface ICharactersProps {
    charactersLink: string[];
    characters: Character[];
}

export default function Characters({ charactersLink, characters }: ICharactersProps) {
    const charactersToDisplay = characters.filter((character: Character) => charactersLink.includes(character.url));
    console.log('charactersToDisplay', charactersToDisplay);

    if (charactersLink.length === 0) {
        return <ul><li>This house has no sworn members</li></ul>
    }

    return (
        <ul className="flex flex-col gap-2">
            {charactersToDisplay.map((character: Character) => (
                <li key={character.url} className="flex flex-row gap-2">
                    <p className="text-sm font-sans font-normal text-white-900">{character.name}</p>
                    <p className="text-sm font-sans font-normal text-white-900">
                        {character.died ? `Died : ${character.died}` : "Alive"}
                    </p>
                </li>
            ))
            }
        </ul >
    )
}