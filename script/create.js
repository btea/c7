#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const isWindows = process.platform === 'win32'

function copy(source, target) {
    if (!fs.existsSync(target)) {
        fs.mkdirSync(target, { recursive: true })
    }
    if (fs.lstatSync(source).isDirectory()) {
        let files = fs.readdirSync(source)
        for (let file of files) {
            let newSource = `${source}/${file}`
            if (fs.lstatSync(newSource).isDirectory()) {
                copy(newSource, `${target}/${file}`)
            } else {
                copy(newSource, target)
            }
        }
    } else {
        fs.writeFileSync(`${target}/${path.basename(source)}`, fs.readFileSync(source))
    }
}


function pack(source) {
    let code = ''
    if (fs.lstatSync(source).isDirectory()) {
        let files = fs.readdirSync(source)
        if (isWindows) {
            if (files.includes('_component.js')) {
                files = [...new Set(['_component.js', ...files])]
            }
        }
        for (let file of files) {
            code += pack(`${source}/${file}`)
        }
        return code
    } else {
        return fs.readFileSync(source, 'utf8') + '\n\n'
    }
}


function create() {
    let name = process.argv[2]
    copy(path.join(__dirname, '../template'), name)
    copy(path.join(__dirname, '../src/compiler'), `${name}/compiler`)
    let src = pack(path.join(__dirname, '../src/runtime'))
    fs.writeFileSync(`${name}/public/c7.js`, src)
}


create()
