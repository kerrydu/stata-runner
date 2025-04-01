"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const child_process_1 = require("child_process");
function activate(context) {
    // 注册运行选中文本的命令
    let runSelection = vscode.commands.registerCommand('stata-runner.runSelection', () => __awaiter(this, void 0, void 0, function* () {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor');
            return;
        }
        // 检查文件扩展名是否为.do或.mata
        const fileName = editor.document.fileName;
        if (!fileName.endsWith('.ado') && !fileName.endsWith('.do') && !fileName.endsWith('.mata')) {
            vscode.window.showErrorMessage('This command is only available for .do and .mata files');
            return;
        }
        // 获取选中文本或当前行
        let text = editor.document.getText(editor.selection);
        if (!text) {
            const line = editor.document.lineAt(editor.selection.active.line);
            text = line.text;
        }
        yield runStataCode(text, context);
    }));
    // 注册运行到光标位置命令
    let runToCursor = vscode.commands.registerCommand('stata-runner.runToCursor', () => __awaiter(this, void 0, void 0, function* () {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor');
            return;
        }
        // 检查文件扩展名是否为.do或.mata
        const fileName = editor.document.fileName;
        if (!fileName.endsWith('.ado') && !fileName.endsWith('.do') && !fileName.endsWith('.mata')) {
            vscode.window.showErrorMessage('This command is only available for .do and .mata files');
            return;
        }
        // 获取从文件开头到光标位置的内容
        const cursorPosition = editor.selection.active;
        const start = new vscode.Position(0, 0);
        const end = new vscode.Position(cursorPosition.line, cursorPosition.character);
        const range = new vscode.Range(start, end);
        const text = editor.document.getText(range);
        yield runStataCode(text, context);
    }));
    // 注册从光标到文档结尾运行命令
    let runFromCursorToEnd = vscode.commands.registerCommand('stata-runner.runFromCursorToEnd', () => __awaiter(this, void 0, void 0, function* () {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor');
            return;
        }
        // 检查文件扩展名是否为.do或.mata
        const fileName = editor.document.fileName;
        if (!fileName.endsWith('.ado') && !fileName.endsWith('.do') && !fileName.endsWith('.mata')) {
            vscode.window.showErrorMessage('This command is only available for .do and .mata files');
            return;
        }
        // 获取从光标位置到文档结尾的内容
        const cursorPosition = editor.selection.active;
        const start = new vscode.Position(cursorPosition.line, cursorPosition.character);
        const end = editor.document.lineAt(editor.document.lineCount - 1).range.end;
        const range = new vscode.Range(start, end);
        const text = editor.document.getText(range);
        yield runStataCode(text, context);
    }));
    context.subscriptions.push(runSelection, runToCursor, runFromCursorToEnd);
}
exports.activate = activate;
function runStataCode(code, context) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // 获取配置
            const config = vscode.workspace.getConfiguration('stata-runner');
            const stataPath = config.get('stataPath');
            const stataWindowTitle = config.get('stataWindowTitle', 'Stata/MP 18.0');
            const stataCommandHotkey = config.get('stataCommandHotkey', '^1');
            let tempFilePath = config.get('tempFilePath', '__do_tempfile__.do');
            // 确保临时文件路径以.do结尾
            if (!tempFilePath.endsWith('.do')) {
                tempFilePath = tempFilePath + '.do';
            }
            // 获取扩展目录中的runStata.exe路径
            const runStataPath = path.join(context.extensionPath, 'runStata.exe');
            if (!stataPath && process.platform !== 'darwin') {
                vscode.window.showErrorMessage('Please configure stata-runner.stataPath in settings');
                return;
            }
            // 创建临时文件目录（如果不存在）
            const tempFileFullPath = path.isAbsolute(tempFilePath)
                ? tempFilePath
                : path.join(vscode.workspace.rootPath || '', tempFilePath);
            const dir = path.dirname(tempFileFullPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            // 写入临时文件
            fs.writeFileSync(tempFileFullPath, code, 'utf8');
            // 根据平台执行不同的命令
            let command;
            if (process.platform === 'win32') {
                // Windows平台使用扩展目录中的runStata.exe
                command = `"${runStataPath}" "${stataPath}" "${stataWindowTitle}" "${stataCommandHotkey}" "${tempFileFullPath}"`;
            }
            else if (process.platform === 'darwin') {
                // macOS平台直接使用AppleScript
                command = `osascript -e 'tell application "Stata" to activate' -e 'tell application "Stata" to DoCommandAsync "do ${tempFileFullPath}"'`;
            }
            else {
                vscode.window.showErrorMessage('Unsupported platform');
                return;
            }
            (0, child_process_1.exec)(command, (error, stdout, stderr) => {
                if (error) {
                    vscode.window.showErrorMessage(`Failed to run Stata: ${stderr || error.message}`);
                    return;
                }
                vscode.window.showInformationMessage('Stata code executed successfully');
            });
        }
        catch (error) {
            vscode.window.showErrorMessage(`Error: ${error instanceof Error ? error.message : String(error)}`);
        }
    });
}
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map