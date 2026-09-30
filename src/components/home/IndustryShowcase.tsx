"use client";

import { motion } from "framer-motion";

const industries = [
  {
    id: "cafe",
    title: "Cafés",
    subtitle: "Mach aus Gästen Stammgäste.",
    desc: "Belohne regelmäßige Kaffeebesuche mit einer Prämie. Dein Team stempelt direkt an der Theke.",
    img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800",
    stat: "Treue",
    statLabel: "belohnen",
  },
  {
    id: "salon",
    title: "Salons",
    subtitle: "Gib Kunden einen Grund zurückzukommen.",
    desc: "Lege fest, nach wie vielen Besuchen du eine Behandlung oder ein Produkt als Dankeschön vergibst.",
    img: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=800",
    stat: "Besuche",
    statLabel: "belohnen",
  },
  {
    id: "retail",
    title: "Handel",
    subtitle: "Stärke die Bindung zu deinem Laden.",
    desc: "Ob Kiosk oder Boutique: Gib deinen Kunden mit jeder Stempelkarte einen Anreiz für den nächsten Einkauf.",
    img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800",
    stat: "Lokal",
    statLabel: "binden",
  },
  {
    id: "gastro",
    title: "Gastro",
    subtitle: "Vom Gast zum Stammgast.",
    desc: "Mache deinen Mittagstisch zur festen Anlaufstelle. Du bestimmst, wann es ein Dessert als Prämie gibt.",
    img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800",
    stat: "Stammgäste",
    statLabel: "gewinnen",
  }
];

export default function IndustryShowcase() {
  return (
    <section className="py-24 md:py-40 w-full bg-canvas flex flex-col items-center overflow-hidden z-20 relative">
      <div className="w-full max-w-[1200px] px-5 md:px-10">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-black/40 mb-4">Branchen</p>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-[#111] leading-[1.05]">
              Für jedes Geschäft.<br/>
              <span className="text-brand-500">Für jeden Kunden.</span>
            </h2>
          </motion.div>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl text-black/50 font-medium max-w-md"
          >
            Egal ob Espresso-Bar oder Barbershop. Passe die digitale Stempelkarte perfekt an deinen Alltag an.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {industries.map((ind, i) => (
            <motion.div
              key={ind.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative rounded-[2.5rem] overflow-hidden min-h-[420px] md:min-h-[480px] bg-zinc-100 isolate"
            >
              <img 
                src={ind.img} 
                alt={ind.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105 -z-10" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none -z-10" />
              
              <div className="absolute inset-0 p-8 flex flex-col justify-end pointer-events-none">
                 <p className="text-brand-400 font-bold text-[10px] md:text-xs uppercase tracking-widest mb-3 transform translate-y-2 opacity-80 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                   {ind.stat} {ind.statLabel}
                 </p>
                 <h3 className="text-white text-3xl font-bold mb-3 tracking-tight transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                   {ind.title}.
                 </h3>
                 <p className="text-white/70 text-sm font-medium leading-relaxed opacity-0 transform translate-y-4 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-75">
                   {ind.desc}
                 </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
