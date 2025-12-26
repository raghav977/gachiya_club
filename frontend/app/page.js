import Header from "./components/Header";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import OurWork from "./components/OurWorks";
import OurEvent from "./components/OurEvent";
import JoinUs from "./components/JoinUs";
import SocialFollow from "./components/SocialFollow";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import AdModal from "./components/AdModal";
import FeaturedGallery from "./components/FeaturedGallery";

export default function Home() {
  return (
    <div className="">
      <AdModal />
      <Header/>
      <Hero/>
      <Stats/>
      <OurWork/>
      <FeaturedGallery/>
      {/* <OurEvent/> */}
      <JoinUs/>
      <SocialFollow/>
      <Contact/>
      <Footer/>
    </div>
  );
}
