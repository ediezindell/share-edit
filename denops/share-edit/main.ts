import type { Entrypoint } from "jsr:@denops/std";
import * as fn from "jsr:@denops/std/function";
import * as autocmd from "jsr:@denops/std/autocmd";

import { assert, is } from "jsr:@core/unknownutil";

let socket: WebSocket | null = null;

export const main: Entrypoint = (denops) => {
  denops.dispatcher = {
    connect(url: unknown) {
      assert(url, is.String);
      socket = new WebSocket(url);

      socket.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "focus") {
          const bufnr = await fn.bufnr(denops);
          fn.deletebufline(denops, bufnr, 1, "$");
          fn.setbufline(denops, bufnr, 1, data.content.trim().split("\n"));
        }
      };
    },

    async send() {
      if (!socket) return;
      const bufnr = await fn.bufnr(denops);
      const buflines = await fn.getbufline(denops, bufnr, 1, "$");
      assert(buflines, is.ArrayOf(is.String));

      socket.send(
        JSON.stringify({ type: "update", content: buflines.join("\n").trim() }),
      );
    },
  };

  autocmd.group(denops, "share-edit", (helper) => {
    helper.define(
      "BufWritePost",
      "*",
      `call denops#request('${denops.name}', 'send', [])`,
    );
  });

  denops.cmd(
    `command! ConnectSocket call denops#request('${denops.name}', 'connect', ["ws://localhost:8789"])`,
  );
};
