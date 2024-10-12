# An Interface of Ice and Fire

## Description

> As an avid fan of the epic series `A Song of Ice and Fire`, I have a hard time keeping up with all of the `characters` who lose their heads. As such, I would like to have an application that can help me track which characters from the series are `alive` or `dead`.

#### NOTE: More information about the challenge [here](docs/CHALLENGE.md)


## Feedback

### Technologies

This application is built using `Next.JS` async Server Components.

Source information is requested from the public API `https://anapioficeandfire.com/` (using [fetch](https://fetch.spec.whatwg.org/#fetch-method)).

It allows different size screens -Desktop, Tablet and Mobile-, and we use [TailwindCSS](https://tailwindcss.com/) to style the application (integrated by Next.JS).

### Testing approach

#### Cypress

To perform testing on the application, we use e2e Cypress, as the only known way to test async components properly. Detailed information on Next.JS docs, [ testing - async server components](https://nextjs.org/docs/app/building-your-application/testing#async-server-components).

#### Jest

As first approach I've tried using unit tests with [Jest](https://jestjs.io/), but since all built components are async, on rendering, a Promise<JSX.Element> is returned, and not the actual Element, making hard to perform validations on it.

A key part of unit tests using Jest is, calling `jest.render()`, to display a particular Component, e.g.: `render(<Component />)`. For async components, and latest stable known version of jest (29.6.x), I was receiving errors similar to the one below:

```bash
Uncaught Error: Objects are not valid as a React child (found: [object Promise]). If you meant to render a collection of children, use an array instead.
```
Which means, we are not able to render the component properly, meaning, we are not able to perform validations on it.

##### Next.JS Async Components Issue Discovery

Information about the [issue](https://github.com/vercel/next.js/discussions/52336).

- `React Testing Library` is not able to handle async components properly - wrong approach.
- `act()` to wrap the render function - wrong approach
- `await` to wait for the promise to resolve - wrong approach. 
- `jest.mock()` to mock the async component - wrong approach.

### Improvements

#### Backend

##### API Request vs GraphQL Request

I'd suggest using GraphQL to retrieve each `Sworn Member` (Character). For this short PoC using the API, we are requesting each member as a separated HTTP request to the API, which is not the best approach. This behavior have considerable performance impact on displaying information sooner, since we need to wait for all requests to be completed, before being able to display information.

##### Accurate Request Pagination object

As you can see on this example `GET /houses` request:

```bash
curl --location --request GET 'https://anapioficeandfire.com/api/houses?page=1&pageSize=10'
```
response: 
```json
[{"url":"https://anapioficeandfire.com/api/houses/1","name":"House Algood","region":"The Westerlands","coatOfArms":"A golden wreath, on a blue field with a gold border(Azure, a garland of laurel within a bordure or)","words":"","titles":[],"seats":[],"currentLord":"","heir":"","overlord":"https://anapioficeandfire.com/api/houses/229","founded":"","founder":"","diedOut":"","ancestralWeapons":[],"cadetBranches":[],"swornMembers":[]},{"url":"https://anapioficeandfire.com/api/houses/2","name":"House Allyrion of Godsgrace","region":"Dorne","coatOfArms":"Gyronny Gules and Sable, a hand couped Or","words":"No Foe May Pass","titles":[],"seats":["Godsgrace"],"currentLord":"https://anapioficeandfire.com/api/characters/298","heir":"https://anapioficeandfire.com/api/characters/1922","overlord":"https://anapioficeandfire.com/api/houses/285","founded":"","founder":"","diedOut":"","ancestralWeapons":[],"cadetBranches":[],"swornMembers":["https://anapioficeandfire.com/api/characters/298","https://anapioficeandfire.com/api/characters/1129","https://anapioficeandfire.com/api/characters/1301","https://anapioficeandfire.com/api/characters/1922"]},{"url":"https://anapioficeandfire.com/api/houses/3","name":"House Amber","region":"The North","coatOfArms":"","words":"","titles":[],"seats":[],"currentLord":"","heir":"","overlord":"","founded":"","founder":"","diedOut":"","ancestralWeapons":[],"cadetBranches":[],"swornMembers":[]},{"url":"https://anapioficeandfire.com/api/houses/4","name":"House Ambrose","region":"The Reach","coatOfArms":"Or, semy of ants gules","words":"Never Resting","titles":[],"seats":[],"currentLord":"https://anapioficeandfire.com/api/characters/141","heir":"","overlord":"https://anapioficeandfire.com/api/houses/398","founded":"","founder":"","diedOut":"","ancestralWeapons":[],"cadetBranches":[],"swornMembers":["https://anapioficeandfire.com/api/characters/82","https://anapioficeandfire.com/api/characters/102","https://anapioficeandfire.com/api/characters/141","https://anapioficeandfire.com/api/characters/152","https://anapioficeandfire.com/api/characters/344"]},{"url":"https://anapioficeandfire.com/api/houses/5","name":"House Appleton of Appleton","region":"The Reach","coatOfArms":"Or, an apple tree eradicated proper fructed gules, quartered with argent, a gatehouse cendrée","words":"","titles":[],"seats":["Appleton"],"currentLord":"","heir":"","overlord":"https://anapioficeandfire.com/api/houses/398","founded":"","founder":"","diedOut":"","ancestralWeapons":[],"cadetBranches":[],"swornMembers":[]},{"url":"https://anapioficeandfire.com/api/houses/6","name":"House Arryn of Gulltown","region":"The Vale","coatOfArms":"","words":"","titles":[],"seats":["Gulltown"],"currentLord":"","heir":"","overlord":"https://anapioficeandfire.com/api/houses/7","founded":"","founder":"","diedOut":"","ancestralWeapons":[],"cadetBranches":[],"swornMembers":[]},{"url":"https://anapioficeandfire.com/api/houses/7","name":"House Arryn of the Eyrie","region":"The Vale","coatOfArms":"A sky-blue falcon soaring against a white moon, on a sky-blue field(Bleu celeste, upon a plate a falcon volant of the field)","words":"As High as Honor","titles":["King of Mountain and Vale (formerly)","Lord of the Eyrie","Defender of the Vale","Warden of the East"],"seats":["The Eyrie (summer)","Gates of the Moon (winter)"],"currentLord":"https://anapioficeandfire.com/api/characters/894","heir":"https://anapioficeandfire.com/api/characters/477","overlord":"https://anapioficeandfire.com/api/houses/16","founded":"Coming of the Andals","founder":"https://anapioficeandfire.com/api/characters/144","diedOut":"","ancestralWeapons":[],"cadetBranches":["https://anapioficeandfire.com/api/houses/6"],"swornMembers":["https://anapioficeandfire.com/api/characters/49","https://anapioficeandfire.com/api/characters/92","https://anapioficeandfire.com/api/characters/93","https://anapioficeandfire.com/api/characters/107","https://anapioficeandfire.com/api/characters/223","https://anapioficeandfire.com/api/characters/265","https://anapioficeandfire.com/api/characters/300","https://anapioficeandfire.com/api/characters/356","https://anapioficeandfire.com/api/characters/477","https://anapioficeandfire.com/api/characters/508","https://anapioficeandfire.com/api/characters/540","https://anapioficeandfire.com/api/characters/548","https://anapioficeandfire.com/api/characters/558","https://anapioficeandfire.com/api/characters/572","https://anapioficeandfire.com/api/characters/688","https://anapioficeandfire.com/api/characters/894","https://anapioficeandfire.com/api/characters/1068","https://anapioficeandfire.com/api/characters/1193","https://anapioficeandfire.com/api/characters/1280","https://anapioficeandfire.com/api/characters/1443","https://anapioficeandfire.com/api/characters/1655","https://anapioficeandfire.com/api/characters/1693","https://anapioficeandfire.com/api/characters/1715","https://anapioficeandfire.com/api/characters/1884"]},{"url":"https://anapioficeandfire.com/api/houses/8","name":"House Ashford of Ashford","region":"The Reach","coatOfArms":"Tenny, a sun in splendour beneath a chevron inverted argent","words":"Our Sun Shines Bright","titles":["Lord of Ashford"],"seats":["Ashford"],"currentLord":"","heir":"","overlord":"https://anapioficeandfire.com/api/houses/398","founded":"","founder":"","diedOut":"","ancestralWeapons":[],"cadetBranches":[],"swornMembers":["https://anapioficeandfire.com/api/characters/121","https://anapioficeandfire.com/api/characters/641","https://anapioficeandfire.com/api/characters/895","https://anapioficeandfire.com/api/characters/1812"]},{"url":"https://anapioficeandfire.com/api/houses/9","name":"House Ashwood","region":"The North","coatOfArms":"","words":"","titles":[],"seats":[],"currentLord":"","heir":"","overlord":"https://anapioficeandfire.com/api/houses/34","founded":"","founder":"","diedOut":"","ancestralWeapons":[],"cadetBranches":[],"swornMembers":[]},{"url":"https://anapioficeandfire.com/api/houses/10","name":"House Baelish of Harrenhal","region":"The Riverlands","coatOfArms":"A field of silver mockingbirds, on a green field(Vert, semé of mockingbirds argent)","words":"","titles":["Lord Paramount of the Trident","Lord of Harrenhal"],"seats":["Harrenhal"],"currentLord":"https://anapioficeandfire.com/api/characters/823","heir":"","overlord":"https://anapioficeandfire.com/api/houses/16","founded":"299 AC","founder":"https://anapioficeandfire.com/api/characters/823","diedOut":"","ancestralWeapons":[],"cadetBranches":[],"swornMembers":["https://anapioficeandfire.com/api/characters/651","https://anapioficeandfire.com/api/characters/804","https://anapioficeandfire.com/api/characters/823","https://anapioficeandfire.com/api/characters/957","https://anapioficeandfire.com/api/characters/970"]}]
```

We are not receiving a well detailed pagination object as response, which prevent us to handle pagination accordingly on the frontend.

With current backend pagination handling, we are allowed to split houses results and iterate through pages using HTTP request params (`page=PAGE_NUMBER`,`pageSize=PAGE_LIMIT`), but unluckly, we don't have a clean way to know how many results nor how many pages are left, given an specific limit.

Additionally, even considering we produce a convention to determine we reach the latest page of results (e.g.: page 9, considering a limit of 10 results per time, and having total results of 100 houses). We are still able to request more pages, by current API design, even when no more results are available to show.

Suggested pagination body response for API `GET /houses` endpoint:
```json
{
    "page": 1,
    "limit": 10,
    "total": 100,
    "total_pages": 10,
    "results": [
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
Having proper pagination object, we are able to handle pagination on the frontend side, and show end users how many pages are left, and how many results are left to show.

#### Frontend

##### Pagination
On top of a more precise pagination object on the request. We should properly adjust the pagination component on the frontend to display results accordingly, and show end users how many pages are left, and how many results are left to show.
* `total results`: (given an specific limit of results)
* `remaining pages`: (given an specific limit of results we should be able to computate how many are left )

Allowing end users, to navigate through houses in a more precise and enjoyable way. And even when navigating directly to an specific route, e.g.: page 5 (`/houses/5`). We should be able to show correct before and after pages to navigate.

##### Suggestions

###### Search component
We can add a search component to allow end users searching for specific sworn members or houses, and not only displaying all houses results paginated as we are doing now.

###### Filter component
Add a filter component to allow end users filtering  characters by status (alive or dead), Houses by their location, and others. This may include changes on the backend side, to allow filtering by specific object  attributes faster.

###### Expand Sworn Member information
Add a feature to allow end users to click on an specific Sworn Member, and see more information about it, like the house it belongs to, gender, aliases, and more.

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