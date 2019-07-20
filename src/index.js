const Carousel = function (targetSelector, options) {
  this.targetSelector = targetSelector
  this.init(options)
}

Carousel.prototype = {
  init (options) {
    this.index = 0
    this.path = options.path || './images/'
    this.items = options.items
    this.mode = options.mode || 'fade'
    this.interval = options.interval || 2500
    this.rendered = false

    this.classPrefix = options.classPrefix || 'ti-carousel-'

    this.setClassConfig()
    if (options.auto) {
      this.render()
    }
  },

  render () {
    if (this.rendered) return false
    this.target = document.querySelector(this.targetSelector)

    this.ul = this.createChildren(document.createElement('ul'))

    this.target.appendChild(this.ul)

    this.setButton()

    this.startPlay()
    this.rendered = true
  },

  setButton () {
    this.setBtn('prev')
    this.setBtn('next')
    this.setPointer()
  },

  setBtn (type) {
    let btn = document.createElement('div')
    btn.className = this.classes[type]
    btn.innerHTML = type
    btn.addEventListener('click', () => {this[type]()})
    this.target.appendChild(btn)
  },

  setPointer () {
    let pointers = document.createElement('div')
    pointers.classList.add(this.classes['pointers'])
    this.items.forEach((item, index) => {
      let pointer = document.createElement('a')
      pointer.href = 'javascript:;'
      pointer.innerHTML = index
      pointer.classList.add(this.classes['pointer'])

      pointer.addEventListener('click', this.pointTo.bind(this))
      pointers.appendChild(pointer)
    })

    this.pointers = pointers
    this.target.appendChild(pointers)
    this.setIndex(0)
  },

  createChildren (ul) {
    let originLi = []
    this.items.map((item, i, array) => {
      let li = document.createElement('li')
      li.classList.add(this.classes['li'] + i)

      if (i === array.length - 1) li.classList.add(this.classes['li'] + '-last')

      let img = document.createElement('img')
      img.setAttribute('src', this.path + item)

      li.appendChild(img)

      ul.appendChild(li)
      originLi.push(li)
    })

    this.originLi = originLi
    return ul
  },

  setClassConfig () {
    let prefix = this.classPrefix
    let types = ['ul', 'li', 'prev', 'next', 'pointers', 'pointer']
    this.classes = types.reduce((classes, type) => {
      classes[type] = this.classPrefix + type
      return classes
    }, {})
  },

  setAnimationClasses (type) {
    let classes = []
    Array.prototype.forEach.call(this.ul.children, (el, index) => {
      classes.push(this.classes['li'] + index)
    })
    if (type === 'prev') {
      let cls = classes.pop()
      classes.unshift(cls)
    }

    if (type === 'next') {
      let cls = classes.shift()
      classes.push(cls)
    }

    if (typeof type === 'number') {
      classes = classes.slice(type).concat(classes.slice(0, type))
      console.log(classes)
    }

    setTimeout(() => {
      Array.prototype.forEach.call(this.ul.children, (el, index, array) => {
        el.classList.remove(classes[index])
        el.classList.add(this.classes['li'] + index)

        el.classList.remove(this.classes['li'] + '-last')
        if (index === array.length - 1) el.classList.add(this.classes['li'] + '-last')
      })
    }, 0)
  },

  startPlay () {
    window.setInterval(() => {
      if (!this.ignoreNext) {
        this.next()
      } else {
        this.ignoreNext = false
      }
    }, this.interval)
  },

  next () {
    this.ignoreNext = true
    this.setAnimationClasses('next')
    this.ul.appendChild(this.ul.children[0])
    this.setIndex(this.index + 1)
  },

  prev () {
    this.ignoreNext = true
    this.setAnimationClasses('prev')
    this.ul.insertBefore(this.ul.children[this.ul.children.length - 1], this.ul.children[0])
    this.setIndex(this.index - 1)
  },

  pointTo (e) {
    this.ignoreNext = true
    let index = Number(e.target.innerHTML)
    let realIndex = (index - this.index + this.ul.children.length) % this.ul.children.length
    this.setAnimationClasses(realIndex)

    let newOrder = Array.prototype.slice.call(this.ul.children, realIndex).concat(Array.prototype.slice.call(this.ul.children, 0, realIndex))
    let fragment = document.createDocumentFragment()
    for (let li of newOrder) {
      fragment.appendChild(li)
    }
    this.ul.appendChild(fragment)
    this.setIndex(index)
  },

  setIndex (index) {
    index = index % this.ul.children.length
    this.pointers.children[this.index].classList.remove('actived')
    this.pointers.children[index].classList.add('actived')
    this.index = index
  }
}
