import { Quantico } from "next/font/google";

const quantico = Quantico({
  subsets: ["latin"],
  weight: "400",
});

const Sidebar = () => {
  return (
    <div className="ml-8 mt-12">
      <SidebarSection />
    </div>
  );
};

const SidebarSection = () => {
  return (
    <div>
      <SectionTitle />
      <div className="ml-6">
        <div className="underline">Blah 1 and something else</div>
        <div className="underline">Blah 2</div>
        <div className="underline">Blah 3 and lots else</div>
      </div>
    </div>
  );
};

const SectionTitle = () => {
  return <div className={`${quantico.className} text-lg`}>Photo Essays</div>;
};

export default Sidebar;
