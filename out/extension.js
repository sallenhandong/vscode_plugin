"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function (resolve) {
            resolve(value);
        });
    }
    return new(P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }

        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }

        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const camelcase_1 = require("../modules/camelcase");
const jsx_extensions_1 = require("./commons/jsx-extensions");
const component_name_1 = require("./prompts/component-name");
const component_type_1 = require("./prompts/component-type");
const language_1 = require("./prompts/language");
const create_type_1 = require("./prompts/create-type");
// ============================================================================
function activate(context) {
    const commandNewComponent = vscode.commands.registerCommand('extension.SANewComponent', newComponent);
    context.subscriptions.push(commandNewComponent);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
    //
}
exports.deactivate = deactivate;
const newComponent = (uri) => __awaiter(void 0, void 0, void 0, function* () {
    const name = yield component_name_1.default();
    const type = yield component_type_1.default();
    const language = 'typescript'
    const createType = yield create_type_1.default(name, language);
    const ext = 'tsx'
    //
    const templates = {
        jsx: vscode.Uri.file(path.resolve(__dirname, '..', `templates/${type}-${language}/index.${ext}`)),
        styles: vscode.Uri.file(path.resolve(__dirname, '..', `templates/${type}-${language}/styles.scss`))
    };
    const newFiles = {};
    switch (createType) {
        case 'folder': {
            const newFolder = vscode.Uri.file(`${uri.path}/${name}`);
            newFiles.jsx = vscode.Uri.file(`${newFolder.path}/index.${ext}`);
            newFiles.styles = vscode.Uri.file(`${newFolder.path}/index.scss`);
            yield vscode.workspace.fs.createDirectory(newFolder);
            break;
        }
        case 'file': {
            newFiles.jsx = vscode.Uri.file(`${uri.path}/${name}.${ext}`);
            newFiles.styles = vscode.Uri.file(`${uri.path}/${name}.scss`);
            break;
        }
        default: {}
    }

    // 复制文件
    yield vscode.workspace.fs.copy(templates.jsx, newFiles.jsx);
    yield vscode.workspace.fs.copy(templates.styles, newFiles.styles);
    // 修改文件内容
    const needChange = {
        componentName: camelcase_1.default(name, {
            pascalCase: true
        })
    };

    const contentJSX = (yield vscode.workspace.fs.readFile(newFiles.jsx))
        .toString()
        .replace(/NEED_CHANGE_CLASS_NAME/g, `${needChange.componentName}`)
        .replace(/'NEED_CHANGE_COMPONENT_NAME'/g, `${needChange.componentName}`);

    fs.writeFileSync(newFiles.jsx.fsPath, contentJSX, 'utf-8');
    yield vscode.window.showTextDocument(newFiles.jsx);
});
