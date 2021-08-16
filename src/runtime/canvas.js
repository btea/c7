class Canvas {
    constructor() {
        this.canvas = document.querySelector('canvas')
        this.context = this.canvas.getContext('2d')
        this.ime = null
        this.responsive()
        this.setDefaultCursor()
    }

    launch(component, reLayout) {
        this.component = component
        this.reLayout = reLayout
        // 读取图片尺寸, 重新排版
        for (let child of component.children) {
            if (child.constructor.name === 'ImageComponent') {
                child.setBox()
                reLayout()
            }
        }
        setInterval(() => {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.draw(component)
            this.ime?.draw()
        }, 1000/60)
    }

    draw(component) {
        if (component instanceof InputComponent) {
            this.ime = component.ime
        }
        component.draw()
        for (let child of component.children) {
            this.draw(child)
        }
    }

    responsive() {
        let timer = null
        let resize = () => {
            let dpr = window.devicePixelRatio
            this.canvas.width = window.innerWidth * dpr
            this.canvas.height = window.innerHeight * dpr
            this.canvas.style.width = `${window.innerWidth}px`
            this.canvas.style.height = `${window.innerHeight}px`
            this.context.scale(dpr, dpr)
        }
        resize()
        window.addEventListener('resize', () => {
            clearTimeout(timer)
            timer = setTimeout(() => {
                resize()
                this.component.style['width'].value = window.innerWidth
                this.component.style['height'].value = window.innerHeight
                this.reLayout()    
            }, 100)
        })
    }

    setDefaultCursor() {
        window.addEventListener('mousemove', () => {
            document.body.style.cursor = 'auto'
        })
    }
}
