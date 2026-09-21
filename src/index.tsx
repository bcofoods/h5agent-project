import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { AuiRuntimeProvider } from "@auipage/react";

import ChatContent from "./ChatContent";
import ThreadList from "./ThreadList";
import adapter from "./adapter";
import tools from "./tools";

function App() {

  return (
    <>

      {/* 将运行时注入到整个应用 */}
      <AuiRuntimeProvider adapter={adapter} tools={tools}>

        {/* 
          聊天视图
        */}
        <ChatContent />

        {/* 
          会话列表
        */}
        <ThreadList />

      </AuiRuntimeProvider>
    </>
  );
}

createRoot(document.getElementById("app") as HTMLElement).render(<App />);