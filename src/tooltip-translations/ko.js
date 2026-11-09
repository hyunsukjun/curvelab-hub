export default {
  "source.source-pen": "소스 파형의 음량 점과 Lab의 커브 점을 편집합니다. 다시 누르면 구간 선택으로 돌아갑니다.",
  "source.source-eraser": "음량 점이나 커브 점을 지웁니다. 음원 구간은 유지됩니다.",
  "source.zoom-out": "소스 파형을 더 넓게 봅니다.",
  "source.zoom-in": "소스 파형의 더 좁은 구간을 자세히 봅니다.",
  "source.zoom-fit": "소스 파형 전체를 화면에 맞춰 표시합니다.",
  "source.undo-edit": "마지막 소스 편집을 실행 취소합니다.",
  "source.redo-edit": "실행 취소한 마지막 소스 편집을 다시 실행합니다.",
  "source.volume-reset": "소스 음량 커브를 0 dB로 초기화합니다.",
  "source.delete": "선택한 음원 구간을 삭제하고 남은 부분을 이어 붙입니다.",
  "tab.audio": "재생 속도, 음높이, 스테레오 팬을 조절합니다.",
  "tab.timbre": "필터와 효과 체인으로 음색을 바꿉니다.",
  "tab.space": "공간에서 소리를 움직이고 거리와 잔향을 조절합니다.",
  "tab.granular": "소스 음원을 짧은 그레인으로 나눠 소리를 만듭니다.",
  "tab.spectral": "소스 음원의 주파수 성분을 변형합니다.",
  "tab.oscillator": "파일을 재합성하거나 오실레이터로 소리를 만듭니다. 필요하면 파일을 임펄스 응답으로 사용합니다.",
  "tab.handoff": "처리 설정을 바꾼 뒤 다른 랩을 선택하면 새 단계가 저장됩니다.",
  "lab.clearCurrent": "선택한 커브를 기본값으로 되돌립니다.",
  "audio.resetButton": "속도, 음높이, 팬 커브를 기본값으로 되돌립니다.",
  "audio.stretchHelp": [
    "속도 · −2× ~ +2×",
    "소스 재생 속도를 조절합니다. 음수에서는 역재생하고, 0에서는 소스 재생 위치가 멈춥니다."
  ],
  "audio.pitchHelp": [
    "음높이 · −2400 ~ +2400 센트",
    "음높이를 위아래로 최대 두 옥타브 옮깁니다. 1200 센트는 한 옥타브입니다."
  ],
  "audio.panHelp": [
    "팬 · 왼쪽 / 오른쪽",
    "스테레오 공간에서 소리를 움직입니다. 위쪽은 왼쪽, 가운데는 중앙, 아래쪽은 오른쪽입니다."
  ],
  "timbre.resetButton": "모든 커브를 기본값으로 되돌리고, 효과를 모두 끄고, 효과 체인을 비웁니다.",
  "timbre.lowpassModeHelp": [
    "저역 통과 · 40 Hz–18 kHz",
    "차단 주파수를 설정합니다. 이보다 높은 주파수를 줄입니다. 처리 샘플링 주파수가 낮으면 상한도 낮아집니다."
  ],
  "timbre.highpassModeHelp": [
    "고역 통과 · 40 Hz–18 kHz",
    "차단 주파수를 설정합니다. 이보다 낮은 주파수를 줄입니다. 처리 샘플링 주파수가 낮으면 상한도 낮아집니다."
  ],
  "timbre.bandpassModeHelp": [
    "대역 통과",
    "중심 주파수 주변의 대역을 통과시킵니다. 중심 주파수와 폭을 따로 조절합니다."
  ],
  "timbre.combModeHelp": [
    "콤 필터",
    "원음에 지연 신호를 되먹임해 섞으면 콤 필터 공명이 생깁니다."
  ],
  "timbre.flangerModeHelp": [
    "플랜저",
    "짧은 지연 시간을 변화시켜 콤 필터의 감쇠 지점을 움직입니다. 지연, 깊이, 속도, 피드백, 믹스를 조절합니다."
  ],
  "timbre.chorusModeHelp": [
    "코러스",
    "지연된 여러 음을 변조해 소리를 풍성하게 만듭니다. 지연, 깊이, 속도, 믹스를 조절합니다."
  ],
  "timbre.delayModeHelp": [
    "딜레이",
    "반복되는 메아리를 만듭니다. 지연 시간, 피드백, 믹스를 조절합니다."
  ],
  "timbre.bandpassCenterParamHelp": [
    "중심 주파수 · 40 Hz–18 kHz",
    "대역 통과 필터의 중심을 옮깁니다. 처리 샘플링 주파수가 낮으면 상한도 낮아집니다."
  ],
  "timbre.bandpassWidthParamHelp": [
    "대역폭 · 0–100%",
    "통과 대역을 넓힙니다. 0%는 좁고(Q 12), 100%는 넓습니다(Q 0.5). 어느 값에서도 필터는 작동합니다."
  ],
  "timbre.combDelayParamHelp": [
    "콤 지연 · 0.5–100 ms",
    "콤 필터 공명 사이의 간격을 정하는 지연 시간입니다."
  ],
  "timbre.combFeedbackParamHelp": [
    "콤 피드백 · 0–0.95",
    "지연 신호 일부를 지연부로 되돌립니다. 값이 높을수록 공명이 오래 지속됩니다."
  ],
  "timbre.combMixParamHelp": [
    "콤 효과량 · 0–100%",
    "0%는 원음입니다. 100%는 원음과 지연음을 포함하는 콤 필터 처리음입니다."
  ],
  "timbre.flangerDelayParamHelp": [
    "플랜저 지연 · 0.5–10 ms",
    "변조가 오가는 기준 지연 시간을 설정합니다."
  ],
  "timbre.flangerDepthParamHelp": [
    "플랜저 깊이 · 0–10 ms",
    "변조 깊이를 설정합니다. 실제 깊이는 지연 시간에서 0.25 ms를 뺀 값까지입니다."
  ],
  "timbre.flangerRateParamHelp": [
    "플랜저 속도 · 0.02–5 Hz",
    "1초당 변조가 반복되는 횟수를 설정합니다."
  ],
  "timbre.flangerFeedbackParamHelp": [
    "플랜저 피드백 · 0–0.85",
    "지연 신호를 되먹여 움직이는 공명을 강조합니다."
  ],
  "timbre.flangerMixParamHelp": [
    "플랜저 믹스 · 0–100%",
    "원음과 지연음을 섞습니다. 0%는 원음, 100%는 효과음입니다."
  ],
  "timbre.chorusDelayParamHelp": [
    "코러스 지연 · 10–35 ms",
    "코러스 음들의 기준 지연 시간을 설정합니다."
  ],
  "timbre.chorusDepthParamHelp": [
    "코러스 깊이 · 0–20 ms",
    "변조 깊이를 설정합니다. 실제 깊이는 지연 시간에서 5 ms를 뺀 값까지입니다."
  ],
  "timbre.chorusRateParamHelp": [
    "코러스 속도 · 0.02–3 Hz",
    "1초당 코러스 변조가 반복되는 횟수를 설정합니다."
  ],
  "timbre.chorusMixParamHelp": [
    "코러스 믹스 · 0–100%",
    "원음과 코러스음을 섞습니다. 0%는 원음, 100%는 효과음입니다."
  ],
  "timbre.delayTimeParamHelp": [
    "지연 시간 · 100 ms–1.5 s",
    "메아리 사이의 간격을 설정합니다."
  ],
  "timbre.delayFeedbackParamHelp": [
    "딜레이 피드백 · 0–0.85",
    "반복을 위해 지연부로 되돌리는 신호의 비율을 조절합니다."
  ],
  "timbre.delayMixParamHelp": [
    "딜레이 믹스 · 0–100%",
    "원음과 메아리를 섞습니다. 0%는 원음, 100%는 효과음입니다."
  ],
  "space.resetButton": "모든 커브를 기본값으로 되돌립니다. 방향은 켜고 거리와 리버브는 끄며, 감쇠 시간은 1.2초로 설정합니다.",
  "space.reverbDecay": "잔향 감쇠 시간을 0.3~4초로 설정합니다.",
  "space.directionModeHelp": [
    "방향 · −1800° ~ +1800°",
    "청취자 주위로 소리를 움직입니다. 양수는 시계 방향, 음수는 반시계 방향입니다. 360°는 한 바퀴입니다."
  ],
  "space.distanceModeHelp": [
    "거리 · 0–1",
    "가까움(0)부터 멂(1)까지 음량, 필터링, 거리감을 바꿉니다. 미터로 환산되는 실거리는 아닙니다."
  ],
  "space.reverbModeHelp": [
    "리버브 양 · 0–100%",
    "리버브로 보낼 소리의 양을 커브로 그립니다. 감쇠 시간은 0.3–4 s에서 따로 조절합니다. 잔향은 파일이 끝나는 지점에서 종료됩니다."
  ],
  "granular.resetButton": "모든 커브를 기본값으로 되돌리고 Source Window를 맨 앞의 최소 길이 구간으로 초기화합니다.",
  "granular.positionModeHelp": [
    "읽기 위치 · Source Window의 0–100%",
    "선택한 소스 구간에서 그레인이 시작되는 위치를 정합니다. 출력 재생 시간은 그대로입니다."
  ],
  "granular.spreadModeHelp": [
    "퍼짐 · 0–100%",
    "선택한 소스 구간 안에서 읽기 위치를 중심으로 그레인의 읽기 위치를 무작위로 흩뜨립니다."
  ],
  "granular.sizeModeHelp": [
    "그레인 길이 · 5–1000 ms",
    "그레인 길이를 설정합니다. 현재 음높이에서 Source Window를 벗어나지 않도록 실제 길이는 더 짧아질 수 있습니다."
  ],
  "granular.densityModeHelp": [
    "밀도 · 초당 1–80개",
    "1초에 생성할 그레인 수를 설정합니다. 미리듣기의 동시 그레인 한도는 64개이며, 밀도나 길이가 높으면 짧게 페이드아웃하며 32개로 줄입니다. 파일 출력은 예정된 그레인을 모두 처리합니다."
  ],
  "granular.pitchLowModeHelp": [
    "낮은 음높이 · −24 ~ +24 반음",
    "무작위 그레인 음높이 범위의 한쪽 경계를 설정합니다. 낮은 값이 높은 값을 넘으면 두 경계를 재정렬합니다."
  ],
  "granular.pitchHighModeHelp": [
    "높은 음높이 · −24 ~ +24 반음",
    "무작위 그레인 음높이 범위의 다른 쪽 경계를 설정합니다. 12반음은 한 옥타브입니다. 음높이는 그레인 읽기 속도에도 영향을 줍니다."
  ],
  "spectral.resetButton": "모든 스펙트럼 커브를 기본값으로 되돌립니다.",
  "spectral.shiftModeHelp": [
    "스펙트럼 이동 · −2000 ~ +2000 Hz",
    "스펙트럼의 주파수 성분을 일정한 Hz만큼 옮깁니다. 0 Hz에서는 그대로입니다."
  ],
  "spectral.stretchModeHelp": [
    "스펙트럼 늘이기 · 0.5–2",
    "1 kHz를 기준으로 주파수 간격을 좁히거나 넓힙니다. 1에서는 변화가 없습니다. 재생 속도와 파일 길이는 그대로입니다."
  ],
  "spectral.blurModeHelp": [
    "스펙트럼 흐림 · 0–100%",
    "시간에 따른 스펙트럼 변화를 부드럽게 합니다. 0%에서는 변화가 없으며, 주파수 위치와 파일 길이는 그대로입니다."
  ],
  "spectral.harmonicityModeHelp": [
    "배음성 · −100% ~ +100%",
    "스펙트럼 피크의 관계를 바꿉니다. 음수는 배음에 가깝게, 양수는 배음에서 멀어지게 합니다. 0%에서는 변화가 없습니다."
  ],
  "spectral.freezeModeHelp": [
    "스펙트럼 고정 · 0–100%",
    "포착한 스펙트럼 상태를 유지합니다. 0%는 꺼짐, 100%는 완전 고정입니다. 파일 길이는 그대로입니다."
  ],
  "oscillator.resetButton": "현재 합성 모드의 모든 커브를 기본값으로 되돌립니다.",
  "oscillator.resynthesisMode": "작업 음원을 분석해 부분음으로 스펙트럼을 재구성합니다.",
  "oscillator.convolutionButton": "오실레이터 소리를 만듭니다. 필요하면 파일을 임펄스 응답으로 사용해 소리를 변형합니다.",
  "oscillator.sine": "오실레이터에 사인파를 사용합니다.",
  "oscillator.triangle": "오실레이터에 삼각파를 사용합니다.",
  "oscillator.saw": "오실레이터에 톱니파를 사용합니다.",
  "oscillator.square": "오실레이터에 사각파를 사용합니다.",
  "oscillator.countSelect": "사용할 오실레이터 수를 정합니다.",
  "oscillator.stackSelect": "기준 주파수에 대한 오실레이터 주파수 배열을 선택합니다.",
  "oscillator.modulationSelect": "FM, AM, 링 변조 중 하나를 선택하거나 변조를 끕니다.",
  "oscillator.modulationRatioInput": "각 오실레이터 주파수의 몇 배로 변조할지 정합니다.",
  "oscillator.partialCountSelect": "재합성에 사용할 부분음 수의 상한을 32개 또는 64개로 정합니다.",
  "oscillator.convolutionWet": "오실레이터 원음과 임펄스 응답으로 처리한 소리를 섞습니다.",
  "oscillator.impulseLength": "사용할 임펄스 응답 길이를 정합니다. 3초 미만 파일은 전체를 사용합니다.",
  "oscillator.basePitchModeHelp": [
    "기준 주파수 · 20–4000 Hz",
    "오실레이터 묶음의 기준 주파수를 정합니다. 파일 재합성에서는 분석한 부분음의 음높이를 옮깁니다."
  ],
  "oscillator.deviationModeHelp": [
    "편차 · 소스와 주파수 배열에 따라 다름",
    "유니즌에서는 각 음을 ±50 센트까지 벌립니다. 다른 배열과 파일 재합성에서는 0–0.38의 양으로 부분음 관계를 바꿉니다. 0에서는 원래 배열이 유지됩니다."
  ],
  "oscillator.slopeModeHelp": [
    "스펙트럼 기울기 · −24 ~ +12 dB/oct",
    "기준 주파수에 따라 각 음이나 부분음의 레벨을 바꿉니다. 음수에서는 낮은 주파수가, 양수에서는 높은 주파수가 강조됩니다."
  ],
  "oscillator.modulationCurveModeHelp": [
    "변조 강도 · FM / AM / 링",
    "FM 지수는 0–4입니다. AM 깊이와 링 변조 믹스는 0–100%입니다. 커브는 선택한 변조 모드를 따릅니다."
  ],
  "state.active": "활성",
  "state.bypassed": "바이패스",
  "state.on": "켜짐 · 클릭하면 끕니다",
  "state.off": "꺼짐 · 클릭하면 켜고 편집합니다",
  "hub.info": "단축키와 지원 파일 형식을 봅니다.",
  "hub.openAudio": "오디오 파일을 작업 음원으로 엽니다.",
  "hub.export": "재생에 쓰이는 것과 같은 음원을 24비트 WAV로 내려받습니다.",
  "hub.original": "원본 음원을 복원합니다.",
  "hub.grainSource": "모노 믹스는 왼쪽 50%와 오른쪽 50%를 섞습니다. 왼쪽이나 오른쪽을 선택하면 해당 원본 채널만 사용합니다.",
  "hub.openIR": "임펄스 응답으로 사용할 별도 파일을 엽니다.",
  "hub.rewind": "재생 위치를 처음으로 옮깁니다.",
  "hub.play": "스페이스바로 WAV에 저장되는 것과 같은 출력을 재생하거나 일시 정지합니다.",
  "hub.gain": "재생, WAV 저장, 다음 랩에 전달할 출력의 게인을 조절합니다. 처리 출력의 피크 상한은 −1 dBFS입니다.",
  "hub.clip": "출력 클리핑 표시입니다. 클릭하면 초기화됩니다.",
  "hub.fadeIn": "드래그하여 페이드인 길이를 정합니다.",
  "hub.fadeOut": "드래그하여 페이드아웃 길이를 정합니다.",
  "granular.durationInput": "출력 길이를 0~10분으로 설정합니다.",
  "oscillator.durationInput": "합성 길이를 0~10분으로 설정합니다. 임펄스 응답의 잔향으로 출력이 더 길어질 수 있습니다.",
  "state.spectralOn": "켜짐 · 선택된 효과를 다시 눌러 끕니다",
  "hub.exportStage": "‘{stage}’ 단계의 WAV를 내보냅니다. 미확정 편집은 제외됩니다.",
  "hub.selectedStage": "선택된 저장 단계: {stage} · Delete 키로 이 단계를 삭제합니다",
  "hub.savedStage": "저장된 단계: {stage} · 이전 단계: {parent}",
  "hub.source": "소스",
  "chain.timbre": "드래그로 순서를 바꿉니다. 키보드: Alt + ← / →",
  "chain.spectral": "클릭해 {effect} 편집 · 드래그해 처리 순서 변경 · 키보드 Alt + ← / →",
  "oscillator.sourceBand": "합성 방식을 선택합니다. 파일 임펄스 응답은 오실레이터 소리에 적용됩니다."
};
