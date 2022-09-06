# vite-plugin-bullet-msg
vite-plugin-bullet-msg


## get the target str from your code to dispaly in screen like bullet-chat

- get the target str and then send event by ws, client will create dom with the msg

```javascript
bulletMsgPlugin({
  wsProtocol: 'vite-hmr', // ws protocol
  wsPath: 'xxx', // link
  targetKey: 'TODO',
  rootPath: __dirname,
  hoverDuration: 100, // 悬停时长
  duration: 50, // 动画时长 s
})
```

+ or U can handle the target data yourself
```javascript
bulletMsgPlugin({
  wsProtocol: 'vite-hmr', // ws protocol
  wsPath: 'xxx', // link
  targetKey: 'TODO',
  rootPath: __dirname,
  hoverDuration: 100, // 悬停时长
  duration: 50, // 动画时长 s
  dataHandler: (data) => {
    console.log(data)
  }
})
```