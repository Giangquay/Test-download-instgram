import { InstagramVideoForm } from "@/features/instagram/components/form";

export default function HomePage() {
  return (
    <div className="flex flex-col py-8">
      <h1 className="mb-8 text-balance text-center text-4xl font-extrabold">
        Instagram Video Downloader
      </h1>
      <img
        src="https://instagram.fhan15-2.fna.fbcdn.net/v/t51.29350-15/449538451_934996591761351_7403648831366804397_n.jpg?stp=dst-jpg_e35_p720x720&efg=eyJ2ZW5jb2RlX3RhZyI6ImltYWdlX3VybGdlbi4xNDQweDE4MDAuc2RyLmYyOTM1MCJ9&_nc_ht=instagram.fhan15-2.fna.fbcdn.net&_nc_cat=103&_nc_ohc=OjPZ0oleZSYQ7kNvgHAUryb&edm=ALQROFkBAAAA&ccb=7-5&ig_cache_key=MzQwMzA2NDQyOTg4ODc0NjQ5MQ%3D%3D.2-ccb7-5&oh=00_AYBH7CTyR8Bqmn6vWpML78PQsLpi9e-AZilTOBvtTGdGvA&oe=6689989B&_nc_sid=fc8dfb"
        alt=""
        width={300}
        height={300}
      />
      <section className="flex flex-col items-center justify-center gap-4">
        <InstagramVideoForm />
      </section>
    </div>
  );
}
