"use client";

import { motion } from "framer-motion";
import Header from "../components/Header";
import MemberCard, { MemberCardSkeleton } from "../components/MemberCard";
import president from "@/public/presidentnew.jpg"
import secretary from "@/public/secretarynew.jpeg"
import comite1 from "@/public/comitemember1.jpeg"
import vicePresident from "@/public/vicepresidentnew.jpeg"
import vicesecretary from "@/public/shradha.jpeg"
import ordinary from "@/public/ordinarymember.jpeg"
import comite from "@/public/comite2.jpeg"
import treasurer from "@/public/treasurernew.jpg"
import mediaHandler from "@/public/media2.jpeg"
import yogesh from "@/public/nextexectve.jpeg"
import Footer from "../components/Footer";



const ALL_MEMBERS = [
  {
    id: 1,
    name: "Eak Raj Pokhrel",
    role: "President",
    organization: "Srijansil Club",
    testimonial:
      "A leader with a right bunch of team really makes impact in the overall functioning of the organization which is what makes Srijansil Club today. Proud to lead such a team of youths with amples of innovative ideas.",
    avatar: president,
  },
  {
    id: 2,
    name: "Jiwan Ghimire",
    role: "Vice President",
    organization: "Srijansil Club",
    testimonial:
      "The Srijansil Club brings together passionate individuals from diverse backgrounds. Our events and initiatives have helped countless students discover their potential and build lasting connections that extend far beyond our club activities.",
    avatar: vicePresident,
  },
  {
    id: 3,
    name: "Prashant Bikram Thapa",
    role: "Secretary",
    organization: "Srijansil Club",
    testimonial:
      "Together, we share ideas, spark creativity, and turn our visions into reality. With the Srijansil Club Family, our hometown becomes more than just a place , it transforms into a beacon of inspiration for all..",
    avatar: secretary,
  },
  {
    id: 4,
    name: "Rojita Karki",
    role: "Committee Member",
    organization: "Srijansil Club",
    testimonial:
      "Joining Srijansil Club was one of the best decisions I've made. The opportunities for leadership development and community service have been transformative for my personal growth and professional development.",
    avatar: comite1,
  },
  {
    id: 5,
    name: "Rupesh Basnet",
    role: "Committee Member",
    organization: "Srijansil Club",
    testimonial:
      "Joining Srijansil Club was one of the best decisions I've made. The opportunities for leadership development and community service have been transformative for my personal growth and professional development.",
    avatar: comite,
  },
  {
    id: 6,
    name: "Saurav Ghimire",
    role: "Treasurer",
    organization: "Srijansil Club",
    testimonial:
      "Joining Srijansil Club was one of the best decisions I've made. The opportunities for leadership development and community service have been transformative for my personal growth and professional development.",
    avatar: treasurer,
  },
  {
    id: 7,
    name: "Shradha Bastola",
    role: "Vice Secretary",
    organization: "Srijansil Club",
    testimonial:
      "Organizing events with Srijansil has taught me invaluable skills in project management and teamwork. The support from fellow members makes even the most challenging projects achievable and enjoyable.",
    avatar: vicesecretary,
  },
  {
    id: 8,
    name: "Ayush Pokhrel",
    role: "Media Handler",
    organization: "Srijansil Club",
    testimonial:
      "Being the media Head has allowed me to connect our club with the wider community. The positive impact we create through our outreach programs is incredibly rewarding and motivates me to do more.",
    avatar: mediaHandler,
  },
  {
    id: 9,
    name: "Anish Pokhrel",
    role: "Life Member",
    organization: "Srijansil Club",
    testimonial:
      "Srijansil Club's commitment to technological innovation has given me a platform to apply and expand my skills. Working with like-minded individuals on tech projects has been an amazing learning experience.",
    avatar: ordinary,
  },
   {
    id: 10,
    name: "Yogesh Dahal",
    role: "Comittee Member",
    organization: "Srijansil Club",
    testimonial:
      "Srijansil Club's commitment to technological innovation has given me a platform to apply and expand my skills. Working with like-minded individuals on tech projects has been an amazing learning experience.",
    avatar: yogesh,
  },
     {
    id: 11,
    name: "Binda Sigdel",
    role: "Member",
    organization: "Srijansil Club",
    testimonial:
      "Srijansil Club's commitment to technological innovation has given me a platform to apply and expand my skills. Working with like-minded individuals on tech projects has been an amazing learning experience.",
    avatar: null,
  },
  {
    id: 12,
    name: "Rabin Rai",
    role: "Member",
    organization: "Srijansil Club",
    testimonial:
      "Srijansil Club's commitment to technological innovation has given me a platform to apply and expand my skills. Working with like-minded individuals on tech projects has been an amazing learning experience.",
    avatar: null,
  },
  {
    id:13,
    name:"Ramesh Khanal",
    role:"Member",
    organization:"Srijansil Club",
    testimonial:
      "Srijansil Club's commitment to technological innovation has given me a platform to apply and expand my skills. Working with like-minded individuals on tech projects has been an amazing learning experience.",
    avatar: null,
  }
];
console.log(ALL_MEMBERS)

// Group members by role priority
const EXECUTIVE_ROLES = ["President", "Vice President", "Secretary", "Vice Secretary"];

export default function MembersPage() {
  // Separate executives and other members
  const executives = ALL_MEMBERS.filter(m => EXECUTIVE_ROLES.includes(m.role));
  const otherMembers = ALL_MEMBERS.filter(m => !EXECUTIVE_ROLES.includes(m.role));

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-24 px-6 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        </div>
        
        <motion.div
          className="relative max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 bg-amber-400/20 text-amber-300 rounded-full text-sm font-semibold mb-6 border border-amber-400/30">
            Our Community
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Meet Our <span className="text-amber-400">Amazing</span> Members
          </h1>
          <p className="text-lg md:text-xl text-blue-200 max-w-2xl mx-auto">
            The passionate individuals who drive Srijansil Club forward. 
            Their dedication and creativity make our community extraordinary.
          </p>
        </motion.div>
      </section>

      {/* Executive Members Section */}
      <section className="py-20 px-6 md:px-20 bg-gradient-to-b from-gray-50 to-white">
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
              Leadership
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Executive <span className="text-blue-600">Committee</span>
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              The leaders who guide our club's vision and initiatives
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {executives.map((member, index) => (
              <MemberCard
                key={member.id}
                member={member}
                index={index}
                compact={false}
              />
            ))}
          </div>
        </motion.div>
      </section>

      {/* All Members Section */}
      <section className="py-20 px-6 md:px-20 bg-white">
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold mb-4">
              Team Members
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our <span className="text-amber-500">Team</span>
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Every member brings unique skills and perspectives to our community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {otherMembers.map((member, index) => (
              <MemberCard
                key={member.id}
                member={member}
                index={index}
                compact={false}
              />
            ))}
          </div>
        </motion.div>
      </section>

      {/* Join CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        </div>
        
        <motion.div
          className="relative max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-1.5 bg-amber-400/20 text-amber-300 rounded-full text-sm font-semibold mb-6 border border-amber-400/30">
            Join Us
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Want to Join Our <span className="text-amber-400">Team</span>?
          </h2>
          <p className="text-lg text-blue-200 mb-8 max-w-xl mx-auto">
            We're always looking for passionate individuals who want to make a difference. 
            Become a part of our growing community today!
          </p>
          <a
            href="/#contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-gray-900 rounded-full font-semibold hover:from-amber-300 hover:to-amber-400 transition-all duration-300 hover:scale-105 shadow-lg shadow-amber-500/25"
          >
            Get In Touch
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </motion.div>
      </section>
      <Footer/>
    </div>
  );
}