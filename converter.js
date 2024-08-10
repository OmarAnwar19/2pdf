const fs = require('fs')
const path = require('path')
const { Converter, PdfConvertOptions } = require('@groupdocs/groupdocs.conversion')
const zipper = require('zip-local')


// usage: node converter.js <file extension> <directory> <zip>
// example: node converter.js .docx ./files true

const args = {
    from: process.argv[2],
    dir: process.argv[3] ?? './',
    zip: process.argv[4] ?? 'true'
}

const convertFile = async (filePath) => {
    const converter = new Converter(filePath)
    const options = new PdfConvertOptions()
    await converter.convert(filePath + '.pdf', options)
}

const openFiles = async (dir) => {
    const files = await fs.promises.readdir(dir)
    for (const f of files) {
        const fullPath = path.join(dir, f)
        const stat = await fs.promises.stat(fullPath)
        if (stat.isDirectory()) {
            await openFiles(fullPath)
        } else if (f.endsWith(args.from)) {
            await convertFile(fullPath)
        }
    }
    if (args.zip === 'true') {
        await zipper.sync.zip(dir).compress().save(dir + '.zip')
    }
}

openFiles(args.dir)