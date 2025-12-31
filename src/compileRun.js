// Compile and run logic for Sea
import { getWasmerSDK, getClangPackage, isWasmerInitialized } from './compiler.js';
import { getEditor } from './editor.js';

export async function runCode(log, setStatus, runBtn, stdinInput) {
    if (!isWasmerInitialized()) {
        log('Compiler not ready yet. Please wait...', 'warning');
        return;
    }
    runBtn.disabled = true;
    setStatus('running');
    const editor = getEditor();
    const code = editor.getValue();
    log('─'.repeat(50), 'system');
    log('Compiling...', 'info');
    try {
        const { Wasmer, Directory } = getWasmerSDK();
        const clangPackage = getClangPackage();
        const project = new Directory();
        await project.writeFile("/main.c", code);
        const stdin = stdinInput.value || '';
        const compileStart = performance.now();
        log('Invoking compiler (this may take a few seconds)...', 'info');
        let compileInstance = await clangPackage.entrypoint.run({
            args: ["/project/main.c", "-o", "/project/main.wasm"],
            mount: { "/project": project },
        });
        const compileOutput = await compileInstance.wait();
        const compileTime = (performance.now() - compileStart).toFixed(0);
        if (!compileOutput.ok) {
            log(`Compilation failed (exit code: ${compileOutput.code})`, 'stderr');
            if (compileOutput.stderr) {
                log(compileOutput.stderr, 'stderr');
            }
            setStatus('error');
            runBtn.disabled = false;
            return;
        }
        if (compileOutput.stderr) {
            log('Compiler warnings:', 'warning');
            log(compileOutput.stderr, 'warning');
        }
        log(`Compiled successfully in ${compileTime}ms`, 'success');
        log('Running program...', 'info');
        log('─'.repeat(50), 'system');
        const wasmBytes = await project.readFile("main.wasm");
        const program = await Wasmer.fromFile(wasmBytes);
        const runStart = performance.now();
        const runInstance = await program.entrypoint.run({ stdin });
        const result = await runInstance.wait();
        const runTime = (performance.now() - runStart).toFixed(0);
        if (result.stdout) log(result.stdout, 'stdout');
        if (result.stderr) log(result.stderr, 'stderr');
        log('─'.repeat(50), 'system');
        if (result.ok) {
            log(`Program exited with code ${result.code} (${runTime}ms)`, 'success');
            setStatus('ready');
        } else {
            log(`Program exited with code ${result.code}`, 'warning');
            setStatus('error');
        }
    } catch (error) {
        log(`Error: ${error.message}`, 'stderr');
        setStatus('error');
    } finally {
        runBtn.disabled = false;
    }
}
