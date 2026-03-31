import "../styles/BannerLogo.css";
import logo from "../assets/bannernegro.jpg";

const BannerLogo = () => {
  return (
    <section className="banner-logo-shell" aria-label="Eventour">
      <img src={logo} alt="Eventour" className="banner-image" />
      <p className="banner-mantra" aria-hidden="true">
        <span>Buscá</span>
        <span className="banner-mantra-dot" />
        <span>Encontrá</span>
        <span className="banner-mantra-dot" />
        <span>Disfrutá</span>
      </p>
    </section>
  );
};

export default BannerLogo;
