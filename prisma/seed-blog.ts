import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const COVER = (id: string) =>
  `https://images.unsplash.com/${id}?w=1600&h=900&fit=crop&q=85&auto=format`;
const INLINE = (id: string) =>
  `https://images.unsplash.com/${id}?w=1400&h=900&fit=crop&q=85&auto=format`;

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  tags: string;
  category: string;
  readTime: string;
  published: boolean;
  featured: boolean;
  publishedAt: Date;
};

const posts: Post[] = [
  // 1
  {
    slug: "fenac-2026-o-que-esperar-do-maior-evento-do-varejo",
    title: "FENAC 2026: o que esperar do maior evento do varejo de construção em SC",
    excerpt:
      "A 12ª edição da Feira de Negócios da ACOMAC promete três dias de rodadas, lançamentos e networking de ponta. Veja o que já está confirmado.",
    coverImage: COVER("photo-1540575467063-178a50c2df87"),
    author: "Equipe ACOMAC Joinville",
    tags: "fenac, evento, networking, varejo",
    category: "Eventos",
    readTime: "7 min",
    published: true,
    featured: true,
    publishedAt: new Date("2026-04-10T09:00:00Z"),
    content: `
<p>Faltando pouco mais de três meses para o evento mais aguardado do calendário do varejo de material de construção em Santa Catarina, a equipe da ACOMAC Joinville já tem 78% das vagas de expositores confirmadas. A <strong>FENAC 2026</strong> acontece entre os dias <strong>20 e 22 de agosto</strong>, no Expoville, e deve reunir mais de 4 mil profissionais do setor.</p>

<p>Esta é a maior edição da feira até hoje. Comparado com 2024, a área comercial cresceu 38% — passando de 9.200 para 12.700 m². Esse crescimento reflete a recuperação consistente do mercado em SC e o apetite da indústria por estreitar relacionamento direto com o varejo regional.</p>

<h2>Os 3 pilares da edição 2026</h2>

<p>A organização estruturou o evento em torno de três grandes frentes que respondem ao que os associados pediram nas pesquisas de satisfação dos últimos dois anos.</p>

<img src="${INLINE("photo-1556761175-5973dc0f32e7")}" alt="Stand de feira do setor da construção" />

<h3>1. Rodadas de Negócios estruturadas</h3>

<p>O modelo continua o mesmo que consagrou a feira: encontros de 25 minutos entre lojistas e indústrias, com agenda fechada antes do evento. Em 2024, foram 1.847 rodadas que renderam mais de R$ 18 milhões em pedidos fechados nos 90 dias seguintes.</p>

<p>Para 2026, a ACOMAC dobrou o número de salas de reunião e contratou um sistema de agendamento próprio que permite ao lojista filtrar fornecedores por categoria, faixa de preço e localização do CD.</p>

<h3>2. Trilha de conteúdo "Varejo do Futuro"</h3>

<p>São 14 palestras distribuídas em três dias, cobrindo os temas que mais aparecem nas buscas dos associados:</p>

<ul>
  <li><strong>Gestão financeira</strong> para lojas de pequeno e médio porte</li>
  <li><strong>Marketing local</strong> e estratégias de geração de tráfego</li>
  <li><strong>Atendimento consultivo</strong> e venda complexa</li>
  <li><strong>Tecnologia e ERP</strong> aplicados à realidade da loja</li>
  <li><strong>Sucessão familiar</strong> e profissionalização</li>
</ul>

<blockquote>"A FENAC virou uma plataforma de transformação. Quem participa volta para a loja com pelo menos uma ideia que muda algo importante na operação." — Carlos Henrique, presidente da ACOMAC</blockquote>

<h3>3. Espaço Conecta Indústria-Varejo</h3>

<p>Pela primeira vez, a feira terá um espaço dedicado a apresentações de lançamentos com formato de demonstração ao vivo. Marcas como Tigre, Suvinil, Tramontina, Vedacit e Cerâmica Portinari já confirmaram showrooms exclusivos.</p>

<img src="${INLINE("photo-1559136555-9303baea8ebd")}" alt="Profissionais negociando em ambiente corporativo" />

<h2>Como participar</h2>

<p>A inscrição para associados ACOMAC é gratuita e dá acesso a todas as áreas, incluindo as rodadas e palestras. Não-associados pagam R$ 380 para os três dias.</p>

<p>Vale lembrar que <strong>associados em dia também recebem um voucher de hospedagem</strong> com 30% de desconto na rede credenciada (12 hotéis de Joinville e região).</p>

<hr/>

<h2>Cronograma resumido</h2>

<p>Os horários ainda podem sofrer pequenos ajustes, mas a estrutura macro está fechada:</p>

<ul>
  <li><strong>20/08 (qua)</strong> — Abertura institucional, primeiras rodadas, coquetel de boas-vindas</li>
  <li><strong>21/08 (qui)</strong> — Dia mais intenso: rodadas o dia todo + ciclo principal de palestras</li>
  <li><strong>22/08 (sex)</strong> — Lançamentos no Espaço Conecta, premiação João-de-Barro e jantar de encerramento</li>
</ul>

<p>O <strong>Prêmio João-de-Barro</strong>, que reconhece os destaques do varejo da construção em SC, terá nove categorias em 2026 — duas a mais que na última edição. As inscrições para concorrer abrem em junho.</p>

<h2>Por que sua loja não pode ficar de fora</h2>

<p>A FENAC não é "só uma feira". É o ponto de encontro onde a indústria desenha a próxima safra de lançamentos junto com quem está na ponta. É também onde os melhores fornecedores fecham contratos anuais com condições impossíveis de obter no dia a dia.</p>

<p>Se você ainda não confirmou presença, <a href="/eventos">acesse a página de Eventos</a> e garanta sua agenda. Em 2024, vendemos todas as vagas de rodadas até 15 dias antes do evento.</p>
`.trim(),
  },

  // 2
  {
    slug: "como-precificar-materiais-de-construcao",
    title: "Como precificar materiais de construção sem perder margem",
    excerpt:
      "Custo + margem não basta. Veja como impostos, frete, mix e concorrência local devem entrar na sua planilha de preços.",
    coverImage: COVER("photo-1556909114-f6e7ad7d3136"),
    author: "Diretoria Técnica ACOMAC",
    tags: "preço, gestão, margem, varejo",
    category: "Gestão",
    readTime: "9 min",
    published: true,
    featured: false,
    publishedAt: new Date("2026-04-08T08:30:00Z"),
    content: `
<p>"Custo mais 30% e tá bom" é uma das frases mais perigosas do varejo de material de construção. Em uma loja média, esse simples atalho pode estar deixando entre 4% e 11% de margem na mesa — todo mês, em todo SKU. Se a sua loja fatura R$ 800 mil por mês, isso é R$ 70 mil que escorrem ralo abaixo.</p>

<p>Precificar bem é o exercício mais subestimado do nosso setor. E o motivo não é falta de planilha — é falta de método. Neste artigo, vamos abrir o passo a passo que a ACOMAC usa em workshops com associados.</p>

<h2>O que entra de verdade no custo</h2>

<p>Antes de pensar em margem, é preciso entender que o "custo do produto" não é só a nota de entrada. A conta correta inclui:</p>

<ul>
  <li><strong>Preço de aquisição</strong> com descontos comerciais aplicados</li>
  <li><strong>ICMS-ST</strong> recolhido na entrada (essencial em SC)</li>
  <li><strong>Frete de entrada</strong> rateado por SKU</li>
  <li><strong>Custo financeiro</strong> de prazo (dinheiro parado em estoque)</li>
  <li><strong>Quebra e perdas</strong> históricas da categoria</li>
</ul>

<p>Esse é o seu <strong>Custo Real</strong>. É sobre ele — e nunca sobre o preço de nota — que você aplica a margem.</p>

<img src="${INLINE("photo-1554224155-6726b3ff858f")}" alt="Calculadora e planilha financeira sobre mesa" />

<h2>O método dos 4 mark-ups</h2>

<p>Esquece o markup único. Categorias diferentes têm dinâmicas diferentes. Aqui está a estrutura que recomendamos:</p>

<h3>Categoria A — Comoditie de alto giro</h3>

<p>Cimento, areia, brita, vergalhão, ferro. O cliente compara preço em 3 lugares antes de comprar. Margem operacional típica: <strong>14% a 22%</strong>. Aqui você compete em volume, prazo e disponibilidade — não em preço cheio.</p>

<h3>Categoria B — Especificação técnica</h3>

<p>Tintas, hidráulica, elétrica de marca. O cliente já decidiu a marca, mas pode trocar a loja. Margem: <strong>28% a 38%</strong>. Aqui o atendimento consultivo justifica o preço maior.</p>

<h3>Categoria C — Acabamento e decoração</h3>

<p>Pisos, revestimentos, louças, metais. O cliente compra por aspiração e ambiente. Margem: <strong>40% a 65%</strong>. Mostruário caprichado e atendimento de projeto sustentam o ticket.</p>

<h3>Categoria D — Acessórios e impulso</h3>

<p>Pincéis, fitas, fixadores, EPIs. Margem: <strong>60% a 110%</strong>. São itens que entram no carrinho na hora do pagamento. Posicionamento estratégico no PDV multiplica vendas.</p>

<blockquote>Lojas que separam mark-ups por categoria têm em média <strong>3,4 pontos percentuais</strong> a mais de margem bruta que lojas que aplicam mark-up único. — Pesquisa ACOMAC, dez/2025</blockquote>

<h2>O fator concorrência local</h2>

<p>Tabela na mão é só metade do trabalho. A outra metade é entender onde sua loja se posiciona em relação aos concorrentes que dividem a região.</p>

<p>Faça <strong>cotações periódicas</strong> de uma cesta com 30 a 50 SKUs nos seus 3 principais concorrentes (incluindo home centers). Em quais itens você está acima? Em quais está abaixo?</p>

<p>Essa cesta vira sua bússola de precificação. Itens onde você está acima do mercado em mais de 8% precisam de revisão urgente — ou de uma justificativa muito clara para o cliente (entrega, atendimento, prazo).</p>

<img src="${INLINE("photo-1542744173-8e7e53415bb0")}" alt="Equipe analisando dados em reunião" />

<h2>Margem ≠ Lucro</h2>

<p>Esse é o erro mais comum. Margem bruta de 35% NÃO é lucro de 35%. Para chegar ao lucro líquido, você ainda precisa cobrir:</p>

<ul>
  <li>Despesas comerciais (comissão, marketing, frete de saída)</li>
  <li>Despesas administrativas (folha, aluguel, energia, sistemas)</li>
  <li>Impostos sobre venda (PIS, COFINS, ICMS na saída)</li>
</ul>

<p>Em uma loja típica, essas linhas somam <strong>22% a 28%</strong> do faturamento. Por isso, margens brutas abaixo de 30% no agregado são um sinal de alerta.</p>

<hr/>

<h2>3 ferramentas que ajudam</h2>

<p>Você não precisa de software caro para começar:</p>

<ol>
  <li><strong>Planilha de Custo Real</strong> — modelo da ACOMAC disponível na área do associado</li>
  <li><strong>Cesta de cotação semanal</strong> — 50 SKUs, 3 concorrentes, 1 hora por semana</li>
  <li><strong>Análise mensal de margem por categoria</strong> — saída padrão de qualquer ERP</li>
</ol>

<p>Para associados ACOMAC, a equipe técnica oferece consultoria gratuita de revisão de tabela duas vezes ao ano. <a href="/contato">Entre em contato</a> para agendar.</p>

<h2>O ponto final</h2>

<p>Precificação não é uma decisão única. É um processo contínuo de calibragem. As lojas que mais ganham margem no nosso setor são aquelas que revisam preços <strong>pelo menos a cada 30 dias</strong> e ajustam por categoria, não por SKU isolado.</p>

<p>Comece hoje: separe uma hora, escolha uma categoria, calcule o Custo Real, compare com o mercado e refaça o preço. Em três meses, você verá a diferença na DRE.</p>
`.trim(),
  },

  // 3
  {
    slug: "tendencias-de-revestimentos-2026",
    title: "Tendências de revestimentos para 2026: porcelanato gigante, pedras e mais",
    excerpt:
      "O que vai aparecer nas obras de classe média e alta no segundo semestre. Spoiler: o tamanho importa.",
    coverImage: COVER("photo-1600607687939-ce8a6c25118c"),
    author: "Marina Costa, ACOMAC",
    tags: "revestimento, porcelanato, tendência, decoração",
    category: "Mercado",
    readTime: "6 min",
    published: true,
    featured: false,
    publishedAt: new Date("2026-04-05T11:00:00Z"),
    content: `
<p>O segmento de revestimentos é o que mais sente as mudanças de comportamento do consumidor. Em 2026, três tendências fortes estão se desenhando — e seu mostruário precisa estar pronto para elas.</p>

<h2>Porcelanato gigante (120×260 e 162×324)</h2>

<p>O que era nicho em 2023 virou volume em 2026. Os formatos extra-grandes deixaram de ser exclusividade de obra de luxo e estão chegando à classe média alta. Os motivos:</p>

<ul>
  <li><strong>Menos rejunte</strong> — visual mais limpo e contínuo</li>
  <li><strong>Menos quebra-cabeça</strong> de assentamento</li>
  <li><strong>Sensação de amplitude</strong> em ambientes pequenos</li>
</ul>

<img src="${INLINE("photo-1600585154340-be6161a56a0c")}" alt="Sala ampla com porcelanato grande formato" />

<p>O que mudou em 2026: as marcas brasileiras (Portobello, Eliane, Damme) passaram a produzir esses formatos no Brasil, derrubando o preço em até 35% comparado ao importado. <strong>Isso abriu o mercado para a obra padrão MCMV+</strong>.</p>

<p><strong>Implicação para sua loja</strong>: você precisa de pelo menos um expositor com aplicação real desse formato. O cliente compra olhando — e o azulejo na vertical da prateleira não vende mais.</p>

<h2>Pedras naturais voltando ao centro</h2>

<p>Mármore, granito polido e quartzito estão de volta com força. Não como peça única — como protagonista do ambiente. A preferência é por padrões dramáticos com veios marcantes.</p>

<img src="${INLINE("photo-1565043589221-1a6fd9ae45c7")}" alt="Bancada de mármore com veios marcantes" />

<blockquote>O cliente que está reformando hoje tem um repertório visual mais alto graças ao Pinterest e Instagram. Ele não quer mais "branco neutro". Ele quer personalidade.</blockquote>

<p>Isso não significa que sua loja precisa estocar 40 padrões. Significa que sua linha de revestimentos precisa ter <strong>3 a 5 padrões marcantes</strong> que sirvam de "porta de entrada" para a venda.</p>

<h2>Madeira amadeirada (de novo, mas diferente)</h2>

<p>O porcelanato amadeirado nunca saiu — mas mudou. Em 2026, a tendência é por <strong>réguas longas</strong> (mais de 120cm) e tons mais claros, especialmente carvalho e amêndoa.</p>

<p>Esse padrão está entrando forte em quartos e salas, substituindo o piso vinílico em obras intermediárias. A vantagem comercial: o ticket médio é 60% maior que o vinílico, com margem maior também.</p>

<h3>Cores que sobem</h3>

<ul>
  <li><strong>Off-white e cru</strong> — substituindo o branco gelo</li>
  <li><strong>Verdes profundos</strong> — em metais e revestimentos cerâmicos</li>
  <li><strong>Terracota</strong> — voltou em formato hexagonal e arabesco</li>
</ul>

<h3>Cores que caem</h3>

<ul>
  <li>Cinza grafite (saturado em todas as obras dos últimos 5 anos)</li>
  <li>Madeiras escuras (jatobá, cumaru) em pisos amplos</li>
  <li>Mármores muito brancos sem veio</li>
</ul>

<hr/>

<h2>O que isso significa para a operação</h2>

<p>Três ações práticas para os próximos 60 dias:</p>

<ol>
  <li><strong>Renove o expositor</strong> de revestimentos com pelo menos 30% dos padrões em formatos novos</li>
  <li><strong>Treine a equipe</strong> para abrir conversa sobre tendência (não só preço)</li>
  <li><strong>Crie um "kit ambiente"</strong> com piso + parede + bancada de uma mesma família</li>
</ol>

<p>Lojas associadas que querem aprofundar este conteúdo podem participar do <strong>Encontro de Revestimentos</strong> da ACOMAC em junho, com presença confirmada de Portobello, Eliane e Cerâmica Portinari.</p>
`.trim(),
  },

  // 4
  {
    slug: "energia-solar-para-lojas-de-construcao",
    title: "Energia solar para lojas de construção: vale a pena investir?",
    excerpt:
      "Investimento, payback, manutenção e impacto na conta de luz. Os números que você precisa antes de fechar com qualquer integrador.",
    coverImage: COVER("photo-1509391366360-2e959784a276"),
    author: "Equipe Técnica ACOMAC",
    tags: "energia solar, sustentabilidade, custos, investimento",
    category: "Sustentabilidade",
    readTime: "8 min",
    published: true,
    featured: false,
    publishedAt: new Date("2026-04-02T10:00:00Z"),
    content: `
<p>A conta de luz de uma loja média de material de construção em SC ficou entre R$ 4.800 e R$ 9.500 em 2025. Em 12 meses, isso é fácil de virar R$ 100 mil queimados em energia. A pergunta que toda diretoria está fazendo é: <strong>vale colocar painel solar no telhado?</strong></p>

<p>A resposta curta é: <strong>quase sempre vale</strong>. A longa exige conta. Vamos fazer juntos.</p>

<h2>Quanto custa instalar</h2>

<p>O investimento varia conforme o consumo. Para uma loja que consome 5.000 kWh/mês, o sistema típico de geração em SC tem entre 35 e 42 kWp e custa entre <strong>R$ 145 mil e R$ 195 mil</strong>, instalado, com inversor, estrutura e homologação.</p>

<img src="${INLINE("photo-1466611653911-95081537e5b7")}" alt="Telhado com placas solares instaladas" />

<p>Esse intervalo grande de preço reflete três variáveis principais:</p>

<ul>
  <li><strong>Marca dos painéis</strong> (Tier 1 vs intermediários)</li>
  <li><strong>Inversor</strong> (string vs micro-inversor)</li>
  <li><strong>Tipo de estrutura</strong> (telhado metálico, fibrocimento, cerâmica)</li>
</ul>

<h2>Quanto economiza</h2>

<p>Com geração compatível, a conta de energia cai entre <strong>78% e 92%</strong> — não vai a zero por causa da taxa mínima e da custo de disponibilidade. Em uma loja com conta de R$ 7.500/mês, isso significa economia de R$ 5.850 a R$ 6.900 por mês.</p>

<h2>Payback realista</h2>

<p>Com investimento de R$ 175 mil e economia de R$ 6.500/mês, o payback simples é <strong>27 meses</strong>. Com correção pela inflação energética (que tem rodado em 8,5% ao ano), cai para 24 meses.</p>

<blockquote>Em SC, o payback médio de instalações comerciais em 2025 ficou entre 22 e 32 meses. Acima disso, vale rever o orçamento.</blockquote>

<h3>E os 25 anos seguintes?</h3>

<p>A vida útil garantida dos painéis Tier 1 é de 25 anos com queda mínima de produção. Depois do payback, você tem <strong>22 a 23 anos de energia praticamente gratuita</strong>. Em valor presente, isso representa entre R$ 800 mil e R$ 1,2 milhão de economia ao longo da vida do sistema.</p>

<img src="${INLINE("photo-1497435334941-8c899ee9e8e9")}" alt="Painéis solares em primeiro plano" />

<h2>O que mudou em 2026 (Lei 14.300)</h2>

<p>A famosa "taxação do sol" entrou em vigor para sistemas novos. Mas o impacto real é menor do que o pânico fez parecer:</p>

<ul>
  <li>Sistemas instalados <strong>até dezembro de 2030</strong> têm regra de transição favorável</li>
  <li>A taxa cresce gradualmente até 2029, dando margem para retorno do investimento</li>
  <li>Mesmo com a taxa, o payback aumenta em média <strong>4 a 7 meses</strong> — ainda muito atrativo</li>
</ul>

<p>Quem está pensando em investir, faça em <strong>2026 ou 2027</strong>. Cada ano de adiamento aumenta o payback final.</p>

<hr/>

<h2>Como escolher o integrador</h2>

<p>Esse é o ponto que mais gera dor. O mercado tem muitos amadores. Cinco perguntas que você deve fazer antes de assinar:</p>

<ol>
  <li>Qual é o <strong>histórico de geração</strong> de instalações similares feitas pela empresa nos últimos 12 meses?</li>
  <li>O orçamento traz a <strong>simulação do PVSyst</strong> ou similar?</li>
  <li>A garantia de geração é <strong>contratual</strong> com cláusula de ressarcimento?</li>
  <li>Quem faz a <strong>manutenção anual</strong> está incluído nos primeiros 5 anos?</li>
  <li>O integrador tem <strong>CRT-CREA</strong> ativo e seguro de responsabilidade civil?</li>
</ol>

<p>Se a empresa não responde sim para todos os cinco, não é o integrador certo.</p>

<h2>Financiamento e linhas especiais</h2>

<p>Em 2026, três linhas valem a pena olhar:</p>

<ul>
  <li><strong>BNDES Finame Energia</strong> — taxa entre TR + 8,5% e TR + 11%, prazo até 84 meses</li>
  <li><strong>Pronampe Verde</strong> — para empresas até R$ 4,8 mi de faturamento, taxa Selic + 3%</li>
  <li><strong>Linhas privadas</strong> com integrador (Solfácil, Meu Financiamento Solar, etc.)</li>
</ul>

<p>A ACOMAC tem parceria com 4 integradores credenciados em SC com condições diferenciadas para associados. Os valores ficam, em média, <strong>11% abaixo da média de mercado</strong>. Veja na <a href="/convenios">página de Convênios</a>.</p>

<h2>Conclusão objetiva</h2>

<p>Se sua loja consome mais de R$ 4 mil/mês de energia, tem telhado próprio (ou aluguel longo) e folga financeira de R$ 30 mil para entrada, <strong>vale investir agora</strong>. O cenário regulatório é mais favorável que será nos próximos anos, e o custo do equipamento estabilizou após anos de queda.</p>
`.trim(),
  },

  // 5
  {
    slug: "atendimento-consultivo-loja-construcao",
    title: "Atendimento consultivo: como sua loja vende mais com menos esforço",
    excerpt:
      "Vendedor de balcão sumiu. Hoje, quem ganha é quem ajuda o cliente a evitar erros caros. Veja o método.",
    coverImage: COVER("photo-1521791136064-7986c2920216"),
    author: "Roberto Kraus, consultor parceiro ACOMAC",
    tags: "atendimento, vendas, treinamento, consultivo",
    category: "Vendas",
    readTime: "7 min",
    published: true,
    featured: false,
    publishedAt: new Date("2026-03-30T14:00:00Z"),
    content: `
<p>Há 15 anos, o balcão de uma loja de material de construção era basicamente um caixa registrador com um humano na frente. Cliente entrava sabendo o que queria, vendedor pegava do estoque, registrava, despedia. Acabou.</p>

<p>O cliente de 2026 chega na loja com 70% da decisão pronta — vinda do YouTube, Instagram, conversa com o pedreiro, ou pesquisa no Google. <strong>O papel do vendedor virou outro</strong>: evitar que ele erre nos 30% que faltam.</p>

<h2>Por que isso muda tudo</h2>

<p>Quando o cliente está bem informado mas não totalmente, o erro fica caro. Comprar argamassa errada para porcelanato grande pode estragar uma obra de R$ 12 mil. Subdimensionar um disjuntor pode causar um incêndio. <strong>É aí que o vendedor consultivo brilha</strong>.</p>

<img src="${INLINE("photo-1521737604893-d14cc237f11d")}" alt="Vendedor explicando produto para cliente em loja" />

<p>Lojas que treinam atendimento consultivo crescem ticket médio em <strong>22% a 38%</strong> em 12 meses, segundo levantamento da ACOMAC com 47 associados em 2025. Não é truque. É método.</p>

<h2>O método das 3 perguntas</h2>

<p>Antes de mostrar produto, faça 3 perguntas. Sempre.</p>

<h3>1. "Onde vai ser aplicado?"</h3>

<p>Parece óbvio, mas resolve metade dos erros. Piso para área molhada não é igual ao piso de quarto. Tinta para fachada não é igual à de interior. <strong>Localização define o produto certo.</strong></p>

<h3>2. "Quem vai aplicar?"</h3>

<p>Pedreiro experiente vs proprietário fazendo sozinho mudam totalmente a recomendação. O experiente quer produto técnico. O proprietário quer produto fácil. Vender o errado para o público errado gera reclamação e devolução.</p>

<h3>3. "Qual o orçamento da obra inteira?"</h3>

<p>Aqui mora a venda complementar. Cliente comprando porcelanato vai precisar de argamassa, rejunte, espaçador, ferramentas. Você sabendo o orçamento total, monta o pacote certo — e fecha tudo de uma vez.</p>

<blockquote>Vendedor consultivo não vende mais produto — vende mais <strong>sucesso da obra</strong>. E obra que dá certo vira cliente que volta.</blockquote>

<h2>O kit que toda loja precisa ter</h2>

<p>Treinamento sozinho não basta. Precisa de ferramenta. Quatro itens que mudaram a operação dos associados que aplicam o método:</p>

<ul>
  <li><strong>Tabela técnica visual</strong> de aplicação por ambiente (piso, parede, área molhada)</li>
  <li><strong>Calculadora de quantitativo</strong> para os 20 produtos mais vendidos</li>
  <li><strong>"Kit obra"</strong> pré-montado por tipo de aplicação (revestimento, hidráulica, elétrica)</li>
  <li><strong>Cartão de garantia técnica</strong> com QR code para o vídeo de instalação</li>
</ul>

<img src="${INLINE("photo-1664575196412-ed801e8333a1")}" alt="Equipe de loja em treinamento" />

<h2>Treinamento contínuo, não evento único</h2>

<p>Um workshop de 4 horas no sábado não muda nada. O que funciona é <strong>15 minutos por dia</strong> com a equipe, antes da loja abrir. Tema da semana, role-play rápido, dúvidas reais que apareceram no balcão.</p>

<p>Lojas que rodam essa cadência por 90 dias mostram diferença de NPS (satisfação do cliente) de até <strong>18 pontos</strong>. E NPS alto vira boca-a-boca.</p>

<hr/>

<h2>Indicadores para medir</h2>

<p>Você não melhora o que não mede. Comece a acompanhar:</p>

<ol>
  <li><strong>Ticket médio por vendedor</strong> — sinaliza quem aplica o método</li>
  <li><strong>Taxa de itens por venda</strong> — mede a venda complementar</li>
  <li><strong>Devolução técnica</strong> — quanto cai quando o consultivo melhora</li>
  <li><strong>Recompra em 90 dias</strong> — medida real da satisfação</li>
</ol>

<h2>Por onde começar</h2>

<p>Pega os 3 melhores vendedores e os 3 piores. Compara o ticket médio. Onde estiver a diferença, está o trabalho a fazer.</p>

<p>Associados ACOMAC têm acesso ao programa <strong>"Vendedor Consultivo"</strong> — 6 módulos online + workshop presencial — gratuito, em parceria com o SENAC. Inscrições abertas trimestralmente. <a href="/cursos">Veja a próxima turma</a>.</p>
`.trim(),
  },

  // 6
  {
    slug: "gestao-de-estoque-mix-e-giro",
    title: "Gestão de estoque para materiais de construção: do mix ao giro",
    excerpt:
      "Estoque parado é dinheiro morto. Estoque furado é venda perdida. Veja como balancear sem virar um pesadelo operacional.",
    coverImage: COVER("photo-1553413077-190dd305871c"),
    author: "ACOMAC Joinville",
    tags: "estoque, gestão, ERP, giro",
    category: "Gestão",
    readTime: "8 min",
    published: true,
    featured: false,
    publishedAt: new Date("2026-03-26T09:30:00Z"),
    content: `
<p>Em uma loja de material de construção típica de Joinville, o estoque vale entre 22% e 35% do faturamento anual. Isso é muito dinheiro parado. E nem sempre é necessário.</p>

<p>A questão não é "ter mais ou menos estoque" — é <strong>ter o estoque certo nos itens certos</strong>. Vamos abrir como fazer isso na prática.</p>

<h2>A curva ABC ainda manda</h2>

<p>Velha conhecida, mas pouquíssimas lojas aplicam de verdade. A regra:</p>

<ul>
  <li><strong>Curva A</strong> — 20% dos SKUs que fazem 70% das vendas. Não pode faltar nunca.</li>
  <li><strong>Curva B</strong> — 30% dos SKUs que fazem 25% das vendas. Reposição programada.</li>
  <li><strong>Curva C</strong> — 50% dos SKUs que fazem 5% das vendas. Pedido sob demanda ou estoque mínimo.</li>
</ul>

<img src="${INLINE("photo-1530124566582-a618bc2615dc")}" alt="Almoxarifado organizado com prateleiras" />

<p>Se você fala "todo cliente acha o que quer aqui", desconfia. Provavelmente você tem estoque <strong>demais</strong> de itens C — e nem sempre tem o item A na prateleira.</p>

<h2>Giro de estoque por categoria</h2>

<p>Giro é quantas vezes seu estoque "rodou" em um período. Conta básica: <strong>vendas no período ÷ estoque médio no período</strong>.</p>

<p>Para nosso setor, os giros saudáveis variam por categoria:</p>

<ul>
  <li><strong>Cimento, argamassa, areia</strong> — 12x a 18x ao ano (gira a cada 20-30 dias)</li>
  <li><strong>Hidráulica e elétrica básica</strong> — 8x a 12x ao ano</li>
  <li><strong>Tintas</strong> — 6x a 10x ao ano</li>
  <li><strong>Revestimentos e louças</strong> — 3x a 6x ao ano (giro mais lento, maior margem)</li>
  <li><strong>Acabamentos especiais</strong> — 2x a 4x ao ano</li>
</ul>

<p>Se sua categoria de cimento gira 6x ao ano, tem alguma coisa errada. Provavelmente você está comprando volume demais de uma vez por causa de desconto que não compensa o custo de carregamento.</p>

<blockquote>Desconto de 4% em volume com prazo de pagamento de 60 dias e giro de 90 dias é <strong>prejuízo financeiro</strong>, não vantagem.</blockquote>

<img src="${INLINE("photo-1581094794329-c8112a89af12")}" alt="Empilhadeira movimentando paletes em estoque" />

<h2>Controle de ruptura</h2>

<p>Ruptura é quando o cliente pede e não tem. É o pior tipo de problema porque é invisível: ele não vira reclamação, vira venda perdida.</p>

<p>Para medir, você precisa registrar <strong>todo pedido não atendido</strong>. ERPs modernos fazem isso automaticamente. Em loja sem sistema, vale fazer no papel mesmo, por 30 dias, só para descobrir o tamanho do buraco.</p>

<p>Meta razoável: <strong>menos de 4% de ruptura nos itens de Curva A</strong>. Acima disso, você está perdendo dinheiro silenciosamente.</p>

<h2>Os 5 inimigos do estoque saudável</h2>

<ol>
  <li><strong>Compra emocional</strong> — vendedor da indústria empurrou, comprador caiu na conversa</li>
  <li><strong>Promoção sem giro garantido</strong> — entrou pelo preço, vai sair com prejuízo</li>
  <li><strong>Sazonalidade ignorada</strong> — comprar volume de tinta em janeiro pra obra que só acontece em outubro</li>
  <li><strong>SKUs duplicados</strong> — três cimentos da mesma marca, dois a mais que o necessário</li>
  <li><strong>Falta de inventário rotativo</strong> — estoque do sistema nunca bate com o real</li>
</ol>

<hr/>

<h2>Inventário rotativo: o segredo das lojas top</h2>

<p>Inventário anual é doloroso e gera divergências enormes. <strong>Inventário rotativo</strong> resolve: todo dia, a equipe conta um grupo pequeno de SKUs (15 a 30 itens). Em 90 dias, todo o estoque foi contado.</p>

<p>O ganho é triplo:</p>

<ul>
  <li>Estoque do sistema sempre próximo do real</li>
  <li>Detecta furto e quebra rapidamente</li>
  <li>Equipe cria intimidade com o estoque (acha mais rápido)</li>
</ul>

<h2>Sistema versus planilha</h2>

<p>Loja faturando até R$ 200 mil/mês consegue gerenciar estoque com planilha bem feita. Acima disso, ERP é praticamente obrigatório. As opções recomendadas para nosso setor:</p>

<ul>
  <li><strong>Sankhya, Bling, Tiny</strong> para lojas pequenas e médias</li>
  <li><strong>Vetorh, RP Info</strong> para lojas médias e grandes especializadas</li>
  <li><strong>Linx, Totvs</strong> para redes ou lojas com alta complexidade</li>
</ul>

<p>Associados ACOMAC têm condições especiais com 4 fornecedores credenciados. Veja em <a href="/convenios">Convênios</a>.</p>
`.trim(),
  },

  // 7
  {
    slug: "marketing-local-loja-construcao",
    title: "Marketing local: como atrair clientes da sua região para sua loja",
    excerpt:
      "Anúncio nacional não funciona. Quem fatura no varejo de construção é quem domina o raio de 5 km. Veja como.",
    coverImage: COVER("photo-1432888622747-4eb9a8efeb07"),
    author: "Marketing ACOMAC",
    tags: "marketing, local, mídia, redes sociais",
    category: "Marketing",
    readTime: "6 min",
    published: true,
    featured: false,
    publishedAt: new Date("2026-03-22T11:00:00Z"),
    content: `
<p>O cliente da sua loja mora a até <strong>5 quilômetros</strong> dela. Em obra grande, esse raio chega a 12 km. Em obra pequena (a maioria do seu faturamento), não passa de 5. Esse é o seu mercado real.</p>

<p>Investir em mídia que sai do raio é desperdício. O segredo do marketing para varejo de construção é <strong>dominar a vizinhança</strong>.</p>

<h2>Google Meu Negócio é seu maior ativo</h2>

<p>É grátis. É o primeiro lugar onde quem busca "loja de material de construção" vai parar. E a maioria dos associados não dedica 2 horas por mês para isso.</p>

<p>O que é essencial estar 100%:</p>

<ul>
  <li><strong>Foto de fachada</strong> recente e de qualidade</li>
  <li><strong>10+ fotos internas</strong> mostrando seções e mostruário</li>
  <li><strong>Horário correto</strong> (incluindo feriados)</li>
  <li><strong>Telefone</strong> que toca de verdade</li>
  <li><strong>Postagens semanais</strong> com produto, dica ou novidade</li>
  <li><strong>Resposta a 100% das avaliações</strong> em até 48h</li>
</ul>

<img src="${INLINE("photo-1559136555-9303baea8ebd")}" alt="Profissional usando celular em loja" />

<blockquote>Lojas com perfil bem mantido no Google têm em média <strong>3,2x mais cliques no botão "como chegar"</strong> que perfis abandonados. Esse clique vira visita física.</blockquote>

<h2>Instagram local, não nacional</h2>

<p>Esquece de tentar viralizar com vídeo de pintura criativa que vai bombar no Brasil inteiro. Foca em conteúdo que <strong>quem mora perto reconhece</strong>:</p>

<ul>
  <li>Antes e depois de obra do bairro</li>
  <li>Pedreiro local depoimentando sobre produto</li>
  <li>Equipe da loja em ação real</li>
  <li>Eventos da comunidade que sua loja apoia</li>
</ul>

<p>A meta não é ter 100 mil seguidores. É ter <strong>2 mil seguidores que moram a 5 km</strong>. Isso é ouro.</p>

<h2>WhatsApp: o canal mais subutilizado</h2>

<p>Quase todo cliente do nosso setor usa WhatsApp. Quase nenhuma loja usa o WhatsApp Business com método.</p>

<p>O básico que toda loja deveria ter:</p>

<ol>
  <li><strong>Catálogo</strong> com 20-50 produtos principais e preço</li>
  <li><strong>Resposta automática</strong> de boas-vindas com horário e tempo de resposta</li>
  <li><strong>Mensagem fora do expediente</strong> direcionando para próximo turno</li>
  <li><strong>Etiquetas</strong> para classificar leads (orçamento, pedreiro, projeto)</li>
  <li><strong>Listas de transmissão</strong> segmentadas por interesse</li>
</ol>

<img src="${INLINE("photo-1556761175-5973dc0f32e7")}" alt="Tela de celular com aplicativo de mensagens" />

<h2>Mídia paga: faça pequena e bem</h2>

<p>Google Ads e Meta Ads funcionam — desde que você segmente por <strong>raio geográfico apertado</strong>. As regras:</p>

<ul>
  <li>Raio máximo de <strong>8 km</strong> ao redor da loja</li>
  <li>Orçamento mensal entre <strong>R$ 800 e R$ 2.500</strong> para começar</li>
  <li>Foco em palavras-chave específicas, não genéricas</li>
  <li>Anúncio com <strong>botão de WhatsApp</strong>, não só link</li>
</ul>

<hr/>

<h2>O 5x5 mensal</h2>

<p>Plano simples para quem nunca trabalhou marketing local:</p>

<ol>
  <li><strong>5 postagens</strong> no Google Meu Negócio</li>
  <li><strong>5 publicações</strong> no Instagram (mix de carrossel, story, reels)</li>
  <li><strong>5 listas</strong> de transmissão segmentadas no WhatsApp</li>
  <li><strong>5 avaliações</strong> novas pedidas a clientes satisfeitos</li>
  <li><strong>5 horas</strong> de tempo dedicado ao marketing por semana (uma diária)</li>
</ol>

<p>É pouco? É. Mas é mais do que 90% das lojas do nosso setor faz hoje. Em 6 meses, a diferença na geração de leads é gritante.</p>

<h2>Conecta Associados como vitrine local</h2>

<p>Não esqueça que sua loja, sendo associada, ganha automaticamente um perfil público no <a href="/conecta-associados">Conecta Associados</a>. É um canal extra de descoberta que ranqueia bem no Google e gera leads qualificados — sem custo adicional.</p>
`.trim(),
  },

  // 8
  {
    slug: "conecta-associados-vitrine-acomac",
    title: "Conecta Associados: como a vitrine da ACOMAC ajuda sua loja a vender mais",
    excerpt:
      "A nova vitrine pública da ACOMAC já gerou mais de 1.200 leads para associados. Veja como aproveitar 100% do recurso.",
    coverImage: COVER("photo-1521791136064-7986c2920216"),
    author: "Equipe Comunicação ACOMAC",
    tags: "conecta, associados, vitrine, leads",
    category: "Institucional",
    readTime: "5 min",
    published: true,
    featured: false,
    publishedAt: new Date("2026-03-19T16:00:00Z"),
    content: `
<p>Lançado em janeiro de 2026, o <strong>Conecta Associados</strong> virou rapidamente um dos canais mais ativos para os associados ACOMAC. Em apenas três meses, a vitrine pública gerou mais de 1.200 contatos diretos para empresas listadas.</p>

<p>Para quem ainda não cadastrou ou subutiliza o perfil, vale entender o que ele faz e como tirar o máximo proveito.</p>

<h2>O que é, na prática</h2>

<p>É uma página pública dentro do site da ACOMAC onde cada associado tem um <strong>cartão completo</strong> com:</p>

<ul>
  <li>Logo e capa da empresa</li>
  <li>Nome, segmento, descrição</li>
  <li>Endereço, horário de atendimento, status "aberto agora"</li>
  <li>Botões de WhatsApp, Instagram, ligação e localização no mapa</li>
  <li>Tags de produtos e website</li>
</ul>

<p>Filtros por categoria e busca por nome/produto/cidade ajudam o visitante a encontrar exatamente o que precisa.</p>

<img src="${INLINE("photo-1556909114-f6e7ad7d3136")}" alt="Notebook aberto mostrando catálogo de empresas" />

<h2>Por que funciona</h2>

<p>Três fatores tornam o Conecta diferente de listar a empresa em qualquer outro diretório:</p>

<h3>1. Posicionamento orgânico</h3>

<p>O site da ACOMAC tem 14 anos de presença no Google. Páginas de associados aparecem nas primeiras posições para buscas como "loja de tinta em Joinville" ou "material elétrico Jaraguá do Sul". Isso é difícil de conseguir individualmente.</p>

<h3>2. Selo de credibilidade</h3>

<p>Estar na vitrine sinaliza para o visitante que a empresa é <strong>verificada e ativa</strong>. Em um setor com muito anúncio falso e empresa fantasma, isso pesa na decisão.</p>

<h3>3. Contato direto, sem intermediário</h3>

<p>O cliente clica no WhatsApp e fala com a sua loja. Não passa por marketplace que cobra comissão. Não vira lead vendido para 5 concorrentes. <strong>É contato 1:1.</strong></p>

<blockquote>Em 90 dias de operação, 38% dos associados cadastrados receberam pelo menos 5 contatos pelo botão de WhatsApp do perfil. — Estatística interna ACOMAC, mar/2026</blockquote>

<h2>Como aproveitar 100%</h2>

<p>Cadastrar é só o primeiro passo. Quem realmente colhe lead faz isso:</p>

<img src="${INLINE("photo-1553413077-190dd305871c")}" alt="Loja de material de construção com produtos organizados" />

<h3>Capa que conta a história</h3>

<p>Use uma foto da fachada, da equipe ou do showroom. <strong>Evite logo gigante na capa</strong> — a logo já aparece sobreposta automaticamente. A capa é onde o cliente sente "como é entrar na sua loja".</p>

<h3>Descrição que vende</h3>

<p>Ninguém lê 5 parágrafos. Em 2 frases, responda: <strong>quem você é</strong>, <strong>o que faz de melhor</strong> e <strong>quem é seu cliente</strong>. Use linguagem direta, sem clichê.</p>

<h3>Tags de produtos certas</h3>

<p>O campo "produtos" alimenta a busca interna. Liste 5 a 7 itens principais separados por vírgula. Pense no que o cliente digita quando procura — e não no nome técnico do catálogo.</p>

<h3>Horário de atendimento</h3>

<p>Mantenha o horário sempre atualizado. O selo "Aberto agora" no card aumenta a taxa de clique no WhatsApp em <strong>quase 3x</strong>. Cliente que vê "fechado" muitas vezes nem manda mensagem.</p>

<hr/>

<h2>Como o cliente chega até você</h2>

<p>Os 4 caminhos principais que geram contato hoje:</p>

<ol>
  <li><strong>Busca Google</strong> que cai na página do Conecta com filtro pré-aplicado</li>
  <li><strong>Navegação direta</strong> dentro do site da ACOMAC (associados que viram clientes)</li>
  <li><strong>Compartilhamento</strong> do link do perfil em grupos de WhatsApp e redes</li>
  <li><strong>Indicação</strong> de outros associados parceiros</li>
</ol>

<h2>Aprovação rápida</h2>

<p>O cadastro é feito em um formulário rápido. A equipe da ACOMAC analisa em até 2 dias úteis e o perfil entra no ar. Lembrando que o Conecta é <strong>exclusivo para associados em dia</strong>.</p>

<p>Se ainda não cadastrou, comece agora pela <a href="/conecta-associados">página do Conecta</a>. Se já está cadastrado mas o perfil está "sem graça", revise as 4 dicas acima — em 30 minutos, você multiplica suas chances de gerar negócio.</p>
`.trim(),
  },

  // 9
  {
    slug: "reformas-construcao-aquece-mercado-2026",
    title: "Reformas e construção: o que vai aquecer o mercado em 2026",
    excerpt:
      "Programa habitacional, taxa de juros e crédito imobiliário: o tripé que define o seu segundo semestre.",
    coverImage: COVER("photo-1503387762-592deb58ef4e"),
    author: "Análise Setorial ACOMAC",
    tags: "mercado, construção, reforma, MCMV, juros",
    category: "Mercado",
    readTime: "6 min",
    published: true,
    featured: false,
    publishedAt: new Date("2026-03-15T08:00:00Z"),
    content: `
<p>O segundo semestre de 2026 desenha um cenário <strong>moderadamente positivo</strong> para o varejo de material de construção em SC. Três variáveis sustentam a previsão e vale entender cada uma para se preparar.</p>

<h2>1. Minha Casa Minha Vida 4.0 em ritmo cheio</h2>

<p>Após o lançamento em 2024 e a fase de ajustes em 2025, o programa entrou em ritmo de produção em 2026. As metas para o ano:</p>

<ul>
  <li><strong>2 milhões de unidades</strong> contratadas até dezembro</li>
  <li><strong>R$ 100 bilhões</strong> em financiamento via FGTS</li>
  <li><strong>Faixas 1 e 2</strong> respondem por 73% das contratações</li>
</ul>

<p>Em SC, isso se traduz em mais de 38 mil unidades contratadas — concentradas em Joinville, Itajaí, São José e Lages. <strong>Esse é dinheiro que vai parar em loja de material de construção</strong> nos 18 meses seguintes ao financiamento.</p>

<img src="${INLINE("photo-1503387762-592deb58ef4e")}" alt="Construção residencial em andamento" />

<h2>2. Taxa Selic em queda gradual</h2>

<p>O ciclo de queda da Selic, iniciado no quarto trimestre de 2025, deve continuar em 2026. A projeção do mercado:</p>

<ul>
  <li><strong>Junho/2026</strong> — Selic em 9,75%</li>
  <li><strong>Setembro/2026</strong> — Selic em 9,00%</li>
  <li><strong>Dezembro/2026</strong> — Selic entre 8,25% e 8,75%</li>
</ul>

<p>Selic mais baixa = crédito imobiliário mais barato = mais financiamento aprovado. O efeito chega ao varejo de construção <strong>com 60 a 90 dias de defasagem</strong>. Quem está pensando em estoque para o último trimestre, esse é o sinal.</p>

<blockquote>Cada ponto percentual de queda na Selic libera, em SC, cerca de R$ 1,4 bilhão a mais em financiamento imobiliário no ano seguinte. Boa parte vira material de construção.</blockquote>

<h2>3. Mercado de reforma seguindo forte</h2>

<p>Mesmo sem o impulso do MCMV, o mercado de reforma cresceu em todos os anos desde 2020. As razões estruturais permanecem:</p>

<ul>
  <li>Estoque de imóveis usados grande, exigindo modernização</li>
  <li>Cultura de "renovar para vender" se consolidou</li>
  <li>Home office que veio para ficar ainda gera obras pontuais</li>
  <li>Envelhecimento da população exige adaptações de acessibilidade</li>
</ul>

<img src="${INLINE("photo-1571055107559-3e67626fa8be")}" alt="Profissional aplicando tinta em parede de reforma" />

<h2>O que sobe, o que cai</h2>

<p>Olhando categoria por categoria, a expectativa para o segundo semestre:</p>

<h3>Categorias em alta</h3>

<ul>
  <li><strong>Cerâmica e porcelanato</strong> — alta de 7% a 11% projetada</li>
  <li><strong>Tintas premium</strong> — pico no terceiro trimestre</li>
  <li><strong>Hidráulica</strong> — elevação consistente por reforma de banheiro</li>
  <li><strong>Iluminação LED</strong> — demanda contínua por substituição</li>
</ul>

<h3>Categorias em estabilidade</h3>

<ul>
  <li><strong>Cimento e argamassa</strong> — crescimento moderado</li>
  <li><strong>Estruturais</strong> (vergalhão, ferro) — preço estável após oscilações</li>
</ul>

<h3>Categorias com risco</h3>

<ul>
  <li><strong>Esquadrias importadas</strong> — câmbio mantém preço alto</li>
  <li><strong>Acabamentos premium importados</strong> — mesma dinâmica</li>
</ul>

<hr/>

<h2>Como preparar a operação</h2>

<p>Quatro ações para os próximos 60 dias:</p>

<ol>
  <li><strong>Estoque de Curva A</strong> reforçado para evitar ruptura no pico</li>
  <li><strong>Negociação de preço</strong> com fornecedores antes da pressão de demanda</li>
  <li><strong>Linha de crédito</strong> aprovada e pronta para uso (não na hora do aperto)</li>
  <li><strong>Equipe treinada</strong> em atendimento consultivo para captar o cliente novo</li>
</ol>

<p>Lojas que se anteciparam aos ciclos de alta nos últimos 5 anos cresceram em média <strong>2,3x mais</strong> que lojas que reagiram só quando o movimento já tinha começado. Velho ditado: <em>quem chega na hora certa, chega tarde</em>.</p>

<h2>Onde se aprofundar</h2>

<p>A ACOMAC publica trimestralmente o <strong>Relatório Setorial</strong> com dados detalhados por categoria, microrregião e perfil de obra. Disponível na área restrita do associado. Em junho sai a próxima edição com projeções fechadas para o segundo semestre.</p>
`.trim(),
  },

  // 10
  {
    slug: "compliance-fiscal-loja-construcao-2026",
    title: "Compliance e fiscal: o que toda loja de construção precisa saber em 2026",
    excerpt:
      "Reforma tributária, NF-e 4.0, ICMS-ST e EFD-Reinf. As mudanças que entram em vigor neste ano e como sua loja deve se preparar.",
    coverImage: COVER("photo-1450101499163-c8848c66ca85"),
    author: "Departamento Jurídico ACOMAC",
    tags: "fiscal, compliance, reforma tributária, ICMS",
    category: "Gestão",
    readTime: "8 min",
    published: true,
    featured: false,
    publishedAt: new Date("2026-03-10T07:30:00Z"),
    content: `
<p>2026 é um ano de inflexão fiscal no Brasil. A Reforma Tributária, aprovada em 2023, começa a entrar em fase de teste. E somam-se a isso pelo menos quatro mudanças relevantes que afetam diretamente o varejo de material de construção. Entender o que muda e como se preparar é diferença entre crescer ou apanhar de multa.</p>

<h2>1. Reforma Tributária — fase de teste do CBS e IBS</h2>

<p>Em 2026, começa a fase de testes do <strong>CBS (Contribuição sobre Bens e Serviços)</strong> e do <strong>IBS (Imposto sobre Bens e Serviços)</strong>, com alíquota simbólica de 0,9% e 0,1% respectivamente. Não há recolhimento, mas há <strong>obrigação de informação</strong> nas notas.</p>

<img src="${INLINE("photo-1450101499163-c8848c66ca85")}" alt="Documentos fiscais e calculadora sobre mesa" />

<p>O que sua loja precisa fazer:</p>

<ul>
  <li><strong>Atualizar o ERP</strong> ou sistema fiscal para emitir os novos campos</li>
  <li><strong>Treinar a equipe contábil</strong> sobre os novos códigos</li>
  <li><strong>Acompanhar mensalmente</strong> os ajustes que a Receita publica</li>
</ul>

<p>O <strong>recolhimento real</strong> só começa em 2027 (CBS) e 2029 (IBS). Mas quem não testar em 2026 vai sofrer no primeiro mês de cobrança real.</p>

<h2>2. ICMS-ST em SC — ajustes na MVA setorial</h2>

<p>A Margem de Valor Agregado (MVA) usada para calcular o ICMS-ST de materiais de construção em SC foi <strong>revisada em janeiro/2026</strong>. As principais mudanças:</p>

<ul>
  <li><strong>Cimento</strong> — MVA reduzida de 38% para 34%</li>
  <li><strong>Tintas e vernizes</strong> — MVA aumentada de 42% para 47%</li>
  <li><strong>Materiais hidráulicos</strong> — MVA mantida em 39%</li>
  <li><strong>Esquadrias</strong> — MVA elevada de 31% para 36%</li>
</ul>

<blockquote>Lojas que não atualizaram a tabela de MVA em janeiro estão pagando ICMS-ST a mais ou a menos sem perceber. Em ambos os casos, é problema na próxima fiscalização.</blockquote>

<h2>3. NF-e 4.0 — leiaute novo obrigatório</h2>

<p>O leiaute 4.0 da Nota Fiscal Eletrônica passa a ser <strong>obrigatório a partir de 01/07/2026</strong> em SC. As principais mudanças que afetam o varejo:</p>

<ul>
  <li>Novos campos para identificação do destinatário (CPF/CNPJ + IE)</li>
  <li>Detalhamento maior de tributos por item</li>
  <li>Validação de GTIN obrigatória para itens nacionalizados</li>
  <li>Campos para informação do CBS e IBS (mesmo sem recolhimento)</li>
</ul>

<p>ERPs sérios já lançaram a atualização. Se a sua loja ainda usa sistema "alternativo" ou planilha, <strong>essa é a hora de migrar</strong>.</p>

<img src="${INLINE("photo-1554224155-6726b3ff858f")}" alt="Computador exibindo planilha financeira" />

<h2>4. EFD-Reinf — escrituração de retenções</h2>

<p>A obrigação se estendeu em 2026 para <strong>todas as empresas</strong>, incluindo as do Simples Nacional acima de R$ 1,2 milhão de faturamento anual.</p>

<p>O que precisa ser escriturado mensalmente:</p>

<ul>
  <li>Retenções de Contribuição Previdenciária na cessão de mão de obra</li>
  <li>Retenções de IR sobre serviços de terceiros</li>
  <li>Pagamentos a beneficiários no exterior</li>
  <li>Comercialização da produção rural (não se aplica à maioria)</li>
</ul>

<p>O envio é obrigatório <strong>até o dia 15 do mês seguinte</strong>. Multa por atraso é de R$ 500 + 0,5% sobre o valor das operações por mês.</p>

<h2>5. Substituição de notas — cuidado novo</h2>

<p>A Receita Federal apertou em 2026 a fiscalização sobre <strong>cancelamento e substituição de notas fiscais</strong>. Limites práticos:</p>

<ul>
  <li>Cancelamento permitido em até <strong>24 horas</strong> da emissão</li>
  <li>Substituição (carta de correção) em até <strong>30 dias</strong></li>
  <li>Acima disso, exige justificativa formal e pode gerar revisão fiscal</li>
</ul>

<hr/>

<h2>Calendário fiscal 2026 que você não pode esquecer</h2>

<p>As datas críticas para o varejo de construção:</p>

<ul>
  <li><strong>20/Jan</strong> — Atualização da tabela de MVA (já passou)</li>
  <li><strong>15/Mai</strong> — Primeira EFD-Reinf consolidada do ano</li>
  <li><strong>01/Jul</strong> — NF-e 4.0 obrigatória</li>
  <li><strong>30/Set</strong> — Adesão ao Simples para 2027 (se aplicável)</li>
  <li><strong>20/Dez</strong> — DEFIS (Declaração Anual do Simples)</li>
</ul>

<h2>Boas práticas que reduzem risco</h2>

<ol>
  <li><strong>Backup mensal</strong> de XMLs e DANFEs (mantenha por 5 anos)</li>
  <li><strong>Conciliação fiscal mensal</strong> entre o que vendeu e o que recolheu</li>
  <li><strong>Auditoria interna</strong> trimestral nas operações de ICMS-ST</li>
  <li><strong>Reunião com contabilidade</strong> obrigatória todo mês</li>
  <li><strong>Atualização de ERP</strong> a cada 6 meses, no mínimo</li>
</ol>

<h2>Onde buscar ajuda</h2>

<p>A ACOMAC mantém um <strong>plantão jurídico-fiscal gratuito</strong> para associados todas as quintas-feiras de 14h às 17h. Marcação pelo telefone da sede.</p>

<p>Para questões mais complexas, a associação tem 3 escritórios de contabilidade credenciados com condições especiais. Veja em <a href="/convenios">Convênios</a>.</p>

<p>Em ano de mudança fiscal, <strong>melhor pagar consultoria de R$ 800 do que multa de R$ 80 mil</strong>.</p>
`.trim(),
  },
];

async function main() {
  let created = 0;
  let updated = 0;
  for (const p of posts) {
    const existing = await prisma.blogPost.findUnique({ where: { slug: p.slug } });
    if (existing) {
      await prisma.blogPost.update({ where: { slug: p.slug }, data: p });
      updated++;
      console.log(`✏️  Atualizado: ${p.slug}`);
    } else {
      await prisma.blogPost.create({ data: p });
      created++;
      console.log(`✅ Criado:    ${p.slug}`);
    }
  }
  console.log(`\nDone. Criados: ${created}, Atualizados: ${updated}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
