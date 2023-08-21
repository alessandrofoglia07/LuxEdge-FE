import { Route, Routes } from 'react-router-dom';
import PrivateRoutes from '@/components/PrivateRoute';
import { CartPage, CheckoutPage, DetailsPage, FavoritesPage, HomePage, LoginPage, NotFoundPage, ProductsPage, RegisterPage } from '@/pages';
import useRedux from '@/hooks/useRedux';

function App() {
    const { accessToken } = useRedux('auth');
    const isAuth = !!accessToken;

    return (
        <Routes>
            {/* Public Routes */}
            <Route path='/' element={<HomePage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/products' element={<ProductsPage />} />
            <Route path='/products/details/:product' element={<DetailsPage />} />
            <Route path='/contact' element={<></>} />
            <Route path='/user/activate/:userId' element={<></>} />
            <Route path='/user/reset-password/:userId/:token' element={<></>} />
            <Route path='/user/unsubscribe/:userId' element={<></>} />
            <Route path='*' element={<NotFoundPage />} />

            {/* Private Routes */}
            <Route element={<PrivateRoutes isAuth={isAuth} />}>
                <Route path='/cart' element={<CartPage />} />
                <Route path='/checkout' element={<CheckoutPage />} />
                <Route path='/favorites' element={<FavoritesPage />} />
            </Route>
        </Routes>
    );
}

export default App;
