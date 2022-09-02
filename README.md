# vite-plugin-bullet-msg
vite-plugin-bullet-msg


## get the target str from your code to dispaly in screen like bullet-chat

- get the target str and then send event by ws, client will create dom with the msg

```javascript
bulletMsgPlugin({
  wsProtocol: 'vite-hmr', // ws protocol
  wsPath: 'xxx', // link
  targetKey: 'TODO',
  rootPath: __dirname
})
```
