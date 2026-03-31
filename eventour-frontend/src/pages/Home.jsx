import { useEffect, useState } from "react";
import "../styles/home.css";
import HeroCarousel from "../components/HeroCarousel";
import BannerLogo from "../components/BannerLogo";
import Footer from "../components/Footer";
import SobreNosotros from "../components/SobreNosotros";
import BusquedaRapida from "../components/BusquedaRapida";
import BannerBlock from "../ads/BannerBlock";
import { API_BASE, getJson } from "../lib/api";
import { buildBannerMap } from "../lib/banners";

const Home = () => {
  const [bannerMap, setBannerMap] = useState(() => buildBannerMap());

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const data = await getJson(`${API_BASE}/banners/public`, { auth: false });
        if (!cancelled) {
          setBannerMap(buildBannerMap(Array.isArray(data) ? data : []));
        }
      } catch (error) {
        console.error("GET /banners/public error:", error);
        if (!cancelled) {
          setBannerMap(buildBannerMap());
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="home-page">
      <HeroCarousel />

      <section className="banner-section" aria-label="Presentacion Eventour">
        <div className="banner-transition" aria-hidden="true">
          <span className="banner-transition-line" />
        </div>
        <div className="banner-container">
          <BannerLogo />
        </div>
      </section>

      <section className="home-strip">
        <BannerBlock slots={["HOME_TOP_1", "HOME_TOP_2"]} bannerMap={bannerMap} />
      </section>

      <BusquedaRapida />

      <section className="home-strip">
        <BannerBlock slots={["HOME_MID_1", "HOME_MID_2"]} bannerMap={bannerMap} />
      </section>

      <SobreNosotros />
      <Footer />
    </main>
  );
};

export default Home;
