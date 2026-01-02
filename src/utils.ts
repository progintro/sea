/**
 * Calculate the number of columns that fit in a container based on its width
 * and the actual character width of the font being used.
 * 
 * @param container - The HTML element to measure
 * @param fontFamily - Optional font family override (defaults to container's computed style)
 * @param fontSize - Optional font size override (defaults to container's computed style)
 * @returns The number of columns that fit in the container
 */
export function calculateColumns(
    container: HTMLElement,
    fontFamily?: string,
    fontSize?: string
): number {
    const computedStyle = window.getComputedStyle(container);
    const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0;
    const paddingRight = parseFloat(computedStyle.paddingRight) || 0;
    const availableWidth = container.clientWidth - paddingLeft - paddingRight;
    
    // Measure actual character width by creating a temporary element
    const measureEl = document.createElement('span');
    measureEl.style.position = 'absolute';
    measureEl.style.visibility = 'hidden';
    measureEl.style.whiteSpace = 'pre';
    measureEl.style.fontFamily = fontFamily || computedStyle.fontFamily;
    measureEl.style.fontSize = fontSize || computedStyle.fontSize;
    measureEl.style.fontWeight = computedStyle.fontWeight;
    measureEl.textContent = 'M'; // 'M' is typically the widest character
    document.body.appendChild(measureEl);
    
    const charWidth = measureEl.offsetWidth;
    document.body.removeChild(measureEl);
    
    // Calculate columns, ensuring at least 1 column
    const cols = Math.floor(availableWidth / charWidth);
    return Math.max(1, cols);
}

