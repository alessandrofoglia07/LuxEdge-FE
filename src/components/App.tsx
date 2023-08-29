import { Route, Routes } from 'react-router-dom';
import PrivateRoutes from '@/components/PrivateRoute';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ProductsPage from '@/pages/products/ProductsPage';
import DetailsPage from '@/pages/products/DetailsPage';
import NotFoundPage from '@/pages/NotFoundPage';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import FavoritesPage from '@/pages/FavoritesPage';
import useSelector from '@/hooks/useSelector';
import ActivatePage from '@/pages/user/ActivatePage';
import ForgotPasswordPage from '@/pages/user/ForgotPassword';
import ResetPasswordPage from '@/pages/user/ResetPasswordPage';
import UnsubscribePage from '@/pages/user/UnsubscribePage';

function App() {
    const { accessToken } = useSelector((state) => state.auth);
    const isAuth = !!accessToken;

    return (
        <Routes>
            {/* Public Routes */}
            <Route path='/' element={<HomePage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/contact' element={<></>} />
            <Route path='*' element={<NotFoundPage />} />

            {/* /products */}
            <Route path='/products' element={<ProductsPage />} />
            <Route path='/products/details/:product' element={<DetailsPage />} />

            {/* /user */}
            <Route path='/user/activate/:userId' element={<ActivatePage />} />
            <Route path='/user/forgot-password' element={<ForgotPasswordPage />} />
            <Route path='/user/reset-password/:userId/:token' element={<ResetPasswordPage />} />
            <Route path='/user/unsubscribe/:userId' element={<UnsubscribePage />} />

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
