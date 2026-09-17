# 抓虾官网落地页

这是抓虾 crawshrimp 的官网落地页，部署在 Cloudflare Pages 上。项目是纯静态站，没有前端框架、构建脚本或服务端代码。

## 项目结构

- `index.html`：首页落地页，完整展示电商自动化、AI 图片/视频生产与云端协作能力
- `download.html`：下载页，会动态读取 GitHub Release 里的安装包
- `motion.js`：GSAP 动效脚本，负责首页入场、滚动显现和下载页轻量动效
- `crawshrimp-intro-16x9.mp4`：首页首屏社群宣传片（16:9）
- `screenshot-*`：产品能力展示截图
- `wechat-qr.jpg`：购买咨询二维码

## 本地预览

建议用本地静态服务器预览，避免 `file://` 打开时根路径链接（例如 `/download.html`）和线上表现不一致。

```bash
python3 -m http.server 8788
```

然后访问：

```text
http://localhost:8788/
```

## Cloudflare Pages 设置

这个项目根目录就是部署产物。Cloudflare Pages 连接 GitHub 仓库后，建议保持以下设置：

- Production branch：`main`
- Framework preset：`None`
- Build command：留空
- Build output directory：`/`
- Root directory：仓库根目录

更新页面后推送到 `main`，Cloudflare Pages 会自动触发新部署。

## 下载页 Release 依赖

`download.html` 会请求 GitHub Releases API：

```text
https://api.github.com/repos/howtimeschange/crawshrimp/releases/latest
```

下载页依赖最新正式 Release 下的 assets 命名来自动识别安装包：

- `mac-arm64`：macOS Apple Silicon
- `mac-x64`：macOS Intel
- `win-x64.exe`：Windows x64
- `win-arm64.exe`：Windows 11 ARM64

发布新版桌面端时，需要在 `howtimeschange/crawshrimp` 仓库发布正式 Release 并设为 Latest，上传以上四种架构的安装包。下载页跟随最新正式版，不再依赖可能滞后的 `desktop-latest`。

Windows 自动推荐优先使用浏览器 User-Agent Client Hints 的架构信息，兼容明确带 ARM64 的 User-Agent。无法确认架构时不猜测，用户可从全部安装包中手动选择；未知系统不自动推荐 macOS 安装包。

## Be UI 交互升级

保留静态 HTML / CSS / JavaScript 与现有 GSAP，不引入 React、Tailwind 或构建依赖。

- `interactions.css` / `interactions.js`：产品预览标签、当前章节导航、移动端菜单与原生咨询对话框。
- 参考 [Tabs](https://beui.dev/components/motion/tabs)、[Expandable Tabs](https://beui.dev/components/blocks/expandable-tabs) 与 Preview Rail 的分组预览思路：视频 / 适配包 / 结果文件可切换，方向键、Home、End 可操作，图片保持完整比例。截图为现有仓库的界面示例。
- 参考 [Dock](https://beui.dev/components/motion/dock) 的选中反馈：根据阅读章节标记导航；窄屏使用独立菜单。
- 参考 [Morphing Modal](https://beui.dev/components/motion/morphing-modal) / [Drawer](https://beui.dev/components/motion/drawer) 的弹层反馈：沿用纸色与橙色，使用原生 dialog 管理焦点、Esc 和背景隔离。
- 产品介绍视频静音自动循环播放，不显示播放器控件；隐藏后暂停，返回时自动续播；减少动态效果偏好下关闭新增动画。内容默认可见，即使 GSAP 未加载也可阅读。
- 不采用图表、Agent 聊天、动态通知等组件：官网没有对应的实时数据或任务状态来源。

本地验收：桌面与 390px / 320px 窄屏、标签键盘操作、菜单锚点、咨询关闭与焦点恢复、下载页回归。发布仍走原有 Cloudflare Pages 流程。
