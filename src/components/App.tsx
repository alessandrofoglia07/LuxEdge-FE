import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CartPage, CheckoutPage, DetailsPage, FavoritesPage, HomePage, LoginPage, ProductsPage, RegisterPage } from '../pages';

function App() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path='/login' element={<LoginPage />} />
                <Route path='/register' element={<RegisterPage />} />
                <Route path='/products' element={<ProductsPage />} />
                <Route path='/details/:product' element={<DetailsPage />} />
                <Route path='/cart' element={<CartPage />} />
                <Route path='/checkout' element={<CheckoutPage />} />
                <Route path='/favorites' element={<FavoritesPage />} />
            </Routes>
        </Router>
    );
}

export default App;
