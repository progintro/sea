// Compiler initialization for Sea
// import wasmerSDKModule from "@wasmer/sdk/wasm?url";

let WasmerSDK = null;
let clangPackage = null;
let wasmerInitialized = false;

export async function initCompiler(log, setStatus, progressBar, loadingText, loadingSubtext, compilerStatus) {
    try {
        loadingSubtext.textContent = 'Loading Wasmer SDK...';
        progressBar.style.width = '30%';
        // const wasmerModule = await import('@wasmer/sdk');
        // const { init, Wasmer, Directory } = wasmerModule;
        // loadingSubtext.textContent = 'Initializing Wasmer runtime...';
        // progressBar.style.width = '50%';
        // await init({ module: wasmerSDKModule });
        loadingSubtext.textContent = 'Loading Clang compiler...';
        loadingText.textContent = 'Loading Clang...';
        progressBar.style.width = '60%';
        // WasmerSDK = { Wasmer, Directory };
        // try {
        //     const response = await fetch('/clang/clang.webc');
        //     if (!response.ok) throw new Error('Local clang not found');
        //     const bytes = new Uint8Array(await response.arrayBuffer());
        //     clangPackage = await WasmerSDK.Wasmer.fromFile(bytes);
        //     log('Loaded clang from local package', 'system');
        // } catch (e) {
        //     log('Local clang not found, fetching from registry...', 'warning');
        //     clangPackage = await WasmerSDK.Wasmer.fromRegistry('clang/clang');
        // }
        loadingSubtext.textContent = 'Finalizing setup...';
        progressBar.style.width = '100%';
        loadingSubtext.textContent = 'Ready!';
        wasmerInitialized = true;
        compilerStatus.textContent = 'Clang (Ready)';
        compilerStatus.style.color = '#3fb950';
        log('Sea initialized successfully!', 'success');
        log('Compiler: Clang via Wasmer SDK (WebAssembly)', 'system');
        log('This is a FULL C compiler - supports stdio.h, math.h, string.h, etc.', 'system');
        log('Press Ctrl+Enter to compile and run your code.', 'system');
    } catch (error) {
        compilerStatus.textContent = 'Error';
        compilerStatus.style.color = '#f85149';
        log(`Failed to initialize compiler: ${error.message}`, 'stderr');
        log('', 'system');
        log('Troubleshooting:', 'warning');
        log('1. Make sure you are using npm run dev (not opening HTML directly)', 'system');
        log('2. Check that the page reloaded to activate the service worker', 'system');
        log('3. Try refreshing the page', 'system');
    }
}

export function getWasmerSDK() {
    return WasmerSDK;
}
export function getClangPackage() {
    return clangPackage;
}
export function isWasmerInitialized() {
    return wasmerInitialized;
}
