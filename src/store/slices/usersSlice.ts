import { createSlice } from '@reduxjs/toolkit';

import { dummyUsers } from '../dummyData/dummyData';

export interface User {
  id: string;
  name: string;
  phone: string;
  avatar: string;
}
const initialState: User[] = dummyUsers;

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
});

export const UsersReducer = usersSlice.reducer;
