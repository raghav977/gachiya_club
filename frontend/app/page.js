import Image from "next/image";
import Header from "./components/Header";
import Hero from "./components/Hero";
import OurWork from "./components/OurWorks";
import OurVision from "./components/OurVision";
import OurEvent from "./components/OurEvent";
import Contact from "./components/Contact";
import JoinUs from "./components/JoinUs";

export default function Home() {
  return (
    <div className="">
      <Header/>
      <Hero/>
      <OurWork/>
      <OurVision/>
      <OurEvent/>
      <Contact/>
      <JoinUs/>
    </div>
  );
}
