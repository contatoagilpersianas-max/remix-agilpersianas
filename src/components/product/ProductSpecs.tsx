import { Truck, Wrench, ShieldCheck, Package, Clock, CreditCard } from "lucide-react";
import type { Product } from "@/routes/produto.$slug";

const fmt = (cm: number) => `${(cm / 100).toFixed(2)} m`;

export function ProductSpecs({ product }: { product: Product }) {
  const blocks = [
    {
      icon: Truck,
      title: "Entrega para todo o Brasil",
      desc: "Embalagem reforçada e rastreio até a sua porta. Frete calculado no checkout.",
    },
    {
      icon: Clock,
      title: "Prazo de produção 7 a 12 dias úteis",
      desc: "Cada peça é fabricada exatamente para sua janela após confirmação do pedido.",
    },
    {
      icon: Wrench,
      title: "Instalação simples ou assistida",
      desc: "Acompanha kit completo, manual e vídeo. Instalação opcional em capitais.",
    },
    {
      icon: ShieldCheck,
      title: "Garantia 5 anos",
      desc: "Cobertura completa de mecanismo e acabamento. Pós-venda dedicado.",
    },
    {
      icon: CreditCard,
      title: "Até 12× sem juros",
      desc: "Aceitamos todos os cartões. 5% de desconto no PIX à vista.",
    },
    {
      icon: Package,
      title: "Sob medida ao centímetro",
      desc: "Configure largura e altura conforme sua janela — sem limites de tamanhos padrão.",
    },
  ];

  return (
    <section className="container-premium py-16">
      <div className="grid lg:grid-cols-[1fr_2fr] gap-12">
        <div>
          <span className="text-xs uppercase tracking-widest text-primary font-semibold">
            Especificações & Serviço
          </span>
          <h2 className="font-display text-3xl lg:text-4xl mt-2">
            Tudo que você precisa saber
          </h2>
          <p className="text-muted-foreground mt-4 leading-relaxed">
            Produzido na nossa fábrica em Juiz de Fora — MG, com tecidos selecionados
            e mecanismos de alta durabilidade.
          </p>

          {/* Tabela de medidas */}
          <div className="mt-6 rounded-2xl border bg-card p-5 shadow-card">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
              Limites de fabricação
            </div>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Largura</dt>
                <dd className="font-medium">
                  {fmt(product.min_width_cm)} a {fmt(product.max_width_cm)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Altura</dt>
                <dd className="font-medium">
                  {fmt(product.min_height_cm)} a {fmt(product.max_height_cm)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Área mínima</dt>
                <dd className="font-medium">{product.min_area} m²</dd>
              </div>
              <div className="flex justify-between border-t pt-2 mt-2">
                <dt className="text-muted-foreground">Preço por m²</dt>
                <dd className="font-semibold text-foreground">
                  {product.price_per_sqm.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          {blocks.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border bg-card p-5 shadow-card hover:shadow-lg transition"
            >
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold leading-tight">{title}</h3>
              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
