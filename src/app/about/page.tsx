import ContentPageWrapper from "@/components/ContentPageWrapper";
import Link from "next/link";

export default function AboutPage() {
  return (
    <ContentPageWrapper>
      <h1 className="text-xl md:text-2xl mb-2">All these little souls</h1>
      <p>
        {`This site is an homage to Neocities, a web
        hosting service that hosts more than a million personal websites. Here are a few examples, best viewed on desktop:`}
      </p>
      <div className="my-4">
        <Link
          href={"https://ne0nbandit.neocities.org/home"}
          className="underline text-cyan-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ne0nbandit Street
        </Link>
        <br />
        <Link
          href={"https://fairygore.neocities.org/"}
          className="underline text-green-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          Fairygore
        </Link>
        <br />
        <Link
          href={"https://getcubed.neocities.org/"}
          className="underline text-yellow-100"
          target="_blank"
          rel="noopener noreferrer"
        >
          getcubed
        </Link>
      </div>
      <p>
        {`Each one's a hyper-stylized little spot in the internet, a little oasis of self-expression. They're small pockets of community; many of them even feature message boards.
  
        Regardless of what the Neocity looks like, though, whether there's flashing gifs everywhere and not a name in sight, or a full bio and a list of all the books and songs the person's ever wanted to love, the same sentiment runs behind every
        single site– behind every single one, there's someone, someone out there in the hugeness of this world, saying: "Here I am!
        Here this is!"`}
      </p>
      <br />
      <p>
        {`What used to strike me as sad, though, is how a lot of these people talk about how Neocities are special because they're permanent, permanent in a way that a journal
        isn't, that the human body isn't. It's sad because it's
        not really true. There's no guarantee that the people running the Neocities service will still want to do it a year from now, five years from now. Sooner or later they'll get tired of it, or they'll die. So really there's no way, no how: Neocities
        will end. A million sites, a million custom cursors, a million heartfelt
        self-introductions will one day liquify into error 404 slush. So one wonders: is this all for
        nothing! Is this how every Neocity will be remembered, as amusement parks ditched and left behind? 
        `}
      </p>
      <br />
      <p>
        {`Well, obviously not. It's a true and corny fact of life, after all, that everything ends. The me who spewed out this big blob of
        text isn't the me who, an hour ago, hadn't even started
        typing. Even the me who stubbed my toe earlier today is a different person
        even than the one who said "ow, fuck," half a second later. And on and on, things are gained, things are lost, so that going through life, I think, is really just a constant kind of dying, and living again.`}
      </p>
      <br />
      <p>
        {
          "There's a Jane Hirshfield poem I read as a kid, on that note, that's always been really important to me:"
        }
      </p>
      <br />
      <p className="italic">{"Little soul,"}</p>
      <p className="italic">{"you and I will become"}</p>
      <br />
      <p className="italic">{"the memory"}</p>
      <p className="italic">{"of a memory of a memory."}</p>
      <br />
      <p className="italic">{"A horse"}</p>
      <p className="italic">{"released of the traces"}</p>
      <p className="italic">{"forgets the weight of the wagon."}</p>
      <br />
      <p>
        {`This site isn't meant to go on forever. Like all those Neocities, like all those traces released, there will come a time when jonnylee.net will vanish. Maybe I'll have decided to take it down myself, or maybe I'll have been killed in a Western shootout of some kind. So, then, the point of this website to capture, over the course of however long it lasts, a bunch of different versions of "me"– to capture all these little souls. And so whether you're a future version of me looking back at this, or a good friend of mine, whether the last time we talked was yesterday or the week before or years before that:`}
      </p>
      <br />
      <p>Here I am! Here this is!</p>
    </ContentPageWrapper>
  );
}
