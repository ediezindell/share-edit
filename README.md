# (WIP) type anything via Vim

## プラグイン追加

```lua
---@type LazySpec
local spec = {
  dir = "/path/to/share-edit/",
  dependencies = {
    "vim-denops/denops.vim",
  },
  event = "BufEnter",
}

return spec
```

## サーバー起動

```sh
deno run --allow-net server.ts
```

## Vim から Websocker に接続

```sh
:ConnectSocket
```

## ブラウザから WebSocket に接続

`./chrome-extension/` を拡張機能に追加する
