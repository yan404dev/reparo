export const siteContent = {
  name: "Reparô",
  fullName: "Reparô Technologies",
  tagline: "Sistema Operacional para Assistência Técnica de Smartphones",
  description:
    "Plataforma inteligente de gestão de ordens de serviço, checklist fotográfico de entrada, baixa automática de estoque e orçamentos interativos com margem de lucro garantida.",
  url: "https://fluxos.com.br",
  cta: {
    primary: {
      label: "Usar agora",
      href: "/auth?mode=register",
    },
    header: {
      label: "Usar agora",
      href: "/auth?mode=register",
    },
    login: {
      label: "Entrar",
      href: "/auth?mode=login",
    },
  },
  nav: [
    { label: "Recursos", href: "#recursos" },
    { label: "Como Funciona", href: "#como-funciona" },
    { label: "Comparativo", href: "#comparativo" },
    { label: "Resultados", href: "#resultados" },
    { label: "FAQ", href: "#faq" },
  ],
  hero: {
    headline: "Sua bancada sem furos no estoque e sua oficina com lucro de verdade.",
    subheadline:
      "Controle Ordens de Serviço do checklist à entrega, automatize a precificação com margem garantida e avise o cliente no WhatsApp com um clique. O software definitivo para assistências de smartphones e tablets.",
  },
  intro: {
    heading: "Um único sistema para organizar da recepção do aparelho ao fechamento do caixa.",
    paragraph:
      "Cada bancada tem seu ritmo, mas toda assistência sofre com os mesmos gargalos: peças que somem sem baixa, aparelhos devolvidos com danos prévios não documentados e orçamentos calculados de cabeça com prejuízo no final do mês. O Reparô foi desenhado diretamente dentro do laboratório de smartphones para eliminar o improviso. Da entrada do aparelho com fotos de alta resolução à aprovação pelo WhatsApp com assinatura digital, você tem controle absoluto, segurança jurídica e previsibilidade financeira.",
  },
  solutions: [
    {
      id: "checklist",
      tag: "SEGURANÇA JURÍDICA",
      title: "Checklist fotográfico em 45 segundos: nunca mais pague por defeito prévio.",
      description:
        "Registre riscos na tela, estado do Face ID, saúde da bateria, parafusos faltantes e danos na carcaça antes de abrir o aparelho. Gere um laudo com foto e colha a assinatura digital do cliente na hora.",
      linkText: "Conhecer o checklist digital",
      linkHref: "/auth?mode=register",
      mockType: "checklist",
      badge: "Inspeção de Entrada",
    },
    {
      id: "pricing",
      tag: "LUCRO GARANTIDO",
      title: "Markup automático: saiba exatamente quanto vai sobrar no bolso antes de passar o preço.",
      description:
        "Chega de orçamentos no 'olhômetro'. O Reparô calcula automaticamente o custo da peça de reposição, taxa de maquininha, custo de garantia e sua hora técnica, sugerindo o valor final com a margem líquida que você definir.",
      linkText: "Ver calculadora de margem",
      linkHref: "/auth?mode=register",
      mockType: "pricing",
      badge: "Cálculo de Margem",
    },
    {
      id: "inventory",
      tag: "ZERO FURO DE ESTOQUE",
      title: "Baixa automática na aprovação: tela, bateria e periféricos sob controle estrito.",
      description:
        "Assim que a OS é aprovada, a peça é reservada e abatida do estoque físico. Receba alertas inteligentes de reposição para as peças de maior giro (telas de iPhone, baterias originais e conectores) antes que o cliente chegue à loja.",
      linkText: "Explorar controle de estoque",
      linkHref: "/auth?mode=register",
      mockType: "inventory",
      badge: "Estoque Inteligente",
    },
    {
      id: "whatsapp",
      tag: "AGILIDADE & CONVERSÃO",
      title: "Envio de orçamento interativo: o cliente aprova pelo celular sem travar sua bancada.",
      description:
        "Envie o link do orçamento detalhado direto no WhatsApp do cliente. Ele visualiza fotos do defeito, laudo técnico, valores discriminados e aprova ou recusa com um toque. Sua equipe não perde mais tempo atendendo chamadas a cada 15 minutos.",
      linkText: "Ver modelo de orçamento web",
      linkHref: "/auth?mode=register",
      mockType: "whatsapp",
      badge: "Portal do Cliente",
    },
  ],
  servicesPillars: [
    {
      id: "tracking",
      title: "Rastreabilidade Total por IMEI",
      description:
        "Histórico completo do aparelho por IMEI e Número de Série. Saiba quais técnicos mexeram, quais peças foram substituídas e consulte o histórico de garantias anteriores em 2 cliques.",
    },
    {
      id: "finance",
      title: "Gestão Financeira & Comissões",
      description:
        "Fechamento diário do caixa, conciliação por método de pagamento e cálculo automático da comissão por serviço executado para cada profissional da bancada.",
    },
    {
      id: "multi-device",
      title: "Acesso Multi-Dispositivo",
      description:
        "Roda com fluidez no computador da recepção, no tablet do técnico de bancada e no celular do gestor. Dados criptografados e sincronizados em tempo real na nuvem.",
    },
  ],
  comparison: {
    heading: "Sua bancada antes do Reparô vs. com o Reparô",
    subheading: "Veja a transformação na rotina de quem abandonou o improviso e profissionalizou a operação.",
    items: [
      {
        aspect: "Entrada do Aparelho",
        before: "Bloco de papel rasurado, sem fotos e sem respaldo para riscos já existentes",
        after: "Checklist digital em 45s com fotos, saúde de bateria e assinatura na tela",
      },
      {
        aspect: "Controle de Peças",
        before: "Peças pegas da gaveta sem baixa; falta peça na hora de fechar o serviço",
        after: "Baixa automática atrelada à OS; aviso de reposição preventiva inteligente",
      },
      {
        aspect: "Orçamentos & Margem",
        before: "Cálculo de cabeça; margem corroída por taxas de cartão e custos ocultos",
        after: "Margem líquida pré-definida com cálculo instantâneo de markup real",
      },
      {
        aspect: "Comunicação com Cliente",
        before: "Cliente ligando a cada 10 minutos cobrando status e interrompendo o técnico",
        after: "Link de orçamento interativo no WhatsApp com aprovação em 1 toque",
      },
      {
        aspect: "Garantia & Histórico",
        before: "Comprovantes perdidos; discussões se a peça ainda estava dentro da garantia",
        after: "Histórico vitalício do aparelho por IMEI com validade de garantia exata",
      },
    ],
  },
  stats: [
    {
      id: "margin",
      value: "+38%",
      description: "Aumento médio no lucro líquido mensal após a padronização de margem e markup inteligente nos orçamentos.",
    },
    {
      id: "stock",
      value: "100%",
      description: "Eliminação de peças sem baixa no estoque físico com reserva automática na aprovação de cada OS.",
    },
    {
      id: "speed",
      value: "< 2 min",
      description: "Tempo médio para o cliente receber e aprovar o orçamento interativo com fotos diretamente pelo WhatsApp.",
    },
  ],
  testimonial: {
    quote:
      "Antes do Reparô, tínhamos pelo menos duas discussões por mês com clientes alegando que a carcaça não estava trincada antes de entrar, além de peças caras que sumiam da gaveta sem registro. Hoje, com o checklist fotográfico e o portal de aprovação por WhatsApp, nossa taxa de conversão de orçamentos subiu para 78% e os técnicos produzem 40% mais sem interrupções.",
    author: "Lucas Medeiros",
    role: "Proprietário da iFix Pro Laboratório de Smartphones (3 unidades, 12 bancadas)",
  },
  faq: [
    {
      question: "Preciso de um computador caro para rodar o Reparô?",
      answer:
        "Não. O Reparô é 100% web e roda com velocidade máxima em qualquer navegador no Windows, Mac, Linux, tablet (iPad ou Android) ou até no celular dos técnicos na bancada.",
    },
    {
      question: "Quanto custa o Reparô?",
      answer:
        "O Reparô custa apenas R$ 49,90 por mês, garantindo acesso irrestrito a todas as funcionalidades: checklist fotográfico de entrada, controle de estoque de peças, baixa automática, ordens de serviço ilimitadas e orçamentos interativos enviados direto no WhatsApp. Sem taxas de implantação, sem multas e sem contrato de fidelidade.",
    },
    {
      question: "Como meus clientes aprovam o orçamento pelo WhatsApp?",
      answer:
        "Com 1 clique no painel da OS, o Reparô gera uma mensagem personalizada no WhatsApp contendo um link exclusivo do Portal do Cliente. Lá, o cliente visualiza o laudo, fotos do defeito, valor das peças e mão de obra, podendo aprovar com assinatura digital.",
    },
    {
      question: "Consigo migrar meus dados de clientes e estoque antigos?",
      answer:
        "Sim! Nossa equipe disponibiliza importação facilitada por planilha Excel/CSV para que você comece com todo seu inventário e base de contatos cadastrada em poucos minutos.",
    },
    {
      question: "O checklist fotográfico ocupa espaço no meu computador?",
      answer:
        "Todas as fotos de inspeção de entrada são otimizadas, criptografadas e armazenadas com segurança em servidores cloud de alta disponibilidade. Nada fica ocupando a memória física dos seus aparelhos.",
    },
    {
      question: "Minha equipe precisa de treinamento para usar o sistema?",
      answer:
        "A interface do Reparô foi desenhada para ser intuitiva e direta. Em menos de 10 minutos, atendentes e técnicos já dominam a abertura de OS, checklist e controle de estoque, sem necessidade de treinamentos complexos.",
    },
  ],
  footer: {
    columns: [
      {
        title: "Produto",
        links: [
          { label: "Checklist Digital com Fotos", href: "#recursos" },
          { label: "Controle de Estoque & Peças", href: "#recursos" },
          { label: "Cálculo Automático de Margem", href: "#recursos" },
          { label: "Portal de Orçamento WhatsApp", href: "#recursos" },
          { label: "Gestão de Ordens de Serviço", href: "#recursos" },
        ],
      },
      {
        title: "Especialidades",
        links: [
          { label: "Assistência Apple & iPhone", href: "#como-funciona" },
          { label: "Assistência Samsung & Xiaomi", href: "#como-funciona" },
          { label: "Troca de Vidro & Reballing", href: "#como-funciona" },
          { label: "Reparo de Placas & Conectores", href: "#como-funciona" },
          { label: "Garantia e Laudo Técnico", href: "#como-funciona" },
        ],
      },
      {
        title: "Institucional",
        links: [
          { label: "Sobre o Reparô", href: "#" },
          { label: "Planos & Preços", href: "#" },
          { label: "Central de Ajuda", href: "#faq" },
          { label: "Termos de Uso", href: "#" },
          { label: "Privacidade", href: "#" },
        ],
      },
    ],
  },
} as const;
