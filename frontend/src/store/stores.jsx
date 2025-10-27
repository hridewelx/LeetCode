import { configureStore } from '@reduxjs/toolkit';
import authenticateUser from '../authenticationSlicer';

const store = configureStore({
    reducer: {
        authentication: authenticateUser
    }
});

export default store;