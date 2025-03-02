import { Quantico } from "next/font/google";

const quantico = Quantico({
  subsets: ["latin"],
  weight: "400",
});

const Sidebar = () => {
  return (
    <div className="ml-8 mt-8">
      <PhotoEssaySection />
    </div>
  );
};

const PhotoEssaySection = () => {
  return (
    <div>
      <div className={`${quantico.className} text-lg`}>Photo Essays</div>{" "}
      <div className="ml-6">
        <div className="underline">Blah 1 and something else</div>
        <div className="underline">Blah 2</div>
        <div className="underline">Blah 3 and lots else</div>
      </div>
    </div>
  );
};

export default Sidebar;
