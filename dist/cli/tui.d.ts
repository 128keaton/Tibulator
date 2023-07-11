import * as blessed from 'neo-blessed';
import { Config } from '../lib/parse/config';
export declare const getBaseUI: (parent: blessed.Widgets.Screen) => {
    titleBar: blessed.Widgets.BoxElement;
    errorBox: blessed.Widgets.BoxElement;
    configList: blessed.Widgets.ListElement;
    deviceList: blessed.Widgets.ListElement;
    previewBox: blessed.Widgets.BoxElement;
    actionForm: blessed.Widgets.FormElement<unknown>;
    submitButton: blessed.Widgets.ButtonElement;
    scanButton: blessed.Widgets.ButtonElement;
};
export declare const updateConfigList: (configList: blessed.Widgets.ListElement, config: Config) => void;
