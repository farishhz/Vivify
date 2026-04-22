import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { MainWorkspace } from "@/components/dashboard/main-workspace";
import Footer from "@/components/homepage/Footer";
import Navbar from "@/components/homepage/Navbar";
import Banner from "@/section/Banner";
import FAQ from "@/section/FAQ";
import Feature from "@/section/Feature";
import Hero from "@/section/Hero";
import Stats from "@/section/Stats";
import Testimoni from "@/section/Testimoni";
import Pricing from "@/section/Pricing";

import ScrollToTop from "@/components/ui/ScrollToTop";

export default function Home() {
  return (
    <main className="">
      <Navbar />
      <Hero />
      <Stats />
      <Feature />
      <Testimoni />
      <Pricing />
      <FAQ />
      <Banner />
      <Footer />
      <ScrollToTop />
    </main>
  );
}
