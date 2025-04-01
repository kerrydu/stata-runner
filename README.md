# Stata Runner Extension Documentation (English)

## Installation Guide
1. Download the extension `stata-runner-0.3.6.vsix` from GitHub repository:
   - URL: https://github.com/kerrydu/stata-runner/blob/main/stata-runner-0.3.6.vsix
2. Install the extension manually in VS Code
3. Perform necessary configurations after installation

## ~~Download runStata.exe~~
~~1. Download from GitHub repository:~~
   ~~- Repository URL: https://github.com/kerrydu/stata-runner~~

## Required Configuration
1. **Stata Executable Path**:
   - Open Settings (Ctrl+,)
   - Search for "stata-runner.stataPath"
   - Enter full Stata path, e.g.: `C:\Program Files\Stata18\StataMP-64.exe`
   - Note: Path should not contain Chinese characters or special symbols
   - **macOS Note**: This setting is not required on macOS

~~2. **runStata.exe Path (Windows only)**:~~
   ~~- Configure the full path to runStata.exe~~
   ~~- **Note**: This setting is only required for Windows platform~~

3. **Temporary File Settings**:
   - Default uses `__do_tempfile__.do`
   - Important: This file will be overwritten

4. **Stata Window Title**:
   - Configure the exact title of your Stata window (e.g. "Stata/MP 18.0")
   - Must match exactly including version number
   - **macOS Note**: This setting is not required on macOS

## Keyboard Shortcuts
- `Ctrl+Enter` Run selected code/current line
- `Ctrl+ALT+Enter` Run to cursor position
- `Ctrl+ALT+\` Run from cursor to end of document

## Usage Notes
1. Supports only .do/.ado/.mata file formats
2. Ensure Stata window is open before execution
3. Execution will auto-activate Stata command window (default Ctrl+1)
4. Temporary files are automatically deleted after saving

## Troubleshooting
- Confirm Stata window title exactly matches configuration
- Check path for Chinese characters or spaces
- View debug information in Output panel (Ctrl+Shift+U)

---

# Stata Runner 扩展说明

## 安装指南
1. 从GitHub仓库下载插件:`stata-runner-0.3.6.vsix`
   - 仓库地址：https://github.com/kerrydu/stata-runner/blob/main/stata-runner-0.3.6.vsix
2. 在VS Code中手动安装扩展
3. 安装完成后需进行必要配置

## 下载安装

## ~~下载runStata.exe~~
~~1. 从GitHub仓库下载：~~
   ~~- 仓库地址：https://github.com/kerrydu/stata-runner~~

# 必要配置
1. **Stata可执行路径**：
   - 打开设置 (Ctrl+,)
   - 搜索 "stata-runner.stataPath"
   - 填写完整Stata路径，例如：`C:\Program Files\Stata18\StataMP-64.exe`
   - 注意：路径不要包含中文或特殊字符
   - **macOS说明**：macOS系统完全不需要配置此路径，插件会自动识别Stata应用

~~2. **runStata.exe路径 (仅Windows)**：~~
   ~~- 配置runStata.exe的完整路径~~
   ~~- **注意**：此设置仅适用于Windows平台~~

3. **临时文件设置**：
   - 默认使用`__do_tempfile__.do`
   - 重要：该文件会被覆盖

4. **Stata窗口标题**：
   - 配置Stata窗口的完整标题（例如"Stata/MP 18.0"）
   - 必须与实际窗口标题完全匹配，包括版本号
   - **macOS Note**: This setting is not required on macOS

## 快捷键说明
- `Ctrl+Enter` 运行选中代码/当前行
- `Ctrl+Alt+Enter` 运行到光标位置
- `Ctrl+Alt+\` 从光标位置运行到文档末尾

## 使用注意事项
1. 仅支持.do/.ado/.mata文件格式
2. 执行前请确保Stata窗口已打开
3. 执行时会自动激活Stata命令窗口 (默认Ctrl+1)
4. 临时文件保存后自动删除

## 故障排查
- 确保Stata窗口标题与配置完全匹配
- 检查路径是否包含中文或空格
- 查看输出面板的调试信息 (Ctrl+Shift+U)