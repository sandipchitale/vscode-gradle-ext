import * as vscode from 'vscode';
import * as os from 'os';
import * as path from 'path';
import * as child_process from 'child_process';

let workspaceFolder: string;

let APPLY_GRADLE_VERSION_PLUGIN_DOT_GRADLE = 'gradle/gradle-versions-plugin.gradle';
let APPLY_GRADLE_EXPLORER_DOT_GRADLE = 'gradle/gradle-explorer.gradle';
let APPLY_GRADLE_GROOVYSH_DOT_GRADLE = 'gradle/gradle-groovysh.gradle';
let APPLY_GRADLE_TASKINFO_DOT_GRADLE = 'gradle/gradle-taskinfo.gradle';

let outputChannel: vscode.OutputChannel;

export function activate(context: vscode.ExtensionContext) {
    APPLY_GRADLE_VERSION_PLUGIN_DOT_GRADLE = path.join(context.extensionPath, 'gradle', 'gradle-versions-plugin.gradle');
    APPLY_GRADLE_EXPLORER_DOT_GRADLE = path.join(context.extensionPath, 'gradle', 'gradle-explorer.gradle');
    APPLY_GRADLE_GROOVYSH_DOT_GRADLE = path.join(context.extensionPath, 'gradle', 'gradle-groovysh.gradle');
    APPLY_GRADLE_TASKINFO_DOT_GRADLE = path.join(context.extensionPath, 'gradle', 'gradle-taskinfo.gradle');

    if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
        workspaceFolder = vscode.workspace.workspaceFolders[0].uri.fsPath;
    }

    outputChannel = vscode.window.createOutputChannel(context.extension.id.replace('sandipchitale.', ''));

    context.subscriptions.push(vscode.commands.registerCommand('vscode-gradle-ext.dependencyUpdates', dependencyUpdates));
    context.subscriptions.push(vscode.commands.registerCommand('vscode-gradle-ext.explorer', explorer));
    context.subscriptions.push(vscode.commands.registerCommand('vscode-gradle-ext.groovysh', groovysh));
    context.subscriptions.push(vscode.commands.registerCommand('vscode-gradle-ext.tiOrder', tiOrder));
    context.subscriptions.push(vscode.commands.registerCommand('vscode-gradle-ext.tiTree', tiTree));
    context.subscriptions.push(vscode.commands.registerCommand('vscode-gradle-ext.copyName', copyName));
    context.subscriptions.push(vscode.commands.registerCommand('vscode-gradle-ext.copyPath', copyPath));
    context.subscriptions.push(vscode.commands.registerCommand('vscode-gradle-ext.helpTask', helpTask));
    context.subscriptions.push(vscode.commands.registerCommand('vscode-gradle-ext.dependencyInsight', dependencyInsight));
    context.subscriptions.push(vscode.commands.registerCommand('vscode-gradle-ext.dependenciesConfiguration', dependenciesConfiguration));
    context.subscriptions.push(vscode.commands.registerCommand('vscode-gradle-ext.copyLabel', copyLabel));
}

function dependencyUpdates() {
    aprt(APPLY_GRADLE_VERSION_PLUGIN_DOT_GRADLE, 'dependencyUpdates');
}

function explorer() {
    aprt(APPLY_GRADLE_EXPLORER_DOT_GRADLE, '-Pgradle-explorer -q :tasks');
}

function groovysh() {
    if (workspaceFolder) {
        const terminal = vscode.window.createTerminal({
            name: 'groovysh',
            cwd: workspaceFolder
        });
        terminal.show();
        terminal.sendText(`.${path.sep}gradlew -q --no-daemon --console=plain --init-script ${APPLY_GRADLE_GROOVYSH_DOT_GRADLE} groovysh`);
    }
}

function tiOrder(taskTreeItem: any) {
    aprt(APPLY_GRADLE_TASKINFO_DOT_GRADLE, `:tiOrder ${_taskPath(taskTreeItem.task)}`);
}

function tiTree(taskTreeItem: any) {
    aprt(APPLY_GRADLE_TASKINFO_DOT_GRADLE, `:tiTree ${_taskPath(taskTreeItem.task)}`);
}

function helpTask(taskTreeItem: any) {
    aprt('', `help --task ${_taskPath(taskTreeItem.task)}`);
}

function dependencyInsight(dependencyTreeItem: any) {
    aprt('', `dependencyInsight --dependency ${dependencyTreeItem.label.replace(/ \(\*\)$/, '')}`);
}

function dependenciesConfiguration(configurationTreeItem: any) {
    aprt('', `dependencies --configuration ${configurationTreeItem.label}`);
}

function copyLabel(treeItem: any) {
    _copy(treeItem.label.replace(/ \(\*\)$/, ''));
}

function copyName(taskTreeItem: any) {
    _copy(taskTreeItem.label);
}

function copyPath(taskTreeItem: any) {
    _copy(_taskPath(taskTreeItem.task));
}

function _taskPath(task: any): string {
    return `:${task.name}`;
}

function _copy(item: string) {
    vscode.env.clipboard.writeText(item);
}

async function aprt(plugin: string, tasks: string) {
    if (workspaceFolder) {
        const command = `${path.join(workspaceFolder, (os.platform() === 'win32' ? 'gradlew.bat' : 'gradlew'))} ${plugin !== '' ? '--init-script ' + plugin : ''} ${tasks}`;
        outputChannel?.appendLine(`cd ${workspaceFolder}`);
        outputChannel?.appendLine(command);
        outputChannel?.appendLine('-');

        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `Running ${(os.platform() === 'win32' ? 'gradlew.bat' : 'gradlew')} ${tasks}`
        }, (progress, token) => {
            return new Promise((resolve, reject) => {
                child_process.exec(command,
                    {
                        cwd: `${workspaceFolder}`
                    },
                    async (err, stdout, stderr) => {
                        if (err) {
                            vscode.window.showErrorMessage(`${tasks} failed.`);
                            // Open the document
                            const templatePreviewDocument: vscode.TextDocument = await vscode.workspace.openTextDocument({
                                language: 'plaintext',
                                content: `${(os.platform() === 'win32' ? 'gradlew.bat' : 'gradlew')} ${tasks}\n\ncd ${workspaceFolder}\n${command}\n-\n\n${stderr}`
                            });
                            const tdependencyUpdatesTextEditor = await vscode.window.showTextDocument(templatePreviewDocument, vscode.ViewColumn.Active);
                            reject(err);
                        } else {
                            let stdoutArray = stdout.split(/\r?\n/).filter((line) => !(/ SKIPPED$/).test(line));
                            // Delete lines till task of interest starts
                            while (stdoutArray.length > 0) {
                                const line = stdoutArray.shift();
                                if (line?.startsWith('> Task')) {
                                    stdoutArray.unshift(line);
                                    break;
                                }
                            }
                            stdout = stdoutArray.join('\n');
                            // Open the document
                            const templatePreviewDocument: vscode.TextDocument = await vscode.workspace.openTextDocument({
                                language: 'plaintext',
                                content: `${(os.platform() === 'win32' ? 'gradlew.bat' : 'gradlew')} ${tasks}\n\ncd ${workspaceFolder}\n${command}\n-\n\n${stdout}`
                            });
                            const tdependencyUpdatesTextEditor = await vscode.window.showTextDocument(templatePreviewDocument, vscode.ViewColumn.Active);
                            resolve(0);
                        }
                    }
                );
            });
        });
    }
}

export function deactivate() {}
