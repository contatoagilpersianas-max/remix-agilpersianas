const looks = [
  {
    img: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=1400&q=80",
    title: "Quarto premium",
    sub: "Escurecimento total para o sono perfeito",
  },
  {
    img: "https://images.unsplash.com/photo-1618219740975-d40978bb7378?w=1400&q=80",
    title: "Sala moderna",
    sub: "Elegância discreta, luz controlada",
  },
  {
    img: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=1400&q=80",
    title: "Escritório sofisticado",
    sub: "Foco e produtividade em qualquer hora",
  },
];

export function LifestyleSection() {
  return (
    <section className="bg-graphite text-graphite-foreground py-20">
      <div className="container-premium">
        <div className="max-w-2xl mb-12">
          <span className="text-xs uppercase tracking-widest text-primary font-semibold">Inspiração</span>
          <h2 className="font-display text-3xl lg:text-5xl mt-2">Em ambientes reais</h2>
          <p className="text-graphite-foreground/70 mt-3 text-lg">
            Veja como a Ágil transforma cada espaço com tecidos premium e acabamento impecável.
          </p>
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          {looks.map((l) => (
            <div key={l.title} className="group relative rounded-2xl overflow-hidden aspect-[4/5]">
              <img
                src={l.img}
                alt={l.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-premium group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-display text-2xl">{l.title}</h3>
                <p className="text-white/80 text-sm mt-1">{l.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
