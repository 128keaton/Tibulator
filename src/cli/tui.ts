import * as blessed from 'neo-blessed';
import { Config } from '../lib/parse/config';

export const getBaseUI = (parent: blessed.Widgets.Screen) => {
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

  deviceList.append(
    blessed.text({
      content: '{center}{bold}Devices:{/bold}{/center}',
      tags: true,
      top: -2,
      width: '25%',
      align: 'center',
      left: 'center',
      right: 'center',
    }),
  );

  configList.append(
    blessed.text({
      content: '{center}{bold}Configuration:{/bold}{/center}',
      tags: true,
      top: -2,
      width: '25%',
      align: 'center',
      left: 'center',
      right: 'center',
    }),
  );

  previewBox.append(
    blessed.text({
      content: '{center}{bold}Preview:{/bold}{/center}',
      tags: true,
      top: -2,
      width: '25%',
      align: 'center',
      left: 'center',
      right: 'center',
    }),
  );

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

const getConfigListNode = (
  key: string,
  value: { [key: string]: any } | any[] | string | number,
): string | undefined => {
  if (key !== 'sensors' && key !== 'mqtt' && key !== 'inputs') {
    return `${key}: ${typeof value === 'string' ? `'${value}'` : value}`;
  } else if (key === 'sensors' || key === 'inputs') {
    return `${key}: ${(value as any[]).length}`;
  }
};

export const updateConfigList = (
  configList: blessed.Widgets.ListElement,
  config: Config,
) => {
  Object.keys(config).forEach((key) => {
    const value = (config as any)[key];
    const node = getConfigListNode(key, value);

    if (!!node) configList.addItem(node);
  });
};
