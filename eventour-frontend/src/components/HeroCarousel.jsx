import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE, getJson } from "../lib/api";
import { isSupportedCategory } from "../lib/categories";
import { formatDisplayDate, toISODate } from "../lib/eventDisplay";
import "../styles/HeroCarousel.css";

import img1 from "../assets/88.png";
import img2 from "../assets/33.jpg";
import img3 from "../assets/55.jpg";
import img4 from "../assets/105.jpg";

const AUTO_SLIDE_INTERVAL = 7000;
const EVENTS_ROUTE = "/events";
const MAX_SLIDES = 5;

const fallbackSlides = [
  {
    id: "fallback-1",
    image: img1,
    title: "Experiencias para descubrir",
    dateLabel: "Todos los dias",
    placeLabel: "Mendoza y Chile",
  },
  {
    id: "fallback-2",
    image: img2,
    title: "Eventos seleccionados para vos",
    dateLabel: "Agenda actualizada",
    placeLabel: "Lugares destacados",
  },
  {
    id: "fallback-3",
    image: img3,
    title: "Planes con identidad local",
    dateLabel: "Cultura, musica y mas",
    placeLabel: "Distintas zonas",
  },
  {
    id: "fallback-4",
    image: img4,
    title: "Tu proxima salida empieza aca",
    dateLabel: "Explora la cartelera",
    placeLabel: "Eventour",
  },
];

const normalizeEvent = (raw) => {
  const ubicacion = raw?.ubicacion ?? {};
  const fechaInicio = toISODate(raw?.fechaInicio ?? raw?.fecha_inicio ?? null);
  const fechaFin = toISODate(raw?.fechaFin ?? raw?.fecha_fin ?? raw?.fechaInicio ?? raw?.fecha_inicio ?? null);
  const image =
    raw?.imagen ??
    raw?.imagenUrl ??
    raw?.urlImagen ??
    raw?.imagenPrincipal ??
    raw?.imageUrl ??
    "";

  return {
    id: raw?.id,
    titulo: raw?.titulo ?? raw?.title ?? "Evento",
    descripcion: raw?.descripcion ?? raw?.description ?? "",
    fechaInicio,
    fechaFin,
    destacado: !!(typeof raw?.destacado === "number" ? raw.destacado > 0 : raw?.destacado),
    categoria: String(raw?.categoria ?? raw?.categoriaEvento ?? raw?.category ?? "").toUpperCase(),
    imagen: image,
    ubicacionId: Number(raw?.ubicacionId ?? raw?.ubicacion_id ?? ubicacion?.id) || null,
    ubicacionNombre: ubicacion?.nombre ?? raw?.ubicacionTexto ?? "",
    ubicacionDireccion: ubicacion?.direccion ?? "",
  };
};

const normalizeLocation = (raw) => ({
  id: Number(raw?.id) || null,
  nombre: raw?.nombre ?? "",
  direccion: raw?.direccion ?? "",
  oasis: raw?.oasis ?? "",
});

const backendBaseFromApi = (apiBase) => apiBase.replace(/\/api\/?$/i, "");

const normalizeImageUrl = (raw, backendBase) => {
  if (!raw || typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("//")) return `https:${trimmed}`;
  if (/^https?:\/\//i.test(trimmed)) return toProxyUrl(trimmed);
  if (trimmed.startsWith("data:")) return trimmed;
  return `${backendBase}${trimmed.startsWith("/") ? trimmed : `/${trimmed}`}`;
};

const toProxyUrl = (absoluteUrl) => {
  try {
    const noProto = absoluteUrl.replace(/^https?:\/\//i, "");
    return `https://images.weserv.nl/?url=${encodeURIComponent(noProto)}&w=1600&h=900&fit=cover`;
  } catch {
    return absoluteUrl;
  }
};

const shuffle = (items) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const sortByLatestLoaded = (a, b) => Number(b.id || 0) - Number(a.id || 0);

const buildLocationSummary = (event) => {
  const parts = [event.ubicacionNombre, event.ubicacionDireccion].filter(Boolean);
  if (parts.length) return parts.join(" · ");
  return event.descripcion?.trim() || "Ubicacion por confirmar";
};

const buildSlides = (events) => {
  if (!events.length) return fallbackSlides;

  const destacados = events.filter((event) => event.destacado).sort(sortByLatestLoaded);
  const selected = [];

  destacados.slice(0, MAX_SLIDES).forEach((event) => selected.push(event));

  if (selected.length < MAX_SLIDES) {
    const remaining = shuffle(
      events.filter((event) => !selected.some((chosen) => chosen.id === event.id))
    );
    remaining.slice(0, MAX_SLIDES - selected.length).forEach((event) => selected.push(event));
  }

  return selected.slice(0, MAX_SLIDES).map((event) => {
    const placeLabel =
      event.ubicacionNombre ||
      event.ubicacionDireccion ||
      "Ubicacion por confirmar";

    return {
      id: event.id,
      image: event.imagen,
      title: event.titulo,
      dateLabel: event.fechaInicio ? formatDisplayDate(event.fechaInicio) : "Proximamente",
      placeLabel,
      subtitle: buildLocationSummary(event),
    };
  });
};

const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slides, setSlides] = useState(fallbackSlides);
  const tRef = useRef(null);
  const navigate = useNavigate();
  const backendBase = backendBaseFromApi(API_BASE);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const [destacadosRaw, eventosRaw, ubicacionesRaw] = await Promise.all([
          getJson(`${API_BASE}/eventos/destacados`, { auth: false }).catch(() => []),
          getJson(`${API_BASE}/eventos`, { auth: false }).catch(() => []),
          getJson(`${API_BASE}/ubicaciones`, { auth: false }).catch(() => []),
        ]);

        const ubicaciones = Array.isArray(ubicacionesRaw) ? ubicacionesRaw.map(normalizeLocation) : [];
        const ubicacionesById = new Map(
          ubicaciones.filter((ubicacion) => ubicacion.id != null).map((ubicacion) => [ubicacion.id, ubicacion])
        );

        const hydrateEventLocation = (event) => {
          const resolved = event.ubicacionId != null ? ubicacionesById.get(event.ubicacionId) : null;
          return {
            ...event,
            ubicacionNombre: event.ubicacionNombre || resolved?.nombre || "",
            ubicacionDireccion: event.ubicacionDireccion || resolved?.direccion || "",
          };
        };

        const destacados = Array.isArray(destacadosRaw)
          ? destacadosRaw.map(normalizeEvent).filter((event) => isSupportedCategory(event.categoria)).map(hydrateEventLocation)
          : [];
        const eventos = Array.isArray(eventosRaw)
          ? eventosRaw.map(normalizeEvent).filter((event) => isSupportedCategory(event.categoria)).map(hydrateEventLocation)
          : [];
        const mixed = buildSlides([...destacados, ...eventos.filter((event) => !destacados.some((featured) => featured.id === event.id))]);

        if (alive && mixed.length) {
          setSlides(mixed);
          setCurrentIndex(0);
        }
      } catch (error) {
        console.error("GET hero eventos error:", error);
      }
    })();

    return () => {
      alive = false;
    };
  }, [backendBase]);

  const prev = () => setCurrentIndex((p) => (p === 0 ? slides.length - 1 : p - 1));
  const clear = () => tRef.current && clearTimeout(tRef.current);

  useEffect(() => {
    clear();
    tRef.current = setTimeout(() => {
      setCurrentIndex((p) => (p + 1) % slides.length);
    }, AUTO_SLIDE_INTERVAL);
    return clear;
  }, [currentIndex, slides.length]);

  const currentSlide = slides[currentIndex] ?? fallbackSlides[0];

  const backgroundImage = useMemo(() => {
    const normalized = normalizeImageUrl(currentSlide?.image, backendBase);
    return normalized || fallbackSlides[0].image;
  }, [backendBase, currentSlide]);

  const handleVerEventos = () => {
    try {
      navigate(EVENTS_ROUTE);
    } catch {
      window.location.href = EVENTS_ROUTE;
    }
  };

  return (
    <section
      className="hero-carousel"
      aria-roledescription="carousel"
      aria-label="Eventos destacados"
      style={{ "--hero-bg": `url(${backgroundImage})` }}
    >
      <div className="hero-gradient-top" aria-hidden="true" />
      <div className="hero-gradient-bottom" aria-hidden="true" />

      <div className="hero-media-layer" aria-hidden="true">
        {slides.map((slide, index) => {
          const normalized = normalizeImageUrl(slide.image, backendBase);
          const image = normalized || fallbackSlides[index % fallbackSlides.length].image;
          return (
            <div
              key={slide.id}
              className={`hero-slide ${index === currentIndex ? "active" : ""}`}
              style={{ backgroundImage: `url(${image})` }}
            />
          );
        })}
      </div>

      <div className="hero-content">
        <div className="hero-topline">
          <span className="hero-floating-chip">{currentSlide.dateLabel}</span>
        </div>

        <div className="hero-centerpiece">
          <div className="hero-copy">
            <h1 className="hero-title">{currentSlide.title}</h1>
            <span className="hero-copy-divider" aria-hidden="true" />
            <p className="hero-subtitle">
              {currentSlide.subtitle || "Descubri eventos reales cargados en la plataforma y encontra tu proxima salida."}
            </p>
          </div>

          <button
            type="button"
            className="btn-carousel"
            onClick={handleVerEventos}
          >
            Ver todos los eventos
          </button>
        </div>

        <div className="hero-dots" aria-label="Seleccion de slide">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              className={`hero-dot ${index === currentIndex ? "active" : ""}`}
              aria-label={`Ir al slide ${index + 1}`}
              aria-pressed={index === currentIndex}
              onClick={() => {
                setCurrentIndex(index);
                clear();
              }}
            />
          ))}
        </div>
      </div>

      <button
        className="carousel-nav left"
        onClick={() => {
          prev();
          clear();
        }}
        aria-label="Anterior"
      >
        ❮
      </button>

      <button
        className="carousel-nav right"
        onClick={() => {
          setCurrentIndex((p) => (p + 1) % slides.length);
          clear();
        }}
        aria-label="Siguiente"
      >
        ❯
      </button>

      {/^https?:\/\//i.test(backgroundImage) && (
        <img
          src={backgroundImage}
          alt=""
          className="hero-preload"
          aria-hidden="true"
          onError={(event) => {
            const element = event.currentTarget;
            if (!element.dataset.proxied) {
              element.dataset.proxied = "1";
              const proxied = toProxyUrl(backgroundImage);
              element.src = proxied;
              return;
            }
            element.remove();
          }}
        />
      )}
    </section>
  );
};

export default HeroCarousel;
