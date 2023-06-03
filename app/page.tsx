import Settings from "./settings";
import Visualizer from "./visualization";

export default function Home() {
  return (
    <main className="w-full h-full">
      <h1 className="font-bold text-2xl sticky">🚀 Rocket Simulator</h1>
      <div className="mt-3 flex flex-col gap-3 md:flex-row">
        <Settings></Settings>
        <Visualizer></Visualizer>
      </div>
    </main>
  );
}
