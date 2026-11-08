export default {
  "source.source-pen": "编辑源音频波形的音量控制点和 Lab 的曲线控制点。再次单击返回音频选区模式。",
  "source.source-eraser": "删除音量或曲线控制点。音频片段保持不变。",
  "source.zoom-out": "显示更大范围的源音频波形。",
  "source.zoom-in": "放大源音频波形的一小段，以便查看细节。",
  "source.zoom-fit": "将完整的源音频波形显示在窗口内。",
  "source.undo-edit": "撤销最近一次源音频编辑。",
  "source.redo-edit": "重做最近一次撤销的源音频编辑。",
  "source.volume-reset": "将源音频的音量包络重置为 0 dB。",
  "source.delete": "删除选中的源音频片段，并拼接剩余部分。",
  "tab.audio": "调整播放速度、音高和立体声声像。",
  "tab.timbre": "通过滤波器和效果链塑造音色。",
  "tab.space": "在空间中移动声音，并调整距离和混响。",
  "tab.granular": "用源音频中的短颗粒构建声音。",
  "tab.spectral": "变换源音频的频谱成分。",
  "tab.oscillator": "对音频文件进行重合成，或生成振荡器声音。可以选用文件作为脉冲响应。",
  "tab.handoff": "切换 Lab 时，当前处理结果会保存为一个新阶段。",
  "lab.clearCurrent": "将选中的曲线恢复为默认值。",
  "audio.resetButton": "将速度、音高和声像曲线恢复为默认值。",
  "audio.stretchHelp": [
    "速度 · −2× 至 +2×",
    "改变源音频的播放速度。负值反向播放，0 则锁定源音频的播放位置。"
  ],
  "audio.pitchHelp": [
    "音高 · −2400 至 +2400 音分",
    "将音高升高或降低最多两个八度。1200 音分等于一个八度。"
  ],
  "audio.panHelp": [
    "声像 · 左 / 右",
    "在立体声声场中移动声音。上方对应左侧，中间对应中央，下方对应右侧。"
  ],
  "timbre.resetButton": "恢复所有曲线的默认值，关闭全部效果并清空效果链。",
  "timbre.lowpassModeHelp": [
    "低通 · 40 Hz–18 kHz",
    "设置截止频率，衰减高于该值的频率。处理采样率较低时，上限也会降低。"
  ],
  "timbre.highpassModeHelp": [
    "高通 · 40 Hz–18 kHz",
    "设置截止频率，衰减低于该值的频率。处理采样率较低时，上限也会降低。"
  ],
  "timbre.bandpassModeHelp": [
    "带通",
    "保留中心频率附近的一段频带。中心频率和带宽可分别调节。"
  ],
  "timbre.combModeHelp": [
    "梳状滤波",
    "将原信号与经过延迟和反馈的信号混合，产生带共振的梳状滤波。"
  ],
  "timbre.flangerModeHelp": [
    "镶边",
    "改变短延迟，使梳状滤波的陷波频率随之移动。可调节延迟、深度、速率、反馈和混合比例。"
  ],
  "timbre.chorusModeHelp": [
    "合唱",
    "对延迟声部进行调制，使声音更饱满。可调节延迟、深度、速率和混合比例。"
  ],
  "timbre.delayModeHelp": [
    "延迟",
    "产生重复回声。可调节延迟时间、反馈和混合比例。"
  ],
  "timbre.bandpassCenterParamHelp": [
    "中心频率 · 40 Hz–18 kHz",
    "移动带通滤波器的中心频率。处理采样率较低时，上限也会降低。"
  ],
  "timbre.bandpassWidthParamHelp": [
    "带宽 · 0–100%",
    "调节通带宽度。0% 为窄带（Q 12），100% 为宽带（Q 0.5）。无论宽度如何，滤波器都保持启用。"
  ],
  "timbre.combDelayParamHelp": [
    "梳状滤波延迟 · 0.5–100 ms",
    "设置延迟时间，决定梳状滤波共振峰之间的间隔。"
  ],
  "timbre.combFeedbackParamHelp": [
    "梳状滤波反馈 · 0–0.95",
    "将一部分延迟信号送回延迟单元。值越高，共振持续得越久。"
  ],
  "timbre.combMixParamHelp": [
    "梳状滤波量 · 0–100%",
    "0% 为原信号。100% 为梳状滤波后的信号，其中包含原声与延迟声。"
  ],
  "timbre.flangerDelayParamHelp": [
    "镶边延迟 · 0.5–10 ms",
    "设置调制扫动的中心延迟时间。"
  ],
  "timbre.flangerDepthParamHelp": [
    "镶边深度 · 0–10 ms",
    "设置扫动深度。实际深度最高为延迟时间减去 0.25 ms。"
  ],
  "timbre.flangerRateParamHelp": [
    "镶边速率 · 0.02–5 Hz",
    "设置每秒的调制周期数。"
  ],
  "timbre.flangerFeedbackParamHelp": [
    "镶边反馈 · 0–0.85",
    "将延迟信号送回延迟单元，增强扫动时的共振。"
  ],
  "timbre.flangerMixParamHelp": [
    "镶边混合 · 0–100%",
    "混合原声与延迟声。0% 为原声，100% 为效果声。"
  ],
  "timbre.chorusDelayParamHelp": [
    "合唱延迟 · 10–35 ms",
    "设置合唱声部的基础延迟时间。"
  ],
  "timbre.chorusDepthParamHelp": [
    "合唱深度 · 0–20 ms",
    "设置扫动深度。实际深度最高为延迟时间减去 5 ms。"
  ],
  "timbre.chorusRateParamHelp": [
    "合唱速率 · 0.02–3 Hz",
    "设置每秒的合唱调制周期数。"
  ],
  "timbre.chorusMixParamHelp": [
    "合唱混合 · 0–100%",
    "混合原声与合唱声。0% 为原声，100% 为效果声。"
  ],
  "timbre.delayTimeParamHelp": [
    "延迟时间 · 100 ms–1.5 s",
    "设置各次回声之间的间隔。"
  ],
  "timbre.delayFeedbackParamHelp": [
    "延迟反馈 · 0–0.85",
    "设置回送到延迟单元以继续产生回声的信号比例。"
  ],
  "timbre.delayMixParamHelp": [
    "延迟混合 · 0–100%",
    "混合原声与回声。0% 为原声，100% 为效果声。"
  ],
  "space.resetButton": "恢复所有曲线，开启方向，关闭距离和混响，并将衰减时间设为 1.2 秒。",
  "space.reverbDecay": "将混响衰减时间设为 0.3–4 秒。",
  "space.directionModeHelp": [
    "方向 · −1800° 至 +1800°",
    "让声音绕听者移动。正值为顺时针，负值为逆时针。360° 为一圈。"
  ],
  "space.distanceModeHelp": [
    "距离 · 0–1",
    "从近（0）到远（1）改变音量、滤波和距离感。数值无法换算为实际距离。"
  ],
  "space.reverbModeHelp": [
    "混响量 · 0–100%",
    "绘制送入混响的信号量。衰减时间可在 0.3–4 s 内另行设置。混响尾音随文件结束而停止。"
  ],
  "granular.resetButton": "恢复所有曲线的默认值，并将源音频窗口重置为开头处的最短范围。",
  "granular.positionModeHelp": [
    "读取位置 · 源音频窗口的 0–100%",
    "选择颗粒在选定源音频窗口内的起始位置。输出播放时间保持不变。"
  ],
  "granular.spreadModeHelp": [
    "扩散 · 0–100%",
    "在选定的源音频窗口内，以读取位置为中心随机分散颗粒读取位置。"
  ],
  "granular.sizeModeHelp": [
    "颗粒长度 · 5–1000 ms",
    "设置颗粒长度。为使当前音高下的读取始终位于源音频窗口内，实际长度可能更短。"
  ],
  "granular.densityModeHelp": [
    "密度 · 每秒 1–80 个颗粒",
    "设置每秒新生成的颗粒数。预听最多同时播放 64 个颗粒，密度或长度较高时降为 32 个，并保留短暂的淡出尾音。离线渲染会处理所有排定的颗粒。"
  ],
  "granular.pitchLowModeHelp": [
    "低音高 · −24 至 +24 半音",
    "设置颗粒随机音高范围的一端。低值超过高值时，两端会重新排序。"
  ],
  "granular.pitchHighModeHelp": [
    "高音高 · −24 至 +24 半音",
    "设置颗粒随机音高范围的另一端。12 半音等于一个八度。音高也会改变颗粒读取速度。"
  ],
  "spectral.resetButton": "将所有频谱曲线恢复为默认值。",
  "spectral.shiftModeHelp": [
    "频谱平移 · −2000 至 +2000 Hz",
    "将频谱中的各频率平移固定的 Hz 数值。0 Hz 时位置不变。"
  ],
  "spectral.stretchModeHelp": [
    "频谱拉伸 · 0.5–2",
    "以 1 kHz 为基准，压缩或扩大频率间隔。1 表示不变。播放速度和文件时长保持不变。"
  ],
  "spectral.blurModeHelp": [
    "频谱模糊 · 0–100%",
    "平滑频谱随时间的变化。0% 表示不变，频率位置和文件时长保持不变。"
  ],
  "spectral.harmonicityModeHelp": [
    "谐波性 · −100% 至 +100%",
    "调整频谱峰之间的关系。负值使其更接近谐波关系，正值使其偏离谐波关系。0% 表示不变。"
  ],
  "spectral.freezeModeHelp": [
    "频谱冻结 · 0–100%",
    "保持捕获的频谱状态。0% 为关闭，100% 为完全保持。文件时长保持不变。"
  ],
  "oscillator.resetButton": "将当前合成模式的全部曲线恢复为默认值。",
  "oscillator.resynthesisMode": "分析工作音频，用分音重建其频谱。",
  "oscillator.convolutionButton": "生成振荡器声音，并可选用文件作为脉冲响应来塑造声音。",
  "oscillator.sine": "为振荡器选用正弦波。",
  "oscillator.triangle": "为振荡器选用三角波。",
  "oscillator.saw": "为振荡器选用锯齿波。",
  "oscillator.square": "为振荡器选用方波。",
  "oscillator.countSelect": "选择要使用的振荡器数量。",
  "oscillator.stackSelect": "选择振荡器频率相对于基频的排列方式。",
  "oscillator.modulationSelect": "选择 FM、AM 或环形调制，或关闭调制。",
  "oscillator.modulationRatioInput": "以各振荡器频率的倍数设置调制器频率。",
  "oscillator.partialCountSelect": "将重合成使用的分音数量上限设为 32 或 64。",
  "oscillator.convolutionWet": "混合振荡器原声与脉冲响应处理后的声音。",
  "oscillator.impulseLength": "设置要使用的脉冲响应长度。短于 3 秒的文件会完整使用。",
  "oscillator.basePitchModeHelp": [
    "基频 · 20–4000 Hz",
    "设置振荡器组的基频。在文件重合成模式下，将分析出的分音整体移调。"
  ],
  "oscillator.deviationModeHelp": [
    "偏移 · 取决于音源和频率排列",
    "同度模式下，各声部最多偏移 ±50 音分。其他排列方式和文件重合成模式以 0–0.38 的幅度改变分音关系。0 保留原来的排列。"
  ],
  "oscillator.slopeModeHelp": [
    "频谱斜率 · −24 至 +12 dB/oct",
    "按各声部或分音相对于基频的频率调整其电平。负值偏重低频，正值偏重高频。"
  ],
  "oscillator.modulationCurveModeHelp": [
    "调制强度 · FM / AM / 环形",
    "FM 指数范围为 0–4。AM 深度和环形调制混合量为 0–100%。曲线随选中的调制模式变化。"
  ],
  "state.active": "已启用",
  "state.bypassed": "已旁通",
  "state.on": "已开启 · 单击关闭",
  "state.off": "已关闭 · 单击开启并编辑",
  "hub.info": "查看快捷键和受支持的文件格式。",
  "hub.openAudio": "打开音频文件作为工作音源。",
  "hub.export": "将选中的已保存阶段下载为 WAV。未保存的编辑不会包含在内。",
  "hub.original": "恢复原始音频。",
  "hub.grainSource": "单声道混合由 50% 左声道与 50% 右声道组成。选择左或右时，只使用对应的原始声道。",
  "hub.openIR": "打开另一个文件用作脉冲响应。",
  "hub.rewind": "将播放位置移到开头。",
  "hub.play": "按空格键播放或暂停当前 Lab。",
  "hub.gain": "调节实时播放和传给下一 Lab 的音量。传递时的峰值上限为 −1 dBFS。",
  "hub.clip": "输出削波指示。单击重置。",
  "hub.fadeIn": "拖动以设置淡入时长。",
  "hub.fadeOut": "拖动以设置淡出时长。",
  "granular.durationInput": "将输出时长设为 0–10 分钟。",
  "oscillator.durationInput": "将合成时长设为 0–10 分钟。脉冲响应的尾音可能延长输出。",
  "state.spectralOn": "已启用 · 再次点击已选效果即可关闭",
  "hub.exportStage": "将已保存阶段 {stage} 导出为 WAV。未确认的编辑不包含在内。",
  "hub.selectedStage": "选中的已保存阶段：{stage} · 按 Delete 删除此阶段",
  "hub.savedStage": "已保存阶段：{stage} · 上一阶段：{parent}",
  "hub.source": "源音频",
  "chain.timbre": "拖动以重新排序。键盘：Alt + ← / →",
  "chain.spectral": "点击编辑 {effect}，拖动以更改处理顺序。键盘：Alt + ← / →",
  "oscillator.sourceBand": "选择合成方式。文件脉冲响应会作用于振荡器声音。"
};
