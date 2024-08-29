import Houses from "./houses/[pagination]/page";

export default async function Home({ params: { pagination = "1" } }: { params: { pagination: string } }) {
  return (
    <Houses params={{ pagination }} />
  )
}
