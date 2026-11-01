# C 版分层工程 v4（衍生素材待验收）

四张原始 PNG 已获用户美术确认且保存在 Google Drive「游戏开发文件」。当前不修改线上演示，不把工程试制当成正式卡牌。

## 已做
- 从道具母图提取 20 个独立 RGBA PNG，生成含 bbox、锚点和命名的 sprite_manifest.json。切菜板+番茄+胡萝卜属于互相遮挡的组合组件，仍不能单独转动。
- 厨师徽章从原框独立分层，形成公共无徽章卡框和单独空白徽章承托层；原框不变。新的空白徽章座属于需要视觉验收的候选。
- 有独立卡面彩虹 Shader、打印区域遮罩、滑块和鼠标角度交互的离线 WebGL 预览。
- ZIP 保存 20 贴图、卡框、徽章、镀闪膜、预览与可重复生产脚本。衍生 PNG 在用户的 Google Drive 工作区，不公开复制到 GitHub。

## 复用
`python tools/slice_sprite_sheet.py <rgba-input.png> <output-directory>`，依赖 numpy、Pillow、opencv-python-headless。每张新卡只改变素材/manifest，不为人物重写相同 Shader。

## 未解决的质量风险
- 角色、背景和金色框的原始艺术文件已烘焙虹彩反光。Shader 关闭仅移除新增的 **独立膜层**，**不能无损移除已压平的静态反光**；需美术制作/复核无闪基础稿。
- 新空白徽章座、切片抗锯齿/光晕效果仍须艺术验收。不要把其状态写作 production-approved。
- 线上 WebGL 页未被替换。