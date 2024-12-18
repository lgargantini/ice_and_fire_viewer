# An Interface of Ice and Fire

This project is a Next.js application that tracks characters from George R.R. Martin's "A Song of Ice and Fire" series (adapted for TV as "Game of Thrones"). It uses data fetched from the [An API of Ice and Fire](https://anapioficeandfire.com/) public API.

## Description

> As an avid fan of the epic series `A Song of Ice and Fire`, I have a hard time keeping up with all of the `characters` who lose their heads. As such, I would like to have an application that can help me track which characters from the series are `alive` or `dead`.

#### NOTE: More information about the challenge [here](docs/CHALLENGE.md)

## Technologies

* **Next.js:** Built using the Next.js framework leveraging async server components for efficient data fetching and rendering.
* **Character Tracking:** Displays character names, the series they are from, and their current status (alive or dead) in a clear table format.
*   **Tailwind CSS:** Styled with Tailwind CSS for a clean and responsive user interface.
*   **Cypress Testing:** Uses Cypress for end-to-end testing, ensuring the application's functionality.
**Source information** is requested from the public API `https://anapioficeandfire.com/` (using [fetch](https://fetch.spec.whatwg.org/#fetch-method)).

### Display Information
 Covered screens -Desktop, Tablet and Mobile-, and we use [TailwindCSS](https://tailwindcss.com/) to style the application (integrated by Next.JS).

### Testing

#### Cypress

To perform testing on the application, we use e2e Cypress, as the only known way to test async components properly. Detailed information on Next.JS docs, [ testing - async server components](https://nextjs.org/docs/app/building-your-application/testing#async-server-components).

### Improvements

This project can be enhanced with the following considerations:

#### Backend

##### API Request vs GraphQL Request

I'd suggest using GraphQL to retrieve all `Sworn Members` (Characters) from a specific `House`, instead of making multiple requests to the API to retrieve each member.

For this short PoC, we are requesting each character as a separated HTTP request. This behavior have considerable performance impact on displaying information, since we need to wait for all requests to be completed, before being able to display information.

This makes the application slower, and less responsive. Consider a scenario where we have a house with 100 members, we would need to wait for 100 requests (with slow connections might take ~0.5 seconds), before being able to display information.

##### Accurate Request Pagination object on API response

As you can see on this example `GET /houses` request:

```bash
curl --location --request GET 'https://anapioficeandfire.com/api/houses?page=1&pageSize=10'
```
response: 
```json
[
    {
        "url": "https://anapioficeandfire.com/api/houses/1",
        "name": "House Algood",
        "region": "The Westerlands",
        "coatOfArms": "A golden wreath, on a blue field with a gold border(Azure, a garland of laurel within a bordure or)",
        "words": "",
        "titles": [],
        "seats": [],
        "currentLord": "",
        "heir": "",
        "overlord": "https://anapioficeandfire.com/api/houses/229",
        "founded": "",
        "founder": "",
        "diedOut": "",
        "ancestralWeapons": [],
        "cadetBranches": [],
        "swornMembers": []
    },
]
```
We are not able to know how many results are left to visit, nor how many pages are left to visit, given a specific limit of pages we are visiting. I'd suggest adding well detailed pagination object on the request response.

Currently we are allowed to split results and iterate through pages using HTTP request params (`page=PAGE_NUMBER`,`pageSize=PAGE_LIMIT`). Considering only two parameters for page handling, is not a desirable, since we lack information of how many results nor how many pages are left, given an specific limit of pages we choose on the device.
Additionally, even considering a convention to ensure we reached the latest page of results for all parameters scenarios (e.g.: page 9, considering a limit of 10 results per time, and having a total amount of 100 houses). We are still able to hit more pages, by API design, even when no more results are available.

Suggested pagination body response for API `GET /houses` endpoint:
```json
{
    "page": 1,
    "limit": 10,
    "results_size": 100,
    "data": [
        {
            "name": "House Stark",
            ...
            "swornMembers": [
                {
                    "name": "Jon Snow",
                    "status": "Alive"
                },
                ...
            ]
        },
        ...
    ],
}
```

This way, we can handle pagination in a more precise way, and avoid unnecessary requests to the API.

* `page`: (given an specific limit)
    `"page": 1,`
* `limit`: 
    `"limit": 10,`
* `results size`: (total amount of results)
    `"results_size": 100,`
* `total pages`: (given an specific limit, we can identify how many results are left to visit )

And the `data` object, containing the results, and the information we need to display.

#### Frontend

##### Pagination

On top of a more precise pagination object on the Backend request (`##Accurate Request Pagination object on API response` Section). We need properly adjust of the pagination frontend component to display results accordingly.
Allowing end users, to navigate precisely through the results, and avoid unnecessary requests to the API.

##### Product Suggestions

###### Search component
We can add a search component to allow end users searching for specific sworn members or houses, and not only displaying all houses.

###### Filter component
Filter component to enable end users filtering characters by attributes. This should include changes on the backend side along with extremely curated expectations of how it should perform this filter and specific scenarios combining categories of attributes.

###### Expand Character information
Engaging information resources to allow end users, know more about specific characters attributes.

#### Repository Improvements

##### Git Hooks
We can add a pre-commit hook to run lint and commit message format, before committing changes to the repository.

##### CI/CD
We can add a CI/CD pipeline to run tests, lint, and other intended npm commands on each PR, and only when those jobs are succesfull, deploy the application to a upper environments ( stage, uat, production ), as a precise way, to save time for devs.

## Getting Started
### Install dependencies
```bash
npm i
```
### Run development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Run build
```bash
npm run build
```

### Run lint
```bash
npm run lint
```

### Run E2E cypress tests
```bash
npm run cypress:open
```

## Known Issues
#### Jest

As first approach I've tried using unit tests with [Jest](https://jestjs.io/), but since all built components are async, on rendering, a Promise<JSX.Element> is returned, and not the actual Element, making hard to perform validations on it.

A key part of unit tests using Jest is, calling `jest.render()`, to display a particular Component, e.g.: `render(<Component />)`. For async components, and latest stable known version of jest (29.6.x), I was receiving errors similar to the one below:

```bash
Uncaught Error: Objects are not valid as a React child (found: [object Promise]). If you meant to render a collection of children, use an array instead.
```
Which means, we are not able to render the component properly, and perform validations on it.

##### Next.JS Async Components Issue Discovery

Information about the [Async Component - Issue](https://github.com/vercel/next.js/discussions/52336)

- `React Testing Library` is not able to handle async components properly - wrong approach.
- `act()` to wrap the render function - wrong approach
- `await` to wait for the promise to resolve - wrong approach. 
- `jest.mock()` to mock the async component - wrong approach.


## Contributing

Contributions to the project are welcome! Please fork the repository and submit a pull request with your proposed changes.