export default {
  "source.source-pen": "Edita puntos de volumen en la forma de onda de origen y puntos de curva en el Lab. Haz clic de nuevo para volver a seleccionar tramos.",
  "source.source-eraser": "Elimina un punto de volumen o de curva. Los tramos de audio se conservan.",
  "source.zoom-out": "Muestra un tramo más amplio de la forma de onda de origen.",
  "source.zoom-in": "Muestra un tramo menor de la forma de onda de origen con más detalle.",
  "source.zoom-fit": "Muestra la forma de onda de origen completa.",
  "source.undo-edit": "Deshace la última edición del audio de origen.",
  "source.redo-edit": "Rehace la última edición deshecha del audio de origen.",
  "source.volume-reset": "Restablece la envolvente de volumen de origen a 0 dB.",
  "source.delete": "Elimina el tramo seleccionado del audio de origen y une los tramos restantes.",
  "tab.audio": "Ajusta la velocidad de reproducción, el tono y el panorama estéreo.",
  "tab.timbre": "Modela el timbre con filtros y una cadena de efectos.",
  "tab.space": "Mueve el sonido en el espacio y ajusta la distancia y la reverberación.",
  "tab.granular": "Construye sonido a partir de granos breves del audio de origen.",
  "tab.spectral": "Transforma el contenido de frecuencias del audio de origen.",
  "tab.oscillator": "Resintetiza un archivo o genera sonido con osciladores y una respuesta a impulsos opcional.",
  "tab.handoff": "Al cambiar de Lab, se guarda una etapa nueva si cambió el procesamiento.",
  "lab.clearCurrent": "Restablece los valores predeterminados de la curva seleccionada.",
  "audio.resetButton": "Restaura las curvas predeterminadas de velocidad, tono y panorama.",
  "audio.stretchHelp": [
    "Velocidad · −2× a +2×",
    "Cambia la velocidad de reproducción de la fuente. Los valores negativos invierten el sonido y cero fija la posición de la fuente."
  ],
  "audio.pitchHelp": [
    "Tono · −2400 a +2400 cents",
    "Sube o baja el tono hasta dos octavas. 1200 cents equivalen a una octava."
  ],
  "audio.panHelp": [
    "Panorama · Izquierda / Derecha",
    "Mueve el sonido en el campo estéreo. Arriba = izquierda · centro = centro · abajo = derecha."
  ],
  "timbre.resetButton": "Restaura todas las curvas, desactiva todos los efectos y vacía su cadena.",
  "timbre.lowpassModeHelp": [
    "Paso bajo · 40 Hz–18 kHz",
    "Fija la frecuencia de corte y atenúa las frecuencias superiores. El límite máximo baja cuando se procesa a una frecuencia de muestreo menor."
  ],
  "timbre.highpassModeHelp": [
    "Paso alto · 40 Hz–18 kHz",
    "Fija la frecuencia de corte y atenúa las frecuencias inferiores. El límite máximo baja cuando se procesa a una frecuencia de muestreo menor."
  ],
  "timbre.bandpassModeHelp": [
    "Paso de banda",
    "Conserva una banda alrededor de la frecuencia central. Ajusta por separado la frecuencia central y la anchura."
  ],
  "timbre.combModeHelp": [
    "Filtro de peine",
    "Combina la señal original con una señal retardada y realimentada para crear un filtro de peine resonante."
  ],
  "timbre.flangerModeHelp": [
    "Flanger",
    "Modula un retardo corto para mover las muescas del filtro de peine. Ajusta el retardo, la profundidad, la velocidad, la realimentación y la mezcla."
  ],
  "timbre.chorusModeHelp": [
    "Coro",
    "Modula voces retardadas para dar cuerpo al sonido. Ajusta el retardo, la profundidad, la velocidad y la mezcla."
  ],
  "timbre.delayModeHelp": [
    "Retardo",
    "Crea ecos repetidos. Ajusta el tiempo de retardo, la realimentación y la mezcla."
  ],
  "timbre.bandpassCenterParamHelp": [
    "Frecuencia central · 40 Hz–18 kHz",
    "Mueve el centro del filtro de paso de banda. El límite máximo baja cuando se procesa a una frecuencia de muestreo menor."
  ],
  "timbre.bandpassWidthParamHelp": [
    "Anchura · 0–100%",
    "Amplía la banda de paso. 0% es estrecha (Q 12) y 100% es ancha (Q 0.5). El filtro sigue activo en todo el intervalo."
  ],
  "timbre.combDelayParamHelp": [
    "Retardo del filtro de peine · 0.5–100 ms",
    "Fija el retardo que determina el espaciado de las resonancias del filtro de peine."
  ],
  "timbre.combFeedbackParamHelp": [
    "Realimentación del filtro de peine · 0–0.95",
    "Devuelve parte de la señal retardada al retardo. Con valores más altos, las resonancias duran más."
  ],
  "timbre.combMixParamHelp": [
    "Cantidad del filtro de peine · 0–100%",
    "0% es la señal original. 100% es la señal filtrada, que incluye el sonido original y el retardado."
  ],
  "timbre.flangerDelayParamHelp": [
    "Retardo del flanger · 0.5–10 ms",
    "Fija el retardo central del barrido de modulación."
  ],
  "timbre.flangerDepthParamHelp": [
    "Profundidad del flanger · 0–10 ms",
    "Fija la profundidad solicitada del barrido. La profundidad efectiva se limita al retardo menos 0.25 ms."
  ],
  "timbre.flangerRateParamHelp": [
    "Velocidad del flanger · 0.02–5 Hz",
    "Fija cuántos ciclos de modulación ocurren por segundo."
  ],
  "timbre.flangerFeedbackParamHelp": [
    "Realimentación del flanger · 0–0.85",
    "Realimenta el sonido retardado para reforzar la resonancia del barrido."
  ],
  "timbre.flangerMixParamHelp": [
    "Mezcla del flanger · 0–100%",
    "Equilibra el sonido original y el retardado. 0% es original y 100% es procesado."
  ],
  "timbre.chorusDelayParamHelp": [
    "Retardo del coro · 10–35 ms",
    "Fija el retardo base de las voces del coro."
  ],
  "timbre.chorusDepthParamHelp": [
    "Profundidad del coro · 0–20 ms",
    "Fija la profundidad solicitada del barrido. La profundidad efectiva se limita al retardo menos 5 ms."
  ],
  "timbre.chorusRateParamHelp": [
    "Velocidad del coro · 0.02–3 Hz",
    "Fija la velocidad de modulación del coro en ciclos por segundo."
  ],
  "timbre.chorusMixParamHelp": [
    "Mezcla del coro · 0–100%",
    "Equilibra el sonido original y el coro. 0% es original y 100% es procesado."
  ],
  "timbre.delayTimeParamHelp": [
    "Tiempo de retardo · 100 ms–1.5 s",
    "Fija el intervalo entre ecos."
  ],
  "timbre.delayFeedbackParamHelp": [
    "Realimentación del retardo · 0–0.85",
    "Ajusta cuánto sonido retardado vuelve al retardo para repetirse."
  ],
  "timbre.delayMixParamHelp": [
    "Mezcla del retardo · 0–100%",
    "Equilibra el sonido original y los ecos. 0% es original y 100% es procesado."
  ],
  "space.resetButton": "Restaura todas las curvas, activa Dirección, desactiva Distancia y Reverberación y fija el decaimiento en 1.2 s.",
  "space.reverbDecay": "Ajusta el tiempo de decaimiento de la reverberación de 0.3 a 4 s.",
  "space.directionModeHelp": [
    "Dirección · −1800° a +1800°",
    "Mueve el sonido alrededor del oyente. Positivo = horario, negativo = antihorario. 360° es una vuelta completa."
  ],
  "space.distanceModeHelp": [
    "Distancia · 0–1",
    "Pasa de cerca (0) a lejos (1), cambiando el nivel, el filtrado y la sensación espacial. La escala es relativa, sin calibración en metros."
  ],
  "space.reverbModeHelp": [
    "Cantidad de reverberación · 0–100%",
    "Dibuja cuánto sonido se envía a la reverberación. El decaimiento se ajusta aparte (0.3–4 s). La cola termina con el archivo."
  ],
  "granular.resetButton": "Restaura todas las curvas y vuelve a situar la ventana de origen al inicio con la duración mínima.",
  "granular.positionModeHelp": [
    "Posición de lectura · 0–100% de la ventana de origen",
    "Elige dónde comienzan los granos dentro de la ventana de origen seleccionada. El tiempo de reproducción de salida se mantiene."
  ],
  "granular.spreadModeHelp": [
    "Dispersión · 0–100%",
    "Aleatoriza las posiciones de lectura de los granos alrededor de la posición de lectura, dentro de la ventana seleccionada."
  ],
  "granular.sizeModeHelp": [
    "Tamaño del grano · 5–1000 ms",
    "Fija la duración solicitada del grano. Con el tono actual, puede acortarse para mantenerse dentro de la ventana de origen."
  ],
  "granular.densityModeHelp": [
    "Densidad · 1–80 granos/s",
    "Fija los granos nuevos por segundo. La escucha previa limita los granos activos a 64, o a 32 con densidad o tamaño altos, con fundidos breves. El renderizado procesa todos los granos programados."
  ],
  "granular.pitchLowModeHelp": [
    "Tono inferior · −24 a +24 semitonos",
    "Fija un extremo del intervalo aleatorio de tonos de los granos. Si el límite inferior supera al superior, se intercambian."
  ],
  "granular.pitchHighModeHelp": [
    "Tono superior · −24 a +24 semitonos",
    "Fija el otro extremo del intervalo aleatorio de tonos. 12 semitonos equivalen a una octava. El tono también cambia la velocidad de lectura del grano."
  ],
  "spectral.resetButton": "Restaura los valores predeterminados de todas las curvas espectrales.",
  "spectral.shiftModeHelp": [
    "Desplazamiento espectral · −2000 a +2000 Hz",
    "Desplaza las frecuencias espectrales por un valor fijo en Hz. 0 Hz conserva sus posiciones."
  ],
  "spectral.stretchModeHelp": [
    "Estiramiento espectral · 0.5–2",
    "Comprime o expande el espaciado entre frecuencias alrededor de 1 kHz. 1 es neutro. La velocidad de reproducción y la duración se mantienen."
  ],
  "spectral.blurModeHelp": [
    "Difuminado espectral · 0–100%",
    "Suaviza los cambios espectrales a lo largo del tiempo. 0% es neutro. Se mantienen las posiciones de frecuencia y la duración del archivo."
  ],
  "spectral.harmonicityModeHelp": [
    "Armonicidad · −100% a +100%",
    "Modifica las relaciones entre picos. Los valores negativos las acercan a relaciones armónicas y los positivos, a inarmónicas. 0% es neutro."
  ],
  "spectral.freezeModeHelp": [
    "Congelación espectral · 0–100%",
    "Mantiene un estado espectral capturado. 0% desactiva la retención y 100% la aplica por completo. La duración del archivo se mantiene."
  ],
  "oscillator.resetButton": "Restaura las curvas predeterminadas del modo de síntesis actual.",
  "oscillator.resynthesisMode": "Analiza el audio de trabajo y reconstruye su espectro mediante parciales.",
  "oscillator.convolutionButton": "Genera sonido con osciladores. Opcionalmente, usa un archivo como respuesta a impulsos para modelarlo.",
  "oscillator.sine": "Usa una onda sinusoidal para los osciladores.",
  "oscillator.triangle": "Usa una onda triangular para los osciladores.",
  "oscillator.saw": "Usa una onda de diente de sierra para los osciladores.",
  "oscillator.square": "Usa una onda cuadrada para los osciladores.",
  "oscillator.countSelect": "Elige cuántos osciladores se configuran.",
  "oscillator.stackSelect": "Elige cómo se distribuyen las frecuencias de los osciladores respecto a la frecuencia base.",
  "oscillator.modulationSelect": "Elige FM, AM o modulación en anillo, o desactiva la modulación.",
  "oscillator.modulationRatioInput": "Fija la frecuencia del modulador como múltiplo de la frecuencia de cada oscilador.",
  "oscillator.partialCountSelect": "Elige un máximo de 32 o 64 parciales para la resíntesis.",
  "oscillator.convolutionWet": "Mezcla el sonido directo de los osciladores con el procesado por la respuesta a impulsos.",
  "oscillator.impulseLength": "Ajusta cuánto se usa de la respuesta a impulsos. Los archivos de menos de 3 s se usan completos.",
  "oscillator.basePitchModeHelp": [
    "Frecuencia base · 20–4000 Hz",
    "Fija la frecuencia base del conjunto de osciladores o transpone los parciales analizados en la resíntesis de archivo."
  ],
  "oscillator.deviationModeHelp": [
    "Desviación · Depende de la fuente y la disposición",
    "El unísono separa las voces hasta ±50 cents. Otras disposiciones y la resíntesis de archivo modifican las relaciones entre parciales en 0–0.38. Cero conserva la disposición original."
  ],
  "oscillator.slopeModeHelp": [
    "Pendiente espectral · −24 a +12 dB/oct",
    "Inclina los niveles de voces o parciales según su frecuencia relativa a la base. Los valores negativos favorecen las frecuencias bajas y los positivos, las altas."
  ],
  "oscillator.modulationCurveModeHelp": [
    "Intensidad de modulación · FM / AM / Anillo",
    "La FM usa un índice de 0–4. La profundidad de AM y la mezcla de anillo usan 0–100%. La curva sigue el modo seleccionado."
  ],
  "state.active": "Activo",
  "state.bypassed": "En bypass",
  "state.on": "Activado · Haz clic para desactivar",
  "state.off": "Desactivado · Haz clic para activar y editar",
  "hub.info": "Atajos y archivos compatibles.",
  "hub.openAudio": "Abre un archivo de audio como fuente de trabajo.",
  "hub.export": "Descarga en WAV de 24 bits el mismo audio que se usa para la reproducción.",
  "hub.original": "Recupera el audio de origen.",
  "hub.grainSource": "La mezcla mono usa un 50% del canal izquierdo y un 50% del derecho. Izquierdo y Derecho usan un solo canal de origen.",
  "hub.openIR": "Abre un archivo aparte para usarlo como respuesta a impulsos.",
  "hub.rewind": "Vuelve al inicio de la reproducción.",
  "hub.play": "Usa la barra espaciadora para reproducir o pausar la misma salida que se exporta en WAV.",
  "hub.gain": "Ajusta la ganancia para reproducción, WAV y el siguiente Lab. La salida procesada tiene un límite de −1 dBFS.",
  "hub.clip": "Indicador de recorte de salida. Haz clic para restablecerlo.",
  "hub.fadeIn": "Arrastra para ajustar la duración del fundido de entrada.",
  "hub.fadeOut": "Arrastra para ajustar la duración del fundido de salida.",
  "granular.durationInput": "Ajusta la duración de salida de 0 a 10 minutos.",
  "oscillator.durationInput": "Ajusta la duración de síntesis de 0 a 10 minutos. La cola de la respuesta a impulsos puede prolongar la salida.",
  "state.spectralOn": "Activo · Vuelve a hacer clic en el efecto seleccionado para desactivarlo",
  "hub.exportStage": "Exporta la etapa guardada «{stage}» como WAV. Se excluyen los cambios sin confirmar.",
  "hub.selectedStage": "Etapa guardada seleccionada: {stage} · Supr elimina esta etapa",
  "hub.savedStage": "Etapa guardada: {stage} · Etapa anterior: {parent}",
  "hub.source": "fuente",
  "chain.timbre": "Arrastra para reordenar. Teclado: Alt + ← / →",
  "chain.spectral": "Haz clic para editar {effect} y arrastra para cambiar el orden. Teclado: Alt + ← / →",
  "oscillator.sourceBand": "Elige el método de síntesis. La respuesta al impulso del archivo se aplica al sonido del oscilador."
};
