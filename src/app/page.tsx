import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  return (
    <div>
      {/* <div className="w-screen h-screen overflow-hidden absolute">
        <img
          src="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExdXlqczRpZnhpcDlzdmVta2d0MzA3NmZld3p5ejJtdHZsbHJ6OW5sNiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/J7L4aD39ohYnIIzkYF/giphy.gif"
          className="w-screen h-screen object-cover"
        />
      </div> */}
      <Header />
      {/* <div className="flex justify-center items-center relative min-h-screen px-16 min-w-screen">
        <div className="w-[400px] h-[200px] bg-blue-600"></div>
        <SideBar />
      </div> */}
      <div>
        <Sidebar />
      </div>
    </div>
  );
}
