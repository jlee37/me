import { Quantico } from "next/font/google";

const quantico = Quantico({
  subsets: ["latin"],
  weight: "400",
});

const Header = () => {
  return (
    <div className="flex mt-4 ml-4 items-center">
      <img
        src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExc2kxY2N4eW55aG43aW11czd1bjdncDJ4dWhxYXBtcXl0cHFkanJ4ZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/1v2lXOfPBqKygjlkCM/giphy.gif"
        className="w-32 h-32 object-contain"
      />
      <div className="mb-4">
        <div className={`${quantico.className} text-3xl`}>jojo.wow</div>
        {/* <div className={`${quantico.className} text-xs`}>
          I would be strange and ragged <br />
          and like the Prophet who has walked <br />
          across the land to bring the dark Word
          <br /> And the only word I had was 'Wow'!
          <br />
        </div> */}
      </div>
    </div>
  );
};

export default Header;
