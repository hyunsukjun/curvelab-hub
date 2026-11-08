export default {
  "source.source-pen": "Modifiez les points de volume sur la forme d’onde source et les points de courbe dans le Lab. Cliquez de nouveau pour revenir à la sélection audio.",
  "source.source-eraser": "Supprimez un point de volume ou de courbe. Les régions audio sont conservées.",
  "source.zoom-out": "Affichez une portion plus large de la forme d’onde source.",
  "source.zoom-in": "Affichez une portion plus petite de la forme d’onde source avec davantage de détails.",
  "source.zoom-fit": "Affichez toute la forme d’onde source.",
  "source.undo-edit": "Annulez la dernière modification de la source.",
  "source.redo-edit": "Rétablissez la dernière modification de la source annulée.",
  "source.volume-reset": "Ramenez l’enveloppe de volume de la source à 0 dB.",
  "source.delete": "Supprimez la sélection audio et raccordez les parties restantes.",
  "tab.audio": "Modifiez la vitesse de lecture, la hauteur et le panoramique stéréo.",
  "tab.timbre": "Façonnez le timbre à l’aide de filtres et d’une chaîne d’effets.",
  "tab.space": "Déplacez le son dans l’espace et ajustez la distance et la réverbération.",
  "tab.granular": "Créez un son à partir de courts grains du signal source.",
  "tab.spectral": "Transformez le contenu fréquentiel du signal source.",
  "tab.oscillator": "Resynthétisez un fichier ou générez un son d’oscillateur avec une réponse impulsionnelle facultative.",
  "tab.handoff": "Changer de Lab enregistre le résultat actuel comme étape.",
  "lab.clearCurrent": "Rétablissez les valeurs par défaut de la courbe sélectionnée.",
  "audio.resetButton": "Rétablissez les courbes par défaut de vitesse, de hauteur et de panoramique.",
  "audio.stretchHelp": [
    "Vitesse · −2× à +2×",
    "Modifiez la vitesse de lecture de la source. Une valeur négative inverse le sens de lecture et zéro fige la position dans la source."
  ],
  "audio.pitchHelp": [
    "Hauteur · −2400 à +2400 cents",
    "Décalez la hauteur de deux octaves au maximum vers le grave ou l’aigu. 1200 cents = une octave."
  ],
  "audio.panHelp": [
    "Panoramique · gauche / droite",
    "Déplacez le son dans le champ stéréo. Haut = gauche · milieu = centre · bas = droite."
  ],
  "timbre.resetButton": "Rétablissez toutes les courbes par défaut, désactivez tous les effets et videz la chaîne d’effets.",
  "timbre.lowpassModeHelp": [
    "Passe-bas · 40 Hz–18 kHz",
    "Réglez la fréquence de coupure. Le filtre atténue les fréquences supérieures. Une fréquence d’échantillonnage plus basse réduit la limite haute."
  ],
  "timbre.highpassModeHelp": [
    "Passe-haut · 40 Hz–18 kHz",
    "Réglez la fréquence de coupure. Le filtre atténue les fréquences inférieures. Une fréquence d’échantillonnage plus basse réduit la limite haute."
  ],
  "timbre.bandpassModeHelp": [
    "Passe-bande",
    "Conservez une bande autour de la fréquence centrale. Réglez séparément la fréquence centrale et la largeur."
  ],
  "timbre.combModeHelp": [
    "Filtre en peigne",
    "Mélangez l’original à un signal retardé et réinjecté pour créer un filtrage en peigne résonant."
  ],
  "timbre.flangerModeHelp": [
    "Flanger",
    "Modulez un bref retard pour déplacer les creux du filtre en peigne. Réglez retard, profondeur, fréquence, réinjection et mixage."
  ],
  "timbre.chorusModeHelp": [
    "Chorus",
    "Modulez des voix retardées pour épaissir le son. Réglez retard, profondeur, fréquence et mixage."
  ],
  "timbre.delayModeHelp": [
    "Délai",
    "Créez des échos répétés. Réglez la durée du retard, la réinjection et le mixage."
  ],
  "timbre.bandpassCenterParamHelp": [
    "Fréquence centrale · 40 Hz–18 kHz",
    "Déplacez le centre du filtre passe-bande. Une fréquence d’échantillonnage plus basse réduit la limite haute."
  ],
  "timbre.bandpassWidthParamHelp": [
    "Largeur · 0–100 %",
    "Élargissez la bande passante. 0 % correspond à une bande étroite (Q 12) et 100 % à une bande large (Q 0,5). Le filtre reste actif à toute largeur."
  ],
  "timbre.combDelayParamHelp": [
    "Retard du filtre en peigne · 0,5–100 ms",
    "Réglez le retard qui détermine l’écart entre les résonances du filtre."
  ],
  "timbre.combFeedbackParamHelp": [
    "Réinjection du filtre en peigne · 0–0,95",
    "Renvoyez une partie du signal retardé dans la ligne à retard. Une valeur plus élevée prolonge les résonances."
  ],
  "timbre.combMixParamHelp": [
    "Dosage du filtre en peigne · 0–100 %",
    "0 % donne le signal original. 100 % donne le signal filtré en peigne, qui combine lui-même le son original et le son retardé."
  ],
  "timbre.flangerDelayParamHelp": [
    "Retard du flanger · 0,5–10 ms",
    "Réglez le retard central du balayage de modulation."
  ],
  "timbre.flangerDepthParamHelp": [
    "Profondeur du flanger · 0–10 ms",
    "Profondeur de balayage demandée. La profondeur réelle ne dépasse pas le retard moins 0,25 ms."
  ],
  "timbre.flangerRateParamHelp": [
    "Fréquence du flanger · 0,02–5 Hz",
    "Réglez le nombre de cycles de modulation par seconde."
  ],
  "timbre.flangerFeedbackParamHelp": [
    "Réinjection du flanger · 0–0,85",
    "Réinjectez le signal retardé pour renforcer les résonances du balayage."
  ],
  "timbre.flangerMixParamHelp": [
    "Mixage du flanger · 0–100 %",
    "Dosez le son original et le son retardé. 0 % = original, 100 % = effet seul."
  ],
  "timbre.chorusDelayParamHelp": [
    "Retard du chorus · 10–35 ms",
    "Réglez le retard de base des voix du chorus."
  ],
  "timbre.chorusDepthParamHelp": [
    "Profondeur du chorus · 0–20 ms",
    "Profondeur de balayage demandée. La profondeur réelle ne dépasse pas le retard moins 5 ms."
  ],
  "timbre.chorusRateParamHelp": [
    "Fréquence du chorus · 0,02–3 Hz",
    "Réglez la vitesse de modulation du chorus en cycles par seconde."
  ],
  "timbre.chorusMixParamHelp": [
    "Mixage du chorus · 0–100 %",
    "Dosez le son original et le chorus. 0 % = original, 100 % = effet seul."
  ],
  "timbre.delayTimeParamHelp": [
    "Durée du retard · 100 ms–1,5 s",
    "Réglez l’intervalle entre les échos."
  ],
  "timbre.delayFeedbackParamHelp": [
    "Réinjection du délai · 0–0,85",
    "Réglez la part du son retardé réinjectée pour produire les répétitions."
  ],
  "timbre.delayMixParamHelp": [
    "Mixage du délai · 0–100 %",
    "Dosez le son original et les échos. 0 % = original, 100 % = effet seul."
  ],
  "space.resetButton": "Rétablissez toutes les courbes, activez la direction, désactivez la distance et la réverbération, et remettez la décroissance à 1,2 s.",
  "space.reverbDecay": "Réglez la durée de décroissance de la réverbération de 0,3 à 4 s.",
  "space.directionModeHelp": [
    "Direction · −1800° à +1800°",
    "Déplacez le son autour de l’auditeur. Positif = sens horaire, négatif = sens antihoraire. 360° correspond à un tour complet."
  ],
  "space.distanceModeHelp": [
    "Distance · 0–1",
    "Passez de proche (0) à lointain (1) en modifiant le niveau, le filtrage et l’impression spatiale. Cette distance n’est pas étalonnée en mètres."
  ],
  "space.reverbModeHelp": [
    "Dosage de la réverbération · 0–100 %",
    "Tracez la quantité de son envoyée à la réverbération. La décroissance se règle séparément de 0,3 à 4 s. La queue s’arrête à la fin du fichier."
  ],
  "granular.resetButton": "Rétablissez toutes les courbes par défaut et ramenez la fenêtre source à sa longueur minimale au début du fichier.",
  "granular.positionModeHelp": [
    "Position de lecture · 0–100 % de la fenêtre source",
    "Choisissez le point de départ des grains dans la fenêtre source sélectionnée. Ce réglage ne déplace pas la tête de lecture de la sortie."
  ],
  "granular.spreadModeHelp": [
    "Dispersion · 0–100 %",
    "Répartissez aléatoirement les points de lecture des grains autour de la position de lecture, dans la fenêtre source sélectionnée."
  ],
  "granular.sizeModeHelp": [
    "Taille des grains · 5–1000 ms",
    "Réglez la durée souhaitée. Les grains peuvent être raccourcis pour rester dans la fenêtre source à la hauteur actuelle."
  ],
  "granular.densityModeHelp": [
    "Densité · 1–80 grains/s",
    "Réglez le nombre de nouveaux grains par seconde. L’écoute limite les grains actifs à 64, ou à 32 si la densité ou la taille est élevée, avec de brefs fondus de fin. Le rendu hors ligne traite tous les grains planifiés."
  ],
  "granular.pitchLowModeHelp": [
    "Hauteur basse · −24 à +24 demi-tons",
    "Réglez une borne de la plage de hauteur aléatoire. Si la borne basse dépasse la borne haute, elles sont permutées."
  ],
  "granular.pitchHighModeHelp": [
    "Hauteur haute · −24 à +24 demi-tons",
    "Réglez l’autre borne de la plage de hauteur aléatoire. 12 demi-tons = une octave. La hauteur change aussi la vitesse de lecture des grains."
  ],
  "spectral.resetButton": "Rétablissez les valeurs par défaut de toutes les courbes spectrales.",
  "spectral.shiftModeHelp": [
    "Décalage spectral · −2000 à +2000 Hz",
    "Décalez les fréquences spectrales d’un nombre fixe de hertz. À 0 Hz, elles ne bougent pas."
  ],
  "spectral.stretchModeHelp": [
    "Étirement spectral · 0,5–2",
    "Resserrez ou écartez les fréquences autour de 1 kHz. 1 est neutre. La vitesse de lecture et la durée du fichier restent inchangées."
  ],
  "spectral.blurModeHelp": [
    "Flou spectral · 0–100 %",
    "Lissez les variations du spectre dans le temps. 0 % est neutre. Les positions des fréquences et la durée du fichier restent inchangées."
  ],
  "spectral.harmonicityModeHelp": [
    "Harmonicité · −100 % à +100 %",
    "Modifiez les rapports entre les pics. Négatif = plus harmonique, positif = plus inharmonique. 0 % est neutre."
  ],
  "spectral.freezeModeHelp": [
    "Gel spectral · 0–100 %",
    "Maintenez un état spectral capturé. 0 % désactive le gel et 100 % maintient entièrement l’état. La durée du fichier ne change pas."
  ],
  "oscillator.resetButton": "Rétablissez toutes les courbes par défaut du mode de synthèse actuel.",
  "oscillator.resynthesisMode": "Analysez le signal de travail et reconstruisez son spectre à partir de partiels.",
  "oscillator.convolutionButton": "Générez un son d’oscillateur et façonnez-le, si souhaité, avec un fichier comme réponse impulsionnelle.",
  "oscillator.sine": "Utilisez une onde sinusoïdale pour les oscillateurs.",
  "oscillator.triangle": "Utilisez une onde triangulaire pour les oscillateurs.",
  "oscillator.saw": "Utilisez une onde en dents de scie pour les oscillateurs.",
  "oscillator.square": "Utilisez une onde carrée pour les oscillateurs.",
  "oscillator.countSelect": "Choisissez le nombre d’oscillateurs configurés.",
  "oscillator.stackSelect": "Choisissez comment répartir les fréquences des oscillateurs par rapport à la fréquence de base.",
  "oscillator.modulationSelect": "Choisissez la FM, l’AM ou la modulation en anneau, ou désactivez la modulation.",
  "oscillator.modulationRatioInput": "Réglez la fréquence du modulateur comme multiple de celle de chaque oscillateur.",
  "oscillator.partialCountSelect": "Choisissez jusqu’à 32 ou 64 partiels pour la resynthèse.",
  "oscillator.convolutionWet": "Dosez le son direct des oscillateurs et le son traité par la réponse impulsionnelle.",
  "oscillator.impulseLength": "Réglez la portion de réponse impulsionnelle utilisée. Les fichiers de moins de 3 s sont utilisés en entier.",
  "oscillator.basePitchModeHelp": [
    "Fréquence de base · 20–4000 Hz",
    "Réglez la fréquence de base des oscillateurs ou transposez les partiels analysés en mode Resynthèse de fichier."
  ],
  "oscillator.deviationModeHelp": [
    "Écart · Selon la source et la disposition",
    "À l’unisson, les voix s’écartent de ±50 cents au maximum. Les autres dispositions et la resynthèse de fichier modifient les rapports entre partiels de 0 à 0,38. À zéro, la disposition d’origine est conservée."
  ],
  "oscillator.slopeModeHelp": [
    "Pente spectrale · −24 à +12 dB/oct",
    "Inclinez le niveau des voix ou partiels en fonction de leur fréquence relative à la base. Les valeurs négatives favorisent le grave, les valeurs positives l’aigu."
  ],
  "oscillator.modulationCurveModeHelp": [
    "Intensité de modulation · FM / AM / anneau",
    "La FM utilise un indice de 0 à 4. La profondeur AM et le dosage de la modulation en anneau vont de 0 à 100 %. La courbe suit le mode sélectionné."
  ],
  "state.active": "Actif",
  "state.bypassed": "Contourné",
  "state.on": "Activé · Cliquez pour désactiver",
  "state.off": "Désactivé · Cliquez pour activer et modifier",
  "hub.info": "Raccourcis et formats pris en charge.",
  "hub.openAudio": "Ouvrez un fichier audio comme source de travail.",
  "hub.export": "Téléchargez l’étape enregistrée sélectionnée au format WAV. Les modifications non enregistrées sont exclues.",
  "hub.original": "Rétablissez le signal audio d’origine.",
  "hub.grainSource": "Le mixage mono utilise 50 % du canal gauche et 50 % du droit. Gauche et Droite utilisent chacun un seul canal d’origine.",
  "hub.openIR": "Ouvrez un fichier distinct à utiliser comme réponse impulsionnelle.",
  "hub.rewind": "Revenez au début de la lecture.",
  "hub.play": "Appuyez sur Espace pour lancer ou mettre en pause la lecture du Lab actif.",
  "hub.gain": "Ajustez le gain de lecture et de transfert vers le Lab suivant. Le transfert est plafonné à −1 dBFS en crête.",
  "hub.clip": "Indicateur d’écrêtage de sortie. Cliquez pour réinitialiser.",
  "hub.fadeIn": "Faites glisser pour régler la durée du fondu d’entrée.",
  "hub.fadeOut": "Faites glisser pour régler la durée du fondu de sortie.",
  "granular.durationInput": "Réglez la durée de sortie de 0 à 10 minutes.",
  "oscillator.durationInput": "Réglez la durée de synthèse de 0 à 10 minutes. La queue de la réponse impulsionnelle peut prolonger la sortie.",
  "state.spectralOn": "Activé · Cliquez de nouveau sur l’effet sélectionné pour le désactiver",
  "hub.exportStage": "Exporter l’étape enregistrée « {stage} » en WAV. Les modifications non validées sont exclues.",
  "hub.selectedStage": "Étape enregistrée sélectionnée : {stage} · Suppr supprime cette étape",
  "hub.savedStage": "Étape enregistrée : {stage} · Étape précédente : {parent}",
  "hub.source": "source",
  "chain.timbre": "Faites glisser pour réorganiser. Clavier : Alt + ← / →",
  "chain.spectral": "Cliquez pour modifier {effect}, puis faites glisser pour changer l’ordre. Clavier : Alt + ← / →",
  "oscillator.sourceBand": "Choisissez un mode de synthèse. La réponse impulsionnelle du fichier agit sur le son de l’oscillateur."
};
