//fetch data from https://anapioficeandfire.com/api/houses using fetch
const HOUSE_URL: URL = new URL('https://anapioficeandfire.com/api/houses');

export const FetchICEAndFireHouses = (page: number, pageSize: number) => (
    handlePaginationAsync(HOUSE_URL, page, pageSize)
        .then(response => response?.json())
        .catch(error => console.error(error))
);

// Pagination
// You specify which page you want to access with the ?page parameter,
// if you don't provide the ?page parameter the first page will be returned. You can also specify the size of the page with the ?pageSize parameter, 
// if you don't provide the ?pageSize parameter the default size of 10 will be used.
// Let's make a request for the first page of characters with a page size of 10.

// e.g.: 
// https://www.anapioficeandfire.com/api/characters?page=1&pageSize=10
// https://anapioficeandfire.com/api/houses?page=100&pageSize=10
// it will return empty string for the last page

export const handlePaginationAsync = async (url: URL, page: number, pageSize: number): Promise<Response | void> => {
    try {
        const base_url: URL = new URL(url);
        if (page !== 0) {
            base_url.searchParams.append('page', page.toString());
        }
        if (pageSize !== 0) {
            base_url.searchParams.append('pageSize', pageSize.toString());
        }
        const response = await fetch(base_url.href);
        return response;
    } catch (error) {
        return console.error(error);
    }
}

export const FetchCharactersInBulk = (characterLinks: string[]) => (
    Promise.all(characterLinks.map(characterLink => fetch(characterLink).then(response => response.json())))
        .catch(error => console.error(error))
);
