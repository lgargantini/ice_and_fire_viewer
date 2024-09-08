import Houses from "./houses/[page]/page";

export default function Home({ params: { page = "1" } }: { params: { page?: string } }) {
  return (
    <Houses params={{ page }} />
  )
}
