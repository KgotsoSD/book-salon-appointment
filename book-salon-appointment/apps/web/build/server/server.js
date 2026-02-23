var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { createRequestHandler } from "@netlify/vite-plugin-react-router";
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, useLocation, Link, UNSAFE_withComponentProps, Outlet, useNavigate, Meta, Links, ScrollRestoration, Scripts, useRouteError, useAsyncError, useSearchParams } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { useButton } from "@react-aria/button";
import { createContext, useState, useCallback, useEffect, useContext, Component, useRef, useMemo } from "react";
import { toPng } from "html-to-image";
import { serializeError } from "serialize-error";
import { Toaster, toast } from "sonner";
import { useIdleTimer } from "react-idle-timer";
import fg from "fast-glob";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  if (request.method.toUpperCase() === "HEAD") {
    return new Response(null, {
      status: responseStatusCode,
      headers: responseHeaders
    });
  }
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    let timeoutId = setTimeout(
      () => abort(),
      streamTimeout + 1e3
    );
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough({
            final(callback) {
              clearTimeout(timeoutId);
              timeoutId = void 0;
              callback();
            }
          });
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          pipe(body);
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
function LoadFonts() {
  return null;
}
const originalFetch = fetch;
const isBackend = () => typeof window === "undefined";
const safeStringify = (value) => JSON.stringify(value, (_k, v) => {
  if (v instanceof Date) return { __t: "Date", v: v.toISOString() };
  if (v instanceof Error)
    return { __t: "Error", v: { name: v.name, message: v.message, stack: v.stack } };
  return v;
});
const postToParent = (level, text, extra) => {
  try {
    if (isBackend() || !window.parent || window.parent === window) {
      ("level" in console ? console[level] : console.log)(text, extra);
      return;
    }
    window.parent.postMessage(
      {
        type: "sandbox:web:console-write",
        __viteConsole: true,
        level,
        text,
        args: [safeStringify(extra)]
      },
      "*"
    );
  } catch {
  }
};
const getUrlFromArgs = (...args) => {
  const [input] = args;
  if (typeof input === "string") return input;
  if (input instanceof Request) return input.url;
  return `${input.protocol}//${input.host}${input.pathname}`;
};
const isFirstPartyURL = (url) => {
  return url.startsWith("/integrations") || url.startsWith("/_create");
};
const isSecondPartyUrl = (url) => {
  return process.env.NEXT_PUBLIC_CREATE_API_BASE_URL && url.startsWith(process.env.NEXT_PUBLIC_CREATE_API_BASE_URL) || process.env.NEXT_PUBLIC_CREATE_BASE_URL && url.startsWith(process.env.NEXT_PUBLIC_CREATE_BASE_URL) || url.startsWith("https://www.create.xyz") || url.startsWith("https://api.create.xyz/") || url.startsWith("https://www.createanything.com") || url.startsWith("https://api.createanything.com");
};
const fetchWithHeaders = async (input, init) => {
  const url = getUrlFromArgs(input, init);
  const additionalHeaders = {
    "x-createxyz-project-group-id": process.env.NEXT_PUBLIC_PROJECT_GROUP_ID
  };
  const isExternalFetch = !isFirstPartyURL(url) && !isSecondPartyUrl(url);
  if (isExternalFetch || url.startsWith("/api")) {
    return originalFetch(input, init);
  }
  let finalInit;
  if (input instanceof Request) {
    const hasBody = !!input.body;
    finalInit = {
      method: input.method,
      headers: new Headers(input.headers),
      body: input.body,
      mode: input.mode,
      credentials: input.credentials,
      cache: input.cache,
      redirect: input.redirect,
      referrer: input.referrer,
      referrerPolicy: input.referrerPolicy,
      integrity: input.integrity,
      keepalive: input.keepalive,
      signal: input.signal,
      ...hasBody ? { duplex: "half" } : {},
      ...init
    };
  } else {
    finalInit = { ...init, headers: new Headers((init == null ? void 0 : init.headers) ?? {}) };
  }
  const finalHeaders = new Headers(finalInit.headers);
  for (const [key, value] of Object.entries(additionalHeaders)) {
    if (value) finalHeaders.set(key, value);
  }
  finalInit.headers = finalHeaders;
  const prefix = !isSecondPartyUrl(url) ? isBackend() ? process.env.NEXT_PUBLIC_CREATE_BASE_URL ?? "https://www.create.xyz" : "" : "";
  try {
    const result = await originalFetch(`${prefix}${url}`, finalInit);
    if (!result.ok) {
      postToParent(
        "error",
        `Failed to load resource: the server responded with a status of ${result.status} (${result.statusText ?? ""})`,
        {
          url,
          status: result.status,
          statusText: result.statusText
        }
      );
    }
    return result;
  } catch (error) {
    postToParent("error", "Fetch error", {
      url,
      error: error instanceof Error ? { name: error.name, message: error.message, stack: error.stack } : error
    });
    throw error;
  }
};
const SessionContext = createContext(null);
function SessionProvider({ children }) {
  const [session, setSession] = useState(null);
  const [status, setStatus] = useState("loading");
  const getSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/session", { credentials: "include" });
      const data = await res.json();
      setSession((data == null ? void 0 : data.user) ? { user: data.user, expires: data.expires } : null);
      setStatus((data == null ? void 0 : data.user) ? "authenticated" : "unauthenticated");
    } catch {
      setSession(null);
      setStatus("unauthenticated");
    }
  }, []);
  useEffect(() => {
    getSession();
  }, [getSession]);
  const value = {
    data: session,
    status,
    refetch: getSession
  };
  return /* @__PURE__ */ jsx(SessionContext.Provider, { value, children });
}
function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    return { data: null, status: "loading" };
  }
  return { data: ctx.data, status: ctx.status };
}
function useDevServerHeartbeat() {
  useIdleTimer({
    throttle: 6e4 * 3,
    timeout: 6e4,
    onAction: () => {
      fetch("/", {
        method: "GET"
      }).catch((error) => {
      });
    }
  });
}
const AUTH_BASE = "/api/auth";
async function getCsrfToken() {
  const res = await fetch(`${AUTH_BASE}/csrf`, { credentials: "include" });
  const data = await res.json();
  return (data == null ? void 0 : data.csrfToken) ?? "";
}
async function signIn(providerId, options = {}) {
  const callbackUrl = options.callbackUrl ?? typeof window !== "undefined" ? window.location.origin : "/";
  const isCredentials = providerId === "credentials-signin" || providerId === "credentials-signup";
  if (isCredentials && options.email != null && options.password != null) {
    const csrfToken = await getCsrfToken();
    const res = await fetch(`${AUTH_BASE}/callback/${providerId}`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      credentials: "include",
      body: new URLSearchParams({
        csrfToken,
        email: options.email,
        password: options.password,
        callbackUrl,
        json: "true"
      })
    });
    const data = await res.json();
    if (data == null ? void 0 : data.url) window.location.href = data.url;
    return data;
  }
  const url = new URL(`${AUTH_BASE}/signin/${providerId}`, window.location.origin);
  url.searchParams.set("callbackUrl", callbackUrl);
  window.location.href = url.toString();
  return { url: url.toString() };
}
function signOut(options = {}) {
  const callbackUrl = options.callbackUrl ?? typeof window !== "undefined" ? window.location.origin : "/";
  const url = new URL(`${AUTH_BASE}/signout`, window.location.origin);
  url.searchParams.set("callbackUrl", callbackUrl);
  window.location.href = url.toString();
}
function useAuth() {
  const callbackUrl = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("callbackUrl") : null;
  const signInWithCredentials = useCallback(
    (options) => {
      return signIn("credentials-signin", {
        ...options,
        callbackUrl: callbackUrl ?? (options == null ? void 0 : options.callbackUrl)
      });
    },
    [callbackUrl]
  );
  const signUpWithCredentials = useCallback(
    (options) => {
      return signIn("credentials-signup", {
        ...options,
        callbackUrl: callbackUrl ?? (options == null ? void 0 : options.callbackUrl)
      });
    },
    [callbackUrl]
  );
  const signInWithGoogle = useCallback(
    (options) => {
      return signIn("google", {
        ...options,
        callbackUrl: callbackUrl ?? (options == null ? void 0 : options.callbackUrl)
      });
    },
    [callbackUrl]
  );
  const signInWithFacebook = useCallback((options) => {
    return signIn("facebook", { ...options, callbackUrl: callbackUrl ?? (options == null ? void 0 : options.callbackUrl) });
  }, [callbackUrl]);
  const signInWithTwitter = useCallback((options) => {
    return signIn("twitter", { ...options, callbackUrl: callbackUrl ?? (options == null ? void 0 : options.callbackUrl) });
  }, [callbackUrl]);
  return {
    signInWithCredentials,
    signUpWithCredentials,
    signInWithGoogle,
    signInWithFacebook,
    signInWithTwitter,
    signOut
  };
}
const NAV = [
  { to: "/book", label: "Book Appointment", icon: "calendar" },
  { to: "/my-bookings", label: "My Bookings", icon: "clock" },
  { to: "/salon-dashboard", label: "Salon Dashboard", icon: "grid" },
  { to: "/manage-bookings", label: "Manage Bookings", icon: "list" },
  { to: "/salon-setup", label: "Salon Setup", icon: "settings" }
];
const STEPS = [
  { key: "service", label: "Choose Service", icon: "scissors", path: "/book" },
  { key: "time", label: "Pick Time", icon: "clock", path: "/book/time" },
  { key: "confirm", label: "Confirm", icon: "check", path: "/book/confirm" }
];
function NavIcon({ name }) {
  const icons = {
    calendar: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" }) }),
    clock: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" }) }),
    grid: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" }) }),
    list: /* @__PURE__ */ jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" }) }),
    settings: /* @__PURE__ */ jsxs("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: [
      /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 2.31.826 1.37 1.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 2.31-1.37 1.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-2.31-.826-1.37-1.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-2.31 1.37-1.37.996.608 2.296.07 2.572-1.065z" }),
      /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z" })
    ] }),
    home: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" }) }),
    scissors: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" }) }),
    check: /* @__PURE__ */ jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) })
  };
  return icons[name] || null;
}
function AppLayout({ children }) {
  const location = useLocation();
  const pathname = (location == null ? void 0 : location.pathname) ?? "";
  const isBookFlow = pathname.startsWith("/book");
  const { data: session, status } = useSession();
  const { signOut: signOut2 } = useAuth();
  const isAuthenticated = status === "authenticated" && (session == null ? void 0 : session.user);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-[#fafafa] font-sans text-[#1a1a1a]", children: [
    /* @__PURE__ */ jsx("header", { className: "bg-white border-b border-[#eee] sticky top-0 z-50", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14", children: [
      /* @__PURE__ */ jsxs(Link, { to: "/", className: "flex items-center gap-2 text-[#1a1a1a] font-bold text-lg no-underline", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[#c45c6a]", children: "★" }),
        /* @__PURE__ */ jsx("span", { children: "SalonBooker" })
      ] }),
      /* @__PURE__ */ jsxs("nav", { className: "flex items-center gap-4 sm:gap-6", children: [
        NAV.map(({ to, label, icon }) => /* @__PURE__ */ jsxs(
          Link,
          {
            to,
            className: "flex items-center gap-1.5 text-sm text-[#444] hover:text-[#c45c6a] no-underline transition-colors",
            children: [
              /* @__PURE__ */ jsx(NavIcon, { name: icon }),
              /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: label })
            ]
          },
          to
        )),
        isAuthenticated ? /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => signOut2({ callbackUrl: "/" }),
            className: "flex items-center gap-1.5 text-sm text-[#444] hover:text-[#c45c6a] transition-colors bg-transparent border-none cursor-pointer",
            children: [
              /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Sign out" }),
              /* @__PURE__ */ jsx("span", { className: "sm:hidden", children: "Out" })
            ]
          }
        ) : /* @__PURE__ */ jsxs(
          Link,
          {
            to: "/account/signin",
            className: "flex items-center gap-1.5 text-sm text-[#444] hover:text-[#c45c6a] no-underline transition-colors",
            children: [
              /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Sign in" }),
              /* @__PURE__ */ jsx("span", { className: "sm:hidden", children: "In" })
            ]
          }
        )
      ] })
    ] }) }),
    isBookFlow && /* @__PURE__ */ jsx("div", { className: "bg-[#f0f0f0] border-b border-[#e5e5e5]", children: /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto px-4 py-4", children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: STEPS.map((step, i) => {
      const isActive = step.path === "/book" ? pathname === "/book" : pathname.startsWith(step.path);
      return /* @__PURE__ */ jsxs("div", { className: "flex flex-1 items-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center flex-1", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: `w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${isActive ? "bg-[#e8b4bc] border-[#c45c6a] text-[#8b3a44]" : "bg-white border-[#ddd] text-[#666]"}`,
              children: /* @__PURE__ */ jsx(NavIcon, { name: step.icon })
            }
          ),
          /* @__PURE__ */ jsx("span", { className: `mt-1 text-xs font-medium ${isActive ? "text-[#8b3a44]" : "text-[#666]"}`, children: step.label })
        ] }),
        i < STEPS.length - 1 && /* @__PURE__ */ jsx("div", { className: "flex-1 h-0.5 mx-1 bg-[#ddd] max-w-[60px] sm:max-w-[80px]" })
      ] }, step.key);
    }) }) }) }),
    /* @__PURE__ */ jsx("main", { className: "max-w-7xl mx-auto px-4 sm:px-6 py-8", children })
  ] });
}
const links = () => [];
if (globalThis.window && globalThis.window !== void 0) {
  globalThis.window.fetch = fetchWithHeaders;
}
const LoadFontsSSR = LoadFonts;
function InternalErrorBoundary({
  error: errorArg
}) {
  const routeError = useRouteError();
  const asyncError = useAsyncError();
  const error = errorArg ?? asyncError ?? routeError;
  const [isOpen, setIsOpen] = useState(false);
  const shouldScale = typeof window !== "undefined" ? window.innerWidth < 768 : false;
  const scaleFactor = shouldScale ? 1.02 : 1;
  const copyButtonTextClass = shouldScale ? "text-sm" : "text-xs";
  const copyButtonPaddingClass = shouldScale ? "px-[10px] py-[5px]" : "px-[6px] py-[3px]";
  const postCountRef = useRef(0);
  const lastPostTimeRef = useRef(0);
  const lastErrorKeyRef = useRef(null);
  const MAX_ERROR_POSTS_PER_ERROR = 5;
  const THROTTLE_MS = 1e3;
  useEffect(() => {
    const serialized = serializeError(error);
    const errorKey = JSON.stringify(serialized);
    if (errorKey !== lastErrorKeyRef.current) {
      lastErrorKeyRef.current = errorKey;
      postCountRef.current = 0;
    }
    if (postCountRef.current >= MAX_ERROR_POSTS_PER_ERROR) {
      return;
    }
    const now = Date.now();
    const timeSinceLastPost = now - lastPostTimeRef.current;
    const post = () => {
      if (postCountRef.current >= MAX_ERROR_POSTS_PER_ERROR) {
        return;
      }
      postCountRef.current += 1;
      lastPostTimeRef.current = Date.now();
      window.parent.postMessage({
        type: "sandbox:error:detected",
        error: serialized
      }, "*");
    };
    if (timeSinceLastPost < THROTTLE_MS) {
      const timer = setTimeout(post, THROTTLE_MS - timeSinceLastPost);
      return () => clearTimeout(timer);
    }
    post();
  }, [error]);
  useEffect(() => {
    const animateTimer = setTimeout(() => setIsOpen(true), 100);
    return () => clearTimeout(animateTimer);
  }, []);
  const {
    buttonProps: copyButtonProps
  } = useButton({
    onPress: useCallback(() => {
      const toastScale = shouldScale ? 1.2 : 1;
      const toastStyle = {
        padding: `${16 * toastScale}px`,
        background: "#18191B",
        border: "1px solid #2C2D2F",
        color: "white",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        width: `${280 * toastScale}px`,
        fontSize: `${13 * toastScale}px`,
        display: "flex",
        alignItems: "center",
        gap: `${6 * toastScale}px`,
        justifyContent: "flex-start",
        margin: "0 auto"
      };
      navigator.clipboard.writeText(JSON.stringify(serializeError(error)));
      toast.custom(() => /* @__PURE__ */ jsxs("div", {
        style: toastStyle,
        children: [/* @__PURE__ */ jsxs("svg", {
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 20 20",
          fill: "currentColor",
          height: "20",
          width: "20",
          children: [/* @__PURE__ */ jsx("title", {
            children: "Success"
          }), /* @__PURE__ */ jsx("path", {
            fillRule: "evenodd",
            d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z",
            clipRule: "evenodd"
          })]
        }), /* @__PURE__ */ jsx("span", {
          children: "Copied successfully!"
        })]
      }), {
        id: "copy-error-success",
        duration: 3e3
      });
    }, [error, shouldScale])
  }, useRef(null));
  function isInIframe() {
    try {
      return window.parent !== window;
    } catch {
      return true;
    }
  }
  return /* @__PURE__ */ jsx(Fragment, {
    children: !isInIframe() && /* @__PURE__ */ jsx("div", {
      className: `fixed bottom-4 left-1/2 transform -translate-x-1/2 max-w-md z-50 transition-all duration-500 ease-out ${isOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`,
      style: {
        width: "75vw"
      },
      children: /* @__PURE__ */ jsx("div", {
        className: "bg-[#18191B] text-[#F2F2F2] rounded-lg p-4 shadow-lg w-full",
        style: scaleFactor !== 1 ? {
          transform: `scale(${scaleFactor})`,
          transformOrigin: "bottom center"
        } : void 0,
        children: /* @__PURE__ */ jsxs("div", {
          className: "flex items-start gap-3",
          children: [/* @__PURE__ */ jsx("div", {
            className: "flex-shrink-0",
            children: /* @__PURE__ */ jsx("div", {
              className: "w-8 h-8 bg-[#F2F2F2] rounded-full flex items-center justify-center",
              children: /* @__PURE__ */ jsx("span", {
                className: "text-black text-[1.125rem] leading-none",
                children: "!"
              })
            })
          }), /* @__PURE__ */ jsxs("div", {
            className: "flex flex-col gap-2 flex-1",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "flex flex-col gap-1",
              children: [/* @__PURE__ */ jsx("p", {
                className: "font-light text-[#F2F2F2] text-sm",
                children: "App Error Detected"
              }), /* @__PURE__ */ jsx("p", {
                className: "text-[#959697] text-sm font-light",
                children: "It looks like an error occurred while trying to use your app."
              })]
            }), /* @__PURE__ */ jsx("button", {
              className: `flex flex-row items-center justify-center gap-[4px] outline-none transition-colors rounded-[8px] border-[1px] bg-[#2C2D2F] hover:bg-[#414243] active:bg-[#555658] border-[#414243] text-white ${copyButtonTextClass} ${copyButtonPaddingClass} w-fit`,
              type: "button",
              ...copyButtonProps,
              children: "Copy error"
            })]
          })]
        })
      })
    })
  });
}
class ErrorBoundaryWrapper extends Component {
  constructor() {
    super(...arguments);
    __publicField(this, "state", {
      hasError: false,
      error: null
    });
  }
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error
    };
  }
  componentDidCatch(error, info) {
    console.error(error, info);
  }
  render() {
    if (this.state.hasError) {
      return /* @__PURE__ */ jsx(InternalErrorBoundary, {
        error: this.state.error,
        params: {}
      });
    }
    return this.props.children;
  }
}
function LoaderWrapper({
  loader: loader2
}) {
  return /* @__PURE__ */ jsx(Fragment, {
    children: loader2()
  });
}
const ClientOnly = ({
  loader: loader2
}) => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return null;
  return /* @__PURE__ */ jsx(ErrorBoundaryWrapper, {
    children: /* @__PURE__ */ jsx(LoaderWrapper, {
      loader: loader2
    })
  });
};
function useHmrConnection() {
  const [connected, setConnected] = useState(() => false);
  useEffect(() => {
    return;
  }, []);
  return connected;
}
const healthyResponseType = "sandbox:web:healthcheck:response";
const useHandshakeParent = () => {
  const isHmrConnected = useHmrConnection();
  useEffect(() => {
    const healthyResponse = {
      type: healthyResponseType,
      healthy: isHmrConnected,
      supportsErrorDetected: true
    };
    const handleMessage = (event) => {
      if (event.data.type === "sandbox:web:healthcheck") {
        window.parent.postMessage(healthyResponse, "*");
      }
    };
    window.addEventListener("message", handleMessage);
    window.parent.postMessage(healthyResponse, "*");
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [isHmrConnected]);
};
const waitForScreenshotReady = async () => {
  const images = Array.from(document.images);
  await Promise.all([
    // make sure custom fonts are loaded
    "fonts" in document ? document.fonts.ready : Promise.resolve(),
    ...images.map((img) => new Promise((resolve) => {
      img.crossOrigin = "anonymous";
      if (img.complete) {
        resolve(true);
        return;
      }
      img.onload = () => resolve(true);
      img.onerror = () => resolve(true);
    }))
  ]);
  await new Promise((resolve) => setTimeout(resolve, 250));
};
const useHandleScreenshotRequest = () => {
  useEffect(() => {
    const handleMessage = async (event) => {
      if (event.data.type === "sandbox:web:screenshot:request") {
        try {
          await waitForScreenshotReady();
          const width = window.innerWidth;
          const aspectRatio = 16 / 9;
          const height = Math.floor(width / aspectRatio);
          const dataUrl = await toPng(document.body, {
            cacheBust: true,
            skipFonts: false,
            width,
            height,
            style: {
              // force snapshot sizing
              width: `${width}px`,
              height: `${height}px`,
              margin: "0"
            }
          });
          window.parent.postMessage({
            type: "sandbox:web:screenshot:response",
            dataUrl
          }, "*");
        } catch (error) {
          window.parent.postMessage({
            type: "sandbox:web:screenshot:error",
            error: error instanceof Error ? error.message : String(error)
          }, "*");
        }
      }
    };
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);
};
function Layout({
  children
}) {
  useHandshakeParent();
  useHandleScreenshotRequest();
  useDevServerHeartbeat();
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location == null ? void 0 : location.pathname;
  const isMobile = typeof window !== "undefined" ? window.innerWidth < 768 : false;
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === "sandbox:navigation") {
        navigate(event.data.pathname);
      }
    };
    window.addEventListener("message", handleMessage);
    window.parent.postMessage({
      type: "sandbox:web:ready"
    }, "*");
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [navigate]);
  useEffect(() => {
    if (pathname) {
      window.parent.postMessage({
        type: "sandbox:web:navigation",
        pathname
      }, "*");
    }
  }, [pathname]);
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {}), /* @__PURE__ */ jsx("script", {
        type: "module",
        src: "/src/__create/dev-error-overlay.js"
      }), /* @__PURE__ */ jsx("link", {
        rel: "icon",
        href: "/src/__create/favicon.png"
      }), LoadFontsSSR ? /* @__PURE__ */ jsx(LoadFontsSSR, {}) : null]
    }), /* @__PURE__ */ jsxs("body", {
      children: [/* @__PURE__ */ jsx(ClientOnly, {
        loader: () => children
      }), /* @__PURE__ */ jsx(Toaster, {
        position: isMobile ? "top-center" : "bottom-right"
      }), /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {}), /* @__PURE__ */ jsx("script", {
        src: "https://kit.fontawesome.com/2c15cc0cc7.js",
        crossOrigin: "anonymous",
        async: true
      })]
    })]
  });
}
const root = UNSAFE_withComponentProps(function App() {
  return /* @__PURE__ */ jsx(SessionProvider, {
    children: /* @__PURE__ */ jsx(AppLayout, {
      children: /* @__PURE__ */ jsx(Outlet, {})
    })
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ClientOnly,
  Layout,
  default: root,
  links,
  useHandleScreenshotRequest,
  useHmrConnection
}, Symbol.toStringTag, { value: "Module" }));
const salon = {
  name: "SalonBooker"
};
const services = [
  { id: "1", name: "Haircut", duration: "45 min", price: 35 },
  { id: "2", name: "Colour & highlights", duration: "2 hrs", price: 120 },
  { id: "3", name: "Blow dry & style", duration: "30 min", price: 25 },
  { id: "4", name: "Treatment", duration: "20 min", price: 15 }
];
const page$8 = UNSAFE_withComponentProps(function HomePage() {
  return /* @__PURE__ */ jsxs("div", {
    className: "max-w-3xl mx-auto text-center py-12 sm:py-16",
    children: [/* @__PURE__ */ jsxs("h1", {
      className: "text-4xl sm:text-5xl font-serif font-bold text-[#1a1a1a] mb-4",
      children: ["Welcome to ", salon.name]
    }), /* @__PURE__ */ jsx("p", {
      className: "text-lg text-[#666] mb-10 max-w-xl mx-auto",
      children: "Book your next appointment with us. Choose a service, pick a time, and we’ll take care of the rest."
    }), /* @__PURE__ */ jsxs(Link, {
      to: "/book",
      className: "inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-[#c45c6a] text-white font-medium no-underline hover:bg-[#a84a56] transition-colors",
      children: [/* @__PURE__ */ jsx("svg", {
        className: "w-5 h-5",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
        children: /* @__PURE__ */ jsx("path", {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: 2,
          d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        })
      }), "Book appointment"]
    })]
  });
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: page$8
}, Symbol.toStringTag, { value: "Module" }));
const page$7 = UNSAFE_withComponentProps(function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    signInWithCredentials,
    signInWithGoogle
  } = useAuth();
  const navigate = useNavigate();
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await signInWithCredentials({
        email,
        password,
        callbackUrl: "/"
      });
      if (result == null ? void 0 : result.error) {
        setError(result.error === "CredentialsSignin" ? "Invalid email or password." : "Sign in failed.");
        setLoading(false);
        return;
      }
      navigate("/", {
        replace: true
      });
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  }
  return /* @__PURE__ */ jsxs("div", {
    className: "max-w-sm mx-auto py-12",
    children: [/* @__PURE__ */ jsx("h1", {
      className: "text-2xl font-serif font-bold text-[#1a1a1a] mb-2",
      children: "Sign in"
    }), /* @__PURE__ */ jsx("p", {
      className: "text-[#666] mb-6",
      children: "Sign in to manage your bookings."
    }), /* @__PURE__ */ jsxs("form", {
      onSubmit: handleSubmit,
      className: "space-y-4",
      children: [error && /* @__PURE__ */ jsx("p", {
        className: "text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2",
        children: error
      }), /* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsx("label", {
          htmlFor: "email",
          className: "block text-sm font-medium text-[#444] mb-1",
          children: "Email"
        }), /* @__PURE__ */ jsx("input", {
          id: "email",
          name: "email",
          type: "email",
          autoComplete: "email",
          required: true,
          value: email,
          onChange: (e) => setEmail(e.target.value),
          className: "w-full px-3 py-2 rounded-lg border border-[#e0e0e0] bg-white text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#e8b4bc] focus:border-[#c45c6a]"
        })]
      }), /* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsx("label", {
          htmlFor: "password",
          className: "block text-sm font-medium text-[#444] mb-1",
          children: "Password"
        }), /* @__PURE__ */ jsx("input", {
          id: "password",
          name: "password",
          type: "password",
          autoComplete: "current-password",
          required: true,
          value: password,
          onChange: (e) => setPassword(e.target.value),
          className: "w-full px-3 py-2 rounded-lg border border-[#e0e0e0] bg-white text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#e8b4bc] focus:border-[#c45c6a]"
        })]
      }), /* @__PURE__ */ jsx("button", {
        type: "submit",
        disabled: loading,
        className: "w-full py-3 px-4 rounded-xl bg-[#c45c6a] text-white font-medium hover:bg-[#a84a56] disabled:opacity-60 transition-colors",
        children: loading ? "Signing in…" : "Sign in"
      }), /* @__PURE__ */ jsx("div", {
        className: "relative my-4",
        children: /* @__PURE__ */ jsx("span", {
          className: "block text-center text-sm text-[#999]",
          children: "or"
        })
      }), /* @__PURE__ */ jsxs("button", {
        type: "button",
        onClick: () => signInWithGoogle({
          callbackUrl: "/"
        }),
        className: "w-full py-3 px-4 rounded-xl border border-[#e0e0e0] bg-white text-[#1a1a1a] font-medium hover:bg-[#f5f5f5] transition-colors flex items-center justify-center gap-2",
        children: [/* @__PURE__ */ jsxs("svg", {
          className: "w-5 h-5",
          viewBox: "0 0 24 24",
          children: [/* @__PURE__ */ jsx("path", {
            fill: "#4285F4",
            d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          }), /* @__PURE__ */ jsx("path", {
            fill: "#34A853",
            d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          }), /* @__PURE__ */ jsx("path", {
            fill: "#FBBC05",
            d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          }), /* @__PURE__ */ jsx("path", {
            fill: "#EA4335",
            d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          })]
        }), "Sign in with Google"]
      })]
    }), /* @__PURE__ */ jsx("p", {
      className: "mt-6 text-center text-sm text-[#666]",
      children: /* @__PURE__ */ jsx(Link, {
        to: "/",
        className: "text-[#c45c6a] no-underline hover:underline",
        children: "← Back to home"
      })
    })]
  });
});
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: page$7
}, Symbol.toStringTag, { value: "Module" }));
const page$6 = UNSAFE_withComponentProps(function ChooseServicePage() {
  return /* @__PURE__ */ jsxs("div", {
    className: "max-w-2xl mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      className: "text-3xl font-serif font-bold text-[#1a1a1a] mb-2",
      children: "Choose Service"
    }), /* @__PURE__ */ jsxs("p", {
      className: "text-[#666] mb-8",
      children: ["Select a service at ", salon.name]
    }), /* @__PURE__ */ jsx("ul", {
      className: "space-y-3",
      children: services.map((service) => /* @__PURE__ */ jsx("li", {
        children: /* @__PURE__ */ jsxs(Link, {
          to: `/book/time?service=${service.id}`,
          className: "flex items-center justify-between p-4 rounded-xl border border-[#eee] bg-white hover:border-[#e8b4bc] hover:shadow transition-all no-underline text-[#1a1a1a]",
          children: [/* @__PURE__ */ jsxs("div", {
            children: [/* @__PURE__ */ jsx("span", {
              className: "font-medium",
              children: service.name
            }), /* @__PURE__ */ jsxs("span", {
              className: "text-[#666] text-sm ml-2",
              children: ["· ", service.duration]
            })]
          }), /* @__PURE__ */ jsxs("span", {
            className: "font-medium text-[#8b3a44]",
            children: ["$", service.price]
          })]
        })
      }, service.id))
    })]
  });
});
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: page$6
}, Symbol.toStringTag, { value: "Module" }));
const STORAGE_KEY = "salon_bookings";
function getBookings() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function saveBooking(booking) {
  const list = getBookings();
  const next = [...list, { ...booking, id: crypto.randomUUID(), createdAt: (/* @__PURE__ */ new Date()).toISOString() }];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}
function getBookingsForUser(userId) {
  const list = getBookings();
  if (!userId) return [];
  return list.filter((b) => b.userId === userId);
}
const servicesById = Object.fromEntries(services.map((s) => [s.id, s]));
const page$5 = UNSAFE_withComponentProps(function ConfirmPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    data: session
  } = useSession();
  const serviceId = searchParams.get("service");
  const time = searchParams.get("time");
  const service = serviceId ? servicesById[serviceId] : null;
  function handleConfirm() {
    var _a, _b, _c, _d;
    const userId = ((_a = session == null ? void 0 : session.user) == null ? void 0 : _a.id) ?? ((_b = session == null ? void 0 : session.user) == null ? void 0 : _b.email) ?? "guest";
    const userEmail = ((_c = session == null ? void 0 : session.user) == null ? void 0 : _c.email) ?? "";
    const userName = ((_d = session == null ? void 0 : session.user) == null ? void 0 : _d.name) ?? "Guest";
    const timeStr = decodeURIComponent(time || "");
    saveBooking({
      userId,
      userEmail,
      userName,
      serviceName: service.name,
      serviceId,
      time: timeStr,
      price: service.price
    });
    toast.success("Booking confirmed");
    navigate("/", {
      replace: true
    });
  }
  if (!service || !time) {
    return /* @__PURE__ */ jsxs("div", {
      className: "max-w-2xl mx-auto text-center py-12",
      children: [/* @__PURE__ */ jsx("p", {
        className: "text-[#666] mb-4",
        children: "Missing booking details. Please start over."
      }), /* @__PURE__ */ jsx(Link, {
        to: "/book",
        className: "text-[#c45c6a] font-medium no-underline hover:underline",
        children: "← Choose service"
      })]
    });
  }
  return /* @__PURE__ */ jsxs("div", {
    className: "max-w-xl mx-auto",
    children: [/* @__PURE__ */ jsx(Link, {
      to: `/book/time?service=${serviceId}`,
      className: "inline-flex items-center gap-1 text-[#666] text-sm mb-6 no-underline hover:text-[#c45c6a]",
      children: "← Back to time"
    }), /* @__PURE__ */ jsx("h1", {
      className: "text-3xl font-serif font-bold text-[#1a1a1a] mb-6",
      children: "Confirm"
    }), /* @__PURE__ */ jsxs("div", {
      className: "rounded-xl border border-[#eee] bg-white p-6 mb-6",
      children: [/* @__PURE__ */ jsx("p", {
        className: "text-[#666] text-sm mb-1",
        children: "Salon"
      }), /* @__PURE__ */ jsx("p", {
        className: "font-semibold text-[#1a1a1a]",
        children: salon.name
      }), /* @__PURE__ */ jsx("p", {
        className: "text-[#666] text-sm mt-4 mb-1",
        children: "Service"
      }), /* @__PURE__ */ jsx("p", {
        className: "font-semibold text-[#1a1a1a]",
        children: service.name
      }), /* @__PURE__ */ jsx("p", {
        className: "text-[#666] text-sm mt-4 mb-1",
        children: "Time"
      }), /* @__PURE__ */ jsx("p", {
        className: "font-semibold text-[#1a1a1a]",
        children: decodeURIComponent(time)
      }), /* @__PURE__ */ jsx("p", {
        className: "text-[#666] text-sm mt-4 mb-1",
        children: "Price"
      }), /* @__PURE__ */ jsxs("p", {
        className: "font-semibold text-[#8b3a44]",
        children: ["$", service.price]
      })]
    }), /* @__PURE__ */ jsxs("div", {
      className: "flex flex-col sm:flex-row gap-3",
      children: [/* @__PURE__ */ jsx("button", {
        type: "button",
        onClick: handleConfirm,
        className: "flex-1 py-3 px-4 rounded-xl bg-[#c45c6a] text-white font-medium hover:bg-[#a84a56] transition-colors",
        children: "Confirm booking"
      }), /* @__PURE__ */ jsx(Link, {
        to: "/book",
        className: "flex-1 py-3 px-4 rounded-xl border border-[#ddd] text-center text-[#444] font-medium no-underline hover:bg-[#f5f5f5] transition-colors",
        children: "Cancel"
      })]
    })]
  });
});
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: page$5
}, Symbol.toStringTag, { value: "Module" }));
const MOCK_SLOTS = ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"];
const page$4 = UNSAFE_withComponentProps(function PickTimePage() {
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get("service");
  if (!serviceId) {
    return /* @__PURE__ */ jsxs("div", {
      className: "max-w-2xl mx-auto text-center py-12",
      children: [/* @__PURE__ */ jsx("p", {
        className: "text-[#666] mb-4",
        children: "Please select a service first."
      }), /* @__PURE__ */ jsx(Link, {
        to: "/book",
        className: "text-[#c45c6a] font-medium no-underline hover:underline",
        children: "← Choose service"
      })]
    });
  }
  return /* @__PURE__ */ jsxs("div", {
    className: "max-w-2xl mx-auto",
    children: [/* @__PURE__ */ jsx(Link, {
      to: "/book",
      className: "inline-flex items-center gap-1 text-[#666] text-sm mb-6 no-underline hover:text-[#c45c6a]",
      children: "← Back to services"
    }), /* @__PURE__ */ jsx("h1", {
      className: "text-3xl font-serif font-bold text-[#1a1a1a] mb-2",
      children: "Pick Time"
    }), /* @__PURE__ */ jsxs("p", {
      className: "text-[#666] mb-8",
      children: ["Choose a slot at ", salon.name]
    }), /* @__PURE__ */ jsx("div", {
      className: "grid grid-cols-2 sm:grid-cols-3 gap-3",
      children: MOCK_SLOTS.map((slot) => /* @__PURE__ */ jsx(Link, {
        to: `/book/confirm?service=${serviceId}&time=${encodeURIComponent(slot)}`,
        className: "p-4 rounded-xl border border-[#eee] bg-white text-center font-medium hover:border-[#e8b4bc] hover:bg-[#fef8f9] transition-all no-underline text-[#1a1a1a]",
        children: slot
      }, slot))
    })]
  });
});
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: page$4
}, Symbol.toStringTag, { value: "Module" }));
const page$3 = UNSAFE_withComponentProps(function ManageBookingsPage() {
  const bookings = useMemo(() => getBookings(), []);
  const sorted = useMemo(() => [...bookings].sort((a, b) => b.createdAt > a.createdAt ? 1 : -1), [bookings]);
  return /* @__PURE__ */ jsxs("div", {
    className: "max-w-3xl mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      className: "text-3xl font-serif font-bold text-[#1a1a1a] mb-2",
      children: "Manage Bookings"
    }), /* @__PURE__ */ jsx("p", {
      className: "text-[#666] mb-8",
      children: "All bookings for your salon."
    }), sorted.length === 0 ? /* @__PURE__ */ jsx("div", {
      className: "rounded-xl border border-[#eee] bg-white p-8 text-center text-[#666]",
      children: /* @__PURE__ */ jsx("p", {
        children: "No bookings yet. When customers confirm a booking, it will appear here."
      })
    }) : /* @__PURE__ */ jsx("ul", {
      className: "space-y-3",
      children: sorted.map((b) => /* @__PURE__ */ jsx("li", {
        className: "rounded-xl border border-[#eee] bg-white p-4 flex flex-wrap items-center justify-between gap-2",
        children: /* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("p", {
            className: "font-medium text-[#1a1a1a]",
            children: b.serviceName
          }), /* @__PURE__ */ jsxs("p", {
            className: "text-sm text-[#666]",
            children: [b.userName || b.userEmail || "Guest", " · ", b.time, " · $", b.price]
          }), /* @__PURE__ */ jsxs("p", {
            className: "text-xs text-[#999] mt-1",
            children: ["Booked ", new Date(b.createdAt).toLocaleString()]
          })]
        })
      }, b.id))
    })]
  });
});
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: page$3
}, Symbol.toStringTag, { value: "Module" }));
const page$2 = UNSAFE_withComponentProps(function MyBookingsPage() {
  var _a, _b;
  const {
    data: session,
    status
  } = useSession();
  const userId = ((_a = session == null ? void 0 : session.user) == null ? void 0 : _a.id) ?? ((_b = session == null ? void 0 : session.user) == null ? void 0 : _b.email) ?? null;
  const bookings = useMemo(() => userId ? getBookingsForUser(userId) : [], [userId]);
  const sorted = useMemo(() => [...bookings].sort((a, b) => b.createdAt > a.createdAt ? 1 : -1), [bookings]);
  if (status === "loading") {
    return /* @__PURE__ */ jsxs("div", {
      className: "max-w-3xl mx-auto",
      children: [/* @__PURE__ */ jsx("h1", {
        className: "text-3xl font-serif font-bold text-[#1a1a1a] mb-2",
        children: "My Bookings"
      }), /* @__PURE__ */ jsx("p", {
        className: "text-[#666]",
        children: "Loading…"
      })]
    });
  }
  if (!userId) {
    return /* @__PURE__ */ jsxs("div", {
      className: "max-w-3xl mx-auto",
      children: [/* @__PURE__ */ jsx("h1", {
        className: "text-3xl font-serif font-bold text-[#1a1a1a] mb-2",
        children: "My Bookings"
      }), /* @__PURE__ */ jsx("p", {
        className: "text-[#666] mb-6",
        children: "Sign in to view your bookings."
      }), /* @__PURE__ */ jsx(Link, {
        to: "/account/signin",
        className: "inline-flex py-3 px-4 rounded-xl bg-[#c45c6a] text-white font-medium no-underline hover:bg-[#a84a56]",
        children: "Sign in"
      })]
    });
  }
  return /* @__PURE__ */ jsxs("div", {
    className: "max-w-3xl mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      className: "text-3xl font-serif font-bold text-[#1a1a1a] mb-2",
      children: "My Bookings"
    }), /* @__PURE__ */ jsx("p", {
      className: "text-[#666] mb-8",
      children: "Your upcoming and past appointments."
    }), sorted.length === 0 ? /* @__PURE__ */ jsxs("div", {
      className: "rounded-xl border border-[#eee] bg-white p-8 text-center text-[#666]",
      children: [/* @__PURE__ */ jsx("p", {
        children: "You have no bookings yet."
      }), /* @__PURE__ */ jsx(Link, {
        to: "/book",
        className: "mt-4 inline-block text-[#c45c6a] font-medium no-underline hover:underline",
        children: "Book an appointment →"
      })]
    }) : /* @__PURE__ */ jsx("ul", {
      className: "space-y-3",
      children: sorted.map((b) => /* @__PURE__ */ jsx("li", {
        className: "rounded-xl border border-[#eee] bg-white p-4 flex flex-wrap items-center justify-between gap-2",
        children: /* @__PURE__ */ jsxs("div", {
          children: [/* @__PURE__ */ jsx("p", {
            className: "font-medium text-[#1a1a1a]",
            children: b.serviceName
          }), /* @__PURE__ */ jsxs("p", {
            className: "text-sm text-[#666]",
            children: [b.time, " · $", b.price]
          }), /* @__PURE__ */ jsx("p", {
            className: "text-xs text-[#999] mt-1",
            children: new Date(b.createdAt).toLocaleDateString()
          })]
        })
      }, b.id))
    })]
  });
});
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: page$2
}, Symbol.toStringTag, { value: "Module" }));
const page$1 = UNSAFE_withComponentProps(function SalonDashboardPage() {
  return /* @__PURE__ */ jsxs("div", {
    className: "max-w-3xl mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      className: "text-3xl font-serif font-bold text-[#1a1a1a] mb-2",
      children: "Salon Dashboard"
    }), /* @__PURE__ */ jsx("p", {
      className: "text-[#666] mb-8",
      children: "Overview for salon owners."
    }), /* @__PURE__ */ jsx("div", {
      className: "rounded-xl border border-[#eee] bg-white p-8 text-center text-[#666]",
      children: /* @__PURE__ */ jsx("p", {
        children: "Dashboard content coming soon."
      })
    })]
  });
});
const route8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: page$1
}, Symbol.toStringTag, { value: "Module" }));
const page = UNSAFE_withComponentProps(function SalonSetupPage() {
  return /* @__PURE__ */ jsxs("div", {
    className: "max-w-3xl mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      className: "text-3xl font-serif font-bold text-[#1a1a1a] mb-2",
      children: "Salon Setup"
    }), /* @__PURE__ */ jsx("p", {
      className: "text-[#666] mb-8",
      children: "Configure your salon profile, services, and availability."
    }), /* @__PURE__ */ jsx("div", {
      className: "rounded-xl border border-[#eee] bg-white p-8 text-center text-[#666]",
      children: /* @__PURE__ */ jsx("p", {
        children: "Salon setup coming soon."
      })
    })]
  });
});
const route9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: page
}, Symbol.toStringTag, { value: "Module" }));
async function loader({
  params
}) {
  const matches = await fg("src/**/page.{js,jsx,ts,tsx}");
  return {
    path: `/${params["*"]}`,
    pages: matches.sort((a, b) => a.length - b.length).map((match) => {
      const url = match.replace("src/app", "").replace(/\/page\.(js|jsx|ts|tsx)$/, "") || "/";
      const path = url.replaceAll("[", "").replaceAll("]", "");
      const displayPath = path === "/" ? "Homepage" : path;
      return {
        url,
        path: displayPath
      };
    })
  };
}
const notFound = UNSAFE_withComponentProps(function CreateDefaultNotFoundPage({
  loaderData
}) {
  var _a;
  const [siteMap, setSitemap] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (typeof window !== "undefined" && window.parent && window.parent !== window) {
      const handler = (event) => {
        if (event.data.type === "sandbox:sitemap") {
          window.removeEventListener("message", handler);
          setSitemap(event.data.sitemap);
        }
      };
      window.parent.postMessage({
        type: "sandbox:sitemap"
      }, "*");
      window.addEventListener("message", handler);
      return () => {
        window.removeEventListener("message", handler);
      };
    }
  }, []);
  const missingPath = loaderData.path.replace(/^\//, "");
  const existingRoutes = loaderData.pages.map((page2) => ({
    path: page2.path,
    url: page2.url
  }));
  const handleBack = () => {
    navigate("/");
  };
  const handleSearch = (value) => {
    if (!siteMap) {
      const path = `/${value}`;
      navigate(path);
    } else {
      navigate(value);
    }
  };
  const handleCreatePage = useCallback(() => {
    window.parent.postMessage({
      type: "sandbox:web:create",
      path: missingPath,
      view: "web"
    }, "*");
  }, [missingPath]);
  return /* @__PURE__ */ jsxs("div", {
    className: "flex sm:w-full w-screen sm:min-w-[850px] flex-col",
    children: [/* @__PURE__ */ jsxs("div", {
      className: "flex w-full items-center gap-2 p-5",
      children: [/* @__PURE__ */ jsx("button", {
        type: "button",
        onClick: handleBack,
        className: "flex items-center justify-center w-10 h-10 rounded-md",
        children: /* @__PURE__ */ jsxs("svg", {
          width: "18",
          height: "18",
          viewBox: "0 0 18 18",
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
          "aria-label": "Back",
          role: "img",
          children: [/* @__PURE__ */ jsx("path", {
            d: "M8.5957 2.65435L2.25005 9L8.5957 15.3457",
            stroke: "currentColor",
            strokeWidth: "1.5",
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }), /* @__PURE__ */ jsx("path", {
            d: "M2.25007 9L15.75 9",
            stroke: "currentColor",
            strokeWidth: "1.5",
            strokeLinecap: "round",
            strokeLinejoin: "round"
          })]
        })
      }), /* @__PURE__ */ jsxs("div", {
        className: "flex flex-row divide-x divide-gray-200 rounded-[8px] h-8 w-[300px] border border-gray-200 bg-gray-50 text-gray-500",
        children: [/* @__PURE__ */ jsx("div", {
          className: "flex items-center px-[14px] py-[5px]",
          children: /* @__PURE__ */ jsx("span", {
            children: "/"
          })
        }), /* @__PURE__ */ jsx("div", {
          className: "flex items-center min-w-0",
          children: /* @__PURE__ */ jsx("p", {
            className: "border-0 bg-transparent px-3 py-2 focus:outline-none truncate max-w-[300px]",
            style: {
              minWidth: 0
            },
            title: missingPath,
            children: missingPath
          })
        })]
      })]
    }), /* @__PURE__ */ jsxs("div", {
      className: "flex flex-grow flex-col items-center justify-center pt-[100px] text-center gap-[20px]",
      children: [/* @__PURE__ */ jsx("h1", {
        className: "text-4xl font-medium text-gray-900 px-2",
        children: "Uh-oh! This page doesn't exist (yet)."
      }), /* @__PURE__ */ jsxs("p", {
        className: "pt-4 pb-12 px-2 text-gray-500",
        children: ['Looks like "', /* @__PURE__ */ jsxs("span", {
          className: "font-bold",
          children: ["/", missingPath]
        }), `" isn't part of your project. But no worries, you've got options!`]
      }), /* @__PURE__ */ jsx("div", {
        className: "px-[20px] w-full",
        children: /* @__PURE__ */ jsxs("div", {
          className: "flex flex-row justify-center items-center w-full max-w-[800px] mx-auto border border-gray-200 rounded-lg p-[20px] mb-[40px] gap-[20px]",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "flex flex-col gap-[5px] items-start self-start w-1/2",
            children: [/* @__PURE__ */ jsx("p", {
              className: "text-sm text-black text-left",
              children: "Build it from scratch"
            }), /* @__PURE__ */ jsxs("p", {
              className: "text-sm text-gray-500 text-left",
              children: ['Create a new page to live at "', /* @__PURE__ */ jsxs("span", {
                children: ["/", missingPath]
              }), '"']
            })]
          }), /* @__PURE__ */ jsx("div", {
            className: "flex flex-row items-center justify-end w-1/2",
            children: /* @__PURE__ */ jsx("button", {
              type: "button",
              className: "bg-black text-white px-[10px] py-[5px] rounded-md",
              onClick: () => handleCreatePage(),
              children: "Create Page"
            })
          })]
        })
      }), /* @__PURE__ */ jsx("div", {
        className: "pb-20 lg:pb-[80px]",
        children: /* @__PURE__ */ jsx("p", {
          className: "flex items-center text-gray-500",
          children: "Check out all your project's routes here ↓"
        })
      }), siteMap ? /* @__PURE__ */ jsx("div", {
        className: "flex flex-col justify-center items-center w-full px-[50px]",
        children: /* @__PURE__ */ jsxs("div", {
          className: "flex flex-col justify-between items-center w-full max-w-[600px] gap-[10px]",
          children: [/* @__PURE__ */ jsx("p", {
            className: "text-sm text-gray-300 pb-[10px] self-start p-4",
            children: "PAGES"
          }), (_a = siteMap.webPages) == null ? void 0 : _a.map((route) => /* @__PURE__ */ jsxs("button", {
            type: "button",
            onClick: () => handleSearch(route.cleanRoute || ""),
            className: "flex flex-row justify-between text-center items-center p-4 rounded-lg bg-white shadow-sm w-full hover:bg-gray-50",
            children: [/* @__PURE__ */ jsx("h3", {
              className: "font-medium text-gray-900",
              children: route.name
            }), /* @__PURE__ */ jsx("p", {
              className: "text-sm text-gray-400",
              children: route.cleanRoute
            })]
          }, route.id))]
        })
      }) : /* @__PURE__ */ jsx("div", {
        className: "flex flex-wrap gap-3 w-full max-w-[80rem] mx-auto pb-5 px-2",
        children: existingRoutes.map((route) => /* @__PURE__ */ jsx("div", {
          className: "flex flex-col flex-grow basis-full sm:basis-[calc(50%-0.375rem)] xl:basis-[calc(33.333%-0.5rem)]",
          children: /* @__PURE__ */ jsxs("div", {
            className: "w-full flex-1 flex flex-col items-center ",
            children: [/* @__PURE__ */ jsx("div", {
              className: "relative w-full max-w-[350px] h-48 sm:h-56 lg:h-64 overflow-hidden rounded-[8px] border border-comeback-gray-75 transition-all group-hover:shadow-md",
              children: /* @__PURE__ */ jsx("button", {
                type: "button",
                onClick: () => handleSearch(route.url.replace(/^\//, "")),
                className: "h-full w-full rounded-[8px] bg-gray-50 bg-cover"
              })
            }), /* @__PURE__ */ jsx("p", {
              className: "pt-3 text-left text-gray-500 w-full max-w-[350px]",
              children: route.path
            })]
          })
        }, route.path))
      })]
    })]
  });
});
const route10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: notFound,
  loader
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-C5xRyJay.js", "imports": ["/assets/chunk-JZWAC4HX-CSZkG_88.js", "/assets/index-lWp3eB-Q.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/root-DS6CFd-M.js", "imports": ["/assets/chunk-JZWAC4HX-CSZkG_88.js", "/assets/index-lWp3eB-Q.js", "/assets/session-3ROweJ-k.js", "/assets/index-Bnl-ntlQ.js", "/assets/useAuth-DHhIOXXs.js"], "css": ["/assets/root-eNdkdICg.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "page": { "id": "page", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/page-DJgRM_Xx.js", "imports": ["/assets/chunk-JZWAC4HX-CSZkG_88.js", "/assets/salons-jfoW7nfX.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "account/signin/page": { "id": "account/signin/page", "parentId": "root", "path": "account/signin", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/page-DPpJnAnj.js", "imports": ["/assets/chunk-JZWAC4HX-CSZkG_88.js", "/assets/useAuth-DHhIOXXs.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "book/page": { "id": "book/page", "parentId": "root", "path": "book", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/page-aGLD93iL.js", "imports": ["/assets/chunk-JZWAC4HX-CSZkG_88.js", "/assets/salons-jfoW7nfX.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "book/confirm/page": { "id": "book/confirm/page", "parentId": "root", "path": "book/confirm", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/page-CzRxPWa4.js", "imports": ["/assets/chunk-JZWAC4HX-CSZkG_88.js", "/assets/session-3ROweJ-k.js", "/assets/index-Bnl-ntlQ.js", "/assets/salons-jfoW7nfX.js", "/assets/bookings-B3LFTGTR.js", "/assets/index-lWp3eB-Q.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "book/time/page": { "id": "book/time/page", "parentId": "root", "path": "book/time", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/page-CmXkKcKX.js", "imports": ["/assets/chunk-JZWAC4HX-CSZkG_88.js", "/assets/salons-jfoW7nfX.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "manage-bookings/page": { "id": "manage-bookings/page", "parentId": "root", "path": "manage-bookings", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/page-DPQRoybC.js", "imports": ["/assets/chunk-JZWAC4HX-CSZkG_88.js", "/assets/bookings-B3LFTGTR.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "my-bookings/page": { "id": "my-bookings/page", "parentId": "root", "path": "my-bookings", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/page-BCvm5FAh.js", "imports": ["/assets/chunk-JZWAC4HX-CSZkG_88.js", "/assets/session-3ROweJ-k.js", "/assets/bookings-B3LFTGTR.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "salon-dashboard/page": { "id": "salon-dashboard/page", "parentId": "root", "path": "salon-dashboard", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/page-DK9R052o.js", "imports": ["/assets/chunk-JZWAC4HX-CSZkG_88.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "salon-setup/page": { "id": "salon-setup/page", "parentId": "root", "path": "salon-setup", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/page-CfmPllZc.js", "imports": ["/assets/chunk-JZWAC4HX-CSZkG_88.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "__create/not-found": { "id": "__create/not-found", "parentId": "root", "path": "*?", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/not-found-Ccm2RzSa.js", "imports": ["/assets/chunk-JZWAC4HX-CSZkG_88.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-a0cacaef.js", "version": "a0cacaef", "sri": void 0 };
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "unstable_optimizeDeps": false, "unstable_subResourceIntegrity": false, "unstable_trailingSlashAwareDataRequests": false, "v8_middleware": false, "v8_splitRouteModules": false, "v8_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = ["/*?"];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "page": {
    id: "page",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  },
  "account/signin/page": {
    id: "account/signin/page",
    parentId: "root",
    path: "account/signin",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "book/page": {
    id: "book/page",
    parentId: "root",
    path: "book",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "book/confirm/page": {
    id: "book/confirm/page",
    parentId: "root",
    path: "book/confirm",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "book/time/page": {
    id: "book/time/page",
    parentId: "root",
    path: "book/time",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "manage-bookings/page": {
    id: "manage-bookings/page",
    parentId: "root",
    path: "manage-bookings",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "my-bookings/page": {
    id: "my-bookings/page",
    parentId: "root",
    path: "my-bookings",
    index: void 0,
    caseSensitive: void 0,
    module: route7
  },
  "salon-dashboard/page": {
    id: "salon-dashboard/page",
    parentId: "root",
    path: "salon-dashboard",
    index: void 0,
    caseSensitive: void 0,
    module: route8
  },
  "salon-setup/page": {
    id: "salon-setup/page",
    parentId: "root",
    path: "salon-setup",
    index: void 0,
    caseSensitive: void 0,
    module: route9
  },
  "__create/not-found": {
    id: "__create/not-found",
    parentId: "root",
    path: "*?",
    index: void 0,
    caseSensitive: void 0,
    module: route10
  }
};
const allowedActionOrigins = false;
const build = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  allowedActionOrigins,
  assets: serverManifest,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
}, Symbol.toStringTag, { value: "Module" }));
const _virtual_netlifyServer = createRequestHandler({
  build,
  getLoadContext: async (_req, ctx) => ctx
});
export {
  _virtual_netlifyServer as default
};
