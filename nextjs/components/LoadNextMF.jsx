import React, { useRef, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useMFShareState } from "./MFProvider";

async function loadModule(scope, module) {
  await __webpack_init_sharing__("default");
  const container = window[scope];
  await container.init(__webpack_share_scopes__.default);
  const factory = await window[scope].get(module);
  return factory();
}

const MountMF = React.memo(
  function MountMF({ mount, router, ...rest }) {
    const ref = useRef();

    useEffect(() => {
      console.log("aaaaaa rerendering");
      const { unmount, onParentNavigate } = mount(ref.current, {
        onNavigate: (pathname, { shallow = true } = {}) => {
          if (router.pathname !== pathname) {
            router.push(pathname, undefined, {
              shallow,
            });
          }
        },
        ...rest,
      });

      router.events.on("routeChangeStart", onParentNavigate);

      return () => {
        unmount();
        router.events.off("routeChangeStart", onParentNavigate);
      };
    }, [ref.current, mount, ...Object.values(rest)]);

    return <div ref={ref} style={{ display: "inline" }} />;
  },
  function areEqual(prevProps, nextProps) {
    return Object.keys(prevProps).reduce(
      (acc, key) =>
        (key === "router" || prevProps[key] === nextProps[key]) && acc,
      true
    );
  }
);

function useDynamicScript({ url }) {
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!url) {
      return;
    }

    const element = document.createElement("script");

    element.src = url;
    element.type = "text/javascript";
    element.async = true;

    setReady(false);
    setFailed(false);

    element.onload = () => setReady(true);

    element.onerror = () => {
      setReady(false);
      setFailed(true);
    };

    document.head.appendChild(element);

    return () => {
      document.head.removeChild(element);
    };
  }, [url]);

  return {
    ready,
    failed,
  };
}

export default React.memo(function LoadNextMF({
  url,
  module,
  scope,
  errorComponent: ErrorComponent = () => "There was an error",
  loadingComponent: LoadingComponent = () => "...",
  ...rest
}) {
  const key = url + module + scope;
  const router = useRouter();
  const { ready: scriptReady, failed: scriptFailed } = useDynamicScript({
    url,
  });
  const [mount, setMount] = useState(() =>
    typeof window !== "undefined" ? window.__MFE_MOUNTS?.[key] : undefined
  );
  const [moduleFailed, setModuleFailed] = useState(false);
  const { shareState } = useMFShareState();

  useEffect(() => {
    if (scriptReady && !mount) {
      loadModule(scope, module)
        .then(({ default: mountFn }) => {
          window.__MFE_MOUNTS = window.__MFE_MOUNTS || {};
          window.__MFE_MOUNTS[key] = mountFn;
          setMount(() => mountFn);
        })
        .catch(() => setModuleFailed(true));
    }
  }, [scriptReady, key, module, scope]);

  const children = mount ? (
    <MountMF {...rest} mount={mount} router={router} shareState={shareState} />
  ) : scriptFailed || moduleFailed ? (
    <ErrorComponent />
  ) : (
    <LoadingComponent />
  );

  return (
    <>
      <Head>
        <link rel="preload" as="script" href={url} />
      </Head>
      {children}
    </>
  );
});
