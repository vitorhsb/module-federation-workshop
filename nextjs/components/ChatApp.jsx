import React, { useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

// import { useHistory } from "react-router-dom";

const ChatApp = dynamic(
  async () => {
    const mount = (await import("chat/App")).default;

    return function ChatApp() {
      const ref = useRef();
      // const history = useHistory();
      const router = useRouter();

      useEffect(() => {
        const { onParentNavigate, unmount } = mount(ref.current, {
          onNavigate: (pathname) => {
            // const currentPathname = history.location.pathname;
            // if (currentPathname !== pathname) history.push(pathname);
            if (router.pathname !== pathname)
              router.push(pathname, undefined, {
                shallow: true,
              });
          },
        });

        router.events.on("routeChangeStart", onParentNavigate);
        //const unlisten = history.listen((e) => onParentNavigate(e.pathname));

        return () => {
          unmount();
          // TODO, does onParentNavigate keep the identity between renders?
          router.events.off("routeChangeStart", onParentNavigate);
        };
      }, [ref.current]);

      return <div ref={ref} />;
    };
  },
  {
    ssr: false,
    loading: () => "...",
  }
);

export default ChatApp;
