export function getFileExtension(filename) {
    return filename.includes('.')
        ? filename.slice(filename.lastIndexOf('.'))
        : ''
}
