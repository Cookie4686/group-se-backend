// "use client";
// import { store } from "@/redux/store";
// import { Provider as ReactReduxProvider } from "react-redux";
// import { persistStore } from "redux-persist";
// import { PersistGate } from "redux-persist/integration/react";

// export default function Reduxprovider({ children }: { children: React.ReactNode }) {
//   const reduxPersistor = persistStore(store);

//   return (
//     <ReactReduxProvider store={store}>
//       <PersistGate loading={null} persistor={reduxPersistor}>
//         {children}
//       </PersistGate>
//     </ReactReduxProvider>
//   );
// }
