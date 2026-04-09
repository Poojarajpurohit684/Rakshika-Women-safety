import '@testing-library/jest-dom'

// jsdom doesn't implement scrollIntoView
window.HTMLElement.prototype.scrollIntoView = () => {}

// jsdom doesn't implement SpeechSynthesis
window.speechSynthesis = { speak: () => {} }
