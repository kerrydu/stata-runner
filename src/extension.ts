import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';

export function activate(context: vscode.ExtensionContext) {
    // 注册运行选中文本的命令
    let runSelection = vscode.commands.registerCommand('stata-runner.runSelection', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor');
            return;
        }
        
        // 检查文件扩展名是否为.do或.mata
        const fileName = editor.document.fileName;
        if (!fileName.endsWith('.ado') &&!fileName.endsWith('.do') && !fileName.endsWith('.mata')) {
            vscode.window.showErrorMessage('This command is only available for .do and .mata files');
            return;
        }

        // 获取选中文本或当前行
        let text = editor.document.getText(editor.selection);
        if (!text) {
            const line = editor.document.lineAt(editor.selection.active.line);
            text = line.text;
        }

        await runStataCode(text);
    });

    // 注册运行到光标位置命令
    let runToCursor = vscode.commands.registerCommand('stata-runner.runToCursor', async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor');
            return;
        }
        
        // 检查文件扩展名是否为.do或.mata
        const fileName = editor.document.fileName;
        if (!fileName.endsWith('.do') && !fileName.endsWith('.mata')) {
            vscode.window.showErrorMessage('This command is only available for .do and .mata files');
            return;
        }

        // 获取从文件开头到光标位置的内容
        const cursorPosition = editor.selection.active;
        const start = new vscode.Position(0, 0);
        const end = new vscode.Position(cursorPosition.line, cursorPosition.character);
        const range = new vscode.Range(start, end);
        const text = editor.document.getText(range);

        await runStataCode(text);
    });

    context.subscriptions.push(runSelection, runToCursor);
}

async function runStataCode(code: string) {
    try {
        // 获取配置
        const config = vscode.workspace.getConfiguration('stata-runner');
        const stataPath = config.get<string>('stataPath');
        const stataWindowTitle = config.get<string>('stataWindowTitle', 'Stata/MP 18.0');
        const stataCommandHotkey = config.get<string>('stataCommandHotkey', '^1');
        const tempFilePath = config.get<string>('tempFilePath', '__do_tempfile__.do');
        const runStataPath = config.get<string>('runStataPath');

        if (!stataPath) {
            vscode.window.showErrorMessage('Please configure stata-runner.stataPath in settings');
            return;
        }
        if (!runStataPath) {
            vscode.window.showErrorMessage('Please configure stata-runner.runStataPath in settings');
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

        // 调用runStata.exe
        const command = `"${runStataPath}" "${stataPath}" "${stataWindowTitle}" "${stataCommandHotkey}" "${tempFileFullPath}"`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                vscode.window.showErrorMessage(`Failed to run Stata: ${stderr || error.message}`);
                return;
            }
            vscode.window.showInformationMessage('Stata code executed successfully');
        });
    } catch (error) {
        vscode.window.showErrorMessage(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export function deactivate() {}