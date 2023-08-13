import { Route, Routes } from 'react-router-dom';
import { CartPage, CheckoutPage, DetailsPage, FavoritesPage, HomePage, LoginPage, NotFoundPage, ProductsPage, RegisterPage } from '../pages';

function App() {
    return (
        <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/products' element={<ProductsPage />} />
            <Route path='/products/details/:product' element={<DetailsPage />} />
            <Route path='/cart' element={<CartPage />} />
            <Route path='/checkout' element={<CheckoutPage />} />
            <Route path='/favorites' element={<FavoritesPage />} />
            <Route path='/user/activate/:userId' element={<></>} />
            <Route path='/user/reset-password/:userId/:token' element={<></>} />
            <Route path='/user/unsubscribe/:userId' element={<></>} />
            <Route path='*' element={<NotFoundPage />} />
        </Routes>
    );
}

export default App;
