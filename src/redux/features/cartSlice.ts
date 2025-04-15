// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// type CartState = { coworkingSpaceItems: ReservationItem[] };

// const initialState: CartState = {
//   coworkingSpaceItems: [], // This MUST be an empty array
// };

// export const cartSlice = createSlice({
//   name: "cart",
//   initialState,
//   reducers: {
//     addReservation: (state, action: PayloadAction<ReservationItem>) => {
//       state.coworkingSpaceItems.push(action.payload);
//     },
//     removeReservation: (state, action: PayloadAction<ReservationItem>) => {
//       const remainItems = state.coworkingSpaceItems.filter((obj) => {
//         return (
//           obj.coworkingSpaceName !== action.payload.coworkingSpaceName
//           || obj.startTime !== action.payload.startTime
//           || obj.endTime !== action.payload.endTime
//           || obj.customerName !== action.payload.customerName
//           || obj.customerRole !== action.payload.customerRole
//         );
//       });
//       state.coworkingSpaceItems = remainItems;
//     },
//   },
// });
// export const { addReservation, removeReservation } = cartSlice.actions;
// export default cartSlice.reducer;
