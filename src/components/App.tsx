import { Navigate, Route, Routes } from 'react-router-dom';
import PrivateRoutes from '@/components/PrivateRoute';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ProductsPage from '@/pages/products/ProductsPage';
import DetailsPage from '@/pages/products/DetailsPage';
import CartPage from '@/pages/CartPage';
import FavoritesPage from '@/pages/FavoritesPage';
import ActivatePage from '@/pages/user/ActivatePage';
import ForgotPasswordPage from '@/pages/user/ForgotPassword';
import ResetPasswordPage from '@/pages/user/ResetPasswordPage';
import UnsubscribePage from '@/pages/user/UnsubscribePage';
import useAuth from '@/hooks/useAuth';
import CheckoutSuccessPage from '@/pages/checkout/CheckoutSuccessPage';
import CheckoutCancelPage from '@/pages/checkout/CheckoutCancelPage';
import OrdersPage from '@/pages/user/OrdersPage';
import OrderPage from '@/pages/user/OrderPage';

function App() {
    const isAuth = useAuth();

    return (
        <Routes>
            {/* Public Routes */}
            <Route path='/' element={<HomePage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='*' element={<Navigate to='/' />} />

            {/* /products */}
            <Route path='/products' element={<ProductsPage />} />
            <Route path='/products/:productCategory/:productName' element={<DetailsPage />} />

            {/* /user */}
            <Route path='/user/activate/:userId' element={<ActivatePage />} />
            <Route path='/user/forgot-password' element={<ForgotPasswordPage />} />
            <Route path='/user/reset-password/:userId/:token' element={<ResetPasswordPage />} />
            <Route path='/user/unsubscribe/:userId' element={<UnsubscribePage />} />

            {/* Private Routes */}
            <Route element={<PrivateRoutes isAuth={isAuth} />}>
                <Route path='/cart' element={<CartPage />} />
                <Route path='/favorites' element={<FavoritesPage />} />

                {/* /user */}
                <Route path='/user/orders' element={<OrdersPage />} />

                {/* /checkout */}
                <Route path='/checkout/success' element={<CheckoutSuccessPage />} />
                <Route path='/checkout/cancel' element={<CheckoutCancelPage />} />

                <Route path='/user/orders/:orderId' element={<OrderPage />} />
            </Route>
        </Routes>
    );
}

export default App;
