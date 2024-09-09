# An Interface of Ice and Fire

## Description

"As an avid fan of the epic series `A Song of Ice and Fire`, I have a hard time keeping up with all of the `characters` who lose their heads. As such, I would like to have an application that can help me track which characters from the series are `alive` or `dead`."

#### NOTE: More information about the challenge [here](docs/CHALLENGE.md)

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

### Run e2e cypress tests
```bash
npm run cypress:open
```

## Feedback

### Technologies

This application was created with Next.JS, using async Server Components. Backend data is fetched from `https://anapioficeandfire.com/` API (using [fetch API](https://fetch.spec.whatwg.org/#fetch-method)), and passed to the client side.

It works properly on different size screens, Desktop, Tablet and Mobile. And we use [TailwindCSS](https://tailwindcss.com/) to style the application ( provided by Next.JS ).

### Testing approach

For testing, we use e2e Cypress, as the only current way to test async components properly. 

See more information on [Next.JS docs](https://nextjs.org/docs/app/building-your-application/testing#async-server-components).

#### NOTE

As a first approach we tried with [Jest](https://jestjs.io/) testing, but since all Server Components are async components, when rendering, they returns a Promise<JSX.Element>, and not the actual JSX.Element. Next, when calling jest.render(): `render(<Component />)`, we receive errors similar to the one below:

```bash
Uncaught Error: Objects are not valid as a React child (found: [object Promise]). If you meant to render a collection of children, use an array instead.
```

More information about the [issue](https://github.com/vercel/next.js/discussions/52336). 

In this article, `React Testing Library` maintainers provide a couple of workarounds that weren't entirely useful to solve our problem, we weren't able to extract the intended `JSX.Element` as outcome, when executing Jest tests.

### Room for Improvements

#### Backend

##### API Request ( current approach ) vs GraphQL Request

I'd suggest using GraphQL to improve how each `Sworn Member` (Character) is requested from the Backend on each `House` object. For this short Project using the API, we are retrieving each member as a separated HTTP request to the API. This have considerable performance impact on how fast we display information, since we need to wait for all character requests to be completed, before being able to display information.

##### Add accurate Request Pagination object

As you can see on this example `GET /houses` request:

```bash
curl --location --request GET 'https://anapioficeandfire.com/api/houses?page=1&pageSize=10'
```

We are not receiving a well detailed pagination object as response, which prevent us to handle pagination accordingly on the frontend.

With current backend pagination handling, we are allowed to split houses results and iterate through pages using HTTP request params (`page=PAGE_NUMBER`,`pageSize=PAGE_LIMIT`), but unluckly, we don't have in consideration how many results or how many pages are left, given an specific limit.

Additionally, even considering we found a way to discover we are on the latest page of results (e.g.: page 9, considering a limit of 10 results per time, and having total results of 100 houses). We are still able to request more pages, as we are allowed to do so, by current API design, even when no more results are available to show.

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

#### Frontend

##### Proper pagination component
Once we adopt a more precise pagination object, like the one suggested before, on the backend side. We should properly adjust the pagination component on the frontend to handle results. 
* `total results`: (given an specific limit of results)
* `remaining pages`: (given an specific limit of results we should be able to computate how many are left )

Allowing end users, to navigate through houses in a more precise and enjoyable way. And even when navigating directly to an specific route, like page 5 (`/houses/5`). We should be able to show correct pages left, and behind our current page.

#### Features suggestions

##### Search component
We can add a search component to allow end users searching for specific sworn members or houses, and not only displaying all houses results paginated as we are doing now.

##### Results filter component
We can add a filter component to allow end users filtering  characters by status (alive or dead), Houses by their location, and others. This may include changes on the backend side, to allow filtering by specific object  attributes faster.

##### Expand Sworn Member information
We can add a feature to allow end users to click on an specific Sworn Member, and see more information about it, like the house it belongs to, gender, aliases, and more.

#### Repository Improvements

##### Git Hooks
We can add a pre-commit hook to run lint and commit message format, before committing changes to the repository.

##### CI/CD
We can add a CI/CD pipeline to run tests, lint, and other intended npm commands on each PR, and only when those jobs are succesfull, deploy the application to a upper environments ( stage, uat, production ), as a precise way, to save time for devs.