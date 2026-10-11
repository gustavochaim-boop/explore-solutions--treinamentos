import { Course, NonConformityItem, InterviewAvatar, ExamQuestion, CertificateTemplate, StudentUser } from '../types';

export const DEFAULT_COURSE: Course = {
  id: 'sgso-sgi-auditor-master',
  title: 'Formação de Auditor Líder de SGI & SGSO Offshore',
  subtitle: 'Regulamentação Técnica ANP, ISO 19011:2026 e Melhores Práticas da Indústria de Óleo & Gás',
  workloadHours: 40,
  targetAudience: 'Engenheiros de Petróleo, Auditores Internos, Gerentes de Rig, Técnicos de Segurança Marítima, Inspetores e Oficiais Offshore.',
  instructorName: 'Cap. Roberto Alencar, MSc.',
  instructorRole: 'Lead Auditor SGI / Especialista Sênior em Segurança Operacional Marítima',
  instructorCredential: 'CREA-RJ 201103982 | IRCA Lead Auditor 849201',
  regulatoryFramework: [
    'Regulamento Técnico do SGSO (ANP)',
    'ABNT NBR ISO 19011:2026 (Diretrizes para Auditoria de Sistemas de Gestão)',
    'ABNT NBR ISO 9001 / ISO 14001 / ISO 45001',
    'NORMAM-01 e NORMAM-13 (Diretoria de Portos e Costas - Marinha do Brasil)',
    'Convenção SOLAS / Código MODU (IMO)'
  ],
  description: 'Programa imersivo e de alta precisão focado na capacitação de auditores líderes para o ambiente de confinamento e alto risco das unidades marítimas de exploração e produção (FPSOs, Sondas e Plataformas Fixas). Abrange o domínio regulatório, técnicas comportamentais, laboratório 3D de não-conformidades e emissão de relatórios de impacto.',
  modules: [
    {
      id: 'mod-1',
      number: 1,
      title: 'O Mindset do Auditor de Elite e a Nova Era do SGSO',
      subtitle: 'Cenário estratégico, regulação técnica e inteligência comportamental offshore',
      badge: 'Fundamentos & Postura',
      description: 'Construção da base de liderança ética, compreensão do impacto legal e financeiro de acidentes maiores e habilidades sociais para ambiente de confinamento.',
      educationalVideos: [
        {
          id: 'vid-mod-1',
          title: 'Aula Magna: O Novo Marco Regulatório do SGSO e Segurança Operacional em P&G',
          description: 'Apresentação dos pilares legais, jurisprudência da ANP e impactos diretos no afretamento de FPSOs e sondas.',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          durationMinutes: 32,
          tags: ['SGSO', 'Regulação ANP', 'Cenário Estratégico'],
          addedAt: '10/10/2026'
        }
      ],
      lessons: [
        {
          id: 'les-1-1',
          title: 'Cenário Estratégico de P&G: O Impacto Real do SGSO',
          durationMinutes: 45,
          summary: 'Análise do impacto do SGSO na segurança jurídica, financeira e operacional de plataformas e sondas.',
          technicalDetails: [
            'Relação direta entre conformidade com o SGSO e a manutenção da Licença de Operação e Concessão da ANP.',
            'Custo financeiro de paralisações não programadas (Loss of Production) vs. Investimento em barreiras preventivas.',
            'Responsabilização civil e penal da alta administração e operadores em casos de acidentes maiores.',
            'Visão holística: segurança operacional como vantagem competitiva e preservação da vida.'
          ],
          practicalChecklist: [
            'Verificar a existência e publicidade da Política de Segurança Operacional a bordo.',
            'Avaliar se as metas de segurança estão atreladas a indicadores de desempenho da liderança marítima.',
            'Checar se o relatório anual de conformidade regulatória foi protocolado junto ao órgão fiscalizador.'
          ],
          realCaseStudy: {
            title: 'Paralisação Cautelar em Campo Maduro da Bacia de Campos',
            scenario: 'Auditoria de rotina identificou corrosão generalizada em skids de gás e falhas repetidas no sistema de detecção de fogo e gás (F&G). A agência determinou a interdição imediata da unidade por 18 dias.',
            keyFindings: [
              'Prejuízo estimado superior a US$ 32 milhões entre perda de produção e diárias de afretamento.',
              'Ausência de canal direto entre o auditor de integridade e a diretoria executiva.'
            ],
            correctiveActions: [
              'Reestruturação do comitê de integridade mecânica com reporte semestral ao conselho de administração.',
              'Implementação de sistema preditivo de monitoramento de espessura de tubulações críticas.'
            ]
          }
        },
        {
          id: 'les-1-2',
          title: 'O Novo Regulamento Técnico: Apresentação e Bastidores',
          durationMinutes: 60,
          summary: 'Apresentação detalhada das mudanças cruciais na legislação de segurança marítima e expectativas da autoridade regulatória.',
          technicalDetails: [
            'Evolução do arcabouço regulatório da ANP para unidades marítimas de perfuração e produção.',
            'Maior rigor na comprovação de barreiras de segurança física e humana (Human Factors Integration).',
            'Nova sistemática de notificação compulsória de quase-acidentes de alto potencial (High-Po).',
            'Interoperabilidade entre as normas de segurança do trabalho e as normas marítimas da Marinha do Brasil.'
          ],
          practicalChecklist: [
            'Mapear a matriz de correspondência entre o SGSO da empresa e o novo regulamento técnico.',
            'Confirmar se a documentação mandatória da unidade está em sua versão vigente e aprovada.',
            'Validar as atas de reuniões do Comitê de Análise de Risco Operacional dos últimos 12 meses.'
          ]
        },
        {
          id: 'les-1-3',
          title: 'Perfil e Postura de Alta Performance: O Auditor Líder a Bordo',
          durationMinutes: 50,
          summary: 'O comportamento, a ética, a inteligência emocional e as competências de liderança exigidas de um auditor líder a bordo.',
          technicalDetails: [
            'Código de ética do auditor de conformidade marítima: imparcialidade e rigor técnico sem arrogância.',
            'Gerenciamento do estresse em ambiente de confinamento (turnos de 14 ou 28 dias embarcado).',
            'Liderança situacional: quando orientar com didática e quando sustentar uma não-conformidade crítica.',
            'Comunicação não-violenta (CNV) aplicada a reuniões com a tripulação sob pressão operacional.'
          ],
          practicalChecklist: [
            'Postura neutra e investigativa durante entrevistas de campo, evitando induzir respostas.',
            'Verificação pontual do uso correto de EPIs e cumprimento estrito dos procedimentos da unidade pelo próprio auditor.',
            'Respeito aos horários de descanso e rotinas de passagem de serviço (Handover).'
          ]
        },
        {
          id: 'les-1-4',
          title: 'Soft Skills e Conflitos Offshore: Negociação e Pressão',
          durationMinutes: 45,
          summary: 'Técnicas de comunicação assertiva e negociação para lidar com a pressão do ambiente de confinamento em plataformas.',
          technicalDetails: [
            'Táticas de desescalada de conflitos com gestores operacionais defensivos ou resistentes à auditoria.',
            'O princípio do "Ataque o problema, nunca a pessoa": fundamentação estrita em evidências objetivas.',
            'Como apresentar constatações desconfortáveis sem paralisar o canal de comunicação com o OIM (Offshore Installation Manager).',
            'Gestão do cansaço mental e manutenção do foco em longas jornadas de inspeção física.'
          ],
          practicalChecklist: [
            'Preparar perguntas abertas para iniciar entrevistas com supervisores de frente.',
            'Evitar o uso de termos acusatórios em apontamentos preliminares.',
            'Registrar fatos verificáveis: data, hora, tag do equipamento, fotos e assinaturas de testemunhas.'
          ]
        }
      ]
    },
    {
      id: 'mod-2',
      number: 2,
      title: 'Imersão Técnica Operacional – Dominando os Capítulos do SGSO',
      subtitle: 'Disposições Gerais, Liderança, Instalações, Tecnologia e Práticas Operacionais',
      badge: 'Core Regulatório',
      description: 'O núcleo técnico da auditoria offshore. Estudo aprofundado dos 4 capítulos vitais do regulamento com análise de falhas em barreiras e estudos de caso reais.',
      educationalVideos: [
        {
          id: 'vid-mod-2',
          title: 'Estudo de Caso Prático: Barreiras de Segurança e Lições de Acidentes Maiores',
          description: 'Análise técnica das falhas de barreira, BOP, gestão de mudanças e integridade de contenção primária e secundária.',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          durationMinutes: 45,
          tags: ['Barreiras', 'Major Accidents', 'Capítulo 3', 'BOP'],
          addedAt: '10/10/2026'
        }
      ],
      lessons: [
        {
          id: 'les-2-1',
          title: 'Introdução Estratégica ao Regulamento Técnico & Major Accidents Control',
          durationMinutes: 60,
          summary: 'Pilares fundamentais da Segurança Operacional Marítima e o papel do SGSO na mitigação de acidentes catastróficos.',
          technicalDetails: [
            'Conceito de Prevenção de Acidentes Maiores (Major Accident Hazards - MAH): explosões, incêndios de poço, abalroamento e perda de estabilidade.',
            'Modelo do Queijo Suíço de James Reason aplicado à dinâmica de poços e plantas de processo de FPSO.',
            'Definição e papel dos Elementos Críticos de Segurança e Meio Ambiente (SCE - Safety Critical Elements).',
            'Padrões de Desempenho (Performance Standards) e critérios de aceitabilidade de risco (ALARP).'
          ],
          practicalChecklist: [
            'Localizar o Safety Case / Relatório de Segurança da Instalação.',
            'Inspecionar o registro de SCEs e o cronograma de testes de integridade periódicos.',
            'Verificar a rastreabilidade entre os cenários de risco da HAZOP e os planos de contingência.'
          ]
        },
        {
          id: 'les-2-2',
          title: 'Capítulo 1 do SGSO – Disposições Gerais & Responsabilidades Legais',
          durationMinutes: 50,
          summary: 'Alinhamento de conceitos, escopo de aplicação e responsabilidades legais entre Operador da Instalação e Operador do Contrato.',
          technicalDetails: [
            'Diferenciação clara entre Operador da Instalação (ex: afretador / rig contractor) e Operador do Contrato (concessionária / petroleira).',
            'Definição da cadeia de custódia e delegação de autoridade do Gerente da Instalação (OIM).',
            'Interfaces contratuais e resolução de conflitos entre sistemas de gestão de empresas contratadas e da concessionária.',
            'Mecanismos formais para direito de recusa (Stop Work Authority) sem retaliação.'
          ],
          practicalChecklist: [
            'Avaliar o contrato de interface (Bridging Document) entre a operadora e as prestadoras de serviços.',
            'Conferir a matriz de autoridade para parada de trabalho de emergência a bordo.',
            'Verificar a designação formal do Responsável Técnico pelo SGSO.'
          ]
        },
        {
          id: 'les-2-3',
          title: 'Capítulo 2 do SGSO – Liderança, Pessoal e Gestão da Informação',
          durationMinutes: 70,
          summary: 'Cultura de segurança, auditoria do comprometimento da alta gerência, fator humano e rastreabilidade documental.',
          technicalDetails: [
            'Auditoria do Fator Humano: carga de trabalho excessiva, fadiga e escala de embarque.',
            'Matriz de competências mínimas para funções críticas (ex: Sondador, Operador de Painel, Supervisor de Lastro).',
            'Comunicação de riscos: eficácia dos Diálogos Diários de Segurança (DDS) e reuniões pré-tarefa.',
            'Gestão da informação: integridade dos manuais de operação, P&IDs e procedimentos operacionais padronizados (POPs).'
          ],
          practicalChecklist: [
            'Amostragem de 10 certificados obrigatórios de tripulantes (CBSP, HUET, NR-13, NR-33, NR-35 e Well Control).',
            'Entrevistar operadores de painel sobre o procedimento de resposta a múltiplos alarmes simultâneos.',
            'Checar se os fluxogramas de engenharia (P&IDs) a bordo refletem as alterações físicas da planta.'
          ]
        },
        {
          id: 'les-2-4',
          title: 'Capítulo 3 do SGSO – Instalações e Tecnologia (Integridade, Barreiras e MOC)',
          durationMinutes: 80,
          summary: 'Auditoria de projeto, integridade mecânica, confiabilidade de BOP/sistemas de alívio e Gestão de Mudanças (MOC).',
          technicalDetails: [
            'Integridade de Ativos: programas de inspeção preditiva, ensaios não destrutivos (END) e controle de corrosão.',
            'Barreiras de Segurança Primárias e Secundárias: integridade de BOP Stack, válvulas de segurança subsuperficiais (SSSV) e ESDVs.',
            'Confiabilidade de sistemas de alívio de pressão (PSVs, discos de ruptura e flare knock-out drums).',
            'Gestão de Mudanças (MOC): auditoria do processo de aprovação de mudanças temporárias e permanentes (mecânicas, lógicas e operacionais).'
          ],
          practicalChecklist: [
            'Verificar calibração e lacres de 5 válvulas PSV de linhas de alta pressão.',
            'Inspecionar pastas de MOC em aberto com prazo de expiração vencido.',
            'Auditar os testes funcionais do sistema de corte e isolamento de poço do BOP.',
            'Inspecionar visualmente cabos de aço de guindastes e testes de carga semestrais.'
          ]
        },
        {
          id: 'les-2-5',
          title: 'Capítulo 4 do SGSO – Práticas Operacionais, PT e Planos de Emergência',
          durationMinutes: 75,
          summary: 'Segurança de processo, eficácia do sistema de Permissão para Trabalho (PT) e auditoria de simulados de emergência.',
          technicalDetails: [
            'Auditoria do Sistema de Permissão para Trabalho (PT) para trabalho a quente, espaço confinado e trabalho em altura.',
            'Avaliação de Risco da Tarefa (ART) e medição contínua de atmosfera em áreas classificadas (Zona 0, 1 e 2).',
            'Procedimentos de partida, parada normal e parada de emergência da planta de processo.',
            'Plano de Resposta a Emergências (PRE): tempo de resposta em simulados de "Homem ao Mar", "Abandono de Plataforma" e "Vazamento de H2S".'
          ],
          practicalChecklist: [
            'Examinar no local 3 frentes de trabalho com PT ativa e comparar com as condicionantes aprovadas.',
            'Verificar calibrador de detectores de gás portáteis (teste de resposta tipo Bump Test diário).',
            'Inspecionar as estações de embarque nas baleeiras (TEMPSC) e kits de sobrevivência.'
          ]
        },
        {
          id: 'les-2-6',
          title: 'Laboratório de Aplicação: Estudos de Caso Reais & Oficina de Diagnóstico',
          durationMinutes: 90,
          summary: 'Análise de acidentes históricos da indústria de P&G correlacionados com falhas nos capítulos do SGSO e exercícios práticos.',
          technicalDetails: [
            'Análise forense do acidente de Macondo (Deepwater Horizon): falha em barreira de cimento, MOC negligenciada e falha no BOP.',
            'Análise do acidente de Piper Alpha: falha no sistema de PT e isolamento mecânico de bomba reserva sem comunicação.',
            'Exercício prático: classificação de 15 desvios reais coletados em plataformas da Bacia de Santos em Não-Conformidade Maior, Menor ou Oportunidade de Melhoria.',
            'Determinação da causa-raiz utilizando a metodologia dos 5 Porquês e Diagrama de Ishikawa.'
          ],
          practicalChecklist: [
            'Redigir a descrição de não-conformidade com evidência objetiva inequívoca.',
            'Correlacionar cada desvio com o artigo e capítulo específico do Regulamento do SGSO.',
            'Definir prazos de encerramento compatíveis com a criticidade do risco.'
          ],
          realCaseStudy: {
            title: 'Falha de Lacre e Bypass de ESDV durante Mudança Operacional',
            scenario: 'Durante campanha de intervenção com sonda flutuante, a tripulação realizou bypass eletrônico na válvula ESDV-201 para manutenção sem emissão de MOC e sem compensação de risco por monitoramento contínuo.',
            keyFindings: [
              'Violação direta do Capítulo 3 (Gestão de Mudanças e Barreiras) e Capítulo 4 (Práticas Operacionais).',
              'Ocorrência de alarme falso não investigado 48 horas antes da constatação da auditoria.'
            ],
            correctiveActions: [
              'Bloqueio físico com chave mestra e protocolo de autorização exclusiva pelo OIM para qualquer bypass.',
              'Treinamento de reciclagem imediato para 100% dos operadores de sala de controle.'
            ]
          }
        }
      ]
    },
    {
      id: 'mod-3',
      number: 3,
      title: 'Diretrizes Avançadas de Auditoria (ISO 19011 na Prática Marítima)',
      subtitle: 'Princípios fundamentais, terminologia técnica, qualificação e competências',
      badge: 'Metodologia ISO',
      description: 'Adaptação rigorosa das diretrizes internacionais de auditoria de sistemas de gestão (ISO 19011:2026) para o ambiente offshore.',
      lessons: [
        {
          id: 'les-3-1',
          title: 'Princípios Fundamentais da ISO 19011:2026 Adaptados ao Offshore',
          durationMinutes: 50,
          summary: 'Integridade, apresentação justa, devido cuidado profissional, confidencialidade, independência e abordagem baseada em evidências.',
          technicalDetails: [
            'O princípio do pensamento baseado em risco aplicado ao planejamento e condução da auditoria.',
            'Preservação da confidencialidade de dados estratégicos de poço e tecnologia de completação.',
            'Como manter a independência de julgamento mesmo quando contratado pela própria operadora.',
            'Segurança da informação e cadeia de custódia de dados digitais colhidos a bordo.'
          ],
          practicalChecklist: [
            'Assinatura do termo de confidencialidade e declaração de conflito de interesses.',
            'Verificação da rastreabilidade de todas as evidências apresentadas.',
            'Garantir que as constatações sejam sustentadas por amostragens estatisticamente representativas.'
          ]
        },
        {
          id: 'les-3-2',
          title: 'Terminologia e Classificação Técnica de Auditorias',
          durationMinutes: 45,
          summary: 'Desmistificando o vocabulário oficial técnico: auditorias de primeira, segunda e terceira parte, de processo e de sistema.',
          technicalDetails: [
            'Diferença entre Auditoria Interna (1ª parte), Auditoria de Fornecedor/Contratada (2ª parte) e Auditoria de Certificação/Órgão Regulador (3ª parte).',
            'Conceitos normativos: Critério de Auditoria, Evidência de Auditoria, Constatação de Auditoria e Conclusão de Auditoria.',
            'Graduação de apontamentos: Não-Conformidade Crítica, Não-Conformidade Maior, Não-Conformidade Menor e Observação.'
          ],
          practicalChecklist: [
            'Estruturar o plano de auditoria utilizando a taxonomia oficial da ISO 19011.',
            'Verificar se os relatórios anteriores de 1ª parte tiveram seus planos de ação concluídos no prazo.'
          ]
        },
        {
          id: 'les-3-3',
          title: 'Qualificação, Competências e Avaliação de Auditores Líderes',
          durationMinutes: 50,
          summary: 'Como gerenciar o programa de auditoria da empresa, selecionar a equipe e avaliar auditores em ambiente de alto risco.',
          technicalDetails: [
            'Matriz de competências para auditor marítimo: conhecimentos náuticos, de processo químico e de segurança industrial.',
            'Exigências de aptidão médica (ASO marítimo e certificação HUET/CBSP em dia).',
            'Avaliação contínua de desempenho do auditor: calibração de critérios e avaliação pelos pares.'
          ],
          practicalChecklist: [
            'Conferir pasta funcional com comprovação de horas de auditoria e reciclagens técnicas dos membros da equipe.',
            'Realizar reunião de alinhamento metodológico antes do embarque.'
          ]
        }
      ]
    },
    {
      id: 'mod-4',
      number: 4,
      title: 'Planejamento Tático e Inteligência em Auditoria',
      subtitle: 'Definição de escopo, montagem de força-tarefa e checklists dinâmicos',
      badge: 'Planejamento & Ferramentas',
      description: 'Como estruturar uma auditoria de alto rendimento antes do helicóptero decolar, mitigando riscos de logística e focando em processos críticos.',
      lessons: [
        {
          id: 'les-4-1',
          title: 'Estratégia e Escopo do Programa de Auditoria de SGSO',
          durationMinutes: 55,
          summary: 'Definição do programa e mitigação de riscos associados ao processo de auditoria de SGSO.',
          technicalDetails: [
            'Planejamento logístico offshore: vagas a bordo (POB - Persons On Board), restrições de voo e janelas operacionais de sonda.',
            'Mapeamento dos processos de maior risco para priorização do tempo de campo.',
            'Mitigação de riscos da auditoria: evitar interferência em operações simultâneas críticas (SIMOPS).'
          ],
          practicalChecklist: [
            'Envio do plano de auditoria ao OIM com antecedência mínima de 15 dias.',
            'Solicitação prévia dos manuais de operação e licenças ambientais para análise remota documental.',
            'Confirmação de espaço para acomodação e sala de reuniões reservada a bordo.'
          ]
        },
        {
          id: 'les-4-2',
          title: 'Montagem de Força-Tarefa e Distribuição de Tarefas',
          durationMinutes: 50,
          summary: 'Critérios para a seleção e formação da equipe de auditores internos multidisciplinares.',
          technicalDetails: [
            'Composição de equipe ideal: auditor líder + especialista de processo + especialista mecânico/elétrico + especialista náutico.',
            'Atribuição de responsabilidades por capítulo do SGSO.',
            'Briefing de alinhamento com a equipe: comunicação via rádio UHF a bordo e regras de circulação.'
          ],
          practicalChecklist: [
            'Definir cronograma horário de reuniões diárias de alinhamento a bordo.',
            'Estabelecer o ponto focal de comunicação com a gerência offshore.'
          ]
        },
        {
          id: 'les-4-3',
          title: 'Checklists Inteligentes Baseados em Processos e Barreiras',
          durationMinutes: 65,
          summary: 'Elaboração de listas de verificação dinâmicas baseadas nos capítulos do SGSO, evitando burocracia e focando em barreiras ativas.',
          technicalDetails: [
            'Diferença entre "Checklist burocrático de assinalar caixinhas" vs. "Roteiro investigativo de integridade de barreiras".',
            'Técnica do Fio de Ariadne: seguir o fluido do poço até o flare, auditando cada válvula e transmissor no caminho.',
            'Como desenhar trilhas de auditoria para investigar desvios ocultos em sistemas de segurança instrumentada (SIS).'
          ],
          practicalChecklist: [
            'Elaborar checklist com campos para registro de evidência física (número de TAG, número de ordem de serviço e fotos autorizadas).',
            'Incluir perguntas de verificação cruzada entre o que está no papel e o que o operador no campo realmente faz.'
          ]
        }
      ]
    },
    {
      id: 'mod-5',
      number: 5,
      title: 'Laboratório Prático de Auditoria 3D Offshore [Inovação]',
      subtitle: 'Navegação virtual, caça a não-conformidades de SGSO e simulação de entrevistas com tripulação',
      badge: 'Laboratório Interativo 3D',
      description: 'Experiência imersiva direta no navegador. Navegue por setores de uma unidade marítima, localize desvios graves de segurança operacional e conduza entrevistas técnicas com avatares da liderança.',
      lessons: [
        {
          id: 'les-5-1',
          title: 'Navegação Virtual em Planta Industrial de P&G Simulada',
          durationMinutes: 70,
          summary: 'Imersão do aluno à distância em uma planta offshore simulada em 3D para coleta de evidências reais direto do navegador.',
          technicalDetails: [
            'Reconhecimento dos setores da planta: Deck Principal de Poço, Módulo de Separação e Compressão, Sala de Controle (CCR) e Acomodações.',
            'Identificação visual de equipamentos críticos: Árvore de Natal Molhada (ANM), Manifold de Produção, Separadores Trifásicos e Flare.',
            'Procedimento de segurança para circulação na área industrial offshore: rotas de fuga primárias e secundárias.'
          ],
          practicalChecklist: [
            'Localizar as principais rotas de fuga no mapa do convés.',
            'Identificar a posição das estações de acionamento manual de alarme de incêndio (MCP).'
          ],
          specialType: 'LAB_3D'
        },
        {
          id: 'les-5-2',
          title: 'Caça a Não-Conformidades de SGSO: Desafio Interativo',
          durationMinutes: 80,
          summary: 'Desafio na tela para identificar desvios em práticas operacionais, falhas em barreiras (Capítulo 3) e riscos de segurança industrial (Capítulo 4).',
          technicalDetails: [
            'Inspeção tática de 8 pontos críticos espalhados pela plataforma.',
            'Diagnóstico de desvios em permissões de trabalho a quente, aterramento de skids, lacres de PSV e integridade de tubulações.',
            'Classificação imediata pelo aluno quanto à gravidade e artigo violado do SGSO com pontuação em tempo real.'
          ],
          practicalChecklist: [
            'Examinar cada ponto de inspeção com atenção aos detalhes visuais.',
            'Registrar a fundamentação legal para cada constatação.'
          ],
          specialType: 'LAB_3D'
        },
        {
          id: 'les-5-3',
          title: 'Simulação de Entrevistas a Bordo com Avatares da Tripulação',
          durationMinutes: 60,
          summary: 'Dinâmica prática de questionamento e aplicação de perguntas-filtro com avatares que representam o OIM, engenheiros e operadores offshore.',
          technicalDetails: [
            'Aplicação de perguntas abertas, fechadas e de verificação de consistência.',
            'Interrogação sobre a eficácia de treinamentos de simulados e rotinas de MOC.',
            'Validação de respostas com confronto de evidências documentais apresentadas pelo sistema.'
          ],
          practicalChecklist: [
            'Conduzir entrevista com o OIM sobre cultura de segurança e recursos alocados.',
            'Interrogar o supervisor de manutenção mecânica sobre ordens de serviço pendentes em equipamentos de segurança crítica.'
          ],
          specialType: 'LAB_3D'
        }
      ]
    },
    {
      id: 'mod-6',
      number: 6,
      title: 'Execução, Condução e Relatórios de Impacto',
      subtitle: 'Rapport na abertura, consolidação de evidências, reunião de encerramento e redação incontestável',
      badge: 'Execução & Relatório',
      description: 'Como conduzir as reuniões formais com a liderança offshore, defender conclusões técnicas e redigir um relatório à prova de contestações baseado em causa-raiz.',
      lessons: [
        {
          id: 'les-6-1',
          title: 'Rapport na Abertura: Alinhamento e Quebra de Tensão a Bordo',
          durationMinutes: 50,
          summary: 'Como conduzir a reunião de abertura quebrando a tensão e alinhando objetivos com os gestores da unidade marítima.',
          technicalDetails: [
            'Pauta mandatória da reunião de abertura: apresentação da equipe, escopo, critérios de auditoria, logística e canais de comunicação.',
            'Reforço da filosofia da auditoria: buscar conformidade e proteger vidas, não caçar culpados.',
            'Definição dos acompanhantes de área (guias locais) e protocolos de emergência durante a auditoria.'
          ],
          practicalChecklist: [
            'Lista de presença formal com assinatura de todos os gerentes departamentais presentes.',
            'Confirmação dos canais de rádio e procedimentos em caso de acionamento do alarme geral da plataforma.'
          ]
        },
        {
          id: 'les-6-2',
          title: 'Coleta de Evidências Reais: Triangulação e Rastreabilidade',
          durationMinutes: 60,
          summary: 'Extração de constatações e dados obtidos através de entrevistas, inspeção física e exame documental.',
          technicalDetails: [
            'Método de Triangulação de Evidências: (1) O que o procedimento manda fazer + (2) O que o operador diz que faz + (3) O que a evidência física comprova.',
            'Registro fotográfico de desvios em áreas classificadas: exigência de câmera intrinsecamente segura (Ex).',
            'Coleta de dados brutos do sistema SCADA / PIMS para comprovação de testes funcionais.'
          ],
          practicalChecklist: [
            'Garantir que nenhuma constatação seja registrada com base em mera opinião pessoal.',
            'Obter concordância prévia do responsável pela área no momento em que a evidência for detectada.'
          ]
        },
        {
          id: 'les-6-3',
          title: 'A Reunião de Encerramento: Defendendo Desvios Graves com Valor Financeiro',
          durationMinutes: 65,
          summary: 'Como apresentar desvios graves de SGSO para a alta direção demonstrando o valor preventivo e financeiro da auditoria.',
          technicalDetails: [
            'Estrutura de apresentação executiva: pontos fortes observados, oportunidades de melhoria e não-conformidades.',
            'Demonstração do valor do custo evitado (evitar paralisação da ANP, vazamentos e sanções jurídicas milionárias).',
            'Postura firme e respeitosa diante de questionamentos acalorados sobre a classificação de desvios maiores.'
          ],
          practicalChecklist: [
            'Apresentar resumo executivo visual antes de entrar no detalhamento de cada desvio.',
            'Colher a assinatura do OIM na ata da reunião de encerramento sem adiamento.'
          ]
        },
        {
          id: 'les-6-4',
          title: 'Redação Incontestável: Relatório Focado em Causa-Raiz',
          durationMinutes: 70,
          summary: 'Elaboração do Relatório de Auditoria focado na análise de causa raiz para evitar acidentes recorrentes.',
          technicalDetails: [
            'A fórmula padrão da Não-Conformidade: Constatação (O que foi visto) + Requisito (Qual artigo/norma foi violada) + Evidência (Qual o registro comprobatório).',
            'Evitar adjetivos vagos ("manutenção ruim", "procedimento inadequado") e usar métricas objetivas.',
            'Definição de prazos para apresentação do Plano de Ação Corretiva (PAC) pelo auditado.'
          ],
          practicalChecklist: [
            'Revisão gramatical e técnica cruzada entre os membros da equipe de auditoria.',
            'Numeração sequencial e controle de versão do documento final homologado.'
          ]
        }
      ]
    },
    {
      id: 'mod-7',
      number: 7,
      title: 'Certificação e Mesa Redonda de Elite [Encerramento]',
      subtitle: 'Avaliação de competência, painel de especialistas de petroleiras e emissão de certificado oficial',
      badge: 'Conclusão & Certificação',
      description: 'Validação final de aptidão profissional através de exame prático simulado, mentoria de carreira e emissão imediata do certificado oficial personalizável.',
      lessons: [
        {
          id: 'les-7-1',
          title: 'Avaliação de Competência: Prova Final de Auditoria de SGSO',
          durationMinutes: 60,
          summary: 'Prova final focada na resolução de problemas práticos de auditoria de SGSO e classificação de cenários reais.',
          technicalDetails: [
            'Exame com 10 questões técnicas de múltipla escolha cobrindo os 4 capítulos do SGSO e diretrizes da ISO 19011:2026.',
            'Exigência de aproveitamento mínimo de 70% para liberação do certificado de conclusão.',
            'Feedback comentado imediato com justificativa técnica para cada questão.'
          ],
          practicalChecklist: [
            'Revisar os tópicos dos módulos 1 a 6 antes de iniciar a tentativa.',
            'Responder analisando a ótica da mitigação de riscos de acidentes maiores.'
          ],
          specialType: 'EXAM'
        },
        {
          id: 'les-7-2',
          title: 'Painel de Bastidores do Mercado: Especialistas e Reguladores',
          durationMinutes: 90,
          summary: 'Reunião gravada e transcrita com grandes Auditores e Especialistas em SGSO com sólida experiência nas maiores petroleiras e agências reguladoras do Brasil.',
          technicalDetails: [
            'Debate sobre a atuação prática dos fiscais da ANP nas inspeções anuais de plataformas.',
            'Como as operadoras internacionais (IOCs) avaliam relatórios de auditoria de contratadas no pré-sal.',
            'Principais gargalos encontrados nas auditorias de FPSOs recém-afretados.'
          ],
          practicalChecklist: [
            'Anotar insights práticos para inclusão no repertório de argumentação técnica do auditor.'
          ],
          specialType: 'NETWORKING'
        },
        {
          id: 'les-7-3',
          title: 'Sessão de Networking & Carreira: Mentoria e Posicionamento',
          durationMinutes: 50,
          summary: 'Espaço exclusivo para mentoria, tira-dúvidas de carreira e estratégias de posicionamento profissional no mercado de óleo e gás.',
          technicalDetails: [
            'Construção de currículo de impacto e perfil no LinkedIn para o ecossistema offshore de P&G.',
            'Como obter registros internacionais de auditor (IRCA, Exemplar Global) e CREA.',
            'Precificação de diárias de auditoria independente e consultoria de integridade regulatória.'
          ],
          practicalChecklist: [
            'Configurar seus dados no Estúdio de Certificados e emitir seu documento oficial com código de autenticidade.'
          ],
          specialType: 'NETWORKING'
        }
      ]
    }
  ]
};

export const INITIAL_NON_CONFORMITIES: NonConformityItem[] = [
  {
    id: 'nc-1',
    title: 'Válvula PSV com Teste Hidrostático e Calibração Vencidos',
    location: 'process',
    locationName: 'Módulo de Separação de Alta Pressão (V-101)',
    sgsoChapter: 'Capítulo 3',
    severity: 'Grave',
    description: 'A válvula de alívio de segurança (PSV-101B) do separador trifásico de produção está com plaqueta de calibração vencida há 4 meses e lacre rompido.',
    visualClue: 'Plaqueta oxidada e lacre de chumbo cortado no manifold superior da linha de alívio do vaso V-101.',
    evidenceFound: 'TAG PSV-101B / Data do último teste: 14/05/2025 (Periodicidade estipulada de 12 meses). Ordem de serviço no SAP não foi executada.',
    regulatoryBasis: 'SGSO Capítulo 3 - Item 3.4 (Confiabilidade e Integridade Mecânica de Sistemas de Alívio).',
    rootCause: 'Falta de sobressalente em estoque a bordo e falha no disparo de alerta preventivo do software de manutenção.',
    recommendedAction: 'Substituição imediata por válvula reserva calibrada e abertura de análise de anomalia.',
    isFound: false
  },
  {
    id: 'nc-2',
    title: 'Permissão para Trabalho a Quente Executada sem Teste Contínuo de Gás',
    location: 'deck',
    locationName: 'Convés Principal / Próximo à boca do poço P-04',
    sgsoChapter: 'Capítulo 4',
    severity: 'Crítica',
    description: 'Equipe de caldeiraria realizando corte e solda com esmerilhadeira sem o detector portátil multigás posicionado e sem registro de medição LEL contínua na PT.',
    visualClue: 'Fagulhas projetadas a 3 metros de linha de drenagem aberta; explosímetro ausente da frente de serviço.',
    evidenceFound: 'PT nº 88421 aberta como "Trabalho a Quente Classe 1" com campo de monitoramento contínuo de LEL em branco após as 10h00.',
    regulatoryBasis: 'SGSO Capítulo 4 - Item 4.2 (Permissão para Trabalho e Controle de Fontes de Ignição em Áreas Classificadas).',
    rootCause: 'Pressão por cumprimento de cronograma de parada e negligência do observador de fogo (Fire Watch).',
    recommendedAction: 'Paralisação imediata da atividade (Stop Work Authority), reavaliação de atmosfera e recapeamento do DDS.',
    isFound: false
  },
  {
    id: 'nc-3',
    title: 'Bypass Provisório em Chave de Nível Crítico sem MOC Aprovado',
    location: 'ccr',
    locationName: 'Sala de Controle Central (CCR) - Rack de Intertravamento',
    sgsoChapter: 'Capítulo 3',
    severity: 'Crítica',
    description: 'Instalação de jumper mecânico/elétrico no transmissor de nível muito alto (LSHH-204) do tanque de decantação sem protocolo de Gestão de Mudanças (MOC).',
    visualClue: 'Fio auxiliar vermelho com fita isolante acoplado ao painel do CLP com anotação em papel colado com fita crepe.',
    evidenceFound: 'Forçamento de sinal lógico no sistema SCADA identificado no log de eventos às 03:14 sem MOC formal registrado no sistema.',
    regulatoryBasis: 'SGSO Capítulo 3 - Item 3.8 (Gestão de Mudanças - Alterações Temporárias em Lógicas de Segurança).',
    rootCause: 'Transmissor defeituoso gerando alarmes espúrios; equipe bypassou para evitar desarme da planta.',
    recommendedAction: 'Remoção imediata do bypass ou formalização com autorização expressa do OIM e mitigação compensatória.',
    isFound: false
  },
  {
    id: 'nc-4',
    title: 'Rota de Fuga para Baleeira nº 02 Obstruída por Cargas Soltas',
    location: 'living',
    locationName: 'Passadiço do Módulo de Acomodações - Acesso à TEMPSC-02',
    sgsoChapter: 'Capítulo 4',
    severity: 'Grave',
    description: 'Paletes contendo tambores de lubrificantes e caixas de ferramentas estocados no corredor de acesso rápido à baleeira salva-vidas estibordo.',
    visualClue: 'Corredor com largura reduzida a menos de 50 cm por cargas industriais sobre a faixa amarela demarcada.',
    evidenceFound: 'Bloqueio físico da rota de escape prioritária; violação da largura mínima de evacuação de 1,20m exigida no código LSA/SOLAS.',
    regulatoryBasis: 'SGSO Capítulo 4 - Item 4.6 (Planos de Emergência, Desobstrução de Vias de Fuga e Prontidão de Abandono).',
    rootCause: 'Falta de espaço de armazenagem temporária durante operação de transbordo de suprimentos (Supply Boat).',
    recommendedAction: 'Remoção urgente das cargas para área de armazenagem homologada e inspeção diária pelos oficiais náuticos.',
    isFound: false
  },
  {
    id: 'nc-5',
    title: 'Vazamento Hidráulico no Painel de Controle do BOP Skid',
    location: 'deck',
    locationName: 'Deck de Perfuração - BOP Control Skid (Subsea Tree Interface)',
    sgsoChapter: 'Capítulo 3',
    severity: 'Grave',
    description: 'Gotejamento persistente de fluido de controle hidráulico sintético em conexão de alta pressão do acumulador Koomey do BOP.',
    visualClue: 'Pequena poça de fluido alaranjado com manchas em bandeja de contenção transbordando próximo às mangueiras de 3.000 psi.',
    evidenceFound: 'Conexão JIC de 1/2" com torque incorreto; sensor de pressão marcando queda gradual de 300 psi na linha auxiliar.',
    regulatoryBasis: 'SGSO Capítulo 3 - Item 3.5 (Barreiras de Segurança e Integridade de Sistemas de Controle de Poço).',
    rootCause: 'Vibração contínua e desgaste prematuro de anel O-ring sem substituição preventiva.',
    recommendedAction: 'Isolamento da linha, alívio de pressão, troca da vedação e teste de estanqueidade a 1,5x a pressão de trabalho.',
    isFound: false
  },
  {
    id: 'nc-6',
    title: 'Operadores de Painel em Escala Dobrada com Risco Crítico de Fadiga',
    location: 'ccr',
    locationName: 'Sala de Controle Central (CCR) - Estações de Supervisão',
    sgsoChapter: 'Capítulo 2',
    severity: 'Moderada',
    description: 'Dois operadores de painel com registros de jornada cumprindo 16 horas consecutivas há 3 dias consecutivos devido a atraso no voo de troca de turma.',
    visualClue: 'Planilha de turnos manuais com horários rasurados e excesso de alarmes sonoros em modo silencioso.',
    evidenceFound: 'Livro de ocorrências da CCR comprova ausência de substituto qualificado e violação do limite máximo de jornada da legislação.',
    regulatoryBasis: 'SGSO Capítulo 2 - Item 2.3 (Fator Humano, Gestão de Competências, Jornada e Prevenção de Fadiga).',
    rootCause: 'Plano de contingência de substituição de tripulação ineficaz durante cancelamento de voos por névoa marítima.',
    recommendedAction: 'Acionamento de operador supervisor reserva e redistribuição imediata de tarefas para garantir 11 horas de repouso.',
    isFound: false
  },
  {
    id: 'nc-7',
    title: 'Mangueira de Abastecimento de Diesel sem Aterramento Eletrostático',
    location: 'process',
    locationName: 'Bunkering Station - Estação de Recebimento de Combustível',
    sgsoChapter: 'Capítulo 3',
    severity: 'Grave',
    description: 'Cabo de aterramento estático da estação de transferência de óleo diesel rompido na garra de fixação ao casco.',
    visualClue: 'Cabo de cobre desencapado com grampo de fixação pendurado solto no guarda-corpo sem contato com metal limpo.',
    evidenceFound: 'Resistência de aterramento medida no local pelo auditor superior a 1 megaohm (limite seguro é < 10 ohms para prevenção de centelha estática).',
    regulatoryBasis: 'SGSO Capítulo 3 - Item 3.6 (Prevenção de Eletricidade Estática e Proteção Catódica).',
    rootCause: 'Corrosão severa por maresia e falta de verificação no checklist pré-bunkering.',
    recommendedAction: 'Substituição imediata do cabo e terminal por conector certificado ATEX à prova de explosão.',
    isFound: false
  },
  {
    id: 'nc-8',
    title: 'Matriz de Risco Desatualizada após Instalação de Novo Compressor',
    location: 'living',
    locationName: 'Gabinete Técnico de Engenharia de Segurança',
    sgsoChapter: 'Capítulo 1',
    severity: 'Moderada',
    description: 'A matriz de risco geral da unidade não foi revisada após o comissionamento do compressor booster de gás combustível K-202.',
    visualClue: 'Documento impresso na parede com data de revisão de 2023, sem menção aos novos nós de HAZOP do sistema K-202.',
    evidenceFound: 'Relatório de HAZOP executado pela engenharia de terra há 8 meses nunca foi integrado ao documento de segurança oficial a bordo.',
    regulatoryBasis: 'SGSO Capítulo 1 - Item 1.3 (Avaliação Contínua de Riscos e Manutenção da Documentação de Segurança).',
    rootCause: 'Falha de comunicação entre a equipe de projetos onshore e a gerência de segurança operacional offshore.',
    recommendedAction: 'Revisão formal da matriz de risco com chancela do OIM e divulgação aos líderes de departamento.',
    isFound: false
  }
];

export const INITIAL_INTERVIEW_AVATARS: InterviewAvatar[] = [
  {
    id: 'avatar-oim',
    name: 'Comandante Roberto Vasconcelos',
    role: 'OIM - Offshore Installation Manager',
    department: 'Gerência Geral da Plataforma',
    avatarColor: 'from-amber-600 to-amber-900',
    bio: 'Mais de 22 anos de experiência em comando de FPSOs e semissubmersíveis. Responsável legal máximo pela segurança de todas as vidas e operações a bordo perante a ANP e Capitania dos Portos.',
    questions: [
      {
        id: 'q-oim-1',
        question: 'Comandante, como a gerência sênior assegura que as metas de produção não sobreponham as diretrizes de segurança operacional do SGSO?',
        response: 'Auditor, temos uma regra de ouro inegociável: qualquer colaborador do convés à sala de máquinas tem autonomia para exercer o direito de recusa (Stop Work Authority). Se houver risco intolerável, o poço fecha. No entanto, sei que a pressão por entrega de barris existe e monitoramos isso através de reuniões semanais de segurança com o comitê onshore.',
        auditClue: 'Verifique se os registros de paradas voluntárias por segurança no último ano resultaram em elogios ou se houve questionamentos velados da gerência executiva.',
        isAsked: false
      },
      {
        id: 'q-oim-2',
        question: 'Como funciona o processo de aprovação de bypasses e desvios temporários de alarmes na sala de controle?',
        response: 'Todo bypass em elemento crítico (SCE) exige um formulário formal de MOC assinado por mim e pelo coordenador de processo. Não toleramos desvios informais. Se houver algum jumper sem MOC em vigor, isso é uma falha grave de procedimento e tomarei providências imediatas.',
        auditClue: 'Aponte o bypass no transmissor LSHH-204 na CCR (NC-3) detectado durante a inspeção física!',
        revealsNCId: 'nc-3',
        isAsked: false
      },
      {
        id: 'q-oim-3',
        question: 'Qual a periodicidade e o realismo dos simulados de abandono de plataforma e homem ao mar?',
        response: 'Fazemos simulados semanais aos domingos. Alternamos cenários: fogo na praça de máquinas, vazamento de H2S no separador e colisão com supply boat. Todas as baleeiras são testadas e baixadas conforme os requisitos da NORMAM-01 e SOLAS.',
        auditClue: 'Confira as atas dos últimos 4 simulados para averiguar se a baleeira nº 02 teve acesso liberado ou se a rota estava obstruída por paletes.',
        revealsNCId: 'nc-4',
        isAsked: false
      }
    ]
  },
  {
    id: 'avatar-ops',
    name: 'Engª. Camila Fontes',
    role: 'Supervisora de Operações de Processo & Utilidades',
    department: 'Engenharia de Produção Offshore',
    avatarColor: 'from-blue-600 to-cyan-900',
    bio: 'Engenheira Química especialista em escoamento multifásico e controle de processos de alta pressão. Gerencia as equipes da sala de controle (CCR) e operadores de área.',
    questions: [
      {
        id: 'q-ops-1',
        question: 'Engenheira Camila, como sua equipe lida com alarmes repetitivos ou espúrios nos separadores de produção?',
        response: 'Nossa planta é altamente automatizada. Quando um instrumento começa a oscilar muito, nós chamamos a instrumentação para calibrar. Em situações de emergência temporária, podemos inibir alarmes secundários no painel com registro no livro de turno da CCR para não sobrecarregar os operadores.',
        auditClue: 'Examine o livro de registro de inibições lógicas e compare com a lista de MOC autorizada formalmente.',
        revealsNCId: 'nc-3',
        isAsked: false
      },
      {
        id: 'q-ops-2',
        question: 'Qual o critério adotado para liberação de Permissões de Trabalho (PT) a quente próximas a linhas de processo?',
        response: 'Exigimos teste contínuo com explosímetro calibrado, cortina d\'água se necessário, mantas antichama e um observador de fogo dedicado (Fire Watch). Nenhuma fagulha pode ser gerada a menos de 15 metros de drenos abertos ou áreas classificadas Zona 1 sem isolamento rigoroso.',
        auditClue: 'Confronte com a evidência encontrada na boca do poço P-04 (NC-2), onde havia corte e solda sem explosímetro!',
        revealsNCId: 'nc-2',
        isAsked: false
      },
      {
        id: 'q-ops-3',
        question: 'Como está o cronograma de manutenção e calibração das válvulas de alívio (PSVs) da planta de separação?',
        response: 'Temos um plano no sistema integrado de gestão com calibragem anual. A maioria das PSVs tem redundância A e B. Algumas válvulas podem ter tido atraso no envio para terra devido à logística de helicópteros no último trimestre.',
        auditClue: 'Verifique a PSV-101B do separador V-101 que foi encontrada com calibração vencida há 4 meses (NC-1).',
        revealsNCId: 'nc-1',
        isAsked: false
      }
    ]
  },
  {
    id: 'avatar-maint',
    name: 'Mestre Valmir Souza',
    role: 'Encarregado Sênior de Manutenção Mecânica & Rig Floor',
    department: 'Manutenção de Ativos & Perfuração',
    avatarColor: 'from-emerald-600 to-teal-900',
    bio: '30 anos de embarque em sondas de perfuração do Pré-Sal e Bacia de Campos. Domina sistemas de ancoragem, BOP, guindastes e bombas de lama.',
    questions: [
      {
        id: 'q-maint-1',
        question: 'Mestre Valmir, qual a rotina de testes de estanqueidade e integridade no BOP Skid e nas linhas hidráulicas?',
        response: 'Auditamos os acumuladores Koomey diariamente na passagem de turno. Testamos o fechamento de gavetas a cada poço ou após 21 dias contínuos conforme a Portaria ANP. O fluido hidráulico é inspecionado visualmente e trocamos gaxetas sempre que há sinal de queda de pressão.',
        auditClue: 'Aponte o gotejamento de fluido hidráulico e a conexão JIC com torque incorreto no BOP Skid (NC-5).',
        revealsNCId: 'nc-5',
        isAsked: false
      },
      {
        id: 'q-maint-2',
        question: 'Como vocês garantem a prevenção de eletricidade estática durante operações de transbordo e manutenção nos skids de combustível?',
        response: 'Todos os skids e mangotes possuem cabos de equipotencialização com conectores de bronze. O marinheiro de convés deve fixar o grampo antes de engatar o mangote de diesel. Por causa da salinidade intensa, esses cabos sofrem muita oxidação e trocamos periodicamente.',
        auditClue: 'Confronte com o cabo de aterramento partido e solto encontrado na Bunkering Station (NC-7).',
        revealsNCId: 'nc-7',
        isAsked: false
      }
    ]
  }
];

export const DEFAULT_EXAM_QUESTIONS: ExamQuestion[] = [
  {
    id: 'eq-1',
    question: 'De acordo com o Regulamento Técnico do SGSO da ANP, qual das alternativas define corretamente a relação de responsabilidade entre o Operador da Instalação e o Operador do Contrato?',
    options: [
      'O Operador do Contrato é o único responsável civil perante acidentes, eximindo o afretador de qualquer obrigação.',
      'Ambos respondem solidariamente pela conformidade legal, devendo o contrato de interface (Bridging Document) harmonizar os procedimentos de segurança.',
      'O Operador da Instalação tem precedência legal absoluta e não precisa submeter relatórios de SGSO à concessionária de exploração.',
      'O SGSO aplica-se exclusivamente a instalações terrestres, cabendo à Marinha a regulação total de sondas offshore.'
    ],
    correctAnswer: 1,
    explanation: 'O SGSO estabelece que tanto o operador do contrato (concessionária) quanto o operador da instalação mantêm responsabilidades solidárias e complementares, sendo o Bridging Document a ferramenta para garantir a interoperabilidade dos sistemas de gestão.',
    chapter: 'Capítulo 1 - Disposições Gerais'
  },
  {
    id: 'eq-2',
    question: 'Durante a auditoria de um FPSO, você encontra um transmissor de pressão de um separador trifásico com bypass forçado no CLP sem registro formal de MOC. Como essa constatação deve ser classificada segundo o SGSO?',
    options: [
      'Apenas uma recomendação de melhoria estética, já que o operador tem autonomia plena na sala de controle.',
      'Não-Conformidade Crítica violando o Capítulo 3 (Gestão de Mudanças e Confiabilidade de Barreiras de Segurança).',
      'Desvio leve de documentação que pode ser resolvido com anotação a lápis no diário de bordo.',
      'Conformidade aceitável se a planta estiver produzindo óleo dentro da meta programada.'
    ],
    correctAnswer: 1,
    explanation: 'Alterações em lógicas de desarme de segurança (SIS) sem Gestão de Mudança (MOC) e sem análise prévia de risco configuram uma Não-Conformidade Crítica pelo Capítulo 3 do SGSO, pois eliminam uma barreira de segurança vital contra sobrepressão e explosão.',
    chapter: 'Capítulo 3 - Instalações e Tecnologia'
  },
  {
    id: 'eq-3',
    question: 'Na norma ISO 19011:2026, qual o princípio fundamental de auditoria que garante que as constatações sejam sustentadas por fatos verificáveis e amostragens representativas?',
    options: [
      'Abordagem baseada em evidências (Evidence-based approach).',
      'Princípio da cordialidade hierárquica.',
      'Princípio da auditoria por suposição antecipada.',
      'Critério do julgamento orçamentário favorável.'
    ],
    correctAnswer: 0,
    explanation: 'A abordagem baseada em evidências é o método racional para alcançar conclusões de auditoria confiáveis e reproduzíveis em um processo de auditoria sistemático.',
    chapter: 'ISO 19011:2026 - Princípios'
  },
  {
    id: 'eq-4',
    question: 'No Capítulo 4 do SGSO (Práticas Operacionais), qual requisito é indispensável para a liberação de Permissão para Trabalho (PT) a quente em áreas com atmosfera potencialmente inflamável?',
    options: [
      'Apenas a autorização verbal do operador mais antigo da área.',
      'Medição contínua e documentada de inflamabilidade (LEL), isolamento físico e observador de fogo dedicado.',
      'Uso exclusivo de extintor de pó químico sem necessidade de testar a presença de gases combustíveis.',
      'Realização do trabalho somente durante o horário diurno, independentemente da ventilação.'
    ],
    correctAnswer: 1,
    explanation: 'O controle rigoroso de fontes de ignição exige medição contínua da concentração de gases inflamáveis (% LEL), inspeção do entorno e presença contínua de vigia de fogo (Fire Watch).',
    chapter: 'Capítulo 4 - Práticas Operacionais'
  },
  {
    id: 'eq-5',
    question: 'O que caracteriza um Elemento Crítico de Segurança e Meio Ambiente (SCE - Safety Critical Element) na gestão de integridade de ativos de P&G?',
    options: [
      'Qualquer componente cosmético que melhore a pintura e o conforto das cabines dos tripulantes.',
      'Um sistema, equipamento ou estrutura cuja falha pode causar um acidente maior ou cujo propósito seja prevenir ou mitigar as consequências de um acidente maior.',
      'Equipamentos com valor de mercado acima de 1 milhão de dólares, independente de sua função de segurança.',
      'Apenas os computadores pessoais utilizados pelo setor de compras em terra.'
    ],
    correctAnswer: 1,
    explanation: 'SCEs são equipamentos e barreiras cuja falha pode desencadear ou deixar de conter um Major Accident Hazard (ex: BOP, PSVs, ESDVs, detectores F&G, baleeiras).',
    chapter: 'Capítulo 3 - Instalações e Tecnologia'
  },
  {
    id: 'eq-6',
    question: 'Ao identificar durante a auditoria que a tripulação está realizando turnos de 16 horas sem o repouso regulamentar devido ao atraso de aeronaves, qual capítulo do SGSO é afetado?',
    options: [
      'Capítulo 1 - Disposições Tributárias.',
      'Capítulo 2 - Liderança, Pessoal e Fator Humano (Gestão de Fadiga e Competências).',
      'Capítulo 4 - Somente se houver derramamento visível de óleo no mar.',
      'Nenhum capítulo, pois o SGSO não trata de pessoas, apenas de tubulações e compressores.'
    ],
    correctAnswer: 1,
    explanation: 'O Capítulo 2 aborda explicitamente o Fator Humano, a gestão da fadiga, a preservação do bem-estar e o treinamento de competências críticas a bordo.',
    chapter: 'Capítulo 2 - Liderança e Pessoal'
  },
  {
    id: 'eq-7',
    question: 'Qual a conduta correta do Auditor Líder ao conduzir a Reunião de Abertura de uma auditoria de SGSO a bordo de uma unidade marítima?',
    options: [
      'Anunciar que o objetivo da auditoria é punir os operadores que cometeram erros para servir de exemplo.',
      'Apresentar os critérios, escopo, metodologia de amostragem, quebrar tensões e estabelecer um canal transparente de cooperação técnica.',
      'Dispensar a presença do OIM para não perder tempo e ir direto para o convés sem crachá.',
      'Exigir que todas as atividades operacionais da plataforma parem imediatamente durante os dias da auditoria.'
    ],
    correctAnswer: 1,
    explanation: 'A reunião de abertura alinha objetivos, confirma a logística de segurança do auditor a bordo e consolida o compromisso com a melhoria contínua e a preservação de vidas.',
    chapter: 'Execução e Condução de Auditorias'
  },
  {
    id: 'eq-8',
    question: 'Como deve ser redigido um apontamento formal de Não-Conformidade para que seja incontestável perante a alta administração e a fiscalização?',
    options: [
      'Apenas com opiniões subjetivas como "a manutenção parece estar desorganizada".',
      'Estruturado com Constatação Clara (fato observado) + Requisito Violado (norma/artigo) + Evidência Objetiva Comprobatória (tag, fotos, dados).',
      'Apenas anexando uma foto sem qualquer texto explicativo ou fundamentação normativa.',
      'Culpando nominalmente o técnico de menor nível hierárquico na equipe.'
    ],
    correctAnswer: 1,
    explanation: 'A fórmula inatacável de uma NC exige a tríade: Declaração do Desvio + Requisito Normativo Legal + Evidência Objetiva Auditável.',
    chapter: 'Relatórios de Impacto'
  }
];

export const DEFAULT_CERTIFICATE_TEMPLATE: CertificateTemplate = {
  id: 'template-maritime-sgi-gold',
  name: 'Certificado de Auditor Líder SGI Offshore - Modelo Ouro Executivo',
  institutionName: 'INSTITUTO BRASILEIRO DE AUDITORIA MARÍTIMA & SGI',
  institutionSubtitle: 'Centro de Excelência em Segurança Operacional de Petróleo & Gás e Sistemas Integrados de Gestão',
  institutionLogoUrl: '',
  sealLogoUrl: '',
  headerTitle: 'CERTIFICADO DE QUALIFICAÇÃO PROFISSIONAL',
  headerSubtitle: 'FORMAÇÃO DE AUDITOR LÍDER EM SISTEMAS DE GESTÃO INTEGRADOS (SGI) & SGSO OFFSHORE',
  bodyTemplate: 'Certificamos com distinção que {{nome}}, portador(a) do documento de identificação marítima nº {{cpf}}, concluiu com pleno êxito o programa de capacitação e desenvolvimento de competências técnicas em {{curso}}, totalizando carga horária comprovada de {{carga_horaria}} horas-aula, demonstrando conformidade com as diretrizes da norma ABNT NBR ISO 19011:2026 e o Regulamento Técnico de Segurança Operacional (SGSO da ANP). Aproveitamento acadêmico final avaliado em {{nota}}%.',
  courseTitle: 'Formação de Auditor Líder de SGI & SGSO Offshore (ANP / ISO 19011:2026)',
  workloadHours: 40,
  borderStyle: 'guilloche_gold',
  primaryColor: '#0b192c',
  accentColor: '#d4af37',
  backgroundPattern: 'maritime_compass',
  showBacksideProgram: true,
  signers: [
    {
      id: 'sig-1',
      name: 'Cap. Roberto Alencar, MSc.',
      role: 'Coordenador Técnico & Lead Auditor SGI',
      credential: 'CREA-RJ 201103982 | IRCA Lead Auditor 849201',
      signatureType: 'handwritten_font',
      fontStyle: 'font-script'
    },
    {
      id: 'sig-2',
      name: 'Dra. Vanessa Mendonça',
      role: 'Diretora de Certificação & Conformidade Regulatória',
      credential: 'CRQ-III 03214590 | Registro Marítimo DPC 18290',
      signatureType: 'handwritten_font',
      fontStyle: 'font-script'
    }
  ],
  qrCodeEnabled: true,
  watermarkEnabled: true,
  validationUrlPrefix: 'https://ais-pre-i6plxhjoe6qw62lhz7m7j7-458735200065.us-west1.run.app/validar?codigo='
};

export const DEFAULT_ISM_COURSE: Course = {
  id: 'ism-code-internal-auditor',
  title: 'Formação de Auditor Interno do Código ISM (International Safety Management)',
  subtitle: 'Código Internacional de Gestão para a Operação Segura de Navios e Prevenção da Poluição no Mar (SOLAS / IMO)',
  workloadHours: 40,
  targetAudience: 'Comandantes, Oficiais de Náutica e Máquinas, Gerentes de Frota, DPAs (Designated Person Ashore), Inspetores Navais e Auditores Internos de Armadores e Empresas de Navegação.',
  instructorName: 'Cap. de Mar e Guerra (RM1) Fernando Silveira',
  instructorRole: 'Lead Auditor Marítimo ISM/ISPS Code • Especialista em Segurança da Navegação IMO',
  instructorCredential: 'CIR 098421-3 • DPC Registro Marítimo 14092 • IRCA Maritime Auditor 774102',
  regulatoryFramework: [
    'Convenção SOLAS 1974 - Capítulo IX (Management for the Safe Operation of Ships)',
    'Código ISM (Resoluções IMO A.741(18), MSC.104(73), MSC.179(79) e MSC.273(85))',
    'ABNT NBR ISO 19011:2026 (Diretrizes para Auditoria de Sistemas de Gestão)',
    'NORMAM-01 e NORMAM-02 (Diretoria de Portos e Costas - Marinha do Brasil)',
    'Convenções MARPOL 73/78 e STCW 1978/2010 (Normas de Treinamento e Guarda dos Marítimos)'
  ],
  description: 'Capacitação completa e prática para a formação de auditores internos do Sistema de Gestão da Segurança (SMS/SGS) conforme exigências mandatórias do Código ISM da Organização Marítima Internacional (IMO) e Convenção SOLAS. Focado em auditorias a bordo e em terra, verificação de conformidade de DOC/SMC, integridade de equipamentos críticos e atuação do DPA.',
  modules: [
    {
      id: 'ism-mod-1',
      number: 1,
      title: 'Origem, Evolução e Arcabouço Jurídico do Código ISM',
      subtitle: 'Histórico da IMO, Convenção SOLAS Capítulo IX e Responsabilidade dos Armadores',
      badge: 'Fundamentos Marítimos',
      description: 'Compreensão da gênese do Código ISM após os grandes desastres marítimos, estrutura legal do Capítulo IX da SOLAS e o papel da Autoridade Marítima e Sociedades Classificadoras.',
      educationalVideos: [
        {
          id: 'vid-ism-1',
          title: 'Masterclass: Do Herald of Free Enterprise à Criação Mandatória do Código ISM',
          description: 'Análise forense dos acidentes que mudaram a história da navegação mundial e tornaram o Código ISM mandatório pela IMO.',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          durationMinutes: 35,
          tags: ['Código ISM', 'SOLAS', 'IMO', 'Segurança Náutica'],
          addedAt: '11/10/2026'
        }
      ],
      lessons: [
        {
          id: 'ism-les-1-1',
          title: 'Histórico dos Grandes Sinistros Navais e a Resolução IMO A.741(18)',
          durationMinutes: 45,
          summary: 'Como as falhas sistêmicas de gestão em terra e a bordo levaram à criação de um código internacional de gestão mandatória.',
          technicalDetails: [
            'O desastre do Herald of Free Enterprise (1987) e a constatação da culpa corporativa da administração em terra.',
            'Acidentes do Scandinavian Star (1990) e Estonia (1994) e a aceleração da obrigatoriedade do Código ISM.',
            'Entrada em vigor do Capítulo IX da Convenção Internacional SOLAS em 1998 e 2002 para todos os tipos de embarcações comerciais.',
            'Objetivos fundamentais do ISM: Segurança no Mar, Prevenção de Danos a Vidas e Prevenção da Poluição Ambiental (especialmente MARPOL).'
          ],
          practicalChecklist: [
            'Verificar a data de homologação do Sistema de Gestão da Segurança da Companhia.',
            'Checar se o escopo do SMS contempla todos os tipos de navios operados pela frota.',
            'Conferir a existência de exemplares vigentes do Código ISM e SOLAS a bordo.'
          ]
        },
        {
          id: 'ism-les-1-2',
          title: 'Papel do Estado de Bandeira (Flag State) e Estado do Porto (Port State Control)',
          durationMinutes: 50,
          summary: 'Diferenças de atuação entre Flag State, Sociedades Classificadoras (RO - Recognized Organizations) e fiscais de Port State Control.',
          technicalDetails: [
            'Autoridade Marítima Brasileira (DPC e Capitanias dos Portos) e fiscalização do Código ISM sob a NORMAM.',
            'Delegação de competência para Organizações Reconhecidas (DNV, Bureau Veritas, ABS, Lloyd\'s Register).',
            'Auditorias de Port State Control (Paris MoU, Tóquio MoU, Acordo de Viña del Mar): critérios para retenção de navios por falhas graves de ISM.'
          ],
          practicalChecklist: [
            'Checar o histórico de inspeções de PSC dos últimos 24 meses do navio.',
            'Conferir o registro de delegação de autoridade entre o Estado de Bandeira e a Sociedade Classificadora.'
          ]
        }
      ]
    },
    {
      id: 'ism-mod-2',
      number: 2,
      title: 'O Sistema de Gestão da Segurança (SMS) e a Figura do DPA',
      subtitle: 'Política de Segurança, Proteção Ambiental e o Elo Crítico entre Terra e Bordo',
      badge: 'Estrutura do SMS',
      description: 'Análise da formulação da Política de Segurança, os requisitos do DPA (Designated Person Ashore) e a autoridade soberana do Comandante.',
      educationalVideos: [
        {
          id: 'vid-ism-2',
          title: 'O Papel Estratégico do DPA (Designated Person Ashore) e a Autoridade do Comandante',
          description: 'Como o DPA garante a ligação direta com a diretoria do armador e audita os recursos humanos e materiais da frota.',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          durationMinutes: 40,
          tags: ['DPA', 'Comandante', 'SMS', 'Responsabilidade'],
          addedAt: '11/10/2026'
        }
      ],
      lessons: [
        {
          id: 'ism-les-2-1',
          title: 'A Política de Segurança e Proteção Ambiental (Seção 2 do ISM)',
          durationMinutes: 40,
          summary: 'Como auditar se a política corporativa é praticada ativamente pela tripulação ou se é apenas uma declaração estática na antepara.',
          technicalDetails: [
            'Requisitos obrigatórios da política: compromisso com melhoria contínua, zero acidentes e zero poluição.',
            'Divulgação obrigatória a bordo e em terra no idioma de trabalho compreendido por todos os tripulantes.',
            'Evidências de liderança da alta direção no fornecimento de recursos orçamentários adequados para a manutenção e segurança.'
          ],
          practicalChecklist: [
            'Entrevistar marinheiros de convés e praça de máquinas sobre a política de segurança no seu idioma materno.',
            'Verificar a data de revisão da política assinada pelo Diretor Presidente do Armador.'
          ]
        },
        {
          id: 'ism-les-2-2',
          title: 'Responsabilidades da Companhia e a Designação Mandatória do DPA (Seção 4)',
          durationMinutes: 55,
          summary: 'Qualificação, competência e responsabilidade legal da Pessoa Designada em Terra (DPA).',
          technicalDetails: [
            'Obrigação da Companhia de designar formalmente uma pessoa ou equipe em terra com acesso direto à Diretoria Executiva.',
            'Monitoramento pelo DPA da segurança e prevenção da poluição em cada navio da frota.',
            'Auditoria da cadeia de comunicação de emergência 24/7 entre o navio no mar e o gabinete de crise em terra.'
          ],
          practicalChecklist: [
            'Inspecionar o documento formal de designação do DPA e seu substituto homologado.',
            'Testar a linha de comunicação telefônica e satelital de emergência direta do Comandante para o DPA.',
            'Verificar as qualificações marítimas e cursos de reciclagem periódica do DPA.'
          ]
        },
        {
          id: 'ism-les-2-3',
          title: 'A Autoridade Soberana e Responsabilidade do Comandante (Seção 5)',
          durationMinutes: 50,
          summary: 'O princípio da Overriding Authority do Comandante garantido pelo Código ISM e SOLAS.',
          technicalDetails: [
            'A autoridade suprema e responsabilidade mandatória do Comandante para tomar decisões necessárias à salvaguarda da vida e segurança do navio.',
            'Proibição expressa de pressões comerciais de afretadores e proprietários que comprometam a segurança da navegação.',
            'Obrigação da Companhia em deixar clara por escrito a Overriding Authority no SMS do navio.'
          ],
          practicalChecklist: [
            'Checar a declaração explícita de Overriding Authority no manual de bordo.',
            'Entrevistar o Comandante sobre situações de recusa de manobra por condições meteorológicas adversas.'
          ]
        }
      ]
    },
    {
      id: 'ism-mod-3',
      number: 3,
      title: 'Recursos, Pessoal e Práticas Operacionais de Bordo',
      subtitle: 'Conformidade STCW, Familiarização, Procedimentos Críticos e Manuseio de Carga',
      badge: 'Operações Navais',
      description: 'Auditoria de competências da tripulação, certificados de habilitação náutica, plano de passagem de serviço e procedimentos operacionais padronizados.',
      lessons: [
        {
          id: 'ism-les-3-1',
          title: 'Qualificação, Dotação de Pessoal e Familiarização (Seção 6)',
          durationMinutes: 50,
          summary: 'Auditoria da tripulação sob o Cartão de Lotação de Segurança (Safe Manning Document) e Código STCW.',
          technicalDetails: [
            'Verificação do Safe Manning Document emitido pela Autoridade Marítima.',
            'Procedimento mandatória de familiarização para tripulantes recém-embarcados antes do início do primeiro quarto de serviço.',
            'Língua de trabalho oficial a bordo e capacidade efetiva de comunicação entre oficiais e subalternos durante emergências.'
          ],
          practicalChecklist: [
            'Amostragem de 5 fichas de familiarização de bordo de tripulantes novatos.',
            'Conferência dos certificados de competência STCW e exames médicos marítimos (ASO e PSTM) em dia.',
            'Verificação do controle de horas de descanso (Work & Rest Hours) contra a fadiga marítima.'
          ]
        },
        {
          id: 'ism-les-3-2',
          title: 'Desenvolvimento de Planos para Operações de Bordo (Seção 7)',
          durationMinutes: 60,
          summary: 'Auditoria de planos de viagem (Passage Planning), operações de praça de máquinas, manobras e controle de carga.',
          technicalDetails: [
            'Planejamento de viagem de cais a cais (Berth-to-Berth Passage Plan) homologado nas cartas náuticas e ECDIS.',
            'Procedimentos para operações críticas: navegação em águas restritas, visibilidade reduzida, bunkering e manobras pesadas.',
            'Sistemas de Permissão para Trabalho náuticas (PT): entrada em espaço confinado, trabalho a quente e trabalho sobre o mar.'
          ],
          practicalChecklist: [
            'Inspecionar o último Passage Plan assinado pelos Oficiais de Quarto e Comandante.',
            'Verificar o checklist de abastecimento de combustível (Bunkering Checklist) e conferência de amostras MARPOL.'
          ]
        }
      ]
    },
    {
      id: 'ism-mod-4',
      number: 4,
      title: 'Prontidão para Emergências e Resposta a Incidentes',
      subtitle: 'Planos de Contingência, Simulados de Bordo, SOPEP e Notificação de Quase-Acidentes',
      badge: 'Emergência & Notificação',
      description: 'Como auditar a resposta a cenários extremos no mar (incêndio, colisão, homem ao mar, abandono, alagamento) e o reporte de desvios operacionais.',
      lessons: [
        {
          id: 'ism-les-4-1',
          title: 'Planos e Simulados de Prontidão para Emergências (Seção 8)',
          durationMinutes: 55,
          summary: 'Auditoria do calendário e eficácia prática dos simulados de bordo exigidos pela SOLAS e ISM.',
          technicalDetails: [
            'Tabela Mestra de Postos de Emergência (Muster List) atualizada com as funções de cada tripulante.',
            'Cronograma de exercícios semanais e mensais: Abandono de navio, Combate a Incêndio, Resgate de Homem ao Mar e Encalhe.',
            'Exercício anual conjunto de emergência entre o navio e a equipe de crise em terra (Emergency Response Team).'
          ],
          practicalChecklist: [
            'Conferir as atas dos simulados nos últimos 6 meses no Livro de Registro de Bordo.',
            'Verificar se todos os botes de resgate e baleeiras foram baixados e testados operacionalmente no prazo legal.'
          ]
        },
        {
          id: 'ism-les-4-2',
          title: 'Relatórios e Análises de Não-Conformidades e Quase-Acidentes (Seção 9)',
          durationMinutes: 50,
          summary: 'Investigação de causas-raízes e cultura de reporte justo sem retaliação a bordo.',
          technicalDetails: [
            'Fluxo formal de notificação de quase-acidentes (Near-Miss) do navio para o DPA e armador.',
            'Metodologias de análise de causa-raiz para evitar a repetição de acidentes na frota.',
            'Acompanhamento do encerramento das Ações Corretivas no sistema integrado de gestão.'
          ],
          practicalChecklist: [
            'Verificar o log de notificações de desvios dos últimos 12 meses.',
            'Avaliar a qualidade das análises de causa-raiz e o cumprimento dos prazos de correção estipulados pelo DPA.'
          ]
        }
      ]
    },
    {
      id: 'ism-mod-5',
      number: 5,
      title: 'Manutenção do Navio, Equipamentos Críticos e Integridade Técnica',
      subtitle: 'Seção 10 do Código ISM: Planos Preventivos, Vistorias de Classe e Testes de Confiabilidade',
      badge: 'Manutenção & Classe',
      description: 'Auditoria do plano de manutenção do armador, identificação de equipamentos cuja falha súbita pode comprometer a navegabilidade e testes de sobressalentes.',
      lessons: [
        {
          id: 'ism-les-5-1',
          title: 'Equipamentos e Sistemas Críticos de Bordo (Critical Equipment)',
          durationMinutes: 60,
          summary: 'Identificação e critérios de confiabilidade de equipamentos vitais para a sobrevivência do navio.',
          technicalDetails: [
            'Definição formal de Equipamento Crítico: Máquina do Leme (Steering Gear), Gerador de Emergência, Bombas de Incêndio de Emergência e Navegação Auxiliar.',
            'Procedimento para realização de testes de prontidão operacionais periódicos em equipamentos stand-by.',
            'Estoque mínimo obrigatório de sobressalentes críticos a bordo para travessias oceânicas.'
          ],
          practicalChecklist: [
            'Checar a lista oficial homologada de Equipamentos Críticos do navio.',
            'Inspecionar o registro de teste semanal de partida automática do Gerador de Emergência sob carga.'
          ]
        },
        {
          id: 'ism-les-5-2',
          title: 'Plano de Manutenção Preventiva e Inspeções do Armador',
          durationMinutes: 50,
          summary: 'Auditoria de ordens de serviço no software de manutenção planejada (PMS) e controle de corrosão.',
          technicalDetails: [
            'Rastreabilidade entre as recomendações dos fabricantes e a frequência de intervenções preventivas.',
            'Inspeções estruturais de tanques de lastro e espaço duplo fundo contra corrosão severa.',
            'Gestão de anomalias e histórico de manutenções vencidas com justificativa técnica formal aprovada pelo Superintendente Técnico.'
          ],
          practicalChecklist: [
            'Examinar no sistema informatizado a taxa de ordens de serviço de manutenção preventiva atrasadas.',
            'Conferir relatórios de calibração de instrumentos de navegação e equipamentos de detecção de gases da praça de bombas.'
          ]
        }
      ]
    },
    {
      id: 'ism-mod-6',
      number: 6,
      title: 'Documentação, Verificação e Certificação ISM (DOC & SMC)',
      subtitle: 'Controle de Documentos, Emissão de Certificados e Ciclo de Auditorias Oficiais',
      badge: 'Certificação & DOC/SMC',
      description: 'Entendimento detalhado dos dois certificados oficiais do Código ISM: Document of Compliance (DOC) e Safety Management Certificate (SMC).',
      lessons: [
        {
          id: 'ism-les-6-1',
          title: 'Document of Compliance (DOC) e Safety Management Certificate (SMC)',
          durationMinutes: 50,
          summary: 'Como funciona o processo de certificação do armador em terra e de cada navio individual no mar.',
          technicalDetails: [
            'O DOC (Document of Compliance): emitido para a Companhia em terra pelo Estado de Bandeira; validade máxima de 5 anos com endosso anual obrigatório.',
            'O SMC (Safety Management Certificate): emitido para cada navio individual; validade de 5 anos com auditoria intermediária obrigatória entre o 2º e 3º ano.',
            'Condição essencial: o navio só pode ter um SMC válido se a Companhia mantiver um DOC válido para aquele tipo específico de navio.',
            'SMC Provisório (Interim SMC): regras de emissão para navios recém-construídos ou mudança de armador/bandeira.'
          ],
          practicalChecklist: [
            'Verificar a via original do SMC mantida a bordo com os endossos intermediários válidos.',
            'Conferir a cópia autenticada do DOC da empresa guardada no passadiço e se o tipo de navio consta no escopo.'
          ]
        },
        {
          id: 'ism-les-6-2',
          title: 'Controle de Documentos e Dados do SMS (Seção 11)',
          durationMinutes: 45,
          summary: 'Garantir que apenas procedimentos atualizados e homologados estejam em uso a bordo e em terra.',
          technicalDetails: [
            'Procedimento de controle de versão, distribuição de manuais físicos e digitais.',
            'Recolhimento e destruição de procedimentos obsoletos nas estações de trabalho do navio.',
            'Acesso rápido a manuais de emergência e cartas náuticas em formatos homologados.'
          ],
          practicalChecklist: [
            'Conferir a lista mestra de documentos vigentes (Master Document Index).',
            'Verificar se há cópias não controladas de procedimentos operacionais coladas em painéis da praça de máquinas.'
          ]
        }
      ]
    },
    {
      id: 'ism-mod-7',
      number: 7,
      title: 'Diretrizes Práticas para Auditoria Interna do Código ISM (ISO 19011)',
      subtitle: 'Planejamento, Condução a Bordo, Redação de Não-Conformidades e Reuniões com o Comandante',
      badge: 'Metodologia de Auditoria',
      description: 'Como planejar e executar uma auditoria interna naval com base na norma ISO 19011:2026 adaptada às particularidades da rotina de bordo.',
      lessons: [
        {
          id: 'ism-les-7-1',
          title: 'Planejamento e Elaboração de Checklists de Auditoria Naval',
          durationMinutes: 55,
          summary: 'Como preparar a auditoria antes do embarque, definindo escopo, cronograma náutico e amostragem representativa.',
          technicalDetails: [
            'Adaptação do cronograma de auditoria à rotina de porto, manobra e navegação em mar aberto.',
            'Elaboração de listas de verificação focadas em processos críticos e no SMS do armador, e não apenas em itens visuais de pintura.',
            'Coordenação prévia com o Comandante e Chefe de Máquinas para disponibilidade dos oficiais sem sobrecarregar a vigília.'
          ],
          practicalChecklist: [
            'Elaborar o plano de auditoria interna 15 dias antes da escala do navio.',
            'Preparar trilhas de auditoria para áreas de alto risco: Passadiço, Praça de Máquinas, Convés de Carga e Acomodações.'
          ]
        },
        {
          id: 'ism-les-7-2',
          title: 'Condução da Auditoria a Bordo e Coleta de Evidências Objetivas',
          durationMinutes: 60,
          summary: 'Reunião de abertura com os Oficiais, entrevistas investigativas e triangulação de evidências a bordo.',
          technicalDetails: [
            'Técnicas de questionamento abertas para evitar intimidação dos marítimos.',
            'Triangulação documental: conferência entre ordens de serviço no computador, registros manuscritos no diário de bordo e a operação física observada.',
            'Diferenciação clara entre: Não-Conformidade Maior (Major Non-Conformity - desvio grave que ameaça a segurança do navio e exige ação corretiva imediata), Não-Conformidade Menor e Observação.'
          ],
          practicalChecklist: [
            'Registrar data, hora exata, localização no navio e evidência documental incontestável para cada apontamento.',
            'Obter concordância do chefe de departamento no momento da constatação do desvio.'
          ]
        },
        {
          id: 'ism-les-7-3',
          title: 'Reunião de Encerramento e Relatório de Auditoria ISM',
          durationMinutes: 50,
          summary: 'Apresentação formal de conclusões para o Comandante e envio do relatório final para o DPA e gerência do armador.',
          technicalDetails: [
            'Condução da reunião de encerramento no salão do Comandante com postura executiva e construtiva.',
            'Redação de Não-Conformidades segundo a tríade: Declaração da Falha + Requisito Violado do Código ISM + Evidência Objetiva Comprovada.',
            'Estabelecimento de prazos viáveis para resposta do Plano de Ação Corretiva (CAP) antes da próxima auditoria externa.'
          ],
          practicalChecklist: [
            'Colher a assinatura formal do Comandante no Relatório de Resumo de Auditoria antes do desembarque.',
            'Encaminhar relatório completo ao DPA em até 72 horas após a conclusão da auditoria.'
          ]
        }
      ]
    },
    {
      id: 'ism-mod-8',
      number: 8,
      title: 'Avaliação de Competência e Certificação do Auditor Interno ISM',
      subtitle: 'Exame de Qualificação Profissional, Resolução de Casos e Emissão do Certificado Oficial',
      badge: 'Certificação Final',
      description: 'Validação final de aptidão para atuar como Auditor Interno do Código ISM com prova prática de classificação de desvios marítimos e emissão de certificado oficial.',
      lessons: [
        {
          id: 'ism-les-8-1',
          title: 'Avaliação Teórico-Prática de Auditoria do Código ISM',
          durationMinutes: 60,
          summary: 'Prova com casos práticos para classificação de Não-Conformidades Maiores, Menores e elaboração de ações preventivas.',
          technicalDetails: [
            'Exame focado na aplicação dos itens mandatórios do Código ISM (1 a 12).',
            'Critério de aprovação: aproveitamento mínimo de 70% para emissão do certificado de Auditor Interno.',
            'Feedback detalhado fundamentado nas resoluções da IMO e diretrizes da ISO 19011:2026.'
          ],
          practicalChecklist: [
            'Revisar os capítulos do SMS e diretrizes de auditoria interna.',
            'Realizar a avaliação e emitir o Certificado Oficial com código de autenticidade rastreável.'
          ],
          specialType: 'EXAM'
        }
      ]
    }
  ]
};

export const DEFAULT_ISM_CERTIFICATE_TEMPLATE: CertificateTemplate = {
  id: 'template-ism-code-gold',
  name: 'Certificado de Auditor Interno do Código ISM - Modelo Náutico Oficial',
  institutionName: 'INSTITUTO BRASILEIRO DE AUDITORIA MARÍTIMA & NAVEGAÇÃO',
  institutionSubtitle: 'Centro de Capacitação em Segurança da Navegação, Código ISM da IMO e Sistemas de Gestão da Segurança',
  institutionLogoUrl: '',
  sealLogoUrl: '',
  headerTitle: 'CERTIFICADO DE QUALIFICAÇÃO PROFISSIONAL',
  headerSubtitle: 'FORMAÇÃO DE AUDITOR INTERNO DO CÓDIGO ISM (INTERNATIONAL SAFETY MANAGEMENT CODE - IMO / SOLAS)',
  bodyTemplate: 'Certificamos com distinção que {{nome}}, portador(a) do documento nº {{cpf}}, concluiu com pleno aproveitamento o programa de capacitação e desenvolvimento de competências técnicas em {{curso}}, totalizando carga horária comprovada de {{carga_horaria}} horas-aula, demonstrando conformidade estrita com o Código ISM (Resolução IMO A.741(18)), a Convenção Internacional SOLAS (Capítulo IX) e as diretrizes da norma ABNT NBR ISO 19011:2026. Aproveitamento acadêmico final avaliado em {{nota}}%.',
  courseTitle: 'Formação de Auditor Interno do Código ISM (International Safety Management - IMO / SOLAS)',
  workloadHours: 40,
  borderStyle: 'maritime_navy',
  primaryColor: '#0c2d48',
  accentColor: '#d4af37',
  backgroundPattern: 'maritime_compass',
  showBacksideProgram: true,
  signers: [
    {
      id: 'sig-ism-1',
      name: 'Cap. de Mar e Guerra (RM1) Fernando Silveira',
      role: 'Instrutor Chefe & Lead Auditor ISM/ISPS Code',
      credential: 'CIR 098421-3 • DPC Registro Marítimo 14092',
      signatureType: 'handwritten_font',
      fontStyle: 'font-script'
    },
    {
      id: 'sig-ism-2',
      name: 'Dra. Vanessa Mendonça',
      role: 'Diretora de Conformidade Regulatória & Certificação',
      credential: 'CRQ-III 03214590 • Registro Marítimo DPC 18290',
      signatureType: 'handwritten_font',
      fontStyle: 'font-script'
    }
  ],
  qrCodeEnabled: true,
  watermarkEnabled: true,
  validationUrlPrefix: 'https://ais-pre-i6plxhjoe6qw62lhz7m7j7-458735200065.us-west1.run.app/validar?codigo='
};

export const DEFAULT_STUDENTS: StudentUser[] = [
  {
    id: 'stud-1',
    name: 'Eng. Leonardo Vasconcelos Ribeiro',
    email: 'leonardo.ribeiro@petrosgi.com.br',
    document: '084.721.905-32 (CIR: 201889-4)',
    username: 'aluno',
    password: '123',
    isActive: true,
    enrolledCourseIds: ['sgso-sgi-auditor-master', 'ism-code-internal-auditor'],
    createdAt: '01/10/2026',
    notes: 'Acesso total liberado pelo Gestor para ambos os treinamentos marítimos.'
  },
  {
    id: 'stud-2',
    name: '1º Oficial de Náutica Marina Costa e Silva',
    email: 'marina.costa@navegacao.com.br',
    document: '119.843.201-90 (CIR: 310928-1)',
    username: 'marina.costa',
    password: 'ism2026',
    isActive: true,
    enrolledCourseIds: ['ism-code-internal-auditor'],
    createdAt: '05/10/2026',
    notes: 'Matrícula específica para Auditor Interno do Código ISM.'
  },
  {
    id: 'stud-3',
    name: 'Inspetor Técnico Carlos Eduardo Mello',
    email: 'carlos.mello@petrosgi.com.br',
    document: '230.912.448-77 (CREA: 20188219)',
    username: 'carlos.mello',
    password: 'sgso2026',
    isActive: true,
    enrolledCourseIds: ['sgso-sgi-auditor-master'],
    createdAt: '08/10/2026',
    notes: 'Matrícula autorizada para Auditor Líder de SGI e SGSO Offshore.'
  }
];

