import { LightRouteView } from "./light-route-view";

export default function Home() {
  return (
    <main className="home-page">
      <LightRouteView />
      <section className="animated-logo" aria-label="Hateslop Final">
        <svg className="line-logo" viewBox="0 0 920 180" role="img">
          <title>Hateslop Final</title>
          <path className="logo-stroke stroke-a" d="M34 34v112M34 90h76M110 34v112" />
          <path className="logo-stroke stroke-b" d="M152 146l36-112 36 112M166 108h44" />
          <path className="logo-stroke stroke-c" d="M246 34h86M289 34v112" />
          <path className="logo-stroke stroke-d" d="M356 34h78M356 90h58M356 146h82" />
          <path className="logo-stroke stroke-e" d="M468 54c18-22 76-22 76 16 0 42-78 24-78 60 0 28 58 30 82 4" />
          <path className="logo-stroke stroke-f" d="M586 34v112h76" />
          <path className="logo-stroke stroke-g" d="M704 34c44 0 76 28 76 56s-32 56-76 56-76-28-76-56 32-56 76-56z" />
          <path className="logo-stroke stroke-h" d="M816 146V34H866C896 34 896 90 866 90H816" />
        </svg>
        <p>Prompt the Future, Be the Pioneer</p>
      </section>
    </main>
  );
}
