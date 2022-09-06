<script>
const wsToDO = new WebSocket('#{wsPath}', '#{wsProtocol}')
const domTemp = document.createElement('div')
function getRandom(range, base = 0) {
  return (Math.random() * range + base).toFixed(2)
}
wsToDO.addEventListener('message', async ({ data }) => {
  data = JSON.parse(data)
  const { event } = data
  if(event === 'close') window.__Vite_Plugin_Info_ = undefined
  if(!['vite:bullet-msg', 'updata'].includes(event)) return
  if(event === 'updata') {
    data = window.__Vite_Plugin_Info_ || []
  }else {
    data = data.data
    window.__Vite_Plugin_Info_ = data || []
  }
  const dataHandler = '#{dataHandler}'
  if(dataHandler) {
    dataHandler(data)
  }else {
    data.forEach(element => {
      const { target, path } = element
      if(!target) return
      const dom = document.createElement('div')
      dom.setAttribute('class', 'info-box')
      dom.setAttribute('style', 'top: ' + getRandom(6) + 'rem' + `;color: rgba(${getRandom(255)}, ${getRandom(255)}, 0, ${getRandom(1)})`)
      dom.innerText = target + ':' + path
      document.body.appendChild(dom)
    });
  }
})
</script>

<style>
  .info-box {
    position: absolute;
    z-index: 999;
    max-width: 200%;
    padding: 0.02rem 0.1rem;
    overflow: hidden;
    font-size: 0.13rem;
    white-space: nowrap;
    color: #fff;
    font-weight: 700;
    animation-duration: '#{duration}'s;
    animation-name: slidein;
    animation-iteration-count: infinite;
    animation-timing-function: cubic-bezier(0.42, 0.0, 0.58, 1.0);
    border-radius: 4px;
  }
  .info-box:hover {
    animation-duration: '#{hoverDuration}'s;
  }
  @keyframes slidein {
    from {
      left: 100%;
    }
    to {
      left: -100%;
    }
  }
</style>