export default {
  "source.source-pen": "Edite pontos de volume na forma de onda de origem e pontos de curva no Lab. Clique novamente para voltar a selecionar trechos.",
  "source.source-eraser": "Exclui um ponto de volume ou de curva. Os trechos de áudio são preservados.",
  "source.zoom-out": "Mostra um trecho mais amplo da forma de onda de origem.",
  "source.zoom-in": "Mostra um trecho menor da forma de onda de origem em mais detalhe.",
  "source.zoom-fit": "Mostra toda a forma de onda de origem.",
  "source.undo-edit": "Desfaz a última edição no áudio de origem.",
  "source.redo-edit": "Refaz a última edição desfeita no áudio de origem.",
  "source.volume-reset": "Restaura o envelope de volume da origem a 0 dB.",
  "source.delete": "Exclui o trecho selecionado do áudio de origem e une os trechos restantes.",
  "tab.audio": "Ajusta a velocidade de reprodução, o tom e o panorama estéreo.",
  "tab.timbre": "Modela o timbre com filtros e uma cadeia de efeitos.",
  "tab.space": "Move o som no espaço e ajusta a distância e a reverberação.",
  "tab.granular": "Cria som a partir de grãos curtos do áudio de origem.",
  "tab.spectral": "Transforma o conteúdo de frequências do áudio de origem.",
  "tab.oscillator": "Ressintetiza um arquivo ou gera som com osciladores e uma resposta a impulso opcional.",
  "tab.handoff": "Ao trocar de Lab, uma nova etapa é salva se o processamento tiver mudado.",
  "lab.clearCurrent": "Restaura os valores padrão da curva selecionada.",
  "audio.resetButton": "Restaura as curvas padrão de velocidade, tom e panorama.",
  "audio.stretchHelp": [
    "Velocidade · −2× a +2×",
    "Altera a velocidade de reprodução da fonte. Valores negativos invertem o som e zero congela a posição da fonte."
  ],
  "audio.pitchHelp": [
    "Tom · −2400 a +2400 cents",
    "Aumenta ou reduz o tom em até duas oitavas. 1200 cents equivalem a uma oitava."
  ],
  "audio.panHelp": [
    "Panorama · Esquerda / Direita",
    "Move o som no campo estéreo. Alto = esquerda · centro = centro · baixo = direita."
  ],
  "timbre.resetButton": "Restaura todas as curvas, desativa todos os efeitos e limpa a cadeia.",
  "timbre.lowpassModeHelp": [
    "Passa-baixas · 40 Hz–18 kHz",
    "Define a frequência de corte e atenua as frequências acima dela. O limite máximo diminui com taxas de amostragem de processamento menores."
  ],
  "timbre.highpassModeHelp": [
    "Passa-altas · 40 Hz–18 kHz",
    "Define a frequência de corte e atenua as frequências abaixo dela. O limite máximo diminui com taxas de amostragem de processamento menores."
  ],
  "timbre.bandpassModeHelp": [
    "Passa-faixa",
    "Mantém uma faixa em torno da frequência central. Ajuste a frequência central e a largura separadamente."
  ],
  "timbre.combModeHelp": [
    "Filtro pente",
    "Combina a saída original com um sinal atrasado e realimentado para criar um filtro pente ressonante."
  ],
  "timbre.flangerModeHelp": [
    "Flanger",
    "Modula um atraso curto para mover os entalhes do filtro pente. Ajuste o atraso, a profundidade, a taxa, a realimentação e a mistura."
  ],
  "timbre.chorusModeHelp": [
    "Chorus",
    "Modula vozes atrasadas para encorpar o som. Ajuste o atraso, a profundidade, a taxa e a mistura."
  ],
  "timbre.delayModeHelp": [
    "Delay",
    "Cria ecos repetidos. Ajuste o tempo de atraso, a realimentação e a mistura."
  ],
  "timbre.bandpassCenterParamHelp": [
    "Frequência central · 40 Hz–18 kHz",
    "Move o centro do filtro passa-faixa. O limite máximo diminui com taxas de amostragem de processamento menores."
  ],
  "timbre.bandpassWidthParamHelp": [
    "Largura · 0–100%",
    "Alarga a faixa de passagem. 0% é estreita (Q 12) e 100% é larga (Q 0.5). O filtro continua ativo em todo o intervalo."
  ],
  "timbre.combDelayParamHelp": [
    "Atraso do filtro pente · 0.5–100 ms",
    "Define o atraso que determina o espaçamento entre as ressonâncias do filtro pente."
  ],
  "timbre.combFeedbackParamHelp": [
    "Realimentação do filtro pente · 0–0.95",
    "Devolve parte do sinal atrasado ao atraso. Valores maiores sustentam as ressonâncias por mais tempo."
  ],
  "timbre.combMixParamHelp": [
    "Quantidade do filtro pente · 0–100%",
    "0% é o sinal original. 100% é o sinal filtrado, que inclui o som original e o atrasado."
  ],
  "timbre.flangerDelayParamHelp": [
    "Atraso do flanger · 0.5–10 ms",
    "Define o atraso central da varredura de modulação."
  ],
  "timbre.flangerDepthParamHelp": [
    "Profundidade do flanger · 0–10 ms",
    "Define a profundidade solicitada da varredura. A profundidade efetiva é limitada ao atraso menos 0.25 ms."
  ],
  "timbre.flangerRateParamHelp": [
    "Taxa do flanger · 0.02–5 Hz",
    "Define quantos ciclos de modulação ocorrem por segundo."
  ],
  "timbre.flangerFeedbackParamHelp": [
    "Realimentação do flanger · 0–0.85",
    "Realimenta o som atrasado para reforçar a ressonância da varredura."
  ],
  "timbre.flangerMixParamHelp": [
    "Mistura do flanger · 0–100%",
    "Equilibra o som original e o atrasado. 0% é original e 100% é processado."
  ],
  "timbre.chorusDelayParamHelp": [
    "Atraso do chorus · 10–35 ms",
    "Define o atraso base das vozes do chorus."
  ],
  "timbre.chorusDepthParamHelp": [
    "Profundidade do chorus · 0–20 ms",
    "Define a profundidade solicitada da varredura. A profundidade efetiva é limitada ao atraso menos 5 ms."
  ],
  "timbre.chorusRateParamHelp": [
    "Taxa do chorus · 0.02–3 Hz",
    "Define a velocidade de modulação do chorus em ciclos por segundo."
  ],
  "timbre.chorusMixParamHelp": [
    "Mistura do chorus · 0–100%",
    "Equilibra o som original e o chorus. 0% é original e 100% é processado."
  ],
  "timbre.delayTimeParamHelp": [
    "Tempo de atraso · 100 ms–1.5 s",
    "Define o intervalo entre os ecos."
  ],
  "timbre.delayFeedbackParamHelp": [
    "Realimentação do delay · 0–0.85",
    "Ajusta quanto do som atrasado volta ao atraso para se repetir."
  ],
  "timbre.delayMixParamHelp": [
    "Mistura do delay · 0–100%",
    "Equilibra o som original e os ecos. 0% é original e 100% é processado."
  ],
  "space.resetButton": "Restaura todas as curvas, ativa Direção, desativa Distância e Reverberação e define o decaimento em 1.2 s.",
  "space.reverbDecay": "Ajusta o tempo de decaimento da reverberação de 0.3 a 4 s.",
  "space.directionModeHelp": [
    "Direção · −1800° a +1800°",
    "Move o som ao redor do ouvinte. Positivo = horário, negativo = anti-horário. 360° é uma volta completa."
  ],
  "space.distanceModeHelp": [
    "Distância · 0–1",
    "Vai de perto (0) a longe (1), alterando o nível, a filtragem e a impressão espacial. A escala é relativa, sem calibração em metros."
  ],
  "space.reverbModeHelp": [
    "Quantidade de reverberação · 0–100%",
    "Desenha quanto som é enviado à reverberação. O decaimento é ajustado separadamente (0.3–4 s). A cauda termina junto com o arquivo."
  ],
  "granular.resetButton": "Restaura todas as curvas e retorna a janela da fonte ao início com a duração mínima.",
  "granular.positionModeHelp": [
    "Posição de leitura · 0–100% da janela da fonte",
    "Escolhe onde os grãos começam na janela da fonte selecionada. O tempo de reprodução da saída permanece igual."
  ],
  "granular.spreadModeHelp": [
    "Dispersão · 0–100%",
    "Varia aleatoriamente as posições de leitura dos grãos em torno da posição de leitura, dentro da janela selecionada."
  ],
  "granular.sizeModeHelp": [
    "Tamanho do grão · 5–1000 ms",
    "Define a duração solicitada do grão. Com o tom atual, ela pode ser reduzida para caber na janela da fonte."
  ],
  "granular.densityModeHelp": [
    "Densidade · 1–80 grãos/s",
    "Define os novos grãos por segundo. A prévia limita os grãos ativos a 64, ou a 32 com densidade ou tamanho altos, com breves fades. A renderização processa todos os grãos programados."
  ],
  "granular.pitchLowModeHelp": [
    "Tom inferior · −24 a +24 semitons",
    "Define um extremo do intervalo aleatório de tom dos grãos. Se o limite inferior ultrapassar o superior, os limites são trocados."
  ],
  "granular.pitchHighModeHelp": [
    "Tom superior · −24 a +24 semitons",
    "Define o outro extremo do intervalo aleatório de tom. 12 semitons equivalem a uma oitava. O tom também altera a velocidade de leitura do grão."
  ],
  "spectral.resetButton": "Restaura os valores padrão de todas as curvas espectrais.",
  "spectral.shiftModeHelp": [
    "Deslocamento espectral · −2000 a +2000 Hz",
    "Desloca as frequências espectrais por um valor fixo em Hz. 0 Hz mantém suas posições."
  ],
  "spectral.stretchModeHelp": [
    "Expansão espectral · 0.5–2",
    "Comprime ou expande o espaçamento entre frequências em torno de 1 kHz. 1 é neutro. A velocidade de reprodução e a duração são preservadas."
  ],
  "spectral.blurModeHelp": [
    "Suavização espectral · 0–100%",
    "Suaviza as mudanças espectrais ao longo do tempo. 0% é neutro. As posições de frequência e a duração do arquivo são preservadas."
  ],
  "spectral.harmonicityModeHelp": [
    "Harmonicidade · −100% a +100%",
    "Altera as relações entre picos. Valores negativos aproximam das relações harmônicas e positivos, das inarmônicas. 0% é neutro."
  ],
  "spectral.freezeModeHelp": [
    "Congelamento espectral · 0–100%",
    "Mantém um estado espectral capturado. 0% desativa a retenção e 100% a aplica integralmente. A duração do arquivo é preservada."
  ],
  "oscillator.resetButton": "Restaura as curvas padrão do modo de síntese atual.",
  "oscillator.resynthesisMode": "Analisa o áudio de trabalho e reconstrói seu espectro com parciais.",
  "oscillator.convolutionButton": "Gera som com osciladores. Opcionalmente, use um arquivo como resposta a impulso para modelar o som.",
  "oscillator.sine": "Usa uma onda senoidal nos osciladores.",
  "oscillator.triangle": "Usa uma onda triangular nos osciladores.",
  "oscillator.saw": "Usa uma onda dente de serra nos osciladores.",
  "oscillator.square": "Usa uma onda quadrada nos osciladores.",
  "oscillator.countSelect": "Escolhe quantos osciladores são configurados.",
  "oscillator.stackSelect": "Escolhe como as frequências dos osciladores se distribuem em relação à frequência base.",
  "oscillator.modulationSelect": "Escolhe FM, AM ou modulação em anel, ou desativa a modulação.",
  "oscillator.modulationRatioInput": "Define a frequência do modulador como múltiplo da frequência de cada oscilador.",
  "oscillator.partialCountSelect": "Escolhe um máximo de 32 ou 64 parciais para a ressíntese.",
  "oscillator.convolutionWet": "Mistura o som direto dos osciladores com o som processado pela resposta a impulso.",
  "oscillator.impulseLength": "Ajusta quanto da resposta a impulso é usado. Arquivos com menos de 3 s são usados por inteiro.",
  "oscillator.basePitchModeHelp": [
    "Frequência base · 20–4000 Hz",
    "Define a frequência base do conjunto de osciladores ou transpõe os parciais analisados na ressíntese de arquivo."
  ],
  "oscillator.deviationModeHelp": [
    "Desvio · Depende da fonte e da distribuição",
    "O uníssono distribui as vozes em até ±50 cents. Outras distribuições e a ressíntese de arquivo alteram as relações entre parciais em 0–0.38. Zero mantém a distribuição original."
  ],
  "oscillator.slopeModeHelp": [
    "Inclinação espectral · −24 a +12 dB/oct",
    "Inclina os níveis das vozes ou dos parciais conforme a frequência relativa à base. Valores negativos favorecem as frequências baixas e positivos, as altas."
  ],
  "oscillator.modulationCurveModeHelp": [
    "Intensidade de modulação · FM / AM / Anel",
    "A FM usa um índice de 0–4. A profundidade de AM e a mistura em anel usam 0–100%. A curva segue o modo selecionado."
  ],
  "state.active": "Ativo",
  "state.bypassed": "Em bypass",
  "state.on": "Ativado · Clique para desativar",
  "state.off": "Desativado · Clique para ativar e editar",
  "hub.info": "Atalhos e arquivos compatíveis.",
  "hub.openAudio": "Abre um arquivo de áudio como fonte de trabalho.",
  "hub.export": "Baixa em WAV de 24 bits o mesmo áudio usado na reprodução.",
  "hub.original": "Restaura o áudio original.",
  "hub.grainSource": "A mistura mono usa 50% do canal esquerdo e 50% do direito. Esquerdo e Direito usam apenas um canal de origem.",
  "hub.openIR": "Abre um arquivo separado para usar como resposta a impulso.",
  "hub.rewind": "Volta ao início da reprodução.",
  "hub.play": "Use a barra de espaço para reproduzir ou pausar a mesma saída exportada em WAV.",
  "hub.gain": "Ajusta o ganho para reprodução, WAV e o próximo Lab. A saída processada é limitada a −1 dBFS.",
  "hub.clip": "Indicador de clipping na saída. Clique para redefinir.",
  "hub.fadeIn": "Arraste para ajustar a duração do fade-in.",
  "hub.fadeOut": "Arraste para ajustar a duração do fade-out.",
  "granular.durationInput": "Ajusta a duração da saída de 0 a 10 minutos.",
  "oscillator.durationInput": "Ajusta a duração da síntese de 0 a 10 minutos. A cauda da resposta a impulso pode prolongar a saída.",
  "state.spectralOn": "Ativo · Clique novamente no efeito selecionado para desativá-lo",
  "hub.exportStage": "Exporta a etapa salva “{stage}” como WAV. Alterações não confirmadas ficam de fora.",
  "hub.selectedStage": "Etapa salva selecionada: {stage} · Delete remove esta etapa",
  "hub.savedStage": "Etapa salva: {stage} · Etapa anterior: {parent}",
  "hub.source": "fonte",
  "chain.timbre": "Arraste para reordenar. Teclado: Alt + ← / →",
  "chain.spectral": "Clique para editar {effect} e arraste para mudar a ordem. Teclado: Alt + ← / →",
  "oscillator.sourceBand": "Escolha o modo de síntese. A resposta ao impulso do arquivo atua sobre o som do oscilador."
};
