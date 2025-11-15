// "use client";

// import { useEffect } from "react";

// export default function ServiceWorkerRegister() {
//   useEffect(() => {
//     if ("serviceWorker" in navigator) {
//       window.addEventListener("load", () => {
//         navigator.serviceWorker
//           .register("/service-worker.js")
//           .then((reg) => {
//             console.log("✅ Service Worker registrado:", reg.scope);
//           })
//           .catch((err) => {
//             console.warn("❌ Erro ao registrar Service Worker:", err);
//           });
//       });
//     }
//   }, []);

//   return null; // nada é renderizado na tela
// }
