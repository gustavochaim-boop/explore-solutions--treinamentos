import { Course, Module, Lesson } from '../types';

export interface CustomModuleSpec {
  title: string;
  subtitle: string;
  badge?: string;
  description?: string;
}

export interface CreateCourseOptions {
  title: string;
  subtitle: string;
  workloadHours: number;
  targetAudience: string;
  instructorName: string;
  instructorRole: string;
  instructorCredential: string;
  regulatoryFramework: string[];
  description: string;
  preset: 'standard_audit' | 'maritime_compliance' | 'hse_safety' | 'custom_modules';
  thematicProfileTitle?: string;
  thematicProfileFocus?: string;
  thematicProfileFileName?: string;
  moduleMode?: 'suggested' | 'custom';
  customModuleCount?: number;
  customModulesList?: CustomModuleSpec[];
  includeFinalExam?: boolean;
}

/**
 * Returns a customizable template list of modules according to preset and desired count.
 */
export function getDefaultCustomModules(
  preset: 'standard_audit' | 'maritime_compliance' | 'hse_safety' | 'custom_modules',
  count: number = 6
): CustomModuleSpec[] {
  const isMaritime = preset === 'maritime_compliance';

  const baseMaritime: CustomModuleSpec[] = [
    {
      title: 'Origem, Evolução e Arcabouço Jurídico Mandatório',
      subtitle: 'Convenções Internacionais, Autoridade Marítima e Responsabilidade dos Armadores',
      badge: 'Fundamentos Marítimos',
      description: 'Estrutura legal internacional (IMO, SOLAS, MARPOL, STCW), competências da Autoridade Marítima e Sociedades Classificadoras.'
    },
    {
      title: 'Gestão de Riscos Náuticos, Operacionais e Proteção Ambiental',
      subtitle: 'Avaliação de Riscos Operacionais e Barreiras Críticas de Prevenção',
      badge: 'Gestão de Riscos',
      description: 'Metodologias de Análise de Risco (APR/HAZID), gerenciamento de mudanças (MOC) e salvaguardas para prevenção da poluição.'
    },
    {
      title: 'Integridade Mecânica e Manutenção de Equipamentos Críticos',
      subtitle: 'Inspeção de Itens Vitais de Salvatagem, Máquinas e Navegação',
      badge: 'Integridade & Manutenção',
      description: 'Verificação da integridade de sistemas de propulsão, governo, combate a incêndio e salvatagem.'
    },
    {
      title: 'Preparação para Emergências e Exercícios Simulados',
      subtitle: 'Planos de Contingência, Resposta Rápida e Resgate',
      badge: 'Planos de Emergência',
      description: 'Auditoria dos cronogramas de exercícios simulados, registros de faina e tempo de resposta.'
    },
    {
      title: 'Técnicas de Auditoria em Campo, Evidências e Relatórios',
      subtitle: 'Condução Conforme ISO 19011, Amostragem e Não-Conformidades',
      badge: 'Metodologia de Auditoria',
      description: 'Técnicas de entrevista, coleta de evidências físicas e documentais e emissão do Relatório de Auditoria.'
    },
    {
      title: 'Reunião de Encerramento, Planos de Ação e Exame Final',
      subtitle: 'Acompanhamento de Ações Corretivas e Avaliação de Competências',
      badge: 'Certificação & Exame',
      description: 'Fechamento dos trabalhos, definição de prazos para CAPA e realização da avaliação de qualificação profissional.'
    },
    {
      title: 'Inspeção Avançada de Sistemas de Navegação e Comunicação',
      subtitle: 'GMDSS, ECDIS, Radar ARPA e Registro de Dados de Viagem (VDR)',
      badge: 'Tecnologia Náutica',
      description: 'Verificação da confiabilidade dos equipamentos de navegação e integridade dos registros de bordo.'
    },
    {
      title: 'Auditoria de Fornecedores, Docagem e Manutenção em Estaleiro',
      subtitle: 'Qualificação de Prestadores de Serviço e Supervisão em Dique',
      badge: 'Cadeia de Suprimentos',
      description: 'Critérios de auditoria para serviços de docagem seca, reparos navais e homologação de subcontratados.'
    },
    {
      title: 'Prevenção da Poluição e Gestão de Resíduos (MARPOL Anexos I a VI)',
      subtitle: 'Livro Registro de Óleo, Resíduos Químicos e Emissões Atmosféricas',
      badge: 'Gestão Ambiental',
      description: 'Auditoria do cumprimento rigoroso das convenções ambientais marítimas e controle de descargas.'
    },
    {
      title: 'Fatores Humanos, Fadiga e Gestão da Segurança a Bordo',
      subtitle: 'Código STCW, Convenção MLC 2006 e Bem-Estar da Tripulação',
      badge: 'Recursos Humanos',
      description: 'Auditoria das horas de descanso, qualificação profissional e prevenção de falhas humanas na operação.'
    }
  ];

  const baseStandard: CustomModuleSpec[] = [
    {
      title: 'Fundamentos Normativos, Marco Legal e Postura do Auditor Líder',
      subtitle: 'Diretrizes Estratégicas, Governança Técnica e Postura Ética',
      badge: 'Fundamentos & Ética',
      description: 'Construção da base de liderança, competências comportamentais e entendimento dos princípios fundamentais de auditoria segundo a ISO 19011:2026.'
    },
    {
      title: 'Interpretação Avançada de Requisitos e Controle de Riscos',
      subtitle: 'Avaliação de Riscos Operacionais, Salvaguardas e Conformidade Legal',
      badge: 'Interpretação Técnica',
      description: 'Análise profunda dos requisitos normativos mandatórios, identificação de perigos, aspectos e impactos significativos.'
    },
    {
      title: 'Planejamento de Auditoria, Plano de Amostragem e Cronograma',
      subtitle: 'Definição de Escopo, Equipe Auditora e Recursos Técnicos',
      badge: 'Planejamento Estratégico',
      description: 'Desenvolvimento do plano de auditoria, matriz de responsabilidades, amostragem estatística e logística operacional.'
    },
    {
      title: 'Condução em Campo, Entrevistas e Triangulação de Evidências',
      subtitle: 'Coleta de Evidências Objetivas, Verificação Prática e Entrevistas Técnicas',
      badge: 'Execução em Campo',
      description: 'Execução da auditoria nas frentes de trabalho, inspeção de instalações, aplicação de listas de verificação e formulação de perguntas assertivas.'
    },
    {
      title: 'Constatação de Não-Conformidades, Relatório Final & Planos CAPA',
      subtitle: 'Redação Precisa de Desvios, Análise de Causa-Raiz e Ações Corretivas',
      badge: 'Relatórios & CAPA',
      description: 'Formulação técnica de não-conformidades (Evidência + Critério Normativo + Desvio), avaliação da causa-raiz e estruturação do relatório executivo.'
    },
    {
      title: 'Reunião de Encerramento, Eficácia das Ações e Exame Final',
      subtitle: 'Apresentação dos Resultados, Follow-up e Homologação Profissional',
      badge: 'Certificação & Exame',
      description: 'Protocolos de encerramento da missão de auditoria, análise de eficácia de ações corretivas e realização do exame de qualificação profissional.'
    },
    {
      title: 'Gestão de Mudanças (MOC) e Auditoria de Processos Críticos',
      subtitle: 'Salvaguardas de Integridade e Mitigação de Riscos Operacionais',
      badge: 'Gestão de Mudanças',
      description: 'Auditoria de procedimentos de MOC para alterações de processos, equipamentos e estruturas organizacionais.'
    },
    {
      title: 'Auditorias Remotas, Tecnologias Digitais e Análise de Dados',
      subtitle: 'Uso de Ferramentas Digitais, Cibersegurança e Amostragem Analítica',
      badge: 'Auditoria Digital',
      description: 'Metodologias de auditoria híbrida e remota com uso de dados em tempo real, drones e plataformas em nuvem.'
    },
    {
      title: 'Governança ESG, Sustentabilidade e Transição Energética',
      subtitle: 'Métricas Ambientais, Sociais e de Governança nos Sistemas de Gestão',
      badge: 'Sustentabilidade ESG',
      description: 'Auditoria de indicadores de sustentabilidade, descarbonização e impacto social nas organizações.'
    },
    {
      title: 'Investigação de Incidentes, Quase-Acidentes e Lições Aprendidas',
      subtitle: 'Metodologias de Árvore de Causas e Prevenção de Recorrências',
      badge: 'Investigação de Incidentes',
      description: 'Auditoria dos relatórios de investigação de incidentes e verificação da implementação de lições aprendidas.'
    },
    {
      title: 'Liderança Operacional, Fatores Humanos e Cultura Justa',
      subtitle: 'Engajamento de Equipes e Tomada de Decisão sob Pressão',
      badge: 'Fatores Humanos',
      description: 'Avaliação da maturidade da cultura de segurança e comportamento dos líderes na linha de frente.'
    },
    {
      title: 'Simulado Prático Avançado e Homologação de Auditor Sênior',
      subtitle: 'Banca Examinadora, Resolução de Casos Complexos e Certificação',
      badge: 'Banca Examinadora',
      description: 'Defesa de relatórios de auditoria e resolução de conflitos em cenários simulados de alta complexidade.'
    }
  ];

  const pool = isMaritime ? baseMaritime : baseStandard;

  if (count <= pool.length) {
    const sliced = pool.slice(0, count);
    // Ensure the last module has a certification/exam note if count > 1
    if (count > 1) {
      const last = { ...sliced[sliced.length - 1] };
      if (!last.title.toLowerCase().includes('exame') && !last.title.toLowerCase().includes('avaliação')) {
        last.badge = 'Certificação & Homologação';
      }
      sliced[sliced.length - 1] = last;
    }
    return sliced;
  }

  // If count exceeds pool length, generate dynamic extras
  const result: CustomModuleSpec[] = [...pool];
  for (let i = pool.length + 1; i <= count; i++) {
    result.push({
      title: `Módulo Especializado ${i}: Tópicos Avançados de Auditoria`,
      subtitle: 'Diretrizes Técnicas, Casos de Estudo e Evidências Mandatórias',
      badge: 'Especialização Avançada',
      description: `Conteúdo técnico aprofundado, diretrizes de verificação em campo e requisitos aplicáveis ao módulo ${i}.`
    });
  }
  return result;
}

/**
 * Generates a complete set of modules formatted in accordance with
 * existing platform courses (ISO 19011, SGSO, ISM Code).
 */
export function generateStandardModules(prefix: string, preset: CreateCourseOptions['preset']): Module[] {
  const timestamp = Date.now();

  if (preset === 'maritime_compliance') {
    return [
      {
        id: `${prefix}-mod-1`,
        number: 1,
        title: 'Origem, Evolução e Arcabouço Jurídico Mandatório',
        subtitle: 'Convenções Internacionais, Autoridade Marítima e Responsabilidade dos Armadores',
        badge: 'Fundamentos Marítimos',
        description: 'Estrutura legal internacional (IMO, SOLAS, MARPOL, STCW), competências da Autoridade Marítima e Sociedades Classificadoras.',
        educationalVideos: [
          {
            id: `vid-${prefix}-1`,
            title: 'Aula Magna: Governança Marítima e Segurança da Navegação',
            description: 'Conceitos centrais de conformidade legal e responsabilidades da alta direção marítima.',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            durationMinutes: 30,
            tags: ['Marítimo', 'Regulamentação', 'IMO'],
            addedAt: new Date().toLocaleDateString('pt-BR')
          }
        ],
        lessons: [
          {
            id: `${prefix}-les-1-1`,
            title: 'Marco Regulatório Internacional e Competências Mandatórias',
            durationMinutes: 45,
            summary: 'Compreensão detalhada dos instrumentos regulatórios aplicáveis às embarcações e instalações offshore.',
            technicalDetails: [
              'Hierarquia das normas marítimas e aplicação a bordo de embarcações de apoio e plataformas.',
              'Responsabilidades civis e administrativas perante a Autoridade Marítima (Capitania dos Portos).',
              'O papel das Sociedades Classificadoras na homologação de certificados estatutários e de classe.',
              'Diretrizes de conformidade com o Código ISM, ISPS Code e Convenção MLC 2006.'
            ],
            practicalChecklist: [
              'Conferir a validade dos certificados estatutários na pasta do Comandante.',
              'Verificar o registro de homologação da tripulação perante o STCW / CIR.',
              'Auditar as atas do Comitê de Segurança e Saúde a bordo.'
            ],
            realCaseStudy: {
              title: 'Retenção por Port State Control (PSC) em Terminal de Carga',
              scenario: 'Embarcação retida devido a falhas documentais e extintores de CO2 com inspeção vencida.',
              keyFindings: [
                'Falta de sincronia entre o sistema informatizado em terra e os registros físicos de bordo.',
                'Ausência de auditoria interna prévia nos últimos 12 meses.'
              ],
              correctiveActions: [
                'Implantação de auditorias internas semestrais conduzidas por auditores qualificados.',
                'Auditoria preventiva cruzada entre unidades da mesma frota.'
              ]
            }
          },
          {
            id: `${prefix}-les-1-2`,
            title: 'Estrutura do Sistema de Gestão da Segurança a Bordo (SMS)',
            durationMinutes: 50,
            summary: 'Definição e documentação dos procedimentos mandatórios operacionais e de emergência.',
            technicalDetails: [
              'Política de segurança e proteção ambiental aprovada pelo Armador.',
              'Autoridade e responsabilidade do Comandante (Master’s Overriding Authority).',
              'Canais de comunicação entre a embarcação e a Pessoa Designada em Terra (DPA).'
            ],
            practicalChecklist: [
              'Verificar a declaração formal da autoridade soberana do Comandante assinada pelo armador.',
              'Avaliar o registro das comunicações oficiais com a DPA nos últimos 6 meses.',
              'Checar a rastreabilidade das revisões do manual do SMS a bordo.'
            ]
          }
        ]
      },
      {
        id: `${prefix}-mod-2`,
        number: 2,
        title: 'Gestão de Riscos Náuticos, Operacionais e Proteção Ambiental',
        subtitle: 'Avaliação de Riscos Operacionais e Barreiras Críticas de Prevenção',
        badge: 'Gestão de Riscos',
        description: 'Metodologias de Análise de Risco (APR/HAZID), gerenciamento de mudanças (MOC) e salvaguardas para prevenção da poluição.',
        lessons: [
          {
            id: `${prefix}-les-2-1`,
            title: 'Metodologias de Identificação de Perigos e Análise de Risco (APR)',
            durationMinutes: 45,
            summary: 'Aplicação prática da matriz de risco em operações simultâneas (SIMOPS) e manobras críticas.',
            technicalDetails: [
              'Classificação de probabilidade e severidade segundo normas de classe e ISO 31000.',
              'Barreiras de engenharia vs. barreiras administrativas e comportamentais.',
              'Definição de procedimentos de salvaguarda para trabalho a quente e espaço confinado.'
            ],
            practicalChecklist: [
              'Auditar a Permissão de Trabalho (PT) e Análise Preliminar de Risco (APR) de atividades recentes.',
              'Checar os testes de atmosfera realizados antes de ingressar em espaço confinado.',
              'Verificar os certificados de calibração dos detectores multigás portáteis.'
            ]
          }
        ]
      },
      {
        id: `${prefix}-mod-3`,
        number: 3,
        title: 'Integridade Mecânica e Manutenção de Equipamentos Críticos',
        subtitle: 'Inspeção de Itens Vitais de Salvatagem, Máquinas e Navegação',
        badge: 'Integridade & Manutenção',
        description: 'Verificação da integridade de sistemas de propulsão, governo, combate a incêndio e salvatagem.',
        lessons: [
          {
            id: `${prefix}-les-3-1`,
            title: 'Critérios de Auditoria para Equipamentos Críticos à Segurança',
            durationMinutes: 50,
            summary: 'Auditoria dos planos de manutenção preventiva (PMS) e rotinas de testes de emergência.',
            technicalDetails: [
              'Critérios para definição de equipamentos cuja falha súbita pode gerar acidente maior.',
              'Rotinas de teste do gerador de emergência, bomba de incêndio de emergência e leme manual.',
              'Controle de sobressalentes mandatórios a bordo.'
            ],
            practicalChecklist: [
              'Testar o acionamento automático do gerador de emergência em blackout simulado.',
              'Inspecionar o estado de conservação das balsas salva-vidas e baleeiras.',
              'Confrontar ordens de serviço pendentes no sistema informatizado.'
            ]
          }
        ]
      },
      {
        id: `${prefix}-mod-4`,
        number: 4,
        title: 'Preparação para Emergências e Exercícios Simulados',
        subtitle: 'Planos de Contingência, Resposta Rápida e Resgate',
        badge: 'Planos de Emergência',
        description: 'Auditoria dos cronogramas de exercícios simulados, registros de faina e tempo de resposta.',
        lessons: [
          {
            id: `${prefix}-les-4-1`,
            title: 'Planejamento e Execução de Exercícios Simulados Periódicos',
            durationMinutes: 40,
            summary: 'Verificação da eficácia e frequência dos treinamentos práticos da tripulação.',
            technicalDetails: [
              'Tabela de fainas de emergência (Muster List) e atribuições individuais.',
              'Exercícios mandatórios de abandono de embarcação, combate a incêndio e homem ao mar.',
              'Lições aprendidas e revisão dos planos de resposta a emergência.'
            ],
            practicalChecklist: [
              'Verificar a atualização da Tabela de Fainas nos corredores e camarotes.',
              'Avaliar o Livro Registro de Exercícios e Simulados (Drill Logbook).',
              'Entrevistar tripulantes aleatórios sobre sua função na faina de emergência.'
            ]
          }
        ]
      },
      {
        id: `${prefix}-mod-5`,
        number: 5,
        title: 'Técnicas de Auditoria em Campo, Evidências e Relatórios',
        subtitle: 'Condução Conforme ISO 19011, Amostragem e Não-Conformidades',
        badge: 'Metodologia de Auditoria',
        description: 'Técnicas de entrevista, coleta de evidências físicas e documentais e emissão do Relatório de Auditoria.',
        lessons: [
          {
            id: `${prefix}-les-5-1`,
            title: 'Entrevistas, Amostragem e Redação de Constatações',
            durationMinutes: 55,
            summary: 'Como conduzir auditorias a bordo respeitando a rotina operacional da tripulação.',
            technicalDetails: [
              'Princípios da ISO 19011: integridade, apresentação justa, confidencialidade e abordagem baseada em risco.',
              'Classificação de não-conformidades: Não-Conformidade Maior, Menor e Oportunidade de Melhoria.',
              'Estruturação da evidência objetiva sem juízo de valor pessoal.'
            ],
            practicalChecklist: [
              'Validar a trilha de auditoria através da triangulação: Documento + Entrevista + Observação física.',
              'Registrar desvios com especificação clara do requisito normativo violado.',
              'Apresentar constatações preliminares ao Comandante antes da reunião de encerramento.'
            ]
          }
        ]
      },
      {
        id: `${prefix}-mod-6`,
        number: 6,
        title: 'Reunião de Encerramento, Planos de Ação e Exame Final',
        subtitle: 'Acompanhamento de Ações Corretivas e Avaliação de Competências',
        badge: 'Certificação & Exame',
        description: 'Fechamento dos trabalhos, definição de prazos para CAPA e realização da avaliação de qualificação profissional.',
        lessons: [
          {
            id: `${prefix}-les-6-1`,
            title: 'Reunião de Encerramento e Gestão do Plano de Ação (CAPA)',
            durationMinutes: 45,
            summary: 'Protocolos de encerramento, consenso sobre desvios e monitoramento de eficácia.',
            technicalDetails: [
              'Condução da reunião formal de encerramento com a liderança de bordo.',
              'Critérios para aceitação da análise de causa-raiz e ações corretivas propostas.',
              'Critérios para fechamento de Não-Conformidades Maiores com medidas mitigatórias imediatas.'
            ],
            practicalChecklist: [
              'Colher assinaturas na lista de presença da reunião de encerramento.',
              'Emitir o relatório oficial em até 5 dias úteis com prazos acordados.',
              'Checar o status de eficácia em auditorias de acompanhamento.'
            ]
          },
          {
            id: `${prefix}-les-6-2`,
            title: 'Exame Final de Qualificação de Auditor',
            durationMinutes: 60,
            summary: 'Avaliação teórica e prática simulada para homologação do certificado profissional emitido pelo Gestor.',
            technicalDetails: [
              'Avaliação de conhecimentos em conformidade regulatória e interpretação de requisitos.',
              'Resolução de estudos de caso reais com formulação de parecer técnico de auditoria.'
            ],
            practicalChecklist: [
              'Atingir nota mínima de 70% na avaliação formal da plataforma.',
              'Revisar as justificativas das questões comentadas no sistema.'
            ],
            specialType: 'EXAM'
          }
        ]
      }
    ];
  }

  // Standard Audit Structure (default)
  return [
    {
      id: `${prefix}-mod-1`,
      number: 1,
      title: 'Fundamentos Normativos, Marco Legal e Postura do Auditor Líder',
      subtitle: 'Diretrizes Estratégicas, Governança Técnica e Postura Ética',
      badge: 'Fundamentos & Ética',
      description: 'Construção da base de liderança, competências comportamentais e entendimento dos princípios fundamentais de auditoria segundo a ISO 19011:2026.',
      educationalVideos: [
        {
          id: `vid-${prefix}-1`,
          title: 'Aula Inaugural: O Papel Estratégico do Auditor na Governança Corporativa',
          description: 'Apresentação dos princípios fundamentais da auditoria independente e seu valor na prevenção de acidentes e perdas.',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          durationMinutes: 30,
          tags: ['Auditoria', 'ISO 19011', 'Governança'],
          addedAt: new Date().toLocaleDateString('pt-BR')
        }
      ],
      lessons: [
        {
          id: `${prefix}-les-1-1`,
          title: 'Princípios Universais de Auditoria (ABNT NBR ISO 19011:2026)',
          durationMinutes: 45,
          summary: 'Os sete princípios fundamentais da auditoria e a mentalidade do auditor líder de excelência.',
          technicalDetails: [
            'Integridade, conduta ética e honestidade profissional como pilares inegociáveis.',
            'Apresentação justa: obrigação de relatar com veracidade e exatidão.',
            'Devido cuidado profissional: aplicação de diligência e discernimento no julgamento.',
            'Abordagem baseada em risco: direcionamento dos esforços para áreas de maior criticidade.'
          ],
          practicalChecklist: [
            'Avaliar a independência do auditor em relação à área auditada (ausência de conflito de interesse).',
            'Manter sigilo estrito de dados técnicos, comerciais e operacionais acessados.',
            'Fundamentar todas as opiniões em evidências objetivas e verificáveis.'
          ],
          realCaseStudy: {
            title: 'Conflito de Interesses e Desvio Ético em Auditoria de Sistema',
            scenario: 'Auditor contratado omitiu constatações graves em setor gerenciado por parente direto.',
            keyFindings: [
              'Quebra do princípio de imparcialidade e perda de credibilidade do programa de auditoria.',
              'Sanções contratuais e necessidade de reauditoria independente completa.'
            ],
            correctiveActions: [
              'Instituição de termo obrigatório de declaração de ausência de conflito de interesse antes de cada missão.',
              'Rotatividade mandatória de equipes auditoras.'
            ]
          }
        },
        {
          id: `${prefix}-les-1-2`,
          title: 'Comunicação Assertiva e Inteligência Comportamental',
          durationMinutes: 50,
          summary: 'Habilidades de liderança, gerenciamento de objeções e condução de entrevistas técnicas.',
          technicalDetails: [
            'Técnicas de perguntas abertas, fechadas e de aprofundamento (técnica do funil).',
            'Neutralidade de tom e postura corporal não intimidadora.',
            'Gestão de conflitos e superação de atitudes defensivas dos auditados.'
          ],
          practicalChecklist: [
            'Iniciar entrevistas explicando os objetivos da auditoria para reduzir tensões.',
            'Confirmar o entendimento do auditado antes de registrar anotações formais.',
            'Evitar debates acalorados sobre opiniões pessoais; concentrar-se nos critérios normativos.'
          ]
        }
      ]
    },
    {
      id: `${prefix}-mod-2`,
      number: 2,
      title: 'Interpretação e Análise Crítica dos Requisitos Mandatórios',
      subtitle: 'Compreensão Profunda da Norma e Critérios de Conformidade',
      badge: 'Requisitos Técnicos',
      description: 'Análise detalhada de cláusulas normativas, mapeamento de processos e identificação de requisitos mandatórios e expectativas das partes interessadas.',
      lessons: [
        {
          id: `${prefix}-les-2-1`,
          title: 'Mapeamento de Processos e Contexto da Organização',
          durationMinutes: 50,
          summary: 'Interpretação do escopo do sistema de gestão, partes interessadas e cadeia de valor.',
          technicalDetails: [
            'Alinhamento estratégico do sistema de gestão com o direcionamento do negócio.',
            'Identificação de riscos e oportunidades no macroambiente operacional.',
            'Definição das fronteiras de aplicabilidade do sistema de gestão.'
          ],
          practicalChecklist: [
            'Analisar a matriz SWOT ou análise de contexto formalizada pela alta administração.',
            'Verificar se as necessidades das partes interessadas críticas foram mapeadas.',
            'Conferir a declaração formal do escopo do sistema de gestão.'
          ]
        },
        {
          id: `${prefix}-les-2-2`,
          title: 'Liderança, Política e Comprometimento da Alta Direção',
          durationMinutes: 45,
          summary: 'Como auditar a liderança de topo e comprovar o engajamento com os objetivos estratégicos.',
          technicalDetails: [
            'Disponibilização de recursos humanos, financeiros e tecnológicos adequados.',
            'Comunicação e disseminação da política em todos os níveis hierárquicos.',
            'Integração dos requisitos do sistema de gestão aos processos de negócio rotineiros.'
          ],
          practicalChecklist: [
            'Entrevistar a liderança executiva sobre os objetivos e métricas do sistema.',
            'Checar a rastreabilidade da aprovação da Política pela alta direção.',
            'Validar a prestação de contas dos gestores de processos em reuniões de análise crítica.'
          ]
        }
      ]
    },
    {
      id: `${prefix}-mod-3`,
      number: 3,
      title: 'Planejamento, Escopo e Gestão de Riscos do Programa de Auditoria',
      subtitle: 'Elaboração do Plano de Auditoria, Amostragem e Cronogramas',
      badge: 'Planejamento & Escopo',
      description: 'Metodologia para construção do programa anual, elaboração de listas de verificação (checklists) dinâmicas e planos de amostragem estatística.',
      lessons: [
        {
          id: `${prefix}-les-3-1`,
          title: 'Elaboração do Plano de Auditoria e Seleção da Equipe',
          durationMinutes: 45,
          summary: 'Definição do escopo, critérios, métodos e cronograma detalhado de auditoria.',
          technicalDetails: [
            'Cálculo do tempo de auditoria proporcional à complexidade dos processos.',
            'Composição da equipe auditora e inclusão de especialistas técnicos quando necessário.',
            'Definição dos canais formais de comunicação com o auditado.'
          ],
          practicalChecklist: [
            'Enviar o Plano de Auditoria ao cliente/auditado com antecedência acordada.',
            'Confirmar a disponibilidade dos interlocutores chave nas áreas auditadas.',
            'Preparar listas de verificação com critérios baseados em risco.'
          ]
        }
      ]
    },
    {
      id: `${prefix}-mod-4`,
      number: 4,
      title: 'Execução da Auditoria em Campo, Amostragem e Coleta de Evidências',
      subtitle: 'Técnicas de Investigação, Rastreabilidade e Obtenção de Fatos',
      badge: 'Execução em Campo',
      description: 'Prática de auditoria presencial/remota, triangulação de dados (Documento + Entrevista + Observação) e identificação de evidências objetivas.',
      lessons: [
        {
          id: `${prefix}-les-4-1`,
          title: 'Triangulação de Evidências e Amostragem Representativa',
          durationMinutes: 50,
          summary: 'Como comprovar a conformidade através da consistência entre o que está escrito, falado e executado.',
          technicalDetails: [
            'Princípio da triangulação: confrontar documentos de procedimento, relatos orais e inspeção física.',
            'Técnicas de amostragem por julgamento e amostragem estatística.',
            'Tratamento de evidências conflitantes ou inconclusivas.'
          ],
          practicalChecklist: [
            'Registrar identificação precisa dos registros auditados (número de lote, série, data, responsável).',
            'Tirar fotos ou coletar cópias quando permitido pelas políticas de segurança da informação.',
            'Não tirar conclusões precipitadas com base em amostras isoladas sem aprofundamento.'
          ]
        }
      ]
    },
    {
      id: `${prefix}-mod-5`,
      number: 5,
      title: 'Constatação de Não-Conformidades, Relatório Final & Planos CAPA',
      subtitle: 'Redação Precisa de Desvios, Análise de Causa-Raiz e Ações Corretivas',
      badge: 'Relatórios & CAPA',
      description: 'Formulação técnica de não-conformidades (Evidência + Critério Normativo + Desvio), avaliação da causa-raiz e estruturação do relatório executivo.',
      lessons: [
        {
          id: `${prefix}-les-5-1`,
          title: 'Redação Técnica de Não-Conformidades e Observações',
          durationMinutes: 55,
          summary: 'A fórmula dos três elementos: O Requisito violado, a Evidência objetiva e a Constatação do desvio.',
          technicalDetails: [
            'Classificação adequada de severidade: Maior, Menor ou Oportunidade de Melhoria.',
            'Evitar julgamentos subjetivos ou apontamento de culpados individuais.',
            'Revisão cruzada entre membros da equipe para assegurar consistência.'
          ],
          practicalChecklist: [
            'Verificar se a redação da NC responde com clareza: O que aconteceu? Onde? Com que frequência?',
            'Citar o item exato da norma ou procedimento interno transgredido.',
            'Apresentar as constatações aos auditados para obtenção de concordância quanto aos fatos.'
          ]
        }
      ]
    },
    {
      id: `${prefix}-mod-6`,
      number: 6,
      title: 'Reunião de Encerramento, Eficácia das Ações e Exame Final',
      subtitle: 'Apresentação dos Resultados, Follow-up e Homologação Profissional',
      badge: 'Certificação & Exame',
      description: 'Protocolos de encerramento da missão de auditoria, análise de eficácia de ações corretivas e realização do exame de qualificação profissional.',
      lessons: [
        {
          id: `${prefix}-les-6-1`,
          title: 'Condução da Reunião de Encerramento e Validação do Relatório',
          durationMinutes: 45,
          summary: 'Apresentação formal das conclusões à liderança e estabelecimento do cronograma de CAPA.',
          technicalDetails: [
            'Agradecimento à cooperação da equipe auditada e esclarecimento do método por amostragem.',
            'Apresentação clara dos pontos fortes, oportunidades de melhoria e não-conformidades.',
            'Protocolo formal de entrega e prazos para resposta ao plano de ação.'
          ],
          practicalChecklist: [
            'Colher a assinatura dos presentes na ata formal da reunião de encerramento.',
            'Formalizar o prazo final de entrega do relatório definitivo.',
            'Definir a sistemática de follow-up e comprovação de eficácia das ações corretivas.'
          ]
        },
        {
          id: `${prefix}-les-6-2`,
          title: 'Exame de Qualificação e Certificação Profissional',
          durationMinutes: 60,
          summary: 'Avaliação de proficiência técnica e raciocínio de auditor para validação e emissão do certificado pelo Gestor.',
          technicalDetails: [
            'Exame abrangente de múltipla escolha e análise de cenários práticos de auditoria.',
            'Exigência de pontuação mínima de 70% para aprovação acadêmica formal.'
          ],
          practicalChecklist: [
            'Responder a todas as questões avaliativas com base nos critérios normativos estudados.',
            'Aguardar validação e homologação do certificado pelo Gestor no painel administrativo.'
          ],
          specialType: 'EXAM'
        }
      ]
    }
  ];
}

/**
 * Creates a brand new Course object fully formatted according to platform standards.
 */
export function createFormattedCourse(options: CreateCourseOptions): Course {
  const courseId = `curso-${Date.now()}`;
  let modules: Module[];

  if (options.moduleMode === 'custom') {
    const specs = options.customModulesList && options.customModulesList.length > 0
      ? options.customModulesList
      : getDefaultCustomModules(options.preset, options.customModuleCount || 6);

    modules = specs.map((spec, idx) => {
      const isLastModule = idx === specs.length - 1;
      const modNumber = idx + 1;
      const modId = `${courseId}-mod-${modNumber}`;

      const lessons: Lesson[] = [
        {
          id: `${courseId}-les-${modNumber}-1`,
          title: `Requisitos Técnicos, Evidências e Aplicação Prática em Campo`,
          durationMinutes: 45,
          summary: `Diretrizes técnicas e critérios de conformidade mandatórios relacionados ao tópico: ${spec.title}.`,
          technicalDetails: [
            `Interpretação e critérios normativos aplicáveis ao módulo ${modNumber}: ${spec.title}.`,
            'Metodologia de coleta de evidências objetivas e triangulação em campo.',
            'Confronto rigoroso entre os registros operacionais e os requisitos de auditoria.',
            'Identificação de oportunidades de melhoria e salvaguardas operacionais.'
          ],
          practicalChecklist: [
            `Verificar os procedimentos e registros aplicáveis ao escopo do ${spec.title}.`,
            'Entrevistar os responsáveis operacionais utilizando amostragem estatística e técnica do funil.',
            'Checar a rastreabilidade das evidências e ausência de desvios nas inspeções físicas.'
          ],
          realCaseStudy: {
            title: `Estudo de Caso Real: Desvio Crítico em ${spec.title}`,
            scenario: `Durante inspeção técnica programada, a equipe auditora identificou divergência entre o manual de gestão e a prática operacional observada.`,
            keyFindings: [
              'Ausência de evidência documental comprobatória da conformidade operacional.',
              'Falha na comunicação de salvaguardas técnicas entre os turnos de trabalho.'
            ],
            correctiveActions: [
              'Revisão imediata da rotina de trabalho e implementação de lista de verificação obrigatória.',
              'Treinamento e requalificação dos colaboradores com registro formal na pasta do curso.'
            ]
          }
        }
      ];

      // If last module and final exam is enabled, add Exam lesson
      if (isLastModule && options.includeFinalExam !== false) {
        lessons.push({
          id: `${courseId}-les-${modNumber}-2`,
          title: 'Exame de Qualificação e Certificação Profissional de Auditor',
          durationMinutes: 60,
          summary: 'Avaliação formal de proficiência técnica e raciocínio de auditor para validação e emissão do certificado pela EXPLORER SOLUTIONS.',
          technicalDetails: [
            'Avaliação abrangente com questões de múltipla escolha e análise de cenários práticos de auditoria.',
            'Exigência de pontuação mínima de 70% para homologação e emissão do certificado profissional.',
            'Validação de competências para emissão de certificado oficial com QR Code e autenticidade.'
          ],
          practicalChecklist: [
            'Responder a todas as questões avaliativas com base nos critérios normativos estudados.',
            'Revisar o parecer técnico e as justificativas das constatações de auditoria.',
            'Aguardar validação e homologação do certificado pelo Gestor no painel administrativo.'
          ],
          specialType: 'EXAM'
        });
      }

      return {
        id: modId,
        number: modNumber,
        title: spec.title,
        subtitle: spec.subtitle,
        badge: spec.badge || (isLastModule ? 'Avaliação & Homologação' : `Módulo ${modNumber}`),
        description: spec.description || `Diretrizes técnicas, aplicação prática e critérios de conformidade para ${spec.title}.`,
        educationalVideos: [
          {
            id: `vid-${courseId}-${modNumber}`,
            title: `Vídeo Técnico: ${spec.title}`,
            description: `Apresentação audiovisual das diretrizes centrais e pontos de atenção para o auditor.`,
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            durationMinutes: 30,
            tags: ['Auditoria', 'Treinamento', 'Conformidade'],
            addedAt: new Date().toLocaleDateString('pt-BR')
          }
        ],
        lessons
      };
    });
  } else {
    modules = generateStandardModules(courseId, options.preset);
  }

  return {
    id: courseId,
    title: options.title.trim(),
    subtitle: options.subtitle.trim(),
    workloadHours: options.workloadHours || 40,
    targetAudience: options.targetAudience.trim() || 'Profissionais de Gestão, Auditores, Engenheiros e Inspetores Técnicos.',
    instructorName: options.instructorName.trim() || 'Lead Auditor EXPLORER SOLUTIONS',
    instructorRole: options.instructorRole.trim() || 'Coordenador Técnico & Lead Auditor Especialista',
    instructorCredential: options.instructorCredential.trim() || 'IRCA Lead Auditor / CREA Especialista',
    regulatoryFramework: options.regulatoryFramework.length > 0
      ? options.regulatoryFramework
      : ['ABNT NBR ISO 19011:2026', 'ABNT NBR ISO 9001 / ISO 14001 / ISO 45001'],
    description: options.description.trim() || 'Programa de capacitação profissional em conformidade com as melhores práticas internacionais de auditoria e governança técnica.',
    modules,
    thematicProfile: options.thematicProfileTitle ? {
      title: options.thematicProfileTitle.trim(),
      focus: options.thematicProfileFocus?.trim() || '',
      sourceFileName: options.thematicProfileFileName
    } : undefined
  };
}

/**
 * Duplicates an existing course with a new ID and fresh module/lesson IDs.
 */
export function duplicateCourse(sourceCourse: Course, newTitle?: string): Course {
  const newCourseId = `curso-${Date.now()}`;
  const timestamp = Date.now();

  const clonedModules: Module[] = sourceCourse.modules.map((m, mIdx) => {
    const newModId = `mod-${timestamp}-${mIdx + 1}`;
    return {
      ...m,
      id: newModId,
      educationalVideos: m.educationalVideos ? m.educationalVideos.map(v => ({ ...v, id: `vid-${timestamp}-${Math.random().toString(36).substring(2, 7)}` })) : [],
      lessons: m.lessons.map((l, lIdx) => ({
        ...l,
        id: `les-${timestamp}-${mIdx + 1}-${lIdx + 1}`
      }))
    };
  });

  return {
    ...sourceCourse,
    id: newCourseId,
    title: newTitle || `${sourceCourse.title} (Nova Turma / Cópia)`,
    subtitle: `${sourceCourse.subtitle} [Formatado]`,
    modules: clonedModules
  };
}
