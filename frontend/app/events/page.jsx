import EventList from "../components/EventList";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Top from "../components/Top";

export default function Events(){
    return(
       <div className="min-h-screen bg-white">
      <Header />

      {/* COMMON HERO */}
      <Top
        title="Our Events"
        subtitle="Programs, campaigns, and activities shaping our community"
      />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <EventList />
      </section>
      <Footer/>
    </div>
    )
}