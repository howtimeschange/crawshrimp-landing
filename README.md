# 抓虾官网落地页

这是抓虾 crawshrimp 的官网落地页，部署在 Cloudflare Pages 上。项目是纯静态站，没有前端框架、构建脚本或服务端代码。

## 项目结构

- `index.html`：首页落地页
- `download.html`：下载页，会动态读取 GitHub Release 里的安装包
- `screenshot-*`：首页轮播截图
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
https://api.github.com/repos/howtimeschange/crawshrimp-free/releases/tags/desktop-latest
```

下载页依赖这个 Release tag 下的 assets 命名来自动识别安装包：

- `mac-arm64`：macOS Apple Silicon
- `mac-x64`：macOS Intel
- `win-x64.exe`：Windows

发布新版桌面端时，需要更新 `howtimeschange/crawshrimp-free` 仓库中 `desktop-latest` 这个 tag 对应的 Release assets。只要文件名继续包含上面的平台标识，落地页无需改代码。
