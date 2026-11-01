# 一二布布 · 可复用立体镀闪卡牌引擎

方案 C：立体层次 × **全卡面**动态镀闪。它是能够批量生产卡牌的基础工程，而非仅针对「厨师布」写死的单卡网页。

## 已实现的结构
- Three.js 立体卡框、独立角色画面、3D 倾斜及卡面专用虹彩镀闪 Shader
- 卡牌目录（src/catalog.js）与共享渲染器（src/engine/）分离
- 两种主题配色调用**同一张角色资源**，用于验证复用而不是虚构新角色
- 移动端指针操作、镀闪强度控制、低分辨率屏幕适配
- 固定版本 Three.js CDN，无需 npm 打包或 Blender

**重要：** 当前角色 SVG 是明确标识的技术占位图，非已验收的原作基准，也不是最终厨师布原画。正式资产要按 docs/ASSET_SPEC.md 替换；先验证引擎架构和视觉方向。

## 运行
仓库根目录运行：
- python3 -m http.server 8000
- 浏览器打开 http://localhost:8000

必须使用 HTTP，不能直接双击 file://。Three.js 通过 CDN 加载，首次预览需要网络。

运行测试：npm run check（只依赖 Node 22，不需安装 npm 依赖）。

## 怎样增加卡牌
1. 将透明角色图放在 assets/cards/<id>/character.png（或 WebP），背景可独立保存。
2. 在 src/catalog.js 增加一条配置（id、名称、角色路径、主题色、星级、镀闪参数）。
3. 通用卡框、倾斜、Shader、材质继续使用 src/engine/，不复制代码。
4. 跑测试并人工检查原作还原度、卡面光泽与移动端效果。

## 发布
提供 .github/workflows/pages.yml。GitHub 仓库 Settings → Pages → Source 选 GitHub Actions 后触发部署。未启用 Pages 时部署可能失败，不能据此判断代码失败。

## 当前限制
尚未导入已确认的官方原画分层，也未做正式角色动画/真机性能测试。当前重点是**可复用渲染骨架**。