"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateConfigList = exports.getBaseUI = void 0;
const blessed = __importStar(require("neo-blessed"));
const getBaseUI = (parent) => {
    const titleBar = blessed.box({
        parent,
        top: '0',
        left: 'center',
        right: 'center',
        align: 'center',
        width: '100%',
        focusable: false,
        height: 3,
        tags: true,
        content: '{center}Tibulator: {red-fg}[disconnected]{/red-fg}{/center}',
        border: {
            type: 'line',
        },
        style: {
            fg: 'white',
            border: {
                fg: '#f0f0f0',
            },
        },
    });
    const errorBox = blessed.box({
        parent,
        top: 'center',
        left: 'center',
        height: '50%',
        align: 'center',
        width: '50%',
        tags: true,
        hidden: true,
        border: {
            type: 'line',
        },
        style: {
            fg: 'white',
            bg: 'red',
            border: {
                fg: '#f0f0f0',
            },
        },
    });
    const configList = blessed.list({
        parent,
        top: 4,
        padding: {
            left: 2,
        },
        left: '70%',
        height: '100%-4',
        align: 'left',
        width: '30%',
        tags: true,
        focusable: false,
        interactive: false,
        border: {
            type: 'line',
        },
        style: {
            fg: 'white',
            border: {
                fg: '#f0f0f0',
            },
        },
    });
    const previewBox = blessed.box({
        parent,
        top: 4,
        left: '40%',
        padding: {
            left: 2,
        },
        height: '100%-4',
        align: 'left',
        width: '30%',
        focusable: false,
        tags: true,
        border: {
            type: 'line',
        },
        style: {
            fg: 'white',
            border: {
                fg: '#f0f0f0',
            },
        },
    });
    const deviceList = blessed.list({
        parent,
        top: 4,
        left: '0',
        padding: {
            left: 2,
        },
        height: '100%-4',
        align: 'left',
        width: '15%',
        keyable: true,
        keys: true,
        shrink: true,
        clickable: true,
        mouse: true,
        tags: true,
        border: {
            type: 'line',
        },
        content: `{center}Devices{/center}`,
        style: {
            fg: 'white',
            border: {
                fg: '#f0f0f0',
            },
        },
    });
    const actionForm = blessed.form({
        parent,
        keys: true,
        top: 4,
        left: '15%',
        height: '100%-4',
        align: 'center',
        width: '25%',
        autoNext: false,
        border: {
            type: 'line',
        },
        style: {
            fg: 'white',
            border: {
                fg: '#f0f0f0',
            },
        },
    });
    const submitButton = blessed.button({
        mouse: true,
        keyable: true,
        clickable: true,
        padding: {
            left: 1,
            right: 1,
        },
        shrink: true,
        left: 1,
        bottom: 2,
        name: 'submit',
        content: 'submit',
        style: {
            bg: 'red',
            focus: {
                bg: 'blue',
            },
            hover: {
                bg: 'blue',
            },
        },
    });
    const scanButton = blessed.button({
        mouse: true,
        keyable: true,
        clickable: true,
        padding: {
            left: 1,
            right: 1,
        },
        left: 1,
        bottom: 2,
        name: 'scan',
        content: 'scan',
        shrink: true,
        style: {
            bg: 'red',
            focus: {
                bg: 'blue',
            },
            hover: {
                bg: 'blue',
            },
        },
    });
    deviceList.append(scanButton);
    deviceList.append(blessed.text({
        content: '{center}{bold}Devices:{/bold}{/center}',
        tags: true,
        top: -2,
        width: '25%',
        align: 'center',
        left: 'center',
        right: 'center',
    }));
    configList.append(blessed.text({
        content: '{center}{bold}Configuration:{/bold}{/center}',
        tags: true,
        top: -2,
        width: '25%',
        align: 'center',
        left: 'center',
        right: 'center',
    }));
    previewBox.append(blessed.text({
        content: '{center}{bold}Preview:{/bold}{/center}',
        tags: true,
        top: -2,
        width: '25%',
        align: 'center',
        left: 'center',
        right: 'center',
    }));
    return {
        titleBar,
        errorBox,
        configList,
        deviceList,
        previewBox,
        actionForm,
        submitButton,
        scanButton,
    };
};
exports.getBaseUI = getBaseUI;
const getConfigListNode = (key, value) => {
    if (key !== 'sensors' && key !== 'mqtt' && key !== 'inputs') {
        return `${key}: ${typeof value === 'string' ? `'${value}'` : value}`;
    }
    else if (key === 'sensors' || key === 'inputs') {
        return `${key}: ${value.length}`;
    }
};
const updateConfigList = (configList, config) => {
    Object.keys(config).forEach((key) => {
        const value = config[key];
        const node = getConfigListNode(key, value);
        if (!!node)
            configList.addItem(node);
    });
};
exports.updateConfigList = updateConfigList;
