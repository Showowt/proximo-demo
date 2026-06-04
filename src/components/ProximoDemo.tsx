"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Sparkles,
  MapPin,
  Send,
  Clock,
  Heart,
  Users,
  Briefcase,
  Search,
  Compass,
  MessageCircle,
  User,
  ChevronLeft,
  Zap,
  Building2,
  X,
  type LucideIcon,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────
// PRÓXIMO · Drop 001 — Interactive Event-Room Demo
// "Hacemos visible a quién deberías conocer."
// ─────────────────────────────────────────────────────────────

// ── Types ────────────────────────────────────────────────────

interface Person {
  id: string;
  name: string;
  role: string;
  flag: string;
  city: string;
  color: string;
  here: string;
  dist: number;
  rel: "both" | "seeks" | "offers";
  ready: boolean;
  building: string;
  seeking: string;
  offering: string;
  industry: string;
  score: number;
  why: string;
  twoway: string;
  ice: string;
}

interface UserProfile {
  name: string;
  role: string;
  flag: string;
  city: string;
  building: string;
  seeking: string;
  offering: string;
  industry: string;
  color: string;
}

type ViewId = "sala" | "matches" | "mensajes" | "chat" | "perfil";
type FilterId = "all" | "seeks" | "offers" | "near";

interface ChatMessage {
  from: "me" | "them";
  text: string;
}

type Threads = Record<string, ChatMessage[]>;

// ── Color System ─────────────────────────────────────────────

const C = {
  bg: "#0B0B12",
  bg2: "#12121C",
  surface: "rgba(255,255,255,0.045)",
  surfaceHi: "rgba(255,255,255,0.07)",
  line: "rgba(255,255,255,0.09)",
  text: "#F4F2F7",
  muted: "#9A98AA",
  faint: "#646274",
  ember: "#FF6A45",
  ember2: "#FF9A5C",
  teal: "#46D6C0",
  gold: "#F5C26B",
  grad: "linear-gradient(135deg, #FF6A45 0%, #FF9A5C 100%)",
  gradTeal: "linear-gradient(135deg, #46D6C0 0%, #3BA6C9 100%)",
} as const;

// ── The Room ─────────────────────────────────────────────────

const ME: UserProfile = {
  name: "Michelle Molina",
  role: "PR & Conexiones Estratégicas",
  flag: "🇸🇻",
  city: "San Salvador",
  building:
    "Una agencia de PR que conecta marcas, talento y eventos en Centroamérica.",
  seeking:
    "Socios, inversionistas, gente de tecnología, marcas y aliados estratégicos.",
  offering:
    "Acceso a talento, marcas, eventos y medios en toda Centroamérica.",
  industry: "Entretenimiento · Eventos · PR",
  color: "#FF6A45",
};

const PEOPLE: Person[] = [
  {
    id: "daniel",
    name: "Daniel Reyes",
    role: "Founder · Kuna Pay (fintech)",
    flag: "🇬🇹",
    city: "Guatemala",
    color: "#6C8CFF",
    here: "Mesa 4 · camisa azul · a tu derecha",
    dist: 8,
    rel: "both",
    ready: true,
    building: "Una pasarela de pagos para toda Centroamérica.",
    seeking: "Inversión seed y un partner regional de banca.",
    offering: "Tecnología de pagos y un equipo de desarrollo sólido.",
    industry: "Fintech",
    score: 96,
    why: "Daniel busca un partner de banca regional y gente que mueva capital en LATAM — justo lo que vos conectás. Y vos buscás gente de tecnología: él tiene el equipo. Conexión de doble vía.",
    twoway: "Él ofrece tech que buscás · vos abrís lo que él necesita",
    ice: "Daniel, vi que estás construyendo Kuna Pay 🔥 — justo muevo conexiones con banca regional en CA y gente que levanta capital. ¿Tenés 5 min antes del panel?",
  },
  {
    id: "andrea",
    name: "Andrea Cálix",
    role: "Inversionista Ángel / VC",
    flag: "🇭🇳",
    city: "Honduras",
    color: "#F5C26B",
    here: "Cerca del escenario",
    dist: 14,
    rel: "offers",
    ready: true,
    building: "Un fondo early-stage enfocado en consumo y fintech.",
    seeking: "Founders early-stage con tracción en la región.",
    offering: "Capital y una red de inversionistas en LATAM.",
    industry: "Inversión / Capital",
    score: 93,
    why: "Vos buscás inversionistas. Andrea invierte en founders de fintech y consumo — tu mundo exacto — y te puede abrir su red de inversionistas en LATAM.",
    twoway: "Ella ofrece capital y red que buscás",
    ice: "Andrea, me encantaría conocer tu tesis de inversión. Conecto founders y marcas en toda CA — quizá tengo deal flow para vos. ¿Un café aquí en el evento?",
  },
  {
    id: "valeria",
    name: "Valeria Cruz",
    role: "Founder · marca de moda DTC",
    flag: "🇸🇻",
    city: "El Salvador",
    color: "#FF8FB1",
    here: "Junto al café",
    dist: 11,
    rel: "seeks",
    ready: true,
    building:
      "Una marca de moda directa al consumidor con comunidad propia.",
    seeking: "PR, prensa y embajadores para crecer la marca.",
    offering: "Producto, comunidad fiel y contenido.",
    industry: "Marca / Retail",
    score: 91,
    why: "Valeria necesita PR, prensa y embajadores para su marca — literalmente lo que vos ofrecés. Conexión rápida, clara y lista para cerrar.",
    twoway: "Ella necesita exactamente lo que ofrecés",
    ice: "Valeria, tu marca tiene cara para prensa y embajadores 👀 — eso es justo lo que hago. ¿Te muestro un par de ideas rápidas aquí?",
  },
  {
    id: "jose",
    name: "José Mendoza",
    role: "CTO freelance / Full-stack + IA",
    flag: "🇳🇮",
    city: "Nicaragua",
    color: "#46D6C0",
    here: "Zona de demos",
    dist: 22,
    rel: "offers",
    ready: true,
    building: "Producto propio + proyectos para founders no-técnicos.",
    seeking: "Proyectos serios y cofundadores no-técnicos.",
    offering: "Desarrollo full-stack e integración de IA.",
    industry: "Tecnología / Dev",
    score: 88,
    why: "Buscás gente de tech sólida para tus clientes y proyectos. José construye full-stack con IA y quiere founders no-técnicos. Encaje natural.",
    twoway: "Él ofrece el tech que buscás para tus clientes",
    ice: "José, busco gente de tech sólida para proyectos de mis clientes y tu perfil encaja. ¿Hablamos aquí o agendamos?",
  },
  {
    id: "rafael",
    name: "Dr. Rafael Mejía",
    role: "Director médico · red de clínicas",
    flag: "🇸🇻",
    city: "San Salvador",
    color: "#7BD389",
    here: "Lobby principal",
    dist: 30,
    rel: "seeks",
    ready: false,
    building: "Expansión de telemedicina sobre una red de clínicas.",
    seeking: "Socios de tecnología e inversión para escalar.",
    offering: "Red de clínicas, pacientes y operación médica.",
    industry: "Salud",
    score: 79,
    why: "Rafael busca socios de tech e inversión — vos conectás justo a esa gente. Posible puente de alto valor si calienta la conversación.",
    twoway: "Él busca conexiones que vos manejás",
    ice: "",
  },
  {
    id: "marco",
    name: "Marco Villalta",
    role: "Real estate developer",
    flag: "🇸🇻",
    city: "El Salvador",
    color: "#C8A26B",
    here: "Terraza",
    dist: 41,
    rel: "seeks",
    ready: false,
    building: "Proyectos inmobiliarios en zonas de alto crecimiento.",
    seeking: "Inversionistas y capital para nuevos proyectos.",
    offering: "Proyectos, terrenos y retorno inmobiliario.",
    industry: "Construcción / Real estate",
    score: 74,
    why: "Marco necesita inversionistas — vos los conectás. No es tu vertical, pero sos el puente que él anda buscando.",
    twoway: "Él busca capital que vos sabés conectar",
    ice: "",
  },
  {
    id: "karla",
    name: "Karla Fuentes",
    role: "Abogada corporativa / M&A",
    flag: "🇬🇹",
    city: "Guatemala",
    color: "#B68CFF",
    here: "Sala VIP",
    dist: 35,
    rel: "offers",
    ready: false,
    building:
      "Práctica legal enfocada en startups y rondas de inversión.",
    seeking: "Founders y startups que necesiten estructura legal.",
    offering: "Estructuración legal, contratos y due diligence.",
    industry: "Legal",
    score: 71,
    why: "Karla estructura rondas y startups. Para vos y tu red de founders, es la pieza legal que siempre hace falta cerca.",
    twoway: "Ella ofrece la pieza legal de tu red",
    ice: "",
  },
  {
    id: "sofia",
    name: "Sofía Bonilla",
    role: "Directora creativa / Artista",
    flag: "🇨🇷",
    city: "Costa Rica",
    color: "#FF6A45",
    here: "Stand de arte",
    dist: 18,
    rel: "seeks",
    ready: false,
    building:
      "Un estudio de dirección de arte y producción audiovisual.",
    seeking: "Marcas y eventos para colaboraciones creativas.",
    offering: "Dirección de arte y producción audiovisual.",
    industry: "Arte / Creativo",
    score: 70,
    why: "Sofía busca marcas y eventos — tu terreno. Talento creativo que podés colocar con tus clientes y producciones.",
    twoway: "Ella busca marcas y eventos que vos manejás",
    ice: "",
  },
  {
    id: "bryan",
    name: "Bryan Soto",
    role: "Estudiante de ingeniería · side project",
    flag: "🇸🇻",
    city: "Santa Ana",
    color: "#8AA2B8",
    here: "Zona estudiantes",
    dist: 26,
    rel: "seeks",
    ready: false,
    building: "Un side project técnico y su primera red profesional.",
    seeking: "Mentores y una primera oportunidad real.",
    offering: "Energía, ganas y skills técnicos en crecimiento.",
    industry: "Estudiante / Tech",
    score: 58,
    why: "Bryan está empezando y busca mentores. No es match de negocio inmediato, pero es el tipo de talento temprano que vale tener en el radar.",
    twoway: "Talento temprano para tu radar",
    ice: "",
  },
];

const FILTERS: { id: FilterId; label: string; icon: LucideIcon }[] = [
  { id: "all", label: "Todos", icon: Users },
  { id: "seeks", label: "Necesitan lo que ofrezco", icon: Heart },
  { id: "offers", label: "Ofrecen lo que busco", icon: Search },
  { id: "near", label: "Cerca de mí", icon: MapPin },
];

// ── Hooks ────────────────────────────────────────────────────

function useIsMobile(): boolean {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return mobile;
}

// ── Helpers ──────────────────────────────────────────────────

function initials(n: string): string {
  return n
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
}

function Avatar({
  person,
  size = 44,
}: {
  person: Person | UserProfile;
  size?: number;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size,
        background: `linear-gradient(135deg, ${person.color}, ${person.color}99)`,
        boxShadow: `0 6px 18px ${person.color}40`,
        fontSize: size * 0.34,
        fontWeight: 700,
        color: "#0B0B12",
        flexShrink: 0,
      }}
      className="flex items-center justify-center relative"
    >
      {initials(person.name)}
      <span
        style={{
          position: "absolute",
          bottom: -2,
          right: -2,
          fontSize: size * 0.32,
        }}
      >
        {person.flag}
      </span>
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const r = 15;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: 40, height: 40 }}
    >
      <svg width="40" height="40" className="-rotate-90">
        <circle
          cx="20"
          cy="20"
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="3"
        />
        <circle
          cx="20"
          cy="20"
          r={r}
          fill="none"
          stroke={C.gold}
          strokeWidth="3"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
        />
      </svg>
      <span
        style={{
          position: "absolute",
          fontSize: 11,
          fontWeight: 800,
          color: C.gold,
        }}
      >
        {score}
      </span>
    </div>
  );
}

// ── App Shell — shared between mobile & desktop ──────────────

function AppShell({
  view,
  setView,
  matches,
  children,
  selected,
  overlay,
}: {
  view: ViewId;
  setView: (v: ViewId) => void;
  matches: string[];
  children: React.ReactNode;
  selected: Person | null;
  overlay: Person | null;
}) {
  return (
    <>
      {/* Content */}
      <div className="flex-1 overflow-y-auto noscroll relative">
        {children}
      </div>

      {/* Bottom nav — only when no sheet/overlay is open and not in chat */}
      {view !== "chat" && !selected && !overlay && (
        <nav
          style={{
            borderTop: `1px solid ${C.line}`,
            background: "rgba(11,11,18,0.92)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            paddingBottom:
              "max(env(safe-area-inset-bottom, 0px), 8px)",
          }}
          className="flex items-center justify-around px-2 pt-2.5"
        >
          {(
            [
              { id: "sala" as ViewId, icon: Compass, label: "Sala" },
              {
                id: "matches" as ViewId,
                icon: Zap,
                label: "Matches",
                badge: matches.length,
              },
              {
                id: "mensajes" as ViewId,
                icon: MessageCircle,
                label: "Mensajes",
              },
              { id: "perfil" as ViewId, icon: User, label: "Perfil" },
            ] as const
          ).map((n) => {
            const on = view === n.id;
            const badge = "badge" in n ? n.badge : 0;
            return (
              <button
                key={n.id}
                onClick={() => setView(n.id)}
                className="flex flex-col items-center gap-1 relative py-1"
                style={{ width: 72, minHeight: 44 }}
              >
                <n.icon
                  size={22}
                  color={on ? C.ember : C.faint}
                  strokeWidth={on ? 2.6 : 2}
                />
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: on ? 700 : 500,
                    color: on ? C.ember : C.faint,
                  }}
                >
                  {n.label}
                </span>
                {badge > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: -2,
                      right: 14,
                      background: C.ember,
                      color: "#0B0B12",
                      fontSize: 9,
                      fontWeight: 800,
                      borderRadius: 8,
                      minWidth: 16,
                      height: 16,
                    }}
                    className="flex items-center justify-center px-1"
                  >
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      )}
    </>
  );
}

// ── Main Component ───────────────────────────────────────────

export default function ProximoDemo() {
  const [view, setView] = useState<ViewId>("sala");
  const [filter, setFilter] = useState<FilterId>("all");
  const [selected, setSelected] = useState<Person | null>(null);
  const [sent, setSent] = useState<string[]>([]);
  const [matches, setMatches] = useState<string[]>([]);
  const [chatId, setChatId] = useState<string | null>(null);
  const [overlay, setOverlay] = useState<Person | null>(null);
  const [threads, setThreads] = useState<Threads>({});
  const [draft, setDraft] = useState("");
  const isMobile = useIsMobile();

  const byId = (id: string): Person | undefined =>
    PEOPLE.find((p) => p.id === id);

  const connect = (p: Person) => {
    if (matches.includes(p.id) || sent.includes(p.id)) return;
    if (p.ready) {
      setMatches((m) => [...m, p.id]);
      setOverlay(p);
    } else {
      setSent((s) => [...s, p.id]);
    }
  };

  const openChat = (id: string) => {
    if (!threads[id]) {
      setThreads((t) => ({ ...t, [id]: [] }));
    }
    setChatId(id);
    setView("chat");
    setOverlay(null);
    setSelected(null);
  };

  const useIcebreaker = (id: string) => {
    const p = byId(id);
    if (!p) return;
    setThreads((t) => ({
      ...t,
      [id]: [...(t[id] || []), { from: "me", text: p.ice }],
    }));
    setTimeout(() => {
      setThreads((t) => ({
        ...t,
        [id]: [...(t[id] || []), { from: "them", text: replyFor(id) }],
      }));
    }, 1100);
  };

  const sendDraft = (id: string) => {
    if (!draft.trim()) return;
    setThreads((t) => ({
      ...t,
      [id]: [...(t[id] || []), { from: "me", text: draft.trim() }],
    }));
    setDraft("");
    setTimeout(() => {
      setThreads((t) => ({
        ...t,
        [id]: [...(t[id] || []), { from: "them", text: replyFor(id) }],
      }));
    }, 1100);
  };

  const replyFor = (id: string): string =>
    ({
      daniel:
        "¡Claro que sí! Estoy justo en la mesa 4. Vení cuando puedas — me interesa muchísimo lo de banca regional 🙌",
      andrea:
        "Me encanta. Estoy cerca del escenario, café va. Contame qué deal flow tenés 👀",
      valeria:
        "Síii por favor 🙏 ando buscando justo eso. Estoy junto al café, vení.",
      jose: "De una. Estoy en la zona de demos, podemos hablar ahorita mismo.",
    })[id] || "¡Perfecto, hablemos!";

  const filtered = PEOPLE.filter((p) => {
    if (filter === "all") return true;
    if (filter === "near") return p.dist <= 20;
    if (filter === "seeks") return p.rel === "seeks" || p.rel === "both";
    if (filter === "offers") return p.rel === "offers" || p.rel === "both";
    return true;
  });

  const topPicks = [...PEOPLE].sort((a, b) => b.score - a.score).slice(0, 3);

  // Shared content views
  const content = (
    <>
      {view === "sala" && (
        <Sala
          topPicks={topPicks}
          filter={filter}
          setFilter={setFilter}
          filtered={filtered}
          setSelected={setSelected}
          connect={connect}
          sent={sent}
          matches={matches}
          openChat={openChat}
        />
      )}
      {view === "matches" && (
        <Matches matches={matches} byId={byId} openChat={openChat} />
      )}
      {view === "mensajes" && (
        <MsgList
          matches={matches}
          byId={byId}
          threads={threads}
          openChat={openChat}
        />
      )}
      {view === "chat" && chatId && (
        <Chat
          p={byId(chatId)!}
          thread={threads[chatId] || []}
          useIcebreaker={useIcebreaker}
          draft={draft}
          setDraft={setDraft}
          sendDraft={sendDraft}
          back={() => setView("mensajes")}
          isMobile={isMobile}
        />
      )}
      {view === "perfil" && <Perfil />}

      {/* Detail sheet */}
      {selected && (
        <Detail
          p={selected}
          close={() => setSelected(null)}
          connect={connect}
          sent={sent}
          matches={matches}
          openChat={openChat}
        />
      )}

      {/* Match overlay */}
      {overlay && (
        <MatchOverlay
          p={overlay}
          close={() => setOverlay(null)}
          openChat={openChat}
        />
      )}
    </>
  );

  // ── MOBILE: Full-screen native app ─────────────────────────
  if (isMobile) {
    return (
      <div
        style={{
          background: C.bg,
          height: "100dvh",
          paddingTop: "env(safe-area-inset-top, 0px)",
        }}
        className="w-full flex flex-col relative overflow-hidden"
      >
        {/* Mobile status area — inherits from device */}
        <AppShell
          view={view}
          setView={setView}
          matches={matches}
          selected={selected}
          overlay={overlay}
        >
          {content}
        </AppShell>
      </div>
    );
  }

  // ── DESKTOP: Phone mockup for presentations ────────────────
  return (
    <div
      style={{
        background: `radial-gradient(1200px 800px at 70% -10%, #1c1430 0%, ${C.bg} 55%)`,
        minHeight: "100vh",
      }}
      className="w-full flex flex-col items-center py-10 px-4"
    >
      {/* Brand header */}
      <div className="w-full max-w-md mb-7 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div
            style={{
              background: C.grad,
              width: 30,
              height: 30,
              borderRadius: 9,
            }}
            className="flex items-center justify-center"
          >
            <Compass size={17} color="#0B0B12" strokeWidth={2.6} />
          </div>
          <span
            className="disp"
            style={{
              color: C.text,
              fontSize: 26,
              fontWeight: 800,
              letterSpacing: -0.5,
            }}
          >
            PRÓXIMO
          </span>
        </div>
        <p style={{ color: C.muted, fontSize: 14 }}>
          Hacemos visible a quién deberías conocer.
        </p>
      </div>

      {/* Phone frame */}
      <div
        style={{
          width: 392,
          height: 812,
          background: C.bg,
          borderRadius: 46,
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow:
            "0 40px 120px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
          padding: 11,
          position: "relative",
        }}
      >
        <div
          style={{
            background: C.bg,
            height: "100%",
            borderRadius: 36,
            overflow: "hidden",
            position: "relative",
          }}
          className="flex flex-col"
        >
          {/* Fake status bar */}
          <div
            className="flex items-center justify-between px-7 pt-3 pb-1"
            style={{ color: C.text }}
          >
            <span style={{ fontSize: 13, fontWeight: 700 }}>9:41</span>
            <div
              style={{
                width: 110,
                height: 26,
                background: "#000",
                borderRadius: 20,
              }}
            />
            <div
              className="flex items-center gap-1"
              style={{ fontSize: 11 }}
            >
              <span>5G</span>
              <div
                style={{
                  width: 22,
                  height: 11,
                  border: `1px solid ${C.muted}`,
                  borderRadius: 3,
                }}
                className="flex items-center px-0.5"
              >
                <div
                  style={{
                    background: C.teal,
                    width: 15,
                    height: 7,
                    borderRadius: 1,
                  }}
                />
              </div>
            </div>
          </div>

          <AppShell
            view={view}
            setView={setView}
            matches={matches}
            selected={selected}
            overlay={overlay}
          >
            {content}
          </AppShell>
        </div>
      </div>

      <p style={{ color: C.faint, fontSize: 11 }} className="mt-6">
        Demo interactiva · construido por MachineMind
      </p>
    </div>
  );
}

// ── SALA (main feed) ─────────────────────────────────────────

function Sala({
  topPicks,
  filter,
  setFilter,
  filtered,
  setSelected,
  connect,
  sent,
  matches,
  openChat,
}: {
  topPicks: Person[];
  filter: FilterId;
  setFilter: (f: FilterId) => void;
  filtered: Person[];
  setSelected: (p: Person) => void;
  connect: (p: Person) => void;
  sent: string[];
  matches: string[];
  openChat: (id: string) => void;
}) {
  return (
    <div className="pb-4">
      {/* Event header */}
      <div className="px-5 pt-3 pb-3">
        <div className="flex items-center gap-2 mb-1.5">
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: 7,
              background: C.teal,
            }}
            className="relative pulse-glow"
          >
            <span
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 7,
                background: C.teal,
              }}
              className="animate-ping"
            />
          </span>
          <span
            style={{
              color: C.teal,
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: 1,
            }}
          >
            EN VIVO
          </span>
          <span style={{ color: C.faint, fontSize: 11 }}>
            · 142 personas en la sala
          </span>
        </div>
        <h1
          className="disp"
          style={{
            color: C.text,
            fontSize: 23,
            fontWeight: 800,
            lineHeight: 1.1,
          }}
        >
          CONECTA Summit
        </h1>
        <p style={{ color: C.muted, fontSize: 12.5 }}>
          San Salvador · Hoy · Hotel Sheraton
        </p>
      </div>

      {/* AI matchmaker hero */}
      <div className="px-4 mb-4">
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(255,106,69,0.14), rgba(255,154,92,0.05))",
            border: "1px solid rgba(255,106,69,0.25)",
            borderRadius: 22,
          }}
          className="p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <div
              style={{
                background: C.grad,
                width: 26,
                height: 26,
                borderRadius: 8,
              }}
              className="flex items-center justify-center"
            >
              <Sparkles size={15} color="#0B0B12" strokeWidth={2.6} />
            </div>
            <div>
              <p
                style={{ color: C.text, fontSize: 13.5, fontWeight: 800 }}
                className="disp"
              >
                Para vos, Michelle
              </p>
              <p style={{ color: C.muted, fontSize: 10.5 }}>
                El asistente leyó la sala. Estos 3 valen la pena.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            {topPicks.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setSelected(p)}
                className="fu text-left w-full"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <div
                  style={{
                    background: C.surface,
                    border: `1px solid ${C.line}`,
                    borderRadius: 16,
                  }}
                  className="p-3"
                >
                  <div className="flex items-center gap-3">
                    <Avatar person={p} size={42} />
                    <div className="flex-1 min-w-0">
                      <p
                        style={{
                          color: C.text,
                          fontSize: 14,
                          fontWeight: 700,
                        }}
                        className="truncate"
                      >
                        {p.name}
                      </p>
                      <p
                        style={{ color: C.muted, fontSize: 11.5 }}
                        className="truncate"
                      >
                        {p.role}
                      </p>
                    </div>
                    <ScoreRing score={p.score} />
                  </div>
                  <div
                    style={{
                      background: "rgba(70,214,192,0.08)",
                      borderRadius: 11,
                    }}
                    className="mt-2.5 p-2.5 flex gap-2"
                  >
                    <Sparkles
                      size={13}
                      color={C.teal}
                      strokeWidth={2.4}
                      className="mt-0.5 flex-shrink-0"
                    />
                    <p
                      style={{
                        color: "#CFE9E4",
                        fontSize: 11.5,
                        lineHeight: 1.4,
                      }}
                    >
                      {p.why}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <MapPin size={12} color={C.gold} />
                    <span
                      style={{
                        color: C.gold,
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      {p.here}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 mb-3">
        <div className="flex gap-2 overflow-x-auto noscroll pb-1">
          {FILTERS.map((f) => {
            const on = filter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                style={{
                  background: on ? C.grad : C.surface,
                  border: `1px solid ${on ? "transparent" : C.line}`,
                  borderRadius: 20,
                  whiteSpace: "nowrap",
                }}
                className="flex items-center gap-1.5 px-3.5 py-2.5 flex-shrink-0"
              >
                <f.icon
                  size={13}
                  color={on ? "#0B0B12" : C.muted}
                  strokeWidth={2.4}
                />
                <span
                  style={{
                    color: on ? "#0B0B12" : C.muted,
                    fontSize: 11.5,
                    fontWeight: on ? 800 : 600,
                  }}
                >
                  {f.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Room list */}
      <div className="px-4 flex flex-col gap-2.5">
        <p
          style={{
            color: C.faint,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 1,
          }}
          className="px-1"
        >
          EN LA SALA · {filtered.length}
        </p>
        {filtered.map((p) => {
          const isMatch = matches.includes(p.id);
          const isSent = sent.includes(p.id);
          return (
            <div
              key={p.id}
              style={{
                background: C.surface,
                border: `1px solid ${C.line}`,
                borderRadius: 18,
              }}
              className="p-3"
            >
              <button
                onClick={() => setSelected(p)}
                className="flex items-start gap-3 w-full text-left"
              >
                <Avatar person={p} size={46} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p
                      style={{
                        color: C.text,
                        fontSize: 14.5,
                        fontWeight: 700,
                      }}
                      className="truncate"
                    >
                      {p.name}
                    </p>
                    <span style={{ color: C.faint, fontSize: 10.5 }}>
                      · {p.dist}m
                    </span>
                  </div>
                  <p
                    style={{ color: C.muted, fontSize: 11.5 }}
                    className="truncate"
                  >
                    {p.role}
                  </p>
                  <div
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      borderRadius: 8,
                    }}
                    className="mt-1.5 inline-flex items-center gap-1 px-2 py-1"
                  >
                    <Search size={10} color={C.teal} />
                    <span
                      style={{ color: C.muted, fontSize: 10.5 }}
                      className="truncate"
                    >
                      Busca: {p.seeking}
                    </span>
                  </div>
                </div>
              </button>
              <button
                onClick={() => (isMatch ? openChat(p.id) : connect(p))}
                disabled={isSent}
                style={{
                  background: isMatch
                    ? C.gradTeal
                    : isSent
                      ? "rgba(255,255,255,0.06)"
                      : C.grad,
                  borderRadius: 12,
                  opacity: isSent ? 0.8 : 1,
                }}
                className="w-full mt-2.5 flex items-center justify-center gap-1.5 py-3"
              >
                {isMatch ? (
                  <>
                    <MessageCircle
                      size={14}
                      color="#0B0B12"
                      strokeWidth={2.6}
                    />
                    <span
                      style={{
                        color: "#0B0B12",
                        fontSize: 12.5,
                        fontWeight: 800,
                      }}
                    >
                      Abrir conversación
                    </span>
                  </>
                ) : isSent ? (
                  <>
                    <Clock size={13} color={C.muted} />
                    <span
                      style={{
                        color: C.muted,
                        fontSize: 12.5,
                        fontWeight: 700,
                      }}
                    >
                      Interés enviado
                    </span>
                  </>
                ) : (
                  <>
                    <Zap
                      size={14}
                      color="#0B0B12"
                      strokeWidth={2.6}
                      fill="#0B0B12"
                    />
                    <span
                      style={{
                        color: "#0B0B12",
                        fontSize: 12.5,
                        fontWeight: 800,
                      }}
                    >
                      Conectar
                    </span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── DETAIL Sheet ─────────────────────────────────────────────

function Detail({
  p,
  close,
  connect,
  sent,
  matches,
  openChat,
}: {
  p: Person;
  close: () => void;
  connect: (p: Person) => void;
  sent: string[];
  matches: string[];
  openChat: (id: string) => void;
}) {
  const isMatch = matches.includes(p.id);
  const isSent = sent.includes(p.id);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        zIndex: 30,
      }}
      className="flex items-end fade-in"
      onClick={close}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: C.bg2,
          borderRadius: "28px 28px 0 0",
          border: `1px solid ${C.line}`,
          maxHeight: "88%",
          paddingBottom:
            "max(env(safe-area-inset-bottom, 0px), 28px)",
          animation: "floatUp .3s ease both",
        }}
        className="w-full overflow-y-auto noscroll p-5"
      >
        <div className="flex justify-center mb-3">
          <div
            style={{
              width: 40,
              height: 4,
              borderRadius: 4,
              background: "rgba(255,255,255,0.2)",
            }}
          />
        </div>

        <div className="flex items-center gap-3.5 mb-4">
          <Avatar person={p} size={62} />
          <div className="flex-1">
            <p
              style={{ color: C.text, fontSize: 19, fontWeight: 800 }}
              className="disp"
            >
              {p.name}
            </p>
            <p style={{ color: C.muted, fontSize: 12.5 }}>{p.role}</p>
            <div className="flex items-center gap-1 mt-1">
              <MapPin size={12} color={C.gold} />
              <span
                style={{ color: C.gold, fontSize: 11, fontWeight: 600 }}
              >
                {p.here}
              </span>
            </div>
          </div>
          <div
            style={{
              background: "rgba(245,194,107,0.12)",
              borderRadius: 12,
            }}
            className="flex flex-col items-center px-3 py-1.5"
          >
            <span
              style={{ color: C.gold, fontSize: 18, fontWeight: 800 }}
              className="disp"
            >
              {p.score}
            </span>
            <span
              style={{ color: C.gold, fontSize: 8.5, fontWeight: 700 }}
            >
              MATCH
            </span>
          </div>
        </div>

        {/* Why — the magic */}
        <div
          style={{
            background:
              "linear-gradient(135deg, rgba(70,214,192,0.12), rgba(70,214,192,0.03))",
            border: "1px solid rgba(70,214,192,0.22)",
            borderRadius: 16,
          }}
          className="p-3.5 mb-4"
        >
          <div className="flex items-center gap-1.5 mb-1.5">
            <Sparkles size={14} color={C.teal} strokeWidth={2.5} />
            <span
              style={{
                color: C.teal,
                fontSize: 11.5,
                fontWeight: 800,
                letterSpacing: 0.5,
              }}
            >
              POR QUÉ DEBERÍAS HABLARLE
            </span>
          </div>
          <p style={{ color: "#DDF3EF", fontSize: 13, lineHeight: 1.5 }}>
            {p.why}
          </p>
        </div>

        {/* Profile blocks */}
        <Block icon={Building2} label="Está construyendo" text={p.building} />
        <Block
          icon={Search}
          label="Está buscando"
          text={p.seeking}
          accent={C.teal}
        />
        <Block
          icon={Heart}
          label="Puede aportar"
          text={p.offering}
          accent={C.ember}
        />
        <Block icon={Briefcase} label="Industria" text={p.industry} />

        <button
          onClick={() =>
            isMatch
              ? (close(), openChat(p.id))
              : (connect(p), !p.ready && close())
          }
          disabled={isSent}
          style={{
            background: isMatch
              ? C.gradTeal
              : isSent
                ? "rgba(255,255,255,0.06)"
                : C.grad,
            borderRadius: 15,
            opacity: isSent ? 0.8 : 1,
          }}
          className="w-full mt-2 flex items-center justify-center gap-2 py-3.5"
        >
          {isMatch ? (
            <>
              <MessageCircle
                size={17}
                color="#0B0B12"
                strokeWidth={2.6}
              />
              <span
                style={{
                  color: "#0B0B12",
                  fontSize: 14.5,
                  fontWeight: 800,
                }}
              >
                Abrir conversación
              </span>
            </>
          ) : isSent ? (
            <>
              <Clock size={15} color={C.muted} />
              <span
                style={{ color: C.muted, fontSize: 14, fontWeight: 700 }}
              >
                Interés enviado · esperando
              </span>
            </>
          ) : (
            <>
              <Zap
                size={17}
                color="#0B0B12"
                strokeWidth={2.6}
                fill="#0B0B12"
              />
              <span
                style={{
                  color: "#0B0B12",
                  fontSize: 14.5,
                  fontWeight: 800,
                }}
              >
                Conectar con {p.name.split(" ")[0]}
              </span>
            </>
          )}
        </button>
        {!isMatch && !isSent && (
          <p
            style={{ color: C.faint, fontSize: 11 }}
            className="text-center mt-2.5"
          >
            Nadie recibe mensajes sin interés mutuo. Privado hasta que ambos
            digan sí.
          </p>
        )}
      </div>
    </div>
  );
}

function Block({
  icon: Icon,
  label,
  text,
  accent = "#9A98AA",
}: {
  icon: LucideIcon;
  label: string;
  text: string;
  accent?: string;
}) {
  return (
    <div className="mb-2.5 flex gap-3">
      <div
        style={{
          background: "rgba(255,255,255,0.05)",
          width: 32,
          height: 32,
          borderRadius: 10,
        }}
        className="flex items-center justify-center flex-shrink-0"
      >
        <Icon size={15} color={accent} strokeWidth={2.3} />
      </div>
      <div>
        <p
          style={{
            color: C.faint,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 0.5,
          }}
        >
          {label.toUpperCase()}
        </p>
        <p style={{ color: C.text, fontSize: 13, lineHeight: 1.4 }}>
          {text}
        </p>
      </div>
    </div>
  );
}

// ── MATCH Overlay ────────────────────────────────────────────

function MatchOverlay({
  p,
  close,
  openChat,
}: {
  p: Person;
  close: () => void;
  openChat: (id: string) => void;
}) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(11,11,18,0.92)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        zIndex: 40,
      }}
      className="flex flex-col items-center justify-center px-8 fade-in"
    >
      <button
        onClick={close}
        style={{
          position: "absolute",
          top: "max(env(safe-area-inset-top, 12px), 12px)",
          right: 18,
          minWidth: 44,
          minHeight: 44,
        }}
        className="flex items-center justify-center"
      >
        <X size={24} color={C.muted} />
      </button>
      <div className="pop-in flex flex-col items-center">
        <div className="flex items-center -space-x-3 mb-5">
          <Avatar person={ME} size={72} />
          <div
            style={{
              background: C.grad,
              width: 34,
              height: 34,
              borderRadius: 34,
              zIndex: 5,
              border: `3px solid ${C.bg}`,
            }}
            className="flex items-center justify-center"
          >
            <Zap size={17} color="#0B0B12" fill="#0B0B12" strokeWidth={2} />
          </div>
          <Avatar person={p} size={72} />
        </div>
        <h2
          className="disp"
          style={{
            fontSize: 32,
            fontWeight: 800,
            background: C.grad,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          ¡Conexión!
        </h2>
        <p
          style={{ color: C.text, fontSize: 15, fontWeight: 600 }}
          className="text-center mt-1"
        >
          Vos y {p.name.split(" ")[0]} se interesaron.
        </p>
        <p
          style={{ color: C.muted, fontSize: 13 }}
          className="text-center mt-1.5 mb-6"
        >
          {p.here}
        </p>
        <button
          onClick={() => openChat(p.id)}
          style={{ background: C.grad, borderRadius: 15 }}
          className="flex items-center justify-center gap-2 px-7 py-3.5 w-full"
        >
          <MessageCircle size={17} color="#0B0B12" strokeWidth={2.6} />
          <span
            style={{ color: "#0B0B12", fontSize: 15, fontWeight: 800 }}
          >
            Empezar a conversar
          </span>
        </button>
        <button
          onClick={close}
          style={{ color: C.muted, fontSize: 13, fontWeight: 600 }}
          className="mt-4 py-2"
        >
          Seguir explorando la sala
        </button>
      </div>
    </div>
  );
}

// ── MATCHES Tab ──────────────────────────────────────────────

function Matches({
  matches,
  byId,
  openChat,
}: {
  matches: string[];
  byId: (id: string) => Person | undefined;
  openChat: (id: string) => void;
}) {
  if (matches.length === 0) {
    return (
      <Empty
        icon={Zap}
        title="Aún no hay matches"
        text="Cuando vos y alguien se interesen, aparece aquí. Probá conectar con los que el asistente te recomienda."
      />
    );
  }
  return (
    <div className="px-4 pt-3">
      <h2
        className="disp px-1 mb-3"
        style={{ color: C.text, fontSize: 22, fontWeight: 800 }}
      >
        Tus matches
      </h2>
      <div className="flex flex-col gap-2.5">
        {matches.map((id) => {
          const p = byId(id);
          if (!p) return null;
          return (
            <button
              key={id}
              onClick={() => openChat(id)}
              style={{
                background: C.surface,
                border: `1px solid ${C.line}`,
                borderRadius: 18,
              }}
              className="p-3 flex items-center gap-3 text-left"
            >
              <Avatar person={p} size={48} />
              <div className="flex-1 min-w-0">
                <p
                  style={{
                    color: C.text,
                    fontSize: 14.5,
                    fontWeight: 700,
                  }}
                >
                  {p.name}
                </p>
                <p
                  style={{ color: C.muted, fontSize: 11.5 }}
                  className="truncate"
                >
                  {p.role}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <MapPin size={11} color={C.gold} />
                  <span style={{ color: C.gold, fontSize: 10.5 }}>
                    {p.here}
                  </span>
                </div>
              </div>
              <div
                style={{ background: C.gradTeal, borderRadius: 11 }}
                className="flex items-center gap-1 px-2.5 py-2"
              >
                <MessageCircle
                  size={14}
                  color="#0B0B12"
                  strokeWidth={2.6}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── MESSAGES List ────────────────────────────────────────────

function MsgList({
  matches,
  byId,
  threads,
  openChat,
}: {
  matches: string[];
  byId: (id: string) => Person | undefined;
  threads: Threads;
  openChat: (id: string) => void;
}) {
  if (matches.length === 0) {
    return (
      <Empty
        icon={MessageCircle}
        title="Sin conversaciones todavía"
        text="Hacé match con alguien y la conversación arranca aquí — con un rompehielos listo para enviar."
      />
    );
  }
  return (
    <div className="px-4 pt-3">
      <h2
        className="disp px-1 mb-3"
        style={{ color: C.text, fontSize: 22, fontWeight: 800 }}
      >
        Mensajes
      </h2>
      <div className="flex flex-col gap-1.5">
        {matches.map((id) => {
          const p = byId(id);
          if (!p) return null;
          const th = threads[id] || [];
          const last = th.length
            ? th[th.length - 1].text
            : "Rompehielos sugerido listo";
          return (
            <button
              key={id}
              onClick={() => openChat(id)}
              className="p-2.5 flex items-center gap-3 text-left"
              style={{ borderRadius: 14 }}
            >
              <Avatar person={p} size={50} />
              <div
                className="flex-1 min-w-0"
                style={{ borderBottom: `1px solid ${C.line}` }}
              >
                <div className="flex items-center justify-between pb-2.5">
                  <div className="min-w-0">
                    <p
                      style={{
                        color: C.text,
                        fontSize: 14,
                        fontWeight: 700,
                      }}
                    >
                      {p.name.split(" ")[0]} {p.flag}
                    </p>
                    <p
                      style={{
                        color: th.length ? C.muted : C.ember,
                        fontSize: 12,
                      }}
                      className="truncate"
                    >
                      {last}
                    </p>
                  </div>
                  {!th.length && (
                    <span
                      style={{
                        background: C.ember,
                        width: 9,
                        height: 9,
                        borderRadius: 9,
                      }}
                      className="flex-shrink-0"
                    />
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── CHAT ─────────────────────────────────────────────────────

function Chat({
  p,
  thread,
  useIcebreaker,
  draft,
  setDraft,
  sendDraft,
  back,
  isMobile,
}: {
  p: Person;
  thread: ChatMessage[];
  useIcebreaker: (id: string) => void;
  draft: string;
  setDraft: (s: string) => void;
  sendDraft: (id: string) => void;
  back: () => void;
  isMobile: boolean;
}) {
  const hasMsgs = thread.length > 0;
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [thread.length]);

  const handleSend = useCallback(() => {
    sendDraft(p.id);
    if (isMobile && inputRef.current) {
      inputRef.current.blur();
    }
  }, [sendDraft, p.id, isMobile]);

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div
        style={{
          borderBottom: `1px solid ${C.line}`,
          background: "rgba(11,11,18,0.92)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          paddingTop: isMobile
            ? "max(env(safe-area-inset-top, 8px), 8px)"
            : undefined,
        }}
        className="flex items-center gap-3 px-3 py-3"
      >
        <button
          onClick={back}
          className="flex items-center justify-center"
          style={{ minWidth: 44, minHeight: 44 }}
        >
          <ChevronLeft size={24} color={C.text} />
        </button>
        <Avatar person={p} size={40} />
        <div className="flex-1">
          <p style={{ color: C.text, fontSize: 14.5, fontWeight: 700 }}>
            {p.name}
          </p>
          <div className="flex items-center gap-1">
            <MapPin size={11} color={C.gold} />
            <span style={{ color: C.gold, fontSize: 11 }}>{p.here}</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto noscroll px-4 py-4 flex flex-col gap-3"
      >
        {/* Match banner */}
        <div
          style={{
            background: "rgba(70,214,192,0.08)",
            border: "1px solid rgba(70,214,192,0.2)",
            borderRadius: 14,
          }}
          className="p-3 text-center"
        >
          <Zap
            size={16}
            color={C.teal}
            fill={C.teal}
            className="inline mr-1"
          />
          <span
            style={{ color: C.teal, fontSize: 12, fontWeight: 700 }}
          >
            Conexión hecha · {p.score}% de match
          </span>
        </div>

        {/* AI icebreaker suggestion */}
        {!hasMsgs && p.ice && (
          <div
            className="fu"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,106,69,0.13), rgba(255,154,92,0.04))",
              border: "1px solid rgba(255,106,69,0.25)",
              borderRadius: 18,
            }}
          >
            <div className="p-3.5">
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles size={14} color={C.ember} strokeWidth={2.5} />
                <span
                  style={{
                    color: C.ember2,
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: 0.5,
                  }}
                >
                  ROMPEHIELOS SUGERIDO
                </span>
              </div>
              <p
                style={{
                  color: C.text,
                  fontSize: 13.5,
                  lineHeight: 1.5,
                }}
              >
                &ldquo;{p.ice}&rdquo;
              </p>
              <button
                onClick={() => useIcebreaker(p.id)}
                style={{ background: C.grad, borderRadius: 12 }}
                className="w-full mt-3 flex items-center justify-center gap-2 py-3"
              >
                <Send size={14} color="#0B0B12" strokeWidth={2.6} />
                <span
                  style={{
                    color: "#0B0B12",
                    fontSize: 13,
                    fontWeight: 800,
                  }}
                >
                  Enviar este mensaje
                </span>
              </button>
            </div>
          </div>
        )}

        {thread.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}
          >
            <div
              style={{
                background: m.from === "me" ? C.grad : C.surfaceHi,
                color: m.from === "me" ? "#0B0B12" : C.text,
                borderRadius:
                  m.from === "me"
                    ? "16px 16px 4px 16px"
                    : "16px 16px 16px 4px",
                maxWidth: "82%",
              }}
              className="px-3.5 py-2.5"
            >
              <p
                style={{
                  fontSize: 13.5,
                  lineHeight: 1.45,
                  fontWeight: m.from === "me" ? 600 : 500,
                }}
              >
                {m.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Composer */}
      <div
        style={{
          borderTop: `1px solid ${C.line}`,
          background: "rgba(11,11,18,0.92)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          paddingBottom:
            "max(env(safe-area-inset-bottom, 0px), 8px)",
        }}
        className="flex items-center gap-2 px-3 py-3"
      >
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Escribí un mensaje..."
          enterKeyHint="send"
          autoComplete="off"
          style={{
            background: C.surfaceHi,
            border: `1px solid ${C.line}`,
            borderRadius: 22,
            color: C.text,
            fontSize: 16,
            outline: "none",
          }}
          className="flex-1 px-4 py-2.5"
        />
        <button
          onClick={handleSend}
          style={{
            background: C.grad,
            width: 44,
            height: 44,
            borderRadius: 44,
          }}
          className="flex items-center justify-center flex-shrink-0"
        >
          <Send size={18} color="#0B0B12" strokeWidth={2.6} />
        </button>
      </div>
    </div>
  );
}

// ── PERFIL ───────────────────────────────────────────────────

function Perfil() {
  return (
    <div className="px-4 pt-3 pb-4">
      <div
        style={{
          background:
            "linear-gradient(135deg, rgba(255,106,69,0.12), rgba(255,154,92,0.03))",
          border: `1px solid ${C.line}`,
          borderRadius: 22,
        }}
        className="p-5 mb-4 flex flex-col items-center text-center"
      >
        <Avatar person={ME} size={78} />
        <p
          className="disp mt-3"
          style={{ color: C.text, fontSize: 21, fontWeight: 800 }}
        >
          {ME.name}
        </p>
        <p style={{ color: C.muted, fontSize: 13 }}>{ME.role}</p>
        <p
          style={{ color: C.gold, fontSize: 12, fontWeight: 600 }}
          className="mt-1"
        >
          {ME.flag} {ME.city}
        </p>
      </div>

      <p
        style={{
          color: C.faint,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 1,
        }}
        className="px-1 mb-2"
      >
        TU PERFIL — NO ES UN CURRÍCULUM
      </p>
      <Block icon={Building2} label="Qué estoy construyendo" text={ME.building} />
      <Block
        icon={Search}
        label="Qué estoy buscando"
        text={ME.seeking}
        accent={C.teal}
      />
      <Block
        icon={Heart}
        label="Qué puedo aportar"
        text={ME.offering}
        accent={C.ember}
      />
      <Block icon={Briefcase} label="Industria" text={ME.industry} />

      <div
        style={{
          background: C.surface,
          border: `1px solid ${C.line}`,
          borderRadius: 16,
        }}
        className="p-3.5 mt-3"
      >
        <p style={{ color: C.text, fontSize: 12.5, lineHeight: 1.5 }}>
          <span style={{ color: C.teal, fontWeight: 700 }}>
            Así te ve la sala.
          </span>{" "}
          Cuando entrás a un evento, las personas correctas te ven a vos — y
          vos a ellas. Claro, humano, directo al punto.
        </p>
      </div>
    </div>
  );
}

// ── Empty State ──────────────────────────────────────────────

function Empty({
  icon: Icon,
  title,
  text,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center text-center px-10"
      style={{ height: "100%" }}
    >
      <div
        style={{
          background: C.surface,
          width: 64,
          height: 64,
          borderRadius: 20,
        }}
        className="flex items-center justify-center mb-4"
      >
        <Icon size={28} color={C.faint} strokeWidth={2} />
      </div>
      <p
        className="disp"
        style={{ color: C.text, fontSize: 18, fontWeight: 800 }}
      >
        {title}
      </p>
      <p
        style={{ color: C.muted, fontSize: 13, lineHeight: 1.5 }}
        className="mt-1.5"
      >
        {text}
      </p>
    </div>
  );
}
