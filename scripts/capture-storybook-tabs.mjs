import { mkdir, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';

const storybookUrl = process.argv[2] ?? 'http://127.0.0.1:6007/iframe.html?id=wireframes-azure-terraform-rp-tabbed-form--onboarding-form&viewMode=story';
const outDir = path.resolve(process.argv[3] ?? 'output/02.Images/storybook-tabs');
const width = Number(process.argv[4] ?? 1600);
const height = Number(process.argv[5] ?? 1100);
const remotePort = 9333;
const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

await mkdir(outDir, { recursive: true });

const chrome = spawn(chromePath, [
  '--headless=new',
  `--remote-debugging-port=${remotePort}`,
  '--disable-gpu',
  '--no-first-run',
  '--no-default-browser-check',
  '--hide-scrollbars',
  `--window-size=${width},${height}`,
  `--user-data-dir=/tmp/taarp-storybook-capture-${Date.now()}`,
  'about:blank',
], { stdio: 'ignore' });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchJson(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText} from ${url}`);
  }
  return response.json();
}

async function waitForChrome() {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      return await fetchJson(`http://127.0.0.1:${remotePort}/json/version`);
    } catch {
      await sleep(100);
    }
  }
  throw new Error('Chrome did not open a debugging endpoint.');
}

function connect(wsUrl) {
  const socket = new WebSocket(wsUrl);
  let counter = 0;
  const pending = new Map();

  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) {
        reject(new Error(message.error.message));
      } else {
        resolve(message.result ?? {});
      }
    }
  });

  return new Promise((resolve, reject) => {
    socket.addEventListener('open', () => {
      resolve({
        send(method, params = {}) {
          counter += 1;
          const id = counter;
          socket.send(JSON.stringify({ id, method, params }));
          return new Promise((requestResolve, requestReject) => {
            pending.set(id, { resolve: requestResolve, reject: requestReject });
          });
        },
        close() {
          socket.close();
        },
      });
    }, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });
}

function slug(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

async function main() {
  await waitForChrome();
  const target = await fetchJson(`http://127.0.0.1:${remotePort}/json/new?${encodeURIComponent('about:blank')}`, { method: 'PUT' });
  const cdp = await connect(target.webSocketDebuggerUrl);

  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await cdp.send('Page.navigate', { url: storybookUrl });

  let hasNavigation = false;
  for (let attempt = 0; attempt < 120; attempt += 1) {
    const ready = await cdp.send('Runtime.evaluate', {
      expression: "document.readyState === 'complete' && (document.querySelectorAll('[role=tab]').length > 0 || document.querySelectorAll('.azure-terraform-stepper-nav button').length > 0)",
      returnByValue: true,
    });
    if (ready.result?.value === true) {
      hasNavigation = true;
      break;
    }
    await sleep(250);
  }

  if (!hasNavigation) {
    const diagnostics = await cdp.send('Runtime.evaluate', {
      expression: `JSON.stringify({
        readyState: document.readyState,
        title: document.title,
        bodyText: document.body?.innerText?.slice(0, 2000),
        html: document.querySelector('#storybook-root')?.innerHTML?.slice(0, 2000),
        tabCount: document.querySelectorAll('[role=tab]').length,
        stepperCount: document.querySelectorAll('.azure-terraform-stepper-nav button').length,
      })`,
      returnByValue: true,
    });
    throw new Error(`Story did not render navigable steps: ${diagnostics.result?.value}`);
  }

  const navResult = await cdp.send('Runtime.evaluate', {
    expression: `JSON.stringify((() => {
      const tabs = Array.from(document.querySelectorAll('[role=tab]'));
      if (tabs.length > 0) {
        return { mode: 'tabs', items: tabs.map((button, index) => {
          const spans = Array.from(button.querySelectorAll('span')).map((span) => (span.textContent || '').trim()).filter(Boolean);
          return { index, code: spans[0] ?? String(index + 1), title: spans[1] ?? spans[0] ?? String(index + 1) };
        }) };
      }

      const fallbackCodes = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'B1'];
      const steps = Array.from(document.querySelectorAll('.azure-terraform-stepper-nav button'));
      return { mode: 'stepper', items: steps.map((button, index) => {
        const title = button.querySelector('span[style*="font-weight"]')?.textContent?.trim()
          || Array.from(button.querySelectorAll('span')).map((span) => (span.textContent || '').trim()).filter(Boolean)[1]
          || String(index + 1);
        return { index, code: fallbackCodes[index] ?? String(index + 1), title };
      }) };
    })())`,
    returnByValue: true,
  });

  if (navResult.exceptionDetails) {
    throw new Error(`Could not read navigation: ${JSON.stringify(navResult.exceptionDetails)}`);
  }

  const navigation = JSON.parse(navResult.result.value);
  const tabs = navigation.items;
  const captures = [];

  for (const tab of tabs) {
    const capture = { ...tab };

    if (navigation.mode === 'tabs') {
      await cdp.send('Runtime.evaluate', {
        expression: `document.querySelectorAll('[role=tab]')[${capture.index}].click()`
      });
      await sleep(500);

      const selected = await cdp.send('Runtime.evaluate', {
        expression: `document.querySelectorAll('[role=tab]')[${capture.index}].getAttribute('aria-selected')`,
        returnByValue: true,
      });
      if (selected.result.value !== 'true') {
        throw new Error(`Tab ${capture.code} did not become selected.`);
      }
    } else {
      const current = await cdp.send('Runtime.evaluate', {
        expression: `Array.from(document.querySelectorAll('.azure-terraform-stepper-nav button')).findIndex((button) => button.getAttribute('aria-current') === 'step')`,
        returnByValue: true,
      });
      if (current.result.value !== capture.index) {
        throw new Error(`Expected step ${capture.index} but current step is ${current.result.value}.`);
      }

      const activeTitle = await cdp.send('Runtime.evaluate', {
        expression: `document.querySelector('#azure-terraform-step-panel h2')?.textContent?.trim() || ''`,
        returnByValue: true,
      });
      if (activeTitle.result.value) {
        capture.title = activeTitle.result.value;
      }
    }

    const fileName = `${String(capture.index + 1).padStart(2, '0')}-${slug(`${capture.code}-${capture.title}`)}.png`;
    const filePath = path.join(outDir, fileName);
    const screenshot = await cdp.send('Page.captureScreenshot', {
      format: 'png',
      fromSurface: true,
      captureBeyondViewport: false,
    });
    await writeFile(filePath, Buffer.from(screenshot.data, 'base64'));
    captures.push({ ...capture, fileName, filePath, width, height });

    if (navigation.mode === 'stepper' && capture.index < tabs.length - 1) {
      await cdp.send('Runtime.evaluate', {
        expression: `Array.from(document.querySelectorAll('form button')).at(-1)?.click()`,
      });
      for (let attempt = 0; attempt < 60; attempt += 1) {
        const advanced = await cdp.send('Runtime.evaluate', {
          expression: `Array.from(document.querySelectorAll('.azure-terraform-stepper-nav button')).findIndex((button) => button.getAttribute('aria-current') === 'step') === ${capture.index + 1}`,
          returnByValue: true,
        });
        if (advanced.result.value === true) break;
        await sleep(100);
      }
      await sleep(300);
    }
  }

  const manifest = {
    storybookUrl,
    navigationMode: navigation.mode,
    capturedAt: new Date().toISOString(),
    width,
    height,
    captures,
  };
  await writeFile(path.join(outDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(JSON.stringify(manifest, null, 2));
  cdp.close();
}

try {
  await main();
} finally {
  chrome.kill('SIGTERM');
}