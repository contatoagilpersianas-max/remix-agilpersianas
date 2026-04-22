/**
 * Configurações canônicas do site — usadas em footer, topbar e checkout.
 * Mantemos os valores aqui (single source of truth) e sincronizados com
 * a tabela site_settings (key='contact') para futura edição via admin.
 */
export const SITE_CONFIG = {
  brand: "Ágil Persianas",
  cnpj: "52.355.734/0001-97",
  email: "contato@agilpersianas.com.br",
  whatsappNumber: "5532351202810", // formato internacional p/ link wa.me
  whatsappDisplay: "(32) 3512-0281",
  phoneDisplay: "(32) 3512-0281",
  hours: "seg a sáb, 8h–20h",
  // Endereço/showroom oculto enquanto não temos endereço oficial
  showAddress: false,
  address: "",
};

export const whatsappLink = (text?: string) => {
  const base = `https://wa.me/${SITE_CONFIG.whatsappNumber}`;
  if (!text) return base;
  return `${base}?text=${encodeURIComponent(text)}`;
};
