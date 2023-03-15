let exc
let dragEl
let usd = 0
let btn_add = document.getElementById('btn_add')
let btn_style = document.getElementById('btn_style')
let spase = document.getElementById('space')
let balance = document.getElementById('balance')
let spend_usd = document.getElementById('spend_usd')
let spend_rub = document.getElementById('spend_rub')
let curr = document.getElementById('curr_profit')
let elements = document.querySelectorAll('.el')
let modal = document.getElementById('modal')
let loader = document.getElementById('loader')
let span = document.getElementsByClassName('close')[0]
let ico = document.getElementById('ico')

const request = new XMLHttpRequest();
request.open('GET', 'https://proxy.cors.sh/https://currate.ru/api/?get=rates&pairs=USDRUB&key=46c6122719c4bd578e077c31d27e8213', true);
request.send();
request.onreadystatechange = function () {
    if (request.readyState === 4) {
        const response = JSON.parse(request.responseText);
        exc = Math.round(Object.values((Object.values(response)[2]))[0])
        get_balances()
        balance.addEventListener('input', updateBar)
        curr.addEventListener('change', updateBar)
        loader.style.display = 'none'
    }
}

const get_balances = function() {
    const prices = Array.from(document.getElementsByClassName('price'))
    const curr_el = document.getElementsByClassName('curr_el')
    let temp_usd = 0
    
    for (let i = 0; i < prices.length; i++) {
        if (curr_el[i].innerHTML == '$') {
            temp_usd += Number(prices[i].innerHTML)
            console.log(temp_usd) 
        } else {
            temp_usd += Number(prices[i].innerHTML) / exc
            console.log(temp_usd.toFixed(2) * exc) 
        }
    }
    usd = temp_usd
    spend_usd.innerHTML = temp_usd.toFixed(1) + '$'
    spend_rub.innerHTML = temp_usd * exc + '₽'
    updateBar()
}

const openModal = function() {
    modal.style.display = 'block'
}

const closeModal = function(event) {
    if (!event.target.classList.contains('content')) {
        modal.style.display = 'none'
    }
}

const addEl = function() {
    const space = document.querySelector('.space')
    const audio = document.getElementsByTagName('audio')
    let title = document.getElementById('title')
    let price = document.getElementById('price')
    let curr = document.getElementById('curr')
    let el = document.createElement('div');
    let label_title = document.createElement('label')
    let label_price = document.createElement('label')
    let label_curr = document.createElement('label')
    let btn_edit = document.createElement('input')
    let btn_del = document.createElement('input')

    el.className = 'el'
    el.draggable = 'true'
    
    label_title.innerHTML = title.value
    label_price.innerHTML = price.value
    label_price.className = 'price'
    label_curr.innerHTML = curr.value
    label_curr.className = 'curr_el'

    btn_edit.type = 'button'
    btn_edit.className = 'btn edit'
    btn_del.type = 'button'
    btn_del.className = 'btn del'
    
    el.appendChild(label_title)
    el.appendChild(label_price)
    el.appendChild(label_curr)
    el.appendChild(btn_edit)
    el.appendChild(btn_del)

    addEvents(el)

    space.append(el)
    audio[0].play()
    get_balances()
}
const delEl = function() {
    this.parentElement.remove() 
    get_balances()
}
const dragStart = function() {
    setTimeout(() => {
        dragEl = this
        this.style.visibility = 'hidden';
    }, 0);
}
const dragOver = function (evt) {
    evt.preventDefault()
}
const dragDrop = function() {
    let p = Array.from(this.getElementsByTagName('label'))
    let title = p[0].innerHTML
    let titleTemp = title
    let price = p[1].innerHTML
    let priceTemp = price
    let curr = p[2].innerHTML
    let currTemp = curr
    
    p[0].innerHTML = dragEl.getElementsByTagName('label')[0].innerHTML
    p[1].innerHTML = dragEl.getElementsByTagName('label')[1].innerHTML
    p[2].innerHTML = dragEl.getElementsByTagName('label')[2].innerHTML
    dragEl.getElementsByTagName('label')[0].innerHTML = titleTemp
    dragEl.getElementsByTagName('label')[1].innerHTML = priceTemp
    dragEl.getElementsByTagName('label')[2].innerHTML = currTemp
}
const dragEnd = function() {
    this.style.visibility = 'visible';
}

const mousehover = function(event) {
    if (event.target.classList.contains('el')){
        event.target.style.transform = 'scale(1.02)'
    }
    if (event.target.parentElement.classList.contains('el')){
        event.target.parentElement.style.transform = 'scale(1.02)'
    }

}
const mouseout = function(event) {
    if (event.target.classList.contains('el')){
        event.target.style.transform = 'scale(1)'
    }
    if (event.target.parentElement.classList.contains('el')){
        event.target.parentElement.style.transform = 'scale(1)'
    }

}

const editEl = function() {
    let labels = this.parentElement.getElementsByTagName('label')
    this.classList.toggle('apply')
    if (this.classList.contains('apply')){
        for (let el of labels) {
            if (el.classList.contains('curr_el')) {
                continue
            }
            el.classList.toggle('edit_label')
            el.setAttribute('contenteditable', true) 
            el.innerHTML += ' '
        }
    } else {
        for (let el of labels) {
            if (el.classList.contains('curr_el')) {
                continue
            }
            el.classList.toggle('edit_label')
            el.removeAttribute('contenteditable') 
            el.innerHTML += ' '
        }
    }
    get_balances()
}

const addEvents = function(el) {
    el.addEventListener('dragstart', dragStart)
    el.addEventListener('dragover', dragOver)
    el.addEventListener('drop', dragDrop)
    el.addEventListener('dragend', dragEnd)
    el.children[3].addEventListener('click', editEl)
    el.children[4].addEventListener('click', delEl)
}

const updateBar = function () {
    const bar = document.getElementById('bar')
    if (curr.value == '$') {
        if (usd > balance.value) {
            bar.classList.toggle('red')
        } else {
            bar.classList.toggle('red')
        }
        bar.value = usd
        bar.max = balance.value
    } else {
        if (usd > balance.value) {
            bar.classList.toggle('red')
        } else {
            bar.classList.toggle('red')
        }
        bar.value = usd * exc
        bar.max = balance.value
    }
   if (bar.value < bar.max * 33 / 100) {
        ico.src = 'good.png'
   } else if (bar.value < bar.max * 66 / 100) {
        ico.src = 'normal.png'
   } else {
        ico.src = 'bad.png'
   }

}

document.querySelector('.themes').addEventListener('click',  (event) => {
    if (event.target.nodeName === 'INPUT') {
        document.documentElement.classList.remove('dark', 'light', 'neon')
        document.documentElement.classList.add(event.target.value)
    }
})

document.addEventListener('DOMContentLoaded', function () {
    btn_add.addEventListener('click', addEl)
    btn_style.addEventListener('click', openModal)
    span.addEventListener('click', closeModal)
    modal.addEventListener('click', closeModal)
    spase.addEventListener('mouseover', mousehover)
    spase.addEventListener('mouseout', mouseout)
})